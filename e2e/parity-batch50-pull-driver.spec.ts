import {test,expect,type BrowserContext} from '@playwright/test';
async function record(context:BrowserContext,framework:string,kind:string){
 const page=await context.newPage();await page.clock.install();await page.goto(`/e2e/fixtures/parity-batch50-pull-driver.html?framework=${framework}`);await page.waitForFunction(()=>(window as any).ready);
 await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));
 await page.evaluate(kind=>{const api=window as any;api.set(75);if(kind==='hold'||kind==='retarget')api.spring(48,300,26,.75);if(kind==='snap'||kind==='set-during-return')api.spring(0,300,26,.7)},kind);
 const samples=[];let previous=0;
 for(const ms of [0,16,32,48,64,96,160,240,400,800,1600]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;
  if(ms===64&&kind==='retarget')await page.evaluate(()=>{(window as any).spring(0,260,28,.85)});
  if(ms===64&&kind==='set-during-return')await page.evaluate(()=>(window as any).set(40));
  samples.push({ms,...await page.evaluate(()=>(window as any).read())});
 }
 await page.evaluate(()=>(window as any).destroy());await page.close();return samples;
}
for(const kind of ['gesture','hold','snap','retarget','set-during-return'])test('pull translation engine '+kind,async({context})=>{
 const source=await record(context,'motion',kind),native=await record(context,'native',kind);
 await test.info().attach('paired-pull-driver',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let index=0;index<source.length;index++)for(const key of ['raw','smooth'])expect.soft(Math.abs(native[index][key]-source[index][key]),`${key} at ${source[index].ms}`).toBeLessThan(.015);
});

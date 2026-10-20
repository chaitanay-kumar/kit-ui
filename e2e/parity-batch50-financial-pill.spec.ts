import {test,expect,type BrowserContext} from '@playwright/test';
async function record(context:BrowserContext,framework:string,reduced:boolean,kind:string){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.addInitScript(()=>{delete (Element.prototype as any).animate});await page.clock.install();
 const initial={timeRanges:['1H','Long custom period','1D'],selectedTimeRange:'1D'};
 await page.goto(`/e2e/fixtures/parity-batch50-financial.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify(initial))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[role="tablist"]'));
 await page.evaluate(()=>Promise.all([document.fonts.load('600 13px Geist'),document.fonts.load('700 38px Geist')]));await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));
 await page.evaluate(kind=>(window as any).update(kind==='resize'?{timeRanges:['1H','1D']}:{selectedTimeRange:'Long custom period'}),kind);
 const samples=[];let previous=0;
 for(const ms of [0,16,32,64,96,160,240,400,800]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;
  if(ms===64&&kind==='reverse')await page.evaluate(()=>(window as any).update({selectedTimeRange:'1D'}));
  samples.push({ms,...await page.evaluate(()=>{const tabs=document.querySelector('[role="tablist"]')!,pill=tabs.querySelector('[aria-selected="true"]>div')!,origin=tabs.getBoundingClientRect(),rect=pill.getBoundingClientRect();return{box:[rect.x-origin.x,rect.y-origin.y,rect.width,rect.height],opacity:Number(getComputedStyle(pill).opacity)}})});
 }
 await page.close();return samples;
}
for(const reduced of [false,true])for(const kind of ['select','reverse','resize'])test(`financial pill ${kind} reduced=${reduced}`,async({context})=>{
 const source=await record(context,'react',reduced,kind),native=await record(context,'angular',reduced,kind);await test.info().attach('paired-financial-pill',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let index=0;index<source.length;index++){expect.soft(native[index].opacity,'opacity at '+source[index].ms).toBeCloseTo(source[index].opacity,2);source[index].box.forEach((value,axis)=>expect.soft(Math.abs(native[index].box[axis]-value),`box at ${source[index].ms}, axis ${axis}`).toBeLessThan(.3))}
});

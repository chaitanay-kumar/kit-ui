import {test,expect,type BrowserContext} from '@playwright/test';

async function record(context:BrowserContext,framework:string,reduced:boolean){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.clock.install();
 await page.goto(`/e2e/fixtures/parity-batch50-pull.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({pending:true,content:'Content'}))}`);
 await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label^="Pull to refresh panel"]'));await page.evaluate(()=>document.fonts.ready);
 await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));
 await page.evaluate(()=>{document.querySelector('[aria-label^="Pull to refresh panel"]')!.dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true}));(window as any).flush()});
 const samples=[];let previous=0;
 for(const ms of [16,32,64,128,240,400,640,800,1200,2000]){
  await page.clock.runFor(ms-previous);previous=ms;
  if(ms===400)await page.evaluate(async()=>{(window as any).pending[0].resolve();for(let index=0;index<5;index++)await Promise.resolve();(window as any).flush()});
  samples.push(await page.evaluate(()=>{
   const root=document.querySelector('[aria-label^="Pull to refresh panel"]')!;
   const body=[...root.children].find(node=>node.textContent==='Content')!;
   const transform=getComputedStyle(body).transform;
   return {y:transform==='none'?0:new DOMMatrixReadOnly(transform).m42,busy:root.getAttribute('aria-busy')};
  }));
 }
 await page.evaluate(()=>(window as any).unmount());await page.close();return samples;
}
for(const reduced of [false,true])test(`rendered pull hold and return reduced=${reduced}`,async({context})=>{
 const source=await record(context,'react',reduced),native=await record(context,'angular',reduced);
 await test.info().attach('paired-rendered-pull',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let index=0;index<source.length;index++){expect.soft(native[index].busy).toBe(source[index].busy);expect.soft(Math.abs(native[index].y-source[index].y),`sample ${index}`).toBeLessThan(.15)}
});

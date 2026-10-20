import {test,expect,type BrowserContext} from '@playwright/test';
async function record(context:BrowserContext,framework:string,kind:string,reduced:boolean){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.addInitScript(()=>{delete (Element.prototype as any).animate});await page.clock.install();
 await page.goto(`/e2e/fixtures/parity-batch50-financial.html?framework=${framework}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('svg.cursor-crosshair'));
 await page.evaluate(()=>Promise.all([document.fonts.load('400 14px Geist'),document.fonts.load('600 26px Geist'),document.fonts.load('700 38px Geist')]));await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));
 await page.evaluate(kind=>{const api=window as any;if(kind==='range')api.update({selectedTimeRange:'1H'});if(kind==='price')api.update({mainValue:'$20.50'});if(kind==='refresh')api.update({isRefreshing:true});if(kind==='scrub'){const rect=document.querySelector('svg.cursor-crosshair')!.getBoundingClientRect();api.moveChart(rect.x+1,rect.y+20)}},kind);
 const samples=[];let previous=0;
 for(const ms of [0,16,32,64,96,160,240,400,600,1000,1200]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;
  samples.push({ms,...await page.evaluate(()=>{
   const root=document.querySelector('[aria-label="Financial asset performance card"]')!,svg=root.querySelector('svg.cursor-crosshair')!,origin=svg.getBoundingClientRect(),area=svg.querySelector('path:not([stroke])')!,path=svg.querySelector('path[stroke]')!,change=root.firstElementChild!.lastElementChild!.firstElementChild!;
   const circles=[...svg.querySelectorAll('g>circle')].map(node=>{const style=getComputedStyle(node),matrix=new DOMMatrixReadOnly(style.transform),rect=node.getBoundingClientRect();return{opacity:Number(style.opacity),scale:matrix.a,box:[rect.x-origin.x,rect.y-origin.y,rect.width,rect.height]}});
   return{area:Number(getComputedStyle(area).opacity),path:Number(getComputedStyle(path).opacity),length:parseFloat(getComputedStyle(path).strokeDasharray),change:Number(getComputedStyle(change).opacity),circles};
  })});
 }
 await page.close();return samples;
}
for(const kind of ['range','price','scrub','refresh'])for(const reduced of [false,true])test(`financial ${kind} element motion reduced=${reduced}`,async({context})=>{
 const source=await record(context,'react',kind,reduced),native=await record(context,'angular',kind,reduced);await test.info().attach('paired-financial-element-motion',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let frame=0;frame<source.length;frame++){
  const a=source[frame],b=native[frame];for(const key of ['area','path','length','change'] as const)expect.soft(b[key],`${key} at ${a.ms}`).toBeCloseTo(a[key],2);
  expect.soft(b.circles.length,'circle count at '+a.ms).toBe(a.circles.length);
  if(a.circles.length!==b.circles.length)continue;
  for(let index=0;index<a.circles.length;index++){for(const key of ['opacity','scale'] as const)expect.soft(b.circles[index][key],`${key} circle ${index} at ${a.ms}`).toBeCloseTo(a.circles[index][key],2);a.circles[index].box.forEach((value:number,axis:number)=>expect.soft(Math.abs(b.circles[index].box[axis]-value),`box circle ${index} at ${a.ms}, axis ${axis}`).toBeLessThan(.15))}
 }
});

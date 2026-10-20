import {test,expect,type BrowserContext} from '@playwright/test';
async function record(context:BrowserContext,framework:string,next:string,reduced:boolean,reverse:boolean){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.addInitScript(()=>{delete (Element.prototype as any).animate});await page.clock.install();
 await page.goto(`/e2e/fixtures/parity-batch50-financial.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({mainValue:'$1,000.00'}))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('svg.cursor-crosshair'));
 await page.evaluate(()=>Promise.all([document.fonts.load('400 14px Geist'),document.fonts.load('600 26px Geist'),document.fonts.load('700 38px Geist')]));await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));
 await page.evaluate(mainValue=>(window as any).update({mainValue}),next);
 const samples=[];let previous=0;
 for(const ms of [0,16,32,64,96,160,192,240,400]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;
  if(reverse&&ms===64)await page.evaluate(()=>(window as any).update({mainValue:'$1,000.00'}));
  samples.push({ms,entries:await page.evaluate(()=>{
   const headline=document.querySelector('[aria-label="Financial asset performance card"]')!.firstElementChild!.firstElementChild!,origin=headline.getBoundingClientRect();
   return [...headline.children].map(node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect(),matrix=new DOMMatrixReadOnly(style.transform);return{text:node.textContent,opacity:Number(style.opacity),blur:Number(style.filter.match(/blur\(([^p]+)px\)/)?.[1]??0),y:matrix.m42,box:[rect.x-origin.x,rect.y-origin.y,rect.width,rect.height]}});
  })});
 }
 await page.close();return samples;
}
for(const next of ['$20.50','$10,200.25'])for(const reduced of [false,true])test(`financial price presence ${next} reduced=${reduced}`,async({context})=>{
 const source=await record(context,'react',next,reduced,false),native=await record(context,'angular',next,reduced,false);await compare(source,native);
});
test('financial price presence reverses at 64ms',async({context})=>{await compare(await record(context,'react','$20.50',false,true),await record(context,'angular','$20.50',false,true))});
async function compare(source:any[],native:any[]){
 await test.info().attach('paired-financial-price-presence',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let frame=0;frame<source.length;frame++){
  const a=source[frame],b=native[frame];expect.soft(b.entries.map((entry:any)=>entry.text),'retained prices at '+a.ms).toEqual(a.entries.map((entry:any)=>entry.text));
  if(a.entries.length!==b.entries.length)continue;
  for(let index=0;index<a.entries.length;index++){for(const key of ['opacity','blur','y'])expect.soft(b.entries[index][key],`${key} at ${a.ms}, entry ${index}`).toBeCloseTo(a.entries[index][key],2);a.entries[index].box.forEach((value:number,axis:number)=>expect.soft(Math.abs(b.entries[index].box[axis]-value),`box at ${a.ms}, entry ${index}, axis ${axis}`).toBeLessThan(.3))}
 }
}

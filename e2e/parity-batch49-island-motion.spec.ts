import {test,expect,type BrowserContext} from '@playwright/test';
async function record(context:BrowserContext,framework:string,from:string,to:string,reduced=false,interruption?:{at:number;state:string}){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
 // Drive Motion's JS backend explicitly: Playwright clocks do not advance
 // compositor animations. Ordinary behavior/layout specs retain native WAAPI.
 await page.addInitScript(()=>{delete (Element.prototype as any).animate});await page.clock.install();
 await page.goto(`/e2e/fixtures/parity-batch49-island.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({defaultState:from}))}`);
 await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label="Dynamic Island"]'));
 await page.evaluate(()=>Promise.all([document.fonts.load('400 14px Geist'),document.fonts.load('500 14px Geist'),document.fonts.load('600 14px Geist')]));
 await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));
 await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));
 await page.evaluate(next=>(window as any).update({state:next}),to);
 const samples=[];let previous=0;
 for(const ms of [0,16,32,64,96,160,240,400,800]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;
  if(interruption?.at===ms)await page.evaluate(next=>(window as any).update({state:next}),interruption.state);
  samples.push({ms,...await page.evaluate(()=>{const root=document.querySelector('[aria-label="Dynamic Island"]')!,panel=root.firstElementChild!,box=(node:Element)=>{const rect=node.getBoundingClientRect();return[rect.x,rect.y,rect.width,rect.height]};return{panel:box(panel),entries:[...panel.children].map(node=>({box:box(node),opacity:Number(getComputedStyle(node).opacity)})),avatars:[...root.querySelectorAll('[data-testid="dynamic-island-profile-icon"]')].map(node=>({box:box(node.parentElement!),opacity:Number(getComputedStyle(node.parentElement!).opacity)}))}})});
 }
 await page.close();return samples;
}
for(const[from,to]of[['collapsed','expanded'],['expanded','profile'],['profile','share'],['share','collapsed']])for(const reduced of [false,true])test(`island paired motion ${from} to ${to}, reduced=${reduced}`,async({context})=>{
 const source=await record(context,'react',from,to,reduced),native=await record(context,'angular',from,to,reduced);
 await test.info().attach('paired-island-motion',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let frame=0;frame<source.length;frame++){
  const a=source[frame],b=native[frame];
  // React's duration-zero commit exposes cached parent/child projection to a
  // synchronous pre-paint read. Compare every presented frame for reduced motion;
  // ordinary spring motion also retains its frame-zero continuity assertions.
  if(reduced&&a.ms===0)continue;
  if(reduced){expect(b.entries).toHaveLength(1);expect(b.entries[0].opacity).toBe(1);b.panel.forEach((value,axis)=>expect(value).toBeCloseTo(native.at(-1)!.panel[axis],3))}
  a.panel.forEach((value,axis)=>expect.soft(Math.abs(b.panel[axis]-value),`panel at ${a.ms}, axis ${axis}`).toBeLessThan(1));
  if(a.ms===800){expect(b.entries).toHaveLength(1);expect(b.entries[0].opacity).toBe(1)}
  expect.soft(b.entries.length,`retained entries at ${a.ms}`).toBe(a.entries.length);
  if(a.entries.length===b.entries.length)for(let index=0;index<a.entries.length;index++)expect.soft(b.entries[index].opacity,`content opacity ${index} at ${a.ms}`).toBeCloseTo(a.entries[index].opacity,2);
  expect.soft(b.avatars.length,`avatar count at ${a.ms}`).toBe(a.avatars.length);
  if(a.avatars.length===b.avatars.length)for(let index=0;index<a.avatars.length;index++){a.avatars[index].box.forEach((value,axis)=>expect.soft(Math.abs(b.avatars[index].box[axis]-value),`avatar ${index} at ${a.ms}, axis ${axis}`).toBeLessThan(1.2));expect.soft(b.avatars[index].opacity,`shared opacity ${index} at ${a.ms}`).toBeCloseTo(a.avatars[index].opacity,2)}
 }
});
for(const[from,to]of[['collapsed','expanded'],['expanded','profile'],['profile','share']])test(`island reverses ${from} to ${to} at 64ms`,async({context})=>{
 const interruption={at:64,state:from},source=await record(context,'react',from,to,false,interruption),native=await record(context,'angular',from,to,false,interruption);
 await test.info().attach('paired-island-reversal',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let frame=0;frame<source.length;frame++){
  const a=source[frame],b=native[frame];a.panel.forEach((value,axis)=>expect.soft(Math.abs(b.panel[axis]-value),`panel at ${a.ms}, axis ${axis}`).toBeLessThan(1));
  expect.soft(b.entries.length,`retained entries at ${a.ms}`).toBe(a.entries.length);
  if(a.entries.length===b.entries.length)for(let index=0;index<a.entries.length;index++)expect.soft(b.entries[index].opacity,`content ${index} at ${a.ms}`).toBeCloseTo(a.entries[index].opacity,2);
  expect.soft(b.avatars.length,`avatars at ${a.ms}`).toBe(a.avatars.length);
  if(a.avatars.length===b.avatars.length)for(let index=0;index<a.avatars.length;index++){a.avatars[index].box.forEach((value,axis)=>expect.soft(Math.abs(b.avatars[index].box[axis]-value),`avatar ${index} at ${a.ms}, axis ${axis}`).toBeLessThan(1.2));expect.soft(b.avatars[index].opacity,`shared opacity ${index} at ${a.ms}`).toBeCloseTo(a.avatars[index].opacity,2)}
 }
 expect(native.at(-1)!.entries).toHaveLength(1);
});

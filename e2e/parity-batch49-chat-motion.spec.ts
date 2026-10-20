import {test,expect,type BrowserContext} from '@playwright/test';

async function record(context:BrowserContext,framework:string,kind:'entry'|'press'|'attachments',reduced:boolean,reverse=false){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
 // Exercise Motion's JavaScript backend; browser clocks cannot advance WAAPI.
 await page.addInitScript(()=>{delete (Element.prototype as any).animate});await page.clock.install();
 await page.goto(`/e2e/fixtures/parity-batch49-chat.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({callbacks:true}))}`);
 await page.waitForFunction(()=>(window as any).ready&&document.querySelector('textarea'));
 await page.evaluate(()=>Promise.all([document.fonts.load('400 14px Geist'),document.fonts.load('500 14px Geist'),document.fonts.load('600 14px Geist')]));
 await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));
 const attach=()=>page.locator('input[type=file]').setInputFiles({name:'motion.txt',mimeType:'text/plain',buffer:Buffer.from('motion')});
 if(kind==='entry')await page.evaluate(()=>(window as any).update({messages:[{id:'new',role:'assistant',content:'Animated message'}]}));
 if(kind==='press')await page.getByRole('button',{name:'Clear chat history',exact:true}).dispatchEvent('pointerdown',{pointerType:'mouse',button:0,isPrimary:true,pointerId:1});
 if(kind==='attachments'){await attach();await page.evaluate(()=>(window as any).flush())}
 const samples=[];let previous=0;
 for(const ms of [0,16,32,64,96,160,240,400,800]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;
  if(reverse&&ms===64){
   if(kind==='press')await page.evaluate(()=>window.dispatchEvent(new PointerEvent('pointerup',{pointerType:'mouse',button:0,isPrimary:true,pointerId:1})));
   if(kind==='attachments'){await page.locator('span').filter({hasText:/^motion\.txt$/}).locator('..').getByRole('button').click();await page.evaluate(()=>(window as any).flush())}
  }
  samples.push({ms,...await page.evaluate(kind=>{
   const copy=document.querySelector('button[title="Copy message"]'),file=Array.from(document.querySelectorAll('span')).find(node=>node.textContent==='motion.txt');
   const node=kind==='entry'?copy?.parentElement?.parentElement?.parentElement:kind==='press'?document.querySelector('[aria-label="Clear chat history"]'):file?.parentElement?.parentElement;
   if(!node)return{present:false};const style=getComputedStyle(node),matrix=new DOMMatrixReadOnly(style.transform);
   return{present:true,opacity:Number(style.opacity),height:node.getBoundingClientRect().height,y:matrix.m42,scale:matrix.a};
  },kind)});
 }
 await page.close();return samples;
}
for(const kind of ['entry','press','attachments'] as const)for(const reduced of [false,true])for(const reverse of kind==='entry'?[false]:[false,true]){
 test(`Chat paired ${kind} motion reduced=${reduced} reverse=${reverse}`,async({context})=>{
  const source=await record(context,'react',kind,reduced,reverse),native=await record(context,'angular',kind,reduced,reverse);
  await test.info().attach('paired-chat-motion',{body:JSON.stringify({source,native}),contentType:'application/json'});
  for(let index=0;index<source.length;index++){
   const a=source[index],b=native[index];
   expect.soft(b.present,`presence at ${a.ms}`).toBe(a.present);
   if(!a.present||!b.present)continue;
   expect.soft(b.opacity,`opacity at ${a.ms}`).toBeCloseTo(a.opacity!,2);
   expect.soft(Math.abs(b.y!-a.y!),`translation at ${a.ms}`).toBeLessThan(.15);
   expect.soft(b.scale,`scale at ${a.ms}`).toBeCloseTo(a.scale!,3);
   expect.soft(Math.abs(b.height!-a.height!),`height at ${a.ms}`).toBeLessThan(.8);
  }
 });
}

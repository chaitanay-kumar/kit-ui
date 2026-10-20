import {test,expect,type BrowserContext} from '@playwright/test';
async function prepare(context:BrowserContext,framework:string,reduced:boolean){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.clock.install();const initial={custom:true,content:'Answer',sources:[{id:1,title:'First source',snippet:'Details'},{id:2,title:'Second source'}],toolCount:2,tools:[{name:'Search',duration:'12ms'},{name:'Read',duration:'6ms'}]};
 await page.goto(`/e2e/fixtures/parity-ai-response-motion.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify(initial))}`);await page.waitForFunction(()=>(window as any).ready);await page.evaluate(()=>document.fonts.ready);await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));return page;
}
async function presence(context:BrowserContext,framework:string,reduced:boolean,kind:string,reverse:boolean){
 const page=await prepare(context,framework,reduced),name=kind==='sources'?'Cited Sources (2)':'Used 2 tools';
 const click=async()=>{await page.getByRole('button',{name,exact:true}).evaluate(node=>{(node as HTMLElement).click();(window as any).flush()})};await click();let previous=0;const samples=[];
 for(const ms of [0,16,32,64,96,160,240,400,480,640,800,1200,1600]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;if(reverse&&(ms===64||ms===160)||ms===400)await click();
  if(ms===400)await page.evaluate(()=>{(window as any).update({tools:[{name:'Replacement'}],sources:[{id:3,title:'Replacement'}]})});
  samples.push(await page.getByRole('button',{name:ms>=400?(kind==='sources'?'Cited Sources (1)':name):name,exact:true}).evaluate(node=>{const panel=node.nextElementSibling;if(!panel)return null;const style=getComputedStyle(panel);return{height:panel.getBoundingClientRect().height,opacity:Number(style.opacity),text:panel.textContent?.replace(/\s+/g,' ').trim()}}));
 }
 await page.evaluate(()=>(window as any).unmount());await page.close();return samples;
}
for(const reduced of [false,true])for(const kind of ['sources','tools'])for(const reverse of [false,true])test(`AI response ${kind} presence reverse=${reverse} reduced=${reduced}`,async({context})=>{
 const source=await presence(context,'react',reduced,kind,reverse),native=await presence(context,'angular',reduced,kind,reverse);await test.info().attach('paired-presence',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let index=0;index<source.length;index++){if(source[index]===null){expect.soft(native[index],`removed ${index}`).toBeNull();continue}expect(native[index],`retained ${index}`).not.toBeNull();expect.soft(native[index]!.text).toBe(source[index]!.text);expect.soft(Math.abs(native[index]!.height-source[index]!.height),`height ${index}`).toBeLessThan(.15);expect.soft(Math.abs(native[index]!.opacity-source[index]!.opacity),`opacity ${index}`).toBeLessThan(.002)}
});
async function press(context:BrowserContext,framework:string,reduced:boolean,name:string,keyboard:boolean){
 const page=await prepare(context,framework,reduced),locator=page.getByRole('button',{name,exact:true});await locator.focus();const button=(await locator.elementHandle())!;await button.evaluate((node,keyboard)=>node.dispatchEvent(keyboard?new KeyboardEvent('keydown',{key:'Enter',bubbles:true}):new PointerEvent('pointerdown',{bubbles:true,pointerId:1,pointerType:'mouse',button:0,isPrimary:true})),keyboard);const samples=[];let previous=0;
 for(const ms of [16,32,64,96,160,240,400,800]){await page.clock.runFor(ms-previous);previous=ms;if(ms===96)await button.evaluate((node,keyboard)=>node.dispatchEvent(keyboard?new KeyboardEvent('keyup',{key:'Enter',bubbles:true}):new PointerEvent('pointerup',{bubbles:true,pointerId:1,pointerType:'mouse',button:0,isPrimary:true})),keyboard);samples.push(await button.evaluate(node=>{const transform=getComputedStyle(node).transform;return transform==='none'?1:new DOMMatrixReadOnly(transform).m11}))}
 await page.evaluate(()=>(window as any).unmount());await page.close();return samples;
}
for(const reduced of [false,true])for(const keyboard of [false,true])for(const name of ['Copy response','Good response','Used 2 tools'])test(`AI response press ${name} keyboard=${keyboard} reduced=${reduced}`,async({context})=>{
 const source=await press(context,'react',reduced,name,keyboard),native=await press(context,'angular',reduced,name,keyboard);await test.info().attach('paired-press',{body:JSON.stringify({source,native}),contentType:'application/json'});for(let index=0;index<source.length;index++)expect.soft(Math.abs(native[index]-source[index]),`scale ${index}`).toBeLessThan(.0002);
});

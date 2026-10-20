import {test,expect,type BrowserContext} from '@playwright/test';
async function record(context:BrowserContext,framework:string,theme:string,direction:string){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:'no-preference'});await page.addInitScript(()=>{
  const api=window as any;api.canvasFrames=[];let state=1,frameIndex=0,gradient=0,buffer:any[]=[];Math.random=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296};
  const contexts=new WeakMap(),original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(kind:any,...args:any[]):any{
   if(kind!=='2d')return(original as any).call(this,kind,...args);if(contexts.has(this))return contexts.get(this);
   const context=new Proxy({}, {get:(_,name)=>{
    if(name==='clearRect')return(...args:any[])=>{buffer=[];api.canvasFrames.push(buffer);state=(++frameIndex*1664525+42)>>>0;gradient=0;buffer.push(['clearRect',...args])};
    if(name==='createLinearGradient'||name==='createRadialGradient')return(...args:any[])=>{const id=++gradient;buffer.push([name,...args,id]);return{gradient:id,addColorStop:(...args:any[])=>buffer.push(['colorStop',id,...args])}};
    return(...args:any[])=>buffer.push([name,...args]);
   },set:(_,name,value)=>{buffer.push(['set',name,value&&typeof value==='object'&&'gradient' in value?{gradient:value.gradient}:value]);return true}});contexts.set(this,context);return context;
  } as any;
 });await page.clock.install();
 await page.goto(`/e2e/fixtures/parity-batch50-car.html?framework=${framework}&theme=${theme}&initial=${encodeURIComponent(JSON.stringify({direction,carDuration:400,smokeDensity:'low'}))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label="Trigger Ferrari drift page transition"]'));await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));await page.evaluate(()=>(window as any).trigger());await page.clock.runFor(512);const result=await page.evaluate(()=>(window as any).canvasFrames);await page.close();return result;
}
for(const theme of ['light','dark'])for(const direction of ['left-to-right','right-to-left'])test(`car integrated canvas ${theme} ${direction}`,async({context})=>{
 const source=await record(context,'react',theme,direction),native=await record(context,'angular',theme,direction);await test.info().attach('paired-integrated-car-canvas',{body:JSON.stringify({source,native}),contentType:'application/json'});expect(source.length).toBeGreaterThan(20);expect(native.length).toBe(source.length);for(let frame=0;frame<source.length;frame++)expect.soft(native[frame],'exact canvas operations at frame '+frame).toEqual(source[frame]);
});

import {test,expect,type BrowserContext} from '@playwright/test';
async function record(context:BrowserContext,framework:string,direction:string){
 const page=await context.newPage();await page.emulateMedia({reducedMotion:'no-preference'});await page.addInitScript(()=>{delete (Element.prototype as any).animate});await page.clock.install();
 await page.goto(`/e2e/fixtures/parity-batch50-car.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({direction,smokeDensity:'off'}))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label="Trigger Ferrari drift page transition"]'));await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16));await page.evaluate(()=>(window as any).trigger());
 const samples=[];let previous=0;
 for(const ms of [0,16,32,64,160,400,800,1008,1408,2000,2400]){
  if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;
  samples.push({ms,...await page.evaluate(()=>{const canvas=document.querySelector('canvas'),car=canvas?.parentElement?.children[1],backdrop=canvas?.parentElement?.children[2];if(!canvas||!car||!backdrop)return{present:false,calls:(window as any).calls};const rect=car.getBoundingClientRect();return{present:true,box:[rect.x,rect.y,rect.width,rect.height],opacity:Number(getComputedStyle(backdrop).opacity),canvas:[(canvas as HTMLCanvasElement).width,(canvas as HTMLCanvasElement).height],wheels:[...car.querySelectorAll('g')].filter(node=>node.style.transformOrigin).map(node=>({matrix:getComputedStyle(node).transform,origin:getComputedStyle(node).transformOrigin})),calls:(window as any).calls}})});
 }
 await page.close();return samples;
}
for(const direction of ['left-to-right','right-to-left'])test('car rendered choreography '+direction,async({context})=>{
 const source=await record(context,'react',direction),native=await record(context,'angular',direction);await test.info().attach('paired-car-motion',{body:JSON.stringify({source,native}),contentType:'application/json'});
 for(let index=0;index<source.length;index++){
  const a=source[index],b=native[index];expect.soft(b.present,'presence at '+a.ms).toBe(a.present);expect.soft(b.calls,'callbacks at '+a.ms).toEqual(a.calls);if(!a.present||!b.present)continue;expect.soft(b.canvas).toEqual(a.canvas);expect.soft(b.opacity,'opacity at '+a.ms).toBeCloseTo(a.opacity!,2);a.box!.forEach((value,axis)=>expect.soft(Math.abs(b.box![axis]-value),`car box at ${a.ms}, axis ${axis}`).toBeLessThan(.15));expect.soft(b.wheels).toEqual(a.wheels);
 }
});

import {test,expect,type Page} from '@playwright/test';
async function open(page:Page,framework:string,reduced:boolean,initial:object={}){await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.clock.install();await page.goto(`/e2e/fixtures/parity-batch50-car.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify(initial))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label="Trigger Ferrari drift page transition"]'));await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.clock.runFor(await page.evaluate(()=>16-performance.now()%16))}
for(const framework of ['react','angular'])for(const reduced of [false,true]){
 test(`${framework}: car completion, duplicate guard and reset reduced=${reduced}`,async({page})=>{
  await open(page,framework,reduced,{carDuration:800,carDelay:50,pageTransitionDelay:100,pageTransitionDuration:120,resetDelay:60,smokeDensity:'off'});
  await page.evaluate(()=>{(window as any).trigger();(window as any).trigger()});await expect(page.locator('canvas')).toHaveCount(1);
  const completion=reduced?120:250;await page.clock.runFor(completion-1);expect(await page.evaluate(()=>(window as any).calls)).toEqual([]);await page.clock.runFor(1);expect(await page.evaluate(()=>(window as any).calls)).toEqual([{unbound:true}]);await page.clock.runFor(600);await expect(page.locator('canvas')).toHaveCount(0);
  await page.evaluate(()=>(window as any).trigger());await page.clock.runFor(completion+600);expect(await page.evaluate(()=>(window as any).calls.length)).toBe(2);await expect(page.locator('canvas')).toHaveCount(0);expect(await page.evaluate(()=>(window as any).errors)).toEqual([]);
 });
 test(`${framework}: car completion failure retains source recovery behavior reduced=${reduced}`,async({page})=>{
  await open(page,framework,reduced,{throwComplete:true,smokeDensity:'off'});await page.evaluate(()=>(window as any).trigger());
  if(framework==='react'){
   // ClockController surfaces timer exceptions directly, rather than dispatching
   // a browser error event. Assert that error before advancing the remaining time.
   const completion=reduced?400:1000;await expect(page.clock.runFor(completion)).rejects.toThrow('completion failed');await page.clock.runFor(3000-completion);
  }else{await page.clock.runFor(3000);expect(await page.evaluate(()=>(window as any).errors)).toEqual(['completion failed'])}
  expect(await page.evaluate(()=>(window as any).calls.length)).toBe(1);await expect(page.locator('canvas')).toHaveCount(reduced?1:0);await page.evaluate(()=>(window as any).unmount());await page.clock.runFor(1000);await expect(page.locator('canvas')).toHaveCount(0);expect(await page.evaluate(()=>(window as any).calls.length)).toBe(1);
 });
}

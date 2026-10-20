import {test,expect} from '@playwright/test';

for(const theme of ['light','dark'])for(const state of ['collapsed','profile']){
 test(`island caller classes preserve defaults: ${theme} ${state}`,async({page})=>{
  const samples=[];
  for(const framework of ['react','angular']){
   const initial={defaultState:state,className:'rounded-lg bg-black p-4'};
   await page.goto(`/e2e/fixtures/parity-batch49-island.html?framework=${framework}&theme=${theme}&initial=${encodeURIComponent(JSON.stringify(initial))}`);
   await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label="Dynamic Island"]'));
   await page.evaluate(()=>document.fonts.ready);
   samples.push(await page.evaluate(()=>{
    const panel=document.querySelector('[aria-label="Dynamic Island"]')!.querySelector('div')!,style=getComputedStyle(panel),rect=panel.getBoundingClientRect();
    return {size:[rect.width,rect.height],styles:Object.fromEntries(['borderRadius','backgroundColor','paddingTop','paddingRight','paddingBottom','paddingLeft','display','gap'].map(key=>[key,(style as any)[key]]))};
   }));
  }
  await test.info().attach('paired-caller-classes',{body:JSON.stringify(samples),contentType:'application/json'});
  expect(samples[1].styles).toEqual(samples[0].styles);
  samples[0].size.forEach((value,index)=>expect(Math.abs(samples[1].size[index]-value)).toBeLessThan(.8));
 });
}

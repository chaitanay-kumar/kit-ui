import {test,expect} from '@playwright/test';
for(const theme of ['light','dark'])for(const direction of ['left-to-right','right-to-left'])test(`car complete SVG ${theme} ${direction}`,async({page})=>{
 const samples=[];
 for(const framework of ['react','angular']){
  await page.emulateMedia({reducedMotion:'no-preference'});await page.clock.install();await page.goto(`/e2e/fixtures/parity-batch50-car.html?framework=${framework}&theme=${theme}&initial=${encodeURIComponent(JSON.stringify({direction,smokeDensity:'off'}))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label="Trigger Ferrari drift page transition"]'));await page.evaluate(()=>document.fonts.ready);await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));await page.evaluate(()=>(window as any).trigger());
  samples.push(await page.evaluate(()=>{const svg=document.querySelector('canvas')!.parentElement!.children[1].querySelector('svg')!;return[svg,...svg.querySelectorAll('*')].map(node=>{const style=getComputedStyle(node);return{tag:node.localName,attributes:Object.fromEntries([...node.attributes].filter(attribute=>!['class','style','data-car-axis'].includes(attribute.name)).map(attribute=>[attribute.name,attribute.value.replace(/\s+/g,' ').trim()])),styles:Object.fromEntries(['fill','stroke','strokeWidth','strokeLinecap','strokeLinejoin','opacity','filter','overflow','scale'].map(key=>[key,(style as any)[key]]))}})}));
  await page.clock.resume();
 }
 await test.info().attach('paired-complete-car-svg',{body:JSON.stringify(samples),contentType:'application/json'});expect(samples[1]).toEqual(samples[0]);
});

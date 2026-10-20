import {test,expect} from '@playwright/test';
const cases=[{}, {content:'Custom pull content'}, {showDefaultIndicator:false}, {className:'p-8 rounded-lg bg-black',disabled:true}];
for(const theme of ['light','dark'])for(const initial of cases)test('pull resting layout '+theme+' '+JSON.stringify(initial),async({page})=>{
 const samples=[];
 for(const framework of ['react','angular']){
  await page.goto(`/e2e/fixtures/parity-batch50-pull.html?framework=${framework}&theme=${theme}&initial=${encodeURIComponent(JSON.stringify(initial))}`);
  await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label^="Pull to refresh panel"]'));await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
  samples.push(await page.evaluate(()=>{
   const root=document.querySelector('[aria-label^="Pull to refresh panel"]')!,origin=root.getBoundingClientRect();
   return[root,...root.querySelectorAll('*')].filter(node=>!node.localName.includes('-')).map(node=>{const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return{tag:node.tagName.toLowerCase(),rect:[rect.x-origin.x,rect.y-origin.y,rect.width,rect.height],styles:Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderTopColor','borderTopWidth','borderRadius','paddingTop','paddingLeft','marginTop','marginBottom','display','gap','boxShadow','overflow','stroke','strokeWidth','fill','opacity','touchAction','cursor'].map(key=>[key,(style as any)[key]]))}});
  }));
 }
 await test.info().attach('paired-pull-resting-layout',{body:JSON.stringify(samples),contentType:'application/json'});
 expect(samples[1].map(node=>node.tag)).toEqual(samples[0].map(node=>node.tag));
 const normalize=(styles:Record<string,string>)=>Object.fromEntries(Object.entries(styles).map(([key,value])=>[key,value.replace(/url\([^)]*\)/g,'url(instance-gradient)')]));
 for(let index=0;index<samples[0].length;index++){
  expect.soft(normalize(samples[1][index].styles),'styles '+index).toEqual(normalize(samples[0][index].styles));
  samples[0][index].rect.forEach((value,axis)=>expect.soft(Math.abs(samples[1][index].rect[axis]-value),'rect '+index+' '+axis).toBeLessThan(.8));
 }
});

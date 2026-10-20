import {test,expect} from '@playwright/test';
const cases=[{}, {showActions:true}, {mainValue:'$8,100.25',change:'-18 · -0.2%',context:'Custom context',showMetrics:false}, {className:'p-8 rounded-lg bg-black',timeRanges:['Unknown'],selectedTimeRange:'Unknown'}];
for(const theme of ['light','dark'])for(const initial of cases)test('financial resting layout '+theme+' '+JSON.stringify(initial),async({page})=>{
 const samples=[];
 for(const framework of ['react','angular']){
  await page.goto(`/e2e/fixtures/parity-batch50-financial.html?framework=${framework}&theme=${theme}&initial=${encodeURIComponent(JSON.stringify(initial))}`);
  await page.waitForFunction(()=>(window as any).ready&&document.querySelector('svg.cursor-crosshair'));await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
  samples.push(await page.evaluate(()=>{
   const root=document.querySelector('[aria-label="Financial asset performance card"]')!,origin=root.getBoundingClientRect();
   return[root,...root.querySelectorAll('*')].map(node=>{const rect=node.getBoundingClientRect(),style=getComputedStyle(node);return{tag:node.tagName.toLowerCase(),rect:[rect.x-origin.x,rect.y-origin.y,rect.width,rect.height],styles:Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderTopColor','borderTopWidth','borderRadius','paddingTop','paddingLeft','marginTop','marginBottom','display','gap','boxShadow','overflow','stroke','strokeWidth','fill'].map(key=>[key,(style as any)[key]]))}});
  }));
 }
 await test.info().attach('paired-financial-resting-layout',{body:JSON.stringify(samples),contentType:'application/json'});
 expect(samples[1].map(node=>node.tag)).toEqual(samples[0].map(node=>node.tag));
 for(let index=0;index<samples[0].length;index++){
  // Gradient IDs are framework-generated instance identifiers; compare their use.
  const normalize=(styles:Record<string,string>)=>Object.fromEntries(Object.entries(styles).map(([key,value])=>[key,value.replace(/url\([^)]*\)/g,'url(instance-gradient)')]));
  expect.soft(normalize(samples[1][index].styles),'styles '+index).toEqual(normalize(samples[0][index].styles));
  samples[0][index].rect.forEach((value,axis)=>expect.soft(Math.abs(samples[1][index].rect[axis]-value),'rect '+index+' '+axis).toBeLessThan(.8));
 }
});

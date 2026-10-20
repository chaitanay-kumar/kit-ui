import {test,expect,type Page} from '@playwright/test';
const data={value:1000,displayValue:'$1,000.00',change:'−10 · −1.0%',context:'Custom period',points:[0,10,20],timestamps:['Start','Middle','End']};
async function open(page:Page,framework:string,initial:object={}){await page.goto(`/e2e/fixtures/parity-batch50-financial.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify(initial))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('svg.cursor-crosshair'));await page.evaluate(()=>document.fonts.ready)}
for(const framework of ['react','angular']){
 test(framework+': financial root restores default attributes after overrides are removed',async({page})=>{
  await open(page,framework,{attributes:{role:'group','aria-label':'Custom asset','data-owner':'caller'},style:{opacity:.8}});const root=page.getByRole('group',{name:'Custom asset',exact:true});await expect(root).toHaveAttribute('data-owner','caller');await expect(root).toHaveCSS('opacity','0.8');await page.evaluate(()=>(window as any).update({attributes:undefined,style:undefined}));await expect(page.getByRole('region',{name:'Financial asset performance card',exact:true})).not.toHaveAttribute('data-owner');await expect(page.getByRole('region',{name:'Financial asset performance card',exact:true})).toHaveCSS('opacity','1');
 });
 test(framework+': financial ranges preserve controlled and internal ownership',async({page})=>{
  await open(page,framework,{callbacks:true});await expect(page.getByRole('tab',{name:'1D',exact:true})).toHaveAttribute('aria-selected','true');
  await page.getByRole('tab',{name:'1H',exact:true}).click();await expect(page.getByRole('tab',{name:'1H',exact:true})).toHaveAttribute('aria-selected','true');
  await page.evaluate(()=>(window as any).update({selectedTimeRange:'4H'}));await page.getByRole('tab',{name:'1D',exact:true}).click();await expect(page.getByRole('tab',{name:'4H',exact:true})).toHaveAttribute('aria-selected','true');
  await page.evaluate(()=>(window as any).update({selectedTimeRange:undefined}));await expect(page.getByRole('tab',{name:'1H',exact:true})).toHaveAttribute('aria-selected','true');
  expect(await page.evaluate(()=>(window as any).events)).toEqual([{type:'Range',args:['1H'],unbound:true},{type:'Range',args:['1D'],unbound:true}]);
 });
 test(framework+': financial scrubbing, custom metrics and actions follow source',async({page})=>{
  await open(page,framework,{callbacks:true,showActions:true,timeRanges:['Custom'],selectedTimeRange:'Custom',dataMap:{Custom:data}});
  await expect(page.getByText('24h High',{exact:true})).toBeVisible();await expect(page.getByText('$59,140.00',{exact:true})).toBeVisible();await expect(page.getByText('−10 · −1.0%',{exact:true})).toHaveCSS('color','rgb(239, 68, 68)');
  const chart=page.locator('svg.cursor-crosshair'),box=(await chart.boundingBox())!;await page.mouse.move(box.x+1,box.y+20);
  await expect(page.getByText('$980',{exact:true})).toBeVisible();await expect(page.getByText('Start',{exact:true})).toBeVisible();await page.mouse.move(0,0);await expect(page.getByText('Custom period',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Deposit',exact:true}).click();await page.getByRole('button',{name:'Transfer',exact:true}).click();expect(await page.evaluate(()=>(window as any).events)).toEqual([{type:'Action',args:['deposit'],unbound:true},{type:'Action',args:['withdraw'],unbound:true}]);
  await page.evaluate(()=>(window as any).update({showMetrics:false,showActions:false}));await expect(page.getByText('24h High',{exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Deposit',exact:true})).toHaveCount(0);
 });
 test(framework+': financial callback failure preserves selected range',async({page})=>{
  await open(page,framework,{callbacks:true,throwRange:true});await page.getByRole('tab',{name:'1H',exact:true}).click();await expect(page.getByRole('tab',{name:'1H',exact:true})).toHaveAttribute('aria-selected','true');await expect.poll(()=>page.evaluate(()=>(window as any).errors)).toEqual(['Range failed']);
 });
}

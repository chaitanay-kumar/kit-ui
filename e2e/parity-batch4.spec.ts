import {test,expect,type Page} from '@playwright/test';
const errors=new WeakMap<Page,string[]>();
test.beforeEach(({page})=>{const list:string[]=[];errors.set(page,list);page.on('pageerror',e=>list.push(e.message));});
test.afterEach(({page})=>expect(errors.get(page)).toEqual([]));
async function consumer(page:Page,framework:string,kind:string,initial:Record<string,unknown>={},theme='light'){
 await page.route('**/batch4-contract.html*',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script type="module">import RefreshRuntime from "/@react-refresh";RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/parity-batch4-contract.tsx"></script></body></html>'}));
 await page.goto(`/batch4-contract.html?framework=${framework}&kind=${kind}&theme=${theme}&initial=${encodeURIComponent(JSON.stringify(initial))}`);await expect(page.locator('#fixture')).toBeVisible();await page.waitForFunction(()=>typeof (window as any).setBatchOptions==='function');await page.evaluate(()=>document.fonts.ready);
}
async function update(page:Page,options:Record<string,unknown>){await page.evaluate(options=>(window as any).setBatchOptions(options),options);}
const number=(page:Page)=>page.locator('#fixture [aria-label]');
async function digits(page:Page){return number(page).evaluate(root=>Array.from(root.querySelectorAll<HTMLElement>('.k-an-column, .inline-block.relative.overflow-hidden')).map(column=>{const track=column.firstElementChild!,cell=track.firstElementChild!;return Math.round((column.getBoundingClientRect().top-track.getBoundingClientRect().top)/cell.getBoundingClientRect().height*100)/100;}));}
async function geometry(page:Page,selector:string){return page.locator(selector).first().evaluate(node=>{const style=getComputedStyle(node),rect=node.getBoundingClientRect();return {width:Math.round(rect.width*10)/10,height:Math.round(rect.height*10)/10,font:style.fontFamily,fontSize:style.fontSize,color:style.color,background:style.backgroundColor,padding:style.padding,border:parseFloat(style.borderWidth)===0?'0px':style.border,borderRadius:style.borderRadius,letterSpacing:style.letterSpacing};});}

for(const framework of ['react','angular']){
 test(`${framework}: number formatting and independently settled digits`,async({page})=>{
  await consumer(page,framework,'number',{value:12450,prefix:'$'});await expect(number(page)).toHaveAttribute('aria-label','$12,450');await expect.poll(()=>digits(page)).toEqual([1,2,4,5,0]);
  for(const [options,label,expected] of [[{value:-1234.56,decimals:2,prefix:'$',suffix:' USD'},'$-1,234.56 USD',[1,2,3,4,5,6]],[{value:1234567,compact:true,decimals:1,prefix:'~'},'~1.2M',[1,2]],[{value:9876,useGrouping:false},'9876',[9,8,7,6]],[{value:0},'0',[0]],[{value:-.25,decimals:2},'-0.25',[0,2,5]]] as const){await update(page,options);await expect(number(page)).toHaveAttribute('aria-label',label);await expect.poll(()=>digits(page)).toEqual(expected);}
 });
 test(`${framework}: number spring controls, interruption and disposal`,async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await consumer(page,framework,'number',{value:11});await update(page,{value:99,stiffness:70,damping:18,mass:1});
  await expect(number(page)).toHaveAttribute('aria-label','99');await expect.poll(async()=>{const d=await digits(page);return d[0]>1&&d[0]<9;}).toBe(true);
  await update(page,{value:22});await expect.poll(()=>digits(page)).toEqual([2,2]);
  await update(page,{value:88,stiffness:400,damping:8,mass:1});await expect.poll(()=>digits(page),{timeout:8000}).toEqual([8,8]);
  await update(page,{value:11,stiffness:100,damping:20,mass:1});await expect.poll(()=>digits(page)).toEqual([1,1]);
  await page.evaluate(()=>(window as any).destroyBatch());await expect(number(page)).toHaveCount(0);
 });
 test(`${framework}: accordion initial state, keyboard and single/multiple transitions`,async({page})=>{
  await consumer(page,framework,'unfold',{defaultOpen:['one']});const first=page.getByRole('button',{name:'First section Summary'}),second=page.getByRole('button',{name:'Second section'});
  await expect(first).toHaveAttribute('aria-expanded','true');await expect(second).toHaveAttribute('aria-expanded','false');await second.focus();await second.press('Space');await expect(second).toHaveAttribute('aria-expanded','true');await expect(first).toHaveAttribute('aria-expanded','false');await expect(page.getByText('Second paragraph.')).toBeVisible();
  await update(page,{allowMultiple:true,defaultOpen:['one']});await expect(first).toHaveAttribute('aria-expanded','false');await first.press('Enter');await expect(first).toHaveAttribute('aria-expanded','true');await expect(second).toHaveAttribute('aria-expanded','true');
  expect(await page.evaluate(()=>(window as any).batchEvents)).toEqual([]);
  await update(page,{allowMultiple:false});await first.click();await expect(first).toHaveAttribute('aria-expanded','false');await expect(second).toHaveAttribute('aria-expanded','false');
 });
 test(`${framework}: accordion rich content, updates, empty items and repeated IDs`,async({page})=>{
  await consumer(page,framework,'unfold',{rich:true,defaultOpen:['rich']});await page.getByRole('button',{name:'Nested action'}).click();expect(await page.evaluate(()=>(window as any).batchEvents)).toEqual(['rich']);
  await update(page,{items:[{id:'rich',title:'Updated title',content:'Updated body'}]});await expect(page.getByRole('button',{name:'Updated title'})).toHaveAttribute('aria-expanded','true');await expect(page.getByText('Updated body')).toBeVisible();
  await update(page,{items:[]});await expect(page.locator('#fixture button')).toHaveCount(0);await update(page,{items:[{id:'rich',title:'Restored title',content:0}]});await expect(page.getByRole('button',{name:'Restored title'})).toHaveAttribute('aria-expanded','true');await expect(page.locator('#fixture')).toContainText('0');
 });
 test(`${framework}: accordion interrupted exit and unmount are safe`,async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await consumer(page,framework,'unfold');const first=page.getByRole('button',{name:'First section Summary'});await first.click();await expect(page.getByText('First paragraph',{exact:false})).toBeVisible();await first.click();await first.click();await expect(first).toHaveAttribute('aria-expanded','true');await expect(page.getByText('First paragraph',{exact:false})).toBeVisible();await page.evaluate(()=>(window as any).destroyBatch());await expect(page.locator('#fixture')).toHaveCount(0);
 });
}
for(const theme of ['light','dark']){
 test(`${theme}: number rendered geometry and digit tracks match`,async({page},info)=>{
  const samples=[];for(const framework of ['react','angular']){await consumer(page,framework,'number',{value:-1234.5,decimals:1,prefix:'$',suffix:'%'},theme);await expect.poll(()=>digits(page)).toEqual([1,2,3,4,5]);samples.push(await geometry(page,'#fixture [aria-label]'));await number(page).screenshot({path:info.outputPath(`number-${framework}-${theme}.png`)});}expect(samples[1]).toEqual(samples[0]);
 });
 test(`${theme}: accordion settled geometry and token colors match`,async({page},info)=>{
  const samples=[];for(const framework of ['react','angular']){await consumer(page,framework,'unfold',{defaultOpen:['one']},theme);await expect(page.getByText('First paragraph',{exact:false})).toBeVisible();await expect.poll(()=>page.getByRole('button',{name:'First section Summary'}).evaluate(node=>{const outer=node.parentElement!;return Math.round(outer.getBoundingClientRect().height);})).toBeGreaterThan(70);samples.push({root:await geometry(page,'#fixture > div, #fixture .k-uf-root'),trigger:await geometry(page,'#fixture button:first-of-type')});await page.locator('#fixture').screenshot({path:info.outputPath(`unfold-${framework}-${theme}.png`)});}expect(samples[1]).toEqual(samples[0]);
 });
}
test('Angular reduced motion is immediate for both components',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await consumer(page,'angular','number',{value:11});await update(page,{value:99});await expect.poll(()=>digits(page)).toEqual([9,9]);
 await consumer(page,'angular','unfold');const first=page.getByRole('button',{name:'First section Summary'});await first.click();await expect(page.getByText('First paragraph',{exact:false})).toBeVisible();await first.click();await expect(page.getByText('First paragraph',{exact:false})).toHaveCount(0);
});
test('Angular website demos show matching content and working controls',async({page})=>{
 await page.goto('/angular-demo/index.html?component=animated-number');await expect(page.locator('[aria-label="$12,450"]')).toBeVisible();await page.getByRole('button',{name:'+$1,000',exact:true}).click();await expect(page.locator('[aria-label="$13,450"]')).toBeVisible();await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.locator('[aria-label="$12,450"]')).toBeVisible();
 await page.goto('/angular-demo/index.html?component=unfold-accordion');await page.getByRole('button',{name:'What is spring physics?'}).click();await expect(page.getByText('Spring tokens drive motion',{exact:false})).toBeVisible();
});
test('rolling digit spring trajectories and interrupted targets follow React',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});const traces:number[][]=[];
 for(const framework of ['react','angular']){
  await consumer(page,framework,'number',{value:11});
  traces.push(await page.evaluate(async()=>{const sample=()=>{const column=document.querySelector<HTMLElement>('.k-an-column, .inline-block.relative.overflow-hidden')!,track=column.firstElementChild!,cell=track.firstElementChild!;return(column.getBoundingClientRect().top-track.getBoundingClientRect().top)/cell.getBoundingClientRect().height;};const pause=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));(window as any).setBatchOptions({value:99});await pause(150);const first=sample();(window as any).setBatchOptions({value:22});await pause(150);const second=sample();await pause(800);return[first,second,sample()];}));
 }
 for(const trace of traces){expect(trace[0]).toBeGreaterThan(3);expect(trace[0]).toBeLessThan(9);expect(trace[2]).toBeCloseTo(2,1);}for(let i=0;i<2;i++)expect(Math.abs(traces[0][i]-traces[1][i])).toBeLessThan(1.2);
});
test('accordion height and inner movement follow React during expansion',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});const traces:number[][]=[];
 for(const framework of ['react','angular']){await consumer(page,framework,'unfold');traces.push(await page.evaluate(async()=>{document.querySelector<HTMLButtonElement>('#fixture button')!.click();await new Promise(resolve=>setTimeout(resolve,120));const content=Array.from(document.querySelectorAll('#fixture div')).find(node=>node.textContent==='First paragraph with enough detail to wrap on a small screen.'&&node.children.length===0)!;const panel=content.parentElement!;const sample=[panel.getBoundingClientRect().height,Number(getComputedStyle(panel).opacity)];await new Promise(resolve=>setTimeout(resolve,700));return [...sample,panel.getBoundingClientRect().height];}));}
 for(const trace of traces){expect(trace[0]).toBeGreaterThan(0);expect(trace[0]).toBeLessThan(trace[2]);expect(trace[1]).toBeGreaterThan(0);expect(trace[1]).toBeLessThan(1);}expect(Math.abs(traces[0][0]-traces[1][0])).toBeLessThan(10);expect(Math.abs(traces[0][1]-traces[1][1])).toBeLessThan(.2);expect(traces[1][2]).toBeCloseTo(traces[0][2],1);
});

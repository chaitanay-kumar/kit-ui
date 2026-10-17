import {test,expect,type Page} from '@playwright/test';
const load=async(page:Page,framework:string,timeline=false)=>{await page.goto(`/e2e/fixtures/parity-batch37.html?framework=${framework}${timeline?'&timeline':''}`);await page.waitForFunction(()=>(window as any).ready);await page.evaluate(()=>document.fonts.ready);};
const update=async(page:Page,patch:object)=>page.evaluate(p=>(window as any).update(p),patch);
for(const framework of ['react','angular']){
 test(`${framework}: row defaults, native keys, mount-only expansion and multi mode`,async({page})=>{
  await load(page,framework);const headers=page.locator('button[aria-expanded]');await expect(headers).toHaveCount(4);await expect(headers.nth(0)).toHaveAttribute('aria-expanded','true');
  await update(page,{defaultExpandedIds:['usr_02']});await expect(headers.nth(0)).toHaveAttribute('aria-expanded','true');await headers.nth(1).focus();await page.keyboard.press('Space');await expect(headers.nth(1)).toHaveAttribute('aria-expanded','true');await expect(headers.nth(0)).toHaveAttribute('aria-expanded','false');
  await update(page,{allowMultiple:true});await headers.nth(2).focus();await page.keyboard.press('Enter');await expect(headers.nth(1)).toHaveAttribute('aria-expanded','true');await expect(headers.nth(2)).toHaveAttribute('aria-expanded','true');
  await update(page,{isLoading:true});await expect(headers).toHaveCount(0);await update(page,{isLoading:false});await expect(headers.nth(2)).toHaveAttribute('aria-expanded','true');await update(page,{items:[]});await expect(headers).toHaveCount(0);await update(page,{items:undefined});await expect(headers).toHaveCount(4);
 });
 test(`${framework}: row actions, optimistic denied copy and propagation`,async({page})=>{
  await load(page,framework);await page.evaluate(()=>(window as any).failCopy=true);await page.getByRole('button',{name:'Copy Email'}).click();await expect(page.locator('button[aria-expanded]').first()).toHaveAttribute('aria-expanded','true');expect(await page.evaluate(()=>(window as any).copies)).toEqual(['sarah.c@cyberdyne.io']);
  await page.getByRole('button',{name:'Manage Billing'}).click();await page.getByRole('button',{name:'User Profile'}).click();expect(await page.evaluate(()=>(window as any).events)).toEqual([['manage-billing','usr_01'],['view-profile','usr_01']]);
  await page.evaluate(()=>(window as any).throwAction=true);await page.getByRole('button',{name:'Manage Billing'}).click();await expect.poll(()=>page.evaluate(()=>(window as any).failures.length)).toBe(1);await page.locator('button[aria-expanded]').nth(1).click();await expect(page.locator('button[aria-expanded]').nth(1)).toHaveAttribute('aria-expanded','true');
 });
 test(`${framework}: timeline selection callback failure, noncollapsible mode and hash copy`,async({page})=>{
  await load(page,framework,true);const nodes=page.locator('button[aria-controls]');await expect(nodes).toHaveCount(4);await expect(nodes.first()).toHaveAttribute('aria-expanded','true');
  await page.evaluate(()=>(window as any).throwSelect=true);await nodes.nth(1).click();await expect(nodes.nth(1)).toHaveAttribute('aria-expanded','false');await expect.poll(()=>page.evaluate(()=>(window as any).failures.length)).toBe(1);
  await page.evaluate(()=>(window as any).throwSelect=false);await nodes.nth(1).focus();await page.keyboard.press('Enter');await expect(nodes.nth(1)).toHaveAttribute('aria-expanded','true');await expect(nodes.first()).toHaveAttribute('aria-expanded','true');
  await update(page,{collapsible:false,defaultSelectedId:'d'});await nodes.nth(2).click();await expect(nodes.nth(2)).toHaveAttribute('aria-expanded','false');await expect(nodes.first()).toHaveAttribute('aria-expanded','true');
  await page.evaluate(()=>(window as any).events=[]);await page.locator('button[title="Copy commit hash"]').click();expect(await page.evaluate(()=>(window as any).copies)).toEqual(['123456789abcd']);expect(await page.evaluate(()=>(window as any).events)).toEqual([]);
  await update(page,{items:[]});await expect(nodes).toHaveCount(0);await expect(page.getByRole('list')).toHaveCount(1);
 });
}
for(const timeline of [false,true])test(`paired ${timeline?'timeline':'rows'} settled geometry`,async({page})=>{
 const results:any[]=[];
 for(const framework of ['react','angular']){await load(page,framework,timeline);await page.waitForTimeout(1300);results.push(await page.evaluate((isTimeline)=>{const root=document.querySelector('#fixture')!,rect=(node:Element)=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}},buttons=Array.from(root.querySelectorAll(isTimeline?'button[aria-controls]':'button[aria-expanded]'));return {root:rect(root),buttons:buttons.map(rect),details:Array.from(root.querySelectorAll('button,p')).filter(n=>n.getBoundingClientRect().width&&n.getBoundingClientRect().height).map(n=>{const c=getComputedStyle(n);return {text:n.textContent?.trim(),rect:rect(n),font:c.fontFamily,size:c.fontSize,line:c.lineHeight,radius:c.borderRadius,color:c.color}})}},timeline));await page.screenshot({path:`test-results/batch37-${timeline?'timeline':'rows'}-${framework}-${test.info().project.name}.png`})}
 expect(results[0].buttons.length).toBe(results[1].buttons.length);for(let i=0;i<results[0].buttons.length;i++)for(const key of ['x','y','w','h'])expect(Math.abs(results[0].buttons[i][key]-results[1].buttons[i][key]),`${i}.${key}`).toBeLessThanOrEqual(1);
 expect(results[0].details.length).toBe(results[1].details.length);for(let i=0;i<results[0].details.length;i++){const a=results[0].details[i],b=results[1].details[i];for(const key of ['font','size','line','radius','color'])expect(b[key],`${i}:${a.text}.${key}`).toBe(a[key]);for(const key of ['x','y','w','h'])expect(Math.abs(a.rect[key]-b.rect[key]),`${i}:${a.text}.${key}`).toBeLessThanOrEqual(1);}
});
for(const framework of ['react','angular'])for(const timeline of [false,true]){
 test(`${framework}: ${timeline?'timeline':'rows'} clipboard fallback, focus and feedback reset`,async({page})=>{
  await load(page,framework,timeline);
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});(document as any).execCommand=(command:string)=>{(window as any).fallback=[command,(document.activeElement as HTMLTextAreaElement).value];return false}});
  const copy=timeline?page.locator('button[title="Copy commit hash"]'):page.getByRole('button',{name:'Copy Email'});
  await copy.click();expect(await page.evaluate(()=>(window as any).fallback)).toEqual(['copy',timeline?'123456789abcd':'sarah.c@cyberdyne.io']);
  await expect(page.locator('textarea')).toHaveCount(0);await expect(page.locator('button[aria-expanded]').first()).toHaveAttribute('aria-expanded','true');
  const icon=copy.locator('svg').last();const success=await icon.getAttribute('class');await page.waitForTimeout(2150);expect(await icon.getAttribute('class')).not.toBe(success);
  await copy.focus();await page.keyboard.press('Enter');await expect(page.locator('textarea')).toHaveCount(0);
  await page.evaluate(()=>(window as any).unmount());await expect(page.locator('#fixture button')).toHaveCount(0);await page.waitForTimeout(2100);expect(await page.evaluate(()=>(window as any).failures)).toEqual([]);
 });
 test(`${framework}: ${timeline?'timeline':'rows'} interrupted detail exit and initial staging`,async({page})=>{
  await load(page,framework,timeline);const nodes=page.locator(timeline?'button[aria-controls]':'button[aria-expanded]');
  const detail=timeline?page.getByText('Production build verified.',{exact:true}):page.getByText('Account Metadata',{exact:true});
  await expect(detail).toBeVisible();await nodes.first().click();await expect(nodes.first()).toHaveAttribute('aria-expanded','false');
  // Reopening during the exit must retain the detail and settle at its full height.
  await nodes.first().click();await expect(nodes.first()).toHaveAttribute('aria-expanded','true');await expect(detail).toBeVisible();await page.waitForTimeout(1300);
  const height=await detail.evaluate(n=>n.getBoundingClientRect().height);expect(height).toBeGreaterThan(0);
  await nodes.first().click();await expect(detail).toHaveCount(0);await nodes.first().click();await expect(detail).toBeVisible();await page.waitForTimeout(1300);expect(await detail.evaluate(n=>n.getBoundingClientRect().height)).toBeCloseTo(height,0);
  await page.evaluate(()=>(window as any).unmount());await expect(page.locator('#fixture button')).toHaveCount(0);expect(await page.evaluate(()=>(window as any).failures)).toEqual([]);
 });
}
test('native demo consumers render data and preserve actions',async({page})=>{
 await page.goto('/angular-demo/index.html?component=expandable-data-row&theme=dark');await page.getByRole('button',{name:'Manage Billing'}).click();await expect(page.getByRole('status')).toHaveText('Manage billing for Sarah Connor');
 await page.goto('/angular-demo/index.html?component=interactive-timeline&theme=dark');await expect(page.getByRole('region',{name:'Interactive timeline'})).toBeVisible();await expect(page.getByText('Production artifacts verified.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Global Edge Replication - in-progress'}).click();await expect(page.getByText('Replicating immutable build layers across 32 regional edge locations.')).toBeVisible();
});
for(const framework of ['react','angular'])for(const timeline of [false,true])test(`${framework}: ${timeline?'timeline':'rows'} source chevron keeps motion under reduced preference`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await load(page,framework,timeline);await page.waitForTimeout(300);
 const samples=await page.evaluate(async(isTimeline)=>{
  const button=document.querySelector<HTMLButtonElement>(isTimeline?'button[aria-controls]':'button[aria-expanded]')!;
  const container=isTimeline?button.parentElement!:button;
  const candidates=Array.from(container.querySelectorAll<HTMLElement>('span,div'));
  const rotating=candidates.find(n=>getComputedStyle(n).transform!=='none')!;
  if(!rotating)throw new Error('Expected initially rotated chevron');button.click();const values:string[]=[];
  for(let i=0;i<10;i++){await new Promise(requestAnimationFrame);values.push(getComputedStyle(rotating).transform)}return values;
 },timeline);
 expect(new Set(samples).size).toBeGreaterThan(2);
});
for(const framework of ['react','angular'])test(`${framework}: timeline data replacement, root overrides and content keyboard contract`,async({page})=>{
 await load(page,framework,true);await update(page,{attributes:{'aria-label':'Release steps',role:'group'},style:{maxWidth:600}});await expect(page.getByRole('group',{name:'Release steps'})).toHaveCSS('max-width','600px');
 const content=page.getByText('Replicate',{exact:true});await content.click();await expect(page.getByText('Replicating to the edge.',{exact:true})).toBeVisible();
 await page.evaluate(()=>(window as any).events=[]);await content.press('Enter');expect(await page.evaluate(()=>(window as any).events)).toEqual([]);
 await page.evaluate(()=>{const api=window as any;const items=api.read().items;items[3].status='completed';api.update({items:[...items]})});await expect(page.locator('button[aria-controls]').nth(3)).toHaveAttribute('title','Rollback - completed');
 await update(page,{items:[]});await expect(page.getByRole('listitem')).toHaveCount(0);await update(page,{items:[{id:'b',title:'Retained selection',timestamp:'Later',status:'pending',description:'Retained detail'}]});await expect(page.locator('button[aria-controls]')).toHaveAttribute('aria-expanded','true');await expect(page.getByText('Retained detail',{exact:true})).toBeVisible();
});

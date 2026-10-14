import {test,expect,type Page} from '@playwright/test';
async function open(page:Page,framework:string){await page.route('**/batch24.html*',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"/><script type="module">import R from "/@react-refresh";R.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>x=>x;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/parity-batch24-contract.tsx"></script>'}));await page.goto(`/batch24.html?framework=${framework}`);await expect(page.locator('#fixture')).toHaveAttribute('data-framework',framework);await page.waitForFunction(()=>typeof(window as any).update==='function');await page.evaluate(()=>document.fonts.ready)}
const update=(page:Page,patch:Record<string,unknown>)=>page.evaluate(p=>(window as any).update(p),patch);
for(const framework of ['react','angular'])test.describe(framework,()=>{
 test.beforeEach(async({page})=>open(page,framework));
 test('lens duplicates content and supports custom coordinate context',async({page})=>{await page.mouse.move(100,100);await expect(page.locator('#lens .sample-content')).toHaveCount(2);await update(page,{custom:true,zoomScale:3});await expect(page.locator('#context')).toHaveText('60,60,3');await page.mouse.move(120,110);await expect(page.locator('#context')).toHaveText('80,70,3');await page.mouse.move(20,20);await expect(page.locator('#context')).toHaveCount(0)});
 test('lens exit can be interrupted and content remains live',async({page})=>{await page.mouse.move(100,100);await expect(page.locator('#lens .sample-content')).toHaveCount(2);await page.mouse.move(20,20);await page.mouse.move(110,110);await update(page,{content:'Updated'});await expect(page.locator('#lens .sample-content')).toHaveCount(2);await expect(page.locator('#lens .sample-content').last()).toHaveText('Updated');await page.waitForTimeout(450);await expect(page.locator('#lens .sample-content')).toHaveCount(2)});
 test('keyboard activation calls click without submitting form',async({page})=>{const button=page.getByRole('button',{name:'Create particle burst'});await button.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');expect(await page.evaluate(()=>(window as any).events)).toEqual(['click','click']);await expect(page.locator('#burst canvas')).toHaveAttribute('aria-hidden','true');await update(page,{label:'Commit release'});await expect(button).toHaveCount(0);await expect(page.getByRole('button',{name:'Commit release'})).toBeVisible()});
 test('unmount during animation releases component without errors',async({page})=>{const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.mouse.move(100,100);await page.getByRole('button').dispatchEvent('pointerdown',{clientX:100,clientY:340});await page.evaluate(()=>(window as any).unmount());await page.waitForTimeout(150);expect(errors).toEqual([]);await expect(page.locator('#fixture')).toHaveCount(0)});
});
test('settled lens geometry and burst styles match React',async({page})=>{
 const samples=[];
 for(const framework of ['react','angular']){
  await open(page,framework);await update(page,{lensShape:'square',lensSize:140,zoomScale:3,showBorder:false});await page.mouse.move(100,100);
  const surface=page.locator(framework==='react'?'#lens>div>div.absolute':'#lens .k-density-surface');await expect(surface).toHaveCount(1);await page.waitForTimeout(700);
  const pick=(node:Element,keys:string[])=>{const s=getComputedStyle(node);return Object.fromEntries(keys.map(k=>[k,s.getPropertyValue(k)]))};
  const lens=await surface.evaluate(pick,['width','height','border-radius','border-width','background-color','box-shadow','backdrop-filter','pointer-events','z-index']);
  // Tailwind inserts four transparent shadow placeholders; compare the visible shadow.
  lens['box-shadow']=lens['box-shadow'].replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /g,'');
  const button=await page.locator('#burst button').evaluate(pick,['padding','gap','font-size','font-weight','line-height','border-radius','background-color','border-color','color']);
  samples.push({lens,button});
 }
 expect(samples[1]).toEqual(samples[0]);
});

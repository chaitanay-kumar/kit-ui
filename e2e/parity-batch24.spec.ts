import {test,expect,type Page} from '@playwright/test';
async function open(page:Page,framework:string){await page.route('**/batch24.html*',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"/><script type="module">import R from "/@react-refresh";R.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>x=>x;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/parity-batch24-contract.tsx"></script>'}));await page.goto(`/batch24.html?framework=${framework}`);await expect(page.locator('#fixture')).toHaveAttribute('data-framework',framework);await page.waitForFunction(()=>typeof(window as any).update==='function');await page.evaluate(()=>document.fonts.ready)}
const update=(page:Page,patch:Record<string,unknown>)=>page.evaluate(p=>(window as any).update(p),patch);
for(const framework of ['react','angular'])test.describe(framework,()=>{
 test.beforeEach(async({page})=>open(page,framework));
 test('lens duplicates content and supports custom coordinate context',async({page})=>{await page.mouse.move(100,100);await expect(page.locator('#lens .sample-content')).toHaveCount(2);await update(page,{custom:true,zoomScale:3});await expect(page.locator('#context')).toHaveText('60,60,3');await page.mouse.move(120,110);await expect(page.locator('#context')).toHaveText('80,70,3');await page.mouse.move(20,20);await expect(page.locator('#context')).toHaveCount(0)});
 test('lens exit can be interrupted and content remains live',async({page})=>{await page.mouse.move(100,100);await expect(page.locator('#lens .sample-content')).toHaveCount(2);await page.mouse.move(20,20);await page.mouse.move(110,110);await update(page,{content:'Updated'});await expect(page.locator('#lens .sample-content')).toHaveCount(2);await expect(page.locator('#lens .sample-content').last()).toHaveText('Updated');await page.waitForTimeout(450);await expect(page.locator('#lens .sample-content')).toHaveCount(2)});
 test('keyboard activation calls click without submitting form',async({page})=>{const button=page.getByRole('button',{name:'Create particle burst'});await button.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');expect(await page.evaluate(()=>(window as any).events)).toEqual(['click','click']);await expect(page.locator('#burst canvas')).toHaveAttribute('aria-hidden','true');await update(page,{label:'Commit release'});await expect(button).toHaveCount(0);await expect(page.getByRole('button',{name:'Commit release'})).toBeVisible()});
 test('unmount during animation releases component without errors',async({page})=>{const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.mouse.move(100,100);await page.getByRole('button').dispatchEvent('pointerdown',{clientX:100,clientY:340});await page.evaluate(()=>(window as any).unmount());await page.waitForTimeout(150);expect(errors).toEqual([]);await expect(page.locator('#fixture')).toHaveCount(0)});
 test('duplicate content has independent native state and event handlers',async({page})=>{await update(page,{stateful:true});await page.mouse.move(100,100);const counters=page.locator('#lens .counter');await expect(counters).toHaveCount(2);await counters.last().evaluate(n=>(n as HTMLButtonElement).click());await expect(counters.last()).toHaveText('1');await expect(counters.first()).toHaveText('0');await counters.first().evaluate(n=>(n as HTMLButtonElement).click());await expect(counters.first()).toHaveText('1');await page.mouse.move(20,20);await expect(counters).toHaveCount(1);await page.mouse.move(100,100);await expect(counters).toHaveCount(2);await expect(counters.first()).toHaveText('1');await expect(counters.last()).toHaveText('0')});
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
test('particle canvas matches React frame by frame at native DPR',async({page})=>{
 const results=[];
 for(const framework of ['react','angular']){
  await open(page,framework);await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(50);
  await page.evaluate(()=>{
   const api=window as any,frames=new Map<number,FrameRequestCallback>();let id=0;
   window.requestAnimationFrame=cb=>{frames.set(++id,cb);return id};window.cancelAnimationFrame=id=>{frames.delete(id)};
   api.advance=()=>{const pending=[...frames.values()];frames.clear();for(const cb of pending)cb(performance.now())};
   api.seed=()=>{let state=123456;Math.random=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296}};
  });
  const canvas=page.locator('#burst canvas'),button=page.locator('#burst button'),box=(await button.boundingBox())!;
  const burst=async()=>{await page.evaluate(()=>(window as any).seed());await button.dispatchEvent('pointerdown',{clientX:box.x+box.width/2,clientY:box.y+box.height/2});await page.waitForTimeout(50)};
  const advance=async(count:number)=>{await page.evaluate(n=>{for(let i=0;i<n;i++)(window as any).advance()},count)};
  const sample=()=>canvas.evaluate(c=>{const node=c as HTMLCanvasElement;return {width:node.width,height:node.height,pixels:node.toDataURL()}});
  await burst();await advance(1);const first=await sample();await advance(9);const tenth=await sample();await burst();await advance(1);const repeated=await sample();await advance(80);const expired=await sample();
  expect(first.pixels).not.toEqual(expired.pixels);expect(tenth.pixels).not.toEqual(first.pixels);results.push({first,tenth,repeated,expired});
 }
 expect(results[1]).toEqual(results[0]);
});
test('native detail demos show actual source content and lens settings',async({page})=>{await page.goto('/angular-demo/index.html?component=density-lens');await expect(page.getByRole('heading',{name:'Microservice Cluster Topology'})).toBeVisible();await page.locator('.k-density-heading').hover();await expect(page.locator('.k-density-surface')).toHaveCSS('width','140px');await expect(page.locator('.k-density-zoom')).toHaveCSS('transform','matrix(2, 0, 0, 2, 0, 0)');await page.goto('/angular-demo/index.html?component=gravity-particle-burst');await expect(page.getByRole('button',{name:'Commit release'})).toBeVisible();await expect(page.getByText('Click or tap to emit gravity-driven particles.')).toBeVisible()});
test('native hosts own their styling and retain consumer attributes without Tailwind',async({page})=>{await page.route('**/batch24-bare.html',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"/><script type="module" src="/e2e/fixtures/parity-batch24-bare.ts"></script>'}));await page.goto('/batch24-bare.html');const lens=page.locator('[data-native=lens]'),burst=page.locator('[data-native=burst]');await expect(lens).toHaveAttribute('aria-label','Native lens');await expect(lens).toHaveCSS('overflow','hidden');await expect(lens).toHaveCSS('cursor','crosshair');await lens.hover();await expect(page.locator('.k-density-surface')).toHaveCSS('width','150px');await expect(page.locator('.k-density-surface')).toHaveCSS('position','absolute');await expect(burst).toHaveAttribute('aria-label','Native burst');await expect(burst).toHaveCSS('display','inline-flex');await expect(burst.locator('canvas')).toHaveCSS('pointer-events','none');await expect(page.getByRole('button',{name:'Commit',exact:true})).toHaveAttribute('type','button');await expect(burst.locator('svg')).toHaveCSS('width','16px')});
test('responsive detail demo geometry and typography match source',async({page})=>{
 await page.route('**/batch24-reference.html*',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"/><script type="module">import R from "/@react-refresh";R.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>x=>x;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/parity-batch24-reference.tsx"></script>'}));
 for(const burst of [false,true]){
  const samples=[];
  for(const native of [false,true]){
   await page.goto(native?`/angular-demo/index.html?component=${burst?'gravity-particle-burst':'density-lens'}`:`/batch24-reference.html${burst?'?burst=1':''}`);await expect(page.locator(burst?'button':'h4').first()).toBeVisible();await page.evaluate(()=>document.fonts.ready);await page.mouse.move(0,0);
   samples.push(await page.evaluate(({native,burst})=>{
    const wrapper=document.querySelector(native?(burst?'.k-gravity-detail':'.k-density-detail'):'#reference>div')!;
    const base=wrapper.getBoundingClientRect();
    const sample=(el:Element)=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {x:r.x-base.x,y:r.y-base.y,width:r.width,height:r.height,font:[s.fontFamily,s.fontSize,s.fontWeight,s.lineHeight,s.letterSpacing,s.fontFeatureSettings],padding:s.padding,borderRadius:s.borderRadius,color:s.color}};
    const content=burst?wrapper.querySelectorAll('button,p'):wrapper.querySelectorAll('h4,p,span[style],.k-density-heading span,[title]');
    // The source status span has utility classes rather than inline style.
    const items=burst?[...content]:[wrapper.querySelector('h4')!,wrapper.querySelector('p')!,[...wrapper.querySelectorAll('span')].find(n=>n.textContent==='STATUS: HEALTHY')!,...wrapper.querySelectorAll('[title]')];
    return {width:base.width,height:base.height,items:items.map(sample)};
   },{native,burst}));
  }
  expect(samples[1]).toEqual(samples[0]);
 }
});

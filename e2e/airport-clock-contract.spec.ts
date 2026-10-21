import {test,expect,type Page} from '@playwright/test';

async function open(page:Page,framework:string,options:object={}){
  await page.clock.setFixedTime(new Date('2026-10-21T12:34:56Z'));
  await page.route('**/airport-qa.html*',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><script type="module">import R from "/@react-refresh";R.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>x=>x;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/airport-clock-qa.tsx"></script>'}));
  await page.goto(`/airport-qa.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify(options))}`);
  await expect(page.locator('section')).toBeVisible();await page.locator('section').evaluate(()=>document.fonts.ready);
}
for(const framework of ['react','angular']){
  test(`${framework}: clock retains initial cities when a controlled input is released`,async({page})=>{
    await open(page,framework,{cities:['london','tokyo'],showControls:true});
    await page.evaluate(()=>(window as any).patch({cities:['osaka','kyoto']}));
    await expect(page.getByRole('button',{name:'Remove Osaka'})).toBeVisible();
    await page.evaluate(()=>(window as any).patch({cities:undefined}));
    await expect(page.getByRole('button',{name:'Remove London'})).toBeVisible();
    await expect(page.getByRole('button',{name:'Remove Tokyo'})).toBeVisible();
    await expect(page.getByRole('button',{name:'Remove Osaka'})).toHaveCount(0);
  });
  test(`${framework}: clock initial-only cities remain editable and controlled changes await acceptance`,async({page})=>{
    await open(page,framework,{cities:['los-angeles','london'],callback:false,showControls:true});
    await page.getByRole('button',{name:'Remove Los Angeles'}).click();
    await expect(page.getByRole('button',{name:'Remove Los Angeles'})).toHaveCount(0);
    await expect(page.getByRole('button',{name:'Remove London'})).toBeDisabled();
    await page.evaluate(()=>(window as any).patch({cities:['tokyo','osaka'],callback:true}));
    await expect(page.getByRole('button',{name:'Remove Tokyo'})).toBeEnabled();
    await page.getByRole('button',{name:'Remove Tokyo'}).click();
    await expect.poll(()=>page.evaluate(()=>(window as any).events.at(-1))).toEqual(['osaka']);
    await expect(page.getByRole('button',{name:'Remove Tokyo'})).toBeVisible();
    await page.evaluate(()=>(window as any).patch({cities:['osaka'],acceptChanges:true}));
    await page.getByLabel('Country',{exact:true}).selectOption('Japan');
    await expect(page.getByLabel('City',{exact:true})).toHaveValue('tokyo');
    await page.getByRole('button',{name:'Add',exact:true}).click();
    await expect(page.getByRole('button',{name:'Remove Tokyo'})).toBeVisible();
    await expect(page.getByLabel('City',{exact:true})).toHaveValue('kyoto');
  });
  test(`${framework}: clock sanitizes cities and updates time formatting, countries and controls`,async({page})=>{
    await open(page,framework,{cities:['__proto__','tokyo','tokyo','london'],callback:false,format:'12h',showSeconds:true,showCountry:true});
    await expect(page.locator('li')).toHaveCount(2);
    await expect(page.locator('section')).toHaveAttribute('aria-label','World times: 09:34:56 PM Tokyo, 01:34:56 PM London');
    await expect(page.locator('[aria-label="Japan"]')).toBeVisible();
    await expect(page.getByRole('button',{name:'Add',exact:true})).toHaveCount(0);
    await page.evaluate(()=>(window as any).patch({format:undefined,showSeconds:undefined,showCountry:undefined,showControls:true}));
    await expect(page.locator('section')).toHaveAttribute('aria-label','World times: 21:34 Tokyo, 13:34 London');
    await expect(page.locator('[aria-label="Japan"]')).toHaveCount(0);
    await expect(page.getByRole('button',{name:'Add',exact:true})).toBeVisible();
  });
  test(`${framework}: clock hover rebuild settles, reduced motion and disposal`,async({page})=>{
    await page.emulateMedia({reducedMotion:'no-preference'});await open(page,framework);
    const row=page.locator('li').first(),face=row.locator('svg').first().locator('..');
    await row.hover();
    await expect.poll(()=>face.evaluate(el=>getComputedStyle(el).transform)).not.toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await expect.poll(()=>face.evaluate(el=>{const t=getComputedStyle(el).transform;return t==='none'||Math.abs(new DOMMatrix(t).m42)<.01}),{timeout:3000}).toBe(true);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.mouse.move(0,0);await row.hover();
    await expect.poll(()=>face.evaluate(el=>{const t=getComputedStyle(el).transform;return t==='none'||Math.abs(new DOMMatrix(t).m42)<.01})).toBe(true);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await row.dispatchEvent('pointerenter',{pointerType:'touch'});
    await row.dispatchEvent('pointerover',{pointerType:'touch'});
    expect(await row.locator('[data-airport-ghost]').count()).toBe(0);
    await page.mouse.move(0,0);await row.hover();
    await page.evaluate(()=>{(window as any).activeClockAnimations=document.getAnimations();(window as any).destroy();});
    await expect(page.locator('section')).toHaveCount(0);
    await expect.poll(()=>page.evaluate(()=>(window as any).activeClockAnimations.every((a:Animation)=>a.playState==='idle'||a.playState==='finished'))).toBe(true);
  });
}

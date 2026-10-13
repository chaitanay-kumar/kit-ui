import {test,expect,type Page} from '@playwright/test';

const runtimeErrors=new WeakMap<Page,string[]>();
test.beforeEach(({page})=>{const errors:string[]=[];runtimeErrors.set(page,errors);page.on('pageerror',error=>errors.push(error.message));});
test.afterEach(({page})=>{expect(runtimeErrors.get(page)).toEqual([]);});

async function consumer(page:Page,framework:string,theme='light',autoFocus=false){
  await page.route('**/ios-search-contract.html*',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script type="module">import RefreshRuntime from "/@react-refresh";RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/ios-search-contract.tsx"></script></body></html>'}));
  await page.goto(`/ios-search-contract.html?framework=${framework}&theme=${theme}&autoFocus=${autoFocus}`);
  await expect(page.getByRole('searchbox')).toBeVisible();
  await page.waitForFunction(()=>typeof (window as any).setIOSOptions==='function');
  await expect.poll(()=>width(page)).toBeCloseTo(autoFocus?340:220,0);
}
async function update(page:Page,options:Record<string,unknown>){await page.evaluate(options=>(window as any).setIOSOptions(options),options);}
async function events(page:Page){return page.evaluate(()=>(window as any).iosEvents as string[]);}
async function width(page:Page){return page.getByRole('searchbox').evaluate(el=>el.parentElement!.parentElement!.getBoundingClientRect().width);}
async function metrics(page:Page){return page.getByRole('searchbox').evaluate(el=>{
  // Compare painted geometry: zero-width borders/rings and transparent Tailwind shadows have no pixels.
  const style=(node:Element)=>{const s=getComputedStyle(node);const shadow=s.boxShadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(?:, )?/g,'').replace(/(?:, )?rgb\(250, 250, 250\) 0px 0px 0px 0px/g,'').replace(/^[,\s]+|[,\s]+$/g,'');return {height:s.height,color:s.color,background:s.backgroundColor,border:parseFloat(s.borderWidth)===0?'0px':s.border,borderRadius:Math.min(parseFloat(s.borderRadius),parseFloat(s.height)/2),padding:s.padding,fontSize:s.fontSize,lineHeight:s.lineHeight,shadow:shadow||'none'};};
  return {input:style(el),control:style(el.parentElement!),search:style(el.parentElement!.querySelector('svg')!),width:Math.round(el.parentElement!.parentElement!.getBoundingClientRect().width)};
});}
for(const framework of ['react','angular']){
  test(`${framework}: controlled change, Enter callback, clear ordering and focus`,async({page})=>{
    await consumer(page,framework);await update(page,{submit:true});const input=page.getByRole('searchbox');
    await input.fill(' telemetry ');await expect(input).toHaveValue(' telemetry ');
    await input.press('Enter');expect(await events(page)).toEqual(['change: telemetry ','submit: telemetry ']);
    await input.press('Tab');const clear=page.getByRole('button',{name:'Clear search'});await expect(clear).toBeFocused();
    await expect.poll(()=>clear.evaluate(node=>getComputedStyle(node).boxShadow)).toContain('255, 255, 255');
    await clear.press('Space');await expect(input).toHaveValue('');await expect(input).toBeFocused();
    expect(await events(page)).toEqual(['change: telemetry ','submit: telemetry ','change:','clear']);
    await expect(page.getByRole('button',{name:'Clear search'})).toHaveCount(0);
    await input.press('Escape');await expect(input).not.toBeFocused();await expect.poll(()=>width(page)).toBeCloseTo(220,0);
  });
  test(`${framework}: parent replacement, custom widths, Escape and native form submission`,async({page})=>{
    await consumer(page,framework);const input=page.getByRole('searchbox');
    await update(page,{value:'external',collapsedWidth:180,expandedWidth:'300px',className:'custom-pill',placeholder:'Find records'});
    await expect(input).toHaveAccessibleName('Find records');await expect(input).toHaveValue('external');await expect.poll(()=>width(page)).toBeCloseTo(300,0);
    await input.focus();await input.evaluate(node=>(node as HTMLInputElement).blur());await expect(input).not.toBeFocused();await expect.poll(()=>width(page)).toBeCloseTo(300,0);
    // Chromium's native search-input Escape action clears the value after the component blurs it.
    await input.focus();await input.press('Escape');await expect(input).not.toBeFocused();await expect(input).toHaveValue('');await expect.poll(()=>width(page)).toBeCloseTo(180,0);
    await input.press('Enter');expect(await events(page)).toContain('form-submit');
    await input.press('Escape');
    await update(page,{value:'',collapsedWidth:'50%',expandedWidth:300});await expect.poll(()=>width(page)).toBeCloseTo((page.viewportSize()!.width-40)/2,0);
    await page.setViewportSize({width:800,height:700});await expect.poll(()=>width(page)).toBeCloseTo(380,0);
  });
  test(`${framework}: disabled field, parent-owned state and clear behavior`,async({page})=>{
    await consumer(page,framework);const input=page.getByRole('searchbox');await update(page,{value:'locked',disabled:true});
    await expect(input).toBeDisabled();await page.getByRole('button',{name:'Clear search'}).click();await expect(input).toHaveValue('');await expect(input).not.toBeFocused();
    expect(await events(page)).toEqual(['change:','clear']);
    await update(page,{value:'kept',ignoreChange:true});await input.fill('rejected');await expect(input).toHaveValue('kept');
  });
  test(`${framework}: autofocus on mount and interrupted clear exit`,async({page})=>{
    await consumer(page,framework,'light',true);const input=page.getByRole('searchbox');await expect(input).toBeFocused();
    await update(page,{value:'one'});await expect(page.getByRole('button',{name:'Clear search'})).toBeVisible();
    await update(page,{value:''});await update(page,{value:'two'});await expect(input).toHaveValue('two');await expect(page.getByRole('button',{name:'Clear search'})).toBeVisible();
    await page.evaluate(()=>(window as any).destroyIOS());await expect(input).toHaveCount(0);
  });
  test(`${framework}: editing the middle preserves caret and blur emits no duplicate`,async({page})=>{
    await consumer(page,framework);const input=page.getByRole('searchbox');await input.fill('abcd');await input.press('ArrowLeft');await input.press('ArrowLeft');await input.press('X');
    await expect(input).toHaveValue('abXcd');expect(await input.evaluate(node=>(node as HTMLInputElement).selectionStart)).toBe(3);
    const before=await events(page);await input.evaluate(node=>(node as HTMLInputElement).blur());expect(await events(page)).toEqual(before);
  });
}
for(const theme of ['light','dark']){
  test(`${theme}: React and Angular settled geometry, color and focus match`,async({page},testInfo)=>{
    const samples=[];
    for(const framework of ['react','angular']){
      await consumer(page,framework,theme);await expect.poll(()=>width(page)).toBeCloseTo(220,0);const idle=await metrics(page);
      await page.getByRole('searchbox').focus();await expect.poll(()=>width(page)).toBeCloseTo(340,0);
      await expect.poll(()=>page.getByRole('searchbox').evaluate(el=>getComputedStyle(el.parentElement!).backgroundColor)).toBe('rgb(20, 20, 20)');
      const focused=await metrics(page);samples.push({idle,focused});
      await page.getByRole('searchbox').fill('telemetry');const clear=page.getByRole('button',{name:'Clear search'});await expect(clear).toBeVisible();
      await expect.poll(()=>clear.evaluate(node=>Number(getComputedStyle(node).opacity))).toBe(1);
      await page.getByRole('searchbox').locator('..').screenshot({path:testInfo.outputPath(`${framework}-${theme}.png`)});
    }
    expect(samples[1]).toEqual(samples[0]);
  });
}
test('Angular website demo and source expose the controlled contract',async({page,request})=>{
  await page.goto('/angular-demo/index.html?component=ios-search-bar');const input=page.getByRole('searchbox');await expect(input).toHaveAccessibleName('Search telemetry...');
  await input.fill('trace');await expect(page.getByText('Active query: "trace"')).toBeVisible();
  const response=await request.get('/angular-source/ios-search-bar.json');expect(response.ok()).toBe(true);const source=await response.json();
  expect(source.sourceCode).toContain('input.required<string>');expect(source.dependencies['ios-search-motion.ts']).toContain('cancelAnimationFrame');expect(source.dependencies['ios-search.css']).toContain('.k-ios-control');
});
test('width spring follows React during expansion and interruption',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  const traces:number[][]=[];
  for(const framework of ['react','angular']){
    await consumer(page,framework);
    traces.push(await page.getByRole('searchbox').evaluate(async node=>{
      const input=node as HTMLInputElement,outer=input.parentElement!.parentElement!;
      const pause=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
      input.focus();await pause(100);const expanding=outer.getBoundingClientRect().width;
      input.blur();await pause(100);const collapsing=outer.getBoundingClientRect().width;
      input.focus();await pause(700);return [expanding,collapsing,outer.getBoundingClientRect().width];
    }));
  }
  for(const trace of traces){expect(trace[0]).toBeGreaterThan(240);expect(trace[0]).toBeLessThan(330);expect(trace[1]).toBeLessThan(trace[0]);expect(trace[2]).toBeCloseTo(340,0);}
  for(let i=0;i<2;i++)expect(Math.abs(traces[0][i]-traces[1][i])).toBeLessThan(18);
});
test('Angular stops motion on preference change and disposal',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await consumer(page,'angular');await page.getByRole('searchbox').focus();
  await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>width(page)).toBeCloseTo(340,0);
  await page.getByRole('searchbox').press('Escape');expect(await width(page)).toBeCloseTo(220,0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  const detached=await page.getByRole('searchbox').evaluate(async node=>{
    (node as HTMLInputElement).focus();await new Promise(resolve=>setTimeout(resolve,50));
    const outer=node.parentElement!.parentElement!;
    (window as any).destroyIOS();const before=outer.style.width;
    await new Promise(resolve=>setTimeout(resolve,120));return {before,after:outer.style.width};
  });
  expect(detached.after).toBe(detached.before);
});

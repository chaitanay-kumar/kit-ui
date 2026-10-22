import {test,expect,type Page} from '@playwright/test';

async function open(page:Page,framework:string,children?:string|number,extra:object={}){
  const options={mode:'textarea-content',children,...extra};
  await page.goto(`/e2e/fixtures/parity-batch47-form.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify(options))}`);
  await expect(page.locator('textarea')).toBeVisible({timeout:15000});
}
function trackProjectionObservers(page:Page){return page.addInitScript(()=>{
  const observers=new Map<MutationObserver,{target:string;stack:string|undefined}>(),Native=window.MutationObserver;
  window.MutationObserver=class extends Native{
    override observe(...args:Parameters<MutationObserver['observe']>){const node=args[0];if(node instanceof Element&&node.matches('kit-textarea > span[hidden]'))observers.set(this,{target:node.outerHTML.slice(0,180),stack:new Error().stack});super.observe(...args)}
    override disconnect(){observers.delete(this);super.disconnect()}
  };
  (window as any).activeTextareaObservers=()=>observers.size;
  (window as any).textareaObserverOwners=()=>[...observers.values()];
})}
for(const framework of ['react','angular']){
  test(`${framework}: empty textarea has empty value and native reset default`,async({page})=>{
    await open(page,framework);const field=page.locator('textarea');
    await expect(field).toHaveValue('');await expect(field).toHaveJSProperty('defaultValue','');
    await field.fill('Edited text');await page.locator('form').evaluate((form:HTMLFormElement)=>form.reset());
    await expect(field).toHaveValue('');
  });
  test(`${framework}: projected textarea text initializes without Angular markup`,async({page},info)=>{
    const states:unknown[]=[];
    for(const children of ['Seeded notes','First line\nSecond line',0]){
      await open(page,framework,children);const field=page.locator('textarea');
      await expect(field).toHaveValue(String(children));
      await expect(field).toHaveJSProperty('defaultValue',String(children));
      await page.locator('form').evaluate((form:HTMLFormElement)=>form.reset());await expect(field).toHaveValue(String(children));
      states.push(await field.evaluate((node:HTMLTextAreaElement)=>({value:node.value,defaultValue:node.defaultValue,text:node.textContent})));
      await field.fill('Edited text');await expect(field).toHaveValue('Edited text');
      await expect(field).toHaveJSProperty('defaultValue','');
      states.push(await field.evaluate((node:HTMLTextAreaElement)=>({value:node.value,defaultValue:node.defaultValue,text:node.textContent})));
      await page.locator('form').evaluate((form:HTMLFormElement)=>form.reset());
      await expect(field).toHaveValue('');
      states.push(await field.evaluate((node:HTMLTextAreaElement)=>({value:node.value,defaultValue:node.defaultValue,text:node.textContent})));
    }
    await info.attach('textarea-state-observations',{body:JSON.stringify(states,null,2),contentType:'application/json'});
  });
  test(`${framework}: textarea controlled mount, reset and releasing defaults match native state`,async({page})=>{
    await open(page,framework,undefined,{value:'Owned',defaultValue:'Fallback'});const field=page.locator('textarea');
    await expect(field).toHaveValue('Owned');await expect(field).toHaveJSProperty('defaultValue','Owned');
    await field.fill('Attempted edit');await expect(field).toHaveValue('Owned');await expect(field).toHaveJSProperty('defaultValue','Fallback');
    await page.locator('form').evaluate((form:HTMLFormElement)=>form.reset());await expect(field).toHaveValue('Fallback');
    await page.evaluate(()=>(window as any).update({value:'Controlled',defaultValue:'New default'}));
    await expect(field).toHaveValue('Controlled');await expect(field).toHaveJSProperty('defaultValue','New default');
    await page.evaluate(()=>(window as any).update({value:undefined,defaultValue:undefined}));
    await expect(field).toHaveValue('Controlled');await expect(field).toHaveJSProperty('defaultValue','');
    await page.locator('form').evaluate((form:HTMLFormElement)=>form.reset());await expect(field).toHaveValue('');
  });
  test(`${framework}: textarea pristine defaults and changed projected content preserve source dirty flags`,async({page})=>{
    for(const initial of ['', 'Initial default']){
      await open(page,framework,undefined,{defaultValue:initial});const field=page.locator('textarea');
      await page.evaluate(()=>(window as any).update({defaultValue:'New default'}));
      await expect(field).toHaveValue(initial===''?'New default':initial);await expect(field).toHaveJSProperty('defaultValue','New default');
      await field.fill('Dirty text');await page.evaluate(()=>(window as any).update({defaultValue:'Reset default'}));
      await expect(field).toHaveValue('Dirty text');await page.locator('form').evaluate((form:HTMLFormElement)=>form.reset());await expect(field).toHaveValue('Reset default');
    }
    await open(page,framework,'Projected seed');const field=page.locator('textarea');
    await page.evaluate(()=>(window as any).update({children:'Replacement child'}));
    await expect(field).toHaveValue('Projected seed');await expect(field).toHaveJSProperty('defaultValue','');
    await page.locator('form').evaluate((form:HTMLFormElement)=>form.reset());await expect(field).toHaveValue('');
  });
  test(`${framework}: textarea callback failure restores controlled state and recovers`,async({page})=>{
    await open(page,framework,undefined,{value:'Owned',defaultValue:'Fallback',throwChange:true});const field=page.locator('textarea');
    await field.fill('Rejected edit');await expect(field).toHaveValue('Owned');await expect(field).toHaveJSProperty('defaultValue','Fallback');
    await expect.poll(()=>page.evaluate(()=>(window as any).errors)).toContain('change failed');
    await page.evaluate(()=>(window as any).update({throwChange:false,value:undefined,defaultValue:undefined}));
    await field.fill('Recovered edit');await expect(field).toHaveValue('Recovered edit');await expect(field).toHaveJSProperty('defaultValue','');
  });
}
test('native textarea releases its projection observer on destruction',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await trackProjectionObservers(page);
  await open(page,'angular','Projected seed');
  await expect.poll(()=>page.evaluate(()=>(window as any).activeTextareaObservers())).toBeGreaterThan(0);
  const projection=await page.locator('kit-textarea > span[hidden]').elementHandle();
  await page.evaluate(()=>(window as any).unmount());
  expect(await page.evaluate(()=>(window as any).textareaObserverOwners())).toEqual([]);
  await projection!.evaluate(node=>node.textContent='Detached change');await page.waitForTimeout(50);
  expect(errors).toEqual([]);expect(await page.evaluate(()=>(window as any).errors)).toEqual([]);
});
test('native textarea cannot restore a detached field after callback destruction',async({page})=>{
  await trackProjectionObservers(page);await open(page,'angular',undefined,{value:'Owned',defaultValue:'Fallback',unmountOnChange:true});
  await expect.poll(()=>page.evaluate(()=>(window as any).activeTextareaObservers())).toBeGreaterThan(0);
  const writes=await page.locator('textarea').evaluate(async(node:HTMLTextAreaElement)=>{
    node.value='Attempted edit';const writes:string[]=[],property=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!;
    Object.defineProperty(node,'value',{get:()=>property.get!.call(node),set:value=>{writes.push(value);property.set!.call(node,value)}});
    node.dispatchEvent(new Event('input',{bubbles:true}));await Promise.resolve();return writes;
  });
  await expect(page.locator('textarea')).toHaveCount(0);expect(writes).toEqual([]);
  expect(await page.evaluate(()=>(window as any).textareaObserverOwners())).toEqual([]);expect(await page.evaluate(()=>(window as any).errors)).toEqual([]);
});
test('native input shares the owned restoration queue and stops after destruction',async({page})=>{
  const options={mode:'input',value:'Owned',unmountOnChange:true};
  await page.goto('/e2e/fixtures/parity-batch47-form.html?framework=angular&initial='+encodeURIComponent(JSON.stringify(options)));
  await expect(page.locator('input')).toBeVisible();
  const writes=await page.locator('input').evaluate(async(node:HTMLInputElement)=>{
    node.value='Attempted edit';const writes:string[]=[],property=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!;
    Object.defineProperty(node,'value',{get:()=>property.get!.call(node),set:value=>{writes.push(value);property.set!.call(node,value)}});
    node.dispatchEvent(new Event('input',{bubbles:true}));await Promise.resolve();return writes;
  });
  await expect(page.locator('input')).toHaveCount(0);expect(writes).toEqual([]);expect(await page.evaluate(()=>(window as any).errors)).toEqual([]);
});

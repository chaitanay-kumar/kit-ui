import {test,expect,type Page} from '@playwright/test';
const update=(page:Page,patch:Record<string,unknown>)=>page.evaluate(p=>(window as any).update(p),patch);
test('native package works without Tailwind and disposes during press',async({page})=>{
  await page.goto('/e2e/fixtures/parity-batch31-bare.html');await page.waitForFunction(()=>(window as any).ready);
  await page.getByRole('button',{name:'Use Wallet'}).click();await expect(page.getByRole('status')).toHaveText('Actions 1');await page.getByRole('button',{name:'Template action'}).click();await expect(page.getByRole('status')).toHaveText('Actions 2');
  expect(await page.locator('article').evaluate(node=>getComputedStyle(node).borderRadius)).toBe('26px');
  await page.locator('#scroller').evaluate(node=>node.scrollTop=150);expect(await page.locator('.k-sticky-page-card').first().evaluate(node=>getComputedStyle(node).position)).toBe('sticky');
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.getByRole('button',{name:'Use Wallet'}).dispatchEvent('pointerdown',{button:0});await page.evaluate(()=>(window as any).unmount());await page.mouse.up();await page.waitForTimeout(100);expect(errors).toEqual([]);await expect(page.locator('article')).toHaveCount(0);
});
async function open(page:Page,framework:string){await page.goto(`/e2e/fixtures/parity-batch31.html?framework=${framework}`);await page.waitForFunction(()=>(window as any).ready);await page.evaluate(()=>document.fonts.ready)}

for(const framework of ['react','angular']){
  test(`${framework}: wallet defaults, custom labels, keyboard action and disabled`,async({page})=>{
    await open(page,framework);await expect(page.getByRole('heading',{name:'Wallet',exact:true})).toBeVisible();await expect(page.getByText('$4,566.00',{exact:true})).toBeVisible();await expect(page.getByText('Mastercard Ending with 3040')).toBeVisible();
    await update(page,{balance:'R1,250',cardType:'Visa',cardLastFour:'1234',buttonLabel:'Pay now',balanceLabel:'Available'});
    await expect(page.getByText('R1,250',{exact:true})).toBeVisible();await expect(page.getByText('Visa Ending with 1234')).toBeVisible();const button=page.getByRole('button',{name:'Pay now'});await button.focus();await page.keyboard.press('Enter');expect(await page.evaluate(()=>(window as any).events)).toEqual(['wallet']);await update(page,{disabled:true});await expect(button).toBeDisabled();await button.evaluate((node:HTMLButtonElement)=>node.click());expect(await page.evaluate(()=>(window as any).events)).toEqual(['wallet']);
    await page.evaluate(()=>(window as any).unmount());await expect(page.locator('article')).toHaveCount(0);
  });
  test(`${framework}: empty pages and rich composition override data`,async({page})=>{
    await open(page,framework);await update(page,{pages:[]});await expect(page.getByRole('heading',{name:'First page'})).toHaveCount(0);await update(page,{rich:true});await page.getByRole('button',{name:'Projected action'}).click();expect(await page.evaluate(()=>(window as any).events)).toEqual(['child']);await update(page,{pages:[{title:'Hidden data'}]});await expect(page.getByText('Hidden data')).toHaveCount(0);await update(page,{rich:false});await expect(page.getByRole('heading',{name:'Hidden data'})).toBeVisible();
  });
}

test('paired wallet geometry, typography and sticky scrolling',async({page},info)=>{
  const samples:any[]=[];
  for(const framework of ['react','angular']){
    await open(page,framework);
    const sample=await page.evaluate(()=>{const article=document.querySelector('article')!;return [article,article.querySelector('h2')!,article.querySelector('button')!,article.querySelector('p')!].map(node=>{const r=node.getBoundingClientRect(),s=getComputedStyle(node);return {rect:[r.x,r.y,r.width,r.height],font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,text:node.textContent}})});
    const positions=[];
    for(const scroll of [0,150,350,650]){await page.locator('#scroller').evaluate((node,y)=>node.scrollTop=y,scroll);positions.push(await page.locator('#scroller').evaluate(node=>[...node.querySelectorAll('h2')].map(h=>{const r=h.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})))}
    samples.push({sample,positions});await page.screenshot({path:`test-results/batch31-${framework}-${info.project.name}.png`});
  }
  for(let i=0;i<samples[0].sample.length;i++){const a=samples[0].sample[i],b=samples[1].sample[i];expect(b.text).toBe(a.text);expect(b.font).toBe(a.font);expect(b.size).toBe(a.size);expect(b.weight).toBe(a.weight);a.rect.forEach((v:number,k:number)=>expect(Math.abs(v-b.rect[k]),`wallet ${i} axis ${k}`).toBeLessThan(2))}
  samples[0].positions.forEach((rows:number[][],s:number)=>rows.forEach((rect:number[],i:number)=>rect.forEach((v,k)=>expect(Math.abs(v-samples[1].positions[s][i][k]),`sticky scroll ${s} heading ${i} axis ${k}`).toBeLessThan(2))));
});

test('wallet press settles and releases in both frameworks',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const framework of ['react','angular']){await open(page,framework);const button=page.getByRole('button',{name:'Use Wallet'});const rect=await button.boundingBox();await page.mouse.move(rect!.x+rect!.width/2,rect!.y+rect!.height/2);await page.mouse.down();await expect.poll(()=>button.evaluate(node=>new DOMMatrixReadOnly(getComputedStyle(node).transform).a)).toBeCloseTo(.97,2);await page.mouse.up();await expect.poll(()=>button.evaluate(node=>new DOMMatrixReadOnly(getComputedStyle(node).transform).a)).toBeCloseTo(1,2);}
});

test('wallet shine moves and clears, reduced motion prevents tracking',async({page})=>{
  for(const framework of ['react','angular']){await page.emulateMedia({reducedMotion:'no-preference'});await open(page,framework);const article=page.locator('article');await article.dispatchEvent('pointermove',{clientX:150,clientY:130});await expect.poll(()=>article.evaluate((node,native)=>getComputedStyle(node.querySelector(native?'.k-wallet-shine':'.pointer-events-none')!).backgroundImage,framework==='angular')).toContain('126px 106px');await article.dispatchEvent('pointerout',{relatedTarget:null});await article.dispatchEvent('pointerleave');await expect.poll(()=>article.evaluate((node,native)=>getComputedStyle(node.querySelector(native?'.k-wallet-shine':'.pointer-events-none')!).backgroundImage,framework==='angular')).toContain('-1000px -1000px');}
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const framework of ['react','angular']){await open(page,framework);await page.locator('article').dispatchEvent('pointermove',{clientX:150,clientY:130});await page.waitForTimeout(100);expect(await page.locator('article').evaluate((node,native)=>getComputedStyle(node.querySelector(native?'.k-wallet-shine':'.pointer-events-none')!).backgroundImage,framework==='angular')).toContain('-1000px -1000px')}
});

import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';

for(const theme of ['light','dark'])test(`airport clock same-time artwork, geometry and selectors match in ${theme}`,async({page},info)=>{
  await page.clock.setFixedTime(new Date('2026-10-21T12:34:56Z'));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const results:Record<string,unknown>={};
  for(const framework of ['react','angular']){
    await page.goto(`${process.env.HOSTED_QA_URL??''}/components/airport-matrix-clock/?framework=${framework}`);
    const scope=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const root=scope.locator('section[aria-label^="World times:"]');
    await expect(root).toBeVisible({timeout:15000});await root.evaluate(()=>document.fonts.ready);
    await expect(scope.getByLabel('Country',{exact:true})).toHaveValue('United States');
    await expect(scope.getByLabel('City',{exact:true})).toHaveValue('chicago');
    const read=()=>root.evaluate(el=>{
      const rect=(node:Element)=>{const r=node.getBoundingClientRect();return {width:r.width,height:r.height}};
      const style=(node:Element)=>{const s=getComputedStyle(node);return {font:s.fontFamily,size:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,color:s.color,padding:s.padding,border:s.borderColor,radius:s.borderRadius}};
      const matrices=Array.from(el.querySelectorAll('span[aria-label]')).filter(n=>n.querySelector('svg'));
      return {label:el.getAttribute('aria-label'),...rect(el),rows:Array.from(el.querySelectorAll('li')).map(rect),matrices:matrices.map(n=>({label:n.getAttribute('aria-label'),...rect(n),paths:Array.from(n.children).filter(c=>c.querySelector('svg')).map(c=>Array.from(c.querySelector('svg')!.querySelectorAll('path')).map(p=>p.getAttribute('d')))})),controls:Array.from(el.querySelectorAll('button,select')).map(n=>({name:n.getAttribute('aria-label')||n.textContent,...rect(n),...style(n)}))};
    });
    const initial=await read();
    await scope.getByRole('button',{name:'Add',exact:true}).click();
    await expect(scope.getByRole('button',{name:'Remove Chicago',exact:true})).toBeVisible();
    await expect(scope.getByLabel('City',{exact:true})).toHaveValue('new-york');
    await scope.getByLabel('Country',{exact:true}).selectOption('Japan');
    await expect(scope.getByLabel('City',{exact:true})).toHaveValue('osaka');
    await scope.getByRole('button',{name:'Add',exact:true}).click();
    await expect(scope.getByRole('button',{name:'Add',exact:true})).toBeDisabled();
    await scope.getByRole('button',{name:'Remove Osaka',exact:true}).focus();await page.keyboard.press('Enter');
    await expect(scope.getByRole('button',{name:'Remove Osaka',exact:true})).toHaveCount(0);
    await expect(scope.getByRole('button',{name:'Add',exact:true})).toBeEnabled();
    await scope.getByRole('button',{name:'Remove Chicago',exact:true}).click();
    await scope.getByLabel('Country',{exact:true}).selectOption('United States');
    await expect(scope.getByLabel('City',{exact:true})).toHaveValue('new-york');
    results[framework]={initial,restored:await read()};
    await page.mouse.move(0,0);await root.scrollIntoViewIfNeeded();
    const box=(await root.boundingBox())!;
    await page.evaluate(delta=>window.scrollBy(0,delta),box.y+box.height/2-page.viewportSize()!.height/2);
    await info.attach(`${framework}-board`,{body:await root.screenshot({path:info.outputPath(`${framework}-board.png`)}),contentType:'image/png'});
  }
  await info.attach('board-contracts',{body:JSON.stringify(results),contentType:'application/json'});
  await writeFile(info.outputPath('board-contracts.json'),JSON.stringify(results));
  expect(results.angular).toEqual(results.react);
});

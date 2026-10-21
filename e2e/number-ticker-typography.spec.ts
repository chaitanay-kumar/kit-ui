import {test,expect} from '@playwright/test';

for(const theme of ['light','dark'])test(`number ticker matches React before and after activation in ${theme}`,async({page})=>{
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const samples:Record<string,unknown[]>={};
  for(const framework of ['react','angular']){
    await page.goto(`${process.env.HOSTED_QA_URL || ''}/components/animated-number?framework=${framework}`);
    const scope=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const button=scope.getByRole('button',{name:'Simulate Ticker',exact:true});
    await expect(button).toBeVisible({timeout:15000});
    await button.evaluate(()=>document.fonts.ready);
    samples[framework]=[];
    for(const active of [false,true]){
      const control=scope.getByRole('button',{name:active?'Ticker Active':'Simulate Ticker',exact:true});
      await expect(control).toBeVisible();
      samples[framework].push(await control.evaluate(el=>{
        const s=getComputedStyle(el),r=el.getBoundingClientRect();
        return {font:s.fontFamily,size:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,height:r.height,width:r.width};
      }));
      if(!active)await control.click();
    }
    await scope.getByRole('button',{name:'Ticker Active',exact:true}).click();
    await expect(scope.getByRole('button',{name:'Simulate Ticker',exact:true})).toBeVisible();
  }
  expect(samples.angular).toEqual(samples.react);
});

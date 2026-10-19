import {test,expect} from '@playwright/test';
for(const framework of ['react','angular'])test(framework+': explicit undefined noValidate overrides the source default and native validation gates submit',async({page})=>{
 await page.goto(`/e2e/fixtures/parity-batch47-form.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({mode:'layout',explicitNoValidate:true}))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('form'));
 await expect(page.locator('form')).toHaveJSProperty('noValidate',false);await page.getByLabel('Email address').fill('invalid');await page.getByRole('button',{name:'Submit',exact:true}).click();expect(await page.evaluate(()=>(window as any).events)).toEqual([]);
 await page.evaluate(()=>(window as any).update({noValidate:true}));await page.getByRole('button',{name:'Submit',exact:true}).click();expect(await page.evaluate(()=>(window as any).events)).toEqual([{kind:'submit',prevented:true}]);
 await page.evaluate(()=>(window as any).update({noValidate:undefined}));await expect(page.locator('form')).toHaveJSProperty('noValidate',false);
});

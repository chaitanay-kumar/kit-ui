import {test,expect} from '@playwright/test';
for(const framework of ['react','angular'])test(framework+': standalone radio distinguishes native input events from visual callbacks',async({page})=>{
 await page.goto(`/e2e/fixtures/parity-batch47-form.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({mode:'radio-item',name:'choice',value:'a',label:'Standalone'}))}`);await page.waitForFunction(()=>(window as any).ready&&document.querySelector('input[type=radio]'));
 await page.locator('input').evaluate(node=>(node.nextElementSibling as HTMLElement).click());await page.locator('input').focus();await page.keyboard.press('Space');await expect.poll(()=>page.evaluate(()=>(window as any).events)).toEqual([{kind:'radio-item',args:0},{kind:'radio-item',args:1,type:'change'}]);
 await page.evaluate(()=>(window as any).update({throwChange:true}));await page.locator('input').focus();await page.keyboard.press('Space');await expect.poll(()=>page.evaluate(()=>(window as any).errors)).toEqual(['change failed']);expect(await page.evaluate(()=>(window as any).events.at(-1))).toEqual({kind:'radio-item',args:1,type:'change'});
});

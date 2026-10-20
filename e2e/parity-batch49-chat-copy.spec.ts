import {test,expect} from '@playwright/test';

for(const framework of ['react','angular'])for(const outcome of ['success','rejection','fallback']){
 test(`${framework}: Chat optimistic copy and independent resets (${outcome})`,async({page})=>{
  await page.addInitScript(({outcome})=>{
   (window as any).copiedTexts=[];
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:outcome==='fallback'?undefined:{writeText:(text:string)=>{(window as any).copiedTexts.push(text);return outcome==='rejection'?Promise.reject(new Error('denied')):Promise.resolve()}}});
   if(outcome==='fallback')document.execCommand=(command:string)=>{if(command==='copy')(window as any).copiedTexts.push((document.activeElement as HTMLTextAreaElement).value);return false};
  },{outcome});
  const initial={message:{id:'copy',role:'assistant',content:'Plain text\n```ts\nconst value = 1;\n```'}};
  await page.goto(`/e2e/fixtures/parity-batch49-chat.html?framework=${framework}&mode=message&initial=${encodeURIComponent(JSON.stringify(initial))}`);
  await page.waitForFunction(()=>(window as any).ready);
  await expect(page.getByRole('button',{name:'Copy message',exact:true})).toBeVisible();
  await page.clock.install();
  await page.getByRole('button',{name:'Copy message',exact:true}).click();
  await expect(page.getByRole('button',{name:'Message copied',exact:true})).toBeVisible();
  await page.clock.runFor(1000);
  await page.getByRole('button',{name:'Message copied',exact:true}).click();
  await page.getByRole('button',{name:'Copy',exact:true}).click();
  await expect(page.getByRole('button',{name:'Copied',exact:true})).toBeVisible();
  await page.clock.runFor(1100);
  await expect(page.getByRole('button',{name:'Copy message',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Copied',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>(window as any).copiedTexts)).toEqual([initial.message.content,initial.message.content,'const value = 1;']);
  await page.clock.runFor(1100);
  await expect(page.getByRole('button',{name:'Copy',exact:true})).toBeVisible();
  expect(await page.locator('body>textarea').count()).toBe(0);
 });
}

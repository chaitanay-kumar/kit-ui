import {test,expect} from '@playwright/test';

for(const framework of ['react','angular']){
 test(`${framework}: Chat composer grows, shrinks and sends attachments without text`,async({page})=>{
  await page.goto(`/e2e/fixtures/parity-batch49-chat.html?framework=${framework}`);
  await page.waitForFunction(()=>(window as any).ready);
  const input=page.locator('textarea');await expect(input).toBeVisible();
  await input.fill(Array.from({length:20},(_,index)=>`Line ${index}`).join('\n'));
  await expect.poll(()=>input.evaluate(node=>node.style.height)).toBe('160px');
  await input.fill('small');await expect.poll(()=>input.evaluate(node=>parseFloat(node.style.height))).toBeLessThan(160);
  await input.fill('   ');
  await page.locator('input[type=file]').setInputFiles([{name:'remove.txt',mimeType:'text/plain',buffer:Buffer.from('remove')},{name:'keep.png',mimeType:'image/png',buffer:Buffer.alloc(1024)}]);
  await expect(page.locator('input[type=file]')).toHaveValue('');
  await page.getByText('remove.txt',{exact:true}).locator('..').getByRole('button').click();
  await expect(page.getByText('remove.txt',{exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Send message',exact:true}).click();
  const sent=await page.evaluate(()=>(window as any).events);
  expect(sent).toHaveLength(1);expect(sent[0].args[0]).toBe('');
  expect(sent[0].args[1].map(({name,size,type}:any)=>({name,size,type}))).toEqual([{name:'keep.png',size:'1.0 KB',type:'image'}]);
  await expect(input).toHaveValue('');await expect(page.getByRole('button',{name:'Send message',exact:true})).toBeDisabled();
 });
 test(`${framework}: Chat scrolls after external message and generation changes`,async({page})=>{
  await page.addInitScript(()=>{(window as any).scrollCalls=[];Element.prototype.scrollIntoView=function(options){(window as any).scrollCalls.push(options)}});
  await page.goto(`/e2e/fixtures/parity-batch49-chat.html?framework=${framework}`);await page.waitForFunction(()=>(window as any).ready);
  await page.evaluate(()=>(window as any).update({messages:[{id:'one',role:'assistant',content:'External message'}]}));
  await expect.poll(()=>page.evaluate(()=>(window as any).scrollCalls.length)).toBeGreaterThan(0);
  const before=await page.evaluate(()=>(window as any).scrollCalls.length);
  await page.evaluate(()=>(window as any).update({isGenerating:true}));
  await expect.poll(()=>page.evaluate(()=>(window as any).scrollCalls.length)).toBeGreaterThan(before);
  expect(await page.evaluate(()=>(window as any).scrollCalls.every((options:any)=>options.behavior==='smooth'))).toBe(true);
 });
}

import {test,expect} from '@playwright/test';
for(const framework of ['react','angular']){
 test(framework+': default simulation preserves processing, captured completion and removed-row behavior',async({page})=>{
  await page.clock.install();
  await page.goto(`/e2e/fixtures/parity-batch46-upload.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({mode:'simulate'}))}`);
  await page.waitForFunction(()=>(window as any).ready&&document.querySelector('input[type=file]'));
  await page.clock.pauseAt(new Date(Date.now()+1000));
  await page.locator('input[type=file]').setInputFiles({name:'simulation.txt',mimeType:'text/plain',buffer:Buffer.alloc(5)});
  await page.evaluate(()=>(window as any).update({tag:'new'}));
  for(const status of ['Uploading 18%','Uploading 36%','Uploading 54%','Uploading 72%','Processing...','Ready']){
   await page.clock.runFor(180);
   await page.evaluate(()=>(window as any).flush());
   const rows=await page.evaluate(()=>(window as any).rows());
   expect(rows[0].status).toBe(status);
  }
  expect(await page.evaluate(()=>(window as any).events.filter((event:any)=>event.type==='complete'))).toEqual([{type:'complete',name:'simulation.txt',progress:100,status:'complete',tag:'old',original:false,unbound:true}]);
  await page.locator('input[type=file]').setInputFiles({name:'removed.txt',mimeType:'text/plain',buffer:Buffer.alloc(5)});
  await page.evaluate(()=>(window as any).flush());
  await page.getByRole('button',{name:'Remove removed.txt'}).evaluate(node=>(node as HTMLButtonElement).click());
  await page.clock.runFor(1200);await page.evaluate(()=>(window as any).flush());
  expect(await page.evaluate(()=>(window as any).events.filter((event:any)=>event.type==='complete').length)).toBe(1);
 });
 test(framework+': single selection and zero visible capacity retain source task ownership',async({page})=>{
  await page.goto(`/e2e/fixtures/parity-batch46-upload.html?framework=${framework}&initial=${encodeURIComponent(JSON.stringify({multiple:false,maxFiles:0}))}`);
  await page.waitForFunction(()=>(window as any).ready&&document.querySelector('input[type=file]'));
  await page.evaluate(()=>(window as any).drop([{name:'first.txt',size:5},{name:'second.txt',size:5}]));
  expect(await page.evaluate(()=>(window as any).rows())).toEqual([]);
  expect(await page.evaluate(()=>(window as any).pending.map((entry:any)=>entry.item.name))).toEqual(['first.txt']);
  await page.evaluate(()=>(window as any).resolve(0));
  await expect.poll(()=>page.evaluate(()=>(window as any).events.filter((event:any)=>event.type==='complete').map((event:any)=>event.name))).toEqual(['first.txt']);
 });
}

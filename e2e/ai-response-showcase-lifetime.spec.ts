import {test,expect} from '@playwright/test';

for(const framework of ['react','angular'])test(`${framework} response demo cancels replaced streams`,async({page})=>{
  await page.goto(`${process.env.HOSTED_QA_URL||''}/components/ai-response?framework=${framework}`);
  const root=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
  const error=root.getByRole('button',{name:'error',exact:true}),complete=root.getByRole('button',{name:'complete',exact:true});
  await expect(complete).toBeVisible({timeout:15000});
  await root.getByRole('button',{name:'Simulate Stream',exact:true}).click();await error.click();
  await expect(root.getByText('Rate limit exceeded: Please wait 12s before re-requesting.',{exact:true})).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(root.getByText('Rate limit exceeded: Please wait 12s before re-requesting.',{exact:true})).toBeVisible();
  await root.getByRole('button',{name:'Simulate Stream',exact:true}).click();await page.waitForTimeout(750);await complete.click();
  await expect(root.getByRole('heading',{name:'Component Analysis & Optimization',exact:true})).toBeVisible();
  await page.waitForTimeout(300);
  await expect(root.getByText('Feel free to request a custom benchmark or bundle size breakdown.',{exact:true})).toBeVisible();
});

// React unmount keeps the same window, so explicit timer disposal is observable.
// Removing Angular's iframe destroys its window without calling wrapped clear APIs.
for(const framework of ['react'])for(const phase of ['delay','stream'])test(`${framework} response demo clears ${phase} timer on framework switch`,async({page})=>{
 await page.goto(`/components/ai-response?framework=${framework}`);
 const root=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
 const start=root.getByRole('button',{name:'Simulate Stream',exact:true});await expect(start).toBeVisible({timeout:15000});
 await page.evaluate(()=>{(window as any).__demoTimers=0});
 await start.evaluate(()=>{
  const owner=window.parent as Window&{__demoTimers:number},timeouts=new Set<number>(),intervals=new Set<number>();
  const timeout=window.setTimeout.bind(window),interval=window.setInterval.bind(window),clearTimeoutOriginal=window.clearTimeout.bind(window),clearIntervalOriginal=window.clearInterval.bind(window);
  window.setTimeout=((callback:()=>void,delay?:number,...args:unknown[])=>{if(delay!==600)return timeout(callback,delay,...args);const id=timeout(()=>{if(timeouts.delete(id))owner.__demoTimers--;callback()},delay);timeouts.add(id);owner.__demoTimers++;return id}) as typeof window.setTimeout;
  window.clearTimeout=(id?:number)=>{if(id!==undefined&&timeouts.delete(id))owner.__demoTimers--;clearTimeoutOriginal(id)};
  window.setInterval=((callback:()=>void,delay?:number,...args:unknown[])=>{const id=interval(callback,delay,...args);if(delay===50){intervals.add(id);owner.__demoTimers++}return id}) as typeof window.setInterval;
  window.clearInterval=(id?:number)=>{if(id!==undefined&&intervals.delete(id))owner.__demoTimers--;clearIntervalOriginal(id)};
 });
 await start.click();await expect.poll(()=>page.evaluate(()=>(window as any).__demoTimers)).toBe(1);
 if(phase==='stream'){await page.waitForTimeout(750);await expect(root.getByText('Streaming',{exact:true})).toBeVisible();await expect.poll(()=>page.evaluate(()=>(window as any).__demoTimers)).toBe(1)}
 await page.getByRole('group',{name:'Component framework',exact:true}).getByRole('button',{name:framework==='react'?'Angular':'React',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>(window as any).__demoTimers)).toBe(0);
});

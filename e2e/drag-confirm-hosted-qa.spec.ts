import {test,expect,type Locator} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {captureComponent} from './helpers/capture-component';

async function trackPaint(slider:Locator){return slider.locator('..').evaluate(el=>{
 const canvas=document.createElement('canvas'),c=canvas.getContext('2d')!;
 const paint=(value:string)=>{c.clearRect(0,0,1,1);c.fillStyle=value;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data]};
 return [el,...el.children].filter(node=>node.tagName==='DIV').map(node=>{const s=getComputedStyle(node);return{background:paint(s.backgroundColor),color:paint(s.color),border:parseFloat(s.borderRightWidth)>0?paint(s.borderRightColor):null}});
})}

for(const theme of ['light','dark'])test(`Drag confirmation showcase matches React in ${theme}`,async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const samples:Record<string,unknown[]>={react:[],angular:[]};
  for(const framework of ['react','angular']){
    await page.goto(`${process.env.HOSTED_QA_URL||''}/components/drag-to-confirm?framework=${framework}`);
    const root=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const slider=root.getByRole('slider');await expect(slider).toHaveAccessibleName('Slide to delete database →',{timeout:15000});
    await page.mouse.move(1,1);await page.waitForTimeout(600);
    const card=root.getByText('Drag slider or press Enter / Space to trigger',{exact:true}).locator('..').locator('..');
    const origin=await card.evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y}});
    for(const node of [card,slider,slider.locator('..'),slider.locator('..').locator(':scope > div').nth(1),root.getByRole('button',{name:'delete',exact:true}),root.getByRole('button',{name:'md',exact:true}),root.getByText('Drag slider or press Enter / Space to trigger',{exact:true}),root.getByRole('button',{name:'Reset',exact:true})]){
      await node.evaluate(()=>document.fonts.ready);
      samples[framework].push(await node.evaluate((el,origin)=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();const paint=(color:string)=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const c=canvas.getContext('2d')!;c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data]};return{text:el.textContent,font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight,color:paint(s.color),background:paint(s.backgroundColor),border:parseFloat(s.borderTopWidth)>0?paint(s.borderTopColor):null,radius:Math.min(parseFloat(s.borderTopLeftRadius),r.width/2,r.height/2),padding:s.padding,x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height}},origin));
    }
    const viewport=page.viewportSize()!,box=(await root.boundingBox())!;await page.setViewportSize({...viewport,height:Math.max(viewport.height,Math.ceil(box.height)+640)});await page.evaluate(()=>window.scrollTo(0,0));
    await card.scrollIntoViewIfNeeded();await writeFile(info.outputPath(`${framework}-capture-box.json`),JSON.stringify({box:await card.boundingBox(),viewport:page.viewportSize()}));await captureComponent(page,card,info.outputPath(`${framework}-card.png`));await page.setViewportSize(viewport);
    for(const [action,label,title] of [['delete','delete database','Destructive Action'],['confirm','confirm release','Deployment Release'],['unlock','unlock vault','Access Security'],['archive','archive project','Archive Project'],['submit','transfer funds','Transfer Funds']]){
      await root.getByRole('button',{name:action,exact:true}).click();await expect(slider).toHaveAccessibleName(`Slide to ${label} →`);
      await page.mouse.move(1,1);await page.waitForTimeout(250);samples[framework].push({action,idle:await trackPaint(slider)});
      await slider.focus();await page.keyboard.press('Enter');await expect(root.getByText(`Confirmed: ${title}`,{exact:true})).toBeVisible();
      await page.mouse.move(1,1);await page.waitForTimeout(500);samples[framework].push({action,confirmed:await trackPaint(slider)});
      await root.getByRole('button',{name:'Reset',exact:true}).click();await expect(root.getByText('Drag slider or press Enter / Space to trigger',{exact:true})).toBeVisible();
    }
    for(const [size,height] of [['sm',40],['md',48],['lg',56]] as const){await root.getByRole('button',{name:size,exact:true}).click();await expect.poll(()=>slider.locator('..').evaluate(el=>el.getBoundingClientRect().height)).toBe(height)}
    await slider.focus();await page.keyboard.press('Space');await expect(root.getByText('Confirmed: Transfer Funds',{exact:true})).toBeVisible();
    await expect(root.getByText('Drag slider or press Enter / Space to trigger',{exact:true})).toBeVisible({timeout:4000});
  }
  await writeFile(info.outputPath('drag-contracts.json'),JSON.stringify(samples,null,2)+'\n');expect(samples.angular).toEqual(samples.react);expect(errors).toEqual([]);
});

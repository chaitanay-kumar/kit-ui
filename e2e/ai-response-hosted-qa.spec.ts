import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {captureComponent} from './helpers/capture-component';

for(const theme of ['light','dark'])test(`AI response showcase matches React in ${theme}`,async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
 const samples:Record<string,unknown[]>={react:[],angular:[]};
 for(const framework of ['react','angular']){
  await page.goto(`${process.env.HOSTED_QA_URL||''}/components/ai-response?framework=${framework}`);
  const root=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
  const heading=root.getByRole('heading',{name:'Component Analysis & Optimization',exact:true});await expect(heading).toBeVisible({timeout:15000});
  await expect(root.getByText('Claude 3.7 Sonnet',{exact:true})).toBeVisible();await expect(root.getByText('Just now',{exact:true})).toHaveCount(1);if(page.viewportSize()!.width>=640)await expect(root.getByText('Just now',{exact:true})).toBeVisible();else await expect(root.getByText('Just now',{exact:true})).toBeHidden();
  const sources=root.getByRole('button',{name:'Cited Sources (3)',exact:true});await expect(sources).toHaveAttribute('aria-expanded','true');
  await page.mouse.move(1,1);await page.waitForTimeout(1000);
  const card=heading.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," rounded-2xl ")][1]');const origin=await card.evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y}});
  if(framework==='angular')await expect.poll(()=>card.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight})).toBe(true);
  samples[framework].push({content:(await card.locator('h2,h3,h4,p,li,pre').allTextContents()).map(text=>text.replace(/\s+/g,' ').trim())});
  for(const node of [card,heading,root.getByText('Claude 3.7 Sonnet',{exact:true}),root.getByRole('button',{name:'complete',exact:true}),root.getByRole('button',{name:'Simulate Stream',exact:true}),root.getByRole('button',{name:'Copy code to clipboard',exact:true}),sources,root.getByRole('button',{name:'Regenerate response',exact:true}),root.getByRole('link').first()]){
   await node.evaluate(()=>document.fonts.ready);samples[framework].push(await node.evaluate((el,origin)=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();const paint=(color:string)=>{const c=document.createElement('canvas').getContext('2d')!;c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data]};return{decoration:s.textDecorationLine,font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight,color:paint(s.color),background:paint(s.backgroundColor),border:parseFloat(s.borderTopWidth)>0?paint(s.borderTopColor):null,radius:s.borderRadius,padding:s.padding,x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height}},origin));
  }
  const viewport=page.viewportSize()!,box=(await root.boundingBox())!;await page.setViewportSize({...viewport,height:Math.max(viewport.height,Math.ceil(box.height)+640)});await page.evaluate(()=>window.scrollTo(0,0));await card.scrollIntoViewIfNeeded();await captureComponent(page,card,info.outputPath(`${framework}-response.png`));await page.setViewportSize(viewport);
  await root.getByRole('button',{name:'Used 3 tools',exact:true}).click();for(const tool of ['read_codebase_tokens','verify_wcag_contrast','generate_motion_spec'])await expect(root.getByText(tool,{exact:true})).toBeVisible();
  const links=root.getByRole('link');await expect(links).toHaveCount(3);expect(await links.evaluateAll(nodes=>nodes.map(node=>[node.getAttribute('href'),node.getAttribute('target'),node.getAttribute('rel')]))).toEqual([['https://github.com/chaitanay-kumar/kit-ui','_blank','noopener noreferrer'],['https://github.com/chaitanay-kumar/kit-ui','_blank','noopener noreferrer'],['https://www.w3.org/WAI/standards-guidelines/wcag/','_blank','noopener noreferrer']]);
  await sources.click();await expect(sources).toHaveAttribute('aria-expanded','false');await sources.click();await expect(sources).toHaveAttribute('aria-expanded','true');
  await root.getByRole('button',{name:'Good response',exact:true}).click();await expect(root.getByRole('button',{name:'Good response',exact:true})).toHaveClass(/bg-surface-raised/);
  await root.getByRole('button',{name:'Regenerate response',exact:true}).click();await expect(root.getByRole('button',{name:'Regenerate response',exact:true})).toBeDisabled();
  await expect(heading).toBeVisible({timeout:6000});await expect(root.getByText('Feel free to request a custom benchmark or bundle size breakdown.',{exact:true})).toBeVisible({timeout:6000});await expect(root.getByRole('button',{name:'Regenerate response',exact:true})).toBeEnabled({timeout:6000});
 }
 await writeFile(info.outputPath('response-contracts.json'),JSON.stringify(samples,null,2)+'\n');expect(samples.angular).toEqual(samples.react);expect(errors).toEqual([]);
});

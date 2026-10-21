import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium,devices} from 'playwright';
import {expect} from '@playwright/test';
import sharp from 'sharp';

const base=process.env.QA_SITE_URL??'https://chaitanay-kumar.github.io/kit-ui';
const out=path.resolve('logs/hosted-qa',process.env.QA_LABEL??'search-pixels');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge'});const results=[];
try{for(const mobile of [false,true])for(const theme of ['light','dark']){
 const context=await browser.newContext({...mobile?devices['Pixel 7']:{viewport:{width:1440,height:1000}},deviceScaleFactor:1,reducedMotion:'reduce'});
 await context.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);const page=await context.newPage();
 const captures={};
 for(const framework of ['react','angular']){
  await page.goto(`${base}/components/expandable-search/?framework=${framework}`,{waitUntil:'networkidle'});
  const scope=framework==='react'?page:page.frameLocator('iframe');const input=scope.locator('input[placeholder="Quick search..."]');await expect(input).toBeVisible();
  await input.evaluate(()=>document.fonts.ready);const control=input.locator('..');await expect(control).toHaveCSS('width','160px');
  await control.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.waitForTimeout(350);
  const visibleBox=await control.boundingBox();
  await page.evaluate(delta=>window.scrollBy(0,delta),visibleBox.y+visibleBox.height/2-page.viewportSize().height/2);
  // Normalize only subpixel placement; preserve the actual rendered dimensions,
  // styles, text and icons. Rounded exterior pixels depend on the demo stage.
  const box=await control.boundingBox();
  await control.evaluate((el,position)=>{el.style.translate=`${Math.round(position.x)-position.x}px ${Math.round(position.y)-position.y}px`},box);
  if(process.env.QA_COMPOSITED==='1')await control.evaluate(el=>{el.style.transform='translateZ(0)'});
  const png=await control.screenshot();const label=`${mobile?'mobile':'desktop'}-${theme}-${framework}`;await fs.writeFile(path.join(out,`${label}.png`),png);
  captures[framework]=await sharp(png).removeAlpha().raw().toBuffer({resolveWithObject:true});
 }
 const a=captures.react,b=captures.angular;if(a.info.width!==b.info.width||a.info.height!==b.info.height)throw Error('Control raster dimensions differ');
 let changed=0,total=0;const diff=Buffer.alloc(a.data.length);for(let y=5;y<a.info.height-5;y++)for(let x=14;x<a.info.width-14;x++){const i=(y*a.info.width+x)*3;let different=false;for(let c=0;c<3;c++){diff[i+c]=Math.abs(a.data[i+c]-b.data[i+c]);if(diff[i+c]>8)different=true}if(different)changed++;total++}
 await sharp(diff,{raw:{width:a.info.width,height:a.info.height,channels:3}}).png().toFile(path.join(out,`${mobile?'mobile':'desktop'}-${theme}-diff.png`));
 results.push({viewport:mobile?'mobile':'desktop',theme,changedPixels:changed,comparedPixels:total,changedRatio:changed/total,channelThreshold:8,normalization:`integer position; omit rounded exterior${process.env.QA_COMPOSITED==='1'?'; both controls on compositor layers':''}`});console.log(results.at(-1));await context.close();
}}finally{await browser.close();await fs.writeFile(path.join(out,'results.json'),JSON.stringify({site:base,results},null,2))}

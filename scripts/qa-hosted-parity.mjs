import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium, devices} from 'playwright';
import sharp from 'sharp';

// Capture the deployed application, including its real native Angular iframe.
// Raw stage pixel differences are triage evidence, not a parity assertion:
// demo content, enclosing stages and live animation may differ.
const base=process.env.QA_SITE_URL??'https://chaitanay-kumar.github.io/kit-ui';
const mode=process.env.QA_MODE??'desktop-light';
const mobile=mode.startsWith('mobile');const theme=mode.endsWith('dark')?'dark':'light';
const out=path.resolve('logs/hosted-qa',process.env.QA_CAPTURE_SET??'',mode);await fs.mkdir(out,{recursive:true});
const inventory=await fs.readFile('docs/ANGULAR_REACT_PARITY.md','utf8');
const catalog=inventory.split('\n').filter(line=>/^\| \d+ \|/.test(line)).map(line=>{const cells=line.split('|');return {id:cells[3].trim().replaceAll('`',''),name:cells[2].trim()}});
if(catalog.length!==116||new Set(catalog.map(e=>e.id)).size!==116)throw Error('Expected 116 unique inventory components');
const filter=process.env.QA_IDS?.split(',');const entries=filter?catalog.filter(e=>filter.includes(e.id)):catalog;
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL??'msedge'});
const context=await browser.newContext({...mobile?devices['Pixel 7']:{viewport:{width:1440,height:1000},deviceScaleFactor:1},reducedMotion:'reduce'});
await context.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
const page=await context.newPage();
const results=process.env.QA_RESUME==='1'?JSON.parse(await fs.readFile(path.join(out,'results.json'),'utf8').catch(()=>'[]')):[];
let captured=0;
async function metrics(locator){return locator.evaluate(root=>{
 const box=root.getBoundingClientRect();const nodes=[...root.querySelectorAll('button,input,select,h1,h2,h3,p,a')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&r.height}).slice(0,160);
 return {width:box.width,height:box.height,text:root.innerText,overflow:root.scrollWidth>root.clientWidth+1,elements:nodes.map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {tag:el.tagName,text:(el.textContent??'').trim(),label:el.getAttribute('aria-label'),width:r.width,height:r.height,font:s.fontFamily,size:s.fontSize,lineHeight:s.lineHeight,weight:s.fontWeight,color:s.color,background:s.backgroundColor,border:s.borderColor,radius:s.borderRadius,padding:s.padding}})};
})}
try{for(const entry of entries){
 if(process.env.QA_RESUME==='1'&&results.some(r=>r.id===entry.id&&!r.errors.length)&&await Promise.all(['react','angular'].map(f=>fs.access(path.join(out,`${entry.id}-${f}.png`)).then(()=>true,()=>false))).then(values=>values.every(Boolean)))continue;
 const result={id:entry.id,mode,site:base,frameworks:{},errors:[]};
 for(const framework of ['react','angular']){const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
 try{const response=await page.goto(`${base}/components/${entry.id}/?framework=${framework}`,{waitUntil:'networkidle',timeout:45000});
 if(response.status()!==200)throw Error(`HTTP ${response.status()}`);
 await page.getByRole('heading',{name:entry.name,exact:true}).first().waitFor();
 const panel=page.locator('#component-panel-preview');await panel.waitFor();
 let stage;if(framework==='angular'){await page.frameLocator('iframe').locator('main[aria-label="Native Angular demo"]').waitFor();stage=page.locator('iframe');await page.frameLocator('iframe').locator('body').evaluate(()=>document.fonts.ready)}else{stage=panel.locator(':scope > div').first().locator(':scope > div').last();await page.evaluate(()=>document.fonts.ready)}
 await stage.scrollIntoViewIfNeeded();await page.waitForTimeout(450);
 const content=framework==='angular'?page.frameLocator('iframe').locator('main[aria-label="Native Angular demo"]'):stage;
 result.frameworks[framework]=await metrics(content);result.frameworks[framework].errors=errors;
 await stage.screenshot({path:path.join(out,`${entry.id}-${framework}.png`),timeout:15000});
 }catch(e){result.errors.push(`${framework}: ${e.message}`)}finally{page.off('pageerror',listener)}
 }
 try{const files=await Promise.all(['react','angular'].map(f=>sharp(path.join(out,`${entry.id}-${f}.png`)).flatten({background:theme==='dark'?'#18181b':'#f1f1f2'}).ensureAlpha().raw().toBuffer({resolveWithObject:true})));
 const width=Math.max(...files.map(f=>f.info.width)),height=Math.max(...files.map(f=>f.info.height));
 await sharp({create:{width:width*2,height,channels:4,background:theme==='dark'?'#18181b':'#f1f1f2'}}).composite(await Promise.all(['react','angular'].map(async(f,i)=>({input:await fs.readFile(path.join(out,`${entry.id}-${f}.png`)),left:i*width,top:0})))).png().toFile(path.join(out,`${entry.id}-pair.png`));
 if(files[0].info.width===files[1].info.width&&files[0].info.height===files[1].info.height){let changed=0;for(let i=0;i<files[0].data.length;i+=4)if([0,1,2].some(c=>Math.abs(files[0].data[i+c]-files[1].data[i+c])>8))changed++;result.rawStageChangedRatio=changed/(width*height)}
 }catch(e){result.errors.push(`image: ${e.message}`)}
 const index=results.findIndex(r=>r.id===entry.id);if(index<0)results.push(result);else results[index]=result;
 await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log(`${++captured} captured / ${entries.length} requested, ${mode} ${entry.id}: ${result.errors.length?'ERROR':'captured'}`);
}}finally{await browser.close()}
const failures=results.filter(r=>r.errors.length||Object.values(r.frameworks).some(f=>f.errors.length)).length;
console.log(`Capture complete: ${results.length} components; ${failures} with errors. Evidence: ${out}`);
if(failures)process.exitCode=1;

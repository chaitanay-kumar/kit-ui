import {test,expect,type Locator} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {captureComponent} from './helpers/capture-component';

async function measure(node:Locator,origin:{x:number;y:number}){
  await node.evaluate(()=>document.fonts.ready);
  return node.evaluate((el,origin)=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return{font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight,color:s.color,background:s.backgroundColor,border:parseFloat(s.borderTopWidth)>0?s.borderColor:null,radius:s.borderRadius,padding:s.padding,x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height}},origin);
}
for(const theme of ['light','dark'])test(`Form hosted configuration matches React in ${theme}`,async({page},info)=>{
  const errors:string[]=[],dialogs:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('dialog',async dialog=>{dialogs.push(dialog.message());await dialog.accept()});
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const samples:Record<string,unknown[]>={react:[],angular:[]};
  const captures:Record<string,unknown>={};
  for(const framework of ['react','angular']){
    await page.goto(`${process.env.HOSTED_QA_URL||''}/components/form?framework=${framework}`);
    const root=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const input=root.getByRole('textbox'),select=root.getByRole('combobox'),save=root.getByRole('button',{name:'Save Configuration',exact:true}),toggle=root.getByRole('switch');
    await expect(input).toHaveValue('Kit UI Studio',{timeout:15000});await expect(select).toHaveValue('us-east');
    await page.mouse.move(1,1);
    await expect(root.locator('input[type=checkbox]')).toBeChecked();await expect(toggle).toHaveAttribute('aria-checked','true');
    await page.waitForTimeout(600);
    const card=root.getByText('Interactive Form System',{exact:true}).locator('..');await card.evaluate(()=>document.fonts.ready);const origin=await card.evaluate(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y}});
    for(const node of [card,input,select,root.getByText('Visible across your team members.',{exact:true}),save,toggle])samples[framework].push(await measure(node,origin));
    const viewport=page.viewportSize()!,box=(await root.boundingBox())!;
    await page.setViewportSize({...viewport,height:Math.max(viewport.height,Math.ceil(box.height)+440)});await page.evaluate(()=>window.scrollTo(0,0));
    await root.screenshot({path:info.outputPath(`${framework}-form.png`)});
    const {png,...capture}=await captureComponent(page,root.getByText('Interactive Form System',{exact:true}).locator('..'),info.outputPath(`${framework}-card.png`));void png;captures[framework]=capture;
    await page.setViewportSize(viewport);
    await input.fill('Renamed project');await expect(input).toHaveValue('Renamed project');
    for(const region of ['eu-central','ap-southeast','us-east']){await select.selectOption(region);await expect(select).toHaveValue(region)}
    await root.locator('label').filter({hasText:'Enable Edge Caching'}).click();await expect(root.locator('input[type=checkbox]')).not.toBeChecked();
    await toggle.focus();await page.keyboard.press('Space');await expect(toggle).toHaveAttribute('aria-checked','false');
    await save.click();await expect.poll(()=>dialogs.length).toBe(framework==='react'?1:2);
  }
  await info.attach('form-contracts',{body:JSON.stringify(samples,null,2),contentType:'application/json'});
  await info.attach('capture-boxes',{body:JSON.stringify(captures,null,2),contentType:'application/json'});
  await writeFile(info.outputPath('form-contracts.json'),JSON.stringify(samples,null,2)+'\n');
  await writeFile(info.outputPath('capture-boxes.json'),JSON.stringify(captures,null,2)+'\n');
  expect((captures.angular as {pixels:unknown}).pixels).toEqual((captures.react as {pixels:unknown}).pixels);
  expect(samples.angular).toEqual(samples.react);expect(dialogs).toEqual(['Form submitted successfully!','Form submitted successfully!']);expect(errors).toEqual([]);
});

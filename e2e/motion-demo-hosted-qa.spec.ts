import {test,expect,type Locator,type Page,type TestInfo} from '@playwright/test';

const scope=(page:Page,framework:string)=>framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
const open=async(page:Page,id:string,framework:string)=>page.goto(`${process.env.HOSTED_QA_URL||''}/components/${id}?framework=${framework}`);
async function measure(locator:Locator){
  await locator.evaluate(()=>document.fonts.ready);
  return locator.evaluate(el=>{
    const s=getComputedStyle(el),r=el.getBoundingClientRect(),canvas=document.createElement('canvas');canvas.width=canvas.height=1;
    const context=canvas.getContext('2d')!;
    const paint=(value:string)=>{context.clearRect(0,0,1,1);context.fillStyle=value;context.fillRect(0,0,1,1);return Array.from(context.getImageData(0,0,1,1).data)};
    const border=parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none'?s.borderColor:null;
    return {font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight,color:paint(s.color),background:paint(s.backgroundColor),border:border?paint(border):null,radius:s.borderRadius,padding:s.padding,width:r.width,height:r.height,rawColors:{color:s.color,background:s.backgroundColor,border}};
  });
}
function comparable(values:unknown[]){return values.map(value=>{if(value&&typeof value==='object'&&!Array.isArray(value)){const {rawColors,...painted}=value as Record<string,unknown>;void rawColors;return painted}return value})}
async function capture(page:Page,root:Locator,info:TestInfo,name:string){
  const viewport=page.viewportSize()!,box=(await root.boundingBox())!;
  await page.setViewportSize({...viewport,height:Math.max(viewport.height,Math.ceil(box.height)+440)});
  await page.evaluate(()=>window.scrollTo(0,0));
  if(name.includes('glyph'))await page.waitForTimeout(800);
  await root.screenshot({path:info.outputPath(`${name}.png`)});
  await page.setViewportSize(viewport);
}
for(const theme of ['light','dark']){
  test(`Depth Corridor hosted telemetry and navigation in ${theme}`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
    const samples:Record<string,unknown[]>={react:[],angular:[]};
    for(const framework of ['react','angular']){
      await open(page,'depth-corridor',framework);const root=scope(page,framework),region=root.getByRole('region',{name:'3D Depth Corridor Carousel'});
      await expect(region).toBeVisible({timeout:15000});
      await expect(root.getByText('● 12.4ms avg global latency',{exact:true})).toBeVisible();
      await page.mouse.move(1,1);await page.waitForTimeout(1200);
      samples[framework].push(await measure(region),await measure(root.getByRole('heading',{name:'Edge Telemetry Gateway',exact:true})),await measure(root.getByText('Real-time routing engine',{exact:true})));
      await expect(root.getByRole('button',{name:'Previous layer'})).toBeDisabled();
      await capture(page,root,info,`${framework}-depth`);
      const titles=['Serverless Worker Pool','Distributed State Cache','Cold Storage Archive'];
      for(const title of titles){
        await root.getByRole('button',{name:'Next layer'}).click();
        await page.mouse.move(1,1);await page.waitForTimeout(1200);
        const card=root.getByRole('heading',{name:title,exact:true}).locator('..').locator('..');
        const width=(await card.boundingBox())!.width;
        expect(Math.abs(width-(page.viewportSize()!.width<640?288:320))).toBeLessThan(.8);
      }
      await expect(root.getByRole('button',{name:'Next layer'})).toBeDisabled();
      await region.focus();await page.keyboard.press('ArrowLeft');
      await expect(root.getByRole('button',{name:'Next layer'})).toBeEnabled();
    }
    await info.attach('contracts',{body:JSON.stringify(samples,null,2),contentType:'application/json'});
    expect(comparable(samples.angular)).toEqual(comparable(samples.react));
    expect(errors).toEqual([]);
  });
  test(`Torque Dial hosted gain, wheel and keyboard in ${theme}`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
    const samples:Record<string,unknown[]>={react:[],angular:[]};
    for(const framework of ['react','angular']){
      await open(page,'torque-dial',framework);const root=scope(page,framework),slider=root.getByRole('slider',{name:'Master Output Gain'});
      await expect(slider).toBeVisible({timeout:15000});
      await expect(slider).toHaveAttribute('aria-valuenow','48');
      await expect(root.getByText('Click and drag or use mouse wheel to rotate dial with physical momentum',{exact:true})).toBeVisible();
      samples[framework].push(await measure(slider),await measure(root.getByText('48%',{exact:true})),await measure(root.getByText('Master Output Gain',{exact:true})));
      samples[framework].push(await slider.locator('circle').evaluateAll(els=>els.map(el=>{const s=getComputedStyle(el);return {stroke:s.stroke,fill:s.fill,width:s.strokeWidth,dash:el.getAttribute('stroke-dasharray'),offset:el.getAttribute('stroke-dashoffset')}})));
      await capture(page,root,info,`${framework}-torque`);
      await slider.focus();await page.keyboard.press('End');await expect(slider).toHaveAttribute('aria-valuenow','100');
      await page.keyboard.press('Home');await expect(slider).toHaveAttribute('aria-valuenow','0');
      await page.keyboard.press('ArrowRight');await expect(slider).toHaveAttribute('aria-valuenow','1');
      await slider.hover();await page.mouse.wheel(0,-100);await expect(slider).toHaveAttribute('aria-valuenow','2');
    }
    await info.attach('contracts',{body:JSON.stringify(samples,null,2),contentType:'application/json'});
    expect(comparable(samples.angular)).toEqual(comparable(samples.react));
    expect(errors).toEqual([]);
  });
  test(`Glyph Matrix hosted overlay and playback controls in ${theme}`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
    const samples:Record<string,unknown[]>={react:[],angular:[]};
    for(const framework of ['react','angular']){
      await page.emulateMedia({reducedMotion:info.project.name==='mobile'?'reduce':'no-preference'});
      await open(page,'glyph-matrix',framework);const root=scope(page,framework);
      const heading=root.getByRole('heading',{name:'Wake up, Neo...',exact:true});
      await expect(heading).toBeVisible({timeout:15000});
      samples[framework].push(await measure(heading),await measure(root.getByText('Interactive Canvas • Move cursor to scatter glyphs',{exact:true})),await measure(root.getByRole('button',{name:'1.2x',exact:true})));
      samples[framework].push(await root.locator('canvas').evaluate(el=>({width:el.width,height:el.height,cssWidth:getComputedStyle(el).width,cssHeight:getComputedStyle(el).height})));
      await capture(page,root,info,`${framework}-glyph`);
      // Restart through real controls under full motion, including on touch viewports.
      await page.emulateMedia({reducedMotion:'no-preference'});
      for(const name of ['Matrix Green','Cyber Cyan','Neon Pink','Amber Gold']){
        const button=root.getByTitle(name,{exact:true});await button.click();
        await page.waitForTimeout(200);
        expect((await button.boundingBox())!.width).toBeCloseTo(26.4,1);
        samples[framework].push(await button.evaluate(el=>({color:getComputedStyle(el).backgroundColor,border:getComputedStyle(el).borderColor,opacity:getComputedStyle(el).opacity})));
      }
      for(const speed of ['0.8x','1.2x','2x']){
        const button=root.getByRole('button',{name:speed,exact:true});await button.click();
        await page.waitForTimeout(200);
        samples[framework].push(await button.evaluate(el=>({color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor})));
      }
      const canvas=root.locator('canvas');
      const hasAmber=()=>canvas.evaluate(el=>{
        const data=el.getContext('2d')!.getImageData(0,0,el.width,el.height).data;
        for(let i=0;i<data.length;i+=4)if(data[i]>50&&data[i+1]>20&&data[i+2]<data[i]*.25)return true;
        return false;
      });
      await expect.poll(hasAmber,{timeout:5000}).toBe(true);
      await root.getByRole('button',{name:/Pause/}).click();await expect(root.getByRole('button',{name:/Resume/})).toBeVisible();
      await page.waitForTimeout(200);const paused=await canvas.evaluate(el=>el.toDataURL());
      await page.waitForTimeout(200);expect(await canvas.evaluate(el=>el.toDataURL())).toBe(paused);
      await root.getByRole('button',{name:/Resume/}).click();await expect(root.getByRole('button',{name:/Pause/})).toBeVisible();
      await expect.poll(hasAmber,{timeout:5000}).toBe(true);
      await capture(page,root,info,`${framework}-glyph-active`);
    }
    await info.attach('contracts',{body:JSON.stringify(samples,null,2),contentType:'application/json'});
    expect(comparable(samples.angular)).toEqual(comparable(samples.react));
    expect(errors).toEqual([]);
  });
}

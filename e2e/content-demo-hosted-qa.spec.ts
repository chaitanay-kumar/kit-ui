import {test,expect} from '@playwright/test';

for(const theme of ['light','dark'])test(`FAQ, Glitch and Peek showcase content and interaction in ${theme}`,async({page},testInfo)=>{
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const measurements:Record<string,unknown[]>={react:[],angular:[]};
  for(const framework of ['react','angular']){
    const scope=()=>framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const navigate=async(id:string)=>{
      await page.goto(`${process.env.HOSTED_QA_URL||''}/components/${id}?framework=${framework}`);
    };
    const capture=async(name:string)=>{
      const viewport=page.viewportSize()!;
      const box=(await scope().boundingBox())!;
      // Keep fixed navigation above the example while recording the full stage.
      await page.setViewportSize({...viewport,height:Math.max(viewport.height,Math.ceil(box.height)+440)});
      await page.evaluate(()=>window.scrollTo(0,0));
      await scope().screenshot({path:testInfo.outputPath(`${framework}-${name}.png`)});
      await page.setViewportSize(viewport);
    };
    await navigate('faq');
    const first=scope().getByRole('button',{name:/How do I add Kit UI/});
    const second=scope().getByRole('button',{name:/What makes Kit UI/});
    await expect(first).toHaveAttribute('aria-expanded','true');
    await first.evaluate(()=>document.fonts.ready);
    const measure=async(locator:ReturnType<typeof scope>)=>locator.evaluate(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return {font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,color:s.color,
        background:s.backgroundColor,padding:s.padding,radius:s.borderRadius,width:r.width,height:r.height};
    });
    measurements[framework].push(await measure(scope().getByPlaceholder('Search questions...')));
    measurements[framework].push(await measure(first));
    measurements[framework].push(await measure(scope().getByText(/You can install any component directly/)));
    await capture('faq');
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded','true');
    await expect(first).toHaveAttribute('aria-expanded','true');
    await scope().getByRole('button',{name:'Animation',exact:true}).click();
    await expect(first).toHaveCount(0);
    await expect(second).toBeVisible();
    await scope().getByRole('button',{name:'All',exact:true}).click();
    const search=scope().getByPlaceholder('Search questions...');
    await search.fill('no possible matching question');
    await expect(scope().getByText('No matching questions found.')).toBeVisible();
    await search.fill('');
    await first.focus();await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-expanded','false');

    await navigate('glitch-text');
    const input=scope().getByPlaceholder('Type text to animate...');
    await expect(input).toHaveValue('KIT_UI KINETIC MOTION');
    await input.fill('QA SAMPLE');
    await expect(scope().getByRole('heading',{name:/QA SAMPLE/})).toBeVisible();
    await scope().getByRole('button',{name:'hover',exact:true}).click();
    await expect(scope().getByText('Hover over the text to trigger glitch cycle')).toBeVisible();
    for(const variant of ['rgb-split','slice','vhs','scramble','pulse']){
      await scope().getByRole('button',{name:variant,exact:true}).click();
      await expect(scope().getByText(`variant: ${variant}`,{exact:true})).toBeVisible();
    }
    for(const intensity of ['low','medium','high']){
      await scope().getByRole('button',{name:intensity,exact:true}).click();
      await expect(scope().getByText(`intensity: ${intensity}`,{exact:true})).toBeVisible();
    }
    await scope().getByRole('button',{name:'click',exact:true}).click();
    await expect(scope().getByText('Click the text to trigger burst animation')).toBeVisible();
    await scope().getByRole('heading',{name:/QA SAMPLE/}).click();
    await scope().getByRole('button',{name:'continuous',exact:true}).click();
    await expect(scope().getByText('trigger: continuous',{exact:true})).toBeVisible();
    // The icon-only mobile retrigger sits beside the editable text input.
    await input.locator('..').getByRole('button').click();
    await input.fill('');
    await expect(scope().getByRole('heading',{name:/KIT_UI KINETIC MOTION/})).toBeVisible();
    await capture('glitch');

    await navigate('peek-card');
    const trigger=scope().getByText('Hover over: Payment #3948',{exact:true});
    await expect(trigger).toBeVisible();
    // The focusable component owns the projected trigger in both implementations.
    await trigger.locator('..').focus();
    await expect(scope().getByText('Alexander Wright',{exact:true})).toBeVisible();
    await expect(scope().getByText('$249.00',{exact:true})).toBeVisible();
    await expect(scope().getByText('Mastercard •••• 4242',{exact:true})).toBeVisible();
    // Sample settled card geometry after the source spring entrance.
    await page.waitForTimeout(800);
    measurements[framework].push(await measure(scope().getByText('$249.00',{exact:true})));
    measurements[framework].push(await measure(scope().getByText('Alexander Wright',{exact:true})));
    const panel=scope().getByText('$249.00',{exact:true}).locator('..').locator('..').locator('..');
    measurements[framework].push(await measure(panel));
    const panelBox=(await panel.boundingBox())!;
    const stageBox=(await scope().locator('[data-preview-stage]').boundingBox())!;
    expect(panelBox.y).toBeGreaterThanOrEqual(stageBox.y);
    expect(panelBox.y+panelBox.height).toBeLessThanOrEqual(stageBox.y+stageBox.height);
    expect(await panel.evaluate(el=>getComputedStyle(el).bottom!=='auto')).toBe(true);
    await capture('peek');
    await page.mouse.click(2,2);
    await expect(scope().getByText('Alexander Wright',{exact:true})).toHaveCount(0);
  }
  await testInfo.attach('measured-styles-and-boxes',{body:JSON.stringify(measurements,null,2),contentType:'application/json'});
  expect(measurements.angular).toEqual(measurements.react);
});

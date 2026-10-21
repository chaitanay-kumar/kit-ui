import {test,expect} from '@playwright/test';

for(const theme of ['light','dark'])test(`number ticker palette matches React in ${theme}`,async({page},info)=>{
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const samples:Record<string,unknown[]>={};
  for(const framework of ['react','angular']){
    await page.goto(`${process.env.HOSTED_QA_URL??''}/components/animated-number/?framework=${framework}`);
    const scope=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    let control=scope.getByRole('button',{name:'Simulate Ticker',exact:true});
    await expect(control).toBeVisible({timeout:15000});
    await control.evaluate(()=>document.fonts.ready);
    samples[framework]=[];
    for(const state of ['inactive','hover','focus','active']){
      if(state==='hover')await control.hover();
      else if(state==='focus'){await page.mouse.move(0,0);await control.focus();}
      else if(state==='active'){
        await control.press('Enter');
        control=scope.getByRole('button',{name:'Ticker Active',exact:true});
        await expect(control).toBeVisible();await page.mouse.move(0,0);
      }
      // Wait for React's color transition; compare canonical canvas RGBA so
      // equivalent CSS color-space serializations do not create false failures.
      await control.evaluate(el=>Promise.all(el.getAnimations().filter(a=>a instanceof CSSTransition).map(a=>a.finished)));
      samples[framework].push(await control.evaluate((el,state)=>{
        const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
        const context=canvas.getContext('2d')!;
        const rgba=(color:string)=>{context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);return Array.from(context.getImageData(0,0,1,1).data)};
        const style=getComputedStyle(el),dot=getComputedStyle(el.querySelector('span')!);
        const growth=el.closest('.number-demo')?.querySelector('.growth > span') || document.querySelector('#component-panel-preview .text-emerald-400 > span');
        if(!growth)throw new Error('Growth color sample not found');
        return {state,color:rgba(style.color),background:rgba(style.backgroundColor),border:rgba(style.borderTopColor),dot:rgba(dot.backgroundColor),growth:rgba(getComputedStyle(growth).color)};
      },state));
    }
    await control.press('Enter');
    await expect(scope.getByRole('button',{name:'Simulate Ticker',exact:true})).toBeVisible();
  }
  await info.attach('ticker-palette',{body:JSON.stringify(samples),contentType:'application/json'});
  expect(samples.angular).toEqual(samples.react);
});

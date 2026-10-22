import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {captureComponent} from './helpers/capture-component';
test.setTimeout(90000);

for(const theme of ['light','dark'])test(`Chat showcase matches content, geometry and interactions in ${theme}`,async({page},info)=>{
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  const samples:Record<string,unknown>={};
  const scrollStates:Record<string,{before:unknown[];after:unknown[]}>={};
  const captures:Record<string,unknown>={},sizes:Record<string,unknown>={};
  for(const framework of ['react','angular']){
    await page.goto(`${process.env.HOSTED_QA_URL??''}/components/chat/?framework=${framework}`);
    const scope=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const root=framework==='react'?scope.locator('div[style*="font-family"]').first():scope.locator('[data-chat-root]');
    await expect(root).toBeVisible({timeout:15000});await root.evaluate(()=>document.fonts.ready);
    await expect(root.getByText('Can you show me how to compose an accessible data table in Kit UI?',{exact:true})).toBeAttached();
    await expect(root.getByText('Data Table Architecture',{exact:true})).toBeAttached();
    // Let initial message entry and owned smooth scrolling settle in both renderers.
    await page.waitForTimeout(1000);
    scrollStates[framework]=await root.evaluate(el=>{
      const lists=Array.from(el.querySelectorAll('div')).filter(node=>getComputedStyle(node).overflowY==='auto'&&node.scrollHeight>node.clientHeight);
      const read=()=>lists.map(node=>({top:node.scrollTop,height:node.scrollHeight,viewport:node.clientHeight}));
      const before=read();
      // Source smooth-scroll endpoints differ by a CSS pixel between local and
      // hosted runs. Compare the same explicit bottom state, retaining the
      // unmodified default endpoints as evidence rather than hiding them.
      for(const node of lists)node.scrollTop=node.scrollHeight;
      return {before,after:read()};
    });
    samples[framework]=await root.evaluate(el=>{
      const origin=el.getBoundingClientRect();
      return [el,...el.querySelectorAll('div,aside,button,span,p,h3,h4,svg,textarea,input,pre,code')].map(node=>{
        const r=node.getBoundingClientRect(),s=getComputedStyle(node);
        // A hidden box has no painted position; zero-width borders have no
        // painted color. Actual box positions cover the different spacing
        // strategies used by React utilities and Angular's spacing directive.
        const styles=Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderRadius','paddingTop','paddingLeft','display','gap','boxShadow','whiteSpace','overflowY','strokeWidth'].map(key=>[key,(s as any)[key]]));
        for(const side of ['Top','Right','Bottom','Left']){
          const width=(s as any)[`border${side}Width`];
          styles[`border${side}Width`]=width;
          styles[`border${side}Color`]=width==='0px'?'unpainted':(s as any)[`border${side}Color`];
        }
        // Closed fixed sidebars are wholly outside the preview crop. Their
        // viewport is the parent document in React and the iframe in Angular.
        const sidebar=node.closest('aside'),offscreen=sidebar&&sidebar.getBoundingClientRect().right<=origin.left;
        return {tag:node.tagName.toLowerCase(),text:node.children.length===0?node.textContent:null,rect:offscreen||(r.width===0&&r.height===0)?[0,0,0,0]:[r.x-origin.x,r.y-origin.y,r.width,r.height],styles};
      });
    });
    // Keep the fixed framework chooser outside this tall component's crop.
    // Geometry above and interactions below use the original device viewport;
    // only the capture gets extra vertical room, preserving width and DPR.
    const originalViewport=page.viewportSize()!;
    const captureHeight=Math.max(originalViewport.height,(await root.boundingBox())!.height+440);
    await page.setViewportSize({...originalViewport,height:Math.ceil(captureHeight)});
    await page.mouse.move(0,0);await root.scrollIntoViewIfNeeded();const box=(await root.boundingBox())!;
    await page.evaluate(delta=>window.scrollBy(0,delta),box.y+box.height/2-page.viewportSize()!.height/2);
    const capture=await captureComponent(page,root,info.outputPath(`${framework}-initial.png`));
    captures[framework]={box:capture.box,viewport:capture.viewport,dpr:capture.dpr,pixels:capture.pixels};sizes[framework]=capture.pixels;
    await page.setViewportSize(originalViewport);
    const composer=root.getByRole('textbox');await composer.fill('Hosted QA question');await composer.press('Enter');
    await expect(root.getByText('Hosted QA question',{exact:true})).toBeVisible();
    await expect(root.getByText('Acknowledged! I received your instruction regarding: "Hosted QA question". The Kit UI component library has synchronized these updates with zero breaking changes.',{exact:true})).toBeVisible();
    await composer.fill('Cancel on clear');await composer.press('Enter');await root.getByRole('button',{name:'Clear chat history',exact:true}).click();
    await expect(root.getByText('Start a conversation',{exact:true})).toBeVisible();await page.waitForTimeout(1400);
    await expect(root.getByText(/Acknowledged! I received your instruction/)).toHaveCount(0);
    // Mobile sidebar is opened through the same accessible control.
    const toggle=root.getByRole('button',{name:'Toggle chat thread history',exact:true});
    if(await toggle.isVisible())await toggle.click();
    await root.getByRole('button',{name:'New Conversation',exact:true}).first().click();
    await expect(root.getByText('Hello! I am your Kit UI assistant. How can I assist you with your component design today?',{exact:true})).toBeVisible();
    await composer.fill('Cancel on new thread');await composer.press('Enter');
    if(await toggle.isVisible())await toggle.click();
    await root.getByRole('button',{name:'New Conversation',exact:true}).first().click();await page.waitForTimeout(1400);
    await expect(root.getByText(/Acknowledged! I received your instruction/)).toHaveCount(0);
  }
  await writeFile(info.outputPath('showcase-contracts.json'),JSON.stringify(samples));
  await writeFile(info.outputPath('scroll-states.json'),JSON.stringify(scrollStates));
  await writeFile(info.outputPath('capture-boxes.json'),JSON.stringify(captures));
  expect(sizes.angular).toEqual(sizes.react);
  expect(scrollStates.angular.after).toEqual(scrollStates.react.after);
  const source=samples.react as any[],target=samples.angular as any[];
  expect(target.map(row=>[row.tag,row.text])).toEqual(source.map(row=>[row.tag,row.text]));
  for(let i=0;i<source.length;i++){
    expect.soft(target[i].styles,`styles at ${i}`).toEqual(source[i].styles);
    source[i].rect.forEach((value:number,axis:number)=>expect.soft(Math.abs(target[i].rect[axis]-value),`geometry at ${i}/${axis}`).toBeLessThan(.8));
  }
  expect(errors).toEqual([]);
});

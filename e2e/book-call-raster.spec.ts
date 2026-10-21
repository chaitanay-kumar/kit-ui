import {test,expect} from '@playwright/test';

for(const theme of ['light','dark'])test(`book-call painted rim matches actual React pixels in ${theme}`,async({page},info)=>{
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const images:Record<string,{width:number;height:number;data:number[]}[]>={};
  for(const framework of ['react','angular']){
    await page.goto(`${process.env.HOSTED_QA_URL??''}/components/book-call-button/?framework=${framework}`);
    const scope=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const button=scope.getByRole('button',{name:'Book a call',exact:true});
    await expect(button).toBeVisible({timeout:15000});await button.evaluate(()=>document.fonts.ready);
    await expect.poll(()=>button.evaluate(el=>{for(let node:Element|null=el;node;node=node.parentElement)if(getComputedStyle(node).opacity!=='1')return false;return true})).toBe(true);
    await page.mouse.move(0,0);await button.scrollIntoViewIfNeeded();
    const initial=(await button.boundingBox())!;
    await page.evaluate(delta=>window.scrollBy(0,delta),initial.y+initial.height/2-page.viewportSize()!.height/2);
    const box=(await button.boundingBox())!;
    // Solid 2×2 CSS-pixel patches avoid glyphs and rounded corner antialiasing.
    // Compare real rendered pixels, including the iframe's actual paint layers.
    const patches=[{x:Math.ceil(box.x+box.width/2),y:Math.ceil(box.y)+1},{x:Math.ceil(box.x)+1,y:Math.ceil(box.y+box.height/2)},{x:Math.ceil(box.x+box.width/2),y:Math.floor(box.y+box.height)-3}];
    images[framework]=[];
    for(const position of patches){
      const png=await page.screenshot({clip:{...position,width:2,height:2}});
      const pixels=await page.evaluate(async bytes=>{
        const bitmap=await createImageBitmap(new Blob([new Uint8Array(bytes)],{type:'image/png'}));
        const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
        const context=canvas.getContext('2d')!;context.drawImage(bitmap,0,0);bitmap.close();
        return {width:canvas.width,height:canvas.height,data:Array.from(context.getImageData(0,0,canvas.width,canvas.height).data)};
      },Array.from(png));
      if(framework==='react')expect(pixels.data.every((value,index)=>value===(index%4===3?255:9))).toBe(true);
      images[framework].push(pixels);
    }
  }
  await info.attach('rim-pixels',{body:JSON.stringify(images),contentType:'application/json'});
  expect(images.angular).toEqual(images.react);
});

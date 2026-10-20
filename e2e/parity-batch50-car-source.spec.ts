import {test,expect} from '@playwright/test';
test('record source car placement and initial canvas dimensions',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.clock.install();await page.goto('/e2e/fixtures/parity-batch50-car.html');await page.waitForFunction(()=>(window as any).ready&&document.querySelector('[aria-label="Trigger Ferrari drift page transition"]'));await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));
 await page.locator('[aria-label="Trigger Ferrari drift page transition"]').dispatchEvent('click');
 const poses=[];let previous=0;for(const ms of [0,16,64,400]){if(ms>previous)await page.clock.runFor(ms-previous);previous=ms;poses.push({ms,...await page.evaluate(()=>{const canvas=document.querySelector('canvas')!,car=canvas.parentElement!.children[1] as HTMLElement,rect=car.getBoundingClientRect();return{canvas:[canvas.width,canvas.height],transform:getComputedStyle(car).transform,inlineTransform:car.style.transform,top:car.style.top,box:[rect.x,rect.y,rect.width,rect.height]}})})}
 await test.info().attach('source-car-poses',{body:JSON.stringify(poses),contentType:'application/json'});console.log(JSON.stringify(poses));expect(poses[0].canvas).toEqual([300,150]);
});

import {test,expect} from '@playwright/test';
import {captureComponent} from './helpers/capture-component';

test('component capture covers fractional dimensions without moving its origin',async({page},info)=>{
  await page.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><div id="sample" style="position:absolute;left:40.25px;top:50.25px;width:120.5px;height:90.875px;background:#141414;border-bottom:1px solid lime;box-sizing:border-box"></div>');
  const node=page.locator('#sample'),before=(await node.boundingBox())!;
  const capture=await captureComponent(page,node,info.outputPath('fractional.png'));
  expect(capture.box).toEqual(before);expect(await node.boundingBox()).toEqual(before);
  expect(capture.clip.x).toBe(before.x);expect(capture.clip.y).toBe(before.y);
  expect(capture.pixels.width).toBeGreaterThanOrEqual(Math.ceil(before.width*capture.dpr));
  expect(capture.pixels.height).toBeGreaterThanOrEqual(Math.ceil(before.height*capture.dpr));
  expect(capture.pixels.width-before.width*capture.dpr).toBeLessThan(capture.dpr+1);
  expect(capture.pixels.height-before.height*capture.dpr).toBeLessThan(capture.dpr+1);
});

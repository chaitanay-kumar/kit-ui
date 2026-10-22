import type {Locator,Page} from '@playwright/test';

/** Capture the actual fractional viewport box, without element-screenshot CSS
 * integer enclosure. Pixels are neither resampled nor moved to align images. */
export async function captureComponent(page:Page,component:Locator,path:string){
  const box=await component.boundingBox(),viewport=page.viewportSize();
  if(!box||!viewport)throw new Error('Component capture needs a visible box and configured viewport');
  if(box.x<0||box.y<0||box.x+box.width>viewport.width||box.y+box.height>viewport.height)
    throw new Error('Center the entire component inside the viewport before capture');
  const png=await page.screenshot({type:'png',path,clip:box});
  return {png,box,viewport,dpr:await page.evaluate(()=>devicePixelRatio),pixels:{width:png.readUInt32BE(16),height:png.readUInt32BE(20)}};
}

import type {Locator,Page} from '@playwright/test';

/** Preserve the requested fractional viewport origin. Chromium truncates clip
 * dimensions to CSS pixels, so round only the extents up to cover the whole box.
 * Elements are not moved and pixels are not resampled to align images. */
export async function captureComponent(page:Page,component:Locator,path:string){
  const box=await component.boundingBox(),viewport=page.viewportSize();
  if(!box||!viewport)throw new Error('Component capture needs a visible box and configured viewport');
  const clip={...box,width:Math.ceil(box.width),height:Math.ceil(box.height)};
  if(clip.x<0||clip.y<0||clip.x+clip.width>viewport.width||clip.y+clip.height>viewport.height)
    throw new Error('Center the entire component inside the viewport before capture');
  const png=await page.screenshot({type:'png',path,clip});
  return {png,box,clip,viewport,dpr:await page.evaluate(()=>devicePixelRatio),pixels:{width:png.readUInt32BE(16),height:png.readUInt32BE(20)}};
}

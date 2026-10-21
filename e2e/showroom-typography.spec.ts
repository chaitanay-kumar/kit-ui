import {test,expect} from '@playwright/test';

const cases=[
  {id:'book-call-button',text:'Book a call'},
  {id:'animated-tabs',text:'Overview'},
  {id:'chat',text:'AI Assistant'},
  {id:'code-snippet-deck',text:'TypeScript'},
  {id:'branching-submenu',text:'Build'},
];
for(const theme of ['light','dark'])for(const entry of cases)test(`${entry.id}: hosted-demo typography matches React in ${theme}`,async({page})=>{
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const samples:Record<string,unknown>={};
  for(const framework of ['react','angular']){
    await page.goto(`/components/${entry.id}?framework=${framework}`);
    const scope=framework==='react'?page.locator('#component-panel-preview'):page.frameLocator('iframe').locator('main');
    const element=scope.getByText(entry.text,{exact:true}).first();
    await expect(element).toBeVisible({timeout:15000});await element.evaluate(()=>document.fonts.ready);
    samples[framework]=await element.evaluate(el=>{const s=getComputedStyle(el);return {font:s.fontFamily,size:s.fontSize,height:s.lineHeight,weight:s.fontWeight,spacing:s.letterSpacing,features:s.fontFeatureSettings,color:s.color}});
  }
  expect(samples.angular).toEqual(samples.react);
});

for(const theme of ['light','dark'])test(`book-call-button: centered preview stage matches React in ${theme}`,async({page})=>{
  await page.addInitScript(value=>localStorage.setItem('kit-ui-theme',value),theme);
  const results:Record<string,unknown>={};
  for(const framework of ['react','angular']){
    await page.goto(`/components/book-call-button?framework=${framework}`);
    const stage=framework==='react'?page.locator('#component-panel-preview').locator(':scope > div > div').last():page.frameLocator('iframe').locator('.k-book-demo');
    await expect(stage).toBeVisible({timeout:15000});
    await expect(stage.getByRole('button',{name:'Book a call',exact:true})).toBeVisible({timeout:15000});
    await stage.evaluate(()=>document.fonts.ready);
    results[framework]=await stage.evaluate(el=>{const r=el.getBoundingClientRect(),button=el.querySelector('button')!.getBoundingClientRect();let background='';for(let n:Element|null=el;n;n=n.parentElement){const c=getComputedStyle(n).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'){background=c;break}}return {height:r.height,width:button.width,buttonHeight:button.height,x:button.x-r.x+button.width/2-r.width/2,y:button.y-r.y+button.height/2-r.height/2,background}});
  }
  expect(results.angular).toEqual(results.react);
});

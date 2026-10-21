import {test,expect} from '@playwright/test';
for(const theme of ['light','dark'])test(`batch 49 consuming demos in ${theme}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`/angular-demo/index.html?component=chat&theme=${theme}`);
 await expect(page.locator('[data-chat-root]')).toBeVisible();
 await page.getByRole('textbox').fill('Local question');await page.getByRole('button',{name:'Send message',exact:true}).click();
 await expect(page.getByText('Local question',{exact:true})).toBeVisible();
 await expect(page.getByText('Acknowledged! I received your instruction regarding: "Local question". The Kit UI component library has synchronized these updates with zero breaking changes.',{exact:true})).toBeVisible();
 await page.getByRole('textbox').fill('Clear pending reply');await page.getByRole('button',{name:'Send message',exact:true}).click();await page.getByRole('button',{name:'Clear chat history',exact:true}).click();
 await expect(page.getByText('Start a conversation',{exact:true})).toBeVisible();await page.waitForTimeout(1400);
 await expect(page.getByText(/Acknowledged! I received your instruction/)).toHaveCount(0);
 await page.goto(`/angular-demo/index.html?component=dynamic-island&theme=${theme}`);
 await page.getByRole('button',{name:'Expand dynamic island',exact:true}).click();await page.getByRole('button',{name:'View profile',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Kit UI contributors',exact:true})).toBeVisible();await page.getByRole('button',{name:'Share Profile',exact:true}).click();await expect(page.getByRole('link',{name:'Email',exact:true})).toHaveAttribute('href','mailto:contact@example.com');
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Expand dynamic island',exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});

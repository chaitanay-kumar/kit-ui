import {test,expect} from '@playwright/test';
for(const theme of ['light','dark'])test('native batch 46 demos '+theme,async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/angular-demo/index.html?component=dot-shader&theme='+theme);
 await expect(page.getByText('Move through the dot field')).toBeVisible();
 await expect(page.locator('kit-dot-shader canvas')).toHaveCSS('height','260px');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('button',{name:'Resume',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/angular-demo/index.html?component=animated-file-upload&theme='+theme);
 await expect(page.getByText('Local simulation; files stay in your browser')).toBeVisible();
 await page.getByRole('button',{name:'Compact layout'}).click();await expect(page.locator('.k-upload-drop')).toHaveClass(/compact/);
 await page.locator('input[type=file]').setInputFiles({name:'demo.txt',mimeType:'text/plain',buffer:Buffer.from('local')});
 await expect(page.getByText('demo.txt ready')).toBeVisible();await expect(page.getByText('Ready',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Clear Completed',exact:true}).click();await expect(page.getByRole('button',{name:'Remove demo.txt'})).toHaveCount(0);
 expect(errors).toEqual([]);
});

import {test,expect} from '@playwright/test';
for(const theme of ['light','dark'])test('batch 50 consuming demos in '+theme,async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(`/angular-demo/index.html?component=pull-to-refresh&theme=${theme}`);
 const panel=page.getByRole('region',{name:'Pull to refresh panel. Press R to refresh when focused.',exact:true});await expect(panel).toBeVisible();await panel.focus();await page.keyboard.press('r');await expect(panel).toHaveAttribute('aria-busy','true');await expect(panel).toHaveAttribute('aria-busy','false');await expect(page.getByText('Pull to refresh',{exact:true})).toHaveCount(1);
 await page.goto(`/angular-demo/index.html?component=car-smoke-page-transition&theme=${theme}`);await page.getByRole('button',{name:'Trigger Ferrari drift page transition',exact:true}).click();await expect(page.getByText('Local transition complete.',{exact:true})).toBeVisible();await expect(page.locator('canvas')).toHaveCount(0);expect(errors).toEqual([]);
});

import { test, expect, type Page } from "@playwright/test";
import { ANGULAR_PORTS } from "../src/lib/framework/angular-ports";

async function demo(page: Page, id: string) {
  await page.goto(`/angular-demo/index.html?component=${id}`);
  await expect(page.locator(`[data-kit="${id}"]`)).toBeVisible();
}
for (const theme of ["light", "dark"]) {
  test(`all 108 Angular ports render and dispose in ${theme} theme`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/angular-demo/index.html?component=button&theme=${theme}`);
    await expect(page.locator("[ng-version]")).toHaveAttribute(
      "ng-version",
      /^20\./,
    );
    for (const port of ANGULAR_PORTS) {
      await test.step(port.name, async () => {
        await page.evaluate((id) => {
          const url = new URL(location.href);
          url.searchParams.set("component", id);
          history.pushState(null, "", url);
          dispatchEvent(new PopStateEvent("popstate"));
        }, port.id);
        const roots = page.locator(`[data-kit="${port.id}"]`);
        const demoCounts: Record<string, number> = {"animated-number":2,button:11, "morphing-icon":6, "morphing-button":4, "press-button":2, "typewriter-button":2, "rainbow-button":2, "stretch-switch":2};
        const expectedCount = demoCounts[port.id] ?? 1;
        await expect(roots).toHaveCount(expectedCount);
        const component = roots.first();
        await expect(component).toBeVisible();
        await expect(
          page.getByText("Select an available Angular component."),
        ).toHaveCount(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 2,
          ),
          port.id,
        ).toBe(true);
        if (
          [
            "advanced-data-table",
            "dependency-trace",
            "pricing",
            "dot-shader",
            "profile-card",
          ].includes(port.id)
        )
          await component.screenshot({
            path: testInfo.outputPath(`${port.id}-${theme}.png`),
          });
        expect(errors, port.id).toEqual([]);
      });
    }
  });
}

test("all Angular routes expose native source and required local dependencies", async ({
  request,
}) => {
  for (const port of ANGULAR_PORTS) {
    const response = await request.get(`/angular-source/${port.id}.json`);
    expect(response.ok(), port.id).toBe(true);
    const source = await response.json();
    expect(source.sourceCode).toContain(port.exportName);
    expect(source.sourceCode).not.toMatch(/from ['"]react/);
    for (const match of source.sourceCode.matchAll(
      /from\s+['"]\.\/([^'"]+)['"]/g,
    ))
      expect(
        Object.keys(source.dependencies),
        `${port.id}: ${match[1]}`,
      ).toContain(`${match[1]}.ts`);
    expect(source.styles).toContain(".k-table-scroll");
  }
});

test("Angular website has the complete catalog and framework-specific usage", async ({
  page,
}) => {
  await page.goto("/?framework=angular");
  const catalog = page.getByRole("region", {
    name: "Angular component catalog",
  });
  await expect(catalog.getByRole("button")).toHaveCount(116);
  await page
    .getByRole("searchbox", { name: "Search Angular components" })
    .fill("Advanced Data Table");
  await catalog.getByRole("button").click();
  await expect(page).toHaveURL(/advanced-data-table\?framework=angular/);
  await expect(page.frameLocator("iframe").getByRole("heading",{name:"Component Registry",exact:true})).toBeVisible();
  await page.getByRole("tab",{name:"Usage",exact:true}).click();
  await expect(
    page.getByText("KitAdvancedDataTableComponent", { exact: false }).first(),
  ).toBeVisible();
});

test("data table sorts, filters, selects, expands and exports selected IDs", async ({page}) => {
  await demo(page,"advanced-data-table");
  if(!await page.getByRole('table').isVisible())await page.getByRole('button',{name:'Toggle view mode'}).click();
  await page.getByRole('button',{name:'Component',exact:true}).click();
  await expect(page.getByRole('row').nth(1)).toContainText('AI Agent Activity');
  await page.getByRole('button',{name:'AI',exact:true}).click();
  await expect(page.getByText('Showing',{exact:false})).toContainText('of 3 records');
  await page.getByRole('checkbox',{name:'Select all rows',exact:true}).check();
  await expect(page.getByText('3 selected',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Export',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Exported 3 records');
  await page.getByRole('button',{name:'Expand row details'}).first().click();
  await expect(page.getByText('AI Agent Activity Specifications',{exact:true})).toBeVisible();
  await page.getByPlaceholder('Search...').fill('does not exist');
  await expect(page.getByText('No matching records found',{exact:true})).toBeVisible();
});

test("OTP, switches and rotary dial support native keyboard interaction", async ({
  page,
}) => {
  await demo(page, "otp-input");
  await page.getByRole("textbox", { name: "Verification code" }).fill("12a345");
  await expect(page.getByRole("textbox")).toHaveValue("12345");
  await page.getByRole("textbox").fill("123456");
  await expect(page.getByRole("status")).toHaveText("Code complete.");
  await demo(page, "liquid-toggle");
  await page.getByRole("switch").focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("switch")).toBeChecked();
  await demo(page, "torque-dial");
  const dial = page.getByRole("slider").nth(1);
  await dial.focus();
  await dial.press("End");
  await expect(dial).toHaveAttribute("aria-valuenow", "100");
  await dial.press("Home");
  await expect(dial).toHaveAttribute("aria-valuenow", "0");
});

test("login preserves failed values and sign-up checks confirmation", async ({
  page,
}) => {
  await demo(page, "login");
  await page.getByLabel("Email", { exact: true }).fill("fail@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Demo submission failed");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "fail@example.com",
  );
  await page.getByLabel("Email", { exact: true }).fill("hello@example.com");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Submission completed.");
  await demo(page, "sign-up");
  await page.getByLabel("Name", { exact: true }).fill("Kit");
  await page.getByLabel("Email", { exact: true }).fill("kit@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("different123");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.getByRole("alert")).toHaveText("Passwords do not match.");
});

test("chat preserves failed and cancelled drafts and receives local replies", async ({
  page,
}) => {
  await demo(page, "chat");
  await page
    .getByRole("textbox", { name: "Message" })
    .fill("fail this request");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Demo send failed");
  await expect(page.getByRole("textbox")).toHaveValue("fail this request");
  await page.getByRole("textbox").fill("A small question");
  await page.getByRole("button", { name: "Retry message" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("A small question");
  await expect(page.getByRole("status")).toHaveText(
    "Cancelled. Your draft is preserved.",
  );
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("list", { name: "Conversation" })).toContainText(
    "Local demo reply: A small question",
  );
});

test("tabs, menus, tooltip and modal retain accessible focus behavior", async ({
  page,
}) => {
  await demo(page, "animated-tabs");
  const first = page.getByRole("tab").first();
  await first.focus();
  await first.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Build" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await demo(page,'hamburger-menu');
  const hamburger=page.locator('[data-kit="hamburger-menu"] button');
  await hamburger.focus();await hamburger.press('Space');
  await expect(hamburger).toHaveAttribute('aria-expanded','true');
  await hamburger.press('Escape');await expect(hamburger).toHaveAttribute('aria-expanded','true');
  await hamburger.press('Enter');await expect(hamburger).toHaveAttribute('aria-expanded','false');
  for(const id of ['gooey-menu','origin-dropdown']){
    await demo(page,id);const menu=page.locator(`[data-kit="${id}"] button`).first();await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded','true');const first=page.getByRole('button',{name:'Design',exact:true});await first.focus();await first.press('ArrowDown');
    await expect(page.getByRole('button',{name:'Build',exact:true})).toBeFocused();await expect(menu).toHaveAttribute('aria-expanded','true');
    await page.keyboard.press('Escape');await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();
    await menu.click();await page.getByRole('button',{name:'Build',exact:true}).press('Enter');await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();
  }
  await demo(page, "directional-tooltip");
  const trigger = page.getByRole("button", { name: "Hover, focus or tap" });
  await trigger.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await trigger.press("Escape");
  await expect(page.getByRole("tooltip")).toBeHidden();
  await demo(page, "morphing-dialog");
  const opener = page.getByRole("button", { name: "Open dialog" });
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});

test("comparison, pricing and graph selection update from user input", async ({
  page,
}) => {
  await demo(page, "smart-comparison");
  await page.getByRole("checkbox", { name: "Show differences only" }).check();
  await expect(page.getByRole("table")).not.toContainText("Components");
  await expect(page.getByRole("table")).toContainText("Members");
  await page.getByLabel("Find a feature").fill("support");
  await expect(page.getByRole("table")).not.toContainText("Members");
  await demo(page, "pricing");
  await expect(
    page.getByText("$12.00", { exact: false }).first(),
  ).toBeVisible();
  await page.getByRole("checkbox").check();
  await expect(
    page.getByText("$115.20", { exact: false }).first(),
  ).toBeVisible();
  await demo(page, "dependency-trace");
  await page.getByRole("button", { name: "API", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "API", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("line.k-connected")).toHaveCount(2);
});

test("canvas visuals draw nonempty pixels and can be paused", async ({
  page,
}) => {
  await demo(page, "dot-shader");
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  await expect
    .poll(() =>
      canvas.evaluate((el) => {
        const ctx = el.getContext("2d")!;
        return Array.from(
          ctx.getImageData(0, 0, el.width, el.height).data,
        ).some((v, i) => i % 4 === 3 && v > 0);
      }),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(
    page.getByRole("button", { name: "Resume animation" }),
  ).toHaveAttribute("aria-pressed", "true");
});

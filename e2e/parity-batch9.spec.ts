import { test, expect, type Page } from "@playwright/test";
async function open(page: Page, f: string, kind: string, initial: object = {}) {
  await page.route("**/batch9.html*", (r) =>
    r.fulfill({
      contentType: "text/html",
      body: '<meta name="viewport" content="width=device-width"><script type="module">import R from "/@react-refresh";R.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>x=>x;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/parity-batch9-contract.tsx"></script>',
    }),
  );
  await page.goto(
    `/batch9.html?framework=${f}&kind=${kind}&initial=${encodeURIComponent(JSON.stringify(initial))}`,
  );
  await expect(page.locator("#fixture")).toBeVisible();
  await page.waitForFunction(
    () => typeof (window as any).setBatchOptions === "function",
  );
}
async function update(page: Page, v: object) {
  await page.evaluate((v) => (window as any).setBatchOptions(v), v);
}
for (const f of ["react", "angular"]) {
  test(`${f}: lock input uncontrolled focus icons and helper`, async ({
    page,
  }) => {
    await open(page, f, "lock", { defaultValue: "start", icons: true });
    const input = page.getByRole("textbox", { name: "Email" });
    await expect(input).toHaveValue("start");
    await input.fill("next");
    await input.focus();
    await input.blur();
    await expect(page.getByText("Work address")).toBeVisible();
    const events = await page.evaluate(() => (window as any).events);
    expect(events).toContain("change:next");
    expect(events).toContain("focus");
    expect(events).toContain("blur");
    await expect(page.getByText("@")).toBeVisible();
  });
  test(`${f}: lock input controlled error and disabled`, async ({ page }) => {
    await open(page, f, "lock", {
      controlled: true,
      value: "fixed",
      error: "Invalid address",
    });
    const input = page.getByRole("textbox", { name: "Email" });
    await input.fill("request");
    await expect(input).toHaveValue("fixed");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("alert")).toHaveText("Invalid address");
    await expect(page.getByText("Work address")).toHaveCount(0);
    await update(page, { controlled: true, value: "updated", disabled: true });
    await expect(input).toHaveValue("updated");
    await expect(input).toBeDisabled();
  });
  test(`${f}: dropdown selection disabled and Escape`, async ({ page }) => {
    await open(page, f, "menu");
    const trigger = page.getByRole("button", { name: /Open menu/ });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page
      .getByRole("menuitem", { name: /Unavailable/ })
      .click({ force: true });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("menuitem", { name: /Edit profile/ }).click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => (window as any).events)).toContain(
      "select:edit",
    );
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  test(`${f}: dropdown controlled custom content side and outside`, async ({
    page,
  }) => {
    await open(page, f, "menu", {
      controlled: true,
      open: true,
      custom: true,
      side: "right",
    });
    const trigger = page.getByRole("button", { name: /Actions/ });
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("button", { name: "Custom action" }).click();
    expect(await page.evaluate(() => (window as any).events)).toContain(
      "custom",
    );
    await page.locator("body").click({ position: { x: 2, y: 2 } });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await page.evaluate(() => (window as any).events)).toContain(
      "open:false",
    );
    await update(page, {
      controlled: true,
      open: false,
      custom: true,
      side: "right",
    });
    await expect(page.getByRole("menu")).toHaveCount(0);
  });
}

import { test, expect, type Page } from "@playwright/test";
async function open(page: Page, f: string, kind: string, initial: object = {}) {
  await page.route("**/batch8.html*", (r) =>
    r.fulfill({
      contentType: "text/html",
      body: '<!doctype html><meta name="viewport" content="width=device-width"><script type="module">import R from "/@react-refresh";R.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>x=>x;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/parity-batch8-contract.tsx"></script>',
    }),
  );
  await page.goto(
    `/batch8.html?framework=${f}&kind=${kind}&initial=${encodeURIComponent(JSON.stringify(initial))}`,
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
  test(`${f}: draw checkbox uncontrolled rich label and indeterminate`, async ({
    page,
  }) => {
    await open(page, f, "draw", {
      defaultChecked: true,
      indeterminate: true,
      rich: true,
    });
    const box = page.getByRole("checkbox", {
      name: "Accept terms Required choice",
    });
    await expect(box).toBeChecked();
    await expect(
      page.locator(
        '#fixture .k-draw-bar, #fixture div[style*="transform-origin"]',
      ),
    ).toBeVisible();
    await page.getByText("Accept terms", { exact: true }).click();
    expect(await page.evaluate(() => (window as any).events)).toHaveLength(1);
    await expect(page.getByText("Required choice")).toBeVisible();
  });
  test(`${f}: draw checkbox controlled and disabled`, async ({ page }) => {
    await open(page, f, "draw", { controlled: true, checked: false });
    const box = page.getByRole("checkbox");
    await page.getByText("Accept terms", { exact: true }).click();
    await expect(box).not.toBeChecked();
    expect(await page.evaluate(() => (window as any).events)).toEqual([
      "change:true",
    ]);
    await update(page, { controlled: true, checked: true, disabled: true });
    await expect(box).toBeChecked();
    await expect(box).toBeDisabled();
  });
  test(`${f}: liquid toggle click and directional keyboard`, async ({
    page,
  }) => {
    await open(page, f, "liquid", { defaultValue: false });
    const toggle = page.getByRole("switch");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(toggle).toHaveAccessibleName("On");
    await toggle.press("ArrowLeft");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(await page.evaluate(() => (window as any).events)).toEqual([
      "change:true",
      "change:false",
    ]);
  });
  test(`${f}: liquid toggle controlled dimensions labels and disabled`, async ({
    page,
  }) => {
    await open(page, f, "liquid", {
      controlled: true,
      value: true,
      width: 72,
      height: 40,
      showLabels: false,
      accentColor: "#ff0000",
    });
    const toggle = page.getByRole("switch");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(toggle).toHaveCSS("width", "72px");
    await expect(toggle).toHaveCSS("height", "40px");
    await toggle.press("ArrowLeft");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await update(page, {
      controlled: true,
      value: false,
      disabled: true,
      width: 72,
      height: 40,
    });
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await expect(toggle).toBeDisabled();
  });
}

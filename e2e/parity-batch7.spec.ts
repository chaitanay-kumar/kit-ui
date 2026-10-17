import { test, expect, type Page } from "@playwright/test";
async function open(
  page: Page,
  framework: string,
  kind: string,
  initial: object = {},
) {
  await page.route("**/batch7.html*", (r) =>
    r.fulfill({
      contentType: "text/html",
      body: '<!doctype html><meta name="viewport" content="width=device-width"><script type="module">import R from "/@react-refresh";R.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>x=>x;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/parity-batch7-contract.tsx"></script>',
    }),
  );
  await page.goto(
    `/batch7.html?framework=${framework}&kind=${kind}&initial=${encodeURIComponent(JSON.stringify(initial))}`,
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
  test(`${f}: FAQ disclosure rich search and categories`, async ({ page }) => {
    await open(page, f, "faq", {
      multiple: true,
      rich: true,
      searchable: true,
      categories: true,
    });
    const a = page.getByRole("button", { name: /How do I install/ }),
      b = page.getByRole("button", { name: /How do themes work/ });
    await expect(a).toHaveAttribute("aria-expanded", "true");
    await b.click();
    await expect(a).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Rich answer" }).click();
    await page.locator('input[placeholder="Search questions..."]').fill("tokens");
    await expect(a).toHaveCount(0);
    await page.getByRole("button", { name: "Setup" }).click();
    await expect(page.getByText("No matching questions found.")).toBeVisible();
    expect(await page.evaluate(() => (window as any).events)).toContain("rich");
  });
  test(`${f}: FAQ controlled state`, async ({ page }) => {
    await open(page, f, "faq", { controlled: true, openIds: ["install"] });
    const a = page.getByRole("button", { name: /How do I install/ }),
      b = page.getByRole("button", { name: /How do themes work/ });
    await b.click();
    await expect(a).toHaveAttribute("aria-expanded", "true");
    await expect(b).toHaveAttribute("aria-expanded", "false");
    await update(page, { controlled: true, openIds: ["theme"] });
    await expect(b).toHaveAttribute("aria-expanded", "true");
  });
  test(`${f}: OTP typing navigation and completion`, async ({ page }) => {
    await open(page, f, "otp", { length: 4, autoFocus: true });
    const d = page.getByRole("textbox");
    await expect(d).toHaveCount(4);
    await expect(d.nth(0)).toBeFocused();
    for (let i = 0; i < 4; i++) await d.nth(i).fill(String(i + 1));
    expect(await page.evaluate(() => (window as any).events)).toContain(
      "complete:1234",
    );
  });
  test(`${f}: OTP paste controlled and disabled`, async ({ page }) => {
    await open(page, f, "otp", { length: 4 });
    const d = page.getByRole("textbox");
    await d.nth(0).fill("9");
    await d.nth(0).press("ArrowRight");
    await expect(d.nth(1)).toBeFocused();
    await update(page, {
      controlled: true,
      value: "4321",
      length: 4,
      disabled: true,
    });
    await expect(d.nth(0)).toHaveValue("4");
    await expect(d.nth(0)).toBeDisabled();
  });
}

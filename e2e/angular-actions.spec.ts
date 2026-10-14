import { test, expect } from "@playwright/test";
test("Angular action failure, cancellation and retry settle correctly", async ({
  page,
}) => {
  await page.goto("/angular-demo/index.html?component=pull-to-refresh");
  await page.getByLabel("Simulate request failure").check();
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Demo action failed. Try again.",
  );
  await page.getByLabel("Simulate request failure").uncheck();
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Cancelled.");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Completed.");
});
test("Angular batch failure preserves selection for retry", async ({
  page,
}) => {
  await page.goto("/angular-demo/index.html?component=batch-gesture-tray");
  await page.getByRole("button", { name: "Select all", exact: true }).click();
  await page.getByLabel("Simulate request failure").check();
  await page
    .getByRole("button", { name: "Apply to selected", exact: true })
    .click();
  await expect(page.getByRole("alert")).toHaveText(
    "Demo batch action failed. Selection preserved.",
  );
  await expect(page.getByText("3 selected", { exact: true })).toBeVisible();
  await page.getByLabel("Simulate request failure").uncheck();
  await page
    .getByRole("button", { name: "Apply to selected", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("Completed.");
});

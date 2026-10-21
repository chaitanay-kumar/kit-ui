import { test, expect, type Page } from "@playwright/test";
for (const theme of ["light", "dark"]) test(`website search typography matches React in ${theme}`, async ({page}) => {
  await page.addInitScript(value => localStorage.setItem('kit-ui-theme', value), theme);
  const samples: Record<string, unknown[]> = {};
  for (const framework of ['react', 'angular']) {
    await page.goto(`/components/expandable-search?framework=${framework}`);
    const scope = framework === 'react' ? page : page.frameLocator('iframe');
    const input = scope.locator('input[placeholder="Quick search..."]');
    await expect(input).toBeVisible({timeout:15000});
    await input.evaluate(() => document.fonts.ready);
    await expect.poll(() => input.locator('..').evaluate(el => el.getBoundingClientRect().width)).toBe(160);
    const footer = scope.getByText('Click input or focus to test smooth width expansion', {exact: true});
    samples[framework] = [];
    for (const element of [input, footer]) samples[framework].push(await element.evaluate(el => {
      const style = getComputedStyle(el);
      return {font: style.fontFamily, size: style.fontSize, lineHeight: style.lineHeight, weight: style.fontWeight, spacing: style.letterSpacing, features: style.fontFeatureSettings, rendering: style.textRendering, color: style.color, width: el.getBoundingClientRect().width};
    }));
  }
  expect(samples.angular).toEqual(samples.react);
});
async function consumer(page: Page, framework: string, theme = "light") {
  await page.route("**/expandable-search-contract.html*", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><script type="module">import RefreshRuntime from "/@react-refresh";RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>type=>type;window.__vite_plugin_react_preamble_installed__=true;</script><script type="module" src="/e2e/fixtures/expandable-search-contract.tsx"></script></body></html>',
    }),
  );
  await page.goto(
    `/expandable-search-contract.html?framework=${framework}&theme=${theme}`,
  );
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as {
          setSearchOptions: unknown;
        }
      ).setSearchOptions === "function",
  );
  await expect(page.getByRole("textbox")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(550);
}
async function update(page: Page, options: Record<string, unknown>) {
  await page.evaluate(
    (options) =>
      (
        window as unknown as {
          setSearchOptions: (options: unknown) => void;
        }
      ).setSearchOptions(options),
    options,
  );
  await page.waitForTimeout(30);
}
async function metrics(page: Page) {
  return page.getByRole("textbox").evaluate((el) => {
    const input = el as HTMLInputElement,
      control = el.parentElement!,
      outer = control.parentElement!;
    const read = (node: Element) => {
      const s = getComputedStyle(node);
      return {
        tag: node.tagName,
        width: s.width,
        height: s.height,
        color: s.color,
        background: s.backgroundColor,
        border: s.border,
        borderRadius: s.borderRadius,
        padding: s.padding,
        margin: s.margin,
        display: s.display,
        font: s.fontFamily,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        fontWeight: s.fontWeight,
        outline: s.outline,
        shadow:
          s.boxShadow.replace(
            /rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(?:, )?/g,
            "",
          ) || "none",
        transition: s.transitionProperty,
        duration: s.transitionDuration,
      };
    };
    return {
      outer: read(outer),
      control: read(control),
      input: read(el),
      placeholder: input.placeholder,
      type: input.type,
      value: input.value,
      children: Array.from(control.children)
        .filter((node) => node !== el)
        .map((node) => ({
          ...read(node),
          text: node.textContent,
          paths: Array.from(node.querySelectorAll("path")).map((p) =>
            p.getAttribute("d"),
          ),
        })),
    };
  });
}
for (const theme of ["light", "dark"])
  test(`expandable search settled visuals and overrides match in ${theme}`, async ({
    page,
  }) => {
    const results: Awaited<ReturnType<typeof metrics>>[] = [];
    for (const framework of ["react", "angular"]) {
      await consumer(page, framework, theme);
      const input = page.getByRole("textbox");
      const cases = [
        async () => {},
        async () => {
          await input.focus();
          await page.waitForTimeout(700);
        },
        async () => {
          await input.fill("hello");
          await page.waitForTimeout(700);
        },
        async () => {
          await page.getByRole("button").click();
          await page.waitForTimeout(700);
        },
        async () => {
          await update(page, {
            className: "m-2 p-2 bg-red-500",
            placeholder: "Custom query",
          });
          await input.focus();
          await page.waitForTimeout(700);
        },
      ];
      for (const [index, step] of cases.entries()) {
        await step();
        const actual = await metrics(page);
        if (framework === "react") results.push(actual);
        else expect(actual).toEqual(results[index]);
      }
    }
  });
for (const framework of ["react", "angular"])
  test(`${framework} expandable search callbacks blur clear propagation and native form submit`, async ({
    page,
  }) => {
    await consumer(page, framework);
    const input = page.getByRole("textbox");
    await input.focus();
    await expect(input).toHaveAttribute(
      "placeholder",
      "Search components, props...",
    );
    await input.fill(" query ");
    await input.blur();
    await page.waitForTimeout(700);
    await expect(input).toHaveAttribute(
      "placeholder",
      "Search components, props...",
    );
    await expect(page.getByRole("button")).not.toHaveAttribute("type");
    await page.getByRole("button").click();
    await expect(input).toHaveValue("");
    await expect(input).toHaveAttribute("placeholder", "Quick search...");
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (
              window as unknown as {
                searchEvents: string[];
              }
            ).searchEvents,
        ),
      )
      .toEqual(["search: query ", "search:"]);
    await input.focus();
    await input.blur();
    await expect(input).toHaveAttribute("placeholder", "Quick search...");
  });
for (const framework of ["react", "angular"])
  test(`${framework} expandable search repeated delayed focus and unmount cleanup`, async ({
    page,
  }) => {
    await consumer(page, framework);
    const control = page.getByRole("textbox").locator("..");
    await control.dispatchEvent("click");
    await page.waitForTimeout(45);
    await expect(page.getByRole("textbox")).not.toBeFocused();
    await page.waitForTimeout(100);
    await expect(page.getByRole("textbox")).toBeFocused();
    await page.getByRole("textbox").blur();
    await control.dispatchEvent("click");
    await page.evaluate(() =>
      (
        window as unknown as {
          destroySearch: () => void;
        }
      ).destroySearch(),
    );
    await page.waitForTimeout(250);
    await expect(page.getByRole("textbox")).toHaveCount(0);
  });
for (const framework of ["react", "angular"])
  test(`${framework} expandable search delayed-focus clear race and implicit Enter submit`, async ({
    page,
  }) => {
    await consumer(page, framework);
    const input = page.getByRole("textbox");
    await input.focus();
    await input.fill("x");
    await input.locator("..").dispatchEvent("click");
    await page.getByRole("button").focus();
    await page.getByRole("button").dispatchEvent("click");
    await expect(input).toHaveValue("");
    await page.waitForTimeout(160);
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute(
      "placeholder",
      "Search components, props...",
    );
    await input.press("Enter");
    await expect
      .poll(() =>
        page.evaluate(() =>
          (
            window as unknown as {
              searchEvents: string[];
            }
          ).searchEvents.at(-1),
        ),
      )
      .toBe("submit");
    const before = await page.evaluate(
      () =>
        (
          window as unknown as {
            searchEvents: string[];
          }
        ).searchEvents.filter((event) => event === "submit").length,
    );
    await input.fill("fresh");
    await input.press("Enter");
    await expect(input).toHaveValue("");
    expect(
      await page.evaluate(
        () =>
          (
            window as unknown as {
              searchEvents: string[];
            }
          ).searchEvents.filter((event) => event === "submit").length,
      ),
    ).toBe(before);
  });
test("expandable search spring expansion, reversal and color interpolation remain source matched", async ({
  page,
}) => {
  type Sample = {
    time: number;
    width: number;
    background: number;
    border: number;
  };
  const results: Sample[][] = [];
  for (const framework of ["react", "angular"]) {
    await consumer(page, framework);
    results.push(
      await page.getByRole("textbox").evaluate(async (el) => {
        const input = el as HTMLInputElement,
          control = el.parentElement!;
        const samples: {
          time: number;
          width: number;
          background: number;
          border: number;
        }[] = [];
        const started = performance.now();
        input.focus();
        let reversed = false,
          origin: number | undefined,
          initialAge = 0,
          reversalTime = 180;
        await new Promise<void>((resolve) => {
          const frame = () => {
            const elapsed = performance.now() - started,
              s = getComputedStyle(control),
              width = control.getBoundingClientRect().width;
            if (origin === undefined && width > 160.05) {
              origin = elapsed;
              let lo = 0,
                hi = 500;
              for (let i = 0; i < 30; i++) {
                const mid = (lo + hi) / 2,
                  t = mid / 1000,
                  r1 = -30 + Math.sqrt(140),
                  r2 = -30 - Math.sqrt(140),
                  predicted =
                    280 -
                    (120 * (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t))) /
                      (r2 - r1);
                if (predicted < width) lo = mid;
                else hi = mid;
              }
              initialAge = (lo + hi) / 2;
            }
            const rawTime =
                origin === undefined ? -1 : elapsed - origin + initialAge,
              time = reversed ? rawTime - reversalTime + 180 : rawTime;
            if (origin !== undefined)
              samples.push({
                time,
                width,
                background: Number(s.backgroundColor.match(/[\d.]+/g)![0]),
                border: Number(s.borderColor.match(/[\d.]+/g)![0]),
              });
            if (origin !== undefined && time >= 180 && !reversed) {
              reversed = true;
              reversalTime = rawTime;
              input.blur();
            }
            if (origin === undefined || time < 800)
              requestAnimationFrame(frame);
            else resolve();
          };
          requestAnimationFrame(frame);
        });
        return samples;
      }),
    );
  }
  for (const time of [80, 140, 240, 320, 450, 750]) {
    const read = (samples: Sample[]) => {
      const after = samples.findIndex((sample) => sample.time >= time);
      if (after <= 0) return samples[Math.max(after, 0)];
      const a = samples[after - 1],
        b = samples[after],
        p = (time - a.time) / (b.time - a.time);
      return {
        time,
        width: a.width + (b.width - a.width) * p,
        background: a.background + (b.background - a.background) * p,
        border: a.border + (b.border - a.border) * p,
      };
    };
    const source = read(results[0]),
      native = read(results[1]);
    expect(Math.abs(native.width - source.width)).toBeLessThan(10);
    expect(Math.abs(native.background - source.background)).toBeLessThan(3);
    expect(Math.abs(native.border - source.border)).toBeLessThan(10);
  }
  expect(results[1].at(-1)!.width).toBe(160);
});
for (const framework of ["react", "angular"])
  test(`${framework} expandable search docs preview`, async ({
    page,
  }, info) => {
    await page.goto(`/components/expandable-search?framework=${framework}`);
    const scope = framework === "react" ? page : page.frameLocator("iframe");
    const input = scope.locator(
      'input[placeholder="Quick search..."],input[placeholder="Search components, tokens..."]',
    );
    await expect(input).toBeVisible();
    await input.focus();
    await expect(input).toHaveAttribute(
      "placeholder",
      "Search components, tokens...",
    );
    await expect(
      scope.getByText("Click input or focus to test smooth width expansion", {
        exact: true,
      }),
    ).toBeVisible();
    await page.waitForTimeout(650);
    await input.locator("..").screenshot({
      path: info.outputPath(`${framework}-expandable-search.png`),
      animations: "disabled",
    });
  });
test("expandable search shortcut fade uses source default easing and replaces clear immediately", async ({
  page,
}) => {
  const opacity: number[] = [];
  for (const framework of ["react", "angular"]) {
    await consumer(page, framework);
    const input = page.getByRole("textbox");
    await input.fill("q");
    expect(
      await input
        .locator("..")
        .evaluate((el) => el.querySelectorAll("div").length),
    ).toBe(0);
    await page.waitForTimeout(550);
    await expect(input.locator("..").locator("div")).toHaveCount(0);
    await page.getByRole("button").dispatchEvent("click");
    await expect(page.getByRole("button")).toHaveCount(0);
    const hint = input.locator("..").locator("div");
    await expect
      .poll(() => hint.evaluate((el) => el.getAnimations().length))
      .toBe(1);
    opacity.push(
      await hint.evaluate((el) => {
        const animation = el.getAnimations()[0];
        if (animation.effect!.getTiming().duration !== 300)
          throw new Error("Source shortcut duration must remain 300ms");
        animation.pause();
        animation.currentTime = 140;
        return Number(getComputedStyle(el).opacity);
      }),
    );
    await hint.evaluate((el) => el.getAnimations()[0].play());
    await page.waitForTimeout(250);
    await expect(input.locator("..").locator("div")).toHaveCSS("opacity", "1");
  }
  expect(Math.abs(opacity[0] - opacity[1])).toBeLessThan(0.12);
});

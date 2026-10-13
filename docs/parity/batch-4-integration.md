# Batch 4: UnfoldAccordion and Animated Number Morph

This batch follows the user's request to work on two components at a time. React remains the reference. Implementation is on `feat/angular-parity-batch-4`, based on `0004d43`. The preceding iOS Search Bar work is already merged into `feat/kit-ui-library` through `54caeaa`.

| Component | Contract and practical limits |
| --- | --- |
| Animated Number Morph | [Formatting and rolling columns](animated-number.md) |
| UnfoldAccordion | [Native disclosure and content](unfold-accordion.md) |

## Validation — 2026-10-13

Validated locally on Windows with Node 22.23.3 and Microsoft Edge/Chromium. The batch is on its feature branch for review and has not been merged; the implementation branch still has 21 merged baselines. This batch adds two locally validated baselines, leaving 93 components awaiting review (92 queued plus deferred AI Response).

- All 36 focused desktop/mobile browser cases pass, including formatting, underdamped/critical/overdamped springs, interrupted trajectories, template content, keyboard/form behavior, theme geometry, reduced motion and disposal.
- All 56 regression cases pass across the native catalog, framework tabs and previously merged iOS Search Bar. Catalog coverage includes 432 native port mounts across both themes and device profiles.
- All 117 unit tests across 14 files pass. Inherited JSDOM canvas messages remain.
- Production build passes Angular library/demo compilation, strict TypeScript, all 116 registry entries, 136 prerendered routes and all 289 SEO checks.
- The packaged batch contract passes. Installed Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 strict-template consumers compile all 116 selectors and the new optional bindings/template content contracts.
- Lint passes with 21 inherited warnings and no new warnings. Documentation links and whitespace checks pass.

The first digit trajectory run detected a mobile interruption difference. Native digit springs now use the analytical damped-spring solution and React's spring-value rest tolerances, avoiding lost elapsed time from frame caps. The complete 36-case suite passed after that correction. Final demo decoration uses the same radius tokens and active ticker pulse; the final production rebuild and both focused desktop/mobile demo checks pass.

Component reports link the preserved desktop/mobile light/dark screenshots. Independent maintainer review and full user QA remain pending. The earlier iOS Search Bar push passed GitHub Registry CI and Pages deployment; those remote results do not validate this feature batch.

Reproduce with a supported Node version (this work uses Node 22.23.3):

```sh
npm run component:sync
npm run angular:sync
npm run lint
npm test -- --maxWorkers=2
npm run build
npm run test:parity-batch4
npm run test:angular-package
npx playwright test --config playwright.batch4.config.ts
npm run test:browser -- e2e/angular-catalog.spec.ts e2e/framework-tabs.spec.ts e2e/ios-search-parity.spec.ts
```

Set `PLAYWRIGHT_CHANNEL=msedge` on Windows to use installed Microsoft Edge. Rebuild Angular artifacts after source edits before browser tests. The fixtures import the built Angular package and compare it to actual React consumers. Zero-width borders are normalized when comparing painted geometry. Spring samples allow 1.2 digit positions or 10px of accordion height and 0.2 opacity for browser scheduling differences; settled values are checked separately.

Each component retains a native Angular implementation. React source behavior is unchanged. Angular honors reduced motion; both reference components still animate under that preference. Other browser engines, physical devices, assistive technology and SSR remain unverified. Final user QA of all components is still pending.

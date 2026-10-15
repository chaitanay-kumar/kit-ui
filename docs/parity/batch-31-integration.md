# Feature: Angular parity batch 31

- Outcome: Wallet Card and Sticky Pages expose native Angular equivalents of the React contracts, replacing generic collection ports.
- Scope: `wallet-card`, `sticky-pages`; deferred AI Response is outside this batch.
- Base: `feat/angular-parity-batch-31` from merged implementation commit `cfcfc68`.
- Acceptance: source defaults, configurable content, disabled/keyboard wallet action, pointer shine and reduced motion, sticky offsets/heights, template composition, responsive rendering and teardown.
- Authored: `scripts/angular-wallet-card.ts`, `scripts/angular-sticky-pages.ts`, component CSS and demo integration.
- Generated: component/API catalogs and source exports via Angular sync/build.
- Validation: native implementations and focused contracts complete; see checks below.
- Next action: review the batch for integration into `feat/kit-ui-library`.

## Checks and limits

Validated with Node 22.23.3 and Chromium desktop / Pixel 7 emulation:

- `node scripts/verify-parity-batch31.mjs`: passed defaults, callback failure, disabled action, listener disposal, empty pages, content fallback, offsets and heights.
- `npx playwright test --config playwright.batch31.config.ts`: original 12 paired cases passed; two subsequent bare-consumer cases also passed. Wallet geometry and typography, sticky positions at four scroll offsets, template composition, keyboard/disabled behavior and shine/reduced-motion mount are covered.
- Focused Oxlint: passed with no warnings. Full `npm run lint`: passed with existing repository warnings.
- Final focused run: four cases passed (paired geometry renewed and press settle/release added on desktop/mobile). Total distinct batch scenarios: 16 passing cases across the recorded runs.
- `npm test`: 117 tests across 14 files passed.
- `npm run component:sync`, `npm run build`: passed Angular generation/APF/previews, React registry validation, TypeScript, production bundling and 289 SEO checks.
- `npm run test:angular-package`: all 116 selectors and both new usage examples compiled with independent Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 consumers.
- Existing source download generation includes the new component CSS and recursive press-motion dependency.

The passing baseline is scoped to the tests above. Exact intermediate press-animation frames and exhaustive visual states remain outside this batch's coverage. The Sticky Pages Angular demo exercises the real component; the React documentation showcase is bespoke markup. See [Wallet Card](wallet-card.md) and [Sticky Pages](sticky-pages.md) for migration and platform differences.

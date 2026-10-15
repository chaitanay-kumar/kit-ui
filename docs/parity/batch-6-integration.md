# Angular parity batch 6 integration

Hold-to-Confirm and Swipe Action List are validated on `feat/angular-parity-batch-6`, based on pending batch 5 commit `99cb95d`. Integrate the stacked batches in order.

## Result

- Hold-to-Confirm uses React's `onConfirm` contract and optional defaults while retaining the deprecated `confirm` alias.
- Swipe Action List uses React's `onAction` contract, independent per-row action disclosure and exact configured-label completion copy while retaining the deprecated `action` alias.
- Catalog metadata and Angular demos use the parity callback names.

## Focused validation

- `npm run angular:build`: passes and produces the package consumed by the focused checks.
- `node scripts/verify-parity-batch6.mjs`: passes defaults, callbacks, independent disclosure, completion and restore contracts.
- Focused `oxlint` over the changed TypeScript and test files: passes.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch6.config.ts`: 8/8 pass across React/Angular desktop and mobile consumers.
- `git diff --check`: passes before commit.

The full unit suite, general browser regressions, production/SEO build and Angular version matrix are reserved for batch integration. No shared controller, shared style or generator changed. Physical touch devices, Safari/Firefox, screen-reader application testing and SSR remain outside this focused handoff.

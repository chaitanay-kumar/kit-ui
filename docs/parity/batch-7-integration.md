# Angular parity batch 7 integration

FAQ and OTP Input are validated on `feat/angular-parity-batch-7`, based on pending batch 6 commit `f8aab96`. Integrate the stacked batches in order.

## Result

- FAQ replaces the generic collection controller with React's disclosure, controlled state, filtering, category, variant and rich-content contracts.
- OTP Input replaces the single text field with React's per-digit controlled/uncontrolled inputs, focus navigation, paste and callback contracts.
- Both are authored generator definitions; regenerated package sources, catalog metadata and demo mappings are committed with them.

## Focused validation

- `npm run angular:build`: passes and regenerates/compiles the package and preview.
- `node scripts/verify-parity-batch7.mjs`: passes packaged FAQ and OTP contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch7.config.ts`: 16/16 pass across React/Angular desktop and mobile consumers.
- Focused lint and `git diff --check` pass before commit.

The full unit suite, general browser regressions, production/SEO build and Angular version matrix are reserved for integration. Physical mobile keyboards/SMS autofill, Safari/Firefox, screen-reader application testing, SSR and exact FAQ spring motion remain outside this focused handoff.

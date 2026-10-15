# Angular parity batch 19 integration

Book Call Button and Split Button are validated on `feat/angular-parity-batch-19`, stacked on batch 18 commit `03e8def`.

- `npm run angular:build`: passes.
- `node scripts/verify-parity-batch19.mjs`: passes generated public contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch19.config.ts`: 16/16 React/Angular desktop/mobile cases pass after focused locator and React keyboard-reset findings were reflected in the checks.
- Focused lint and `git diff --check` pass before commit.

Full regression, production/SEO, browser and Angular-version matrices remain reserved for integration. Exact Framer Motion spring frames, the noted React keyboard-highlight reset, physical devices, screen-reader application testing and SSR remain outside this focused handoff.

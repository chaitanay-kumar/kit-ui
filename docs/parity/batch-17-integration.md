# Angular parity batch 17 integration

Peek Card and Profile Card are validated on `feat/angular-parity-batch-17`, stacked on batch 16 commit `210dd95`.

- `npm run angular:build`: passes.
- `node scripts/verify-parity-batch17.mjs`: passes generated public contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch17.config.ts`: 16 React/Angular desktop/mobile cases pass after the focused loading-locator correction.
- Focused lint and `git diff --check` pass before commit.

Full regression, production/SEO, browser and Angular-version matrices remain reserved for integration. Exact Framer Motion frames, exact decorative SVG paths, physical devices, screen-reader application testing and SSR remain outside this focused handoff.

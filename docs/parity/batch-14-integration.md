# Angular parity batch 14 integration

Intro Loader and Morphing Shape Loader are validated on `feat/angular-parity-batch-14`, stacked on batch 13 commit `1e98d35`.

- `npm run angular:build`: passes.
- `node scripts/verify-parity-batch14.mjs`: passes generated public contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch14.config.ts`: 16/16 React/Angular desktop and reduced-motion mobile cases pass.
- Focused lint and `git diff --check` pass before commit.

Full regression, production/SEO, browser and Angular-version matrices remain reserved for integration. Exact motion frames, physical devices, screen-reader application testing and SSR remain outside this focused handoff.

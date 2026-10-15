# Angular parity batch 15 integration

Glitch Text and DirectionalTooltip are validated on `feat/angular-parity-batch-15`, stacked on batch 14 commit `a91cccb`.

- `npm run angular:build`: passes.
- `node scripts/verify-parity-batch15.mjs`: passes generated public contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch15.config.ts`: 16/16 React/Angular desktop and reduced-motion mobile cases pass.
- Focused lint and `git diff --check` pass before commit.

Full regression, production/SEO, browser and Angular-version matrices remain reserved for integration. Exact motion frames, dynamic runtime host-tag replacement, projected-trigger attribute cloning, physical devices, screen-reader application testing and SSR remain outside this focused handoff.

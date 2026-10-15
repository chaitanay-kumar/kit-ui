# Angular parity batch 12 integration

Focus Mode and Avatar Stack are validated on `feat/angular-parity-batch-12`, stacked on batch 11 commit `ad22e15`.

- `npm run angular:build`: passes.
- `node scripts/verify-parity-batch12.mjs`: passes packaged runtime contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch12.config.ts`: 16/16 React/Angular desktop/mobile cases pass.
- Focused lint and `git diff --check` pass before commit.

Full regression, production/SEO, browser and Angular-version matrices remain reserved for integration. Exact motion frames, physical devices, screen-reader application testing and SSR remain outside this focused handoff.

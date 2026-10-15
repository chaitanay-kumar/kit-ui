# Angular parity batch 10 integration

Payment Status and Notification Bell are validated on `feat/angular-parity-batch-10`, based on pending batch 9 commit `74f8886`. Integrate the stacked batches in order.

## Result

- Payment Status replaces the generic status panel with React's five-state payment, receipt, formatting and callback contracts.
- Notification Bell replaces the collection controller with React's notification data, unread badge, read actions, controlled panel and dismissal contracts.
- Both use authored generator definitions and component-specific styles; regenerated sources and catalog outputs are committed.

## Focused validation

- `npm run angular:build`: passes and regenerates/compiles the package and preview.
- `node scripts/verify-parity-batch10.mjs`: passes packaged payment and notification contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch10.config.ts`: 16/16 pass across React/Angular desktop and mobile consumers.
- Focused lint and `git diff --check` pass before commit.

The full unit suite, general browser regressions, production/SEO build and Angular version matrix are reserved for integration. Physical devices, Safari/Firefox, screen-reader application testing, SSR and exact in-flight motion frames remain outside this focused handoff.

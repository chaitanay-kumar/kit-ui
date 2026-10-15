# Angular parity batch 9 integration

LockInput and OriginDropdown are validated on `feat/angular-parity-batch-9`, based on pending batch 8 commit `a0abc14`. Integrate the stacked batches in order.

## Result

- LockInput replaces the password locking utility with React's general native input, controlled state, callback, icon and validation presentation contracts.
- OriginDropdown replaces the collection controller with React's controlled menu, side, template, item callback and dismissal contracts.
- Both are authored generator definitions with component-specific styles; regenerated sources and catalog outputs are committed.

## Focused validation

- `npm run angular:build`: passes and regenerates/compiles the package and preview.
- `node scripts/verify-parity-batch9.mjs`: passes packaged input and dropdown contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch9.config.ts`: 16/16 pass across React/Angular desktop and mobile consumers.
- Focused lint and `git diff --check` pass before commit.

The full unit suite, general browser regressions, production/SEO build and Angular version matrix are reserved for integration. Physical devices, Safari/Firefox, screen-reader application testing, SSR and exact in-flight Framer Motion frames remain outside this focused handoff.

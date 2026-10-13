# Angular parity batch 8 integration

DrawCheckbox and Liquid Toggle are validated on `feat/angular-parity-batch-8`, based on pending batch 7 commit `414621d`. Integrate the stacked batches in order.

## Result

- DrawCheckbox replaces the shared toggle model with React's controlled/uncontrolled native checkbox contract, rich label and indeterminate state.
- Liquid Toggle receives React's controlled/uncontrolled switch API, directional keyboard behavior, labels, dimensions and unique SVG blob rendering.
- Both are authored generator definitions with component-specific styles; regenerated sources and catalog outputs are committed.

## Focused validation

- `npm run angular:build`: passes and regenerates/compiles the package and preview.
- `node scripts/verify-parity-batch8.mjs`: passes packaged checkbox and switch contracts.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch8.config.ts`: 16/16 pass across React/Angular desktop and mobile consumers.
- Focused lint and `git diff --check` pass before commit.

The full unit suite, general browser regressions, production/SEO build and Angular version matrix are reserved for integration. Physical devices, Safari/Firefox, screen-reader application testing, SSR and exact Liquid Toggle in-flight spring silhouettes remain outside this focused handoff.

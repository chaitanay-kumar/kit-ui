# Angular parity batch 5 integration

Interactive Data Card and Timeline Scrubber are validated on `feat/angular-parity-batch-5`, based on pending batch 4 commit `bdec712`. Merge or rebase batch 4 first because this branch is stacked on it.

## Result

- Interactive Data Card matches React's defaults, rich content, disclosure accessibility, async status/recovery and callback name. The legacy `action` input remains deprecated.
- Timeline Scrubber matches React's event model, label/value announcements, navigation, callback and dynamic-list behavior. The legacy `eventChange` output remains deprecated.
- Angular catalog metadata, usage examples and the live data-card demo use the parity APIs.
- Contributor guidance now requires focused checks during component work and the full baseline once before batch merge.

## Focused validation

- `npm run angular:build`: passes; compiles the Angular library, package and preview consumed by the focused checks.
- `node scripts/verify-parity-batch5.mjs`: passes packaged defaults, ARIA relationships, async success/failure, callback and dynamic event-list checks.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test --config playwright.batch5.config.ts`: 16/16 pass across desktop and mobile, covering both React and Angular consumers.
- `git diff --check`: passes before commit.

The full unit suite, general browser regressions, production/SEO build and Angular 20/21/22 consumer matrix are intentionally deferred until the batch-merge baseline. No shared controller, shared style or generator changed in this batch.

## Remaining limits

Validation used Microsoft Edge plus mobile emulation. Physical devices, Safari/Firefox, screen-reader application testing, SSR and framework-version consumers remain outside this focused component handoff. AI Response work is untouched and remains deferred.

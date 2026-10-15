# Feature: Angular parity batch 25

- Outcome: native Elastic Sheet and Selection Basket follow their actual React contracts; validated locally, integration pending.
- Scope: `elastic-sheet`, `selection-basket`; React unchanged. AI Response remains deferred and untouched.
- Base: `feat/angular-parity-batch-25` from `5f4cc4e`; clean starting tree and remote batch 24/implementation refs confirmed.

## Implementation

- Original authored `packages/angular/src/elastic-sheet.component.ts`: normalized initial snaps, persistent height on reopen/input changes, callback-on-settle only, title linkage/default copy, all-button pointer capture and reusable template/scalar content with source nullish semantics. Existing native output remains available. Catalog metadata lists the callback/content inputs.
- Authored `scripts/angular-selection-basket.ts`, native motion helper and scoped CSS replace the generic item-selection control. Controlled callbacks, default/custom actions, template icons, all three positioning modes, spring presence, frozen exit snapshots and zero-total short-circuit text follow React.
- Native detail demos use actual source wrappers, file data and callbacks. Paired standards-mode fixtures compare rendered geometry, typography, pointer hits, responsive modes and interactive content. Compiler fixtures cover optional/native callbacks and template content. Tracked catalogs, exports and metadata are regenerated.
- Reports: [Elastic Sheet](elastic-sheet.md), [Selection Basket](selection-basket.md).

## Validation

- `npm run build`: passes Angular generation/build, component registry validation, production build and all 289 SEO checks.
- `node scripts/verify-parity-batch25.mjs`: passes sheet normalization/initial input/persistence/content/ties/callbacks/keyboard/capture/close cleanup and basket defaults/callback-only control/actions/select-all/zero-total/frozen exit/reentry/disposal.
- `PLAYWRIGHT_CHANNEL=msedge node node_modules/@playwright/test/cli.js test --config playwright.batch25.config.ts`: 38 pass on desktop and Pixel 7 with reduced motion. Includes exact rectangles/styles/viewport dimensions/pointer-hit equality; drag/cancellation, disabled/fallback, callbacks, modes, template content without Tailwind, actual demos, responsive rows/typography, exit retention and open-dialog disposal.
- `npm run lint`: passes with inherited warnings. `npm test`: all 117 tests across 14 files pass.
- `npm run test:angular-package`: installed tarball strict consumers compile all 116 selectors on Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1.
- Final source downloads match components, recursive helper/CSS dependencies and shared styles. Diff whitespace checks pass.

## Preserved behavior and limits

- Equal-distance snap ties choose the earlier/lower snap. New snap inputs do not automatically clamp current height. Pointer-up/cancel settles even without a preceding drag. Opening does not emit.
- The source inline basket can exceed a mobile viewport and enlarge layout viewport dimensions. The native port preserves this; explicit geometry/pointer-hit comparisons verify it. Keyboard activation covers snap/close/clear callbacks without forced pointer clicks.
- Basket metadata suggests arrow navigation, but actual source uses normal native Tab navigation. Motion remains active under reduced motion, matching the source. Intermediate spring trajectories, exhaustive arbitrary content/invalid inputs, physical devices and non-Chromium browsers remain outside coverage.
- Earlier fixture HTML audit is still required before integration. No batches are merged or deployed here.
- Next action: review/integrate completed batches in order after that audit; continue the next two queued components on a new stacked branch.

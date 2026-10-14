# Feature: Angular parity batch 26

- Outcome: native Stack Unfold Panel and SettleModal follow their actual React contracts; validated locally, integration pending.
- Scope: `stack-unfold-panel`, `settle-modal`; React unchanged. AI Response remains deferred and untouched.
- Base: `feat/angular-parity-batch-26` from pushed `75dda1b`; clean starting tree and remote refs confirmed.

## Implementation

- Authored `scripts/angular-stack-unfold-panel.ts` and `scripts/angular-settle-modal.ts` replace generic registrations. Tracked native component sources, catalogs, exports and demo metadata are regenerated.
- Stack row/types/motion/style helpers preserve first-card initialization, callback-only/control/internal-state rules, disabled triggers, minimal/default variants, template content, entry/unfold/chevron springs and keyed position/size projection.
- Modal content slots, controlled callbacks, Escape/body-overflow lifecycle, source sizes/options, retained exit/reentry, separate panel/inner/backdrop timelines and cleanup remain native. Completed identity transforms are cleared so inner content does not intercept the close button.
- `packages/angular-demo/src/batch26-demos.ts` uses actual source cards and modal actions. Paired standards-mode fixtures cover dynamic templates, nested behavior, controlled-frame layout and responsive source demos. Strict compiler consumers cover required/optional inputs, callbacks and template types.
- Reports: [Stack Unfold Panel](stack-unfold-panel.md), [SettleModal](settle-modal.md).

## Validation

- `npm run build`: passes Angular generation/build, component registry validation, production build and all 289 SEO checks.
- `node scripts/verify-parity-batch26.mjs`: passes modal control/content/title/options/callback replacement/overflow/listener disposal and stack initialization/ARIA/disabled/single-multiple/callback-only/controlled-hidden-state/card replacement.
- `PLAYWRIGHT_CHANNEL=msedge node node_modules/@playwright/test/cli.js test --config playwright.batch26.config.ts`: 42 pass on desktop and Pixel 7 with reduced motion. Covers actual animations/presence, pointer-close, controlled state, frozen exit/reentry, templates, nested cleanup, sizes/zero content, exact settled geometry/typography, native demos, responsive source comparisons and theme-token consumers without Tailwind.
- Controlled-frame row-size/sibling-position samples match initial/final geometry and stay within 2px during animation (observed desktop exact, mobile ~0.14px).
- `npm run lint`: passes with inherited warnings. `npm test`: all 117 tests across 14 files pass.
- `npm run test:angular-package`: installed tarball strict consumers compile all 116 selectors on Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1.
- Source downloads match component sources, recursive helpers/styles and shared styles. Diff whitespace checks pass.

## Preserved behavior and limits

- Stack initial expansion is not reapplied on card changes. Callback presence suppresses internal updates; controlled clicks without a callback update hidden internal state. Source content IDs are retained.
- Modal is an ordinary aria-modal div with no invented focus trap/autofocus/restoration. Escape invokes every open modal listener; out-of-order closure preserves source overflow restoration, even when that leaves scrolling enabled with a modal open or hidden after both close.
- Both controls retain source motion under reduced motion. Modal inner initial scale is actually 0.98, despite the source comment. Zero-valued content preserves source short-circuit text.
- Every intermediate frame, exhaustive arbitrary content/invalid inputs, SSR, physical devices and non-Chromium browsers remain outside recorded coverage. Earlier fixture HTML audit remains required before integration.
- Next action: review/integrate completed batches in order after that audit; continue the next two queued components on a new stacked branch. No merge or deployment is performed here.

# Feature: Angular parity batch 27

- Outcome: native Liquid Command Palette and Smart Upload follow their React contracts; validated locally, integration pending.
- Scope: `liquid-command-palette`, `smart-upload`; React unchanged. Deferred AI Response remains untouched.
- Base: `feat/angular-parity-batch-27` from pushed `5575d63`; clean starting tree and remote refs confirmed.

## Implementation

- Original authored ports in `packages/angular/src/liquid-command-palette.component.ts` and `smart-upload.component.ts` preserve native Angular APIs. No shared helper/controller changes.
- Palette adds source default commands, explicit undefined defaults, capture-phase shortcut lifecycle, state-driven dialog/close synchronization, current-option scrolling after render, selected background and disabled cursor/ARIA omission.
- Upload adds separate label/input association, source size/progress rounding and validation messages, nullish error display, explicit undefined defaults and missing-handler feedback. Existing abort/retry/stale-event guards and preview disposal are retained and verified.
- Native demo cases use source default navigation and upload wrapper/handler/error wording. Scoped demo CSS supplies source typography/control resets and source dialog margin behavior without changing other demos.
- Strict compiler consumer covers all optional inputs; paired standards-mode fixtures cover browser behavior, responsive light/dark demos and consumers without Tailwind.
- Reports: [Liquid Command Palette](liquid-command-palette.md), [Smart Upload](smart-upload.md). [Completed components](completed-components.md).

## Validation

- `npm run build`: passes Angular generation/APF/demo/download build, component synchronization/registry validation, production build and 289 SEO checks.
- `node scripts/verify-parity-batch27.mjs`: passes upload association, validation/messages, previews, missing handler, duplicate exclusion, finite/clamped/fractional progress, cancellation/stale completion, empty errors, retry/success and destruction; palette defaults/filtering/keyboard/ARIA/recovery and explicit capture-listener disposal.
- `PLAYWRIGHT_CHANNEL=msedge node node_modules/@playwright/test/cli.js test --config playwright.batch27.config.ts`: 32 cases pass; two demo comparisons identify source margin reset missing from native demo. After fixing scoped CSS and `npm run angular:build`, both expanded demo cases pass using `--grep 'responsive source'`. All 34 cases are covered across desktop and Pixel 7 reduced motion.
- Demo rerun includes light/dark geometry/typography, default documentation navigation and actual simulation failure/cancellation. Initial harness issues (render timing and ARIA-disabled click actionability) are corrected with named-option waits and dispatched handler checks; assertions are preserved.
- `npm run lint`: passes with inherited warnings. `npm test`: all 117 tests across 14 files pass.
- `npm run test:angular-package`: installed tarball strict consumers compile all 116 selectors on Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1. Demo-only CSS rebuild emits the identical library tarball hash.
- Rebuilt source downloads match authored component sources, shared types and controls CSS after newline normalization. Whitespace checks pass.

## Preserved behavior and limits

- Search/status persist across close/reopen. Pending commands are not cancelled; success closes a reopened palette. Query matching is not trimmed; disabled-only results remain visible. The actual site source reset places the palette at the top left; the native detail demo preserves it.
- Upload capacity precedes size/type checks, duplicate filenames remain allowed, empty Error messages remain empty, raw progress remains fractional, and pending Cancel remains enabled when the component becomes disabled.
- Native methods/signals remain Angular conveniences; generated IDs differ while accessible links remain valid. Shared controls CSS supplies reduced-motion behavior.
- Physical devices, non-Chromium browsers, SSR and exhaustive arbitrary/invalid inputs remain outside recorded coverage. Earlier fixture HTML audit is still required before integration.
- Next action: review/integrate completed batches in order after that audit; continue the next two queued components on a new stacked branch. No merge or deployment is performed here.

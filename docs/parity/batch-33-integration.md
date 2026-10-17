# Feature: Angular parity batch 33

- Outcome: Morphing Dialog and VelocityToast now expose native equivalents of the actual React overlay, timing, dismissal, appearance and animation contracts.
- Status: validated baseline locally; integration remains for review. AI Response stays deferred.
- Base: `feat/angular-parity-batch-33` from pushed batch 32 `bf15b4a5cebee0be48d46ad2568f4b142a8475a5`.
- Progress: 81/116 recorded baselines; 75 merged, six awaiting review from batches 31-33, 34 queued and AI Response remaining.
- Contracts, migration and scoped limits: [Morphing Dialog](morphing-dialog.md), [VelocityToast](velocity-toast.md).

## Changes

- Focused authoring: `scripts/angular-morphing-dialog.ts`, `scripts/angular-velocity-toast.ts`; generator replaces unrelated generic action/notification collection ports.
- Native CSS/motion: `packages/angular/src/morphing-dialog{,-motion,-projection}` and `velocity-toast{,-motion}`, using the existing analytic spring helper.
- Required lazy trigger/content templates, source scroll-lock/Escape/backdrop semantics, optional matching shared-surface projection, property-specific delayed child entries and retained exits.
- Source local toast visibility, countdown resets, hover pause/resume, hidden-progress timing, variants/positions/custom icons, callback failure ordering and deferred MotionValue-style drawing.
- Native demos, framework usage, required/optional strict package consumer templates; paired/bare fixtures and focused package/motion/appearance tests. Regenerated component/API/demo maps and local source-discovery output; ignored APF/previews/source/downloads regenerated.

## Validation

Node 22.23.0; Edge Chromium desktop and Pixel 7 emulation, including mobile reduced-motion preference:

- `node scripts/verify-parity-batch33.mjs`: defaults, eased countdown, hover pause/resume, local visibility versus external open, duration reset, hidden-progress behavior, throwing callbacks, lazy content, overflow writes, Escape, retained exit/reopening and disposal pass (`.batch33-final-contract.log`, terminal 0).
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test e2e/parity-batch33.spec.ts e2e/parity-batch33-motion.spec.ts`: 28/28 pass (`.batch33-final-stable-browser.log`, session 16959 terminal 0). Includes settled geometry/fonts, six positions/five variants/custom icon geometry, bare consumer, source focus/overflow behavior, dynamic subtitle/frozen exit data, actual demos, intermediate toast/countdown/plain-dialog/shared-projection entry/exit/interruption samples.
- Strengthened fresh-mount toast entry setup renewed on desktop after the full run: one case passes (`.batch33-fresh-entry-renewal.log`, session 92774 terminal 0). The mobile worker already ran the strengthened setup. This renews an existing scenario rather than adding to the distinct count.
- `npm run lint`: passes with repository warnings (`.batch33-lint.log`); focused authored/fixture lint also passes (`.batch33-focused-lint.log`).
- `npm test`: all 117 tests across 14 files pass (`.batch33-unit.log`, terminal 0).
- `npm run build`: Angular sync/APF/previews, React registry/component sync, TypeScript, production bundling, prerender and all 289 SEO checks pass (`.batch33-production-build.log`, terminal 0).
- `npm run test:angular-package`: independent Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 compilers pass all 116 selectors, optional native bindings and both new usage examples (`.batch33-package-matrix.log`, session 92885 terminal 0).
- Source downloads contain CSS, motion helpers, nested projection helper and recursive spring dependency. Settled mobile dialog screenshots visually inspected alongside the computed comparisons.

The checks corrected source font/radius differences, custom-icon color inheritance, progress drawing phase and shared return/interruption crossfades. Fixture refinements wait for the rendered overlay and newly used semibold font; controlled-clock tests allow 90s. A first final run hit the previous 45s limit under concurrent compiler load and a font-loading measurement race; the isolated final run above passes. Earlier logs are retained locally.

Baseline scope follows the actual React source, including its missing dialog role/focus trap/restoration, fixed shared-layout ID, overflow overwrite behavior and lack of component reduced-motion hooks. Native shared projection currently measures boxes at overlay creation; custom trigger transitions, colliding/nested shared trees and live content/viewport retargeting are outside the validated scope. The component reports record these limits rather than claiming exhaustive parity or accessibility certification.

## Preserved work and next action

- Earlier batch 31 WIP and integration audit remain in named stashes from batch 32. Completed batches 4-30 remain merged at `cfcfc68`; batches 31-33 remain for review.
- Older standards-mode fixture audit is still outstanding: preserved checks passed batches 11-13 and stopped on a desktop Intro Loader failure in batch 14. Final user QA remains required after the full queue.
- Next action: push this completed baseline, then start batch 34 with Dependency Trace and Recovery Ledger. Existing Vite session 8136 remains available; verification runners are complete.

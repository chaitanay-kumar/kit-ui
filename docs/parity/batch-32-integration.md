# Feature: Angular parity batch 32

- Outcome: SpringSelect and Gooey Menu now follow actual React selection, keyboard, dismissal, appearance and motion contracts.
- Status: validated locally; integration remains for review. AI Response stays deferred.
- Base: `feat/angular-parity-batch-32` from completed batch 31 `c8db7cce06e7a9fc6eebc1383ac3773417259ed7`, stacked on merged implementation `cfcfc68`.
- Progress: 79/116 validated baselines, 75 merged and four awaiting review from batches 31/32; 36 queued plus AI Response remain.
- Contracts, migration and limits: [SpringSelect](spring-select.md), [Gooey Menu](gooey-menu.md).

## Changes

- Authored definitions: `scripts/angular-spring-select.ts`, `scripts/angular-gooey-menu.ts`; generator replaces unrelated generic ports.
- Native CSS and analytic springs: `packages/angular/src/{spring-select,gooey-menu}.css` and matching `*-motion.ts`, using existing `batch20-spring.ts`.
- Native examples and usage: `packages/angular-demo/src/batch32-demos.ts`, demo routing, `src/lib/framework/angular-catalog.ts`.
- Evidence: `scripts/verify-parity-batch32.mjs`, paired and bare fixtures plus `e2e/parity-batch32{,-motion}.spec.ts`; strict package consumer coverage extended for required SpringSelect options and both usage examples.
- Regenerated component sources, API catalogs, preview maps and local SEO outputs. Ignored APF/previews/downloads/source JSON regenerated.

## Validation

Node 22.23.0; Edge Chromium desktop and Pixel 7 emulation, including mobile reduced-motion preference:

- `npm run angular:build`: final authored definitions and root-attribute fix pass (`.batch32-root-bindings-build.log`, terminal exit 0).
- `node scripts/verify-parity-batch32.mjs`: required/default/controlled inputs, empty values/options, callback ordering/failure, native focus, keyboard quirks, retained exit, root styles/attributes, dismissal listener and RAF disposal pass (`.batch32-root-bindings-contract.log`).
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test e2e/parity-batch32.spec.ts e2e/parity-batch32-motion.spec.ts`: 36/36 pass (`.batch32-final-browser.log`). Covers paired settled geometry/type/colors, intermediate entry/exit/reopen samples, source focus/navigation, callbacks and controlled updates, frozen exit content, bare consumer and actual native demos.
- Subsequent isolated root-binding fix: eight affected desktop/mobile cases pass, including two new attribute/style cases (`.batch32-root-bindings-browser.log`). Total distinct scenarios: 38. Six of the eight renew existing Gooey cases.
- `npm run lint`: passes with repository warnings (`.batch32-lint.log`); final focused lint passes (`.batch32-focused-lint.log`).
- `npm test`: 117 tests across 14 files pass (`.batch32-unit.log`).
- `npm run build`: Angular sync/APF/previews, React component sync/registry, TypeScript, production bundling, prerender and 289 SEO checks pass (`.batch32-production-build.log`). This full baseline precedes the isolated root-attribute fix; final APF/package/browser checks above validate that fix without changing the public input types.
- `npm run test:angular-package`: independent Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 consumers compile all 116 selectors, optional input bindings and both new usage examples (`.batch32-package-matrix.log`). Public API unchanged by the subsequent root-binding fix.
- Source-download evidence includes each CSS file and recursive motion helper / `batch20-spring.ts` dependencies. Settled select screenshots visually inspected alongside the computed comparisons.

The checks corrected a test accessible-name assumption, source font/radius differences, error/open border precedence and a root-attribute overwrite. Earlier failing logs remain available locally; they are superseded by the recorded passing runs. No physical-device, other-engine or exhaustive pixel certification is claimed. Source reduced-motion, keyboard and fixed-ID quirks and native demo differences are documented in the component reports.

## Preserved work and next action

- Earlier batch 31 WIP and integration audit remain in named Git stashes: `Preserve earlier batch 31 work before adopting completed remote batch 31` and `Preserve earlier integration fixture audit before adopting completed remote merge`. They are not applied over newer work.
- Completed batches 4-30 were already merged/deployed externally at `cfcfc68`; their remote branches were removed. Removed 28 local completed branches only after ancestry verification. Batch 31 and this batch remain for integration review.
- Earlier standards-mode fixture audit remains outstanding: preserved checks passed batches 11-13 and stopped on a desktop Intro Loader test failure in batch 14. Final user QA remains required after the full queue.
- Next action: push this validated batch, then begin batch 33 with Morphing Dialog and VelocityToast, retaining review boundaries.

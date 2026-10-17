# Feature: Angular parity batch 34

- Outcome: Dependency Trace and Recovery Ledger match actual React graph interaction, timeline data, restore lifecycle, appearance and motion baselines.
- Status: validated locally; integration remains for review. AI Response stays deferred.
- Base: `feat/angular-parity-batch-34` from pushed batch 33 `7cec76514c711be4bdc1874bf5c95957803d019e`.
- Progress: 83/116 baselines recorded; 75 merged, eight awaiting review from batches 31-34, 32 queued and AI Response remaining.
- Contracts, migration and limits: [Dependency Trace](dependency-trace.md), [Recovery Ledger](recovery-ledger.md).

## Changes

- Focused authoring: `scripts/angular-dependency-trace.ts`, `scripts/angular-recovery-ledger.ts`; replace the graph row in `scripts/angular-complex-ports.ts` and recovery row in the main generator.
- Native SVG motion/CSS and ledger entry/types/detail/chevron/CSS helpers in `packages/angular/src/`, using the existing analytic spring helper.
- Source-required data, exact geometry/defaults, callback ordering/failure, graph truthiness/invalid-edge behavior, ledger controlled head/pending restore/finally recovery and retained details.
- Actual source-data demos, framework usage and required/optional strict consumer bindings. Paired/bare/motion/state fixtures plus disposal and data-replacement evidence.
- Regenerated tracked component/API/demo maps and source discovery; ignored APF/previews/source JSON/downloads rebuilt.

## Validation

Node 22.23.0; Edge Chromium desktop and Pixel 7 emulation, including mobile reduced-motion preference:

- `node scripts/verify-parity-batch34.mjs`: both focused contracts pass (`.batch34-final-contract.log`, terminal 0). Covers coordinates/partial fallback, raw versus valid connections, label truncation, hover precedence/selection, callback failures, empty IDs/data/defaults; date handling/current head/disclosure, restore propagation/guard, rejection/finally readiness and compact/empty behavior.
- `PLAYWRIGHT_CHANNEL=msedge npx playwright test e2e/parity-batch34.spec.ts e2e/parity-batch34-motion.spec.ts`: 32/32 pass (`.batch34-final-browser.log`, session 92948 terminal 0). Covers paired settled geometry/fonts/SVG paths, intermediate pulse/glow/entry/detail/chevron motion and reversal, actual demos, bare consumer, restore rejection/success, frozen exit data, selected/zero-coordinate replacement, pending requests across row replacement/unmount and observable animation-frame stop after disposal.
- `npm run lint`: passes with repository warnings (`.batch34-lint.log`); focused authored/fixture lint passes without warnings (`.batch34-focused-lint.log`).
- `npm test`: all 117 tests across 14 files pass (`.batch34-unit.log`, terminal 0).
- `npm run build`: Angular sync/APF/previews, React component sync/registry, TypeScript, production bundling, prerender and all 289 SEO checks pass (`.batch34-production-build.log`, terminal 0).
- `npm run test:angular-package`: independent Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 compilers pass all 116 selectors, required/optional source bindings and both new usage examples (`.batch34-package-matrix.log`, session 42517 terminal 0).
- Source-download dependency evidence includes graph motion/CSS and nested ledger entry/types/motion/CSS plus the spring helper. Final rendered screenshots and frame JSON are under ignored test-results.

Initial fixtures clicked a continuously pulsing group and timed out; targeting the actual node circle preserves meaningful interaction assertions. Rendered evidence corrected source font-weight presentation attributes overridden by font-medium CSS, SVG opacity/transform handling, the timeline rail sibling margin, explicit-duration easeOut keyframes and the initial padded/bordered detail box. Earlier failing logs remain available; the final run above supersedes them. No assertions or accessibility behavior were weakened to hide these differences.

Baseline preserves source quirks: SVG groups and ledger card/chevron toggles are not keyboard buttons; metadata does not prove conformance. Fixed dark styling, ignored metadata/type/connection labels, raw counts and empty-ID truthiness remain. Other engines/devices, arbitrary consumer styling and very large graph performance are outside this baseline; see the component reports.

## Preserved work and next action

- Earlier named stashes, deferred AI work and completed review branches remain. Batches 4-30 remain merged at `cfcfc68`; batches 31-34 await review.
- Older standards-mode fixture audit remains outstanding: preserved checks passed batches 11-13 and stopped on desktop Intro Loader in batch 14. Final user QA is required after the full queue.
- Next action: push this batch, then begin batch 35 with Pricing and Stacked Cards. Vite session 8136 remains available; verification runners are complete.

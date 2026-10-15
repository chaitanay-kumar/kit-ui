# Feature: Angular parity batch 23

- Outcome: native Dot Field canvas and Floating Action Dock match React visuals and behavior.
- Scope: `dot-field`, `floating-action-dock`; repair native showcase layout for batch-21 Meteors and batch-22 Blob/Orbit demos; align Meteors' shared keyframe angle behavior. React remains unchanged.
- Base: `feat/angular-parity-batch-23`, `6339642`; remote batch 22 confirmed and starting tree clean.

## Acceptance criteria

- Static dot drawing matches DPR cap, spacing, centered grid, gradient, resize/input redraw and disposal; no unrelated animation controls.
- Dock supports required items, templated icons, controlled active ID, callbacks, hover tooltip/magnification, native keyboard/form behavior, press cancellation and disposal.
- Match actual source defaults and quirks; record framework mappings and rendering limits.
- Focused package/browser checks and full batch baseline pass on fresh artifacts.

## Relevant files

- React: `src/components/ui/DotField.tsx`, `FloatingActionDock.tsx`, metadata and source detail demos.
- Angular definitions: `scripts/angular-dot-field.ts`, `scripts/angular-floating-action-dock.ts`; registration in `scripts/generate-angular-ports.ts`.
- Native drawing/motion/styles: `packages/angular/src/dot-field-drawing.ts`, `dot-field.css`, `floating-action-dock-motion.ts`, `floating-action-dock.css`. Dock reuses `batch20-spring.ts`; only its scope comment changes, not its math.
- Native demos: `packages/angular-demo/src/batch23-demos.ts`, `demo.component.ts`; wrapper repairs in `batch21-demos.ts`, `batch21-demos.styles.ts`, `batch22-demos.ts`.
- Earlier contracts: `scripts/angular-meteors.ts`, `packages/angular/src/meteors.css`; global angle precedence/removal coverage in the batch-21 fixture/spec and package verifier. Batch-20 through batch-23 fixture HTML includes standard doctype and viewport metadata; physical pointer coordinates remain inside the actual viewport.
- Evidence: batch-23 browser/contract/bare/reference fixtures, `playwright.batch23.config.ts`, `scripts/verify-parity-batch23.mjs`, optional-input consumer in `scripts/verify-angular-package.mjs`.
- Generated: component source, catalog and framework/demo metadata via `angular:sync`.

## Validation and handoff

- Changes: static grid and controlled native dock replace generic implementations. Demos now use native wrapper CSS rather than unavailable Tailwind utilities; the source-sized dot field has explicit dimensions. Earlier Meteors/Blob/Orbit wrapper fixes are covered by the same batch suite.
- Checks use Node 22.23.0 and `PLAYWRIGHT_CHANNEL=msedge`:
  - `npm run build`: passes Angular APF, native preview, tarball, registry sync (116 entries), TypeScript, production build, prerender and 289 SEO checks. Existing font-resolution and bundle-size warnings remain.
  - `npm run angular:sync`: passes; 108 generated ports and 116 catalog components covered.
  - `npm run lint`: passes with inherited warnings. `npm test`: all 117 tests in 14 files pass.
  - `node scripts/verify-parity-batch21.mjs`, `verify-parity-batch22.mjs`, `verify-parity-batch23.mjs`: pass defaults, drawing/spring geometry, live inputs, source quirks, missing context, optional native browser APIs and disposal. Includes Meteors style-block updates/removal and dock removed-item cleanup.
  - `node node_modules/@playwright/test/cli.js test --config playwright.batch23.config.ts`: final standards-mode run passes all 98 cases across batches 21 through 23, desktop and mobile. Includes identical canvas PNG hashes, dock focus/press/hover/custom-icon propagation, native DOM attributes, no-Tailwind consumers, actual narrow responsive styles and source showcase card/text bounds and typography.
  - `node node_modules/@playwright/test/cli.js test --config playwright.batch20.config.ts`: standards-mode regression run passes 57 cases with 3 intentional reduced-motion mobile skips for unreduced spring checks (60 listed cases).
  - `npm run test:angular-package`: all 116 selectors and dedicated optional/native-input consumers pass each installed Angular compiler with strict templates: 20.0.0, 20.3.33, 21.2.25, 22.2.1.
  - Downloaded component source and all local drawing/motion/CSS dependencies match after newline normalization. `git diff --check` passes. Screenshots were visually reviewed; ignored build/test artifacts are excluded from the commit.
- Remaining issues: no known blocker for the recorded batch contracts. Preserved source quirks, framework mappings and validation limits are recorded in [Dot Field](dot-field.md) and [Floating Action Dock](floating-action-dock.md). Earlier fixture doctype/viewport auditing remains explicit in the main tracker before integration; the wider queue and user QA are unfinished.
- Next action: maintainer review and ordered integration; continue with the next two queued components.

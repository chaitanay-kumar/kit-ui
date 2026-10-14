# Feature: Angular parity batch 22

- Outcome: Morphing Blob and Circular Orbit render their source SVG/gallery effects through native Angular.
- Scope: `morphing-blob`, `circular-orbit`; React is the unchanged contract.
- Base: `feat/angular-parity-batch-22`, `132ad6a`; batch 21 is pushed and validated.

## Acceptance criteria

- Blob preserves Catmull–Rom geometry, gradient, spring retargeting, cursor scaling/smoothing, reduced-motion snapshot and cleanup.
- Orbit preserves items/title, responsive measured radius, depth/scale geometry and rendered filter behavior, eased hover pause/resume, reduced-motion snapshot and resize cleanup.
- Source quirks on dynamic inputs are tested and documented rather than silently changed.
- Regenerated package and demos pass focused package/browser checks and the full batch baseline.

## Relevant files

- React: `src/components/ui/MorphingBlob.tsx`, `src/components/ui/CircularOrbit.tsx` and metadata.
- Angular: `scripts/angular-morphing-blob.ts`, `scripts/angular-circular-orbit.ts`, registered in `scripts/generate-angular-ports.ts`.
- Native geometry/motion/styles: `packages/angular/src/morphing-blob-motion.ts`, `morphing-blob.css`, `circular-orbit-motion.ts`, `circular-orbit.css`, and the two-port `batch22-frame.ts` scheduler helper.
- Demos: `packages/angular-demo/src/batch22-demos.ts`, `demo.component.ts`.
- Evidence: `e2e/parity-batch22.spec.ts`, contract/bare fixtures, `playwright.batch22.config.ts`, `scripts/verify-parity-batch22.mjs`, `scripts/verify-angular-package.mjs`.
- Generated: component source, catalog, framework/demo metadata via `angular:sync`.

## Validation and handoff

- Changes: native SVG blob and responsive image gallery replace generic canvases. Input defaults, source state quirks, styles and detail settings are preserved. Stale batch-21 queue rows are corrected, and row-derived counts agree with the summary. Frame loops use native DOM updates outside Angular change detection; source React is unchanged.
- Checks use Node 22.23.0 and `PLAYWRIGHT_CHANNEL=msedge`:
  - `npm run build`: passes Angular APF, standalone demo, tarball, registry sync (116 entries), TypeScript, production build, prerender and 289 SEO checks. Existing font and bundle-size warnings remain.
  - `npm run angular:sync`: passes; 108 generated ports and 116 catalog components covered.
  - `npm run lint`: passes with inherited warnings. `npm test`: 117 tests in 14 files pass.
  - `node scripts/verify-parity-batch22.mjs`: passes deterministic Catmull–Rom/spring geometry, point-state retention, reduced motion, measured radius, hover speed/resume semantics, optional browser APIs, RAF/timer/listener disposal and ResizeObserver disconnection.
  - `node node_modules/@playwright/test/cli.js test --config playwright.batch22.config.ts`: final expanded run passes all 32 cases across React/Angular desktop and mobile, including static geometry, light/dark styles, cursor/hover/resize behavior, no-Tailwind consumers and source detail-demo settings. Desktop static screenshots were also visually inspected.
  - `npm run test:angular-package`: all 116 selectors and dedicated batch-22 optional inputs/types pass strict templates using each installed Angular compiler: 20.0.0, 20.3.33, 21.2.25, 22.2.1.
  - Downloaded component source and all local motion/frame/CSS dependencies match after newline normalization. `git diff --check` passes.
- Source quirks and framework/validation boundaries: [Morphing Blob](morphing-blob.md), [Circular Orbit](circular-orbit.md). No claim of identical random intermediate frames or renderer startup timestamps. Physical devices, other browsers, SSR/hydration and application screen-reader testing are outside the recorded validation.
- Next action: maintainer review and ordered integration; continue with the next two queued components.

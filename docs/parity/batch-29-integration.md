# Feature: Angular parity batch 29

- Outcome: Small Floating Dock and Branching Submenu have validated native Angular baselines; integration pending.
- Scope: `small-floating-dock`, `branching-submenu`; React unchanged. Deferred AI Response is untouched.
- Base: `feat/angular-parity-batch-29` from pushed `55babf163a57f64da18dc7c0611d78f74f31472b`; clean starting tree and remote refs confirmed.

## Implementation

- Authored ports: `scripts/angular-small-floating-dock.ts`, `angular-branching-submenu.ts`; focused registrations replace generic nav/disclosure definitions in `generate-angular-ports.ts`.
- Native helpers/styles: `packages/angular/src/small-floating-dock-motion.ts`, `small-floating-dock.css`, `branching-submenu-motion.ts`, `branching-submenu.css`.
- Dock preserves required first-five items/actions, template/scalar icons, badge filtering/cap, defaults/undefined values, all sizes/anchors/variants, controlled active presentation, focus tooltips, hover/press/presence springs, scroll lifecycle and disposal.
- Submenu preserves defaults/fallback, ordinary tab access, indexed keyboard focus/open behavior, responsive two-column geometry, retained panels/reentry, initial-panel child suppression, later-panel child insertion, initially empty entrance, root bindings and reduced-motion mount snapshot.
- Shared helper `animated-tabs-motion.ts` accepts an optional selector and preserves initial internal-handoff origins, refreshes snapshots on parent input capture, and uses current snapshots for remeasurement/removal. `scripts/angular-animated-tabs.ts` and its generated component receive that input-capture distinction.
- Native actual demos: `packages/angular-demo/src/batch29-demos.ts`, demo routing/styles. Exact source icon geometry, data/no-op actions and wrappers are retained.
- Framework examples and installed package verifier supply required dock data and compile exact displayed batch 28/29 examples plus optional-input/template/SVG consumers.
- Generated components/catalogs/demo map/exports/llms and ignored APF/demo/source-download artifacts are regenerated. Reports: [Small Floating Dock](small-floating-dock.md), [Branching Submenu](branching-submenu.md); shared follow-up recorded in [Animated Tabs](animated-tabs.md).

## Validation

- `npm run build`: final generation, APF/demo/download, registry, TypeScript/Vite/prerender and all 289 SEO checks pass (`.batch29-verified-build.log`).
- `npm run lint`: passes with inherited warnings. `npm test`: all 117 tests in 14 files pass (`.batch29-lint.log`, `.batch29-unit.log`).
- `node scripts/verify-parity-batch29.mjs`: final packaged contracts pass data/defaults/actions, exact source-generator spring values, source sampled exit duration, retained/reentered panels, actual keyboard focus, root binding override/removal, reduced-motion behavior, empty data and disposal (`.batch29-verified-contract.log`). Batch 28 packaged Tabs/Velocity regressions also pass (`.batch29-verified-tabs-contract.log`).
- `PLAYWRIGHT_CHANNEL=msedge node node_modules/@playwright/test/cli.js test --config playwright.batch29.config.ts`: full 62-case source/native desktop/Pixel 7 suite passes, covering all 18 dock size/anchor/variant combinations, settled geometry, real controls, actual light/dark demos and bare consumers (`.batch29-coverage-browser.log`). Later focused checks cover final motion/helper changes; these are separate runs, not one aggregate suite.
- `--config playwright.batch29-motion.config.ts`: both intermediate dock hover/tooltip/press/release cases pass (`.batch29-motion-fixed-browser.log`); both shared submenu handoff/leader-removal cases pass (`.batch29-capture-shared-browser.log`). Four affected dock lifecycle cases pass (`.batch29-dock-lifecycle-browser.log`).
- Four expanded submenu selection/input-layout cases include root, branch, parent buttons and selected indicator and pass (`.batch29-capture-layout-browser.log`). All six Animated Tabs shared handoff/interruption/removal regressions pass (`.batch29-capture-tabs-browser.log`).
- Twelve paired original-panel insertion suppression, later-panel insertion and initially-empty branch cases pass (`.batch29-child-suppression-browser.log`).
- Settled geometry retains 1px tolerance; intermediate/shared geometry 2px and opacity .025. Canvas RGBA normalizes equivalent browser OKLab/RGBA strings. Controlled clocks use fresh contexts, disable Element.animate for both fixtures and flush queued work without forcing extra source ancestor renders. Real-time tests retain Web Animations.
- `npm run test:angular-package`: final installed tarball compiles all 116 selectors, optional-input/template/SVG consumers and exact displayed examples with each version's own compiler: Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 (`.batch29-verified-package.log`).
- Final source downloads match dock/submenu/updated Tabs main files, types, shared styles and every recursive helper/CSS dependency after newline normalization. All new fixture HTML has doctype/viewport headers. Whitespace/link/count checks pass.

## Handoff and limits

- Tracker/completed list now record 73/116 validated: 21 merged and 52 pending integration; 42 queued plus deferred AI Response remain unvalidated.
- Physical devices, non-Chromium engines, SSR, exhaustive arbitrary/invalid HTML/style/data combinations and every motion frame are outside recorded coverage. Angular templates/native bindings/CSS/query APIs provide framework equivalents.
- Earlier standards-mode fixture audit remains required before integration. Maintainer integration review and eventual user QA remain outstanding; the overall goal stays active.
- Delivery: implementation commit `6885e54` is pushed to `origin/feat/angular-parity-batch-29`; remote commit equality and clean worktree verified.
- Next action: continue two queued components on a new stacked branch. Preserve integration review and deferred AI Response.

# Feature: Angular parity batch 30

- Outcome: native Glass Navbar and Scroll Progress Navigation follow React appearance, data contracts, interactions and motion.
- Scope: `glass-navbar`, `scroll-progress-nav`. Leave integration for review; preserve deferred AI Response.
- Base: `feat/angular-parity-batch-30` from pushed `b183341620cda71e30dfac52bc146a05e27b7d9d`. Implementation remote remains `0004d4335bb4ce3fd4036f46d795ec070df9fc91`.
- Status: validated locally; integration pending. Tracker: 75/116 (21 merged, 54 pending), 40 queued plus deferred AI Response.

## Acceptance and implementation

- Glass: source defaults and template/scalar brand/CTA/icons; real anchors/external attributes; initial label-based active state, truthy input synchronization and local click selection; callback ordering/failure; responsive variants; Escape/body overflow lifecycle; retained panel exit/reentry; keyed icon and shared active/hover springs.
- Progress: source sections/defaults; manual/truthy active selection; container/window ratio/clamping/hold; threshold and fixed/inline/sticky state; ref identity versus mutable current; source scroll offsets/actions/callback failure; compact/full layouts, parent projection and active-pill compensation; disposal. Preserve actual reduced-motion behavior despite metadata claims.
- Authored ports: `scripts/angular-glass-navbar.ts`, `scripts/angular-scroll-progress-nav.ts`; CSS/motion helpers under `packages/angular/src/`. Generator replaces only their generic entries. Generated components/catalogs/demo map/framework metadata regenerate through Angular sync.
- Shared `animated-tabs-motion.ts` gains optional spring configuration and parent projection. Existing callers retain default 220/32/1 behavior. Glass uses source active 170/26/.9 and hover 380/30/.5.
- Actual native demos and routing: `packages/angular-demo/src/batch30-demos.ts`, `demo.component.ts`. Angular usage examples in `src/lib/framework/angular-catalog.ts`; both included in installed compiler consumers.
- Evidence: paired/bare/source-demo fixtures and specs under `e2e/`; `scripts/verify-parity-batch30.mjs`; [Glass report](glass-navbar.md), [Progress report](scroll-progress-nav.md).

## Validation

Use Node 22 from the session's npm-cache Node installation and `PLAYWRIGHT_CHANNEL=msedge` for browsers.

| Check | Result / evidence |
| --- | --- |
| Packaged component contracts | Pass: scroll ratios/clamp/hold, ref/effect/mode lifecycle, actions/callback ordering/failure/defaults/disposal; Glass slots/selection/anchors/Escape/body overflow, retained view and source-generator motion (`.batch30-hidden-layout-contract.log`). |
| Full Glass suite | 18 desktop/mobile cases pass: bare native consumers, actual demos, variants/scalars/templates, interactions, panel/icon/active/hover controlled motion (`.batch30-full-glass-browser.log`). |
| Full Progress suite | 12 desktop/mobile cases pass: actions/selection, contained scrolling, fixed anchors/modes, intermediate threshold/selection/compact expansion motion (`.batch30-full-progress-browser.log`). |
| Shared packaged regressions | Batches 28/29 pass after optional projection addition (`.batch30-projection-batch28-contract.log`, `.batch30-projection-batch29-contract.log`). |
| Lint / unit baseline | Pass with lint warnings; 14 files / 117 tests pass (`.batch30-baseline-lint.log`, `.batch30-baseline-unit.log`). New bare fixture/spec focused lint passes (`.batch30-final-fixture-lint.log`). |
| Production baseline | Pass: Angular sync/APF/demo/downloads, component sync/116-entry registry, TypeScript/client build, prerender and 289 SEO checks (`.batch30-baseline-build.log`, session 63392 terminal 0). |
| Installed compiler matrix | Pass: all 116 selectors and exact usage examples on Angular 20.0.0, 20.3.33, 21.2.25, 22.2.1 (`.batch30-baseline-package.log`, session 30569 terminal 0). |
| Source downloads | Main/types/shared styles and recursive dependencies match for Glass (4), Progress (4), updated Tabs (3), after newline normalization. Must renew Progress CSS comparison after final rebuild below. |
| Standards / scope | All batch HTML fixtures have doctype/viewport. Generator/helper scope reviewed; generated llms changes are target descriptions. AI work unchanged. |

Controlled browser checks disable Web Animations in both frameworks; real-time cases retain it. Geometry tolerance remains 2px, opacity .025 and matrix .03 where applicable.

## Differences resolved

- Panel auto-height uses collapsed padding/border measurement and exact badge line-height. Atomic reentry stays within the actual exit window; an earlier mobile attempt reopened after completion.
- Desktop and compact labels now use Inter Variable, matching computed React font metrics. Native demo card spacing follows source inline-span space-y behavior.
- Hidden desktop pill measurements no longer project into compact expansion; the progress consumer releases its indicator controller while it has no client rects.
- CSS colors compare rendered RGBA channels rather than equivalent OKLab/RGBA string serialization.

## Final handoff

- Full browser pipeline session 32190 terminal exit 0: Glass 18, Progress 12, shared Tabs 6 and Submenu selection 2 cases pass on desktop/mobile.
- Final source review consolidated Inter inheritance onto the Progress wrapper, matching React font-sans. Session 85285 terminal exit 0: Angular APF/demo/download rebuild, packaged contracts, four Progress geometry/motion and four bare/demo checks pass (`.batch30-wrapper-font-build.log`, `.batch30-wrapper-font-contract.log`, `.batch30-wrapper-font-browser.log`, `.batch30-wrapper-font-demo-browser.log`). Renewed Progress main and recursive source downloads match final CSS. No verification processes remain live.
- Full production/library baseline ran once. The later CSS-only wrapper consolidation was verified by rebuilding Angular and affected rendered checks; compiler API and React production sources were unchanged.
- Both reports and completed list record validated baselines. No unresolved component difference found within recorded coverage. Integration remains for maintainer review; no merge or deployment performed.
- Commit and push the completed batch, then begin batch 31 from its pushed HEAD. Wallet Card (183 source lines, pointer shine/action props) and Sticky Pages (210 lines, CSS sticky composition) are the next simpler candidates; read full contracts/authored ports/demos before implementation.
- Overall remaining work: 41 unvalidated components, earlier standards-mode fixture audit (batches 11–19), integration review, preserved deferred AI Response and final user QA. The overall goal remains active.

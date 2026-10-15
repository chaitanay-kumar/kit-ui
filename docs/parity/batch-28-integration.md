# Feature: Angular parity batch 28

- Outcome: native Animated Tabs and Scroll Velocity Text follow actual React rendering, state and motion contracts; validated locally, integration pending.
- Scope: `animated-tabs`, `scrollvelocitytext`; React unchanged. AI Response remains deferred and untouched.
- Base: `feat/angular-parity-batch-28` from pushed `dbc14bf`; clean starting tree and remote refs confirmed.

## Implementation

- Authored definitions: `scripts/angular-animated-tabs.ts`, `angular-scroll-velocity-text.ts`. Native motion/CSS helpers live under `packages/angular/src/`; generated components/catalogs/exports/demo map and llms descriptions are regenerated.
- Tabs preserve required tab data, controlled/default/internal selection, callbacks, native template/scalar slots, zero values, variants, ordinary button/form semantics and wait-mode content/reentry springs.
- Shared indicators preserve cached leader snapshots, remeasurement without follower promotion, interrupted opacity inheritance, crossfade ownership and document-scoped cleanup. Source metadata overstates roles/arrow navigation; actual ordinary buttons remain the contract.
- Velocity preserves readable continuous text, namespace-aware polymorphism, native element/attribute/style bindings, element access, accumulated directional scroll, damping, idle hold, source reduced-motion lifecycle, resize handling and disposal. Class cleanup preserves its base styling even when callers repeat that class.
- Native source demos in `packages/angular-demo/src/batch28-demos.ts` use actual content, controls/defaults/icons and scoped source resets. Framework usage examples supply required inputs and are compiled as exact displayed snippets.
- Reports: [Animated Tabs](animated-tabs.md), [Scroll Velocity Text](scrollvelocitytext.md). [Completed components](completed-components.md).

## Validation

- `npm run build`: final production build passes generation, Angular APF/demo/download build, registry validation and all 289 SEO checks (`.batch28-class-build.log`).
- `npm run lint`: passes with inherited warnings. `npm test`: all 117 tests across 14 files pass.
- `node scripts/verify-parity-batch28.mjs`: final packaged contract passes selection/callback/default/control behavior, zero values, source-generator panel entry/exit, retained content, readable namespace-aware nodes, style/attribute/class reconciliation, scroll/resize/idle/reversal, normalized dependencies, reduced motion and disposal (`.batch28-class-contract.log`).
- `PLAYWRIGHT_CHANNEL=msedge node node_modules/@playwright/test/cli.js test --config playwright.batch28.config.ts`: all 64 main cases pass (`.batch28-verified-browser.log`). Following the final class cleanup change, all four affected class/progress cases pass with `--grep 'class updates'` (`.batch28-class-browser.log`). Total coverage is 68 cases across those runs.
- Browser evidence covers responsive default/glass/pill variants, light/dark source/native demos and real controls, native bindings/SVG, consumers without Tailwind, shared leader/follower mount/removal/interruption and content reentry. Shared comparisons retain 2px geometry / 0.025 opacity tolerances at intermediate and settled states.
- `npm run test:angular-package`: final installed tarball strict consumers compile all 116 selectors, optional inputs, SVG literal and actual documentation examples on Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 (`.batch28-class-package.log`).
- Final source downloads match main generated components, recursive authored helpers/types and shared controls CSS after newline normalization. Whitespace/link/count checks pass.

## Preserved behavior and limits

- Tabs use ordinary buttons with submit defaults and normal keyboard behavior. Shared interrupted handoffs retain the source leader's snapshot/opacity; follower removal does not terminate the lead fade. Empty registries and frames are disposed.
- Velocity holds progress at idle. Initial reduced-motion mount installs no scroll/resize listeners; enabling motion alone leaves them absent until an effect dependency changes. Raw direct DOM motion survives unrelated style/class changes.
- Fresh browser contexts isolate controlled clocks; reference mounting is idempotent and tracing hooks are removed. Angular templates, explicit attributes/native bindings and component queries provide native equivalents to React nodes/HTML props/forwarded refs.
- Physical devices, non-Chromium engines, SSR and exhaustive arbitrary/invalid inputs or every intermediate frame remain outside recorded coverage. Earlier fixture HTML audit is still required before integration. User QA follows all 116 baselines; the overall goal remains active.
- Next action: review/integrate completed batches in order after that audit; continue the next two queued components on a new stacked branch. Integration remains for maintainer review.

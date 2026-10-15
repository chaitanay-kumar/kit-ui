# Feature: Angular parity batch 20

- Outcome: native Cursor Follower and Liquid Ripple Button implement the React contracts instead of unrelated generic controls.
- Scope: cursor-follower and liquid-ripple-button; React source is unchanged. Local validation is complete; no merge or deployment was performed.
- Base: feat/angular-parity-batch-20, 857c6c7; remote implementation base confirmed at 0004d433.

## Acceptance criteria

- Follower supports pointer movement, offsets, visibility controls, position/scale springs, projected content and disposal: verified by packaged and actual React/Angular browser checks.
- Ripple button preserves variants, content, callbacks, pointer-origin rings, native form behavior, keyboard, press cancellation and reduced motion: verified by packaged and actual React/Angular browser checks.
- Fresh Angular artifacts, native consuming apps, responsive/light/dark rendered comparisons, full baseline and supported compiler matrices: pass for the coverage below.

## Relevant files

- Authored definitions: scripts/angular-cursor-follower.ts, scripts/angular-liquid-ripple-button.ts; registration in scripts/generate-angular-ports.ts.
- Native styles/motion: packages/angular/src/cursor-follower.css, liquid-ripple-button.css, liquid-ripple-button-motion.ts, batch20-spring.ts. Batch 23 also reuses this spring helper for Floating Action Dock without changing its math.
- Demos: packages/angular-demo/src/batch20-demos.ts and demo.component.ts.
- Evidence: e2e/fixtures/parity-batch20-contract.tsx, e2e/fixtures/parity-batch20-bare.ts, e2e/parity-batch20.spec.ts, playwright.batch20.config.ts, scripts/verify-parity-batch20.mjs, scripts/verify-angular-package.mjs, e2e/angular-actions.spec.ts, and the component reports linked below.
- Generated: the two component files, packages/angular/catalog.json, src/lib/framework/angular-ports.ts and demo ports.ts through angular:sync. Full component:sync refreshes public/llms.txt and sitemap.xml; llms also catches previously stale descriptions from stacked batches, and sitemap changes are generated dates. Ignored bundles, downloads, source copies, logs and screenshots remain untracked.

## Validation and handoff

All commands used Node 22.23.0; browser runs set PLAYWRIGHT_CHANNEL=msedge.

- `npm run component:sync`: passes; all 116 registry entries validate.
- `npm run angular:sync`: passes; 108 generated ports and 116 catalog components covered.
- `npm run lint`: passes with 21 inherited warnings. Focused lint also passes after final verifier/test edits.
- `npm test`: all 117 tests in 14 files pass.
- `npm run build`: final build exits 0; Angular package, preview, tarball, TypeScript, production bundle, prerendering and 289 SEO checks pass. Existing font-resolution and bundle-size warnings remain.
- `node scripts/verify-parity-batch20.mjs`: passes defaults, behavior, reduced-motion state retention, cap/expiry and disposal checks after the final build.
- `node node_modules/@playwright/test/cli.js test --config playwright.batch20.config.ts`: final full run has 57 passing checks and 3 intentional skips for unreduced mouse springs in the reduced-motion mobile project (60 listed cases total). Includes four action/batch regressions, source-matching demos, dependency interruption, settled/native follower rendering, wave/icon/content-shadow/focus comparisons, and a native Angular consumer without Tailwind. Each framework setup is isolated and asserts a rendered framework marker. Screenshots remain in ignored test-results output.
- `node node_modules/@playwright/test/cli.js test --config playwright.batch20.config.ts parity-batch20.spec.ts --project desktop --grep 'spring timeline|wave palette' --repeat-each=3`: all 6 repeated cases pass after aligning Motion's rest thresholds and settling mount/focus transitions before comparison. The scale tolerance remains 0.004 at 80/160/320ms; these are steady-state press measurements, not a guarantee about initial renderer/keyframe-resolution latency.
- `npm run test:angular-package`: installed tarball passes strict-template compilation of all 116 selectors and dedicated batch-20 native/optional-input consumers in Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1. The first attempt exposed missing required bindings in seven older generic fixtures; those bindings were repaired without removing selectors or reducing strictness, then all four matrices passed.
- `git diff --check`: passes. Generated component/catalog/demo outputs are stable on regeneration. Downloaded component sources and every local CSS/motion dependency match the authored/generated files.

Component behavior, source quirks, framework mappings and coverage limits: [Cursor Follower](cursor-follower.md), [Liquid Ripple Button](liquid-ripple-button.md). Exact Motion frames for all configurations, exhaustive pointer combinations, physical devices, other browsers, SSR and screen-reader application testing are outside this validation. No known blocker remains for the recorded batch contracts.

Next action: maintainer review and ordered integration with pending batches 4 through 19. The wider 116-component parity effort and user QA remain tracked in ANGULAR_REACT_PARITY.md.

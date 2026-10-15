# Feature: Angular parity batch 24

- Outcome: native Density Lens and Gravity Particle Burst follow their actual React behavior.
- Scope: `density-lens`, `gravity-particle-burst`; React remains unchanged. Morphing Dialog stays queued because its shared-layout contract needs a separate implementation.
- Base: `feat/angular-parity-batch-24`, `774a106`; remote batch 23 confirmed, starting tree clean.

## Acceptance criteria

- Lens preserves base/duplicate/custom content, coordinate context, shapes, border, zoom, spring entry/tracking/exit, interrupted exit and event overrides.
- Burst preserves label/content, 36-particle source default, uncapped DPR, palette and per-frame physics, repeated bursts, reduced-motion updates, missing-context behavior and disposal.
- Native consuming templates/events, keyboard/form behavior, styles and actual responsive demos are verified against source in standards mode.
- Focused package/browser checks and the full batch baseline pass on fresh artifacts.

## Relevant files

- React: `src/components/ui/DensityLens.tsx`, `GravityParticleBurst.tsx`, metadata and detail demos.
- Angular: generic definitions in `scripts/generate-angular-ports.ts`; authored definitions in `scripts/angular-density-lens.ts` and `scripts/angular-gravity-particle-burst.ts`, motion helpers/styles and focused batch 24 fixtures.
- Generated: component sources, catalog and framework/demo metadata via `angular:sync`.

## Validation and handoff

- Changes: authored both native ports, scoped styles and motion helpers; regenerated Angular outputs. Added packaged contract verifier, paired standards-mode browser fixture/spec/config and compiler consumer bindings. Corrected burst typography after computed-style comparison. Added real native detail demos, independent stateful content checks, bare native-host consumer and seeded frame-by-frame canvas comparisons. Fixture refresh now disposes the prior mounted root. Corrected native demo font features and paragraph tracking after direct desktop/mobile React comparisons.
- Checks: clean starting tree and remote refs confirmed. `angular:build` passes after the typography fix. `node scripts/verify-parity-batch24.mjs` passes exact particle physics/DPR/palette, live reduced motion, context failure, callback overrides, lens content/coordinates/exit and disposal. Final paired desktop/mobile browser run: 30 passed (`playwright.batch24.config.ts`), including exact canvas PNG matches at frames 1/10/repeated burst/expiry, independent duplicate template state, demos and bare native-host styles. Responsive demo geometry and typography match the React reference on desktop/mobile. All 117 unit tests and lint pass (inherited warnings). Angular installed-package strict consumers pass all 116 selectors on 20.0.0, 20.3.33, 21.2.25 and 22.2.1. Final `npm run build` after demo typography corrections passes, including component registry validation and all 289 SEO checks. Both source downloads match generated components, recursive helper/CSS dependencies and shared styles. Packaged exit snapshots stay frozen during input changes and adopt updated inputs on reentry. `node --check scripts/verify-angular-package.mjs` and `git diff --check` pass.
- Source behavior and coverage limits: source burst default is 36 despite metadata saying 34. Keyboard click does not create particles; reduced motion blocks new bursts without cancelling existing ones. A null drawing context leaves the source RAF handle occupied. Lens has no source reduced-motion opt-out; TemplateRef contexts map React content/renderers. Exact intermediate spring trajectories, physical devices, other browsers and exhaustive invalid inputs are outside recorded coverage. Earlier fixture HTML audit remains required before integration.
- Next action: review/integrate batches in order after the outstanding earlier-fixture audit; continue the next two queued components on a new stacked branch. Batch 24 is validated locally; integration pending. Reports: [Density Lens](density-lens.md), [Gravity Particle Burst](gravity-particle-burst.md). AI Response remains deferred and untouched.

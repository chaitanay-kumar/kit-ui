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

- Changes: authored both native ports, scoped styles and motion helpers; regenerated Angular outputs. Added packaged contract verifier, paired standards-mode browser fixture/spec/config and compiler consumer bindings. Corrected burst typography after computed-style comparison.
- Checks: clean starting tree and remote refs confirmed. `angular:build` passes after the typography fix. `node scripts/verify-parity-batch24.mjs` passes exact particle physics/DPR/palette, live reduced motion, context failure, callback overrides, lens content/coordinates/exit and disposal. Fresh paired desktop/mobile browser run with style comparisons: 18 passed (`playwright.batch24.config.ts`). `node --check scripts/verify-angular-package.mjs` and `git diff --check` pass.
- Remaining issues: source burst default is 36 despite metadata saying 34. Keyboard click does not create particles; reduced motion blocks new bursts without cancelling existing ones. A null drawing context leaves the source RAF handle occupied. Lens has no source reduced-motion opt-out; TemplateRef contexts will map React content/renderers.
- Next action: add deterministic React/native canvas pixel comparisons, stateful template and native/bare consumer coverage, real detail demos and remaining lifecycle/source-edge checks. Then run full batch baseline and Angular compiler matrix, write component reports, update tracker and push the completed batch. Current work is committed as a progress checkpoint at the user's request. Batch remains unvalidated; tracker unchanged.

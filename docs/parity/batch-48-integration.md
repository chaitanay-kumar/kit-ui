# Feature: Sign Up and Particle Delete parity

- Outcome: replace generic Angular placeholders with native implementations of the React contracts.
- Scope: `sign-up`, `particle-delete`, including the reusable particle container and imperative/controller APIs. AI Response remains deferred; preserve existing local batches and stashes. Integration review, merges/deployments and final user QA remain outstanding.
- Base: `feat/angular-parity-batch-48` from batch 47 checkpoint `c2a2489`. Fetch confirmed `origin/feat/kit-ui-library` at `ceb2de5`.

## Acceptance criteria

- Sign Up preserves validation, per-field clearing, password strength, conditional confirmation, terms content, callbacks/payloads, external loading/error ownership and source layout/motion.
- Particle Delete preserves item deletion/reset, DOM capture and pixel sampling, options/physics, reduced motion, fallbacks, callback ordering, reusable container/controller behavior and disposal. Record source limitations explicitly.
- Run paired desktop/mobile browser checks, focused installed-package API/source-closure checks, consuming demos and the required component/library baseline before accepting this batch.

## Relevant files

- React contracts: `src/components/ui/SignUp.tsx`, `SignUp.meta.ts`, `ParticleDelete.tsx`, `ParticleDelete.meta.ts`; `src/lib/particle-delete.ts`.
- Angular authoring: registrations in `scripts/generate-angular-ports.ts`; new dedicated definitions and native helpers as required. Reuse validated Form/Button primitives.
- Generated: affected components, catalogs, demo/API maps and registry outputs through component/Angular synchronization; rebuild ignored package/demo artifacts for validation.

## Validation and handoff

- Changes: native Sign Up composes Form/Button primitives and preserves all validation, field state, password strength, optional confirmation/terms content, callbacks and external loading/error. Particle Delete implements the sampled-pixel DOM/canvas engine, native resource cards/reset, reusable container/controller APIs and owned destruction cancellation. Metadata overclaims are corrected; current native recipes and consuming demos are included.
- Authored additions: scripts/angular-sign-up.ts and angular-particle-delete.ts; native sign-up.css, particle-delete.css, particle-delete-engine.ts, particle-delete-controller.ts, particle-delete-parts.ts and particle-delete-icons.ts; packages/angular-demo/src/batch48-demos.ts. Generator registrations replace generic placeholders. The source builder follows relative CSS imports. Shared Form icons add the exact installed Lucide User geometry.
- Browser checks: npm run test:browser with the five parity-batch48 Sign Up/Particle behavior/layout/demo specs passes **66/66** desktop/mobile cases (kit-b48-focused.log). The separate parity-batch48-strength-layout.spec.ts passes **8/8** on the final production artifact (kit-b48-strength.log). Total **74** passing cases: Sign Up 46, Particle Delete 24, shared light/dark consuming demos 4. Normal-motion capture tests explicitly override the mobile reduced-motion default; the short container fade is observed with a controlled browser clock.
- Engine: node --import tsx scripts/verify-parity-batch48-engine.mjs passes **nine exact source/native operation comparisons** across four patterns, desktop/mobile sampling, fractional dimensions, DPR cap and procedural capture fallback. Detached completion, pre-abort, pending image listeners, fade/style restoration and active-frame/canvas disposal also pass (kit-b48-engine-final.log).
- Package: node scripts/verify-parity-batch48.mjs passes Sign Up API/default/validation/payload/strength, resource list mount ownership/reset, container destruction and source closure (kit-b48-package-final.log). The audit caught compact imports omitted from downloads; authored imports now use discoverable syntax. Imported shared CSS is included recursively. No engine/source substitute was accepted.
- Baseline: component sync validates all 116 entries; npm run build passes Angular sync/build, TypeScript, Vite, prerender and **289 SEO checks** (kit-b48-component-sync.log, kit-b48-baseline-build.log). npm test passes **117 tests in 14 files** (kit-b48-unit.log). Final npm run lint passes with **34 inherited warnings**, no new warnings (kit-b48-lint-handoff.log).
- Strict consumers: npm run test:angular-package passes installed-tarball consumers with their own Angular **20.0.0, 20.3.33, 21.2.25 and 22.2.1** compilers (kit-b48-consumers.log). All 116 selectors, optional Sign Up/particle APIs, native refs, typed context, controller/imperative calls and both current usage recipes compile. All batch processes are terminal with successful final gates; no artifacts were replaced during consumer validation.
- Reports: [Sign Up](sign-up.md), [Particle Delete](particle-delete.md). Source label/password-toggle/server-alert and spring limits remain explicit. Particle destruction adds AbortSignal cleanup; completion-callback errors reject after cleanup instead of the source utility's unresolved frame-promise failure. Invalid source option values and refresh-rate/scroll limitations are documented. Physical devices, Safari/Firefox, SSR/hydration, exhaustive accessibility and real authentication remain outside recorded scope.
- Count audit: **116 unique IDs, 111 validated rows/completed entries, four queued and AI Response deferred**. The 99 integrated baselines remain unchanged; 12 local baselines through batch 48 await integration review. Both existing stashes are preserved. No push, merge, deployment or AI work was performed.
- Next action: commit this local checkpoint, then start Dynamic Island and Chat as batch 49. Keep the goal active until all four queued components have validated baselines; leave integration and final user QA outstanding.

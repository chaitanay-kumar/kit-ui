# Feature: Angular parity batch 38

- Outcome: replace generic canvas ports with source-contract Speed Warp and native DOM Depth Corridor.
- Scope: `speed-warp`, `depth-corridor`; AI Response stays deferred; no merges/deployment.
- Base: `feat/angular-parity-batch-38` from locally validated batch 37 `e451fe9`. Batch 37 checkpointed locally; implementation remote remains `cfcfc68`. Preserve all earlier work/stashes.

## Acceptance criteria

- Warp: exact defaults (25/600/false), transparent aria-hidden canvas, optional overlay structure, parent client-size initialization and positive ResizeObserver updates. Same random 3D coordinates, 250 focal projection, depth alpha/width, round streaks, camera-plane resets and frame-based speed. Dependency updates recreate the simulation; paused still paints its initial frame. IntersectionObserver uses 100px vertical margin and suspends/resumes scheduling. Dispose frame and both observers. Preserve actual source reduced-motion and DPR limitations.
- Corridor: native region, exact perspective/layout, seven-layer visibility window, source layer geometry/blur (ignore unused blurAmount), smooth 200/28/.85 springs, mouse parallax and leave reset. Callback presence owns selection even without a controlled index; callback exceptions leave state unchanged. Controlled index is neither clamped nor normalized by rendering. Arrow keys prevent default and request clamped indexes; navigation disabled only at exact boundaries; dots/content retain source click-only semantics. Empty/replaced data and controlled/uncontrolled transitions follow source behavior.
- Native template projection for React content; compare paired desktop/mobile rendering, behavior/failure/keyboard, motion/reduced preference, real demos and strict package consumers. Required full baseline once before batch handoff.

## Relevant files

- React: `src/components/ui/SpeedWarp.tsx`, `DepthCorridor.tsx` and metadata.
- Angular authoring: new `scripts/angular-speed-warp.ts`, `scripts/angular-depth-corridor.ts`; focused native lifecycle/motion/type/CSS helpers under `packages/angular/src/`.
- Integration: generator, catalog recipes, native demos and package consumer cases; regenerate tracked outputs.
- Evidence: focused packaged contract and paired batch-38 browser fixture/spec; component reports.

## Validation and handoff

- Changes: source-contract native canvas simulation and DOM corridor replace both generic canvas ports. Added focused renderer/motion/types/CSS helpers, authored definitions, native demos, framework recipes and strict usage consumers; regenerated components/catalogs/maps and llms output. Transparent Angular hosts are skipped for warp viewport sizing. Layer and overlay templates preserve application content. See [Speed Warp](speed-warp.md) and [Depth Corridor](depth-corridor.md) for source limitations and API adaptations.
- Checks: Node 22.23.3; `node scripts/verify-parity-batch38.mjs` passes exact drawing math, state/callback failures, source boundary quirks and observer/frame disposal. `npm run build` passes component/Angular sync, APF/demo/package build and all 289 SEO checks; `npm test` passes all 117 tests. Final `npm run lint` passes with 34 existing warnings outside batch files; `git diff --check` passes. `npm run test:angular-package` installs the final tarball and strictly compiles all 116 selectors plus usage examples with Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1.
- Browser evidence: Edge channel, desktop and Pixel 7 emulation. `npm run test:browser -- e2e/parity-batch38.spec.ts` passed 20/22 cases; the remaining two measured the test consumer's inline host rather than an equivalent viewport. After making that test host transparent, `npm run test:browser -- e2e/parity-batch38.spec.ts -g warp` passes all six cases, including both failed seeded drawing comparisons. Thus all 22 unique scenarios pass across main/focused runs. Earlier iteration found and fixed the library's own transparent-host measurement, and replaced synthetic mouseleave dispatch with real pointer movement for React's synthetic event semantics. Screenshot inspection, paired geometry/typography/style assertions and decoded desktop screenshot pixel equality pass for the tested corridor state. This is not a general pixel-equality or physical-device claim.
- Tracker: 91/116 validated baselines; 75 merged and sixteen from batches 31-38 await review. 24 queued plus deferred AI Response remain.
- Remaining: integration review, prior callback/standards audits and final user QA. Preserve prior stashes and keep AI Response deferred until its earlier working copy is located. No merge/deployment performed.
- Next action: checkpoint batch 38 locally and pick the next two simpler queued components on a separate topic branch. Active goal continues through queued batches.

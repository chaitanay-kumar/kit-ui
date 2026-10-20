# Sparkles Core parity

Status: validated baseline in local batch 44, within the validation scope and limits below. Integration and final user QA remain outstanding.

React `SparklesCore.tsx` defines the contract. Authoring lives in `scripts/angular-sparkles-core.ts`; `sparkles-renderer.ts`, `sparkles-motion.ts` and scoped CSS provide native drawing, root animation and layout.

- Defaults: transparent background, sizes 0.6–2.4, speed 1, white palette, density 120 per 400×400 with a minimum of 12, circle shape, no directional bias, twinkle and interaction enabled, repulsion radius 140, six particles per click, opacity 1, no blur and unpaused. Explicit count overrides density; uniform size overrides min/max; a nonempty palette overrides the primary color.
- Preserve circle/star/cross/mixed generation, source random call order, directional velocities, cursor repulsion/attraction/enlargement, burst lifetimes, twinkle and wrap bounds. Movement is per frame. Paused initialization performs one movement/twinkle step unless reduced motion is active. Clicks can add bursts while paused/reduced without requesting a draw. Touch pointer movement is ignored; click/tap can still add bursts.
- Positive resize observations regenerate particles and resize the DPR-capped canvas. Visibility uses the source 100 px root margin. Reduced-motion changes rebuild the source effect; pausing and options rebuild it too. Source palette-array identity means parent rerenders can regenerate particles even with unchanged numeric options. Native input updates reproduce relevant resets; arbitrary React view identity is not an Angular contract.
- Projected children use native views. Root style/attribute maps and pointer/click callbacks provide native equivalents of DOM props. Initial/animate scalar CSS targets and duration/delay/easing overrides provide a native equivalent of the root readiness fade. Framer variant labels, arbitrary animation orchestration and React subtree reconciliation are not implemented by the native package; these limits must remain explicit in the final report.

Validation is recorded in the [batch brief](batch-44-integration.md). Paired canvas tests compare seeded draw operations and raw pixel hashes. Advancing cursor/burst frames, burst expiry, real touch/disabled interaction, callback failure/recovery, real observers, caller classes/styles, scalar opacity and transition defaults pass. Strict consumers, demos, recipes, download closure and the batch baseline pass; see the brief for exact commands/results. No physical-device, Safari/Firefox, server-rendering/hydration or full accessibility conformance claim is made.

Integration review, merge/deployment and final user QA remain outstanding.

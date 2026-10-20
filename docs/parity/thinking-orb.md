# Thinking Orb parity

Status: validated baseline in local batch 44, within the validation scope and limits below. Integration and final user QA remain outstanding.

React `ThinkingOrb.tsx` defines the contract. Authoring lives in `scripts/angular-thinking-orb.ts`; `thinking-orb-renderer.ts` implements the same particle generation, preset constants, drawing paths and native lifecycle.

- Defaults: working state, 64 px, speed 1, automatic root-class theme detection and unpaused. All nine states retain their source deformations. Particle counts are 45 through 24 px, 90 through 48, 160 through 80, otherwise 220. A change within a count band retains particles; changing bands regenerates them. Time persists across effect restarts; the previous timestamp resets.
- DPR is capped at 2. The first delta is 16 ms and later deltas are capped at 40 ms. Pause and reduced motion freeze time but still draw an initial frame. Explicit theme disables the root-class observer. Clearing an explicit theme resumes automatic detection.
- Visibility uses the source 100 px root margin. The source stores reduced motion in a ref: enabling it stops on the next frame; disabling it alone does not restart. A later relevant prop or visibility transition can restart. The native implementation preserves that behavior.
- Wrapper styles override inline defaults; the wrapper has image role and a custom or state-derived label. Canvas is hidden from assistive technology. Native style and observer lifecycles replace React effects.

Validation is recorded in the [batch brief](batch-44-integration.md). Paired canvas tests compare drawing operations and SHA-256 hashes of raw rendered pixels. Advancing frames, state/speed/theme changes, real intersection suspension/resumption, reduced-motion behavior and complete observer/frame/media disposal pass. The supported package consumers, demos, recipes, dependency downloads and batch baseline pass; see the brief for exact commands/results. No physical-device, Safari/Firefox, server-rendering/hydration or full accessibility conformance claim is made.

Integration review, merge/deployment and final user QA remain outstanding.

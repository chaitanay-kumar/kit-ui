# Meteors parity

Status: validated locally; integration pending. Full batch baseline, packaged checks and rendered comparisons pass.

React contract: `src/components/ui/Meteors.tsx`. Native Angular definition: `scripts/angular-meteors.ts`; standalone styles: `packages/angular/src/meteors.css`.

The port replaces the canvas/pause control with decorative CSS streaks. Defaults are 20 heads, `#94A3B8` head color, `#64748B` trail, 60px tail, 215-degree angle, 0.2–1.2s delay and 2–8s duration. Random placement follows the source's integer range [-200,600); delay rounds to two decimals and duration floors to an integer. Number/timing changes regenerate placement; palette and tail changes retain it. Projected content uses the source's centered overlay. CSS reduced motion hides streaks and restores them when the preference changes.

Angular maps React `children` to content projection and `style` to a CSS property map (explicit units for lengths). Angular wrapper attributes remain on its host; arbitrary React HTML attributes are not forwarded to the inner decorative div. The port uses a per-instance angle variable rather than React's document-global keyframe rule, avoiding interference between instances with different angles. React postpones meteor DOM until its mount effect; Angular renders on initial client change detection. SSR/hydration behavior has not been validated.

Focused validation: 20 shared batch browser cases pass across both frameworks on desktop and mobile, including randomized ranges, custom colors/count/timing, projection and live motion preference changes. Packaged checks confirm defaults and distribution identity across palette updates. Final validation is recorded in [batch 21](batch-21-integration.md).

Random samples and intermediate animation pixels are not expected to be identical across independently mounted instances. Physical-device and non-Chromium testing remain outside this batch.

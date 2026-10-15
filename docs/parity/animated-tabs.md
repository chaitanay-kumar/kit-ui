# Animated Tabs parity

Status: validated locally in batch 28; integration pending.

React contract: `src/components/ui/AnimatedTabs.tsx`, its types and `src/lib/motion-tokens.ts`. Angular authoring: `scripts/angular-animated-tabs.ts`, `packages/angular/src/animated-tabs-motion.ts` and `animated-tabs.css`; generated component is not edited directly.

- Required `tabs` data, first/default/controlled selection, callback return/failure behavior and default reapplication after releasing control follow source. Tab changes do not reset selection merely because the array changes.
- Native template/scalar icon and content slots, string/number badges and default/glass/pill variants follow source. Zero icons/badges render literal zero; zero content does not create a panel, matching AnimatePresence filtering.
- Source uses ordinary buttons with normal Tab/Space behavior and form submit defaults. It has no tab roles or arrow-key handler despite metadata claims. Native preserves the actual source behavior and focus ring.
- Content uses the 170/26/0.9 spring, retained wait-mode exits, latest pending panel and reentry with template state. Removing content destroys its embedded view. Package checks compare entry/exit opacity and translation directly with the source motion generator.
- Shared indicator identity uses the 220/32/1 layout spring, document-scoped ownership, world-space follower projection and source crossfade intervals. Tests cover initial removal, late remount, lead switches and restoration after lead removal. Empty registries and frames are disposed.
- Native detail demo uses actual Overview/Integration/Security content. The website's Angular snippet supplies required inputs and is included in installed-tarball compiler consumers.

Validation: the full 64-case paired suite passes on desktop and Pixel 7 reduced motion. After the final class-cleanup invariant fix, all four affected React/native class-update cases pass on both projects; total recorded browser coverage is 68 cases across those runs. Shared intermediate/settled comparisons preserve 2px geometry and 0.025 opacity tolerances. Source/native light/dark demo geometry, real controls, native consumers without Tailwind, SVG namespace and native event bindings pass. Packaged state/lifecycle checks pass, including panel entry/exit values compared against the source spring generator. Production build and 289 SEO checks, lint and all 117 unit tests pass. The final installed tarball compiles all 116 selectors, optional inputs and actual displayed examples on Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1. Source downloads match main files, recursive helpers/types and shared controls CSS after newline normalization. See [batch evidence](batch-28-integration.md).

Limits: physical devices, non-Chromium engines, SSR and exhaustive arbitrary/invalid data or every intermediate frame are not established. Angular TemplateRef/scalar content and component queries provide native equivalents to React nodes/refs. Earlier fixture HTML audit remains required before integration; AI Response is untouched.

Batch 29 shared-helper follow-up: an optional selector allows Branching Submenu to reuse projection. Initial first-origin snapshots are used for internal new-node handoff; parent input captures refresh them, while remeasurement/removal use current snapshots. Both batch packaged contracts, two submenu shared comparisons and all six source/native Tabs handoff/interruption/removal regressions pass. See [batch 29 evidence](batch-29-integration.md).

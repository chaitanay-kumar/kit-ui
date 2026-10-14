# Morphing Blob parity

Status: validated locally; integration pending. Full batch baseline, packaged checks and rendered comparisons pass.

React contract: `src/components/ui/MorphingBlob.tsx`. Angular definition: `scripts/angular-morphing-blob.ts`; native geometry/motion: `packages/angular/src/morphing-blob-motion.ts`, `batch22-frame.ts`; styles: `morphing-blob.css`.

The port renders a decorative SVG with independent width/height, a unique diagonal gradient, 10px path blur and the source's closed Catmull–Rom path. Defaults match React: 400×400, 8 points, radius 120, variance 28, speed 0.7, stiffness 45, damping 9, cursor follow enabled with strength 0.35/smoothing 0.08, violet/cyan colors. Retargeting runs every `1800 / max(speed, 0.01)` milliseconds. The radius integration and cursor interpolation match the source, with frame deltas following the installed Motion batcher's initial 1/60s step and 1–40ms clamp. Frames update the SVG path outside Angular change detection.

Window pointer coordinates scale through the current SVG bounding box into its logical viewport. Reduced motion is captured once at mount, matching React's ref; live preference changes do not alter that mounted instance. Frames, retarget intervals and pointer listeners are removed on destroy. Source state quirks remain: point-count changes update the static path but retain the original animated point array; cursor position and accumulated displacement retain their initial state when dimensions/follow settings change.

Angular exposes the component's named inputs and maps `className` to the SVG. Arbitrary inherited React SVG attributes/events are not forwarded from the custom-element host. Gradient IDs are unique native IDs rather than React `useId` strings. SSR/hydration and exact startup scheduling across renderer instances are outside this validation.

Initial shared browser checks pass for static paths, custom dimensions/points/colors, gradient uniqueness, reduced-motion snapshot, cursor movement, retained animated point count and unmount on desktop/mobile. Packaged checks verify deterministic spring integration, defaults, reduced-motion behavior and frame/timer disposal. See [batch 22](batch-22-integration.md) for final checks and remaining validation.

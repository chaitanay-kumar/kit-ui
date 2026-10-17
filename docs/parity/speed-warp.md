# Speed Warp parity (validated locally; integration pending)

React source: `src/components/ui/SpeedWarp.tsx`; native authoring: `scripts/angular-speed-warp.ts`; simulation: `packages/angular/src/speed-warp-renderer.ts`.

The native implementation preserves defaults 25/600/false, transparent aria-hidden canvas, optional template overlay, source frame-based velocity, random initial coordinates, 250 focal projection, camera-plane resets, viewport clipping, depth-alpha/width and round streaks. Input dependency changes recreate the simulation. Paused initialization still paints once. Positive ResizeObserver entries reset canvas dimensions; offscreen scheduling uses the source 100px vertical observer margin. Native transparent hosts are skipped when finding the corresponding rendered parent.

Focused packaged contracts pass exact coordinates, projection, streak styles, zero stars, paused initialization, resize dimensions, intersection-ratio resume and observer/frame disposal. Desktop/mobile browser behavior covers pause/resume, offscreen suspension, overlays with pointer/keyboard access, resize and unmount. Seeded paired drawing commands, including coordinates, stroke colors/widths and viewport sizes, match exactly after giving the Angular test consumer an equivalent transparent host. Full baseline and final browser/compiler results are recorded in [the batch brief](batch-38-integration.md).

Preserved source limitations: speed is per frame rather than elapsed time; canvas pixel dimensions do not multiply device pixel ratio. Resize can clear a paused canvas without repainting it. There is no reduced-motion branch or built-in pause UI; mobile reduced-preference checks verify continued animation, not conformance. The canvas has no semantic image role or accessible name. Interactive overlay content remains application-owned. Physical devices and general WCAG conformance are not claimed.

Angular content uses an input `TemplateRef` or a projected `ng-template`, replacing React children. No unrelated generic canvas controls, labels or pointer interaction remain.

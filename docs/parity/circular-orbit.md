# Circular Orbit parity

Status: validated locally; integration pending. Full batch baseline, packaged checks and rendered comparisons pass.

React contract: `src/components/ui/CircularOrbit.tsx`. Angular definition: `scripts/angular-circular-orbit.ts`; native motion/geometry/default items: `packages/angular/src/circular-orbit-motion.ts`, `batch22-frame.ts`; styles: `circular-orbit.css`.

The port replaces a canvas with the source's image gallery, 14 default tiles, title `Push`, speed 0.00022 radians/ms and radius 270. A shared rotation drives circular x/y, cosine depth, scale/opacity 0.42–1, ±4-degree tilt and z-index 10–110. ResizeObserver computes `max(40, min(radius, width/2 - 46 - 8))`, preserving the source's fixed nominal 92px tile allowance even for custom image sizes. Hover moves target speed to zero; every frame interpolates speed by 0.08 before adding rotation. Leave restores the current speed input. The installed Motion batcher's initial 1/60s step and 1–40ms delta clamp are mirrored.

Reduced motion is a mount snapshot, matching the installed React hook; the static gallery still resizes. The region label conveys the title/fallback while images and headline are decorative. Images use empty alt, lazy loading, async decoding and disabled dragging. Frames run outside Angular change detection; destroy disconnects the observer and removes RAF and hover listeners. Absence of ResizeObserver retains the input radius as in React.

Source quirks retained: speed-input updates do not immediately reset the initial motion values, but leave uses the latest input. Disabling pause-on-hover while already paused does not automatically resume. The source passes a bare pixel string to CSS `filter`; browsers ignore it, so this port also renders without the blur promised by metadata.

Angular exports `OrbitItem`, maps item classes to tile surfaces and root/container/title class inputs to their respective elements. Arbitrary inherited React HTML attributes/events remain on the custom-element host rather than being forwarded. Intermediate frame alignment across independently mounted renderers, physical devices, non-Chromium browsers, SSR and application screen-reader testing remain outside the recorded validation.

Initial shared browser checks pass for region semantics, decorative image attributes, resizing, custom/empty items, smooth hover pause/resume and unmount. Static geometry matches React on desktop/mobile. Packaged checks verify measured radius, eased speed, updated-input resume semantics, observer disconnection and listener/frame disposal. See [batch 22](batch-22-integration.md) for final checks.

# Shooting Stars parity

Status: validated baseline in local batch 45, within the validation scope and limits below. Integration and final user QA remain outstanding.

React `ShootingStars.tsx` defines the contract. Native authoring is `scripts/angular-shooting-stars.ts`, backed by `shooting-stars-renderer.ts`, scoped CSS and the shared scalar root-animation helper from batch 44.

- Actual defaults are a dark-space background, 120 stars, four celestial colors, 0.6–2.2 px sizes, twinkle 1, cyan trails/white heads, **2200 ms** interval, speed 12–22, trail length 90–180, angle 42°, periodic cap 2, and enabled embers, nebula, clicks and parallax. The source props comment says 2000 ms, while implementation and metadata use 2200.
- Preserve star generation, radiant stars/halos, three nebula gradients, parallax interpolation, strict interval comparison and jitter, meteor angle/burn distance, fireball flares, layered trails, head bloom and ember lifetimes. Movement is per frame. Periodic spawns respect the cap; clicks bypass it. Clicks are blocked under reduced motion. Touch pointer movement participates in parallax.
- Positive resize regenerates stars and clears meteors/embers. Pause and live reduced-motion changes rebuild the renderer; an initial draw still occurs. Clicks while paused do not schedule a draw, and later option restarts can clear those meteors. Visibility uses the source 100 px root margin. Source default array identities can also cause parent-render resets; native input updates provide the relevant Angular lifecycle equivalent.
- Root classes/styles, scalar DOM attributes, pointer/click/key callbacks and projected children are native equivalents. Initial/animate scalar CSS targets and duration/delay/easing overrides reuse the verified native root-fade helper. Framer variant labels, arbitrary orchestration and React subtree reconciliation are outside this native API and must not be implied by the baseline.

Paired checks compare seeded sky/meteor/parallax pixels and draw operations, fireball layers and expiry, live preference/visibility lifecycle, real touch, caller classes, projected keyboard controls and actual observer suspension. Chromium's first translucent-canvas pixel read can change subsequent readback values without a new draw; frozen-image checks prime that readback and independently assert the unchanged frame count. Packaged checks cover defaults, zero counts/caps, source closure and full disposal. Completed batch validation and strict consumers are recorded in the [batch brief](batch-45-integration.md).

No physical-device, Safari/Firefox, server-rendering/hydration or complete accessibility conformance claim is made. Integration review, merge/deployment and final user QA remain outstanding.

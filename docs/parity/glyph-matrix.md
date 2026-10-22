# Glyph Matrix parity

Status: integrated implementation baseline from batch 45, within the validation scope and limits below. Hosted state and pixel QA remains ongoing.

React `GlyphMatrix.tsx` defines the contract. Native authoring is `scripts/angular-glyph-matrix.ts`, backed by `glyph-matrix-renderer.ts` and scoped CSS.

- Defaults preserve 16 px font, green trails, white heads, dark background, the original Katakana/hex/operator charset, speed 1, fade 0.06, interaction enabled, unpaused and opacity 1. Canvas density follows integer column count and DPR capped at 2. Stream generation, mutation, head glow, pointer disturbance, tail alpha and resets follow the source drawing algorithm.
- Resize regenerates streams and clears the canvas. Under reduced motion, the source draws its static grid only when the renderer starts; later resize clears it without redrawing. The port preserves this observed behavior. Reduced motion is read per renderer restart, with no live media subscription.
- `reset()` changes stream Y positions without scheduling a frame. `togglePause()` flips the internal pause flag; once a loop has stopped, toggling back alone does not restart it. A relevant prop or visibility transition can restart. Controlled pause changes restart the source renderer and regenerate streams. Native component methods structurally implement `GlyphMatrixHandle`.
- The declared legacy `fullPage` prop does not affect source layout. Native accepts it without introducing fixed positioning; metadata now describes that limitation. Caller classes and styles can size the container. Native root styles are applied before initial measurement, including the window-resize fallback without ResizeObserver. Canvas remains hidden from assistive technology; native projected content keeps keyboard access. Root attributes and callbacks use native maps and Angular event/error semantics.

Paired checks cover seeded pixel/draw equality, active streams, touch-type pointer disturbance, reset, imperative pause behavior, static resize, preference capture, caller layout, projected keyboard controls, resize fallback, real observers and disposal. Packaged checks verify exact default charset encoding, methods and complete resource cleanup. Completed batch validation and supported consumer results are recorded in the [batch brief](batch-45-integration.md).

No physical-device, Safari/Firefox, server-rendering/hydration, complete accessibility conformance or arbitrary React reconciliation claim is made. Complete hosted state/raster acceptance remains outstanding.

The hosted follow-up supplies the source overlay, responsive canvas, four colors, three speeds and controlled pause/resume. Browser checks observe actual selected-color canvas pixels and stable paused output, then renewed painting after resume. Controlled pause still regenerates streams as documented above; these checks do not claim preservation of the pre-pause frame or equality of independently randomized live frames. Exact current validation and artifacts are tracked in `hosted-qa.md`.

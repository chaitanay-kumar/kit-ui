# Text Scramble Decoder parity

Status: validated locally; integration pending. Full batch baseline, packaged checks and rendered comparisons pass.

React contract: `src/components/ui/TextScrambleDecoder.tsx`. Native Angular definition: `scripts/angular-text-scramble-decoder.ts`; styles: `packages/angular/src/text-scramble-decoder.css`.

The port preserves required text, configurable characters, 800ms source default duration, mount/hover/manual triggers and replay label. Source metadata lists 900ms; implementation takes precedence. Decoding uses the same staged random resolution thresholds and 36ms glyph cadence, splitting strings into UTF-16 units as React does. The readable text remains the span's accessible label while the changing glyph span is hidden. Manual replay uses a native button disabled during decoding. Pointer hover invokes decoding before the callback. Input changes cancel the pending frame; mount mode restarts while other modes follow the source's state behavior. Motion preference changes use a media-query listener, and destroy cancels animation and removes that listener.

Angular maps `onMouseEnter` to a callback input, React `className` to an inner text class, and projected HTML attributes are not forwarded from the custom element. The source's unusual empty-character fallback and nonpositive-duration behavior are retained; this batch does not broaden input semantics. Random intermediate glyphs and initial renderer scheduling are not asserted pixel-for-pixel.

Source quirk retained: while a manual replay is running, changing an effect dependency (including reduced motion) cancels the frame and resets visible text but retains the decoding flag. The replay button consequently remains disabled until a mount-trigger decode resets it. This is source behavior rather than an Angular recovery guarantee.

Focused validation: shared batch browser checks pass on React and Angular for keyboard replay, disabled/completed state, hover, mount, text interruption, live reduced motion and unmount. Packaged checks assert completion, frame replacement, interruption, undefined defaults, reduced-motion skipping and listener disposal. Final checks are recorded in [batch 21](batch-21-integration.md).

Physical-device, non-Chromium and screen-reader application testing remain outside this batch.

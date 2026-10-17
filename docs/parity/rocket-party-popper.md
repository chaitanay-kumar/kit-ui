# Rocket Party Popper parity (validated locally; integration pending)

React source: `src/components/ui/RocketPartyPopper.tsx`; authoring: `scripts/angular-rocket-party-popper.ts`; native physics, scenes, icons and styles: `packages/angular/src/rocket-*`.

The native component preserves idle, launching and celebrating phases, mount-only defaultLaunched and reduced-motion preference, callback-before-launch ordering and reset-before-callback ordering. A throwing launch callback leaves the idle scene intact. Normal launches capture count and preference for the 600 ms timer, then run wait-mode pad exit before success entry. Reduced preference skips that launch delay and particle burst but retains source idle bob/flame motion and scene transitions. Exiting scenes retain their previous callbacks, invoked unbound, even when inputs change during exit.

Confetti preserves initialization order, palette, three shapes, frame-based velocity/gravity/drag, fade and lifetime formulas. DPR sets the canvas buffer at burst time; later scene or viewport resizing does not resize it. Seeded drawing comparisons cover rectangle, circle and strip commands. Native disposal cancels the launch timer as well as scene/particle frames; the source leaves its launch timeout alive after unmount.

The visible content follows actual React output: title, description and metric are root attributes, not milestone text, and there is no live status region. Rocket, Sparkles and reset glyph geometry follows the installed Lucide version. Root attributes, styles and event callbacks use native bindings. No physical-device or exhaustive accessibility claim is made.

Focused packaged/physics contracts pass. Paired desktop/mobile behavior, settled geometry (within 1 px), typography/colors and rendered screenshots pass. Browser and completed-batch baseline results are recorded in [batch 40 evidence](batch-40-integration.md).

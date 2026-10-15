# Gravity Particle Burst parity

Status: validated locally; integration pending. Focused browser/package checks and full batch baseline pass.

React contract: `src/components/ui/GravityParticleBurst.tsx`. Native definition: `scripts/angular-gravity-particle-burst.ts`; controller: `packages/angular/src/gravity-particle-burst-motion.ts`; scoped styles: `gravity-particle-burst.css`.

The port replaces the generic celebration control. It preserves the actual default of 36 particles (metadata says 34), label “Create particle burst”, source Sparkles geometry, canvas extending 80px around the control, uncapped DPR, palette and five random draws per particle. Each frame advances position, applies 0.98 velocity decay, adds 0.16 vertical gravity without DPR scaling, increments age and fades/shrinks surviving particles. Fractional canvas dimensions and repeated bursts preserve the source's resize/particle-array behavior.

Every pointerdown can burst; keyboard Enter/Space invokes the native button's click without generating particles. The button has type button and does not submit surrounding forms. Live reduced motion blocks new bursts while existing particles finish. A missing 2D context leaves the consumed RAF handle occupied, preserving the source failure behavior instead of silently restarting. Destroy cancels pending animation and removes the preference listener.

`children` accepts scalar or reusable template content; false, zero, empty string and null fall back to the label, matching source truthiness. Projection is also supported. Supplied `onPointerDown`, including explicitly bound undefined, replaces the internal burst handler. Callback return values do not cancel browser defaults. Use `div kitGravityParticleBurst` for attributes/events on the actual root; custom-element attributes stay on its wrapper. `className` and explicit-unit CSS maps are supported.

Seeded browser comparisons match canvas PNGs exactly at frames 1 and 10, after repeated bursts and after expiry on desktop and mobile at their native DPR. Packaged checks assert physics, colors, default count, fractional sizing, reduced-motion changes, context failure, overrides and disposal. Additional checks cover keyboard/form behavior, source styles, native host attributes and operation without Tailwind. The actual detail demo says “Commit release”. Physical devices, non-Chromium browsers and exhaustive invalid inputs remain outside coverage. See [batch 24](batch-24-integration.md).

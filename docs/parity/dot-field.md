# Dot Field parity

Status: validated locally; integration pending. Full batch baseline, packaged checks and rendered comparisons pass.

React contract: `src/components/ui/DotField.tsx`. Native definition: `scripts/angular-dot-field.ts`; drawing: `packages/angular/src/dot-field-drawing.ts`; styles: `dot-field.css`.

The port replaces an animated generic canvas and pause control with the source's static gradient grid. Defaults are radius input 1.5, spacing 14 and white gradient stops at alpha 0.12/0.04; metadata lists different colored defaults. Actual circle radius is `dotRadius / 2`, preserving the source despite its prop description. Step is `dotRadius + dotSpacing`; row/column counts floor, and remainder padding centers the grid. Logical dimensions and gradients match the source; backing resolution floors dimensions multiplied by devicePixelRatio capped at 2.

Drawing runs only at mount, resize and drawing-input changes, outside Angular change detection. Zero/nonpositive step clears the canvas before returning. Nonpositive dimensions and an unavailable 2D context return without clearing prior content, as in React. Input changes replace the ResizeObserver; destroy disconnects it. The effect is static under either motion preference, with no pause control or RAF loop.

Angular maps `className` and a CSS property map through `style`; lengths in that map use explicit units. Use `div kitDotField` for native attributes, ARIA overrides and event bindings. The custom-element wrapper keeps its own host attributes rather than forwarding them to the decorative inner div. ResizeObserver is required by both implementations. SSR, invalid canvas colors/radii, physical devices and other browsers are outside this validation.

Focused shared browser checks prove identical canvas PNG hashes for defaults, custom radius/spacing/colors, resizing and zero-step clearing on desktop and mobile. They also check DPR, decorative semantics, unavailable context and unmount. Packaged checks assert actual draw coordinates, gradient stops, DPR transform, observer replacement/disconnection and context failure behavior. The standalone native demo uses a 320px field clipped by the source's 280px wrapper. See [batch 23](batch-23-integration.md) for final checks.

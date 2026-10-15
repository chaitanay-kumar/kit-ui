# Density Lens parity

Status: validated locally; integration pending. Focused browser/package checks and full batch baseline pass.

React contract: `src/components/ui/DensityLens.tsx`. Native definition: `scripts/angular-density-lens.ts`; spring controller: `packages/angular/src/density-lens-motion.ts`; scoped styles: `density-lens.css`.

The native port replaces the unrelated generic canvas. It preserves a 150px circle by default, border enabled, zoom 2, relative mouse coordinates, magnified duplicate content or a custom renderer, reflection, clipping and source spring parameters (450 stiffness, 28 damping, 0.2 mass). Oval corners are 40px; square uses the theme's rounded-2xl radius. Exit retains the lens view and owned input snapshot until opacity/scale settle; reentry interrupts removal. The source has no reduced-motion opt-out, so native springs remain active under reduced motion too.

Angular content uses a reusable `TemplateRef` or scalar through required `children`. Each template instantiation has its own component state and handlers. The optional renderer is a `TemplateRef<LensContentContext>` exposing `$implicit: {x,y,scale}` and named `x`, `y`, `scale`. Templates retain native lexical Angular bindings. No DOM cloning is used. The duplicate remains accessible to keyboard focus, matching the source's lack of `aria-hidden`; pointer events are disabled on the lens surface.

Supplied `onMouseEnter`, `onMouseLeave` and `onMouseMove` callbacks replace the corresponding built-in handler, including an explicitly bound undefined value, as React's final props spread does. Omit bindings to use internal behavior. Use `div kitDensityLens` to put native attributes and events on the actual root; custom-element host attributes stay on the wrapper. The `style` map accepts explicit-unit CSS values.

Focused checks cover coordinates, custom renderer context, duplicate content, independent component state/events, interrupted exit, cleanup, source style comparison and styling without Tailwind. The actual detail demo uses a 140px lens and zoom 2. Exact intermediate spring trajectory, exhaustive nested content, physical devices and non-Chromium browsers remain outside recorded coverage. See [batch 24](batch-24-integration.md) for current validation.

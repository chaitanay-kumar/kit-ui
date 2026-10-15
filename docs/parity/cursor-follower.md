# Cursor Follower: Angular / React parity

React reference: `src/components/ui/CursorFollower.tsx`. Angular authoring: `scripts/angular-cursor-follower.ts`; styling: `packages/angular/src/cursor-follower.css`; spring step: `packages/angular/src/batch20-spring.ts`.

## API and behavior

The contained highlight is replaced by the source's fixed window-level follower. Inputs match defaults for size (32), offsets (0), stiffness (450), damping (32), mass (0.5), hideOnLeave (true), scaleOnMove (true) and className. Undefined restores defaults. Projected content replaces the default dot. Mouse, pen and touch movement update targets. Document leave and window blur hide the follower when enabled. Reduced motion uses direct positioning; the source still animates movement scale under reduced motion.

Position uses a damped spring with the supplied stiffness, damping and mass, including Motion's granular/default rest thresholds. Scale uses the source 350/22/1 spring, returning to 1 after the 120ms movement expiry. Opacity uses the source 150ms ease-out transition. Default dot border/background opacity and theme colors match the rendered source; its border-box dimensions are owned by the component rather than relying on Tailwind's reset. Destruction removes window/document listeners, clears movement timers and cancels pending animation frames.

`<div kitCursorFollower>` supports native attributes and Angular event bindings on the actual follower. `<kit-cursor-follower>` supplies a convenience wrapper. The `style` input accepts an Angular CSS style map; use explicit CSS units for lengths. Motion-specific animation props are represented by native Angular inputs/styles/events rather than a Framer Motion dependency. Template projection is the Angular equivalent of React children.

## Source quirks retained

- Updating offsets, hideOnLeave or scaleOnMove clears movement expiry while retaining the moving flag. Changing an offset during movement can therefore retain enlarged scale until another movement or leave event. Disabling scaleOnMove still springs back to 1.
- The installed React useReducedMotion hook snapshots the preference for each mount. Angular follows that mounted-instance behavior; remount to use a changed preference.

## Validation

- Packaged contract: defaults/undefined, offsets, leave/blur controls, cleared movement timeout, canceled animation frame and post-destruction listener behavior.
- Actual React versus built Angular on desktop and mobile reduced-motion emulation: touch/pen movement, settled X/Y offsets, hideOnLeave changes, scaling while moving and after expiry, disabling scaling, native attribute/style overrides and native follower positioning.
- Four additional dependency-change browser cases verify the retained moving-state quirk against both frameworks.
- Light/dark comparisons assert default dot colors, border width and opacity. Settled rendered screenshots were inspected. A native Angular consuming app without Tailwind verifies the 32px border-box default dot.
- Strict installed-tarball consumers exercise native/custom selectors and optional inputs in Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1.
- Full batch baseline and exact commands/results: [batch 20](batch-20-integration.md).

## Coverage limits

Validated locally for the recorded contracts; integration is pending. Exact position/scale frames across every spring configuration, physical devices, other browsers, SSR and screen-reader application testing are unverified. CSS style maps and native events are framework mappings, not the entire HTMLMotionProps API. The React catalog card uses a separate contained tracker simulation; this batch validates the live component and detail stage.

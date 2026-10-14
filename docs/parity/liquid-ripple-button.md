# Liquid Ripple Button: Angular / React parity

React reference: `src/components/ui/LiquidRippleButton.tsx`. Angular authoring: `scripts/angular-liquid-ripple-button.ts`; styling: `packages/angular/src/liquid-ripple-button.css`; motion: `packages/angular/src/liquid-ripple-button-motion.ts` and `batch20-spring.ts`.

## API and behavior

Replaces the unrelated generic async action with projected content (default Water Ripple), primary/secondary variants, optional droplet icon, disabled state and native click/pointer callbacks. The former loading/action/activated API is removed to match React. Async application work belongs in consumer callbacks; failure/cancel/retry regression coverage now targets unchanged Pull to Refresh.

The native `<button kitLiquidRippleButton>` selector supports form ownership, name/value, ARIA attributes and native Angular events. The custom-element wrapper supplies an inner button. Type defaults to button; undefined removes the attribute. Callback inputs correspond to React callback props. Callbacks returning false do not cancel native form defaults. Use projection for ReactNode children; `children` is the string fallback. Arbitrary HTML attributes bind to the native selector rather than being forwarded by the convenience wrapper.

Source SVG wave paths, 4s/6s flow durations, reservoir hover heights, Lucide icon geometry, current Tailwind sky/cyan tokens, metrics, content shadow, token radius, focus outline and responsive font sizes are retained. The 96px rings own their border-box sizing without Tailwind's reset. Pointer-relative concentric rings use outer 750ms/4.5 scale and inner 550ms/2.8 scale, capped at four active ripples. Outer animation completion removes the state; reduced motion omits waves/rings while retaining newly created ripple state as React does.

Hover and tap use the source 380/30/0.5 spring and granular rest thresholds. A primary held press retains tap scale outside the button and releases on window capture pointer-up/cancel. Touch does not create hover; non-primary pointers do not start the press spring. Motion's Enter press synthesizes a pointerdown before the native click when motion is enabled. Under reduced motion, Enter produces the native click without that synthesized pointer callback. Destruction removes listeners and cancels pending animation frames.

## Source quirks retained

- Disabled buttons retain the source opacity/cursor styling. Mouse-enter does not activate the reservoir/icon hover state while disabled. Their pointerdown callback/ripple state still runs when a pointer event is delivered; click callbacks remain disabled.
- Reduced-motion preference is captured per mount, matching the installed React hook.
- Reduced motion retains up to four ripple records even though no rings render.

## Validation

- Packaged defaults/undefined, icon toggle, pointer coordinates, callbacks, four-record cap, outer-animation expiry, reduced-motion state retention and animation-frame cancellation.
- React/built Angular desktop/mobile checks cover projection, disabled state, native type/name/value/ARIA and form ownership, callback-return-false submission, disabled pointer versus click handling, keyboard activation, unmount, pointer-origin rings and expiry.
- Unreduced held mouse press/cancel cases pass on desktop. After mount work settles, sampled press scale at 80/160/320ms matches React within 0.004; these mouse-spring cases are intentionally skipped in the reduced-motion mobile project.
- Light/dark computed comparisons match font, line height, tracking, padding, radius, border, palette, shadows, minimum height, cursor and opacity across both variants, disabled state and utility overrides. Settled rendered screenshots were inspected.
- Direct comparisons also match wave fills/opacities, icon paths/stroke, content shadow, enabled/disabled hover colors and settled keyboard focus. Three desktop repetitions of the press/accent comparisons pass. A native Angular consumer without Tailwind verifies minimum button height, icon width and ring dimensions.
- Angular docs demo uses the two source examples, Generate preview and Run sync.
- Strict installed-tarball consumers exercise native/custom selectors, native static disabled and optional inputs in Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1.
- Full batch baseline and exact commands/results: [batch 20](batch-20-integration.md).

## Coverage limits

Validated locally for the recorded contracts; integration is pending. All exact Motion frames and renderer startup/keyframe-resolution latency, exhaustive multi-pointer/keyboard-repeat combinations, physical devices, other browsers, SSR and screen-reader application testing remain unverified. Angular removes completed invisible rings directly rather than retaining AnimatePresence's invisible exit DOM.

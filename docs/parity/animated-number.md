# Animated Number Morph parity

React's `AnimatedNumber` is the reference. Angular now renders independent ten-row digit columns instead of interpolating a single text value.

## Contract and migration

`value` is required. Optional defaults match React: `decimals=0`, empty `prefix`/`suffix`, `stiffness=170`, `damping=22`, `mass=0.6`, `useGrouping=true`, `compact=false`, and empty `className`. Undefined optional bindings retain those defaults. Grouping, signs, fixed decimals and en-US compact notation follow the actual React formatter, including compact notation's independent grouping behavior.

Replace the former `duration`, `locale` and `label` inputs with the spring/formatting inputs. The accessible label is the formatted value with prefix and suffix. Styling belongs on `className`; the root inherits typography except the reference monospace family, letter spacing and fixed foreground color. This component does not fetch metrics or run a ticker; the demo owns its simulation.

Digit keys follow React's index/punctuation identity. Initial digits render at their target; subsequent changes roll retained columns and preserve spring velocity when interrupted. Newly inserted columns start at their target. Punctuation and compact suffixes remain text. Destruction cancels frames and motion-preference listeners.

Angular honors reduced motion and immediately settles columns. The current React component still animates under that preference. Spring motion uses the analytical damped-spring solution; exact frame equality across engines is not claimed. Invalid spring physics and out-of-range decimal options are not normalized beyond React's contract.

## Validation

The local baseline passes the checks recorded in [batch 4](batch-4-integration.md). Focused cases cover formatting, painted geometry, settled digits, configurable/interrupted motion, reduced motion, disposal and the interactive website demo on desktop/mobile. Authored sources are `scripts/angular-animated-number.ts`, `packages/angular/src/animated-number-digit.ts` and `animated-number.css`; the demo owns its state and ticker in `packages/angular-demo/src/animated-number-demo.ts`.

| Capture | React | Angular |
| --- | --- | --- |
| Desktop light | [Image](screenshots/animated-number-react-desktop-light.png) | [Image](screenshots/animated-number-angular-desktop-light.png) |
| Desktop dark | [Image](screenshots/animated-number-react-desktop-dark.png) | [Image](screenshots/animated-number-angular-desktop-dark.png) |
| Mobile light | [Image](screenshots/animated-number-react-mobile-light.png) | [Image](screenshots/animated-number-angular-mobile-light.png) |
| Mobile dark | [Image](screenshots/animated-number-react-mobile-dark.png) | [Image](screenshots/animated-number-angular-mobile-dark.png) |

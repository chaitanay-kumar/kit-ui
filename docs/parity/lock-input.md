# LockInput parity

React's `LockInput` is the reference. Angular now exposes a native controlled or uncontrolled input with labels, helper/error text, template icons, class hooks and common input attributes rather than the former password editing-lock UI.

`value` is controlled and `defaultValue` initializes uncontrolled content. `onChange`, `onFocus` and `onBlur` receive native events. In controlled mode, Angular restores the bound value after reporting an input request. Error state sets `aria-invalid`, replaces visible helper text and renders an alert while preserving React's described-by behavior.

Focused validation covers values, callbacks, focus/blur, template icons, helper/error states, disabled state and controlled restoration in rendered React and Angular consumers on desktop/mobile. Angular reproduces settled focus-ring styling with CSS; exact Framer Motion spring frames are not claimed.

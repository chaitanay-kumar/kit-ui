# OTP Input parity

React's `OTPInput` is the reference. Angular now renders one native input per digit with the same length, controlled/uncontrolled value, callbacks, auto-focus, disabled state, class hooks and accessible labels.

Typing accepts only digits and advances focus. Backspace, Left/Right arrows, paste distribution, one-time-code autocomplete and completion detection follow React. `onChange` receives the joined value and `onComplete` fires when every slot is populated. Angular consumes `TemplateRef` nowhere in this control and exposes no legacy single-field model/output.

Focused validation covers typing, focus movement, completion, controlled updates and disabled state in rendered React and Angular consumers on desktop/mobile. The packaged contract also verifies filtering, completion values and default contracts. OS-level SMS autofill and physical mobile keyboards remain unverified.

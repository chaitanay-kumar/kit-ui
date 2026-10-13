# Hold-to-Confirm parity

React's `HoldToConfirm` is the reference. Angular matches its pointer and keyboard hold lifecycle, progress, async confirmation, failure retry, success reset and disabled behavior.

Defaults match React for `label`, `duration` and `disabled`, including explicit undefined bindings. Use `onConfirm` for the callback. The former `confirm` input and Angular-only `confirmed` output remain for compatibility; `confirm` is deprecated.

Focused validation covers keyboard completion and reset in rendered React and Angular consumers on desktop/mobile. The packaged contract covers defaults, callback completion and state reset. Destruction clears the Angular timer and prevents late async view updates.

# Swipe Action List parity

React's `SwipeActionList` is the reference. Angular matches its default items, optional inputs, per-row disclosure, swipe threshold, async action, failure recovery, local removal and restore behavior.

Use `onAction(item)` for the callback. The former `action` input remains as a deprecated alias. Each row now owns an independent revealed state, so opening one row does not close another. Success status uses the configured action label in lowercase, matching React.

Focused validation covers independent keyboard-accessible disclosure, action completion and restore in rendered React and Angular consumers on desktop/mobile. The packaged contract covers defaults, callbacks, visible-item state and exact completion copy. Pointer geometry beyond browser emulation and physical touch devices remain unverified.

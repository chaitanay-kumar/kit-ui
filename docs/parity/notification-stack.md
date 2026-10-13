# Notification Stack parity

Angular now matches React's initial notification contract and defaults, local-only state, `maxVisible`, stack/expand layouts, randomized sample insertion, explicit dismissal, right-swipe threshold and empty state. Input data seeds state once, matching React's `useState(initialNotifications)` behavior rather than synchronizing later input changes.

Focused React/Angular desktop/mobile checks cover custom initial data, collapsed limits, expansion, repeated dismissal, empty state and simulation. Angular implements the 60 px swipe with pointer capture while keeping dismiss buttons independently clickable. CSS approximates the stacked springs and exit transition; exact Framer Motion frames are not claimed.

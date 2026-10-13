# Payment Status parity

React's `PaymentStatus` is the reference. Angular now exposes the same five lifecycle states, defaults, amount/date formatting, merchant and payment metadata, itemized receipt, copy/download behavior, and failure callbacks. The former four-state generic status API has been removed.

Focused validation covers processing, verifying, success, failed and refunded rendering; numeric and string amounts; receipt disclosure; retry, payment-method, view and download callbacks; transaction truncation; and item details in rendered React and Angular consumers on desktop/mobile.

Angular uses CSS for settled state presentation and reduced motion. Exact Framer Motion transition frames and icon paths are not claimed. Native clipboard/download behavior is implemented, while the focused browser fixture uses the supplied download callback to avoid writing a file.

# Pill Navigation parity

Batch 18 replaces the flat generic collection with the React contract: nested item data, default main/submenu values, main and submenu callbacks, repeated-click disclosure, roving tab state, horizontal/vertical arrow selection and Escape dismissal.

Focused desktop/mobile checks cover main and child callbacks plus keyboard navigation. Angular uses CSS active-state transitions rather than Framer Motion shared-layout indicators; reduced motion therefore remains static without a separate runtime branch.

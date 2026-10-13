# FAQ parity

React's `FAQ` is the reference. Angular now supports the same item model, initial or controlled open IDs, single/multiple disclosure, change callback, search, categories, variants, indicator styles and rich content.

Angular uses `TemplateRef` for rich answers, item icons and the custom indicator renderer. Each trigger and region has a unique `aria-controls`/`aria-labelledby` relationship. `defaultOpen` is initial state only; `openIds` is controlled and reports requested changes through `onOpenChange` without mutating itself.

Focused validation covers rich content, multiple disclosure, search/category empty state, controlled updates and ARIA state in rendered React and Angular consumers on desktop/mobile. Exact Framer Motion spring trajectories are not reproduced; Angular preserves the settled layout and native keyboard behavior.

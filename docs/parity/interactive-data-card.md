# Interactive Data Card parity

React's `InteractiveDataCard` is the reference. Angular now matches its disclosure, asynchronous action and content contracts.

## Contract and migration

Defaults match React for title, summary, action label, loading and disabled state. `summary` and `children` accept primitive content or an Angular `TemplateRef`; projected content remains supported. Use `onAction` for the async callback. The former `action` input remains as a deprecated alias so existing consumers can migrate without an immediate break.

The disclosure has a unique `aria-controls` relationship and native keyboard behavior. Pending, success and retryable failure messages match React. Loading, disabled and error states block the same controls. Destruction during an unresolved action does not update the destroyed view.

Angular template content is the native equivalent of React nodes. Boolean content renders no visible text. Projected fallback behavior and Angular's safe post-destruction guard are framework-specific implementation details.

## Validation

The focused checks recorded in [batch 5](batch-5-integration.md) cover default and rich content, keyboard disclosure, unique ARIA wiring, loading/disabled/error states, async success/failure/retry and disposal in the packaged component and rendered React/Angular consumers on desktop/mobile.

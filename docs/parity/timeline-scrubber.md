# Timeline Scrubber parity

React's `TimelineScrubber` is the reference. Angular now exposes the same event-list and callback contract while retaining a deprecated Angular output alias.

## Contract and migration

`events`, `disabled` and `loading` match React's defaults, including explicit undefined optional bindings. Use `onChange(event, index)` for parity with React. The former `eventChange` output remains as a deprecated alias and emits the same selected event and index.

The range input is associated with the visible event-count label and announces both time and title through `aria-valuetext`. Native range keyboard behavior, Previous/Next controls, loading, empty and single-event states match React. Selection is clamped for display when the events array shrinks while the raw selection is preserved if the list expands again.

Angular deduplicates the browser's paired `input` and `change` notifications so one user selection produces one callback. This does not change the public interaction result.

## Validation

The focused checks recorded in [batch 5](batch-5-integration.md) cover defaults, label and value text, range keyboard navigation, buttons, callbacks, controlled list replacement, empty/single/loading/disabled states and rendered React/Angular consumers on desktop/mobile.

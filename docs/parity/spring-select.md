# SpringSelect parity

Native Angular replaces the generic native select with the actual React custom listbox contract. Source: `src/components/ui/SpringSelect.tsx`; authoring: `scripts/angular-spring-select.ts`; native styling and spring: `packages/angular/src/spring-select.css` and `spring-select-motion.ts`.

`options` is required and uses `{value,label,disabled?,description?}`. `value !== undefined` controls selection, including an empty string. `defaultValue` initializes local state once. `onChange` is a callback input; a false return does not cancel selection. A thrown callback preserves the earlier local selection update and prevents closing, index update and focus restoration. Label, placeholder, disabled, error and className follow source defaults.

Opening by keyboard retains trigger focus. The source only handles list navigation when the list itself receives a key event; navigation clamps and visits disabled choices. Escape closes and restores focus without preventing default. Outside mousedown closes while open. Label/trigger IDs are unique per instance. Option replacement does not reset stored selection.

Panel, error and chevron use the source 380/30/.5 spring. Popup exit retains previous option, selection and highlight data; reopening interrupts that exit. The component does not consult reduced-motion preference, matching React. Motion frames and dismissal listeners are disposed with their view.

Migration: replace the earlier generic select bindings with required `options`, optional `value`/`defaultValue` and `[onChange]`. This is not Angular forms/CVA integration. Attributes placed on the Angular host remain host attributes; React does not expose arbitrary HTML props in this component.

Validation: Angular APF/demo/source build and focused package contracts pass. Paired desktop/mobile behavior, settled geometry and intermediate motion pass; see [batch evidence](batch-32-integration.md).

Limits: source keyboard/focus quirks are preserved rather than claiming complete listbox accessibility. Identical typography requires the consumer's page font and theme tokens. Native documentation examples include descriptive workspace choices and a selection status; React's documentation example uses three plain workspace labels. Physical devices, other browser engines and exhaustive pixel diffs remain outside this baseline.

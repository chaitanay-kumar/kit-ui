# DrawCheckbox parity

React's `DrawCheckbox` is the reference. Angular now supports controlled `checked`, uncontrolled `defaultChecked`, native change events, disabled and indeterminate states, rich labels, descriptions, IDs, names, required state, class hooks and accessible labeling.

Angular uses `TemplateRef` as the native equivalent of a React node label. The hidden native checkbox retains focus, form and keyboard semantics; the visible box delegates pointer activation to it. In controlled mode, Angular immediately restores the bound value after reporting the user's requested change, matching React.

Focused validation covers uncontrolled and controlled activation, rich labels, indeterminate visuals, disabled state and callback payloads in rendered React and Angular consumers on desktop/mobile. Angular additionally sets the native input's `indeterminate` property; React's reference currently uses indeterminate as a visual state only.

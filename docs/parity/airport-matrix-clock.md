# Airport Matrix Clock parity

Batch 16 replaces the single-time-zone placeholder with the React public contract: up to five supported city IDs, 12/24-hour formatting, optional seconds and country labels, configurable refresh cadence, built-in add/remove controls, and `onCitiesChange`.

Hosted QA replaces the former plain-text board with the reference SVG dot paths, inactive-dot opacity, glyph sizing/spacing, grid backdrop, row geometry, typography, controls and light/dark palette. A dedicated centered demo matches the React preview; its viewport-unit override accounts for the iframe's narrower document. Standalone library use retains normal local viewport units.

Initial country and city options render as United States / Chicago. Adding advances to the next unselected city in the country. Supplying cities without a callback initializes editable internal state; supplying cities with a callback makes changes await the parent's acceptance. Releasing control restores the initial internal state, following React. Invalid and duplicate city IDs are filtered, including prototype property names.

Native row rebuilds use sampled springSnappy physics (380 stiffness, 30 damping, .5 mass) with staggered incoming/outgoing glyph layers and country-label fades. Touch entry and reduced motion skip the rebuild; preference changes and component disposal cancel transient layers. Exact frame-for-frame animation timing and universal raster identity are not certified.

`e2e/airport-clock-hosted.spec.ts` freezes the displayed time and compares actual paths, geometry and control styles plus add/remove/limits, initial selection, next selection and keyboard removal in both themes and viewports. `HOSTED_QA_URL` runs the same assertions publicly. It retains unobscured board crops and contract JSON. `e2e/airport-clock-contract.spec.ts` covers editable/controlled state, release of control, formatting/defaults, country visibility, invalid IDs, real pointer hover, touch, reduced motion and disposal in custom React/Angular consumers. The original batch 16 callback checks remain in place. Current validation and deployment evidence is tracked in [hosted QA](hosted-qa.md).

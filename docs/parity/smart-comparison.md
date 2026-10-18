# Smart Comparison parity

Status: validated baseline in local batch 43, within the validation scope and limits below. Integration and final user QA remain outstanding.

## Source contract

- `SmartComparison.tsx` defines the contract. Native authoring is `scripts/angular-smart-comparison.ts`, supported by `smart-comparison-state.ts`, `comparison-group-motion.ts`, `batch43-icons.ts` and scoped CSS.
- `ComparisonPlan`, `ComparisonFeature` and `ComparisonCategory` preserve source names and optional fields. Both plan/category bindings are required, matching the source TypeScript props; explicitly bound undefined values retain the source runtime empty-array fallback. search and difference controls default true. Selection is initialized once from a truthy default ID, the first featured plan, the first plan, or empty string. Later defaults, empty/replacement plans and missing IDs do not normalize it.
- Search matches feature names/descriptions, not values. A whitespace-only query shows all features, while nonempty queries retain their surrounding spaces. Specification count uses the unfiltered categories. Differences compare each value's `JSON.stringify` result against the first plan; zero/one plan always qualifies. Hiding controls retains their existing filter state.
- Desktop keeps the source four-column grid even with a different plan count. Mobile shows the selected card/value and a native button switcher. The selected card's source block/flex behavior and the mobile highlight's negative stacking order are preserved.
- Categories retain their own collapse IDs. Exiting groups preserve their rendered feature/plan/selection/tooltip snapshot; filtering away the category removes that group. Reopening and interrupted motion keep native state. Height motion uses the source gentle spring 170/26/0.9 and measured padding-limited endpoints; mobile projection uses source snappy 380/30/0.5. The source has no reduced-motion bypass for these transitions.
- Info buttons open on mouse entry, close on mouse leave and toggle on click/Enter. Focus alone and Escape do not change the tooltip. CTA buttons stop propagation and invoke the callback with the original plan as receiver; failures do not select a card or reach the root click observer. Root scalar attributes, styles, click and key observers have native equivalents.

## Native rich values

Primitive strings, booleans, numbers, null and undefined retain their source rendering/comparison behavior. Rich values use `{template: TemplateRef<unknown>, comparisonValue: unknown}`. The template supplies native content; the explicit comparison value supplies its source-equivalent JSON equality representation. This avoids serializing Angular's private template graph. It also permits projected arrays/elements without embedding a React runtime in the package. Cell templates keep normal Angular binding/lifecycle semantics.

## Validation and limits

- Paired behavior tests cover search boundaries, zero/one-plan differences, mount-only selection, empty/replacement data, collapse/reopen, tooltip hover/click/keyboard behavior, bound CTAs/failure and projected values. Rendering checks compare desktop/mobile layout and computed styles with React. Motion samples cover category content height and shared mobile projection. Packaged contracts check JSON distinctions, exit snapshots and dependency closure. Exact completed results belong to the [batch brief](batch-43-integration.md).
- Source accessibility limitations remain: category and plan buttons do not expose expanded/selected ARIA state; boolean glyphs have no textual alternative; tooltips have no focus-open/Escape-dismiss contract. Corrected metadata that claimed screen-reader labels for the visual boolean glyphs. This port does not claim a complete accessible table or WCAG certification.
- Rich cell templates are Angular views; arbitrary React subtree reconciliation and serialization internals are not reproduced. The caller supplies a meaningful comparison representation. No physical-device, Safari/Firefox or frame-by-frame identity claim is made. Fake-clock height sampling excludes constant padding and does not treat accelerated opacity's wall-clock lifecycle as a virtual timer.

Integration review, merge/deployment and final user QA remain outstanding for batch 43.

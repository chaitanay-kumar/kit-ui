# Dependency Trace parity

Native Angular replaces the generic positioned-button graph with the actual SVG contract. Source: `src/components/ui/DependencyTrace.tsx`; authoring: `scripts/angular-dependency-trace.ts`; native CSS/motion: `packages/angular/src/dependency-trace*`.

Required nodes and connections use source TraceNode/TraceConnection types. Both explicit coordinates are honored, including zero/out-of-range values. Supplying only one coordinate replaces both with the source radial layout; the one-node fallback is (200,150). Default size 36 is the diameter in SVG units. Missing-node connections are omitted visually but still included in the raw count. Type and connection label fields are accepted but not rendered. Labels longer than eight UTF-16 code units use the first seven plus an ellipsis.

Hover takes precedence over locally toggled selection. Clicking a selected node clears local selection but still reports that clicked ID. Callbacks run after state updates; thrown errors preserve those updates and false callback returns do not cancel the event. Data replacement preserves selection/hover IDs. Source truthiness behavior for empty IDs is retained.

Native motion follows springSnappy circle/path changes, default label opacity/font-weight tweens, 200ms easeOut glow entry and two-second per-segment easeOut repeating rings. SVG transform origin/box and opacity handling match rendered source. Font weight animates as a presentation attribute; source font-medium CSS keeps computed weight 500, which Angular preserves. Reversal and disposal are compared against React. Component reduced-motion preference does not suppress source animation.

Migration: replace generic selected/disabled/label bindings and node-object output events with required arrays and onNodeSelect/onNodeHover callback inputs. There is no controlled selected prop or disabled-node API in React. The fixed region label is Dependency Relationship Graph. SVG groups are not keyboard buttons, despite metadata claims; this baseline does not claim complete keyboard accessibility or contrast conformance.

Validation: focused data/failure/disposal contracts, production build/289 SEO, 117 unit tests and four strict Angular compiler consumers pass. The final 32-case paired desktop/mobile suite passes; see [batch evidence](batch-34-integration.md). Fonts and theme variables must be supplied for identical typography. Native source works without Tailwind; arbitrary utility-class overrides, physical devices, other engines and very large graph performance are outside this baseline.

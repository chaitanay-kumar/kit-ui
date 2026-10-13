# Native Angular catalog

The Angular package covers all 116 catalog IDs. The original eight ports remain; 108 additional standalone components provide native templates and behavior. Angular 20 is the build baseline, with compatibility checks for Angular 20.0, 20.3, 21 and 22.

## Integration contracts

Each Angular detail page includes its export, selector, usage example, signal inputs, output events, complete component source, shared source dependencies, and styles. Install the downloadable tarball to avoid manually assembling shared files. `packages/angular/catalog.json` lists the 108 added exports; `src/lib/framework/angular-catalog.ts` combines them with the eight originals.

Angular APIs intentionally differ from React APIs. Components accept typed records and projected content instead of React nodes or render functions. `model()` inputs support two-way binding such as `[(checked)]`, `[(page)]` and `[(selectedIds)]`; the corresponding change outputs appear in the API tables. Use the native contracts in `port-types.ts` when migrating data.

Controls expose signal models rather than `ControlValueAccessor`; direct `[formControl]` and `formControlName` bindings are not implemented. Bridge a reactive form control through the documented model inputs/outputs, for example `[value]="code.value" (valueChange)="code.setValue($event)" [disabled]="code.disabled" (focusout)="code.markAsTouched()"`, with a non-nullable string control.

| Component family | Angular behavior |
| --- | --- |
| Buttons | Native activation, disabled/pending feedback, async errors, abortable actions; magnetic movement and pointer-origin ripples where applicable |
| Forms and authentication | Native validation, password visibility, one-time-code autofill/paste, cancellation, preserved values and application submission handlers |
| Navigation | Data-driven selection, active states, arrow navigation, expandable branches, native selects, bounded pagination and scroll progress |
| Data table | Sorting, global search, column filters/visibility, selection, bulk callbacks, row details, pagination, loading/error/empty states and horizontal containment |
| Chat and responses | Application-connected sending, cancellation/retry, preserved drafts, source links, progressive text reveal and clipboard feedback |
| Pricing and comparison | Billing-period calculations, plan output events, search, differences-only filtering and collapsible feature groups |
| Collections and feedback | Batch selection, notification dismissal/restore, expandable audit/timeline entries and application-owned recovery actions |
| Dialogs and tooltips | Native modal focus containment and Escape restoration; tooltip hover, keyboard focus, touch and Escape dismissal |
| Cards | Profile, wallet, folder, stack, story, peek and reveal layouts with selection and disclosure; Spotlight Card projects arbitrary content with pointer-driven illumination |
| Motion | Native CSS transitions, counters, clocks, rotary controls, pointer effects and Canvas 2D visual engines with cleanup and pause controls |

## Application services

Actions and form submissions use abortable handlers. A missing handler emits an application request or explains that a handler is required; it does not pretend a remote action completed. Connect authentication, payments, bookings, chat/AI, storage and recovery to your application. Website handlers simulate requests locally and label that fact visibly. Validate user data on the server.

## Rendering differences and limits

The native ports preserve each component's core interaction purpose, with independent Angular APIs and layouts. They do not reproduce every React option, visual, animation curve, momentum model or shader. CSS/Canvas 2D adaptations replace Framer Motion and WebGL; some visual effects are deliberately simpler. React render callbacks and custom cell renderers are not accepted by Angular components. The data table currently uses typed primitive cells and JSON row details rather than an Angular cell-template API.

Motion respects reduced-motion preferences. Canvas engines stop their animation loop when paused, offscreen, hidden, or destroyed; reduced motion draws a static frame. Timers and request controllers are cleaned up on component destruction. Angular SSR is not validated; the documentation shell remains React, with Angular previews loaded on demand in isolated frames.

## Maintenance and verification

`npm run angular:sync` generates the 108 authored native templates, their export list, demo registry and API catalog. Edit the authored definitions in `scripts/generate-angular-ports.ts` or `scripts/angular-complex-ports.ts`, and shared native behavior in `packages/angular/src/port-controllers.ts` and `port-canvas.ts`. Coverage generation fails on missing or duplicate catalog IDs. The components are generated from authored Angular templates, not by rendering React inside Angular.

`npm run angular:build` synchronizes, compiles and packages the library and demos. `npm run test:angular-package` installs the tarball into separate compiler environments and strictly compiles every selector. Browser coverage mounts and disposes all 108 added ports in both themes on desktop/mobile emulation, then checks representative keyboard, async, data and canvas interactions.

## React parity work

See the [component tracker](ANGULAR_REACT_PARITY.md) for the full review order, status and detailed findings.

React is the reference for ongoing Angular improvements. Catalog coverage alone does not establish matching visuals, behavior or APIs. Components are reviewed individually; the remaining native ports retain the limitations above until verified.

Activity Feed now uses the React `ActivityEvent`, `ActivityActor`, event type and status contracts, exported from the Angular package. It accepts `events`, `enableLiveSimulation` (default true), `enableFilters` (true), `enableSearch` (true), `maxEntries` (20), `onEventReplay` and `className`. The named replay callback controls visibility of replay buttons, matching React; `eventReplay` also emits the event for Angular subscribers. Native attributes and DOM events can be attached to the component host.

Migrate the previous generic Activity Feed `items` records to `events` (`label` becomes `title`; add `type`, `status` and `timestamp`). Generic collection inputs and outputs are replaced by the event-specific contract. The package remains native Angular with no React runtime dependency.

The demo uses the same three events as React. The fixed dark telemetry palette stays dark in either website theme, as React does. Typography follows the rendered React font stack; applications can override `--kit-activity-font`. Native Web Animations use React's snappy spring constants for event entry, exit and layout movement. CSS handles JSON disclosure; reduced motion disables motion. Timers, clipboard feedback and animations are disposed with the component.

Run `npm run test:activity-feed` after building the tarball to test public inputs, external event replacement, replay callbacks/outputs, feature flags, entry limits and timer cleanup. `e2e/activity-feed-parity.spec.ts` compares React and Angular interactions, control geometry, typography, icons and themes on desktop/mobile, and saves component screenshots for review. Angular 20.0/20.3/21/22 consumer compilation includes the event-specific bindings.

## Advanced Data Table parity

The native table now follows React's typed columns, cards/table views, current-page selection and ID-based bulk callbacks. Custom cells and details use Angular templates; compound components are available for custom composition. See [migration and validation details](parity/advanced-data-table.md) and the [component parity tracker](ANGULAR_REACT_PARITY.md).

## AI Agent Activity parity

This component now follows React’s typed activities, five statuses, detail sections and independent disclosure controls. Native compound components support custom headers, timelines and items. See [migration, validation and screenshots](parity/ai-agent-activity.md) and the [parity tracker](ANGULAR_REACT_PARITY.md).

## AI Prompt Composer parity

The composer now accepts React’s `onSend` input and uses the same labels, attachment feedback and website preview layout. `sendHandler` remains a deprecated compatibility alias. See [validation and migration](parity/ai-prompt-composer.md) and the [parity tracker](ANGULAR_REACT_PARITY.md).

## Loader parity

Loader now follows React’s four visual variants, size/color API, accessible label and explicit reduced-motion animation options. Native HTML attributes and events apply to its status host. See [migration and validation](parity/loader.md).

## Button parity baseline

Button follows React’s nine visual variants, four sizes, loading text, icon templates/projection, disabled state and fullWidth behavior. Use the native `button[kitButton]` selector for DOM attributes, native form behavior and events; `kit-button` remains available with an internal button. See [the review](parity/button.md) for migration notes and verified coverage.

## Neon Edge Button parity baseline

Neon Edge Button follows React’s travelling beam, speed/glow controls, projected content, hover/press styling and reduced-motion highlight. The native `button[kitNeonEdgeButton]` selector preserves HTML form semantics and events; the existing custom selector remains available. See [the review](parity/neon-edge-button.md) for migration and verified coverage.

## Orbital Loading Ring parity baseline

Orbital Loading Ring follows React’s three variants, size/speed defaults, SVG tracks/satellites/core, accessible label precedence and static reduced-motion state. The host is the status element; native attributes/styles/events apply directly. The showcase uses the same 96px dense ring and caption. See [the review](parity/orbital-loading-ring.md) for migration and verified coverage.

## Spotlight Card parity baseline

`KitSpotlightCardComponent` follows React's single projected-content card, spotlightColor/spotlightSize defaults, native attributes and mouse-handler overrides. Its former collection/selection/disclosure/action API is removed. See [contract and validation](parity/spotlight-card.md).

## Morphing Icon parity baseline

`KitMorphingIconComponent` follows React's controlled two-icon wrapper with required from/to TemplateRefs, active/size/duration defaults and whole-style override precedence. It replaces the old self-toggling menu button. See [contract and validation](parity/morphing-icon.md).

## iOS Search Bar parity

`KitIosSearchBarComponent` replaces the former filterable collection with React's controlled `value`/`onChange` search contract, optional submit/clear callbacks, configurable focus expansion and native search/form behavior. See [migration, motion differences and validation](parity/ios-search-bar.md).

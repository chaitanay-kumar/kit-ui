# Kit UI for Angular

116 native standalone components using Angular signals, inputs, and outputs. Supports Angular 20, 21, and 22 with RxJS 7.8+. React is not a dependency.

Chat and Dynamic Island use `tailwind-merge` to resolve caller classes consistently with the React components. Package installation supplies this runtime dependency. When copying their authored sources, install `tailwind-merge` and include the generated scoped CSS and class dictionaries alongside the listed helpers. Their default styles are precompiled; custom utility classes still require matching styles in the consuming application.

This package is not published to npm. Build from this repository with `npm run angular:build` (Node 22.22.3+) or download the built tarball from the website's Angular setup page. Install the actual local artifact:

```sh
npm install ./kit-ui-angular-0.1.0.tgz
```

Add `@import 'kit-ui-angular/styles.css';` to your application's global stylesheet. Styles use optional `--bg`, `--border`, `--text-primary`, and `--text-secondary` variables, with light defaults; supply dark theme values on your root or a wrapper. Motion behavior follows each component’s documented inputs and reference behavior.

```ts
import { Component } from '@angular/core';
import { KitElasticSheetComponent } from 'kit-ui-angular';

@Component({
  selector: 'app-example',
  imports: [KitElasticSheetComponent],
  template: `<kit-elastic-sheet [snapPositions]="[35, 65, 90]" (snapChange)="height = $event">Your content</kit-elastic-sheet>`,
})
export class ExampleComponent { height = 35; }
```

All 116 components are standalone exports. Examples include `KitElasticSheetComponent`, `KitAdvancedDataTableComponent`, `KitChatComponent`, `KitMagneticButtonComponent`, `KitPricingComponent`, and `KitSmartComparisonComponent`. The repository's `packages/angular/catalog.json` lists the 108 added ports; the eight original Kit exports remain available unchanged. Each website detail page shows the precise export, selector, inputs, outputs and required source files.

Upload and prompt components need application-provided `upload` and `sendHandler` callbacks. Honor the supplied AbortSignal and reject on errors; client file validation does not replace server validation. Native modal dialogs contain focus and support Escape. Swipe actions have button alternatives; hold confirmation supports Space and Enter; timeline controls use a native keyboard-accessible range.

The Angular components are independent Kit UI ports. MIT; preserve the included LICENSE and upstream notice. See the repository's ATTRIBUTION.md for the project's independent derivation.

The library is built with Angular 20.3 and TypeScript 5.9 in partial compilation mode. Compatibility checks install the same tarball into separate Angular 20.0, 20.3, 21, and 22 consumers and compile all 116 selectors with each consumer's own compiler and compatible TypeScript. The components work with zone-based and zoneless applications; the website demo explicitly enables Angular 20's zoneless provider. The library does not configure change detection for your application.

Angular APIs are independently designed: React render props become typed data or projected content, and callbacks become output events or abortable application handlers. Native CSS and Canvas 2D replace Framer Motion and WebGL effects. Visuals and detailed motion physics differ; this is catalog coverage, not pixel-identical rendering or React API compatibility. Authentication, payments, scheduling, uploads and AI services remain application responsibilities. Library components never report an external operation as completed without an application handler.

Button accepts React-matched variant/size/isLoading/loadingText/fullWidth/disabled/type/className inputs. Use `<button kitButton (click)="save()">Save</button>` for native HTML attributes, form semantics, focus and DOM events. The existing `<kit-button>` custom selector remains available and renders an internal native button. Pass icons as TemplateRefs with leftIcon/rightIcon or project elements marked kitButtonLeftIcon/kitButtonRightIcon. Loading state is application-owned; the old generic action/loading/status/cancellation API is removed. The bundled Loader2 icon is derived from Lucide; preserve LUCIDE-LICENSE.txt.
Neon Edge Button accepts React-matched speed/glow/className inputs with projected content (default Deploy preview). Use `<button kitNeonEdgeButton>` for native HTML attributes, form semantics and DOM events. The existing `<kit-neon-edge-button>` selector remains available with an internal button. The old generic action/loading/status/cancellation API is removed; requests remain application-owned. The copied Zap icon retains LUCIDE-LICENSE.txt.
Orbital Loading Ring follows React’s size/speed/variant/label/className defaults, including undefined bindings. The component host is the native status element, so HTML attributes, styles and events apply directly. An aria-label input can override the accessible name; explicitly binding undefined removes that override attribute, matching React’s spread props. OS reduced motion stops the three CSS animations. The old generic loading/paused/Ready API is removed; mount/unmount the indicator for loading state.

### Spotlight Card

`KitSpotlightCardComponent` renders one content card. Project children directly into `<kit-spotlight-card>`. Inputs are `spotlightColor` (default `rgba(56, 189, 248, 0.08)`), `spotlightSize` (350) and `className`; explicitly undefined values retain those defaults. Native attributes/styles/events apply to the host. `onMouseMove`/`onMouseLeave` inputs accept `SpotlightCardMouseHandler` callbacks with native MouseEvent payloads; supplying either overrides the corresponding internal handler, as React's spread props do. Explicit undefined overrides disable that internal handler. Omit these inputs to retain tracking; use native `(mousemove)`/`(mouseleave)` listeners for observation without replacing it. The previous items/selection/disclosure/loading/action API is removed. No role, focus behavior or action is added by default; projected controls keep their native semantics. React's hover capability rules and CSS transitions apply; reduced-motion preferences do not change this reference component's transitions.
A zero `spotlightSize` follows the current React reference: useMotionTemplate omits its falsy numeric fragment, producing invalid CSS and retaining the previous painted gradient (none on a fresh zero-size mount). Use a transparent `spotlightColor` with a positive size to hide the ambient glow.

### Morphing Icon

`KitMorphingIconComponent` requires `[from]`/`[to]` TemplateRefs, the Angular equivalent of React nodes. It follows `[active]` (false), `[duration]` (0.3 seconds), `[size]` (20 pixels) and `className` defaults; explicitly undefined optional inputs retain those defaults. Both templates remain mounted while state changes, and inactive layers have aria-hidden. State is controlled by the application: the old self-toggling menu-button, disabled/label and activeChange API is removed. Wrap the icon in your own button when needed. Native host attributes, events and ElementRef remain available.
`[style]` accepts `MorphingIconStyle` or a native CSS string and follows React's complete override precedence. Omitting it supplies size-based width/height; supplying an object replaces those dimensions entirely, and explicit undefined removes them. Numeric dimensional values gain pixel units; unitless values and CSS variables retain their numeric values. Individual native `[style.width.px]` bindings are also supported through ordinary Angular styling, with Angular's merge semantics.
Morphs use cancellable browser animations from the current painted state, with cubic-bezier(0.4,0,0.2,1), scales 1/0.65, rotations 0/-90/+90 and opacity cross-fades. Initial states do not animate. The reference does not automatically disable these morphs for OS reduced motion; Angular follows it. The website demo uses the same Lucide SVG paths, with ISC attribution in LUCIDE-LICENSE.txt. Its shared website CSS is installed only while this demo is mounted and removed on disposal; the library remains native Angular with scoped component CSS and no React runtime dependency.
The shared package stylesheet excludes Morphing Icon from generic minimum-width and descendant focus-ring defaults, so projected controls keep their reference styling.

### Smooth Accordion

`KitSmoothAccordionComponent` requires `[items]`: `AccordionItem[]` with `id`, `title`, optional `subtitle`, and `content` (text, numbers, empty/boolean nodes, or an Angular `TemplateRef`). `[allowMultiple]` defaults to false; `[defaultOpen]` defaults to an empty list and is read only on initial mount. Initial IDs remain stored when items disappear, and multiple initial IDs are preserved even in single mode, matching React. `className` applies to the root disclosure container.

Use a template for rich content and ordinary Angular event bindings inside it. Exiting templates remain mounted until their spring finishes; reopening during exit preserves their state. Header buttons deliberately omit `type`, matching React's native submit behavior inside forms. Keyboard Enter/Space, aria-expanded and focus rings follow the native buttons. Include `kit-ui-angular/styles.css`; the component excludes generic package styles that would alter its layout or reduced-motion behavior.

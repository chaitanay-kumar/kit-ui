# Sticky Pages parity

Native Angular CSS sticky stacking replaces the generic collection with headers/actions. Source contract: `src/components/ui/StickyPages.tsx`; authoring: `scripts/angular-sticky-pages.ts`; styling: `packages/angular/src/sticky-pages.css`.

Inputs: `pages`, `pageHeight` (100vh), `topOffset` (0), `stackOffset` (0), `className`, `rounded`, `shadow`, `border`. Top position is `topOffset + index * stackOffset`, with successive z-index values. The React implementation accepts the last three boolean options but does not apply them; Angular preserves that current behavior.

Each page supports id, title, subtitle, badge, description, className, bg, and string/number/TemplateRef content. Falsy content uses the default layout, including zero as in React. Consumer `bg` and `className` refer to classes supplied by the application; the default background needs no Tailwind.

Rich child composition uses explicit page templates, which take priority over the pages input:

```html
<kit-sticky-pages pageHeight="60vh" [stackOffset]="24">
  <ng-template #stickyPage><button (click)="save()">First page action</button></ng-template>
  <ng-template #stickyPage><p>Second page content</p></ng-template>
</kit-sticky-pages>
```

Migration: replace `items` and selection/action bindings with `pages` or page templates. There is no selection controller or built-in action. React's StickyPage wrapper and StickyStack/StackingPages export aliases are represented by the Angular template API rather than extra exported components.

Validation: paired desktop/mobile Chromium geometry at four scroll offsets, empty pages, dynamic data/child priority and live projected button events; package contracts for height/offset/z-index, defaults and truthy/falsy content; native consumer without Tailwind. See [batch evidence](batch-31-integration.md).

The React documentation showcase is handcrafted markup rather than StickyPages itself. The Angular preview deliberately demonstrates the actual component and is labeled accordingly. Showcase pixel equivalence is not claimed. Final user QA, physical devices and other browsers remain outside the recorded coverage.

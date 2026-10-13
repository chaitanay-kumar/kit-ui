# UnfoldAccordion parity

React's `UnfoldAccordion` is the reference. Angular now uses native buttons and controlled internal disclosure state instead of generic collection `<details>` elements.

## Contract and migration

Supply required `items: UnfoldAccordionItem[]` with `id`, `title`, optional `subtitle`, and `content`. String/number content renders as text; `TemplateRef<unknown>` provides native rich content and interaction. Null, undefined and booleans render no content, matching React's ReactNode conventions. IDs must be unique.

Defaults match React: `allowMultiple=false`, `defaultOpen=[]`, and empty `className`. `defaultOpen` is initial state only; later changes do not reset user disclosure. Changing the item list preserves open IDs, including removed/reinserted IDs. Changing multiple-open mode does not implicitly close existing rows; the next toggle follows the selected mode. The former collection selection/action/loading/error API is removed.

Triggers have `type="button"` and `aria-expanded`, support native Enter/Space and visible keyboard focus, and do not submit an enclosing form. Template content remains interactive. Colors follow the same theme tokens and responsive content typography as React.

Height/opacity and chevron reuse the validated native accordion spring engine without changing Smooth Accordion behavior. The inner content moves by 4px with the reference 280ms cubic-bezier easing. Exiting content remains mounted until the outer spring finishes; reopening reverses the motion. Destruction disposes springs, Web Animations and motion-preference listeners.

Angular disables motion under reduced motion; the reference React component continues its spring transitions. Screen-reader application testing, physical devices, other browser engines and SSR remain unverified.

## Validation

The local baseline passes the checks recorded in [batch 4](batch-4-integration.md). Focused cases cover initial and single/multiple state, keyboard/form behavior, template content, updates/removal/reinsertion, theme geometry, interrupted motion, reduced motion and disposal on desktop/mobile. Authored sources are `scripts/angular-unfold-accordion.ts` and the `packages/angular/src/unfold-accordion-*` helpers/styles. Template content shares the existing accordion content type; height/opacity/chevron reuse the unchanged `smooth-accordion-motion.ts` engine.

| Capture | React | Angular |
| --- | --- | --- |
| Desktop light | [Image](screenshots/unfold-accordion-react-desktop-light.png) | [Image](screenshots/unfold-accordion-angular-desktop-light.png) |
| Desktop dark | [Image](screenshots/unfold-accordion-react-desktop-dark.png) | [Image](screenshots/unfold-accordion-angular-desktop-dark.png) |
| Mobile light | [Image](screenshots/unfold-accordion-react-mobile-light.png) | [Image](screenshots/unfold-accordion-angular-mobile-light.png) |
| Mobile dark | [Image](screenshots/unfold-accordion-react-mobile-dark.png) | [Image](screenshots/unfold-accordion-angular-mobile-dark.png) |

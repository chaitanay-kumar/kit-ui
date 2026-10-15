# Scroll Progress Navigation parity

Status: validated locally in batch 30; integration pending.

React contract: `src/components/ui/ScrollProgressNav.tsx`. Angular authoring: `scripts/angular-scroll-progress-nav.ts`, `packages/angular/src/scroll-progress-nav.css`, `scroll-progress-nav-motion.ts`, and shared `animated-tabs-motion.ts`.

- Default sections, indices, compact/expanded menus, fixed anchors, inline/sticky modes and floating threshold follow source. Truthy activeId changes synchronize selection; manual clicks retain source local-state behavior. Missing active items display the first item's compact label while leaving full-list indicators unselected.
- Window/container progress clamps to 0–100 and retains its previous value for nonpositive scroll ranges. Reverse section search uses source viewport/container offsets. Listener dependencies preserve container-ref identity versus mutable current semantics, mode changes and disposal; no resize listener is added.
- Click selection precedes its callback, scrolling and menu collapse. Callback failure stops later actions. Container actions use the source -20px offset; window actions use smooth scrollIntoView. Top actions scroll the relevant target smoothly to zero. The source does not consult reduced-motion preference despite metadata claiming otherwise.
- Navigation layout and active-pill springs follow source intermediate geometry. The pill compensates its parent projection and does not animate from a hidden desktop layout when the compact menu opens. Compact and full labels preserve source Inter metrics and mono indices.
- Actual native demo supplies the source five-section, 300px contained viewport and inline navigation. Published usage supplies typed sections and a native container reference.

Evidence so far: packaged scroll, callback, input/ref lifecycle and disposal contracts; eight paired desktop/mobile behavior checks; fixed/inline/sticky settled geometry; controlled threshold, selection and compact expansion/collapse comparisons; actual demo geometry and copy. Full 12-case Progress suite and 18-case Glass/bare/demo suite pass on desktop/mobile, with six shared Tabs and two Submenu regressions. Final wrapper-font rebuild, packaged contracts, four Progress geometry/motion and four bare/demo comparisons pass. Production baseline, 117 unit tests and strict installed consumers on Angular 20.0.0/20.3.33/21.2.25/22.2.1 pass; see [batch evidence](batch-30-integration.md).

Limits: controlled timing disables Web Animations in both frameworks; real-time checks retain it. Physical devices, non-Chromium engines, SSR and exhaustive arbitrary consumer styling are outside recorded coverage. Integration and earlier fixture audit remain for review; AI Response is deferred.

# Glass Navbar parity

Status: validated locally in batch 30; integration pending.

React contract: `src/components/ui/GlassNavbar.tsx`. Angular authoring: `scripts/angular-glass-navbar.ts`, `packages/angular/src/glass-navbar.css`, `glass-navbar-motion.ts`, and shared `animated-tabs-motion.ts`.

- Default brand, CTA, navigation data, anchor destinations, external attributes, badge geometry and responsive floating/full-width layouts follow React. TemplateRef and scalar slots provide native brand, CTA and icon content, including source zero/null behavior.
- Initial active selection uses a flagged item's label or the first label even when IDs exist. Truthy activeId changes synchronize selection; clicks can change local selection while a truthy input remains unchanged. Item callback runs before selection callback and closing; thrown callbacks retain the source's partial state changes.
- Desktop hover and active indicators use their source spring configurations. Mobile menu icons remount on toggle. The panel retains its rendered items/selection/CTA during exit, reuses the view on interrupted exit, and releases it after completion. Natural/collapsed height measurements include padding and border as source does.
- Escape closes an open menu. Body overflow clears on mount/close/disposal and becomes hidden while open, preserving the source's behavior rather than restoring an earlier value. The source does not add a focus trap or outside-click dismissal.
- Actual native demo uses the source floating, nonsticky navbar with its custom Deploy Now CTA. Published usage includes typed items and a native CTA template.

Evidence so far: packaged behavior/lifecycle/motion contracts; paired mobile menu, callbacks, Escape, body overflow and template state; controlled icon/panel and desktop indicator geometry; default/variant/glass/scalar/template comparisons; actual desktop/mobile demo geometry and copy. Full 18-case Glass/bare/demo suite, 12-case Progress suite, six shared Tabs and two Submenu regressions pass on desktop/mobile. Production baseline, 117 unit tests and strict installed consumers on Angular 20.0.0/20.3.33/21.2.25/22.2.1 pass; see [batch evidence](batch-30-integration.md).

Limits: controlled timing disables Web Animations in both frameworks; real-time checks retain it. React's actual implementation defines reduced-motion behavior. Physical devices, non-Chromium engines, SSR and exhaustive arbitrary consumer styling are outside recorded coverage. Integration and earlier fixture audit remain for review; AI Response is deferred.

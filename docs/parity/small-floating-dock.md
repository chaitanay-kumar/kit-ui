# Small Floating Dock parity

Status: validated locally in batch 29; integration pending.

React contract: `src/components/ui/SmallFloatingDock.tsx` and `src/lib/motion-tokens.ts`. Angular authoring: `scripts/angular-small-floating-dock.ts`, `packages/angular/src/small-floating-dock-motion.ts` and `small-floating-dock.css`. Generated components are not edited directly.

- Required items retain IDs, labels, icons and action callbacks; only the first five render. Angular exports `SmallFloatingDockItem` and template/scalar icon types. Positive numeric badges render and cap at `99+`; zero, negative and NaN badges are omitted.
- Defaults, explicit undefined inputs, three sizes, three fixed anchors and icon-only/icon-label variants follow source. Active ID is controlled presentation, without automatic selection. Disabled buttons, ordinary Tab/Enter/Space access, navigation label and current-page attributes follow source; buttons do not submit forms.
- Pointer/focus tooltips, hover/press feedback, 200/28/.85 dock springs, 380/30/.5 button springs and badge entrance follow source. Tooltip duration is 150ms with source motion-value easeOut. Presence retains the DOM through source sampled spring completion, supports interrupted exit and disposes frames/listeners.
- hideOnScroll responds to downward movement above 60px and restores visibility on other scroll events. Toggling the option preserves source hidden-state behavior and rebaselines the listener. Empty item updates dispose per-button listeners.
- Source has no component-level reduced-motion opt-out; mobile reduced-motion comparisons preserve its actual behavior. The native detail demo uses actual SVG icons, four no-op actions, Security badge and source wrapper geometry.

Validation: the 62-case batch suite passes on desktop and Pixel 7, including every size/anchor/variant combination, source/native settled geometry, real actions/keyboard/scroll, light/dark actual demos and consumers without Tailwind. Later focused tests pass intermediate hover/tooltip/press/release comparisons (2px geometry, .025 opacity) and affected dock lifecycle cases. Packaged checks compare spring opacity against the source generator and verify data, callbacks, defaults, sampled exit retention, interrupted visibility and disposal. Lint and 117 unit tests pass. Final production build (289 SEO checks), installed strict consumers on Angular 20.0.0/20.3.33/21.2.25/22.2.1, and exact main/recursive source downloads pass; see [batch evidence](batch-29-integration.md).

Limits: Angular TemplateRef/scalar icons and native CSS/classes provide framework equivalents to React nodes/classes. Physical devices, non-Chromium engines, SSR, exhaustive arbitrary style/data combinations and every intermediate frame are outside recorded coverage. Integration and the earlier standards-mode fixture audit remain for review; AI Response is untouched.

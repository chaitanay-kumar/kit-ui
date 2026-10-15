# Selection Basket parity

Status: validated locally; integration pending. Focused checks and full batch baseline pass.

React contract: `src/components/ui/SelectionBasket.tsx`. Native definition: `scripts/angular-selection-basket.ts`; helper: `packages/angular/src/selection-basket-motion.ts`; styles: `selection-basket.css`.

The port replaces the unrelated item-selection/application-action control with React's controlled toolbar. Visibility depends on selectedCount > 0. Default actions are Export, Move to Folder, Share and Delete with source Lucide geometry; supplied actions support scalar/template icons and default/danger/primary variants. Actions, select-all and clear invoke callbacks without mutating count. The all-selected label requires an exact positive total-count match; “Select none” still calls onSelectAll. Singular text is used only for count 1. An explicit zero total with an onSelectAll callback preserves the source short-circuit expression's literal 0 text instead of a select-all button.

Fixed, contained and inline positioning, responsive spacing, horizontal overflow, typography, backgrounds and focus styles match the source. Class names for modes are scoped to avoid Tailwind utility collisions. The inline toolbar intentionally retains its source width behavior: it can exceed a narrow viewport and enlarge mobile layout viewport dimensions. The contained/fixed modes use source percentage/viewport maximum widths.

Native presence keeps the outgoing count/actions/callbacks/configuration snapshot, supports interrupted exit and cancels pending animation on disposal. Entry uses stiffness 320, damping 24 and mass 0.7; exit uses the source 150ms tween. The source does not opt out of this motion under reduced-motion preferences. No invented arrow-key toolbar navigation is added: native Tab and button activation match actual React behavior despite metadata describing more.

Packaged checks cover controlled callbacks, default/custom actions, all-selected labels, frozen exit snapshots, reentry and disposal. Paired Chromium checks compare desktop/mobile geometry, pointer hits and computed styles in all three modes. Template-content consumers work with library styles and no Tailwind. The actual demo uses four source files with items 1 and 3 initially selected and functional select-all/clear callbacks. Exact demo row geometry and typography match the React reference. See [batch 25](batch-25-integration.md) for current validation. Physical devices, other browsers and exhaustive arbitrary-template content remain outside coverage.

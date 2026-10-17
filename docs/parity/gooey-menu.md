# Gooey Menu parity

Native Angular replaces the unrelated generic action collection with the actual liquid dropdown. Source: `src/components/ui/GooeyMenu.tsx`; authoring: `scripts/angular-gooey-menu.ts`; CSS and independent delayed springs: `packages/angular/src/gooey-menu.css` and `gooey-menu-motion.ts`.

Inputs follow source options, width (306), defaultValue/defaultOpen, value/open and callbacks. Open is controlled only when supplied. `onOpenChange` reports requests even when the value is unchanged. Selection remains local after choosing, including when `value` is supplied; changes to external value or options identity resynchronize it. Missing external values preserve the active index. Mount defaults do not reset state later. Selection callback failure prevents closing after the local selected value/index update.

Root keyboard navigation opens on Enter/Space/Down, wraps while open and closes on Escape. It retains native trigger focus. Outside window pointerdown closes only while open; its captured callback lifetime follows React's open-only effect. Empty options preserve the source modulo/invalid-index behavior. Listener and animation disposal are verified.

The stage reserves its full height while closed: 68 + (44 per option + 20 padding) + 24. The SVG blur/color-matrix filter, panel drop/grow/snap springs, chevron spring, row entry delay/stagger and reverse exit stagger follow React. Exiting rows retain previous content until their springs finish. Reopening retargets retained motion. Filter ID `kit-ui-goo-drop` and option IDs `gooey-opt-N` deliberately match source fixed IDs, including its multiple-instance collisions.

Migration: replace collection `items`/action/disabled bindings with string `options`, source selection/open inputs and callback inputs. `className`, `[style]`, `[attributes]`, common scalar root attributes and `[onKeyDown]` apply to the inner root. Other Angular native event bindings remain host bindings rather than automatically forwarding every React callback prop.

Validation: Angular APF/demo/source build, package state/failure/exit/disposal checks and Angular 20/21/22 strict usage consumers pass. Paired desktop/mobile behavior, settled geometry and intermediate motion pass; see [batch evidence](batch-32-integration.md).

Limits: React does not disable animation or SVG filtering for reduced motion, despite its metadata claim; Angular follows actual source. Source fixed IDs and keyboard semantics are preserved. Native documentation adds a selection status below the source-default menu. Physical devices, other browser engines and exhaustive pixel diffs are outside this baseline.

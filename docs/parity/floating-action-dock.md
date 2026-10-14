# Floating Action Dock parity

Status: validated locally; integration pending. Full batch baseline, packaged checks and rendered comparisons pass.

React contract: `src/components/ui/FloatingActionDock.tsx`. Native definition: `scripts/angular-floating-action-dock.ts`; motion: `packages/angular/src/floating-action-dock-motion.ts`; styles: `floating-action-dock.css`.

Required `DockItem[]` preserves id, label, icon, callback and optional unused badge. Angular exports `DockItem`; icons map React nodes to TemplateRef or string/number/null. `activeId` remains controlled and only affects the source border/background/indicator; clicks do not change selection. The native buttons intentionally omit `type`, preserving React's submit default inside forms. Callbacks returning false do not cancel default form behavior. Standard Tab, Enter and Space behavior remains native; no unrelated roving-navigation or async controls are added.

Mouse position is measured against each current button rectangle. Width/height interpolate from 40 to 56 over a 120px distance and use the source spring (180/14/0.1). Pointer/Enter press targets scale 0.88 through the source snappy spring (380/30/0.5). The existing analytical spring math is reused without implementation changes. Primary-pointer filtering, pointer up/cancel and keyboard blur restore scale; removed items release their motion state, and destroy cancels RAF/listeners. Tooltip/icon/hover colors use the source's hover-capability media query. Springs still run with reduced motion because the source provides no opt-out for them.

Native CSS owns layout, tokens, SVG sizing, focus and hover styles without requiring Tailwind. Custom icon content can stop mouse-move propagation before magnification, matching React. Utility classes supplied by consumers through `className` remain consumer-owned. The source's badge remains unrendered. Exhaustive multi-pointer/repeated-key timing, every intermediate Motion frame, physical devices, other browsers, SSR and application screen-reader testing are outside this validation.

Initial shared browser checks pass for controlled labels/active state, icons, callbacks, Enter/Space/form defaults, empty items, magnification/leave, tooltip media behavior, pointer cancellation and unmount on desktop/mobile. Packaged checks assert targets, child-leave filtering, removed-item cleanup and listener/frame disposal. Final styling, native consumer and compiler validation are recorded in [batch 23](batch-23-integration.md).

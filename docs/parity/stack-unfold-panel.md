# Stack Unfold Panel parity

Status: validated locally; integration pending. Focused checks and full library baseline pass.

React contract: `src/components/ui/StackUnfoldPanel.tsx`. Native definition: `scripts/angular-stack-unfold-panel.ts`; row/types/layout helpers: `packages/angular/src/stack-unfold-row.ts`, `stack-unfold-types.ts`, `stack-unfold-motion.ts`; styles: `stack-unfold-panel.css`.

The port replaces generic disclosures with the actual card stack. Internal expansion starts with the first card's ID or an empty string and is not reinitialized when cards change. Supplied expandedIds controls display. A supplied onExpandedChange callback suppresses internal updates even without controlled IDs; without a callback, clicking while controlled updates hidden internal state, which becomes visible when control is removed. Single/multiple expansion, disabled native triggers, default/minimal variants, title/subtitle/badge and source aria-controls IDs are preserved.

Content accepts reusable Angular templates or scalar values. Each view keeps native bindings and handlers; outgoing body content is retained during exit and rapid reopening preserves its state. Initial expanded bodies render at full height, as source AnimatePresence initial=false does. Rows enter with opacity/y springs, bodies unfold and fade with 200/28/0.85, and chevrons rotate with 380/30/0.5. Keyed row position/size projection uses the source layout spring, retains interrupted motion and clears transforms after settling. Removed views and component destruction dispose pending frames.

Packaged checks cover initialization, ARIA, disabled triggers, single/multiple behavior, callback-only/control/internal-state transitions and replacement cards. Paired Chromium checks compare default/minimal rendered geometry/typography/styles, dynamic templates, reordering and controlled state. Controlled-frame size-change checks compare intermediate row height and sibling positions within 2px, with matching initial/final geometry. Native detail demos use the three source engine/parser/attestation cards and responsive wrappers. Theme-token consumers work without Tailwind.

Source motion stays active under reduced motion. Cross-instance duplicate content IDs are retained from the source rather than silently renamed. Exhaustive arbitrary templates, every intermediate animation frame, physical devices, SSR and non-Chromium browsers are outside recorded coverage. See [batch 26](batch-26-integration.md).

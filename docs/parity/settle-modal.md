# SettleModal parity

Status: validated locally; integration pending. Focused checks and full library baseline pass.

React contract: `src/components/ui/SettleModal.tsx`. Native definition: `scripts/angular-settle-modal.ts`; motion: `packages/angular/src/settle-modal-motion.ts`; styles: `settle-modal.css`.

The native port replaces the generic native-dialog/async-confirm control with the source's controlled aria-modal div. Required open and onClose inputs leave state ownership with the consumer. Close button, optional backdrop closing and document Escape listeners invoke the callback without changing open. Optional close-button visibility, sm/md/lg sizing, className and title/description/children/footer slots match React. Slots accept Angular templates or scalar content, including source numeric-zero short-circuit text. There is no invented autofocus, focus trap, focus restoration or native top-layer dialog.

Opening stores the prior body overflow and sets hidden. Closing or replacing the callback cleans up the listener and restores the exact stored value. Nested modals preserve source behavior: Escape invokes both listeners, and closing them out of order can restore scroll while a modal remains open and later restore hidden after both are closed. Destruction removes listeners and active animation effects.

Panel scale follows 0.94→1.02→1 over 420ms; opacity/y use the source easing. Inner content starts at the actual source scale 0.98, runs 400ms with a 50ms delay, and backdrop opacity uses 320ms with its own easing. Native WAAPI uses sampled keyframes for the panel/inner curves. Exit retains owned content/configuration until all timelines finish; reentry cancels removal and template state survives. Finished identity transforms are cleared, matching React and preventing inner content from intercepting close-button pointer hits.

Packaged checks cover controlled callbacks, content/title linkage, options, callback replacement and overflow/listener cleanup. Paired Chromium checks cover entry overshoot, settled transforms, delayed exit, interrupted exit, native pointer-close, sizes, numeric content, templates/footer callbacks, nested behavior and disposal. Settled geometry/typography matches React on desktop/mobile. The detail demo uses Confirm archive with Cancel/Archive actions and sm sizing; responsive comparisons match the source.

Motion stays active under reduced motion, as the source does. Every intermediate frame, exhaustive arbitrary templates, physical devices, SSR and non-Chromium browsers remain outside coverage. See [batch 26](batch-26-integration.md).

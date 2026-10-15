# Elastic Sheet parity

Status: validated locally; integration pending. Focused checks and full batch baseline pass.

React contract: `src/components/ui/ElasticSheet.tsx`. Angular source: original authored `packages/angular/src/elastic-sheet.component.ts`; shared control styles are in `packages/angular/styles.css`.

The sheet filters finite snaps into 20–95, deduplicates and sorts them, and falls back to 35/65/90 when empty. Its initial height is the first normalized snap, read once after initial inputs. Reopening and later snap-input changes preserve height, matching React state rather than resetting or implicitly snapping. Nearest-snap ties choose the earlier/lower value. If the current height is absent from new snaps, arrow navigation preserves the source's index-minus-one behavior. Home/End select the extremes.

All pointer buttons can begin capture. Drag uses the source viewport-height percentage formula and clamps to the normalized extremes. Pointer-up and cancellation settle and notify even without a preceding drag. `onSnapChange` is a callback input; existing `(snapChange)` output remains available. Opening does not emit a snap. Native dialog close clears the drag origin, restores trigger focus and supports Escape. The dialog is labelled by its title and uses the source default content.

Projection supports ordinary Angular children. The optional `children` input accepts a reusable template or scalar: undefined/null use projection/default content, while false/true render nothing and zero/empty string remain explicit content. Templates retain bindings and native event handlers. Import the library stylesheet for the original control's styling; no Tailwind runtime is needed.

Packaged checks cover normalization, supplied initial snaps, persistence, nullish content, ties, callbacks, keyboard behavior, all-button capture and close cleanup. Paired Chromium checks cover actual drag/cancel, disabled opening, fallback snaps, native modal/focus/Escape behavior and exact desktop/mobile geometry. The detail demo uses default props inside the source's padded 576px wrapper. See [batch 25](batch-25-integration.md) for current validation.

Source inline Selection Basket overflow can enlarge the mobile layout viewport and therefore alter this sheet's viewport-based height. Paired fixtures preserve that behavior and compare actual viewport dimensions and pointer hits. Physical devices and other browsers are outside recorded coverage.

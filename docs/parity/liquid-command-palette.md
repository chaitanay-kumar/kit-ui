# Liquid Command Palette parity

Status: validated locally in batch 27; integration pending.

React contract: `src/components/ui/LiquidCommandPalette.tsx` and metadata. Native authored port: `packages/angular/src/liquid-command-palette.component.ts`.

- Source navigation examples are the default commands, including explicit undefined input values. Query matching is case-insensitive substring matching without trimming. Disabled commands remain visible but cannot become current or run.
- Native dialog open state follows source state, including native close events, capture-phase Ctrl/Meta K, earlier default prevention, focus on opening and current-option scrolling after rendering. Search and status persist across closing.
- One command runs at a time. Failure keeps the dialog available for retry; successful completion closes it even if it was closed and reopened during the same request. Component disposal removes the shortcut listener; promises are not cancelled.
- Option background/cursor and omitted versus false `aria-disabled` follow source. Generated IDs differ between frameworks while preserving their accessible relationships.
- Detail demo uses the actual default navigation commands; no custom demo-only status or command list.

Validation: batch 27 packaged contract passes. The paired suite covers 34 desktop/Pixel 7 cases: 32 passed in the full run; after correcting the demo margin reset, both expanded detail-demo cases pass on rerun. Covers light/dark settled demo geometry/typography, real demo upload failure/cancellation, default documentation navigation, consumers without Tailwind, undefined defaults, disabled state, native dialog lifecycle and disposal. Control dimensions normalize only subpixel float noise to 0.001px. Production build and 289 SEO checks, lint and all 117 unit tests pass. Installed tarball strict consumers compile all 116 selectors on Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1. Source downloads match authored sources/dependencies/shared CSS after newline normalization. See [batch evidence](batch-27-integration.md).

Limits: real Chromium desktop/mobile emulation; physical devices, other engines, SSR and exhaustive arbitrary command data are not established. Native `open`, `close`, filtering/navigation/run methods remain available as Angular conveniences. No invented command cancellation or reset is added.

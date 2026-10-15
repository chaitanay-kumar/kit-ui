# Smart Upload parity

Status: validated locally in batch 27; integration pending.

React contract: `src/components/ui/SmartUpload.tsx` and metadata. Native authored port: `packages/angular/src/smart-upload.component.ts`. Shared `acceptsFile` already matches the React helper and is unchanged.

- File input is separately associated with its label. Defaults apply to explicit undefined values. Size limit and pending progress text round like React; numeric progress remains unrounded. Empty error messages remain empty through nullish fallback.
- Queue capacity is checked before size/type validation and stops processing at capacity. Validation messages, case-insensitive MIME/extension matching, repeated file selection/input reset and drop behavior follow source. Preview creation remains case-sensitive to the `image/` MIME prefix.
- Each entry owns an abort controller. Duplicate sends are ignored; cancellation allows fresh retries and rejects stale progress/completion. Progress is finite and clamped. Missing handler feedback, success, error and retry states follow source.
- Removing entries revokes their preview URLs; disposal aborts active uploads and revokes remaining URLs. Disabled inputs block new interactions but pending Cancel remains available, as in React.
- Detail simulation uses source wrapper, timing, filename failure rule and exact error wording; the existing other-component upload handler is preserved.

Validation: batch 27 packaged contract passes. The paired suite covers 34 desktop/Pixel 7 cases: 32 passed in the full run; after correcting the demo margin reset, both expanded detail-demo cases pass on rerun. Covers light/dark settled demo geometry/typography, real demo upload failure/cancellation, default documentation navigation, consumers without Tailwind, undefined defaults, disabled state, native dialog lifecycle and disposal. Control dimensions normalize only subpixel float noise to 0.001px. Production build and 289 SEO checks, lint and all 117 unit tests pass. Installed tarball strict consumers compile all 116 selectors on Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1. Source downloads match authored sources/dependencies/shared CSS after newline normalization. See [batch evidence](batch-27-integration.md).

Limits: upload remains consumer supplied and tests use local promises; no server transport, physical device or non-Chromium browser validation is claimed. Source permits duplicate filenames and preserves source wording such as `1 files ready.`. Angular's methods/signals remain native conveniences.

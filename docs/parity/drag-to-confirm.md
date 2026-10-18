# Drag to Confirm parity

Status: validated baseline in local batch 43, within the validation scope and limits below. Integration and final user QA remain outstanding.

## Source contract

- `DragToConfirm.tsx` defines the contract. The native authoring definition is `scripts/angular-drag-to-confirm.ts`; generated component files are not the authoring source.
- Defaults: “Slide to confirm”, “Confirmed ✓”, `confirm`, `md`, internal false, reset after 2500 ms, enabled, haptics enabled. Native icons use `TemplateRef` equivalents of React nodes. Explicit `undefined` retains source defaults.
- Sizes are 40/48/56 px tracks, 32/40/44 px thumbs, and 40/48/56 px measurement offsets. Maximum travel starts at 200, then becomes `max(40, offsetWidth - offset)`. Measurement follows mount, size and window resize, rather than a continuous resize observer. Corrected the React metadata's 54 px large-size description to the implemented 56 px.
- Delete/unlock/submit infer danger/warning/info; archive/confirm/continue infer default. Explicit variants override inference. `success` follows the source default branch. Source Lucide geometry and idle/confirmed color profiles are retained.
- A drag reaching 85% confirms; a shorter drag springs back. Enter, Space and ArrowRight confirm directly, rather than incrementing a range. These keys prevent default even when a disabled/confirmed guard suppresses the action. The separate screen-reader button remains present. `aria-valuenow` is a render snapshot: it does not update live during drag, and can retain 100 or render 0 after reset depending on whether the render samples before or after the motion frame. A fresh render after settling reports 0.
- Controlled false emits a confirmation request and moves the handle without owning confirmed state. Controlled true suppresses new confirmation. Haptic vibration is 22 ms; denied vibration is ignored. Confirmation moves/commits internal state before the unbound callback. A thrown callback aborts subsequent reset scheduling. Reset captures its original owner, callback and motion preference, even if later inputs change. Pointer-up also captures the release configuration before its deferred callback frame; later controlled-state, callback, haptic and delay updates do not replace that captured release.
- Qualified pointer cancellation and disabling an already-qualified active gesture can still confirm in the source. The native port preserves those observed contracts. Native callbacks report failures through Angular `ErrorHandler` without introducing implicit event cancellation.

## Motion and native implementation

`drag-confirm-controller.ts` implements measured constraints, 0.06 elastic travel, frame-sampled pointer work, capture-phase release/cancel, scroll compensation, per-window ownership between native Drag to Confirm instances, and disposal. Springs use source snappy 380/30/0.5 and responsive 320/24/0.7 parameters, with MotionValue-style velocity sampling. Tap/drag targets are 0.96/1.04. Reduced motion makes handle movement zero-duration on the next frame; source icon/label reveals still use their snappy spring. `drag-confirm-reveal.ts`, `batch43-icons.ts` and scoped CSS are included in source downloads.

## Validation and limits

- Paired desktop/mobile behavior, real Chromium touch input, pointer capture/cancellation, held-key feedback, captured resets, callback failures and disposal are covered in `e2e/parity-batch43.spec.ts`. Geometry checks compare idle and confirmed sizes, tones, glyphs and computed styles against React. Packaged contracts are in `scripts/verify-parity-batch43.mjs`; exact completed results belong to the [batch brief](batch-43-integration.md).
- Observed source gap: a qualified pointer-up dispatched in the same browser task as React unmount invokes its captured confirmation callback and vibration; a deferred release can be cleaned up first. The same-task probe passes two repetitions per framework/viewport. Native destruction deliberately cancels gesture frames/listeners and emits neither. The paired unmount test asserts both actual outcomes. Already-created reset timers are cancelled on disposal in both frameworks.
- Public `TemplateRef` content, framework error reporting and DOM hosts are native equivalents, not React rendering. No physical-device, Safari/Firefox, full WCAG, cross-controller drag-lock interoperability, or frame-by-frame identity claim is made.

Integration review, merge/deployment and final user QA remain outstanding for batch 43.

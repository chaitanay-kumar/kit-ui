# Torque Dial parity

React source: `src/components/ui/TorqueDial.tsx`; authoring: `scripts/angular-torque-dial.ts`; native controller and styles: `packages/angular/src/torque-dial-controller.ts` and `torque-dial.css`.

The native slider preserves required controlled value/onChange inputs, source defaults, raw displayed/ARIA values and clamped visual progress. Wheel and pointer input update an optimistic value reference before invoking callbacks; keyboard and double-click requests do not. The six handled keys prevent default, including requests at boundaries. Wheel listeners are nonpassive. Pointer angles wrap across 180 degrees, and release velocity decays by .92 per frame until the source threshold, including continued frames at bounds. Gesture options and callbacks stay captured when inputs change during a drag.

Dial rotation and arc offset snap to updates, following the source's static Motion properties rather than introducing a spring. Callback errors preserve the source update ordering and reach Angular ErrorHandler. The native controller supports plain callback consumers and zoneless change detection.

Native cancellation, replacement and disposal release drag listeners and animation frames without a completion callback. This deliberately repairs the React source's absent pointer-cancel/unmount drag cleanup. Disposal inside a callback cannot enqueue another frame. Disabled state follows the source tabindex and event guards; it does not invent aria-disabled. No accessibility-conformance or physical-device claim is made.

Focused packaged/controller contracts pass. Paired desktop/mobile behavior, settled geometry (within 1 px), typography/colors and rendered screenshots pass. Browser and completed-batch baseline results are recorded in [batch 40 evidence](batch-40-integration.md).

The integrated baseline's hosted follow-up restores the source dark gain card, `Master Output Gain` label and interaction caption. Native circle paint and controller behavior already match; this change supplies the missing example framing and data. See `hosted-qa.md` for current keyboard/wheel and settled style checks, separately from complete animation/raster acceptance.

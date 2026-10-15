# Typewriter Button: Angular / React parity

React reference: `src/components/ui/TypewriterButton.tsx`. Native authored port: `scripts/angular-typewriter-button.ts`, with scoped styling and controller in `packages/angular/src/typewriter-button-*`.

## API and behavior

Replaced the generic async action/status UI with the source component. Required Angular `text` maps to React's required string `children`; arbitrary projected rich content is deliberately excluded because the source accepts only a string. Inputs include `charDuration` (75), `soundEnabled` (false), `soundVolume` (0.25), `variant` (primary), `autoStart` (false), `onComplete`, `onClick`, `disabled`, native `type` and `className`. Omitted `type` defaults to button; explicitly undefined removes the attribute and lets HTML default to submit, matching the source props spread. Exported `TypewriterButtonVariant` and `TypewriterButtonCallback`. Optional undefined values restore source defaults. Omitted `aria-label` defaults to full text; a supplied string overrides it and explicitly undefined removes it, matching the source props spread.

`<button kitTypewriterButton>` supports native HTML attributes, Angular event bindings, form ownership and element references. `<kit-typewriter-button text="...">` provides a convenience wrapper with an inner native button. The `onClick` callback input runs only on clicks accepted by the typing guard, matching the source internal handler. Raw Angular `(click)` bindings and native parent/form/document listeners receive every DOM click, including repeated clicks during typing; the guard never stops bubbling. Native form defaults remain intact while the component callback is suppressed.

Typing starts on click, keyboard activation or auto-start, with a 30ms initial delay, one character per `charDuration`, and completion one interval after the final character appears. While typing, a 6 × 14px cursor with 2px left margin blinks every 500ms. Repeated clicks do not restart typing or invoke click callbacks. Hover scales the resting button to 1.02 and translates it up 1px; hover does not start typing. Typing suppresses hover/tap transforms. Spring constants match the React 380/30/0.5 reference. A held pointer retains tap scale outside the button until release; touch does not create hover, non-primary touches are ignored, held Enter/blur follow Motion’s keyboard press behavior, and window capture pointer-up/cancel releases a held tap even when the event target is outside the button. Primary-pointer filtering follows Motion’s mouse/nonmouse rule.

All three variants use the source fixed colors in both themes. Exact native button metrics, border, shadow, padding, font, minimum width, token-based radius, disabled opacity/cursor, focus ring and real color transitions match. Shared native package styles exclude this component from unrelated generic focus/minimum-width and reduced-motion overrides. The source continues typing and blinking under reduced motion; Angular follows the actual source behavior.

Optional Web Audio uses the same 30ms decaying noise, 1800Hz bandpass filter/Q=3, gain `soundVolume * 0.4`, exponential ramp to 0.001 and 60ms context close. Unsupported or blocked audio does not interrupt typing. Destruction clears typing and audio timers, closes live contexts, cancels animations and removes event listeners.

## Source quirks retained

- Changing the text prop updates the full accessible label immediately but retains the initial displayed label until typing starts.
- Updating any typing dependency during an active run clears its scheduled timer while retaining the active typing flag/cursor. Subsequent clicks remain suppressed. Angular reproduces this interruption behavior; React was unchanged.
- Reduced-motion metadata suggests optional suppression, but the source implements no suppression; tests follow the implementation.

The docs preview now matches the two React examples (`npx kit-ui add button`, `git push origin main`) with sound enabled and character durations 65/50ms. The old generic action failure/cancellation regression now targets the unchanged Pull to Refresh demo, which exposes that generic async API after the batch-20 Liquid Ripple port. Batch regression remains unchanged. This avoids testing unrelated callback/status controls against a string-typing component.

## Validation

- 32 broad browser checks pass (28 component checks and four existing async/batch regressions); eight focused held-pointer/touch/keyboard edge checks pass after the final motion refinements, and eight explicit aria-label/type override checks pass after the final API refinements. Final package contract and all four compiler matrices were rerun after those API refinements.
- Desktop/mobile actual React versus built native Angular comparisons, with light/dark themes and mobile reduced motion: all variants, disabled and utility overrides, undefined defaults, typing timeline/cursor/completion, suppressed repeat clicks, keyboard, auto-start, dynamic dependency interruption, unmount, hover/focus, exact color transition properties/duration/timing, forms and docs preview content.
- Review fixes: 16 targeted callback/timeline/form checks pass after preserving native bubbling. Twenty final pointer/keyboard/bubbling checks pass after moving pointer ends to window capture and aligning the Motion primary-pointer filter; repeat-click callbacks remain guarded while form/parent/document each receive both clicks.
- Synthesized audio spy checks buffer geometry, gain/ramp values, start and closed contexts; blocked-audio constructor checks graceful completion. No external audio assets.
- Generic Pull to Refresh async failure/cancel/retry and batch selection regressions pass.
- Packaged contract covers required string text, defaults/undefined, native/custom selectors, arbitrary native HTML attributes, disabled/types, variants and initial-label prop-update behavior.
- Installed-tarball strict templates pass Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1; all existing scenarios retained, plus optional Typewriter inputs and required text consumers.
- TypeScript, lint and existing unit suite pass. Existing unrelated lint warnings remain.

React callback props map to callback inputs. The component `onClick` input is guarded; raw native `(click)` events preserve DOM bubbling independently. Native attributes use Angular bindings on the native attribute selector; React source is unchanged.

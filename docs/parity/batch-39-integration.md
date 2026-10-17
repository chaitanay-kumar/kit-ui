# Feature: Angular parity batch 39

- Outcome: replace generic collection ports with native Code Snippet Deck and Batch Gesture Tray source behavior.
- Scope: `code-snippet-deck`, `batch-gesture-tray`; no merge/deployment; AI Response deferred.
- Base: `feat/angular-parity-batch-39` from validated batch 38 `ced7820`; remote implementation remains `cfcfc68`.

## Acceptance criteria

- Deck: mount-only language/parameter defaults, first-snippet fallback independent of selected language, dynamic code generator, all three parameter types and retained values across prop replacement, exact blank-line/highlight/line-count behavior. Ordinary native buttons, conditional config, no invented tab semantics. Optimistic independent two-second copy resets on success/failure, source bubbling/root overrides, native timer cleanup. Source shared-layout tab spring and responsive presentation.
- Tray: required typed items/actions with template icons; callback presence owns selection even without controlled IDs. Same length-based select-all behavior including phantom/duplicate IDs. Selection and dismiss/Escape remain available during pending action; only action buttons disable. Capture original ID array, await action, call captured completion then clear through captured selection callback; action/completion/selection exceptions silently preserve appropriate state and always release loading. No invented cancellation, outside dismissal or failure alert. Ignore stale native continuations after destruction.
- Preserve initial/exit toolbar/check staging, interrupted spring transitions, hover/tap motion, themes and real reduced-motion runtime. Paired desktop/mobile geometry and interactions, clipboard fallback, async ordering/failure/disposal and native demo/package consumers. Full baseline once before batch handoff.

## Relevant files

- React: `src/components/ui/CodeSnippetDeck.tsx`, `BatchGestureTray.tsx`, clipboard and motion tokens; matching metadata.
- Angular: focused new authored definitions, types/lifecycle/motion/styles under `packages/angular/src/`; generator registration.
- Integration: demos, framework usage, strict consumers, tracked generated outputs.
- Evidence: focused package contracts, paired browser fixture/spec and component reports.

## Validation and handoff

- Changes: native source-contract deck/tray, typed APIs, live code generators, clipboard lifecycle, captured async execution, retained toolbar snapshots, template icons, spring presence/gestures, demos and usage recipes replace generic collections. Regenerated components/catalogs/maps/llms. Tab projection reuses the existing shared-layout controller with isolated identity. Signal effects drive toolbar presence in zoneless consumers.
- Checks: Node 22.23.3. `npm run build` passes component/Angular sync, APF/demo/tarball build and 289 SEO checks; `npm test` passes 117 tests; final lint passes with the same 34 warnings outside batch files; `git diff --check` passes. `npm run test:angular-package` passes strict Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 consumer/usage compilers. After private gesture/CSS refinements, renewed `npm run angular:build` and `node scripts/verify-parity-batch39.mjs` pass the final native implementation and source-download closure; exported API/usage contracts did not change, so the four-version matrix was not repeated for those refinements.
- Browser evidence: Edge desktop and Pixel 7. Main `npm run test:browser -- e2e/parity-batch39.spec.ts` passed 29/30 cases after correcting an icon-inclusive action-name locator. The mobile deck failure exposed a 1.84375px height difference from the config caption's line height; fixed it to source 14.6667px. Focused `-g 'settled|shared tab'` passes all 12 dark/light geometry and tab-motion cases. Gesture sampling then caught the row's extra CSS transition over its spring; matched the 200ms transition and pointer/keyboard/touch filters. Final `-g 'held Enter|settled|pointer spring'` passed 13/14 cases; the remaining source keyboard sample ran before Motion's keyboard listener was ready. Waiting two initial animation frames keeps the same press assertion and `-g 'held Enter'` passes 4/4. There are 40 unique passing scenarios across these runs, not a claimed single 40-case run. Paired 140/350/600ms pointer samples preserve the source delay; dark/light desktop/mobile screenshots and settled text/control geometry, typography, colors/radii pass.
- Source limits/adaptations: see [deck](code-snippet-deck.md) and [tray](batch-gesture-tray.md). No invented tab semantics, copy failure alert, outside-dismiss handler or action cancellation. Native disposal cancels timers/listeners/frames and suppresses stale action continuations; application promises continue. No general WCAG, physical-device or frame-by-frame equality claim.
- Tracker: 93/116 validated baselines; 75 merged and eighteen from batches 31-39 await review. 22 queued plus deferred AI Response remain.
- Remaining: integration review, prior callback/standards audits and final user QA. Preserve previous stashes and AI Response's deferred status. No merge/deployment performed.
- Next action: checkpoint batch 39 locally and continue the active goal with two simpler queued components on a separate branch.

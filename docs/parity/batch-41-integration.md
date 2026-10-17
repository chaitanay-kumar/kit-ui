# Feature: Angular parity batch 41

- Outcome: replace unrelated canvas modes with native Evil Eye and Nimbu Mirchi SVG charms and their source pointer-driven springs.
- Scope: `evil-eye`, `nimbu-mirchi`; AI Response remains deferred. Integration, merge/deployment and final user QA remain separate.
- Base: `feat/angular-parity-batch-41` from locally validated batch 40 `bdf8bc6`. Worktree clean at branch creation; remote implementation remains `cfcfc68`, remote batch 41 absent.

## Acceptance criteria

- Preserve complete source SVG geometry, gradients, fixed IDs, hierarchy, responsive sizing, theme styles, caption/default accessible image labels and forwarded root attributes/styles/events.
- Pointer normalization clamps both axes and ignores zero-size regions. Leave returns targets to zero. Match X 55/9/1.8 and Y 45/10/1.6 default springs, prop updates, secondary layer rotations, transform origins and lift. Preserve captured reduced-motion runtime behavior and dispose listeners/frames.
- Compare source/native desktop/mobile settled layout and SVG data, interactive motion and reduced preference, customization, cleanup, demos, source-download closure and strict package consumers. Run the completed-batch baseline once.

## Relevant files

- React: `src/components/ui/EvilEye.tsx`, `NimbuMirchi.tsx` and metadata. Complete sources, metadata and installed Motion follow-value/spring/SVG/reduced-motion runtime reviewed.
- Authoring: `scripts/angular-hanging-charms.ts`, two authored SVG art definitions, native `hanging-charm-motion.ts` / `hanging-charm.css`; both generic canvas registrations removed.
- Evidence: new batch 41 focused contracts and paired fixtures/spec; component reports after validation.

## Validation and handoff

- Changes: both native SVG charms and shared pointer pipeline replace generic canvas effects. Complete artwork and actual fill-box origins preserved; typed root overrides/callbacks, mount-only reduced preference, native cleanup, demos and usage recipes added. Regenerated component/catalog/framework outputs.
- Checks: initial `npm run angular:build`, `node scripts/verify-parity-batch41.mjs`, `npm test` (117) and lint (34 existing warnings) pass. Main `npm run test:browser -- e2e/parity-batch41.spec.ts` passes 30/30 desktop/mobile cases. Complete SVG attributes, light/dark responsive geometry, source origins, captions/root overrides, callback failures, mount-only preference, sampled/settled pointer motion and native demos pass. Desktop/mobile screenshot pairs inspected. Focused `-g 'real pointer'` passes all 4 cases, for 34 unique passing browser scenarios across the two runs. `npm run build` passes Angular/component regeneration, package/demo build, registry validation and 289 SEO checks. `npm run test:angular-package` passes strict Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 consumers: all 116 selectors and usage recipes compile with each installed compiler. Final lint still reports the same 34 existing warnings. `git diff --check` passes.
- Tracker: 97/116 validated baselines; 75 merged and twenty-two from batches 31-41 await review. 18 queued plus deferred AI Response remain.
- Remaining: integration review, prior callback/standards audits and final user QA. Existing stashes preserved; no merge/deployment performed. Component reports record source limitations and native lifecycle behavior.
- Next action: checkpoint batch 41 locally and continue Command Menu / Spotlight Search as batch 42 under the active goal.

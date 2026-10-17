# Feature: Angular parity batch 43

- Outcome: replace generic Angular approximations with native Drag to Confirm and Smart Comparison source contracts.
- Scope: `drag-to-confirm`, `smart-comparison`; preserve deferred AI Response and existing work. Integration review, merge/deployment and final user QA remain separate.
- Base: `feat/angular-parity-batch-43` from locally validated batch 42 `2045536`. Clean worktree at branch creation; remote implementation confirmed `cfcfc68`, remote batch 43 absent.

## Acceptance criteria

- Drag: source controlled/internal confirmation ownership, actual defaults/action/variant/size mappings, custom idle/confirmed content, measured drag constraints, confirmation/reset callback ordering and failures, haptics, captured auto-reset lifecycle, disabled and reduced-motion runtime. Verify actual source keyboard/default behavior and disposal without substituting a range or generic confirmation button.
- Comparison: source plan/category/feature contracts, mount-only selected-plan fallback, search/difference filters, category collapse, active tooltip and CTA callback behavior. Preserve React-node values using native content equivalents and record source JSON comparison semantics. Verify replacement/empty data, responsive layout, source glyphs/themes and actual keyboard/accessibility behavior.
- Use authored definitions and native helpers/styles; regenerate tracked outputs. Add paired desktop/mobile behavior/geometry/motion, consuming demos/recipes, source downloads and strict inputs/types. Run focused contracts during implementation and the completed-batch baseline once.

## Relevant files

- React: `src/components/ui/DragToConfirm.tsx`, `SmartComparison.tsx` and metadata. Public types/defaults and initial state/filter logic reviewed; remaining implementation and runtime dependencies next.
- Authoring: Drag's generic definition is in `scripts/generate-angular-ports.ts`; Comparison is in its imported `scripts/angular-complex-ports.ts`. Replace authored definitions rather than editing generated component files.
- Integration/evidence: new batch 43 demos, recipes, focused contracts, paired fixtures/spec and component reports after validation.

## Validation and handoff

- Changes: no batch 43 implementation changes yet. Batch 42 checkpoint `2045536` passes 50 unique browser scenarios across main/focused runs, packaged contracts, 117 unit tests, lint with 34 existing warnings, production/289 SEO checks, final Angular CSS/demo build and four strict consumer compilers including explicit optional fields/types.
- Checks: status, remote refs and preserved stashes confirmed. Tracker remains 99/116, with 16 queued plus deferred AI Response.
- Remaining: finish source/metadata/runtime review, implement native ports, regenerate, validate and report.
- Next action: read the remaining drag gesture/reset implementation and comparison rendering before authoring their native contracts.

# Feature: integrate completed Angular parity batches 31–42

- Outcome: publish the 24 locally validated component baselines to the implementation branch.
- Scope: completed batches 31–42 and the two previously recorded integration audits. Batch 43 planning is preserved on its own branch; AI Response remains deferred.
- Base: `origin/feat/kit-ui-library` at `cfcfc68`; completed stack ends at `2045536`.

## Acceptance criteria

- Preserve local work and both existing stashes; inspect remote PRs and merge completed relevant work after validation.
- Renew older inline fixtures in standards mode, with viewport metadata.
- Preserve false-return, exception, explicit cancellation and callback receiver semantics for audited direct button bindings.
- Run the completed-library baseline and affected browser/package checks; record actual results before merging.

## Relevant files

- Authored: batches 31–42 files and their linked component reports; six `scripts/angular-*.ts` definitions for Book Call Button, Split Button, Notification Bell, Payment Status, Profile Card and Peek Card.
- Generated: Angular components and source downloads regenerated using `angular:build` and `component:sync`.
- Evidence: `scripts/verify-integration-callbacks.mjs`, renewed `e2e/parity-batch6.spec.ts` through `parity-batch19.spec.ts`, and paired batch 19 callback scenarios.

## Validation and handoff

- Changes: audited direct optional callback expressions now discard return values, report exceptions without implicit event cancellation, and preserve explicit cancellation. Peek action receiver and Split option failure ordering remain intact. Inline fixtures 6–19 have standard doctype and viewport headers; later standalone HTML fixtures already had both.
- Checks: `npm run build` passes including registry validation and 289 SEO checks; final `npm run angular:build` and `npm run component:sync` pass. `npm test`: 117 tests pass. `npm run lint`: passes with 34 existing warnings. `node scripts/verify-integration-callbacks.mjs`: 25 scenarios pass. `npm run test:angular-package`: Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 each install the tarball and strictly compile all 116 selectors and consuming recipes.
- Browser evidence: `npm run test:browser -- e2e/parity-batch6.spec.ts ... e2e/parity-batch19.spec.ts` initially produced 223 passes and one React notification-stack dismissal failure. The test clicked a retained exiting button; its assertion now also waits for the remaining dismiss-button count before the next click. The complete batch 13 rerun passes all 16 desktop/mobile cases. Batches 7–9 were separately renewed after their final header correction: 48 passes. This establishes passing coverage for all 224 unique scenarios across the main/focused runs, rather than claiming a single clean 224-case run. The dismissal case also passes 12 repetitions: both frameworks and both projects, with `--repeat-each=3`.
- Publication: [PR #26](https://github.com/chaitanay-kumar/kit-ui/pull/26) targets `feat/kit-ui-library`. Registry CI passed the implementation/audit commit; the final evidence commit must also pass CI before merge. Batch 43 planning is backed up on `feat/angular-parity-batch-43`; both pre-existing stashes remain preserved, not applied over the completed work.
- Remaining differences: 16 queued components and deferred AI Response remain outside these completed baselines; per-component reports retain their validation limits. No physical-device, cross-browser or full accessibility certification is claimed.
- Next action: continue batch 43 from the updated implementation base after PR merge and remote verification.

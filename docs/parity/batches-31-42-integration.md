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
- Checks: full build passes including registry validation and 289 SEO checks; 117 unit tests pass; lint passes with existing warnings. Final generated-artifact, callback, browser and strict consumer checks are in progress.
- Remaining: complete checks, review final diff, push integration branch, create and merge its PR, verify remote CI and merged refs.
- Next action: finish validation before publishing the completed stack.

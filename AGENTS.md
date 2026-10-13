# Working in Kit UI

Native React and Angular component catalog. Implementation base: `feat/kit-ui-library`; `main` currently contains repository documentation. Confirm remote refs before starting; preserve existing work.

## Keep feature context small

- Start with `git status --short`, the task brief, and the relevant row in [the workflow map](docs/FEATURE_WORKFLOW.md). Read only the files needed for that task.
- Find paths with `rg --files` and symbols with bounded `rg -n` searches. Read targeted ranges of large files rather than entire catalogs, generators, or detail pages.
- Treat generated JSON, bundles, source downloads, screenshots, lockfiles, and historical reports as on-demand evidence. Read authored sources first; do not load generated copies of the same code into context.
- For parity work, read the target component's React source/types, Angular authoring definition, and `docs/parity/<id>.md` if present. Consult `docs/ANGULAR_REACT_PARITY.md` for queue/status; catalog coverage alone does not prove parity.
- Keep one focused feature brief using [the template](docs/templates/FEATURE_BRIEF.md). Before handing off, record changed files, checks/results, unresolved issues, and the next action. Update it instead of duplicating conversation history.
- Use concise command output and diff summaries first. Inspect full patches/logs only where needed. Never truncate away a failure; retain its relevant error and reproduction command.

## Implementation and verification

- React source/metadata: `src/components/ui/`. Card previews: `src/components/registry/previews/items/`. Detail demos: `src/components/docs/ComponentDetailPage.tsx` and `KitDemos.tsx`.
- Angular generated ports: locate the ID in `scripts/generate-angular-ports.ts`, then follow its imported `scripts/angular-*.ts` definition or `scripts/angular-complex-ports.ts`. Edit authored definitions, not generated component files. Original authored components remain in `packages/angular/src/`; check the generated header first.
- Regenerate tracked outputs when their source changes; keep ignored build artifacts out of commits. See CONTRIBUTING.md for generator ownership and full contribution requirements.
- Run focused behavior checks during iteration; run the required component/library baseline before handoff. See the workflow map. Token savings must not weaken assertions, accessibility, native Angular behavior, or React/Angular coverage.
- React defines parity contracts. Preserve cancellation, failure recovery, keyboard access, reduced motion, and disposal. Record actual validation and remaining differences.
- Keep scope focused. Do not merge or deploy another contributor's changes without maintainer review. Never commit secrets or unrelated work.

# Feature workflow with focused context

Use this map to choose files before reading code. [CONTRIBUTING.md](../CONTRIBUTING.md) remains the full contribution guide. The root [AGENTS.md](../AGENTS.md) is the short entrypoint for coding agents.

## Start a task

1. Check working-tree changes and fetch the remote. Compare the current branch with the implementation base, currently `origin/feat/kit-ui-library`. Create a topic branch from the intended base without overwriting local work.
2. Write the requested outcome and observable acceptance criteria using [the feature brief](templates/FEATURE_BRIEF.md). For a small fix, the same fields can live in the issue or PR; a separate file is optional.
3. Select the relevant row below. Locate the component ID or symbol, read its implementation and nearest useful test, then expand context only when dependencies require it.
4. Implement, run focused checks, and regenerate affected outputs. Inspect authored diffs first and generated diffs separately for unintended churn.
5. Run the required final checks, update the brief/report, and describe the result and actual validation in the PR.

## File map

| Task | Start here | Expand only as needed |
| --- | --- | --- |
| React behavior/API | `src/components/ui/<Component>.tsx` and matching `.meta.ts` (or component folder) | Closest unit test; `src/lib/` utilities imported by that component |
| Card preview | `src/components/registry/previews/items/<id>.tsx` | Preview registry registration; `src/components/common/ComponentPreviewRenderer.tsx` |
| Detail demo | Search component name/ID in `src/components/docs/ComponentDetailPage.tsx` and `KitDemos.tsx` | Imported demo helpers; framework integration |
| Angular parity | Target React implementation; `docs/parity/<id>.md`; ID/import in `scripts/generate-angular-ports.ts` | Imported `scripts/angular-*.ts` or `scripts/angular-complex-ports.ts`; shared controller/styles only when used |
| Original authored Angular component | `packages/angular/src/<id>.component.ts` (check generated header) | `public-api.ts`, `src/lib/framework/angular-catalog.ts` |
| Angular demo/integration | `packages/angular-demo/src/demo.component.ts`; `src/components/angular/`; `src/lib/framework/` | `docs/ANGULAR_CATALOG.md` for contracts |
| Registry/source download | `scripts/generate-registry.ts`; target metadata | `scripts/validate-registry.ts`; inspect the affected generated entry after sync |
| Routing/hosting/SEO | Relevant module under `src/lib/`; `.github/workflows/pages.yml` | `docs/HOSTING.md` or `docs/SEO_GUIDE.md`, depending on scope |
| Branding | `docs/BRAND.md` | Only the assets and callers affected |

Avoid reading all of `public/source/`, `registry.json`, generated Angular catalogs, screenshot directories, or historical batch reports to understand one component. These remain available for checking emitted output or specific evidence.

## Validation by scope

| Scope | During iteration | Before handoff |
| --- | --- | --- |
| Documentation only | Verify paths, links, commands, and consistency | Review diff and `git diff --check`; no application rebuild required |
| Component/library | Relevant unit test via `npm test -- <test-path>`; relevant Playwright spec via `npm run test:browser -- <spec-path>` | CONTRIBUTING baseline: `component:sync`, `angular:sync`, `lint`, `npm test`, `build`, `test:angular-package` |
| Angular parity | Relevant browser spec; existing `test:<component>` package contract when available | Component/library baseline plus affected package contract checks after build; rendered evidence and differences in the component report |
| Shared controllers, styles, generators, or framework routing | Tests for affected consumers and framework paths | Broader affected behavior coverage and component/library baseline; required CI checks still apply |

Commands in the table are npm scripts unless written in full. Check `package.json` for exact contract script names: some use shorter aliases such as `test:data-table` or `test:prompt-composer`. Package contract checks need current build artifacts. Rebuild Angular previews before browser validation after Angular source changes; a reused development server can otherwise show stale bundles. Do not rerun passed checks unless later edits or unresolved concerns invalidate their results.

## Resume without rediscovery

Keep a brief handoff containing the base commit, acceptance criteria, authored file paths, generated outputs, exact check commands/results, and next action. Link a parity report rather than copying it. Record any shared-controller impact and remaining differences. Keep queue status in `ANGULAR_REACT_PARITY.md`; update counts from evidence rather than repeating a baseline count in new guides.

These conventions reduce repeated reading and repeated explanations. They do not establish a measured percentage of token savings.

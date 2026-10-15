# Contributing to Kit UI

Contributions can improve components, accessibility, framework integration, documentation, or development tooling. Start with the [live catalog](https://chaitanay-kumar.github.io/kit-ui/) and describe the behavior you want to change.

The implementation currently lives on `feat/kit-ui-library`; `main` carries the repository documentation until integration. Base code changes and pull requests on the implementation branch for now. Do not merge or deploy another contributor's changes without maintainer review.

## Set up a contribution

For a focused feature or AI-assisted change, start with the [feature workflow and file map](docs/FEATURE_WORKFLOW.md). Coding agents should use [AGENTS.md](AGENTS.md) as their short entrypoint. Capture scope, acceptance criteria, relevant files, and validation using the optional [feature brief](docs/templates/FEATURE_BRIEF.md); read deeper reference guides only when the task needs them. The validation and review requirements below still apply.

Use Node 22.22.3+ within Node 22, Node 24.15+ within Node 24, or Node 26+, and npm. CI uses Node 22. Clone your fork's implementation branch:

```sh
git clone --branch feat/kit-ui-library https://github.com/YOUR-USERNAME/kit-ui.git
cd kit-ui
git remote add upstream https://github.com/chaitanay-kumar/kit-ui.git
git switch -c fix/describe-your-change
npm ci
npm run dev
```

If your fork does not include the implementation branch, fetch it from upstream before creating your working branch. Maintainers working directly in the destination repository can clone that repository instead of a fork.

Open http://localhost:5173. `npm run dev` runs `predev` first, building Angular packages and previews before Vite starts. The generated artifacts are required for Angular frames and source downloads. Run `npm run angular:build` again after changing Angular library or demo source; changing generated library files alone does not rebuild a running iframe bundle.

Do not commit credentials, personal tokens, local environment files, dependency folders, logs, browser traces, or build artifacts. Use `npm ci` for a reproducible install. Change dependencies and the lockfile together only when the contribution needs them.

## Report a bug or propose a component

Include the component name and URL, React or Angular selection, reproduction steps, expected/actual behavior, and browser/device details. Mention theme, viewport, reduced-motion settings, and keyboard or touch behavior when relevant. For package issues, include Angular/TypeScript versions and a minimal consumer example without secrets.

For a new component, explain its interaction and application use case, proposed inputs/outputs, applicable states, and how keyboard and touch users complete the same action. Check the catalog for overlapping components first. Describe any external service or transport the consumer must supply.

## Design and interaction expectations

Use the established theme tokens and component patterns. The Kit Fox is the project mascot. Preserve Kit UI naming and independent attribution.

- Provide visible focus, semantic controls, labels, and keyboard alternatives to pointer gestures.
- Respect reduced motion and light/dark themes. Check small screens, long text, and empty content.
- Cover applicable resting, focus/hover, interaction, pending, success/failure, settled, and disabled states.
- Define cancellation, retry, and stale-request behavior for async actions. Preserve useful drafts and selections on failure.
- Clean up timers, observers, event listeners, animation frames, and requests on disposal.
- Keep application authentication, storage, AI, payments, and bookings outside reusable presentation components. Demo simulations must be labeled.

Accessibility notes should describe implemented behavior and validation. Do not claim WCAG conformance, browser compatibility, or visual parity without evidence.

## Add or change a React component

1. Scaffold a new component with `npm run component:new -- AuroraCard`. This creates `src/components/ui/AuroraCard.tsx` and `AuroraCard.meta.ts`.
2. Implement the component and export its public TypeScript types. Follow an existing component with a similar interaction, and reuse shared utilities/styles where appropriate.
3. Complete the `KitUIComponentMeta` metadata: title, description, category, props, usage, features, and concrete accessibility notes. Ensure usage imports match the files consumers receive.
4. Add a working preview and detail demo. Check `src/components/common/ComponentPreviewRenderer.tsx`, `src/components/docs/ComponentDetailPage.tsx`, and `src/components/docs/KitDemos.tsx` for the existing registration patterns. Scaffolding and metadata discovery do not create every interactive demo automatically.
5. Run `npm run component:sync` to generate source JSON, registry/catalog entries, sitemap, robots.txt, and llms.txt, then validate the registry.
6. Add the Angular counterpart and demo when expanding the shared catalog. Both framework catalogs currently cover the same 116 IDs; do not bypass the Angular coverage guard to make a new React-only entry pass.

For a multi-file component, use a folder under `src/components/ui/` with one unambiguous primary `.tsx` entry, `meta.ts` or matching component metadata, and its local helpers/styles. The generator discovers companion files. Inspect the resulting registry entry to confirm required files and imports are present; keep unrelated files out of that folder.

The registry validator checks paths and metadata/dependencies. It does not replace interaction tests, visual inspection, TypeScript checks, or a production build.

## Add or change an Angular component

Angular components are native standalone implementations; do not wrap a React preview and present it as an Angular library component. The package builds with Angular 20.3 and supports Angular 20, 21, and 22. Avoid APIs unavailable in the supported baseline.

There are two authoring paths:

| Area | Edit these sources |
| --- | --- |
| Eight original Kit ports | Their authored files in `packages/angular/src/`; exports before the generated marker in `public-api.ts`; original entries in `src/lib/framework/angular-catalog.ts`; corresponding demo cases |
| 108 additional catalog ports | Authored templates/API definitions in `scripts/generate-angular-ports.ts` and `scripts/angular-complex-ports.ts` |
| Shared native behavior | `packages/angular/src/port-controllers.ts`, `port-canvas.ts`, and `port-types.ts` |
| Shared native styling | `packages/angular/src/ports.css` and `src/lib/kit-controls.css`, as applicable |
| Demo application | `packages/angular-demo/src/demo.component.ts` and demo styles/bootstrap |
| Website integration | `src/components/angular/` and `src/lib/framework/` |

Run these commands after changing authored definitions:

```sh
npm run component:sync
npm run angular:sync
npm run angular:build
npm run test:angular-package
```

The first synchronization ensures Angular's coverage comparison reads the current React catalog. `angular:sync` generates the additional component files, export block, package/API catalogs, and demo map. Edit the authored definitions rather than generated component files, which will be overwritten. Coverage checks must still reject missing or duplicate IDs; update count-dependent documentation/tests deliberately when expanding the catalog.

`angular:build` also generates the Angular Package Format library, preview bundles, complete source JSON with dependencies, and downloadable tarball. Add native inputs/models/outputs and usage documentation, extend the demo's data or handler configuration when needed, and verify emitted API metadata matches the implementation.

Preserve zone-based and zoneless consumer compatibility. Signal models currently provide forms integration; a future `ControlValueAccessor` addition needs its own implementation and consumer validation. Document API and rendering differences from React rather than implying pixel or prop parity. See [Angular contracts](https://github.com/chaitanay-kumar/kit-ui/blob/feat/kit-ui-library/docs/ANGULAR_CATALOG.md).

## Generated files and build artifacts

| Output | Source or command |
| --- | --- |
| `registry.json`, `src/components/registry/*`, `public/source/*` | React source/metadata; `npm run component:sync` |
| `public/sitemap.xml`, `robots.txt`, `llms.txt` | Registry/SEO generators and the configured site URL |
| Generated Angular components, export block, `packages/angular/catalog.json`, `src/lib/framework/angular-ports.ts`, demo `ports.ts` | Authored Angular generator definitions; `npm run angular:sync` |
| `packages/angular/dist`, demo `.generated`, `public/angular-demo`, `public/angular-source`, `public/downloads`, root `dist` | Build artifacts; regenerate rather than commit |

Commit tracked generated outputs with their source changes. Leave ignored build artifacts out of commits. CI regenerates React and Angular catalogs and fails if tracked outputs are out of sync.

Use local defaults when committing generated SEO files. Public-site builds intentionally regenerate these with a hosted URL; do not accidentally commit deployment-specific generator changes as component changes. To restore local outputs, clear hosted environment overrides and rerun `npm run component:sync`.

## Validate your change

During component work, run the relevant unit, browser, and package contract checks only. Run the following component/library baseline once before merging the completed batch, or when a shared controller, style, generator, or framework route creates a concrete wider risk:

```sh
npm run component:sync
npm run angular:sync
npm run lint
npm test
npm run build
npm run test:angular-package
```

The package consumer check needs the tarball created by the build. It installs the same artifact in separate Angular 20.0, 20.3, 21, and 22 environments with compatible TypeScript compilers and strict templates. This is stronger than compiling only with the repository's own compiler.

Install Chromium once and run browser checks:

```sh
npx playwright install chromium
npm run test:browser
```

On Windows with Microsoft Edge installed:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:browser
```

Playwright uses desktop and mobile emulation, starts a development server if needed, and reuses an existing local server. Ensure that server and its Angular bundles reflect your current source. Examples of focused checks:

```sh
npm run test:browser -- e2e/framework-sidebar.spec.ts
npm run test:browser -- e2e/angular-catalog.spec.ts
```

Test meaningful behavior: keyboard focus/activation, cancellation and retry, failure recovery, disabled states, disposal, and layout containment. Use physical devices or additional browsers when a change depends on behavior emulation cannot establish. Documentation-only changes generally need link, command, and content verification rather than another full application test run.

The current baseline passes 117 unit tests and 289 SEO checks, with 21 inherited lint warnings. Avoid adding warnings, and distinguish existing failures or limitations from regressions in your change. Do not replace a failing behavioral assertion with a weaker check just to get a passing run.

## GitHub Pages and base paths

The public website is https://chaitanay-kumar.github.io/kit-ui/. `.github/workflows/pages.yml` builds and deploys on pushes to the implementation branch and `main` when the workflow is present there. The `github-pages` environment allows those deployment branches. Fork contributors do not need to enable Pages to develop or open a PR.

Use `withBasePath` for local public URLs and navigation links; use `stripBasePath` when interpreting browser paths. Root-relative `/source`, `/angular-demo`, `/downloads`, or asset paths must work under both `/` locally and `/kit-ui/` on Pages. Keep framework query parameters intact. Component routes have generated directory indexes so refreshed deep links work with static hosting.

The workflow supplies `VITE_BASE_PATH` and `VITE_SITE_URL`, runs the full build, then `node scripts/prepare-pages.mjs`. The preparation step fixes manifest paths, creates `.nojekyll`, and adds a static 404 page. It uses GitHub's short-lived deployment credentials; never add a personal token to source or logs.

`e2e/pages.spec.ts` is opt-in through `PAGES_PREVIEW_URL` and expects a production artifact mounted at `/kit-ui/` or the deployed website. For example, to check the public site in PowerShell:

```powershell
$env:PAGES_PREVIEW_URL = 'https://chaitanay-kumar.github.io'
npm run test:browser -- e2e/pages.spec.ts
```

Do not publish a contributor's work to the live environment as a substitute for reviewing it. See [hosting operations](https://github.com/chaitanay-kumar/kit-ui/blob/feat/kit-ui-library/docs/HOSTING.md) for reproducing the Pages artifact.

## Open a pull request

Push your topic branch to your fork and open a PR against `feat/kit-ui-library` until the implementation is integrated into `main`. Keep the change focused and preserve unrelated work. For the description, include:

- The user-visible problem and resulting behavior.
- Which framework(s), components, or generated outputs changed.
- Checks actually run, their results, and relevant screenshots or reproduction links for visual changes.
- Any new dependencies, API changes, migration steps, and remaining limitations.

Registry CI checks generated outputs, lint, TypeScript, unit tests, production build, and Angular consumers. Respond to CI failures and review feedback before requesting merge. Documentation and generated counts should describe the final implementation, not an abandoned approach.

## License and attribution

Contributions must be compatible with MIT licensing. Preserve the destination [LICENSE](LICENSE), the [upstream MIT notice](https://github.com/chaitanay-kumar/kit-ui/blob/feat/kit-ui-library/licenses/UPSTREAM-MIT.txt), and [attribution](https://github.com/chaitanay-kumar/kit-ui/blob/feat/kit-ui-library/ATTRIBUTION.md). Document the origin and license of any third-party assets or code you introduce.

Kit UI is independent of EasyUI. Product-facing copy and assets should use Kit UI and the Kit Fox; retain upstream names where required for legal attribution. Use the canonical `kit-ui` repository, `kit-ui-angular` package, `Kit*` exports, and `kit-*` selectors. Keep consumer examples synchronized with these identifiers. See the [brand guide](https://github.com/chaitanay-kumar/kit-ui/blob/feat/kit-ui-library/docs/BRAND.md) before changing integration identifiers. Do not imply affiliation or reuse an unlicensed mascot or asset.

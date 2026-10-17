# Feature: Angular parity batch 37

- Outcome: replace generic Angular collection ports with actual Expandable Data Row and Interactive Timeline behavior and presentation.
- Scope: `expandable-data-row`, `interactive-timeline`; integration stays for review and AI Response stays deferred.
- Base: `feat/angular-parity-batch-37` from pushed batch 36 `771103aaaf1d00488b95f7e28a8f25dad55f0cdf`. Clean worktree before branching; remote batch 37 absent. Implementation remote remains `cfcfc68`.
- Tracker: 89/116 recorded baselines, 75 merged and fourteen awaiting review; 26 queued plus deferred AI Response. Both batch-37 components are locally validated and await integration review.

## Acceptance criteria

- Data row: exact four defaults, mount-only expanded IDs, single/multiple expansion, loading skeleton and responsive desktop/mobile layouts. Metadata uses source truthy fallbacks; initials ignore optional avatar. Preserve action names and original row object payload.
- Copy email/hash stops propagation, gives optimistic two-second feedback independently of asynchronous clipboard success, and preserves source overlapping-reset behavior. Dispose native pending work safely; record source failure limitations.
- Timeline: mount-only selected ID and independently retained expanded set; selection occurs before onItemSelect, expansion after successful callback. Throwing callback leaves selection changed without expansion. collapsible=false retains initial expansion and still selects/calls back.
- Timeline source statuses, progress from last completed/in-progress item index, region/list/listitem roles, unique aria-controls, native status-node keyboard behavior, optional author/metrics/tag/hash and root HTML overrides. Do not invent keyboard activation on content divs or filtering.
- Preserve actual gentle 170/26/.9 height/opacity springs, snappy 380/30/.5 row chevrons, timeline 200ms chevrons, progress motion, interrupted exits and initial=false detail staging. Verify reduced motion against runtime rather than metadata claims.
- Paired desktop/mobile geometry, source behavior, focus/callback failures, empty/loading/replaced/mutated data, clipboard success/failure, bare/demo consumers, motion and disposal. Run full component/library baseline once before completed batch handoff.

## Relevant files

- Authored React: `src/components/ui/ExpandableDataRow.tsx`, `InteractiveTimeline.tsx` and matching metadata; clipboard helper in `src/lib/utils.ts`, tokens in `src/lib/motion-tokens.ts`.
- Angular: generic loops currently at `scripts/generate-angular-ports.ts`; replace with focused authored definitions and native helpers. Generated components have ownership headers and must not be edited directly.
- Generated/integration: Angular catalog/APF source closure, framework/demo ports, usage recipes, native demos, package compiler consumer and llms output as affected.
- Evidence: add component reports, focused package contracts and paired browser fixtures/specs.

## Validation and handoff

- Changes: authored native definitions, typed data/defaults, retained presence, chevron/progress motion, optimistic clipboard helpers, native demos and framework recipes replace both generic collection ports. Regenerated library components, catalogs and demo maps. Added paired fixtures, browser cases and packaged contracts. Fixed the native row font and timeline circle radius to match actual React output. Runtime sampling exposed a native reduced-motion shortcut absent in React; removed it and matched the timeline ease-out curve.
- Checks: remote refs fetched; implementation remains `cfcfc68`, remote batch 37 absent. Node 22.23.3 is available in the local npm cache (the shell defaults to unsupported Node 20). `npm run build` passes including component/Angular sync and 289 SEO checks; `npm test` passes 117 tests; final `npm run lint` passes with 34 warnings outside batch-37 files; `git diff --check` passes. After the motion correction, `npm run angular:build` and `node scripts/verify-parity-batch37.mjs` pass. Final `npm run test:angular-package` installs the rebuilt tarball and compiles all 116 selectors plus usage consumers with Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 strict templates. Desktop/mobile screenshot inspection and paired geometry/typography/color/radius checks pass.
- Browser evidence: with `PLAYWRIGHT_CHANNEL=msedge`, `npm run test:browser -- e2e/parity-batch37.spec.ts` passed 33 of the then-38 cases. Four failures were the test's incorrect aria-label assertion (React and Angular use title); one was a Vite reload during rebuild. The title assertion was corrected. The final focused command `npm run test:browser -- e2e/parity-batch37.spec.ts -g 'source chevron|data replacement|row defaults'` passed all 16 cases, covering those five failures and eight newly added reduced-preference cases. There are 46 unique passing cases across these runs, not a claimed single 46-case run. Earlier browser startup failed because bundled Chromium was absent; Edge resolved that. An overlapping initial Angular build failed with EBUSY; subsequent builds ran sequentially and passed. Screenshots remain ignored under `test-results/batch37-*.png`.
- Remaining scope: integration review, older standards-mode audit, older callback audit and final user QA. Preserve named stashes. AI work location remains unconfirmed; no AI code/refs changed. See the two component reports for source accessibility/reduced-motion/clipboard limitations and Angular API adaptations. There is no general WCAG, physical-device or frame-by-frame pixel-equality claim.
- Next action: review this uncommitted batch on `feat/angular-parity-batch-37` for integration; select the next two queued components with simpler components first. No commit, push, merge or deployment was performed during this resume.

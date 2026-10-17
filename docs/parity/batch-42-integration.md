# Feature: Angular parity batch 42

- Outcome: replace generic Liquid Command Palette wrappers with native Command Menu and Spotlight Search source contracts.
- Scope: `command-menu`, `spotlight-search`; preserve deferred AI Response and existing work. Integration review, merge/deployment and final user QA remain separate.
- Base: `feat/angular-parity-batch-42` from locally validated batch 41 `d9de3a4`. Clean worktree at branch creation; remote implementation confirmed `cfcfc68`, remote batch 42 absent.

## Acceptance criteria

- Command Menu: required controlled isOpen/onClose; complete catalog/document/action entries, source substring/category filtering, retained query/index across close, global keyboard ownership, focus and callback/clipboard/navigation ordering. Preserve source listbox/options and empty state; match fixed overlay, responsive placement, glyphs and spring/backdrop motion.
- Spotlight: controlled/uncontrolled open ownership, optional global shortcut and actual Escape propagation, 30ms focus/reset effect, custom/default items, description filtering and source query trimming behavior. Preserve action/onSelect/close ordering, including repeated close calls from default actions and failure recovery. Render source titles only; recentSearches/icon/shortcut/description declarations do not establish visible content.
- Match source springSnappy 380/30/.5 and gentle active highlight 170/26/.9, retained exits, interruption, themes, reduced-motion runtime and native disposal. Validate paired desktop/mobile behavior/geometry, consumers/demos, source downloads and one completed-batch baseline.

## Relevant files

- React: `src/components/ui/CommandMenu.tsx`, `SpotlightSearch.tsx`; both complete implementations reviewed. Confirm metadata/types and dependencies before implementing. Shared inputs: `src/components/registry/catalog-index.ts`, constants, clipboard and motion tokens.
- Authoring: generic shared loop near line 281 of `scripts/generate-angular-ports.ts`; replace with focused authored definitions, types/styles/controllers and actual source glyphs. Existing native shared-layout controller may support Spotlight highlight.
- Integration/evidence: new batch 42 demos, usage recipes, strict required inputs, focused contracts and paired fixtures/spec; component reports after validation.

## Validation and handoff

- Changes: both generic wrappers replaced with native source views, complete catalog/doc/actions, distinct controlled/internal state and key ownership, captured callbacks/visible exit snapshots, clipboard fallback, snappy panel/backdrop presence, gentle shared highlight, actual glyphs, demos, usage and typed exports. Native destruction cancels focus timers/listeners/frames. CSS follows actual font/radius/shadow/line-height output and permits caller utilities through the components layer.
- Baseline: Node 22.23.3. `npm run build` passes Angular/component regeneration, demo/APF/tarball build, registry validation and 289 SEO checks. `npm test` passes 117 tests; final lint passes with 34 existing warnings. After private CSS refinements, renewed `npm run angular:build` passes; exported APIs remain unchanged. `node scripts/verify-parity-batch42.mjs` passes item identity, filters, keyboard/default semantics, clipboard fallback, state ownership, callback binding/order/errors, frozen exit labels, replacement index and source-download dependencies. `git diff --check` passes.
- Strict consumers: `npm run test:angular-package` passes Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1 with each installed compiler. The renewed matrix also compiles explicit optional inputs, callbacks, custom item fields and exported CommandItem/SpotlightSearchItem types, alongside all 116 selectors and usage recipes.
- Browser: Edge desktop/Pixel 7. Main run passes 20/28; extended run passes 19/28; `-g 'geometry|retained exits'` passes 12/16; command geometry renewal passes 4/4; final `-g 'geometry|caller classes'` passes 10/10. All 50 unique scenarios pass across these runs, not a claimed single 50-case run. Corrected vertical Sliders geometry, Spotlight Inter Variable font/absent shadow, command 13.3333px badge/category line heights and source border colors. Transparent zero-size Tailwind shadow placeholders are normalized while visible shadows remain compared. Exit sampling stays inside one browser call to preserve the same intermediate-opacity assertions without interprocess delays. Final source/native desktop/mobile screenshots inspected; settled geometry, typography, colors/radii, glyphs, errors, clipboard/navigation, shortcuts, retained text/callbacks, reduced-motion presence, highlight interpolation/reversal, demos and class overrides pass.
- Tracker: 99/116 validated baselines; 75 merged and twenty-four from batches 31-42 await review. 16 queued plus deferred AI Response remain.
- Remaining: integration review, prior callback/standards audits and final user QA. Component reports record source accessibility/lifecycle limits; no physical-device, Safari/Firefox, exhaustive conformance or frame-by-frame equality claim. Existing stashes preserved; no merge/deployment performed.
- Next action: checkpoint batch 42 locally and continue Drag to Confirm / Smart Comparison as batch 43 under the active goal.

# Feature: Angular parity batch 35

- Outcome: Pricing and Stacked Cards follow actual React tier, callback, styling, responsive and scroll contracts.
- Scope: `pricing`, `stacked-cards`; integration remains for review, AI Response stays deferred.
- Base: `feat/angular-parity-batch-35` from pushed batch 34 `ac79022d34c27108adc38265b7a3814cb3e0cf85`; working tree clean before branching; remote implementation remains `cfcfc68`.
- Tracker: 85/116 baselines recorded; 30 queued plus AI Response remain. Batches 31-35 await integration review.

## Acceptance criteria

- Pricing: source Free/Pro objects and actual $129 Pro default (metadata incorrectly says $29), mixed string/object features with description ignored, optional heading fields, reverse without replaying positional card mounts, 1/2/auto grid, source callbacks/failure and root HTML/style overrides.
- Match 200/28/.85 entry springs and featured 50ms delay; source reduced-motion mount snapshot suppresses entry while CSS media suppresses shimmer. Source CTA hover/active scaling remains CSS-driven even with reduced motion. Reproduce static sheen/one-pass shimmer, theme/focus/border/shadow/typography and spacing.
- Stacked Cards: source four default story objects, optional headings, native section/articles/images/links, alt/href fallbacks and empty rendering; real sticky offsets (4.5rem + index*16), scroll range start-start/end-end, per-card scale clamp to 1-(total-index-1)*.075, responsive layout and root HTML/style forwarding.
- Verify actual scroll lifecycle, data replacement, disposal and source reduced-motion behavior (component has no reduced-motion hook despite metadata). Investigate installed useScroll ref/timeline behavior with empty or replaced containers before defining native equivalent.
- Paired native/React package/browser/bare/demo evidence and one completed-batch full baseline before recording progress.

## Implementation and evidence

- Reports: [Pricing](pricing.md), [Stacked Cards](stacked-cards.md). Authored definitions: `scripts/angular-pricing.ts`, `scripts/angular-stacked-cards.ts`; generator wiring in `angular-complex-ports.ts` and `generate-angular-ports.ts`.
- Native files: `pricing-card.ts`, `pricing-motion.ts`, `pricing-types.ts`, `pricing.css`, `stacked-cards-scroll.ts`, `stacked-cards-types.ts`, `stacked-cards.css`, and focused `native-root-bindings.ts`. No existing component uses the new helper.
- Consumer wiring: `packages/angular-demo/src/batch35-demos.ts`, `demo.component.ts`, Angular usage recipes and strict compiler consumers. Tracked generated outputs: both components, catalog, framework ports, demo ports and `public/llms.txt`. Source downloads include the full internal import/CSS closure; ignored builds/downloads/screenshots remain uncommitted.
- Focused contracts: `node scripts/verify-parity-batch35.mjs` passes after fresh APF build. Includes native runtime events, false callback return semantics, positional reversal, mutation/defaults, root style/attribute removal, source story fallbacks and empty/repopulation/disposal.
- Browser: `PLAYWRIGHT_CHANNEL=msedge node node_modules/@playwright/test/cli.js test e2e/parity-batch35.spec.ts e2e/parity-batch35-motion.spec.ts` passed 30 cases, followed by six added actual-demo/disposal cases. Renewed expanded Pricing geometry passed two more executions (overlapping cases): 36 distinct desktop/mobile cases overall. Fixtures use standards doctype/viewport; mobile uses Pixel 7 reduced motion. Entry samples compare disabled-WAAPI React interpolation against native; CSS shimmer is separately tested with real CSS animations and live media changes.
- Render evidence: geometry, typography, colors, borders, radius and Pricing shadows/line heights/price/divider compared; matched local SVG images and desktop screenshot review. Pricing light desktop and Stacked Cards desktop review image pairs have identical PNG hashes. Screenshot/sample artifacts are reproducible under ignored `test-results/`.
- Full baseline: `npm run build` passes Angular regeneration/APF/native demo build, component sync, TypeScript, production build, prerender and 289 SEO checks. `npm test` passes 117 tests; `npm run lint` passes with existing refresh warnings. `npm run test:angular-package` passes independent installed tarball compilers 20.0.0, 20.3.33, 21.2.25 and 22.2.1, all 116 selectors plus focused typed inputs and actual usage recipes.

## Differences and handoff

- Source Pro default is $129; actual catalog demo explicitly uses $29. Both are preserved. Source feature descriptions remain ignored. Entry honors the reduced-motion mount snapshot; CTA scale feedback remains source CSS behavior. Shimmer is one pass, not the metadata's claimed repeating gradient.
- Source Stacked Cards scales linearly with scrolling even under reduced motion. A populated -> empty -> repopulated React sequence retained a detached scroll target and stopped scaling; native detaches/rebinds and has a dedicated recovery test. This deliberate recovery difference is recorded for review.
- The catalog's global heading color gives source and native dark-card titles low contrast in the light theme. The reviewed source/native images match; this baseline does not claim full contrast conformance or fix the shared source styling contract.
- No integration/merge/deployment performed. Preserve named earlier integration-audit/batch-31 stashes, review branches 31-35, deferred AI Response, older standards-mode audit and final user QA follow-ups.
- Next action: push this completed batch, then start batch 36 (macOS Folder Cards + Story Cards) from it. Vite session 8136 remains available.

# Feature: Angular parity batch 21

- Outcome: native Meteors and Text Scramble Decoder follow their React implementations.
- Scope: `meteors` and `text-scramble-decoder`; React defines the contract.
- Base: `feat/angular-parity-batch-21`, `9fc1158`; batch 20 is pushed.

## Acceptance criteria

- Meteors preserves randomized distribution, configurable colors, timing and angle, projected content, and CSS reduced-motion behavior.
- Decoder preserves mount, hover and manual triggers, glyph cadence, readable accessible text, replay disabling, input interruption, live reduced-motion changes and disposal.
- Fresh generated artifacts compile and pass focused React/Angular browser comparisons and package checks.

## Relevant files

- React sources: `src/components/ui/Meteors.tsx`, `src/components/ui/TextScrambleDecoder.tsx`, unchanged.
- Authored Angular: `scripts/angular-meteors.ts`, `scripts/angular-text-scramble-decoder.ts`, both registered in `scripts/generate-angular-ports.ts`; component CSS in `packages/angular/src/`.
- Demos: `packages/angular-demo/src/batch21-demos.ts`, `demo.component.ts`.
- Generated: Angular components, catalog and framework/demo port metadata through `angular:sync`.
- Evidence: `e2e/parity-batch21.spec.ts`, `e2e/fixtures/parity-batch21-contract.tsx`, `e2e/fixtures/parity-batch21-bare.ts`, `playwright.batch21.config.ts`, `scripts/verify-parity-batch21.mjs`, `scripts/verify-angular-package.mjs`.

## Validation and handoff

- Changes: native CSS meteors and staged text decoder replace generic controls. Angular detail demos expose the source palette/count controls and manual decoder settings. Styling uses the source radius, emerald color, shadow, icon and focus tokens. Source React remains unchanged.
- Checks use Node 22.23.0 and `PLAYWRIGHT_CHANNEL=msedge`:
  - `npm run build`: passes Angular APF, standalone preview, tarball, component sync (116 entries), TypeScript, production build, prerender and 289 SEO checks. Existing font-resolution/bundle-size warnings remain.
  - `npm run angular:sync`: passes; 108 generated ports and 116 catalog components.
  - `npm run lint`: passes with inherited warnings; `npm test`: 117 tests in 14 files pass.
  - `node scripts/verify-parity-batch21.mjs`: passes packaged defaults, distribution stability, decoder completion, frame replacement/interruption, live reduced motion and disposal.
  - `npm run test:angular-package`: all 116 selectors plus dedicated batch-21 optional-input consumer compile with each installed Angular compiler: 20.0.0, 20.3.33, 21.2.25, 22.2.1.
  - `node node_modules/@playwright/test/cli.js test --config playwright.batch21.config.ts`: final combined run passes all 28 cases across React/Angular desktop and mobile, including active/settled styles, keyboard focus, no-Tailwind consumption and detail-demo controls.
  - Downloaded source and local CSS dependencies match authored/generated files after newline normalization. `git diff --check` passes.
- Framework mappings, preserved source quirks and validation limits: [Meteors](meteors.md), [Text Scramble Decoder](text-scramble-decoder.md). Random intermediate pixels, arbitrary HTML attribute forwarding, SSR/hydration, physical devices, other browsers and application screen-reader testing are outside the recorded validation.
- Next action: commit and push this validated batch, then continue the queue; integration remains for maintainer review in batch order.

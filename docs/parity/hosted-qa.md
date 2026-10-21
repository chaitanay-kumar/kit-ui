# Feature: Hosted React and Angular visual QA

- Outcome: inspect the deployed GitHub Pages experience after CI/CD, reproduce visible differences and fix confirmed defects.
- Scope: all 116 component routes, React and native Angular previews, light/dark themes and desktop/mobile viewports. Compare matching content and states; different demo data and animation frames require investigation before treating image differences as defects.
- Base: feat/kit-ui-library at 56fd72d6490af12e6f355d3a20c63aadc3225e4e; isolated branch feat/hosted-parity-qa.

## Acceptance criteria

- Confirm the deployed head passed Registry CI and Pages deployment before inspecting the public website.
- Capture route/preview failures, screenshots and comparable element geometry/styles. Review pixel differences with identical content and stable state.
- Fix reproduced differences in authored sources, regenerate affected outputs, run relevant checks and the required merge baseline, then publish and verify the deployed fix.
- Record actual coverage and remaining issues without calling a screenshot inventory exhaustive interaction or accessibility certification.

## Relevant files

- Authored: src/components/angular/AngularExperience.tsx, AngularPreview.tsx, target React components and their Angular authoring definitions.
- Evidence: scripts/qa-hosted-parity.mjs, scripts/qa-search-pixels.mjs, ignored logs/hosted-qa artifacts and this report.

## Validation and handoff

- Starting state: clean working tree, local implementation equals origin. Existing head's Registry CI 39509507199 and Pages deployment 39509507151 both passed.
- Changes under validation: native iframe base typography and form-control inheritance now follow the React showroom. Removed the unlayered h3 size that overrode Chat's heading. Corrected demo wrapper fonts for Animated Tabs, Small Floating Dock and Branching Submenu; Book Call Button now inherits control typography and uses the source's 31 px desktop label size.
- Hosted coverage: all four modes completed against deployed head 56fd72d: 116 unique component routes per mode, both frameworks, 928 framework screenshots and 464 pairs. Desktop is 1440 ? 1000 at DPR 1; mobile is Playwright Pixel 7, 412 ? 839 at DPR 2.625. All screenshots and result records are present; no main-document HTTP failures, preview bootstrap failures or page runtime exceptions were recorded. Initial artifact cleanup collisions were repaired, and captures now live under logs/hosted-qa. These captures are triage evidence, not 116 accepted pixel comparisons.
- Checks so far: 118 unit tests pass; lint passes with inherited warnings. Full build passes 289 SEO checks. The first strict typography regression exposed actual Book Call/Animated Tabs/Branching Submenu defects and a cold iframe timeout; fixes are pending an updated build and final rerun. Four-version package verification is running. Search raster comparisons retain image differences for review rather than asserting blanket pixel identity.
- Remaining review: Chat uses different sample conversations/content; Airport Matrix Clock close-button typography and Animated Number ticker line height are candidates for the next focused comparisons. Broader state/interaction and animation raster review remains. Initial-stage captures alone do not approve every component. Demo content and enclosing stage differences are recorded separately from same-state component raster comparisons.
- Next action: finish the current package check, rebuild the final fixes, rerun typography and relevant existing behavior checks, then publish and verify the deployment. Continue reviewing captures for the next QA fixes.

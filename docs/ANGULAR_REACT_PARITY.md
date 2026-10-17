# Angular React parity tracker

React is the source of truth for component appearance, interactions, data contracts, options and defaults. Angular implementations stay native; template projection and output events provide Angular equivalents for React nodes and callbacks. Catalog coverage does not establish parity.

Current progress: 99 components have recorded validated baselines across batches 1?42; 17 remain unvalidated. Batch 42 adds Command Menu and Spotlight Search, including distinct state/key ownership, actual catalog/actions, captured exit callbacks and source shared-highlight motion. See [batch 42 evidence](parity/batch-42-integration.md) and the [completed component list](parity/completed-components.md). Batches 4–30 were merged into `feat/kit-ui-library` at `cfcfc68`; Registry CI and Pages deployment passed. Batches 31?42 are published through [PR #26](https://github.com/chaitanay-kumar/kit-ui/pull/26); see the [integration evidence](parity/batches-31-42-integration.md) for renewed checks. Older component reports saying integration pending are historical handoffs.

User priority: finish simpler components first. AI Response remains deferred; its previously documented working copy must be located before resuming (see Pending work). Button is in [PR #6](https://github.com/chaitanay-kumar/kit-ui/pull/6). Neon Edge Button is in [PR #7](https://github.com/chaitanay-kumar/kit-ui/pull/7). Orbital Loading Ring is in [PR #8](https://github.com/chaitanay-kumar/kit-ui/pull/8). Spotlight Card is in [PR #9](https://github.com/chaitanay-kumar/kit-ui/pull/9). Morphing Icon is in [PR #10](https://github.com/chaitanay-kumar/kit-ui/pull/10). Work proceeds in batches of two, with focused component checks during implementation and one full baseline before batch merge. Batch 2 merged through [PR #19](https://github.com/chaitanay-kumar/kit-ui/pull/19); batch 3 merged through [PR #25](https://github.com/chaitanay-kumar/kit-ui/pull/25). Batch 4 and its stacked batch 5 are locally validated and await integration. The original inventory order remains below for tracking, not execution priority.

## Pending work

- Review and fix the remaining 17 components listed below: 16 queued and AI Response deferred in progress. Existing generated Angular coverage does not count as validated parity.
- Review batches 31-42 for integration. Batch 42 is locally validated; select the next two queued components with simpler components first.
- Integration audit: direct optional button callbacks in Book Call Button, Split Button, Notification Bell, Payment Status, Profile Card and Peek Card now preserve return-value/exception event-default semantics, explicit cancellation and nested callback receivers. Split option failures retain the open menu. See [integration evidence](parity/batches-31-42-integration.md); batch 36 separately covers Folder Cards, Story Cards, Pricing and Stacked Cards.
- Integration fixture audit: inline batches 6?19 now include standard doctype and viewport metadata; later standalone fixture HTML already includes both. Renewed desktop/mobile results are recorded in the [integration brief](parity/batches-31-42-integration.md). Batch 23 separately renewed batches 20?23.
- Keep AI Response deferred. No AI code/refs were changed. The previously documented `kit-ui-angular-response` / `feat/angular-ai-response-parity` working copy is not registered in this checkout, its audit is not here, and named Desktop sibling paths on C:/D: were not present when checked. Locate that prior work before resuming; do not substitute the generic generated port or claim the deferred work is validated.
- After all 116 components have validated baselines, the user will perform the full QA run. Address the resulting feedback before calling the overall parity effort complete.

No component PRs remained open after batch 3. Its completed feature branches/worktrees were removed. The implementation branch and unfinished AI Response work remain; the completed iOS Search Bar branch has been removed and local batch 4 plus stacked batch 5 await integration.

## Review requirements

- Compare the actual rendered React component and its public types before changing Angular.
- Match data contracts, option names, defaults, state changes, callbacks and content customization.
- Match layout, typography, colors, icons, responsive behavior and interaction feedback.
- Check keyboard operation, focus, disabled/loading/error/empty states, cleanup and reduced motion.
- Use the same demo data and exercise consuming applications, not only the documentation shell.
- Edit authored definitions and regenerate tracked catalogs, exports and source outputs.
- Record test results and remaining differences; mark a component validated only for the coverage recorded in its report.

## Component inventory

| Order | Component | ID | Status | Report |
| --- | --- | --- | --- | --- |
| 1 | Activity Feed | `activity-feed` | Validated baseline | [Review](parity/activity-feed.md) |
| 2 | Advanced Data Table | `advanced-data-table` | Validated baseline | [Review](parity/advanced-data-table.md) |
| 3 | AI Agent Activity | `ai-agent-activity` | Validated baseline | [Review](parity/ai-agent-activity.md) |
| 4 | AI Prompt Composer | `ai-prompt-composer` | Validated baseline | [Review](parity/ai-prompt-composer.md) |
| 5 | AI Response | `ai-response` | Deferred; prior working-copy location unconfirmed | Locate prior branch/audit before resuming |
| 6 | Airport Matrix Clock | `airport-matrix-clock` | Validated baseline | [Report](parity/airport-matrix-clock.md) |
| 7 | Animated File Upload | `animated-file-upload` | Queued | — |
| 8 | Animated Number Morph | `animated-number` | Validated baseline | [Report](parity/animated-number.md) |
| 9 | Animated Tabs | `animated-tabs` | Validated baseline | [Report](parity/animated-tabs.md) |
| 10 | Avatar Stack | `avatar-stack` | Validated baseline | [Report](parity/avatar-stack.md) |
| 11 | Batch Gesture Tray | `batch-gesture-tray` | Validated baseline | [Report](parity/batch-gesture-tray.md) |
| 12 | Book Call Button | `book-call-button` | Validated baseline | [Report](parity/book-call-button.md) |
| 13 | Branching Submenu | `branching-submenu` | Validated baseline | [Report](parity/branching-submenu.md) |
| 14 | Button | `button` | Validated baseline | [Review](parity/button.md) |
| 15 | Car Smoke Page Transition | `car-smoke-page-transition` | Queued | — |
| 16 | Chat | `chat` | Queued | — |
| 17 | Circular Orbit | `circular-orbit` | Validated baseline | [Evidence](parity/circular-orbit.md) |
| 18 | Code Snippet Deck | `code-snippet-deck` | Validated baseline | [Report](parity/code-snippet-deck.md) |
| 19 | Command Menu | `command-menu` | Validated baseline | [Report](parity/command-menu.md) |
| 20 | Cursor Follower | `cursor-follower` | Validated baseline | [Report](parity/cursor-follower.md) |
| 21 | Density Lens | `density-lens` | Validated baseline | [Evidence](parity/density-lens.md) |
| 22 | Dependency Trace | `dependency-trace` | Validated baseline | [Report](parity/dependency-trace.md) |
| 23 | Depth Corridor | `depth-corridor` | Validated baseline | [Report](parity/depth-corridor.md) |
| 24 | DirectionalTooltip | `directional-tooltip` | Validated baseline | [Report](parity/directional-tooltip.md) |
| 25 | Dot Field | `dot-field` | Validated baseline | [Evidence](parity/dot-field.md) |
| 26 | Dot Shader | `dot-shader` | Queued | — |
| 27 | Drag to Confirm | `drag-to-confirm` | Queued | — |
| 28 | DrawCheckbox | `draw-checkbox` | Validated baseline | [Report](parity/draw-checkbox.md) |
| 29 | Dynamic Island | `dynamic-island` | Queued | — |
| 30 | Elastic Sheet | `elastic-sheet` | Validated baseline | [Evidence](parity/elastic-sheet.md) |
| 31 | Evil Eye | `evil-eye` | Validated baseline | [Report](parity/evil-eye.md) |
| 32 | Expandable Data Row | `expandable-data-row` | Validated baseline | [Report](parity/expandable-data-row.md) |
| 33 | Expandable Search | `expandable-search` | Validated baseline | [Report](parity/expandable-search.md) |
| 34 | FAQ | `faq` | Validated baseline | [Report](parity/faq.md) |
| 35 | Floating Action Dock | `floating-action-dock` | Validated baseline | [Evidence](parity/floating-action-dock.md) |
| 36 | Focus Mode | `focus-mode` | Validated baseline | [Report](parity/focus-mode.md) |
| 37 | Form | `form` | Queued | — |
| 38 | Glass Navbar | `glass-navbar` | Validated baseline | [Report](parity/glass-navbar.md) |
| 39 | Glitch Text | `glitch-text` | Validated baseline | [Report](parity/glitch-text.md) |
| 40 | Glyph Matrix | `glyph-matrix` | Queued | — |
| 41 | Gooey Menu | `gooey-menu` | Validated baseline | [Report](parity/gooey-menu.md) |
| 42 | Gravity Particle Burst | `gravity-particle-burst` | Validated baseline | [Evidence](parity/gravity-particle-burst.md) |
| 43 | Hamburger Menu | `hamburger-menu` | Validated baseline | [Report](parity/hamburger-menu.md) |
| 44 | Hold-to-Confirm | `hold-to-confirm` | Validated baseline | [Report](parity/hold-to-confirm.md) |
| 45 | Interactive Data Card | `interactive-data-card` | Validated baseline | [Report](parity/interactive-data-card.md) |
| 46 | Interactive Timeline | `interactive-timeline` | Validated baseline | [Report](parity/interactive-timeline.md) |
| 47 | Intro Loader | `intro-loader` | Validated baseline | [Report](parity/intro-loader.md) |
| 48 | iOS-style Search Bar | `ios-search-bar` | Validated baseline | [Report](parity/ios-search-bar.md) |
| 49 | Liquid Command Palette | `liquid-command-palette` | Validated baseline | [Report](parity/liquid-command-palette.md) |
| 50 | Liquid Ripple Button | `liquid-ripple-button` | Validated baseline | [Report](parity/liquid-ripple-button.md) |
| 51 | Liquid Toggle | `liquid-toggle` | Validated baseline | [Report](parity/liquid-toggle.md) |
| 52 | Loader | `loader` | Validated baseline | [Review](parity/loader.md) |
| 53 | LockInput | `lock-input` | Validated baseline | [Report](parity/lock-input.md) |
| 54 | Login | `login` | Queued | — |
| 55 | macOS Folder Cards | `mac-os-folder-cards` | Validated baseline | [Report](parity/mac-os-folder-cards.md) |
| 56 | Magnetic Button | `magnetic-button` | Validated baseline | [Review](parity/magnetic-button.md) |
| 57 | Meteors | `meteors` | Validated baseline | [Evidence](parity/meteors.md) |
| 58 | Metric HUD | `metric-hud` | Validated baseline | [Report](parity/metric-hud.md) |
| 59 | Morphing Blob | `morphing-blob` | Validated baseline | [Evidence](parity/morphing-blob.md) |
| 60 | Morphing Button | `morphing-button` | Validated baseline | [Review](parity/morphing-button.md) |
| 61 | Morphing Dialog | `morphing-dialog` | Validated baseline | [Report](parity/morphing-dialog.md) |
| 62 | Morphing Icon | `morphing-icon` | Validated baseline | [Review](parity/morphing-icon.md) |
| 63 | Morphing Shape Loader | `morphing-shape-loader` | Validated baseline | [Report](parity/morphing-shape-loader.md) |
| 64 | Neon Edge Button | `neon-edge-button` | Validated baseline | [Review](parity/neon-edge-button.md) |
| 65 | Nimbu Mirchi | `nimbu-mirchi` | Validated baseline | [Report](parity/nimbu-mirchi.md) |
| 66 | Not Found | `not-found` | Validated baseline | [Report](parity/not-found.md) |
| 67 | Notification Bell | `notification-bell` | Validated baseline | [Report](parity/notification-bell.md) |
| 68 | Notification Stack | `notification-stack` | Validated baseline | [Report](parity/notification-stack.md) |
| 69 | Orbital Loading Ring | `orbital-loading-ring` | Validated baseline | [Review](parity/orbital-loading-ring.md) |
| 70 | OriginDropdown | `origin-dropdown` | Validated baseline | [Report](parity/origin-dropdown.md) |
| 71 | OTP Input | `otp-input` | Validated baseline | [Report](parity/otp-input.md) |
| 72 | Particle Delete | `particle-delete` | Queued | — |
| 73 | Payment Receipt Printer | `payment-receipt-printer` | Validated baseline | [Report](parity/payment-receipt-printer.md) |
| 74 | Payment Status | `payment-status` | Validated baseline | [Report](parity/payment-status.md) |
| 75 | Peek Card | `peek-card` | Validated baseline | [Report](parity/peek-card.md) |
| 76 | Pill Navigation | `pill-navigation` | Validated baseline | [Report](parity/pill-navigation.md) |
| 77 | PressButton | `press-button` | Validated baseline | [Review](parity/press-button.md) |
| 78 | Pricing | `pricing` | Validated baseline | [Report](parity/pricing.md) |
| 79 | Profile Card | `profile-card` | Validated baseline | [Report](parity/profile-card.md) |
| 80 | Pull to Refresh | `pull-to-refresh` | Queued | — |
| 81 | Rainbow Button | `rainbow-button` | Validated baseline | [Review](parity/rainbow-button.md) |
| 82 | Recovery Ledger | `recovery-ledger` | Validated baseline | [Report](parity/recovery-ledger.md) |
| 83 | Reveal Card | `reveal-card` | Validated baseline | [Report](parity/reveal-card.md) |
| 84 | Rocket Party Popper | `rocket-party-popper` | Validated baseline | [Report](parity/rocket-party-popper.md) |
| 85 | Scroll Progress Navigation | `scroll-progress-nav` | Validated baseline | [Report](parity/scroll-progress-nav.md) |
| 86 | Scroll Velocity Text | `scrollvelocitytext` | Validated baseline | [Report](parity/scrollvelocitytext.md) |
| 87 | Selection Basket | `selection-basket` | Validated baseline | [Evidence](parity/selection-basket.md) |
| 88 | SettleModal | `settle-modal` | Validated baseline | [Evidence](parity/settle-modal.md) |
| 89 | Shooting Stars | `shooting-stars` | Queued | — |
| 90 | Sign Up | `sign-up` | Queued | — |
| 91 | SlidePagination | `slide-pagination` | Validated baseline | [Report](parity/slide-pagination.md) |
| 92 | Small Floating Dock | `small-floating-dock` | Validated baseline | [Report](parity/small-floating-dock.md) |
| 93 | Smart Comparison | `smart-comparison` | Queued | — |
| 94 | Smart Upload | `smart-upload` | Validated baseline | [Report](parity/smart-upload.md) |
| 95 | Smooth Accordion | `smooth-accordion` | Validated baseline | [Report](parity/smooth-accordion.md) |
| 96 | Sparkles Core | `sparkles-core` | Queued | — |
| 97 | Speed Warp | `speed-warp` | Validated baseline | [Report](parity/speed-warp.md) |
| 98 | Split Button | `split-button` | Validated baseline | [Report](parity/split-button.md) |
| 99 | Spotlight Card | `spotlight-card` | Validated baseline | [Review](parity/spotlight-card.md) |
| 100 | Spotlight Search | `spotlight-search` | Validated baseline | [Report](parity/spotlight-search.md) |
| 101 | SpringSelect | `spring-select` | Validated baseline | [Report](parity/spring-select.md) |
| 102 | Stack Unfold Panel | `stack-unfold-panel` | Validated baseline | [Evidence](parity/stack-unfold-panel.md) |
| 103 | Stacked Cards | `stacked-cards` | Validated baseline | [Report](parity/stacked-cards.md) |
| 104 | Sticky Pages | `sticky-pages` | Validated baseline | [Report](parity/sticky-pages.md) |
| 105 | Story Cards | `story-card` | Validated baseline | [Report](parity/story-card.md) |
| 106 | StretchSwitch | `stretch-switch` | Validated baseline | [Report](parity/stretch-switch.md) |
| 107 | Swipe Action List | `swipe-action-list` | Validated baseline | [Report](parity/swipe-action-list.md) |
| 108 | Text Scramble Decoder | `text-scramble-decoder` | Validated baseline | [Evidence](parity/text-scramble-decoder.md) |
| 109 | Thinking Orb | `thinking-orb` | Queued | — |
| 110 | Timeline Scrubber | `timeline-scrubber` | Validated baseline | [Report](parity/timeline-scrubber.md) |
| 111 | Torque Dial | `torque-dial` | Validated baseline | [Report](parity/torque-dial.md) |
| 112 | Typewriter Button | `typewriter-button` | Validated baseline | [Review](parity/typewriter-button.md) |
| 113 | Undo Toast | `undo-toast` | Validated baseline | [Report](parity/undo-toast.md) |
| 114 | UnfoldAccordion | `unfold-accordion` | Validated baseline | [Report](parity/unfold-accordion.md) |
| 115 | VelocityToast | `velocity-toast` | Validated baseline | [Report](parity/velocity-toast.md) |
| 116 | Wallet Card | `wallet-card` | Validated baseline | [Report](parity/wallet-card.md) |

## Validation baseline

Activity Feed: 14 component browser checks and 24 catalog/navigation checks pass on desktop/mobile Chromium. All 117 existing unit tests pass. The production build passes 289 SEO checks. The packaged contract check passes, and Angular 20.0, 20.3, 21 and 22 consumers compile all 116 selectors with the Activity Feed bindings. Lint has 21 inherited warnings.

These results cover the first component and integration regressions; they do not establish parity for queued components. Physical devices, Safari/Firefox and exhaustive accessibility coverage are outside the recorded validation.

AI Agent Activity: 20 focused browser checks, 24 catalog/sidebar checks, the built-package contract, 117 unit tests, four Angular consumer builds and production build with 289 SEO checks pass. Lint retains 21 inherited warnings. See its report for motion coverage limits.

AI Prompt Composer: 8 focused browser checks, 24 catalog/sidebar checks, packaged async/attachment contracts, four Angular consumer builds, 117 unit tests and production build with 289 SEO checks pass. Lint retains 21 inherited warnings.

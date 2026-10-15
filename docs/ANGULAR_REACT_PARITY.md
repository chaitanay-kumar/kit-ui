# Angular React parity tracker

React is the source of truth for component appearance, interactions, data contracts, options and defaults. Angular implementations stay native; template projection and output events provide Angular equivalents for React nodes and callbacks. Catalog coverage does not establish parity.

Current progress: 35 components have validated baselines (21 merged plus fourteen validated on pending batch branches) and 81 await review. Batch 10 adds Payment Status and Notification Bell to the stacked pending batches. See [batch 10 evidence](parity/batch-10-integration.md) and the preceding linked batch reports.

User priority: finish simpler components first. AI Response work is preserved on `feat/angular-ai-response-parity` and remains in progress. Button is in [PR #6](https://github.com/chaitanay-kumar/kit-ui/pull/6). Neon Edge Button is in [PR #7](https://github.com/chaitanay-kumar/kit-ui/pull/7). Orbital Loading Ring is in [PR #8](https://github.com/chaitanay-kumar/kit-ui/pull/8). Spotlight Card is in [PR #9](https://github.com/chaitanay-kumar/kit-ui/pull/9). Morphing Icon is in [PR #10](https://github.com/chaitanay-kumar/kit-ui/pull/10). Work proceeds in batches of two, with focused component checks during implementation and one full baseline before batch merge. Batch 2 merged through [PR #19](https://github.com/chaitanay-kumar/kit-ui/pull/19); batch 3 merged through [PR #25](https://github.com/chaitanay-kumar/kit-ui/pull/25). Batch 4 and its stacked batch 5 are locally validated and await integration. The original inventory order remains below for tracking, not execution priority.

## Pending work

- Review and fix the remaining 81 components listed below: 80 queued and AI Response deferred in progress. Existing generated Angular coverage does not count as validated parity.
- Review and integrate batches 4 through 10 in order. Continue with two queued components at a time.
- Resume AI Response later from local `kit-ui-angular-response` on `feat/angular-ai-response-parity`. Its unfinished changes and audit at `docs/parity/ai-response-audit.md` remain preserved in that worktree and are not merged or validated.
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
| 5 | AI Response | `ai-response` | In progress, deferred for simpler controls | Local audit on deferred branch |
| 6 | Airport Matrix Clock | `airport-matrix-clock` | Queued | — |
| 7 | Animated File Upload | `animated-file-upload` | Queued | — |
| 8 | Animated Number Morph | `animated-number` | Validated locally; integration pending | [Report](parity/animated-number.md) |
| 9 | Animated Tabs | `animated-tabs` | Queued | — |
| 10 | Avatar Stack | `avatar-stack` | Queued | — |
| 11 | Batch Gesture Tray | `batch-gesture-tray` | Queued | — |
| 12 | Book Call Button | `book-call-button` | Queued | — |
| 13 | Branching Submenu | `branching-submenu` | Queued | — |
| 14 | Button | `button` | Validated baseline | [Review](parity/button.md) |
| 15 | Car Smoke Page Transition | `car-smoke-page-transition` | Queued | — |
| 16 | Chat | `chat` | Queued | — |
| 17 | Circular Orbit | `circular-orbit` | Queued | — |
| 18 | Code Snippet Deck | `code-snippet-deck` | Queued | — |
| 19 | Command Menu | `command-menu` | Queued | — |
| 20 | Cursor Follower | `cursor-follower` | Queued | — |
| 21 | Density Lens | `density-lens` | Queued | — |
| 22 | Dependency Trace | `dependency-trace` | Queued | — |
| 23 | Depth Corridor | `depth-corridor` | Queued | — |
| 24 | DirectionalTooltip | `directional-tooltip` | Queued | — |
| 25 | Dot Field | `dot-field` | Queued | — |
| 26 | Dot Shader | `dot-shader` | Queued | — |
| 27 | Drag to Confirm | `drag-to-confirm` | Queued | — |
| 28 | DrawCheckbox | `draw-checkbox` | Validated locally; integration pending | [Report](parity/draw-checkbox.md) |
| 29 | Dynamic Island | `dynamic-island` | Queued | — |
| 30 | Elastic Sheet | `elastic-sheet` | Queued | — |
| 31 | Evil Eye | `evil-eye` | Queued | — |
| 32 | Expandable Data Row | `expandable-data-row` | Queued | — |
| 33 | Expandable Search | `expandable-search` | Validated baseline | [Report](parity/expandable-search.md) |
| 34 | FAQ | `faq` | Validated locally; integration pending | [Report](parity/faq.md) |
| 35 | Floating Action Dock | `floating-action-dock` | Queued | — |
| 36 | Focus Mode | `focus-mode` | Queued | — |
| 37 | Form | `form` | Queued | — |
| 38 | Glass Navbar | `glass-navbar` | Queued | — |
| 39 | Glitch Text | `glitch-text` | Queued | — |
| 40 | Glyph Matrix | `glyph-matrix` | Queued | — |
| 41 | Gooey Menu | `gooey-menu` | Queued | — |
| 42 | Gravity Particle Burst | `gravity-particle-burst` | Queued | — |
| 43 | Hamburger Menu | `hamburger-menu` | Validated baseline | [Report](parity/hamburger-menu.md) |
| 44 | Hold-to-Confirm | `hold-to-confirm` | Validated locally; integration pending | [Report](parity/hold-to-confirm.md) |
| 45 | Interactive Data Card | `interactive-data-card` | Validated locally; integration pending | [Report](parity/interactive-data-card.md) |
| 46 | Interactive Timeline | `interactive-timeline` | Queued | — |
| 47 | Intro Loader | `intro-loader` | Queued | — |
| 48 | iOS-style Search Bar | `ios-search-bar` | Validated baseline | [Report](parity/ios-search-bar.md) |
| 49 | Liquid Command Palette | `liquid-command-palette` | Queued | — |
| 50 | Liquid Ripple Button | `liquid-ripple-button` | Queued | — |
| 51 | Liquid Toggle | `liquid-toggle` | Validated locally; integration pending | [Report](parity/liquid-toggle.md) |
| 52 | Loader | `loader` | Validated baseline | [Review](parity/loader.md) |
| 53 | LockInput | `lock-input` | Validated locally; integration pending | [Report](parity/lock-input.md) |
| 54 | Login | `login` | Queued | — |
| 55 | macOS Folder Cards | `mac-os-folder-cards` | Queued | — |
| 56 | Magnetic Button | `magnetic-button` | Validated baseline | [Review](parity/magnetic-button.md) |
| 57 | Meteors | `meteors` | Queued | — |
| 58 | Metric HUD | `metric-hud` | Queued | — |
| 59 | Morphing Blob | `morphing-blob` | Queued | — |
| 60 | Morphing Button | `morphing-button` | Validated baseline | [Review](parity/morphing-button.md) |
| 61 | Morphing Dialog | `morphing-dialog` | Queued | — |
| 62 | Morphing Icon | `morphing-icon` | Validated baseline | [Review](parity/morphing-icon.md) |
| 63 | Morphing Shape Loader | `morphing-shape-loader` | Queued | — |
| 64 | Neon Edge Button | `neon-edge-button` | Validated baseline | [Review](parity/neon-edge-button.md) |
| 65 | Nimbu Mirchi | `nimbu-mirchi` | Queued | — |
| 66 | Not Found | `not-found` | Queued | — |
| 67 | Notification Bell | `notification-bell` | Validated locally; integration pending | [Report](parity/notification-bell.md) |
| 68 | Notification Stack | `notification-stack` | Queued | — |
| 69 | Orbital Loading Ring | `orbital-loading-ring` | Validated baseline | [Review](parity/orbital-loading-ring.md) |
| 70 | OriginDropdown | `origin-dropdown` | Validated locally; integration pending | [Report](parity/origin-dropdown.md) |
| 71 | OTP Input | `otp-input` | Validated locally; integration pending | [Report](parity/otp-input.md) |
| 72 | Particle Delete | `particle-delete` | Queued | — |
| 73 | Payment Receipt Printer | `payment-receipt-printer` | Queued | — |
| 74 | Payment Status | `payment-status` | Validated locally; integration pending | [Report](parity/payment-status.md) |
| 75 | Peek Card | `peek-card` | Queued | — |
| 76 | Pill Navigation | `pill-navigation` | Queued | — |
| 77 | PressButton | `press-button` | Validated baseline | [Review](parity/press-button.md) |
| 78 | Pricing | `pricing` | Queued | — |
| 79 | Profile Card | `profile-card` | Queued | — |
| 80 | Pull to Refresh | `pull-to-refresh` | Queued | — |
| 81 | Rainbow Button | `rainbow-button` | Validated baseline | [Review](parity/rainbow-button.md) |
| 82 | Recovery Ledger | `recovery-ledger` | Queued | — |
| 83 | Reveal Card | `reveal-card` | Validated baseline | [Report](parity/reveal-card.md) |
| 84 | Rocket Party Popper | `rocket-party-popper` | Queued | — |
| 85 | Scroll Progress Navigation | `scroll-progress-nav` | Queued | — |
| 86 | Scroll Velocity Text | `scrollvelocitytext` | Queued | — |
| 87 | Selection Basket | `selection-basket` | Queued | — |
| 88 | SettleModal | `settle-modal` | Queued | — |
| 89 | Shooting Stars | `shooting-stars` | Queued | — |
| 90 | Sign Up | `sign-up` | Queued | — |
| 91 | SlidePagination | `slide-pagination` | Queued | — |
| 92 | Small Floating Dock | `small-floating-dock` | Queued | — |
| 93 | Smart Comparison | `smart-comparison` | Queued | — |
| 94 | Smart Upload | `smart-upload` | Queued | — |
| 95 | Smooth Accordion | `smooth-accordion` | Validated baseline | [Report](parity/smooth-accordion.md) |
| 96 | Sparkles Core | `sparkles-core` | Queued | — |
| 97 | Speed Warp | `speed-warp` | Queued | — |
| 98 | Split Button | `split-button` | Queued | — |
| 99 | Spotlight Card | `spotlight-card` | Validated baseline | [Review](parity/spotlight-card.md) |
| 100 | Spotlight Search | `spotlight-search` | Queued | — |
| 101 | SpringSelect | `spring-select` | Queued | — |
| 102 | Stack Unfold Panel | `stack-unfold-panel` | Queued | — |
| 103 | Stacked Cards | `stacked-cards` | Queued | — |
| 104 | Sticky Pages | `sticky-pages` | Queued | — |
| 105 | Story Cards | `story-card` | Queued | — |
| 106 | StretchSwitch | `stretch-switch` | Validated baseline | [Report](parity/stretch-switch.md) |
| 107 | Swipe Action List | `swipe-action-list` | Validated locally; integration pending | [Report](parity/swipe-action-list.md) |
| 108 | Text Scramble Decoder | `text-scramble-decoder` | Queued | — |
| 109 | Thinking Orb | `thinking-orb` | Queued | — |
| 110 | Timeline Scrubber | `timeline-scrubber` | Validated locally; integration pending | [Report](parity/timeline-scrubber.md) |
| 111 | Torque Dial | `torque-dial` | Queued | — |
| 112 | Typewriter Button | `typewriter-button` | Validated baseline | [Review](parity/typewriter-button.md) |
| 113 | Undo Toast | `undo-toast` | Queued | — |
| 114 | UnfoldAccordion | `unfold-accordion` | Validated locally; integration pending | [Report](parity/unfold-accordion.md) |
| 115 | VelocityToast | `velocity-toast` | Queued | — |
| 116 | Wallet Card | `wallet-card` | Queued | — |

## Validation baseline

Activity Feed: 14 component browser checks and 24 catalog/navigation checks pass on desktop/mobile Chromium. All 117 existing unit tests pass. The production build passes 289 SEO checks. The packaged contract check passes, and Angular 20.0, 20.3, 21 and 22 consumers compile all 116 selectors with the Activity Feed bindings. Lint has 21 inherited warnings.

These results cover the first component and integration regressions; they do not establish parity for queued components. Physical devices, Safari/Firefox and exhaustive accessibility coverage are outside the recorded validation.

AI Agent Activity: 20 focused browser checks, 24 catalog/sidebar checks, the built-package contract, 117 unit tests, four Angular consumer builds and production build with 289 SEO checks pass. Lint retains 21 inherited warnings. See its report for motion coverage limits.

AI Prompt Composer: 8 focused browser checks, 24 catalog/sidebar checks, packaged async/attachment contracts, four Angular consumer builds, 117 unit tests and production build with 289 SEO checks pass. Lint retains 21 inherited warnings.

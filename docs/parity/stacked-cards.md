# Stacked Cards parity

Source: `src/components/ui/StackedCards.tsx`. Native authoring: `scripts/angular-stacked-cards.ts`; data, CSS and scroll lifecycle live in `packages/angular/src/stacked-cards*`. The old selectable collection/navigation model is replaced by the actual sticky story articles.

Typed StackedCard data and the source four default stories preserve titles, descriptions, images, image alternatives, hrefs and optional CTAs. Missing/falsy alt falls back to title; missing/falsy href falls back to #. Images remain lazy; CTAs are native links. Empty/null cards render no section, undefined restores defaults. Optional title/subtitle and root className, style, scalar attributes and event callbacks follow the source presentation contract.

Each wrapper uses sticky top calc(4.5rem + index*16px), increasing z-index, and an article with top-center transform origin. Window scroll progress follows the target's start/start and end/end offsets, measured through offset parents. Per-card clamped linear scaling begins at index/total and ends at 1-(total-index-1)*.075. There is no spring or reduced-motion opt-out in the actual source. Reverse scrolling expands the cards; resize remeasures the range. List replacement retains keyed articles, and destruction removes scroll/resize listeners and scheduled frames.

Paired desktop/mobile checks exercise exact measured scroll progress in both directions, source defaults/fallbacks, empty/null data, native links/images, themes, sticky layout, typography, article/content/image geometry, bare usage, actual demo and disposal. Matched local SVG responses isolate image layout from the external image service. See [batch evidence](batch-35-integration.md) for final baseline results.

Recorded recovery difference: installed React Motion keeps its original target after a populated list becomes empty and is repopulated; an observed three-card sequence lost scaling (all transforms none after scrolling). Angular detaches on empty and attaches to the new target, with a dedicated recovery test. It does not deliberately preserve a detached target. This difference remains visible for review.

Migration: replace items/selected/disabled/itemSelect and card-picker navigation with cards/title/subtitle. The source has no selection contract or accessible picker controls; native CTA links provide its keyboard interaction. Supply the same fonts/theme tokens for identical typography. Arbitrary Tailwind utility overrides, nested custom scroll containers, physical devices, other engines and full accessibility conformance are outside this baseline.

Source styling issue: the catalog global heading rule assigns text-primary to article headings; in the light theme this makes dark-card titles low contrast. Paired screenshots show the same issue in React and Angular. A shared source styling fix remains outside this component-only baseline.

Batch 36 callback renewal: synchronous observer errors report through Angular ErrorHandler on the next microtask, preserving default navigation/Space activation, propagation and any explicit preventDefault. Pricing CTA errors also preserve the native event seen by parent observers. Twelve focused desktop/mobile regression cases across Pricing/StackedCards pass, with renewed packaged contracts and the full current-source batch baseline; see [batch 36 evidence](batch-36-integration.md).

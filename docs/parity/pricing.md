# Pricing parity

Source: `src/components/ui/Pricing.tsx`. Native authoring: `scripts/angular-pricing.ts`; tier types, card template, CSS and entry motion live in `packages/angular/src/pricing*`. The generic selectable-plan/billing model is replaced by the actual Free/Pro presentation.

`freeTier` and `proTier` accept PricingTier, with optional tagline/callback and mixed string/PricingFeature entries. Feature descriptions are accepted but ignored, matching React. Actual Pro default is $129; the documentation demo explicitly supplies $29, which the native demo also does. There is no source billing toggle, discount calculation, selection state, disabled or loading API. Applications own checkout callbacks.

`reverse` swaps data and featured appearance in two persistent positional cards without restarting their entry. `columns` supports 1, 2 and auto (two at 768px); eyebrow, heading and subheading render only when supplied. Root className, React-style numeric CSS through the `style` input, scalar HTML attributes through `attributes`, and native onClick/onKeyDown callbacks are supported. Callbacks may throw; false returns do not prevent browser defaults. The declared CTA callback is parameterless, while the actual runtime click event is preserved.

The source 200/28/.85 entry spring and featured 50ms delay are matched against intermediate React samples, including reversal and reduced-motion mount snapshots. CSS owns CTA hover/active scale, static sheen and one 1600ms shimmer pass. Live reduced-motion changes suppress shimmer; source CSS scale feedback remains enabled. Both tiers retain native keyboard buttons and focus rings.

Focused package and paired desktop/mobile checks cover default/custom tiers, root overrides/removal, ignored descriptions, native callbacks/failure recovery, reversal, columns, themes, typography, responsive geometry, focus, shimmer, bare consumers, actual demos and disposal. See [batch evidence](batch-35-integration.md) for final baseline results.

Migration: replace plans/yearly/yearlyDiscount/currency/disabled and planSelect with freeTier/proTier and tier onCtaClick. Native source needs no Tailwind runtime; supply the same fonts/theme tokens for identical typography. Arbitrary utility-class conflict resolution, other browser engines, physical devices and full accessibility conformance are outside this recorded baseline.

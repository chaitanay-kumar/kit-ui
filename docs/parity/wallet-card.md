# Wallet Card parity

Native Angular wallet presentation replaces the generic selectable collection. Source contract: `src/components/ui/WalletCard.tsx`; authored definition: `scripts/angular-wallet-card.ts`; CSS and press spring: `packages/angular/src/wallet-card*`.

Inputs match balance, card type/last four, action label, caption, disabled and className defaults, including explicit undefined. `onUseWallet` is a synchronous callback; errors propagate to the consumer. `onPointerMove`/`onPointerLeave` can override internal shine handling. The decorative toggle is not an interactive switch, matching React.

The card uses native CSS gradients and a 550/30 scale spring, with pointer coordinates relative to the outer card. Reduced motion suppresses shine tracking and spring press. No payment or wallet service is included.

Migration: replace `items`, `selected`, `action` and collection bindings with the scalar wallet inputs and `onUseWallet`. Put native host attributes on `kit-wallet-card`; `className` applies to the inner article. Angular does not forward arbitrary host attributes/events onto the inner article automatically.

Validation: batch 31 paired Chromium desktop/mobile checks cover defaults/custom labels, keyboard action, disabled behavior, card/heading/button/subtitle geometry and typography, pointer shine/reset and reduced-motion mount. Package contracts cover callback failure, undefined/empty defaults and global-listener teardown. Bare native consumer checks pass without Tailwind. See [batch evidence](batch-31-integration.md).

Coverage limits: exact intermediate press frames, all arbitrary HTML attributes, physical devices and Safari/Firefox are not certified. The source's default CSS font is Inter Variable; consumers provide that font for identical typography. UI screenshot comparisons are scoped to the recorded fixture, not an exhaustive pixel-diff certification.

# Morphing Dialog parity

The native Angular overlay replaces the unrelated asynchronous confirmation dialog. Source: `src/components/ui/MorphingDialog.tsx`; authoring: `scripts/angular-morphing-dialog.ts`; native CSS, entry/backdrop motion and shared projection are in `packages/angular/src/morphing-dialog*`.

Required inputs are `title`, `trigger` and `content`. The latter two are lazy Angular templates. A trigger declares `let-open` (or `let-open="open"`) and calls that function; content mounts only when the overlay opens. Subtitle and className follow React; className applies to the expanded panel. `id` defaults to `morph-dialog` and identifies the shared surface, rather than adding dialog semantics.

The actual documentation trigger is a plain button and has no matching shared surface, so the panel appears at its natural size while backdrop/header/body animate. To opt into native projection, use `let-layoutId="layoutId"` on the trigger template and bind `[attr.data-morph-layout-id]="layoutId"` on its surface. Matching trigger and expanded panel boxes use the source 220/32/1 opening spring, crossfades, and Motion's default 450ms return transition for an unconfigured trigger. Reopening retains content and resumes from the current projected geometry and opacity. Native templates require no React or Framer Motion runtime.

Escape, backdrop click and close button dismiss. Source overflow writes are preserved: mount/close/disposal write `unset`, opening writes `hidden`, and closing releases the lock before the retained backdrop exit finishes. The implementation removes the window listener and animation work on disposal, restoring the projected trigger's inline styles.

Migration: replace generic `opened`, async action/confirm and description bindings with trigger/content templates, title and optional subtitle. React's implementation does not provide role=dialog, aria-modal, a focus trap or focus restoration, despite its metadata claims. Angular follows actual source behavior and does not invent those contracts. Source also has no reduced-motion hook.

Validation: focused package contracts, full production build, 117 unit tests and source-download dependencies pass. The final 28-case paired desktop/mobile suite and all four independent Angular compiler consumers pass; see [batch evidence](batch-33-integration.md).

Limits: shared projection is scoped to a single matching native trigger with the default trigger transition. Caller-specific Framer Motion transitions, nested shared-layout trees, multiple colliding IDs and live content/viewport retargeting during a running projection are outside this baseline; native shared projection measures its boxes when the overlay is created. Preview host spacing is a native application concern. Identical typography needs the consumer's page font/theme. Other browser engines and physical devices are outside coverage.

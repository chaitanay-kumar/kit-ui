# VelocityToast parity

The native Angular single toast replaces the generic notification collection. Source: `src/components/ui/VelocityToast.tsx`; authoring: `scripts/angular-velocity-toast.ts`; CSS and native spring are in `packages/angular/src/velocity-toast*`.

`open` and `title` are required. Defaults match duration 4000, variant default, bottom-center position, visible progress, and empty className. Description, five icon variants, six placements, custom native icon template/text and synchronous onDismiss callback follow source. Custom icons retain their own color rather than inheriting a variant tone.

Local visibility is distinct from external open. Dismissal hides first, then calls the consumer; callback failure does not undo hiding. An unchanged true open input does not reopen a dismissed toast. Changing duration while open resets progress and reopens it. Hover pauses at the last countdown frame and resumes from remaining time; paused state persists across reopening. Progress is `pow(remaining/duration,1.05)*100`. Hiding the progress bar disables automatic dismissal, matching source. Native drawing defers a bar update by one RAF to reproduce MotionValue rendering while keeping raw timing unchanged.

Entry and retained exit use springSnappy (380/30/.5), top/bottom-specific Y offsets, and scale. Exiting content and className remain frozen while the outer placement still follows position; reopening interrupts exit. Progress, deferred rendering and spring frames are canceled on disposal. The toast uses role=status and aria-live=polite; its close button is keyboard reachable. Source has no reduced-motion opt-out.

Migration: replace collection items/restore/action bindings with required open/title and source scalar inputs. Consumers normally set open false in onDismiss. Put custom Angular SVG/content in an ng-template and pass it as icon; text/number alternatives use the source truthy/falsy icon behavior. This component does not provide toast stacking or an external notification service.

Validation: focused timing/failure/disposal contracts, production build, 117 unit tests and source-download dependencies pass. The final 28-case paired motion/appearance/native demo suite and all four Angular compiler consumers pass; see [batch evidence](batch-33-integration.md).

Limits: the source's font-sans resolves to Inter Variable in the catalog; consumers must provide that font or select their own via --kit-velocity-font. Timer/animation comparisons cover recorded frame samples and desktop/mobile Chromium, rather than every scheduler phase, physical device or browser engine. Preview host spacing remains a native application concern.

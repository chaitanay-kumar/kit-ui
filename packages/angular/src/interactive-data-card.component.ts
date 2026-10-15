import {
  Component,
  DestroyRef,
  TemplateRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

export type InteractiveDataCardContent =
  | string
  | number
  | boolean
  | null
  | undefined
  | TemplateRef<unknown>;
export type InteractiveDataCardAction = () => void | Promise<void>;

const DEFAULT_SUMMARY = "24 tasks completed · 12% ahead";
let nextInteractiveDataCardId = 0;

@Component({
  selector: "kit-interactive-data-card",
  standalone: true,
  imports: [NgTemplateOutlet],
  host: { style: "display:contents" },
  template: ` <article
    class="kit-control kit-surface kit-stack"
    [attr.aria-busy]="loading() || pending()"
  >
    <h3>{{ title() }}</h3>
    <div>
      @if (loading()) {
        Loading summary…
      } @else if (contentTemplate(summary()); as template) {
        <ng-container [ngTemplateOutlet]="template" />
      } @else {
        {{ contentText(summary()) }}
      }
    </div>
    @if (error()) {
      <p role="alert">{{ error() }}</p>
    }
    <button
      type="button"
      [disabled]="disabled() || loading()"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="detailsId"
      (click)="expanded.set(!expanded())"
    >
      {{ expanded() ? "Less detail −" : "Explore details +" }}
    </button>
    <div [id]="detailsId" [hidden]="!expanded()" class="kit-stack">
      @if (children() !== null && children() !== undefined) {
        @if (contentTemplate(children()); as template) {
          <ng-container [ngTemplateOutlet]="template" />
        } @else {
          {{ contentText(children()) }}
        }
      } @else {
        <ng-content>
          <p class="kit-muted">
            Your team shipped 8 features and resolved 16 issues. Keep the next
            step small and intentional.
          </p>
        </ng-content>
      }
      <button
        type="button"
        [disabled]="disabled() || loading() || pending()"
        (click)="act()"
      >
        {{ pending() ? "Updating…" : actionLabel() }}
      </button>
    </div>
    <p role="status" class="kit-status">
      {{ pending() ? "Updating report…" : status() }}
    </p>
  </article>`,
})
export class KitInteractiveDataCardComponent {
  readonly title = input("Weekly momentum", {
    transform: (value: string | undefined) => value ?? "Weekly momentum",
  });
  readonly summary = input<
    InteractiveDataCardContent,
    InteractiveDataCardContent
  >(DEFAULT_SUMMARY, {
    transform: (value: InteractiveDataCardContent) =>
      value === undefined ? DEFAULT_SUMMARY : value,
  });
  readonly children = input<InteractiveDataCardContent>();
  readonly loading = input(false, {
    transform: (value: boolean | undefined) => value ?? false,
  });
  readonly error = input<string>();
  readonly disabled = input(false, {
    transform: (value: boolean | undefined) => value ?? false,
  });
  readonly actionLabel = input("Refresh report", {
    transform: (value: string | undefined) => value ?? "Refresh report",
  });
  readonly onAction = input<InteractiveDataCardAction>();
  /** @deprecated Use onAction. */
  readonly action = input<InteractiveDataCardAction>();
  readonly expanded = signal(false);
  readonly pending = signal(false);
  readonly status = signal("");
  readonly detailsId = `kit-interactive-data-card-${++nextInteractiveDataCardId}`;
  private destroyed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
    });
  }

  contentTemplate(value: InteractiveDataCardContent): TemplateRef<unknown> | null {
    return value instanceof TemplateRef ? value : null;
  }

  contentText(value: InteractiveDataCardContent): string | number {
    return typeof value === "string" || typeof value === "number" ? value : "";
  }

  async act(): Promise<void> {
    if (this.pending() || this.disabled() || this.loading()) return;
    this.pending.set(true);
    this.status.set("");
    try {
      await (this.onAction() ?? this.action())?.();
      if (!this.destroyed) this.status.set("Report updated.");
    } catch {
      if (!this.destroyed) this.status.set("Unable to update. Try again.");
    } finally {
      if (!this.destroyed) this.pending.set(false);
    }
  }
}

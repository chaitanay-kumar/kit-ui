import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from "@angular/core";

@Component({
  selector: "kit-hold-to-confirm",
  standalone: true,
  host: { style: "display:contents" },
  template: ` <div class="kit-control kit-stack">
    <button
      type="button"
      class="kit-hold"
      [disabled]="disabled() || state() === 'pending' || state() === 'success'"
      (pointerdown)="pointerStart($event)"
      (pointerup)="cancel()"
      (pointercancel)="cancel()"
      (lostpointercapture)="cancel()"
      (blur)="cancel()"
      (keydown)="keyDown($event)"
      (keyup)="keyUp($event)"
    >
      <span
        class="kit-hold-fill"
        [style.transform]="'scaleX(' + progress() + ')'"
      ></span
      >{{
        state() === "pending"
          ? "Confirming…"
          : state() === "success"
            ? "Confirmed ✓"
            : label()
      }}
    </button>
    <progress
      aria-label="Confirmation hold progress"
      max="1"
      [value]="progress()"
    ></progress>
    <p class="kit-status" role="status">
      {{
        state() === "error"
          ? "Confirmation failed. Hold again to retry."
          : state() === "success"
            ? "Action completed."
            : state() === "pending"
              ? "Waiting for confirmation…"
              : "Hold with a pointer, Space, or Enter. Release early to cancel."
      }}
    </p>
    @if (state() === "success") {
      <button type="button" (click)="reset()">Reset</button>
    }
  </div>`,
})
export class KitHoldToConfirmComponent {
  readonly label = input<string, string | undefined>("Hold to confirm", {
    transform: (value) => value ?? "Hold to confirm",
  });
  readonly duration = input<number, number | undefined>(1200, {
    transform: (value) => value ?? 1200,
  });
  readonly disabled = input<boolean, boolean | undefined>(false, {
    transform: (value) => value ?? false,
  });
  readonly onConfirm = input<() => void | Promise<void>>();
  /** @deprecated Use onConfirm. */
  readonly confirm = input<() => void | Promise<void>>();
  readonly confirmed = output<void>();
  readonly progress = signal(0);
  readonly state = signal<"idle" | "holding" | "pending" | "success" | "error">(
    "idle",
  );
  private timer: ReturnType<typeof setInterval> | undefined;
  private destroyed = false;
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.stop();
    });
    effect(() => {
      if (this.disabled()) this.cancel();
    });
  }
  private stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
  cancel(): void {
    if (this.state() !== "holding") return;
    this.stop();
    this.progress.set(0);
    this.state.set("idle");
  }
  reset(): void {
    this.progress.set(0);
    this.state.set("idle");
  }
  start(): void {
    if (
      this.disabled() ||
      ["holding", "pending", "success"].includes(this.state())
    )
      return;
    this.progress.set(0);
    this.state.set("holding");
    const started = Date.now();
    this.timer = setInterval(() => {
      const next = Math.min(
        1,
        (Date.now() - started) / Math.max(250, this.duration()),
      );
      this.progress.set(next);
      if (next === 1) {
        this.stop();
        void this.finish();
      }
    }, 16);
  }
  private async finish(): Promise<void> {
    this.state.set("pending");
    try {
      await (this.onConfirm() ?? this.confirm())?.();
      if (!this.destroyed) {
        this.state.set("success");
        this.confirmed.emit();
      }
    } catch {
      if (!this.destroyed) {
        this.state.set("error");
        this.progress.set(0);
      }
    }
  }
  pointerStart(event: PointerEvent): void {
    if (event.button !== 0) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.start();
  }
  keyDown(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (!event.repeat) this.start();
    }
    if (event.key === "Escape") this.cancel();
  }
  keyUp(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.cancel();
    }
  }
}

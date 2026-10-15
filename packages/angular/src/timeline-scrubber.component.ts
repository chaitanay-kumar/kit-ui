import { Component, computed, input, output, signal } from "@angular/core";
import type { TimelineEvent } from "./types";

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    id: "idea",
    title: "A small beginning",
    time: "09:00",
    description: "Sketch the idea.",
  },
  {
    id: "build",
    title: "Find the rhythm",
    time: "11:30",
    description: "Build a working prototype.",
  },
  {
    id: "ship",
    title: "Ready to share",
    time: "16:00",
    description: "Bring the details together.",
  },
];
let nextTimelineScrubberId = 0;

@Component({
  selector: "kit-timeline-scrubber",
  standalone: true,
  host: { style: "display:contents" },
  template: ` <section
    class="kit-control kit-surface kit-stack"
    [attr.aria-busy]="loading()"
  >
    <label [for]="controlId">Timeline · {{ events().length }} events</label>
    <input
      [id]="controlId"
      type="range"
      min="0"
      [max]="maxIndex()"
      step="1"
      [value]="index()"
      [disabled]="disabled() || loading() || events().length < 2"
      [attr.aria-valuetext]="valueText()"
      (input)="scrub($event)"
      (change)="scrub($event)"
    />
    <div role="status" class="kit-stack">
      @if (loading()) {
        <p>Loading timeline…</p>
      } @else if (event(); as item) {
        <p class="kit-muted">
          {{ item.time }} · {{ index() + 1 }} of {{ events().length }}
        </p>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      } @else {
        <p>No events yet.</p>
      }
    </div>
    <div class="kit-row">
      <button
        type="button"
        [disabled]="disabled() || loading() || index() === 0"
        (click)="select(index() - 1)"
      >
        ← Previous</button
      ><button
        type="button"
        [disabled]="disabled() || loading() || index() >= maxIndex()"
        (click)="select(index() + 1)"
      >
        Next →
      </button>
    </div>
  </section>`,
})
export class KitTimelineScrubberComponent {
  readonly events = input<TimelineEvent[], TimelineEvent[] | undefined>(DEFAULT_EVENTS, {
    transform: (value: TimelineEvent[] | undefined) => value ?? DEFAULT_EVENTS,
  });
  readonly disabled = input(false, {
    transform: (value: boolean | undefined) => value ?? false,
  });
  readonly loading = input(false, {
    transform: (value: boolean | undefined) => value ?? false,
  });
  readonly onChange = input<(event: TimelineEvent, index: number) => void>();
  /** @deprecated Use onChange. */
  readonly eventChange = output<{ event: TimelineEvent; index: number }>();
  readonly controlId = `kit-timeline-scrubber-${++nextTimelineScrubberId}`;
  private readonly selected = signal(0);
  readonly maxIndex = computed(() => Math.max(0, this.events().length - 1));
  readonly index = computed(() => Math.min(this.selected(), this.maxIndex()));
  readonly event = computed(() => this.events()[this.index()]);
  readonly valueText = computed(() => {
    const event = this.event();
    return event ? `${event.time ?? ""} ${event.title}` : "No events";
  });

  select(next: number): void {
    if (this.disabled() || this.loading()) return;
    const index = Math.max(0, Math.min(this.maxIndex(), next));
    if (index === this.index()) return;
    this.selected.set(index);
    const event = this.events()[index];
    if (event) {
      this.onChange()?.(event, index);
      this.eventChange.emit({ event, index });
    }
  }

  scrub(event: Event): void {
    this.select(Number((event.target as HTMLInputElement).value));
  }
}

import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  effect,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import type { LiquidCommand } from "./types";

@Component({
  selector: "kit-liquid-command-palette",
  standalone: true,
  host: { style: "display:block" },
  template: ` <div class="kit-control">
    <button type="button" [disabled]="disabled()" (click)="open()">
      Find a command <kbd>⌘ / Ctrl K</kbd>
    </button>
    <dialog
      #dialog
      (close)="opened.set(false)"
      class="kit-dialog kit-control"
      aria-label="Command palette"
    >
      <div class="kit-stack">
        <div class="kit-row">
          <h3>Where next?</h3>
          <button type="button" (click)="close()">Close</button>
        </div>
        <input
          #search
          role="combobox"
          aria-label="Search commands"
          aria-autocomplete="list"
          aria-expanded="true"
          [attr.aria-controls]="listId"
          [attr.aria-activedescendant]="
            current() ? listId + '-' + current()!.id : null
          "
          [value]="query()"
          (input)="filter($event)"
          (keydown)="navigate($event)"
          placeholder="Search commands…"
        />
        <ul
          [id]="listId"
          role="listbox"
          aria-label="Commands"
          class="kit-list"
          style="max-height:45dvh;overflow:auto"
        >
          @for (command of results(); track command.id) {
            <li
              role="option"
              [id]="listId + '-' + command.id"
              [attr.aria-selected]="current()?.id === command.id"
              [attr.aria-disabled]="command.disabled"
              (mousedown)="$event.preventDefault()"
              (click)="run(command)"
              [style.opacity]="command.disabled ? 0.5 : 1"
              [style.cursor]="command.disabled ? 'not-allowed' : 'pointer'"
              [style.background]="current()?.id === command.id ? '#8883' : null"
              style="padding:.75rem;border-radius:.75rem"
            >
              {{ command.label }}
            </li>
          }
        </ul>
        @if (!results().length) {
          <p>No matching commands.</p>
        }
        <p role="status" class="kit-status">{{ status() }}</p>
      </div>
    </dialog>
  </div>`,
})
export class KitLiquidCommandPaletteComponent {
  readonly commands = input<LiquidCommand[], LiquidCommand[] | undefined>(sampleCommands, { transform: value => value === undefined ? sampleCommands : value });
  readonly disabled = input<boolean, boolean | undefined>(false, { transform: value => value === undefined ? false : value });
  readonly opened = signal(false);
  readonly query = signal("");
  readonly active = signal(0);
  readonly status = signal("");
  readonly busy = signal(false);
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog");
  readonly search = viewChild.required<ElementRef<HTMLInputElement>>("search");
  readonly listId =
    "kit-commands-" +
    inject(ElementRef).nativeElement.tagName.toLowerCase() +
    "-" +
    nextId++;
  readonly results = computed(() =>
    this.commands().filter((c) =>
      `${c.label} ${c.keywords ?? ""}`
        .toLowerCase()
        .includes(this.query().toLowerCase()),
    ),
  );
  readonly selectable = computed(() =>
    this.results().filter((c) => !c.disabled),
  );
  readonly current = computed(
    () =>
      this.selectable()[
        Math.min(this.active(), Math.max(0, this.selectable().length - 1))
      ],
  );
  private destroyed = false;
  constructor() {
    effect(onCleanup => {
      this.disabled();
      const listener = (event: KeyboardEvent) => this.shortcut(event);
      window.addEventListener("keydown", listener, true);
      onCleanup(() => window.removeEventListener("keydown", listener, true));
    });
    afterRenderEffect(() => {
      if (this.opened()) {
        this.dialog().nativeElement.showModal();
        this.search().nativeElement.focus();
      } else this.dialog().nativeElement.close();
    });
    afterRenderEffect(() => {
      const current = this.current();
      if (this.opened() && current)
        document.getElementById(`${this.listId}-${current.id}`)?.scrollIntoView?.({ block: "nearest" });
    });
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
    });
  }
  open(): void {
    if (this.disabled()) return;
    this.opened.set(true);
  }
  close(): void {
    this.opened.set(false);
  }
  shortcut(event: KeyboardEvent): void {
    if (event.defaultPrevented || this.disabled()) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (this.opened()) {
        this.close();
      } else {
        this.open();
      }
    }
  }
  filter(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(0);
  }
  navigate(event: KeyboardEvent): void {
    const count = Math.max(1, this.selectable().length);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      this.active.set(
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? count - 1
            : (this.active() + (event.key === "ArrowDown" ? 1 : -1) + count) %
              count,
      );

    }
    if (event.key === "Enter" && this.current()) {
      event.preventDefault();
      void this.run(this.current()!);
    }
  }
  async run(command: LiquidCommand): Promise<void> {
    if (command.disabled || this.busy()) return;
    this.busy.set(true);
    this.status.set("Running command…");
    try {
      await command.onSelect();
      if (!this.destroyed) {
        this.status.set("Command completed.");
        this.close();
      }
    } catch {
      if (!this.destroyed) this.status.set("Command failed. Try again.");
    } finally {
      if (!this.destroyed) this.busy.set(false);
    }
  }
}
let nextId = 0;

const sampleCommands: LiquidCommand[] = [
  { id: "home", label: "Go to home", onSelect: () => window.location.assign("/") },
  { id: "components", label: "Browse components", keywords: "library catalog", onSelect: () => window.location.assign("/components") },
  { id: "docs", label: "Read the documentation", onSelect: () => window.location.assign("/docs/introduction") },
];

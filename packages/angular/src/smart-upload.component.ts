import { Component, DestroyRef, inject, input, signal } from "@angular/core";
import { acceptsFile } from "./types";
import type { UploadHandler } from "./types";
interface UploadEntry {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  state: "ready" | "pending" | "success" | "error" | "cancelled";
  error?: string;
}

@Component({
  selector: "kit-smart-upload",
  standalone: true,
  host: { style: "display:block" },
  template: ` <section
    class="kit-control kit-surface kit-stack"
    aria-label="Smart upload"
    (dragover)="$event.preventDefault()"
    (drop)="drop($event)"
  >
    <label [attr.for]="inputId">Choose files or drop them here</label>
    <input
        [id]="inputId"
        type="file"
        multiple
        [accept]="accept()"
        [disabled]="disabled()"
        (change)="choose($event)"
    />
    <p class="kit-muted">
      Up to {{ maxFiles() }} files · {{ round(maxSize() / 1024 / 1024) }} MB each ·
      {{ accept() || "Any file type" }}
    </p>
    <ul class="kit-list">
      @for (entry of entries(); track entry.id) {
        <li class="kit-stack kit-surface">
          @if (entry.preview) {
            <img
              class="kit-preview"
              [src]="entry.preview"
              [alt]="'Preview of ' + entry.file.name"
            />
          }
          <p>{{ entry.file.name }}</p>
          <progress
            [value]="entry.progress"
            max="100"
            [attr.aria-label]="entry.file.name + ' upload progress'"
          ></progress>
          <p class="kit-status" role="status">
            {{ entry.error ?? entry.state }}
            {{ entry.state === "pending" ? round(entry.progress) + "%" : "" }}
          </p>
          <div class="kit-row">
            @if (entry.state === "pending") {
              <button type="button" (click)="cancel(entry)">Cancel</button>
            } @else if (entry.state !== "success") {
              <button
                type="button"
                [disabled]="disabled() || !upload()"
                (click)="send(entry)"
              >
                {{ entry.state === "ready" ? "Upload" : "Retry" }}
              </button>
            }
            <button
              type="button"
              [disabled]="disabled()"
              (click)="remove(entry)"
            >
              Remove <span class="sr-only">{{ entry.file.name }}</span>
            </button>
          </div>
        </li>
      }
    </ul>
    <p role="status" class="kit-status">{{ message() }}</p>
  </section>`,
})
export class KitSmartUploadComponent {
  readonly inputId = "kit-upload-" + nextUploadId++;
  readonly round = Math.round;
  readonly accept = input<string, string | undefined>("image/*,.pdf", { transform: value => value === undefined ? "image/*,.pdf" : value });
  readonly maxSize = input<number, number | undefined>(10 * 1024 * 1024, { transform: value => value === undefined ? 10 * 1024 * 1024 : value });
  readonly maxFiles = input<number, number | undefined>(5, { transform: value => value === undefined ? 5 : value });
  readonly disabled = input<boolean, boolean | undefined>(false, { transform: value => value === undefined ? false : value });
  readonly upload = input<UploadHandler>();
  readonly entries = signal<UploadEntry[]>([]);
  readonly message = signal("");
  private readonly controllers = new Map<string, AbortController>();
  private readonly urls = new Set<string>();
  private destroyed = false;
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.controllers.forEach((c) => c.abort());
      this.controllers.clear();
      this.urls.forEach((url) => URL.revokeObjectURL(url));
      this.urls.clear();
    });
  }
  choose(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.add(Array.from(input.files ?? []));
    input.value = "";
  }
  drop(event: DragEvent): void {
    event.preventDefault();
    this.add(Array.from(event.dataTransfer?.files ?? []));
  }
  private update(id: string, patch: Partial<UploadEntry>): void {
    if (!this.destroyed)
      this.entries.update((entries) =>
        entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      );
  }
  add(files: File[]): void {
    if (this.disabled()) return;
    let count = this.entries().length;
    const errors: string[] = [];
    const added: UploadEntry[] = [];
    for (const file of files) {
      if (count >= this.maxFiles()) {
        errors.push(`Only ${this.maxFiles()} files allowed.`);
        break;
      }
      if (file.size > this.maxSize()) {
        errors.push(`${file.name} exceeds ${Math.round(this.maxSize() / 1024 / 1024)} MB.`);
        continue;
      }
      if (!acceptsFile(file, this.accept())) {
        errors.push(`${file.name}: unsupported file type.`);
        continue;
      }
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;
      if (preview) this.urls.add(preview);
      added.push({
        id: crypto.randomUUID(),
        file,
        preview,
        progress: 0,
        state: "ready",
      });
      count++;
    }
    this.entries.update((entries) => [...entries, ...added]);
    this.message.set(errors.join(" ") || `${added.length} files ready.`);
  }
  async send(entry: UploadEntry): Promise<void> {
    const handler = this.upload();
    if (this.disabled() || this.controllers.has(entry.id)) return;
    if (!handler) {
      this.message.set("Connect an upload handler before sending files.");
      return;
    }
    const controller = new AbortController();
    this.controllers.set(entry.id, controller);
    this.update(entry.id, { state: "pending", progress: 0, error: undefined });
    try {
      await handler(entry.file, {
        signal: controller.signal,
        onProgress: (percent) => {
          if (
            !controller.signal.aborted &&
            this.controllers.get(entry.id) === controller
          )
            this.update(entry.id, {
              progress: Number.isFinite(percent)
                ? Math.max(0, Math.min(100, percent))
                : 0,
            });
        },
      });
      if (!controller.signal.aborted)
        this.update(entry.id, { state: "success", progress: 100 });
    } catch (error) {
      if (!controller.signal.aborted)
        this.update(entry.id, {
          state: "error",
          error: error instanceof Error ? error.message : "Upload failed.",
        });
    } finally {
      if (this.controllers.get(entry.id) === controller)
        this.controllers.delete(entry.id);
    }
  }
  cancel(entry: UploadEntry): void {
    this.controllers.get(entry.id)?.abort();
    this.controllers.delete(entry.id);
    this.update(entry.id, { state: "cancelled", progress: 0 });
  }
  remove(entry: UploadEntry): void {
    this.cancel(entry);
    if (entry.preview) {
      URL.revokeObjectURL(entry.preview);
      this.urls.delete(entry.preview);
    }
    this.entries.update((entries) => entries.filter((e) => e.id !== entry.id));
  }
}

let nextUploadId = 0;

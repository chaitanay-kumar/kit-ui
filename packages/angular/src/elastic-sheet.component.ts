import {
  Component,
  ElementRef,
  computed,
  input,
  output,
  signal,
  viewChild,
  TemplateRef,
} from "@angular/core";
import {NgTemplateOutlet} from '@angular/common';

export type ElasticSheetContent=TemplateRef<unknown>|string|number|boolean|null|undefined;

let sheetSequence = 0;

@Component({
  selector: "kit-elastic-sheet",
  standalone: true,
  imports: [NgTemplateOutlet],
  template: ` <div class="kit-control">
    <button type="button" [disabled]="disabled()" (click)="open()">
      Open elastic sheet ↗
    </button>
    <dialog
      #dialog
      class="kit-dialog kit-sheet kit-control"
      [style.height]="height() + 'dvh'"
      [attr.aria-labelledby]="titleId"
      (close)="origin = null"
    >
      <div class="kit-stack">
        <button
          type="button"
          class="kit-sheet-handle"
          aria-label="Resize sheet. Use arrow keys to change snap position"
          (keydown)="resizeKey($event)"
          (pointerdown)="start($event)"
          (pointermove)="drag($event)"
          (pointerup)="settle()"
          (pointercancel)="settle()"
        >
          Drag to resize
        </button>
        <div class="kit-row" style="justify-content:space-between">
          <h3 [id]="titleId">{{ title() }}</h3>
          <button type="button" (click)="close()">Close</button>
        </div>
        <div class="kit-row" aria-label="Sheet size">
          @for (position of positions(); track position) {
            <button
              type="button"
              [attr.aria-pressed]="height() === position"
              (click)="snap(position)"
            >
              {{ position }}%
            </button>
          }
        </div>
        <ng-template #projected><ng-content
          ><p class="kit-muted">
            A little space to think. Drag the handle, use its arrow keys, or
            choose a snap position. Escape closes the sheet.
          </p></ng-content
        ></ng-template>
        @if(children()!==undefined&&children()!==null){
          @if(childTemplate(children());as content){<ng-container [ngTemplateOutlet]="content"/>}
          @else{<ng-container>{{childText(children())}}</ng-container>}
        }@else{<ng-container [ngTemplateOutlet]="projected"/>}
      </div>
    </dialog>
  </div>`,
  host: { style: "display:block" },
})
export class KitElasticSheetComponent {
  readonly titleId = `kit-elastic-sheet-title-${++sheetSequence}`;
  readonly title = input<string,string|undefined>("Make room for the details",{transform:v=>v??"Make room for the details"});
  readonly disabled = input<boolean,boolean|undefined>(false,{transform:v=>v??false});
  readonly snapPositions = input<number[],number[]|undefined>([35, 65, 90],{transform:v=>v??[35,65,90]});
  readonly onSnapChange = input<((position:number)=>void)|undefined>();
  readonly children = input<ElasticSheetContent>();
  childTemplate(value:ElasticSheetContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}
  childText(value:ElasticSheetContent):string|number|null|undefined{return typeof value==='boolean'||value instanceof TemplateRef?'':value;}
  readonly snapChange = output<number>();
  readonly positions = computed(() => {
    const values = [
      ...new Set(
        this.snapPositions().filter(
          (n) => Number.isFinite(n) && n >= 20 && n <= 95,
        ),
      ),
    ].sort((a, b) => a - b);
    return values.length ? values : [35, 65, 90];
  });
  readonly height = signal(35);
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog");
  origin: { y: number; height: number } | null = null;
  ngOnInit(): void {
    this.height.set(this.positions()[0]);
  }
  open(): void {
    this.dialog().nativeElement.showModal();
  }
  close(): void {
    this.dialog().nativeElement.close();
    this.origin = null;
  }
  snap(value: number): void {
    const next = this.positions().reduce((a, b) =>
      Math.abs(b - value) < Math.abs(a - value) ? b : a,
    );
    this.height.set(next);
    this.onSnapChange()?.(next);
    this.snapChange.emit(next);
  }
  start(event: PointerEvent): void {
    this.origin = { y: event.clientY, height: this.height() };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  drag(event: PointerEvent): void {
    if (this.origin)
      this.height.set(
        Math.max(
          this.positions()[0],
          Math.min(
            this.positions().at(-1)!,
            this.origin.height +
              ((this.origin.y - event.clientY) / window.innerHeight) * 100,
          ),
        ),
      );
  }
  settle(): void {
    this.origin = null;
    this.snap(this.height());
  }
  resizeKey(event: KeyboardEvent): void {
    const positions = this.positions();
    const index = positions.indexOf(this.height());
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    this.snap(
      event.key === "Home"
        ? positions[0]
        : event.key === "End"
          ? positions.at(-1)!
          : positions[
              Math.max(
                0,
                Math.min(
                  positions.length - 1,
                  index + (event.key === "ArrowUp" ? 1 : -1),
                ),
              )
            ],
    );
  }
}

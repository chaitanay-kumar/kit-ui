import "../../packages/angular/styles.css";
import "../../src/styles/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "@angular/compiler";
import {
  Component,
  provideZonelessChangeDetection,
  signal,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
  KitDrawCheckboxComponent,
  KitLiquidToggleComponent,
} from "../../packages/angular/dist/fesm2022/kit-ui-angular.mjs";
import { DrawCheckbox } from "../../src/components/ui/DrawCheckbox";
import { LiquidToggle } from "../../src/components/ui/LiquidToggle";
type O = {
  controlled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  rich?: boolean;
  value?: boolean;
  defaultValue?: boolean;
  showLabels?: boolean;
  width?: number;
  height?: number;
  accentColor?: string;
};
const p = new URLSearchParams(location.search),
  kind = p.get("kind") || "draw",
  initial: O = JSON.parse(p.get("initial") || "{}"),
  api = window as any;
api.events = [];
if (p.get("framework") === "react") {
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node);
  api.setBatchOptions = (o: O) =>
    root.render(
      <div id="fixture">
        {kind === "draw" ? (
          <DrawCheckbox
            checked={o.controlled ? o.checked : undefined}
            defaultChecked={o.defaultChecked}
            indeterminate={o.indeterminate}
            disabled={o.disabled}
            label={o.rich ? <strong>Accept terms</strong> : "Accept terms"}
            description="Required choice"
            onChange={(e) => api.events.push(`change:${e.target.checked}`)}
          />
        ) : (
          <LiquidToggle
            value={o.controlled ? o.value : undefined}
            defaultValue={o.defaultValue}
            disabled={o.disabled}
            showLabels={o.showLabels}
            width={o.width}
            height={o.height}
            accentColor={o.accentColor}
            onChange={(v) => api.events.push(`change:${v}`)}
          />
        )}
      </div>,
    );
  api.setBatchOptions(initial);
} else {
  class C {
    readonly options = signal<O>(initial);
    readonly kind = kind;
    change = (event: Event) =>
      api.events.push(`change:${(event.target as HTMLInputElement).checked}`);
    toggle = (value: boolean) => api.events.push(`change:${value}`);
  }
  Component({
    selector: "batch-consumer",
    standalone: true,
    imports: [KitDrawCheckboxComponent, KitLiquidToggleComponent],
    template: `<div id="fixture">@if(kind==='draw'){<ng-template #rich><strong>Accept terms</strong></ng-template><kit-draw-checkbox [checked]="options().controlled?options().checked:undefined" [defaultChecked]="options().defaultChecked" [indeterminate]="options().indeterminate" [disabled]="options().disabled" [label]="options().rich?rich:'Accept terms'" description="Required choice" [onChange]="change"/>}@else{<kit-liquid-toggle [value]="options().controlled?options().value:undefined" [defaultValue]="options().defaultValue" [disabled]="options().disabled" [showLabels]="options().showLabels" [width]="options().width" [height]="options().height" [accentColor]="options().accentColor" [onChange]="toggle"/>}</div>`,
  })(C);
  document.body.append(document.createElement("batch-consumer"));
  void bootstrapApplication(C, {
    providers: [provideZonelessChangeDetection()],
  }).then(
    (app) =>
      (api.setBatchOptions = (o: O) =>
        app.components[0].instance.options.set(o)),
  );
}

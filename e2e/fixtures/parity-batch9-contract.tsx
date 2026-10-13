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
  KitLockInputComponent,
  KitOriginDropdownComponent,
  type OriginDropdownItem,
} from "../../packages/angular/dist/fesm2022/kit-ui-angular.mjs";
import { LockInput } from "../../src/components/ui/LockInput";
import { OriginDropdown } from "../../src/components/ui/OriginDropdown";
type O = {
  controlled?: boolean;
  value?: string;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
  icons?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  custom?: boolean;
};
const p = new URLSearchParams(location.search),
  kind = p.get("kind") || "lock",
  initial: O = JSON.parse(p.get("initial") || "{}"),
  api = window as any;
api.events = [];
const baseItems = [
  { id: "edit", label: "Edit profile", description: "Change details" },
  { id: "remove", label: "Remove", destructive: true },
  { id: "disabled", label: "Unavailable", disabled: true },
];
if (p.get("framework") === "react") {
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node);
  api.setBatchOptions = (o: O) =>
    root.render(
      <div id="fixture" style={{ padding: 80 }}>
        {kind === "lock" ? (
          <LockInput
            label="Email"
            description="Work address"
            error={o.error}
            value={o.controlled ? o.value : undefined}
            defaultValue={o.defaultValue}
            disabled={o.disabled}
            placeholder="name@example.com"
            leftIcon={o.icons ? <span>@</span> : undefined}
            rightIcon={o.icons ? <span>✓</span> : undefined}
            onChange={(e) => api.events.push(`change:${e.target.value}`)}
            onFocus={() => api.events.push("focus")}
            onBlur={() => api.events.push("blur")}
          />
        ) : (
          <OriginDropdown
            items={baseItems.map((item) => ({
              ...item,
              onSelect: () => api.events.push(`select:${item.id}`),
            }))}
            trigger={o.custom ? <strong>Actions</strong> : undefined}
            side={o.side}
            open={o.controlled ? o.open : undefined}
            defaultOpen={o.defaultOpen}
            onOpenChange={(v) => api.events.push(`open:${v}`)}
          >
            {o.custom ? (
              <button type="button" onClick={() => api.events.push("custom")}>
                Custom action
              </button>
            ) : undefined}
          </OriginDropdown>
        )}
      </div>,
    );
  api.setBatchOptions(initial);
} else {
  class C {
    readonly options = signal<O>(initial);
    readonly kind = kind;
    readonly items: OriginDropdownItem[] = baseItems.map((item) => ({
      ...item,
      onSelect: () => api.events.push(`select:${item.id}`),
    }));
    change = (e: Event) =>
      api.events.push(`change:${(e.target as HTMLInputElement).value}`);
    focus = () => api.events.push("focus");
    blur = () => api.events.push("blur");
    open = (v: boolean) => api.events.push(`open:${v}`);
    custom() {
      api.events.push("custom");
    }
  }
  Component({
    selector: "batch-consumer",
    standalone: true,
    imports: [KitLockInputComponent, KitOriginDropdownComponent],
    template: `<div id="fixture" style="padding:80px">@if(kind==='lock'){<ng-template #left><span>@</span></ng-template><ng-template #right><span>✓</span></ng-template><kit-lock-input label="Email" description="Work address" [error]="options().error" [value]="options().controlled?options().value:undefined" [defaultValue]="options().defaultValue" [disabled]="options().disabled" placeholder="name@example.com" [leftIcon]="options().icons?left:undefined" [rightIcon]="options().icons?right:undefined" [onChange]="change" [onFocus]="focus" [onBlur]="blur"/>}@else{<ng-template #trigger><strong>Actions</strong></ng-template><ng-template #content><button type="button" (click)="custom()">Custom action</button></ng-template><kit-origin-dropdown [items]="items" [trigger]="options().custom?trigger:undefined" [children]="options().custom?content:undefined" [side]="options().side" [open]="options().controlled?options().open:undefined" [defaultOpen]="options().defaultOpen" [onOpenChange]="open"/>}</div>`,
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

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
  KitFaqComponent,
  KitOtpInputComponent,
  type FAQItem,
} from "../../packages/angular/dist/fesm2022/kit-ui-angular.mjs";
import { FAQ } from "../../src/components/ui/FAQ";
import { OTPInput } from "../../src/components/ui/OTPInput";
type O = {
  controlled?: boolean;
  openIds?: string[];
  searchable?: boolean;
  categories?: boolean;
  multiple?: boolean;
  rich?: boolean;
  value?: string;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
};
const p = new URLSearchParams(location.search),
  kind = p.get("kind") || "faq",
  initial: O = JSON.parse(p.get("initial") || "{}"),
  api = window as any;
api.events = [];
const items = [
  {
    id: "install",
    question: "How do I install?",
    answer: "Use npm install.",
    category: "Setup",
    badge: "CLI",
  },
  {
    id: "theme",
    question: "How do themes work?",
    answer: "Use design tokens.",
    category: "Design",
  },
];
if (p.get("framework") === "react") {
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node);
  api.setBatchOptions = (o: O) =>
    root.render(
      <div id="fixture">
        {kind === "faq" ? (
          <FAQ
            items={
              o.rich
                ? [
                    {
                      ...items[0],
                      answer: (
                        <button
                          type="button"
                          onClick={() => api.events.push("rich")}
                        >
                          Rich answer
                        </button>
                      ),
                    },
                    items[1],
                  ]
                : items
            }
            defaultOpen="install"
            allowMultiple={o.multiple}
            openIds={o.controlled ? (o.openIds ?? []) : undefined}
            onOpenChange={(ids) => api.events.push(`open:${ids.join(",")}`)}
            searchable={o.searchable}
            showCategories={o.categories}
          />
        ) : (
          <OTPInput
            length={o.length}
            value={o.controlled ? o.value : undefined}
            disabled={o.disabled}
            autoFocus={o.autoFocus}
            onChange={(v) => api.events.push(`change:${v}`)}
            onComplete={(v) => api.events.push(`complete:${v}`)}
          />
        )}
      </div>,
    );
  api.setBatchOptions(initial);
} else {
  class C {
    readonly options = signal<O>(initial);
    readonly kind = kind;
    readonly items = items as FAQItem[];
    event(v: string) {
      api.events.push(v);
    }
    open = (v: string[]) => this.event(`open:${v.join(",")}`);
    change = (v: string) => this.event(`change:${v}`);
    complete = (v: string) => this.event(`complete:${v}`);
    recordRich() {
      this.event("rich");
    }
  }
  Component({
    selector: "batch-consumer",
    standalone: true,
    imports: [KitFaqComponent, KitOtpInputComponent],
    template: `<div id="fixture">@if(kind==='faq'){<ng-template #rich><button type="button" (click)="recordRich()">Rich answer</button></ng-template><kit-faq [items]="options().rich?[{id:'install',question:'How do I install?',answer:rich,category:'Setup',badge:'CLI'},items[1]]:items" defaultOpen="install" [allowMultiple]="options().multiple" [openIds]="options().controlled?(options().openIds??[]):undefined" [onOpenChange]="open" [searchable]="options().searchable" [showCategories]="options().categories"/>}@else{<kit-otp-input [length]="options().length" [value]="options().controlled?options().value:undefined" [disabled]="options().disabled" [autoFocus]="options().autoFocus" [onChange]="change" [onComplete]="complete"/>}</div>`,
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

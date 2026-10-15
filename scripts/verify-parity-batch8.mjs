import "@angular/compiler";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { ErrorHandler, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";
import {
  KitDrawCheckboxComponent,
  KitLiquidToggleComponent,
} from "../packages/angular/dist/fesm2022/kit-ui-angular.mjs";
const dom = new JSDOM("<html><body></body></html>");
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "Element",
  "Node",
])
  globalThis[key] = dom.window[key];
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
const errors = [];
TestBed.configureTestingModule({
  imports: [KitDrawCheckboxComponent, KitLiquidToggleComponent],
  providers: [
    provideZonelessChangeDetection(),
    { provide: ErrorHandler, useValue: { handleError: (e) => errors.push(e) } },
  ],
});
const draw = TestBed.createComponent(KitDrawCheckboxComponent),
  liquid = TestBed.createComponent(KitLiquidToggleComponent);
try {
  draw.componentRef.setInput("defaultChecked", true);
  draw.componentRef.setInput("indeterminate", true);
  draw.componentRef.setInput("label", "Accept");
  draw.componentRef.setInput("description", "Required choice");
  let checked = false;
  draw.componentRef.setInput("onChange", (event) => {
    checked = event.target.checked;
  });
  draw.detectChanges();
  TestBed.tick();
  draw.detectChanges();
  const input = draw.nativeElement.querySelector("input");
  assert.equal(input.checked, true);
  assert.equal(input.indeterminate, true);
  input.checked = false;
  draw.componentInstance.change({ target: input });
  draw.detectChanges();
  assert.equal(checked, input.checked);
  assert.equal(draw.componentInstance.current(), checked);
  draw.componentRef.setInput("checked", true);
  draw.detectChanges();
  input.click();
  draw.detectChanges();
  assert.equal(draw.componentInstance.current(), true);
  liquid.componentRef.setInput("defaultValue", true);
  liquid.componentRef.setInput("width", 72);
  liquid.componentRef.setInput("height", 40);
  let changed;
  liquid.componentRef.setInput("onChange", (value) => {
    changed = value;
  });
  liquid.detectChanges();
  TestBed.tick();
  liquid.detectChanges();
  assert.equal(liquid.componentInstance.isOn(), true);
  assert.equal(
    liquid.nativeElement
      .querySelector("[role=switch]")
      .getAttribute("aria-checked"),
    "true",
  );
  liquid.componentInstance.key({ key: "ArrowLeft", preventDefault() {} });
  liquid.detectChanges();
  assert.equal(changed, false);
  assert.equal(liquid.componentInstance.isOn(), false);
  liquid.componentRef.setInput("value", true);
  liquid.detectChanges();
  liquid.componentInstance.toggle();
  assert.equal(changed, false);
  assert.equal(liquid.componentInstance.isOn(), true);
  assert.match(liquid.componentInstance.blobPath(), /^M /);
  assert.deepEqual(errors, []);
  console.log("Batch 8 packaged checkbox and liquid switch contracts pass.");
} finally {
  draw.destroy();
  liquid.destroy();
  TestBed.resetTestingModule();
  dom.window.close();
}

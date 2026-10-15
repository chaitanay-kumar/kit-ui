import {selectionBasketPort} from './angular-selection-basket';
import {meteorsPort} from './angular-meteors';
import {gravityParticleBurstPort} from './angular-gravity-particle-burst';
import {densityLensPort} from './angular-density-lens';
import {dotFieldPort} from './angular-dot-field';
import {floatingActionDockPort} from './angular-floating-action-dock';
import {morphingBlobPort} from './angular-morphing-blob';
import {circularOrbitPort} from './angular-circular-orbit';
import {textScrambleDecoderPort} from './angular-text-scramble-decoder';
import {animatedNumberPort} from './angular-animated-number';
import {unfoldAccordionPort} from './angular-unfold-accordion';
import {iosSearchPort} from './angular-ios-search';
import {stretchSwitchPort} from "./angular-stretch-switch";
/** Authored native implementations. Generation keeps exports, demos and API docs aligned. */
import {smoothAccordionPort} from "./angular-smooth-accordion";
import { agentActivityPort } from "./angular-agent-activity";
import {loaderPort} from "./angular-loader";
import {pressButtonPort} from "./angular-press-button";
import {hamburgerMenuPort} from "./angular-hamburger-menu";
import {magneticButtonPort} from "./angular-magnetic-button";
import {morphingButtonPort} from "./angular-morphing-button";
import {typewriterButtonPort} from "./angular-typewriter-button";
import {rainbowButtonPort} from "./angular-rainbow-button";
import {expandableSearchPort} from "./angular-expandable-search";
import {buttonPort} from "./angular-button";
import {neonEdgeButtonPort} from "./angular-neon-edge-button";
import {orbitalLoadingRingPort} from "./angular-orbital-loading-ring";
import {revealCardPort} from "./angular-reveal-card";
import {spotlightCardPort} from "./angular-spotlight-card";
import {morphingIconPort} from "./angular-morphing-icon";
import fs from "node:fs";
import path from "node:path";
import { CATALOG_INDEX } from "../src/components/registry/catalog-index";
import { activityFeedPort } from "./angular-activity-feed";
import { faqPort } from "./angular-faq";
import { otpInputPort } from "./angular-otp-input";
import { drawCheckboxPort } from "./angular-draw-checkbox";
import { liquidTogglePort } from "./angular-liquid-toggle";
import { lockInputPort } from "./angular-lock-input";
import { originDropdownPort } from "./angular-origin-dropdown";
import { paymentStatusPort } from "./angular-payment-status";
import { notificationBellPort } from "./angular-notification-bell";
import { notFoundPort } from "./angular-not-found";
import { paymentReceiptPrinterPort } from "./angular-payment-receipt-printer";
import { focusModePort } from "./angular-focus-mode";
import { avatarStackPort } from "./angular-avatar-stack";
import { notificationStackPort } from "./angular-notification-stack";
import { undoToastPort } from "./angular-undo-toast";
import { introLoaderPort } from "./angular-intro-loader";
import { morphingShapeLoaderPort } from "./angular-morphing-shape-loader";
import { glitchTextPort } from "./angular-glitch-text";
import { directionalTooltipPort } from "./angular-directional-tooltip";
import { airportMatrixClockPort } from "./angular-airport-matrix-clock";
import { metricHudPort } from "./angular-metric-hud";
import { peekCardPort } from "./angular-peek-card";
import { profileCardPort } from "./angular-profile-card";
import { pillNavigationPort } from "./angular-pill-navigation";
import { slidePaginationPort } from "./angular-slide-pagination";
import { bookCallButtonPort } from "./angular-book-call-button";
import { splitButtonPort } from "./angular-split-button";
import { cursorFollowerPort } from "./angular-cursor-follower";
import { liquidRippleButtonPort } from "./angular-liquid-ripple-button";
const root = process.cwd();
type Kind = "action" | "collection" | "form" | "canvas" | "plain";
interface Port {
  id: string;
  kind: Kind;
  template: string;
  body: string;
  inputs: string[];
  outputs: string[];
  description: string;
  imports?: string;
  componentImports?: string;
  controller?: string;
  typeParameters?: string;
  providers?: string;
  stylesFile?: string;
  hostMetadata?: string;
  componentSelector?: string;
}
const ports: Port[] = [];
const common: Record<Kind, { inputs: string[]; outputs: string[] }> = {
  action: {
    inputs: [
      "label: string",
      "disabled: boolean",
      "loading: boolean",
      "action: KitAction",
    ],
    outputs: ["activated: void"],
  },
  collection: {
    inputs: [
      "items: KitItem[]",
      "label: string",
      "disabled: boolean",
      "loading: boolean",
      "error: string",
      "selected: string (two-way)",
      "selectedIds: string[] (two-way)",
      "action: KitCollectionAction",
    ],
    outputs: [
      "itemSelect: KitItem",
      "actionRequested: KitItem[]",
      "actionComplete: KitItem[]",
    ],
  },
  form: {
    inputs: [
      "fields: KitField[]",
      "label: string",
      "disabled: boolean",
      "submitHandler: KitSubmitHandler",
    ],
    outputs: ["submitted: Record<string, string>"],
  },
  canvas: {
    inputs: [
      "label: string",
      "density: number (1–400)",
      "speed: number (0–5)",
      "color: string",
      "paused: boolean",
      "disabled: boolean",
    ],
    outputs: [],
  },
  plain: { inputs: [], outputs: [] },
};
function add(
  id: string,
  kind: Kind,
  description: string,
  template: string,
  body = "",
  extra: Partial<Port> = {},
) {
  ports.push({
    id,
    kind,
    description,
    template,
    body,
    inputs: [...common[kind].inputs, ...(extra.inputs ?? [])],
    outputs: [...common[kind].outputs, ...(extra.outputs ?? [])],
    imports: extra.imports,
    componentImports: extra.componentImports,
    componentSelector: extra.componentSelector,
    controller: extra.controller,
    typeParameters: extra.typeParameters,
    providers: extra.providers,
    stylesFile: extra.stylesFile,
    hostMetadata: extra.hostMetadata,

  });
}
const actionFeedback = `<p role="status" class="kit-status">{{loading() || busy() ? 'Working…' : status()}}</p>@if(error()){<p role="alert">{{error()}}</p>}@if(busy()){<button type="button" (click)="cancel()">Cancel</button>}`;
const collectionFeedback = `@if(loading()){<p role="status">Loading…</p>}@if(error()){<p role="alert">{{error()}}</p>}@if(actionError()){<p role="alert">{{actionError()}}</p>}<p role="status" class="kit-status">{{busy()?'Working…':status()}}</p>`;
const itemButton = `<button type="button" data-item [disabled]="disabled() || item.disabled" [attr.aria-pressed]="current()?.id===item.id" (click)="select(item)">{{item.label}}</button>`;

add("press-button","plain",pressButtonPort.description,pressButtonPort.template,pressButtonPort.body,pressButtonPort);
add("typewriter-button","plain",typewriterButtonPort.description,typewriterButtonPort.template,typewriterButtonPort.body,typewriterButtonPort);
add("expandable-search","plain",expandableSearchPort.description,expandableSearchPort.template,expandableSearchPort.body,expandableSearchPort);
add("button","plain",buttonPort.description,buttonPort.template,buttonPort.body,buttonPort);
add("neon-edge-button","plain",neonEdgeButtonPort.description,neonEdgeButtonPort.template,neonEdgeButtonPort.body,neonEdgeButtonPort);

add("morphing-button","plain",morphingButtonPort.description,morphingButtonPort.template,morphingButtonPort.body,morphingButtonPort);
add("rainbow-button","plain",rainbowButtonPort.description,rainbowButtonPort.template,rainbowButtonPort.body,rainbowButtonPort);

add("hamburger-menu","plain",hamburgerMenuPort.description,hamburgerMenuPort.template,hamburgerMenuPort.body,hamburgerMenuPort);
add("magnetic-button","plain",magneticButtonPort.description,magneticButtonPort.template,magneticButtonPort.body,magneticButtonPort);
add("liquid-ripple-button","plain",liquidRippleButtonPort.description,liquidRippleButtonPort.template,liquidRippleButtonPort.body,liquidRippleButtonPort);
/* Legacy split and book-call actions replaced by authored React-contract ports.
add(
  "split-button",
  "action",
  "A primary action with a separately accessible action chooser.",
  `<div class="kit-control kit-stack"><div class="kit-row"><button type="button" [disabled]="blocked()" (click)="run()">{{label()||'Publish'}}</button><details class="k-menu"><summary>More actions</summary><div class="k-menu-panel">@for(option of options();track option.id){<button type="button" [disabled]="blocked()||option.disabled" (click)="choose(option,$event)">{{option.label}}</button>}</div></details></div>${actionFeedback}</div>`,
  `readonly options=input<KitItem[]>([{id:'draft',label:'Save draft'},{id:'schedule',label:'Schedule'}]);readonly optionSelect=output<KitItem>();choose(option:KitItem,event:Event):void{if(this.blocked()||option.disabled)return;this.optionSelect.emit(option);this.status.set(option.label+' requested.');(event.currentTarget as HTMLElement).closest('details')?.removeAttribute('open');}`,
  { inputs: ["options: KitItem[]"], outputs: ["optionSelect: KitItem"] },
);
add(
  "book-call-button",
  "action",
  "A date/time booking dialog that emits a request for your scheduling application.",
  `<div class="kit-control kit-stack"><button type="button" [disabled]="blocked()" (click)="dialog().nativeElement.showModal()">{{label()||'Book a call'}}</button><dialog #booking class="kit-dialog kit-control"><form class="kit-stack" (submit)="book($event)"><h3>Find a time</h3><label>Date<input type="date" required [min]="today" (input)="date.set($any($event.target).value)" /></label><label>Time<input type="time" required (input)="time.set($any($event.target).value)" /></label><div class="kit-row"><button type="button" (click)="dialog().nativeElement.close()">Cancel</button><button type="submit" [disabled]="blocked()">Request booking</button></div></form></dialog>${actionFeedback}</div>`,
  `readonly dialog=viewChild.required<ElementRef<HTMLDialogElement>>('booking');readonly date=signal('');readonly time=signal('');readonly bookingRequested=output<{date:string;time:string}>();readonly today=new Date().toISOString().slice(0,10);book(event:SubmitEvent):void{event.preventDefault();if(!this.date()||!this.time()||this.blocked())return;this.bookingRequested.emit({date:this.date(),time:this.time()});this.dialog().nativeElement.close();this.status.set('Booking requested. Your application confirms availability.');}`,
  { outputs: ["bookingRequested: { date: string; time: string }"] },
);
*/
add("split-button","plain",splitButtonPort.description,splitButtonPort.template,splitButtonPort.body,splitButtonPort);
add("book-call-button","plain",bookCallButtonPort.description,bookCallButtonPort.template,bookCallButtonPort.body,bookCallButtonPort);
add(
  "drag-to-confirm",
  "action",
  "Slide to the end to request confirmation, with arrow-key and explicit button alternatives.",
  `<div class="kit-control kit-stack"><label>{{label()||'Slide to confirm'}}<input type="range" min="0" max="100" [value]="value()" [disabled]="blocked()" aria-label="Confirmation progress" [attr.aria-valuetext]="value()+' percent'" (input)="value.set(+$any($event.target).value)" (change)="finish()" /></label><button type="button" [disabled]="blocked()||value()<100" (click)="run()">Confirm</button>${actionFeedback}</div>`,
  `readonly value=model(0);finish():void{if(this.value()>=100)void this.run();else this.value.set(0);}`,
  { inputs: ["value: number (two-way)"] },
);
add(
  "code-snippet-deck",
  "collection",
  "Browse code snippets and copy the selected snippet with visible failure feedback.",
  `<div class="kit-control kit-surface kit-stack"><div class="kit-row" (keydown)="keys($event)">@for(item of items();track item.id){${itemButton}}</div><pre class="k-code">{{current()?.description}}</pre><button type="button" [disabled]="disabled()||!current()" (click)="copy()">Copy snippet</button>${collectionFeedback}</div>`,
  `override readonly items=input<KitItem[]>([{id:'install',label:'Install',description:'npm install ./kit-ui-angular-0.1.0.tgz'},{id:'import',label:'Import',description:"import { KitButtonComponent } from 'kit-ui-angular';"}]);async copy():Promise<void>{try{await navigator.clipboard.writeText(this.current()?.description??'');this.status.set('Copied.');}catch{this.actionError.set('Clipboard unavailable. Select and copy the snippet manually.');}}`,
);

add("stretch-switch","plain",stretchSwitchPort.description,stretchSwitchPort.template,stretchSwitchPort.body,stretchSwitchPort);

add("draw-checkbox", "plain", drawCheckboxPort.description, drawCheckboxPort.template, drawCheckboxPort.body.replace("readonly internal=signal(false);", "readonly internal=signal<boolean|undefined>(undefined);").replace("readonly current=computed(()=>this.checked()??this.internal());", "readonly current=computed(()=>this.checked()??this.internal()??this.defaultChecked());").replace("constructor(){effect(()=>{this.defaultChecked();untracked(()=>{if(this.checked()===undefined&&!this.initialized){this.initialized=true;this.internal.set(this.defaultChecked());}});});}private initialized=false;", "").replace("this.onChange()?.(event);}", "this.onChange()?.(event);if(this.checked()!==undefined)input.checked=this.checked()!;}").replace("this.host.nativeElement.querySelector<HTMLInputElement>('input')?.click()", "(this.host.nativeElement.querySelector('input') as HTMLInputElement|null)?.click()"), drawCheckboxPort);
add("liquid-toggle", "plain", liquidTogglePort.description, liquidTogglePort.template.replace("isOn()?.7:0", "isOn() ? .7 : 0"), liquidTogglePort.body.replace("readonly internal=signal(false);", "readonly internal=signal<boolean|undefined>(undefined);").replace("readonly isOn=computed(()=>this.value()??this.internal());", "readonly isOn=computed(()=>this.value()??this.internal()??this.defaultValue());").replace("private initialized=false;constructor(){effect(()=>{this.defaultValue();untracked(()=>{if(this.value()===undefined&&!this.initialized){this.initialized=true;this.internal.set(this.defaultValue());}});});}", ""), liquidTogglePort);
add(
  "spring-select",
  "collection",
  "A native accessible select with keyboard typeahead and selected-item output.",
  `<div class="kit-control kit-stack"><label>{{label()||'Choose a workspace'}}<select [disabled]="disabled()||loading()" [value]="current()?.id" (change)="pick($event)">@for(item of items();track item.id){<option [value]="item.id" [disabled]="item.disabled">{{item.label}}</option>}</select></label><p>{{current()?.description}}</p>${collectionFeedback}</div>`,
  `pick(event:Event):void{const item=this.items().find(i=>i.id===(event.target as HTMLSelectElement).value);if(item)this.select(item);}`,
);
add("otp-input", "plain", otpInputPort.description, otpInputPort.template, otpInputPort.body, otpInputPort);
add("lock-input", "plain", lockInputPort.description, lockInputPort.template, lockInputPort.body, lockInputPort);
for (const [id, title, button] of [
  ["form", "Your details", "Submit"],
  ["login", "Welcome back", "Sign in"],
  ["sign-up", "Create an account", "Create account"],
]) {
  add(
    id,
    "form",
    "Validated native fields, password visibility, cancellable application submission and preserved errors.",
    `<form class="kit-control kit-surface kit-stack" aria-label="${title}" (submit)="submit($event)"><h3>{{label()||'${title}'}}</h3>@for(field of fields();track field.key){<label [for]="uid+'-'+field.key">{{field.label}}<input [id]="uid+'-'+field.key" [name]="field.key" [type]="field.type==='password'&&showPassword()?'text':field.type||'text'" [attr.autocomplete]="field.type==='password'?'${id === "sign-up" ? "new-password" : "current-password"}':field.type==='email'?'email':'on'" [required]="field.required||false" [attr.minlength]="field.minLength??null" [value]="values()[field.key]||''" [disabled]="disabled()||busy()" (input)="change(field.key,$event)" /></label>}<label class="kit-row"><input type="checkbox" [checked]="showPassword()" (change)="showPassword.set($any($event.target).checked)" />Show password</label><button type="submit" [disabled]="disabled()||busy()">{{busy()?'Submitting…':'${button}'}}</button>@if(busy()){<button type="button" (click)="cancel()">Cancel</button>}<p role="status">{{status()}}</p>@if(error()){<p role="alert">{{error()}}</p>}</form>`,
  );
}
add(
  "animated-file-upload",
  "plain",
  "File previews, validation, progress, abort and retry using the native Angular upload engine.",
  `<kit-smart-upload [accept]="accept()" [maxFiles]="maxFiles()" [maxSize]="maxSize()" [disabled]="disabled()" [upload]="upload()" />`,
  `readonly accept=input('image/*,.pdf');readonly maxFiles=input(5);readonly maxSize=input(10*1024*1024);readonly disabled=input(false);readonly upload=input<UploadHandler>();`,
  {
    inputs: [
      "accept: string",
      "maxFiles: number",
      "maxSize: number",
      "disabled: boolean",
      "upload: UploadHandler",
    ],
    imports:
      "import { KitSmartUploadComponent } from './smart-upload.component';\nimport type { UploadHandler } from './types';",
    componentImports: "KitSmartUploadComponent",
  },
);

// Navigation: distinct layouts use the same selection and keyboard contracts.
for (const [id, layout] of [
  ["animated-tabs", "tabs"],
  ["glass-navbar", "glass"],
  ["small-floating-dock", "small-dock"],
]) {
  const tabs = id === "animated-tabs";
  add(
    id,
    "collection",
    "Keyboard-navigable selection with active state, disabled items and application navigation output.",
    `<div class="kit-control kit-stack"><nav class="k-nav k-${layout}" aria-label="${id}" ${tabs ? 'role="tablist"' : ""} (keydown)="keys($event)">@for(item of items();track item.id){<button type="button" data-item ${tabs ? 'role="tab" [attr.aria-selected]="current()?.id===item.id" [id]="uid+\'-tab-\'+item.id" [attr.aria-controls]="uid+\'-panel\'"' : "[attr.aria-current]=\"current()?.id===item.id?'page':null\""} [disabled]="disabled()||item.disabled" (click)="select(item)">{{item.label}}</button>}</nav><section ${tabs ? 'role="tabpanel" [id]="uid+\'-panel\'" [attr.aria-labelledby]="uid+\'-tab-\'+current()?.id"' : ""}><ng-content><p>{{current()?.description}}</p></ng-content></section>${collectionFeedback}</div>`,
  );
}
add('floating-action-dock','plain',floatingActionDockPort.description,floatingActionDockPort.template,floatingActionDockPort.body,floatingActionDockPort);
for (const [id, title] of [
  ["gooey-menu", "Explore"],
]) {
  add(
    id,
    "collection",
    "An expandable action menu with Escape, arrow keys and disabled-item handling.",
    `<div class="kit-control kit-stack" (keydown.escape)="open.set(false)"><div class="k-menu"><button type="button" [disabled]="disabled()" [attr.aria-expanded]="open()" [attr.aria-controls]="uid" (click)="open.set(!open())"><span aria-hidden="true">{{open()?'×':'☰'}}</span> {{label()||'${title}'}}</button>@if(open()){<div [id]="uid" class="k-menu-panel" (keydown)="keys($event)">@for(item of items();track item.id){<button type="button" data-item [disabled]="item.disabled||disabled()" (click)="select(item);open.set(false)">{{item.label}}</button>}</div>}</div>${collectionFeedback}</div>`,
  );
}
add("pill-navigation","plain",pillNavigationPort.description,pillNavigationPort.template,pillNavigationPort.body,pillNavigationPort);
add("origin-dropdown", "plain", originDropdownPort.description, originDropdownPort.template, originDropdownPort.body, originDropdownPort);
add(
  "branching-submenu",
  "collection",
  "Parent and child navigation with keyboard selection and independently disclosed branches.",
  `<nav class="kit-control kit-surface kit-stack" aria-label="Branching navigation" (keydown)="keys($event)">@for(item of items();track item.id){<details><summary>{{item.label}}</summary><div class="kit-stack">@for(child of item.children||[];track child.id){<button type="button" data-item [disabled]="disabled()||child.disabled" (click)="select(child)">{{child.label}}</button>}@if(!item.children?.length){${itemButton}}</div></details>}<p role="status">{{selected()?'Selected: '+selected():''}}</p></nav>`,
);
add("ios-search-bar","plain",iosSearchPort.description,iosSearchPort.template,iosSearchPort.body,iosSearchPort);
for (const id of ["command-menu", "spotlight-search"]) {
  add(
    id,
    "plain",
    "A native modal command search with keyboard navigation, async errors and focus restoration.",
    `<kit-liquid-command-palette [commands]="commands()" [disabled]="disabled()" />`,
    `readonly commands=input<LiquidCommand[]>([{id:'home',label:'Go home',onSelect:()=>this.commandSelect.emit('home')},{id:'docs',label:'Open documentation',onSelect:()=>this.commandSelect.emit('docs')}]);readonly disabled=input(false);readonly commandSelect=output<string>();`,
    {
      inputs: ["commands: LiquidCommand[]", "disabled: boolean"],
      outputs: ["commandSelect: string"],
      imports:
        "import { KitLiquidCommandPaletteComponent } from './liquid-command-palette.component';\nimport type { LiquidCommand } from './types';",
      componentImports: "KitLiquidCommandPaletteComponent",
    },
  );
}
add(
  "dynamic-island",
  "collection",
  "A compact status island that expands to reveal actions and their current state.",
  `<section class="kit-control kit-stack"><div class="k-island"><button type="button" [disabled]="disabled()" [attr.aria-expanded]="open()" [attr.aria-controls]="uid" (click)="open.set(!open())">● {{label()||'Workspace activity'}} {{loading()?'· Working':''}}</button>@if(open()){<div class="kit-stack" [id]="uid" (keydown)="keys($event)">@for(item of items();track item.id){${itemButton}}</div>}</div>${collectionFeedback}</section>`,
);
/* Legacy pagination replaced by the authored React-contract port.
add(
  "slide-pagination",
  "plain",
  "Bounded page navigation with direct page buttons, arrow keys and two-way page binding.",
  `<nav class="kit-control kit-row" aria-label="Pagination" (keydown)="keys($event)"><button type="button" [disabled]="disabled()||safePage()<=1" (click)="go(safePage()-1)">Previous</button>@for(p of visiblePages();track p){<button type="button" [disabled]="disabled()" [attr.aria-current]="p===safePage()?'page':null" (click)="go(p)">{{p}}</button>}<button type="button" [disabled]="disabled()||safePage()>=total()" (click)="go(safePage()+1)">Next</button><span role="status">Page {{safePage()}} of {{total()}}</span></nav>`,
  `readonly page=model(1);readonly totalPages=input(10);readonly disabled=input(false);readonly total=computed(()=>Math.max(1,Math.floor(this.totalPages())));readonly safePage=computed(()=>Math.max(1,Math.min(this.total(),this.page())));readonly visiblePages=computed(()=>Array.from({length:Math.min(5,this.total())},(_,i)=>Math.max(1,Math.min(this.total()-4,this.safePage()-2))+i));go(page:number):void{if(!this.disabled())this.page.set(Math.max(1,Math.min(this.total(),page)));}keys(event:KeyboardEvent):void{if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)){event.preventDefault();this.go(event.key==='Home'?1:event.key==='End'?this.total():this.safePage()+(event.key==='ArrowRight'?1:-1));}}`,
  {
    inputs: [
      "page: number (two-way)",
      "totalPages: number",
      "disabled: boolean",
    ],
  },
);
*/
add("slide-pagination","plain",slidePaginationPort.description,slidePaginationPort.template,slidePaginationPort.body,slidePaginationPort);
add(
  "scroll-progress-nav",
  "collection",
  "A contained section navigator with scroll progress and reduced-motion-aware anchor actions.",
  `<div class="kit-control kit-stack"><nav class="kit-row" aria-label="Section navigation" (keydown)="keys($event)">@for(item of items();track item.id){<button type="button" data-item [disabled]="disabled()||item.disabled" (click)="jump(item)">{{item.label}}</button>}</nav><progress aria-label="Reading progress" max="100" [value]="progress()"></progress><div #scroller class="k-scroll-page" (scroll)="track($event)">@for(item of items();track item.id){<section [id]="uid+'-'+item.id" class="k-scroll-section"><h3>{{item.label}}</h3><p>{{item.description}}</p></section>}</div></div>`,
  `readonly progress=signal(0);readonly scroller=viewChild.required<ElementRef<HTMLElement>>('scroller');jump(item:KitItem):void{this.select(item);const node=Array.from(this.scroller().nativeElement.children).find(el=>el.id===this.uid+'-'+item.id) as HTMLElement|undefined;this.scroller().nativeElement.scrollTo({top:node?.offsetTop?node.offsetTop-this.scroller().nativeElement.offsetTop:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}track(event:Event):void{const el=event.target as HTMLElement;this.progress.set(el.scrollHeight<=el.clientHeight?100:el.scrollTop/(el.scrollHeight-el.clientHeight)*100);}`,
);

add("activity-feed", "plain", activityFeedPort.description, activityFeedPort.template, "", activityFeedPort);

add("smooth-accordion","plain",smoothAccordionPort.description,smoothAccordionPort.template,smoothAccordionPort.body,smoothAccordionPort);

// Expandable information and selectable collections.
add("faq", "plain", faqPort.description, faqPort.template, faqPort.body.replace("input.required<FAQItem[]>()", "input<FAQItem[]>([])") , faqPort);
for (const [id, title] of [
  ["stack-unfold-panel", "Your workspace"],
  ["expandable-data-row", "Data details"],
  ["recovery-ledger", "Recovery ledger"],
]) {
  add(
    id,
    "collection",
    "Expandable item details with keyboard-native disclosure and application-owned recovery actions.",
    `<section class="kit-control kit-surface kit-stack"><h3>{{label()||'${title}'}}</h3>@for(item of items();track item.id){<details class="k-disclosure"><summary>{{item.label}} @if(item.value!==undefined){<span>{{item.value}}</span>}</summary><div class="kit-stack"><p>{{item.description}}</p><ng-content></ng-content>${id === "recovery-ledger" ? '<button type="button" [disabled]="disabled()||busy()||item.disabled" (click)="execute([item])">Restore snapshot</button>' : ""}</div></details>}@empty{<p>No items yet.</p>}${collectionFeedback}</section>`,
  );
}
add('ai-agent-activity','plain',agentActivityPort.description,agentActivityPort.template,agentActivityPort.body,agentActivityPort);
for (const [id, title] of [

  ["interactive-timeline", "Your timeline"],
]) {
  add(
    id,
    "collection",
    "Filter chronological events, inspect event payloads and select an event without simulated network activity.",
    `<section class="kit-control kit-surface kit-stack"><h3>{{label()||'${title}'}}</h3><label>Filter events<input type="search" [value]="query()" (input)="search($event)" [disabled]="disabled()" /></label><ol class="k-timeline">@for(item of visible();track item.id){<li><details><summary><span class="k-event-dot" aria-hidden="true"></span>{{item.label}} <small>{{item.status||item.value}}</small></summary><p>{{item.description}}</p><button type="button" [disabled]="disabled()||item.disabled" (click)="select(item)">Inspect event</button></details></li>}@empty{<li>No matching events.</li>}</ol>${collectionFeedback}</section>`,
  );
}
add('selection-basket','plain',selectionBasketPort.description,selectionBasketPort.template,selectionBasketPort.body,selectionBasketPort);
for (const [id, title] of [
  ["batch-gesture-tray", "Batch selection"],
]) {
  add(
    id,
    "collection",
    "Select individual items or all items, then run a cancellable application-owned batch action.",
    `<section class="kit-control kit-surface kit-stack"><h3>{{label()||'${title}'}}</h3><div class="kit-row"><button type="button" [disabled]="disabled()||busy()" (click)="selectedIds.set(items().filter(enabled).map(itemId))">Select all</button><button type="button" [disabled]="disabled()||busy()" (click)="selectedIds.set([])">Clear selection</button></div>@for(item of items();track item.id){<label class="kit-row"><input type="checkbox" [checked]="selectedIds().includes(item.id)" [disabled]="disabled()||busy()||item.disabled" (change)="choose(item)" /><span>{{item.label}}</span></label>}<div class="k-tray"><span>{{selectedIds().length}} selected</span><button type="button" [disabled]="disabled()||busy()||!selectedIds().length" (click)="execute()">{{busy()?'Applying…':'Apply to selected'}}</button></div>${collectionFeedback}</section>`,
    `readonly enabled=(item:KitItem)=>!item.disabled;readonly itemId=(item:KitItem)=>item.id;`,
  );
}
for (const [id, title] of [
  ["velocity-toast", "Update available"],
]) {
  const bell = id === "notification-bell",
    toast = id.endsWith("toast");
  add(
    id,
    "collection",
    "Dismissible notifications with restore actions and restrained live announcements.",
    `<section class="kit-control kit-stack">${bell ? '<button type="button" [disabled]="disabled()" [attr.aria-expanded]="open()" (click)="open.set(!open())">♧ {{label()||\'Notifications\'}} ({{visible().length}})</button>@if(open()){' : ""}<div class="k-notification-stack">@for(item of visible();track item.id){<article class="kit-surface kit-stack"><strong>{{${toast ? "label()||'" + title + "'" : "item.label"}}}</strong><p>{{item.description}}</p><div class="kit-row"><button type="button" [disabled]="disabled()" (click)="dismiss(item)">Dismiss <span class="sr-only">{{item.label}}</span></button>${id === "undo-toast" ? '<button type="button" [disabled]="disabled()||busy()" (click)="execute([item])">Undo action</button>' : ""}</div></article>}@empty{<p>No notifications.</p>}</div>${bell ? "}" : ""}@if(dismissed().length){<button type="button" (click)="undo()" [disabled]="disabled()">Restore notifications</button>}${collectionFeedback}</section>`,
    toast
      ? `override readonly items=input<KitItem[]>([{id:'notice',label:'${title}',description:'A local notification. Connect actions to your application.'}]);`
      : "",
  );
}
add("notification-stack","plain",notificationStackPort.description,notificationStackPort.template,notificationStackPort.body,notificationStackPort);
add("undo-toast","plain",undoToastPort.description,undoToastPort.template,undoToastPort.body,undoToastPort);
add("notification-bell","plain",notificationBellPort.description,notificationBellPort.template,notificationBellPort.body,notificationBellPort);
add(
  "pull-to-refresh",
  "action",
  "Pull down within a contained list or use a keyboard refresh button; async failures remain retryable.",
  `<section class="kit-control kit-surface kit-stack"><div class="k-pull" style="touch-action:pan-x" (pointerdown)="start($event)" (pointermove)="pull($event)" (pointerup)="release()" (pointercancel)="distance.set(0)" [style.padding-top.px]="distance()"><strong>{{distance()>65?'Release to refresh':'Pull down to refresh'}}</strong><ng-content><p class="kit-muted">Your latest updates appear here.</p></ng-content></div><button type="button" [disabled]="blocked()" (click)="run()">{{busy()?'Refreshing…':label()||'Refresh'}}</button>${actionFeedback}</section>`,
  `readonly distance=signal(0);private startY:number|undefined;start(event:PointerEvent):void{if(this.blocked()||event.button!==0)return;this.startY=event.clientY;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);}pull(event:PointerEvent):void{if(this.startY!==undefined)this.distance.set(Math.max(0,Math.min(100,(event.clientY-this.startY)*.5)));}release():void{if(this.distance()>65)void this.run();this.startY=undefined;this.distance.set(0);}`,
);

// Data and account cards use actual inputs and local disclosure, not screenshots.
for (const [id, title, layout] of [
  ["wallet-card", "Your wallet", "wallet"],
  ["mac-os-folder-cards", "Project folders", "folders"],
  ["stacked-cards", "Your collection", "stacked"],
  ["story-card", "Your stories", "stories"],
]) {
  add(
    id,
    "collection",
    "A configurable content card collection with selection, disclosure, disabled items and projected details.",
    `<section class="kit-control kit-stack"><h3>{{label()||'${title}'}}</h3><div class="k-cards k-${layout}">@for(item of items();track item.id){<article class="k-card kit-surface" [class.k-active]="current()?.id===item.id" (pointermove)="spot($event)" (pointerleave)="clearSpot($event)">${id === "mac-os-folder-cards" ? '<span class="k-folder-tab" aria-hidden="true"></span>' : id === "profile-card" ? '<span class="k-avatar" aria-hidden="true">{{item.label.slice(0,2)}}</span>' : id === "wallet-card" ? '<span class="k-card-chip" aria-hidden="true">▦</span>' : ""}<button type="button" [disabled]="disabled()||item.disabled" [attr.aria-expanded]="expanded().includes(item.id)" (click)="select(item);toggle(item.id)">{{item.label}}</button><p>{{item.value}}</p><div [hidden]="!expanded().includes(item.id)"><p>{{item.description}}</p><ng-content></ng-content><button type="button" [disabled]="disabled()||busy()||item.disabled" (click)="execute([item])">Select {{item.label}}</button></div></article>}</div>${collectionFeedback}</section>`,
    `spot(event:PointerEvent):void{if(this.disabled())return;const el=event.currentTarget as HTMLElement;const r=el.getBoundingClientRect();el.style.setProperty('--spot-x',(event.clientX-r.left)+'px');el.style.setProperty('--spot-y',(event.clientY-r.top)+'px');}clearSpot(event:PointerEvent):void{(event.currentTarget as HTMLElement).style.removeProperty('--spot-x');}`,
  );
}
add("peek-card","plain",peekCardPort.description,peekCardPort.template,peekCardPort.body,peekCardPort);
add("profile-card","plain",profileCardPort.description,profileCardPort.template,profileCardPort.body,profileCardPort);
add("reveal-card","plain",revealCardPort.description,revealCardPort.template,revealCardPort.body,revealCardPort);
add("spotlight-card", "plain", spotlightCardPort.description, spotlightCardPort.template, spotlightCardPort.body, spotlightCardPort);
/* Legacy avatar stack replaced by the authored React-contract port.
add(
  "avatar-stack",
  "collection",
  "Overlapping avatar buttons with readable names, selection and overflow disclosure.",
  `<section class="kit-control kit-stack"><div class="k-avatars" (keydown)="keys($event)">@for(item of items().slice(0,limit());track item.id){<button type="button" data-item class="k-avatar" [attr.aria-label]="item.label" [title]="item.label" [disabled]="disabled()||item.disabled" (click)="select(item)">@if(item.image){<img [src]="item.image" alt="" />}@else{ {{item.label.slice(0,2)}} }</button>}@if(items().length>limit()){<button type="button" [attr.aria-expanded]="open()" [disabled]="disabled()" (click)="open.set(!open())">+{{items().length-limit()}}</button>}</div>@if(open()){@for(item of items().slice(limit());track item.id){${itemButton}}}<p role="status">{{selected()?'Selected: '+current()?.label:''}}</p></section>`,
  `readonly maxVisible=input(4);readonly limit=computed(()=>Math.max(1,Math.floor(this.maxVisible())));`,
  { inputs: ["maxVisible: number"] },
);
*/
add("avatar-stack","plain",avatarStackPort.description,avatarStackPort.template,avatarStackPort.body,avatarStackPort);
add(
  "sticky-pages",
  "collection",
  "Scrollable page sections with contained sticky headers and readable long-content layout.",
  `<div class="kit-control k-scroll-page" tabindex="0" aria-label="Sticky pages">@for(item of items();track item.id){<section class="k-sticky-page"><h3>{{item.label}}</h3><p>{{item.description}}</p><ng-content></ng-content><button type="button" [disabled]="disabled()||item.disabled" (click)="select(item)">Open {{item.label}}</button></section>}</div>`,
);
/* Legacy focus mode replaced by the authored React-contract port.
add(
  "focus-mode",
  "plain",
  "A focus region that dims surrounding content while preserving Escape and an explicit exit control.",
  `<section class="kit-control k-focus" [class.k-focused]="active()" (keydown.escape)="active.set(false)"><button type="button" [disabled]="disabled()" [attr.aria-pressed]="active()" (click)="active.set(!active())">{{active()?'Exit focus mode':'Enter focus mode'}}</button><article class="kit-surface kit-stack"><h3>{{label()}}</h3><ng-content><p>Keep the next step small and intentional.</p></ng-content></article></section>`,
  `readonly active=model(false);readonly disabled=input(false);readonly label=input('One thing at a time');`,
  {
    inputs: ["active: boolean (two-way)", "disabled: boolean", "label: string"],
  },
);
*/
add("focus-mode","plain",focusModePort.description,focusModePort.template,focusModePort.body,focusModePort);

add("loader","plain",loaderPort.description,loaderPort.template,loaderPort.body,loaderPort);

// Loading indicators can be stopped and honor reduced motion in CSS.
add("orbital-loading-ring","plain",orbitalLoadingRingPort.description,orbitalLoadingRingPort.template,orbitalLoadingRingPort.body,orbitalLoadingRingPort);
for (const [id, shape] of [
]) {
  add(
    id,
    "plain",
    "A labeled loading indicator with a settled state and reduced-motion fallback.",
    `<section class="kit-control kit-stack" [attr.aria-busy]="loading()"><div class="k-loader k-${shape}" [class.k-paused]="paused()||!loading()" aria-hidden="true"><span></span><span></span><span></span></div><p role="status">{{loading()?label():'Ready.'}}</p><ng-content></ng-content></section>`,
    `readonly label=input('Loading…');readonly loading=input(true);readonly paused=input(false);`,
    { inputs: ["label: string", "loading: boolean", "paused: boolean"] },
  );
}
add("intro-loader","plain",introLoaderPort.description,introLoaderPort.template,introLoaderPort.body,introLoaderPort);
add("morphing-shape-loader","plain",morphingShapeLoaderPort.description,morphingShapeLoaderPort.template,morphingShapeLoaderPort.body,morphingShapeLoaderPort);
/* Legacy not-found replaced by the authored React-contract port.
add(
  "not-found",
  "plain",
  "A configurable empty/not-found state with an application-owned recovery action.",
  `<section class="kit-control kit-surface kit-stack k-empty"><strong class="k-error-code">{{code()}}</strong><h3>{{title()}}</h3><p>{{description()}}</p><button type="button" [disabled]="disabled()" (click)="recover.emit()">{{actionLabel()}}</button><ng-content></ng-content></section>`,
  `readonly code=input('404');readonly title=input('We could not find that page');readonly description=input('Try another path or return to your workspace.');readonly actionLabel=input('Go back');readonly disabled=input(false);readonly recover=output<void>();`,
  {
    inputs: [
      "code: string",
      "title: string",
      "description: string",
      "actionLabel: string",
      "disabled: boolean",
    ],
    outputs: ["recover: void"],
  },
);
*/
add("not-found","plain",notFoundPort.description,notFoundPort.template,notFoundPort.body,notFoundPort);
/* Legacy payment status replaced by the authored React-contract port.
add(
  "payment-status",
  "plain",
  "A controlled payment-status display; it never simulates a real payment or charges a card.",
  `<section class="kit-control kit-surface kit-stack" [attr.aria-busy]="state()==='pending'"><span class="k-payment-icon" aria-hidden="true">{{state()==='success'?'✓':state()==='error'?'!':'◌'}}</span><h3>{{label()}}</h3><p role="status">{{state()==='pending'?'Processing payment…':state()==='success'?'Payment completed.':state()==='error'?'Payment failed.': 'Ready for payment.'}}</p>@if(state()==='error'){<button type="button" [disabled]="disabled()" (click)="retry.emit()">Retry payment</button>}<ng-content></ng-content></section>`,
  `readonly state=input<'idle'|'pending'|'success'|'error'>('idle');readonly label=input('Payment status');readonly disabled=input(false);readonly retry=output<void>();`,
  {
    inputs: [
      "state: 'idle' | 'pending' | 'success' | 'error'",
      "label: string",
      "disabled: boolean",
    ],
    outputs: ["retry: void"],
  },
);
*/
add("payment-status","plain",paymentStatusPort.description,paymentStatusPort.template,paymentStatusPort.body,paymentStatusPort);
/* Legacy receipt printer replaced by the authored React-contract port.
add(
  "payment-receipt-printer",
  "plain",
  "A printable, expandable receipt from application-provided line items and totals.",
  `<section class="kit-control kit-surface kit-stack"><h3>{{label()}}</h3><button type="button" [disabled]="disabled()" [attr.aria-expanded]="printed()" (click)="printed.set(!printed())">{{printed()?'Retract receipt':'Print receipt preview'}}</button>@if(printed()){<article class="k-receipt"><h3>{{merchant()}}</h3><p>{{reference()}}</p>@for(item of items();track item.id){<div class="kit-row"><span>{{item.label}}</span><span>{{currency()}} {{item.value}}</span></div>}<hr /><strong>Total: {{currency()}} {{total()}}</strong><ng-content></ng-content></article>}</section>`,
  `readonly label=input('Your receipt');readonly merchant=input('Kit workspace');readonly reference=input('Receipt preview');readonly currency=input('USD');readonly items=input<KitItem[]>([{id:'subscription',label:'Workspace plan',value:24}]);readonly total=input(24);readonly disabled=input(false);readonly printed=model(false);`,
  {
    inputs: [
      "label: string",
      "merchant: string",
      "reference: string",
      "currency: string",
      "items: KitItem[]",
      "total: number",
      "disabled: boolean",
      "printed: boolean (two-way)",
    ],
  },
);
*/
add("payment-receipt-printer","plain",paymentReceiptPrinterPort.description,paymentReceiptPrinterPort.template,paymentReceiptPrinterPort.body,paymentReceiptPrinterPort);

// Canvas effects use distinct algorithms, pause off screen and clean up observers.
const canvasModes: Record<string, string> = {
  "dot-shader": "shader",
  "depth-corridor": "corridor",
  "glyph-matrix": "glyph",
  "shooting-stars": "shooting",
  "sparkles-core": "sparkles",
  "speed-warp": "warp",
  "evil-eye": "eye",
  "nimbu-mirchi": "nimbu",
  "thinking-orb": "orb",
};
add('meteors','plain',meteorsPort.description,meteorsPort.template,meteorsPort.body,meteorsPort);
add('dot-field','plain',dotFieldPort.description,dotFieldPort.template,dotFieldPort.body,dotFieldPort);
add('morphing-blob','plain',morphingBlobPort.description,morphingBlobPort.template,morphingBlobPort.body,morphingBlobPort);
add('circular-orbit','plain',circularOrbitPort.description,circularOrbitPort.template,circularOrbitPort.body,circularOrbitPort);
for (const [id, mode] of Object.entries(canvasModes)) {
  add(
    id,
    "canvas",
    "A native Canvas 2D visual with pointer response, pause controls, offscreen suspension and reduced motion.",
    `<section class="kit-control kit-stack"><div class="k-canvas-wrap" (pointermove)="move($event)" (pointerleave)="reset()"><canvas #canvas [attr.aria-label]="label()" role="img"></canvas><ng-content></ng-content></div><button type="button" [disabled]="disabled()||paused()" [attr.aria-pressed]="!running()" (click)="running.set(!running())">{{running()?'Pause animation':'Resume animation'}}</button></section>`,
    `override readonly mode='${mode}';`,
  );
}
add('density-lens','plain',densityLensPort.description,densityLensPort.template,densityLensPort.body,densityLensPort);
add('gravity-particle-burst','plain',gravityParticleBurstPort.description,gravityParticleBurstPort.template,gravityParticleBurstPort.body,gravityParticleBurstPort);
for (const [id, label] of [
  ["rocket-party-popper", "Launch celebration"],
]) {
  add(
    id,
    "canvas",
    "Trigger a local particle celebration with a keyboard button, visible motion controls and cleanup.",
    `<section class="kit-control kit-stack"><div class="k-canvas-wrap" (pointermove)="move($event)"><canvas #canvas role="img" [attr.aria-label]="label()" [style.opacity]="active()?1:.15"></canvas></div><div class="kit-row"><button type="button" [disabled]="disabled()" (click)="launch()">${label}</button><button type="button" [disabled]="disabled()" (click)="running.set(!running())">{{running()?'Pause':'Resume'}}</button></div><p role="status">{{active()?'Celebration launched.':''}}</p></section>`,
    `override readonly mode='burst';readonly active=signal(false);readonly triggered=output<void>();private stopTimer:ReturnType<typeof setTimeout>|undefined;constructor(){super();this.running.set(false);inject(DestroyRef).onDestroy(()=>clearTimeout(this.stopTimer));}launch():void{if(this.disabled())return;clearTimeout(this.stopTimer);this.active.set(true);this.running.set(true);this.triggered.emit();this.stopTimer=setTimeout(()=>{this.active.set(false);this.running.set(false);},3000);}`,
    { outputs: ["triggered: void"] },
  );
}
add("cursor-follower","plain",cursorFollowerPort.description,cursorFollowerPort.template,cursorFollowerPort.body,cursorFollowerPort);
add(
  "particle-delete",
  "action",
  "A deliberate local item dismissal with a particle transition and restore control.",
  `<section class="kit-control kit-stack">@if(!removed()){<article class="kit-surface kit-stack" [class.k-dissolve]="busy()"><ng-content><p>{{label()||'A small item to remove'}}</p></ng-content><button type="button" [disabled]="blocked()" (click)="remove()">Delete item</button></article>}@else{<button type="button" [disabled]="disabled()" (click)="removed.set(false)">Restore preview item</button>}${actionFeedback}</section>`,
  `readonly removed=signal(false);async remove():Promise<void>{await this.run();if(!this.error()&&!this.destroyed&&!this.disabled())this.removed.set(true);}`,
);
add(
  "car-smoke-page-transition",
  "collection",
  "Switch projected page summaries through a restrained car/smoke CSS transition with keyboard navigation.",
  `<section class="kit-control kit-stack"><nav class="kit-row" (keydown)="keys($event)">@for(item of items();track item.id){${itemButton}}</nav><div class="k-road" aria-hidden="true"><span class="k-car">▰</span><span class="k-smoke"></span></div>@for(item of [current()];track item?.id){<article class="kit-surface k-page-enter"><h3>{{item?.label}}</h3><p>{{item?.description}}</p><ng-content></ng-content></article>}</section>`,
);
add("morphing-icon","plain",morphingIconPort.description,morphingIconPort.template,morphingIconPort.body,morphingIconPort);

// Text, counters and clocks use real values and tear down their own timers.
for (const [id, variant] of [
  ["scrollvelocitytext", "velocity"],
]) {
  add(
    id,
    "plain",
    "Configurable readable text with a restrained visual treatment and reduced-motion fallback.",
    `<section class="kit-control kit-stack"><div class="k-text k-${variant}" [class.k-paused]="paused()" [attr.data-text]="text()" [style.transform]="transform()" (wheel)="wheel($event)"><span class="sr-only">{{text()}}</span><span aria-hidden="true">{{display()}}</span></div>${id === "text-scramble-decoder" ? '<button type="button" [disabled]="disabled()" (click)="decode()">Decode text</button>' : ""}</section>`,
    `readonly text=input('Nimble by nature. Precise by design.');readonly paused=input(false);readonly disabled=input(false);readonly decoded=signal<string|null>(null);readonly display=computed(()=>this.decoded()??this.text());readonly transform=signal('translateX(0)');private timer:ReturnType<typeof setInterval>|undefined;private settle:ReturnType<typeof setTimeout>|undefined;constructor(){inject(DestroyRef).onDestroy(()=>{clearInterval(this.timer);clearTimeout(this.settle);});}wheel(event:WheelEvent):void{if(this.disabled()||this.paused()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;this.transform.set('translateX('+Math.max(-25,Math.min(25,event.deltaY*.15))+'px)');clearTimeout(this.settle);this.settle=setTimeout(()=>this.transform.set('translateX(0)'),180);}decode():void{clearInterval(this.timer);if(this.disabled()||this.paused()||matchMedia('(prefers-reduced-motion: reduce)').matches){this.decoded.set(this.text());return;}let step=0;this.timer=setInterval(()=>{const text=this.text();step+=2;this.decoded.set(Array.from(text).map((c,i)=>i<step||c===' '?c:'01<>/{}'[Math.floor(Math.random()*7)]).join(''));if(step>=text.length)clearInterval(this.timer);},45);}`,
    { inputs: ["text: string", "paused: boolean", "disabled: boolean"] },
  );
}
add('text-scramble-decoder','plain',textScrambleDecoderPort.description,textScrambleDecoderPort.template,textScrambleDecoderPort.body,textScrambleDecoderPort);
add("glitch-text","plain",glitchTextPort.description,glitchTextPort.template,glitchTextPort.body,glitchTextPort);
add("animated-number","plain",animatedNumberPort.description,animatedNumberPort.template,animatedNumberPort.body,animatedNumberPort);
add("unfold-accordion","plain",unfoldAccordionPort.description,unfoldAccordionPort.template,unfoldAccordionPort.body,unfoldAccordionPort);
/* Legacy airport clock and metric HUD replaced by authored React-contract ports.
add(
  "airport-matrix-clock",
  "plain",
  "A live timezone-aware split-flap-style clock with pause and accessible time text.",
  `<section class="kit-control kit-surface kit-stack"><h3>{{label()}}</h3><time class="k-matrix-clock" [attr.datetime]="now().toISOString()">{{formatted()}}</time><button type="button" [attr.aria-pressed]="paused()" (click)="paused.set(!paused())">{{paused()?'Resume clock':'Pause clock'}}</button></section>`,
  `readonly label=input('Local departures');readonly timeZone=input('UTC');readonly paused=model(false);readonly now=signal(new Date());readonly formatted=computed(()=>{try{return new Intl.DateTimeFormat('en-GB',{timeZone:this.timeZone(),hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(this.now());}catch{return 'Invalid time zone';}});constructor(){const timer=setInterval(()=>{if(!this.paused())this.now.set(new Date());},1000);inject(DestroyRef).onDestroy(()=>clearInterval(timer));}`,
  {
    inputs: ["label: string", "timeZone: string", "paused: boolean (two-way)"],
  },
);
add(
  "metric-hud",
  "plain",
  "A metric readout with bounded progress, signed trend and application-controlled loading/error states.",
  `<section class="kit-control kit-surface kit-stack" [attr.aria-busy]="loading()"><h3>{{label()}}</h3><output class="k-number">{{loading()?'—':value()}}{{unit()}}</output><progress [attr.aria-label]="label()+' progress'" [max]="safeMax()" [value]="bounded()"></progress><p>{{trend()>=0?'↑':'↓'}} {{trend()}}%</p>@if(error()){<p role="alert">{{error()}}</p>}<ng-content></ng-content></section>`,
  `readonly label=input('Weekly momentum');readonly value=input(72);readonly max=input(100);readonly unit=input('%');readonly trend=input(12);readonly loading=input(false);readonly error=input('');readonly safeMax=computed(()=>Math.max(1,this.max()));readonly bounded=computed(()=>Math.max(0,Math.min(this.safeMax(),this.value())));`,
  {
    inputs: [
      "label: string",
      "value: number",
      "max: number",
      "unit: string",
      "trend: number",
      "loading: boolean",
      "error: string",
    ],
  },
);
*/
add("airport-matrix-clock","plain",airportMatrixClockPort.description,airportMatrixClockPort.template,airportMatrixClockPort.body,airportMatrixClockPort);
add("metric-hud","plain",metricHudPort.description,metricHudPort.template,metricHudPort.body,metricHudPort);
add(
  "torque-dial",
  "plain",
  "A bounded rotary input with pointer dragging, a native range alternative and keyboard increments.",
  `<section class="kit-control kit-stack"><label>{{label()}}<input type="range" [min]="min()" [max]="safeMax()" [step]="safeStep()" [value]="bounded()" [disabled]="disabled()" (input)="set(+$any($event.target).value)" (change)="changeEnd.emit()" /></label><div class="k-dial" role="slider" [attr.aria-label]="label()" [attr.aria-valuemin]="min()" [attr.aria-valuemax]="safeMax()" [attr.aria-valuenow]="bounded()" [attr.aria-disabled]="disabled()" [tabIndex]="disabled()?-1:0" (keydown)="key($event)" (pointerdown)="start($event)" (pointermove)="drag($event)" (pointerup)="end()" (pointercancel)="end()"><span class="k-dial-tick" [style.transform]="'rotate('+angle()+'deg)'"></span><output>{{bounded()}}{{unit()}}</output></div></section>`,
  `readonly value=model(50);readonly min=input(0);readonly max=input(100);readonly step=input(1);readonly label=input('Dial control');readonly unit=input('%');readonly disabled=input(false);readonly changeEnd=output<void>();readonly safeMax=computed(()=>Math.max(this.min(),this.max()));readonly safeStep=computed(()=>Math.max(.001,this.step()));readonly bounded=computed(()=>Math.max(this.min(),Math.min(this.safeMax(),this.value())));readonly angle=computed(()=>-135+(this.bounded()-this.min())/Math.max(1,this.safeMax()-this.min())*270);private origin?:{y:number;value:number};set(value:number):void{if(this.disabled())return;const step=this.safeStep();this.value.set(Math.max(this.min(),Math.min(this.safeMax(),Math.round((value-this.min())/step)*step+this.min())));}start(event:PointerEvent):void{if(this.disabled()||event.button!==0)return;this.origin={y:event.clientY,value:this.bounded()};(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);}drag(event:PointerEvent):void{if(this.origin)this.set(this.origin.value+(this.origin.y-event.clientY)*(this.safeMax()-this.min())/150);}end():void{if(this.origin)this.changeEnd.emit();this.origin=undefined;}key(event:KeyboardEvent):void{if(['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','Home','End','PageUp','PageDown'].includes(event.key)){event.preventDefault();this.set(event.key==='Home'?this.min():event.key==='End'?this.safeMax():this.bounded()+(['ArrowDown','ArrowLeft','PageDown'].includes(event.key)?-1:1)*this.safeStep()*(event.key.startsWith('Page')?10:1));this.changeEnd.emit();}}`,
  {
    inputs: [
      "value: number (two-way)",
      "min: number",
      "max: number",
      "step: number",
      "label: string",
      "unit: string",
      "disabled: boolean",
    ],
    outputs: ["changeEnd: void"],
  },
);

/* Legacy directional tooltip replaced by the authored React-contract port.
add(
  "directional-tooltip",
  "plain",
  "A directional tooltip available on hover, keyboard focus and touch, dismissible with Escape.",
  `<div class="kit-control k-tooltip-wrap" (pointerenter)="show()" (pointerleave)="open.set(false)" (focusin)="show()" (focusout)="open.set(false)" (keydown.escape)="open.set(false)"><button type="button" [disabled]="disabled()" [attr.aria-describedby]="open()?uid:null" (click)="open.set(!open())"><ng-content>{{label()}}</ng-content></button><span role="tooltip" class="k-tooltip" [id]="uid" [attr.data-placement]="placement()" [hidden]="!open()">{{text()}}</span></div>`,
  `readonly uid=portId('tooltip');readonly label=input('Hover, focus or tap');readonly text=input('Small details make the difference.');readonly placement=input<'top'|'bottom'|'left'|'right'>('top');readonly disabled=input(false);readonly open=signal(false);show():void{if(!this.disabled())this.open.set(true);}`,
  {
    inputs: [
      "label: string",
      "text: string",
      "placement: 'top' | 'bottom' | 'left' | 'right'",
      "disabled: boolean",
    ],
  },
);
*/
add("directional-tooltip","plain",directionalTooltipPort.description,directionalTooltipPort.template,directionalTooltipPort.body,directionalTooltipPort);
for (const [id, title] of [
  ["morphing-dialog", "A little more room"],
  ["settle-modal", "Settle the details"],
]) {
  add(
    id,
    "action",
    "A native modal dialog with focus containment, Escape, projected content and asynchronous confirmation.",
    `<div class="kit-control kit-stack"><button type="button" [disabled]="blocked()" (click)="opened.set(true)">{{label()||'Open dialog'}}</button><dialog #dialog class="kit-dialog kit-control k-port-dialog" [attr.aria-labelledby]="uid" (close)="opened.set(false)" (cancel)="opened.set(false)"><div class="kit-stack"><h3 [id]="uid">{{title()}}</h3><ng-content><p>{{description()}}</p></ng-content><div class="kit-row"><button type="button" [disabled]="busy()" (click)="opened.set(false)">Close</button><button type="button" [disabled]="blocked()" (click)="confirm()">{{busy()?'Working…':'Confirm'}}</button></div>${actionFeedback}</div></dialog></div>`,
    `readonly uid=portId('dialog');readonly title=input('${title}');readonly description=input('Your application content belongs here.');readonly opened=model(false);readonly dialog=viewChild<ElementRef<HTMLDialogElement>>('dialog');constructor(){super();effect(()=>{const dialog=this.dialog()?.nativeElement;const opened=this.opened();if(!dialog)return;if(opened&&!dialog.open)dialog.showModal();else if(!opened&&dialog.open)dialog.close();});}async confirm():Promise<void>{await this.run();if(!this.error()&&!this.destroyed)this.opened.set(false);}`,
    {
      inputs: [
        "title: string",
        "description: string",
        "opened: boolean (two-way)",
      ],
    },
  );
}

// The larger data, comparison, chat and graph ports are authored separately.
import { COMPLEX_PORTS } from "./angular-complex-ports";
for (const port of COMPLEX_PORTS)
  add(port.id, port.kind, port.description, port.template, port.body, port);

const originals = new Set([
  "elastic-sheet",
  "smart-upload",
  "liquid-command-palette",
  "hold-to-confirm",
  "swipe-action-list",
  "interactive-data-card",
  "timeline-scrubber",
  "ai-prompt-composer",
]);
const expected = CATALOG_INDEX.filter((c) => !originals.has(c.id));
const ids = new Set(ports.map((p) => p.id));
if (ids.size !== ports.length) throw new Error("Duplicate Angular port");
const missing = expected.filter((c) => !ids.has(c.id));
const extra = ports.filter((p) => !expected.some((c) => c.id === p.id));
if (missing.length || extra.length)
  throw new Error(
    `Angular coverage mismatch. Missing: ${missing.map((c) => c.id)}; extra: ${extra.map((c) => c.id)}`,
  );
const cardDefaults: Record<
  string,
  Array<{ id: string; label: string; description: string; value?: string }>
> = {
  "wallet-card": [
    {
      id: "balance",
      label: "Available balance",
      value: "USD 2,240.00",
      description:
        "Account ending 4821 · Local preview data. No financial service is connected.",
    },
  ],
  "mac-os-folder-cards": [
    {
      id: "components",
      label: "Components",
      value: "116 files",
      description: "Native interface building blocks.",
    },
    {
      id: "assets",
      label: "Assets",
      value: "12 files",
      description: "Your workspace illustrations and design assets.",
    },
  ],
  "story-card": [
    {
      id: "beginning",
      label: "A small beginning",
      value: "Chapter 01",
      description: "Every useful idea starts with a question.",
    },
    {
      id: "rhythm",
      label: "Find the rhythm",
      value: "Chapter 02",
      description: "Build, test and follow the details.",
    },
    {
      id: "share",
      label: "Ready to share",
      value: "Chapter 03",
      description: "Bring the finished pieces together.",
    },
  ],
};
for (const port of ports) {
  if(port.id==='gooey-menu'){
    port.template=port.template.replace('(keydown.escape)="open.set(false)"','(keydown.escape)="closeMenu()"').replace('<button type="button" [disabled]','<button #trigger type="button" [disabled]').replace('(click)="select(item);open.set(false)"','(click)="pick(item)"');
    port.body+=`readonly trigger=viewChild<ElementRef<HTMLButtonElement>>('trigger');closeMenu():void{this.open.set(false);this.trigger()?.nativeElement.focus();}pick(item:KitItem):void{if(this.disabled()||this.loading()||item.disabled)return;this.select(item);this.closeMenu();}override keys(event:KeyboardEvent):void{if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key)||this.disabled())return;const buttons=Array.from((event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button[data-item]:not(:disabled)'));if(!buttons.length)return;event.preventDefault();const index=buttons.indexOf(event.target as HTMLButtonElement);const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowUp'?-1:1)+buttons.length)%buttons.length;buttons[next].focus();}`;
  }
  if(port.id==='animated-tabs')port.template=port.template.replace('role="tab"','role="tab" [tabIndex]="current()?.id===item.id?0:-1"');
  if (["action", "collection", "form"].includes(port.kind))
    port.template = port.template.replaceAll(
      "<summary>",
      '<summary [attr.aria-disabled]="disabled()" [tabIndex]="disabled()?-1:0" (click)="disabled()&&$event.preventDefault()">',
    );
  if (port.kind === "collection")
    port.template = port.template.replace(
      /\[disabled\]="([^"]*)"/g,
      (match, expression: string) =>
        expression.includes("loading()")
          ? match
          : `[disabled]="loading()||${expression}"`,
    );
  if (cardDefaults[port.id])
    port.body += `\noverride readonly items=input<KitItem[]>(${JSON.stringify(cardDefaults[port.id])});`;
  if (port.id === "scrollvelocitytext")
    port.body += `\nprivate lastScroll=0;@HostListener('window:scroll') scroll():void{if(this.disabled()||this.paused()||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const delta=window.scrollY-this.lastScroll;this.lastScroll=window.scrollY;this.transform.set('translateX('+Math.max(-25,Math.min(25,delta*.15))+'px)');clearTimeout(this.settle);this.settle=setTimeout(()=>this.transform.set('translateX(0)'),180);}`;
  if (port.id === "rocket-party-popper")
    port.body = port.body.replace("mode='burst'", "mode='rocket'");
  if (port.id === "particle-delete")
    port.body = port.body.replace(
      "await this.run();",
      "const request=this.run();const controller=this.controller;await request;if(controller?.signal.aborted)return;",
    );
  if (port.id === "morphing-dialog" || port.id === "settle-modal")
    port.body = port.body.replace(
      "await this.run();",
      "const request=this.run();const controller=this.controller;await request;if(controller?.signal.aborted)return;",
    );
  if (port.id === "sign-up")
    port.body = `override readonly fields=input<KitField[]>([{key:'name',label:'Name',type:'text',required:true},{key:'email',label:'Email',type:'email',required:true},{key:'password',label:'Password',type:'password',required:true,minLength:8},{key:'confirmPassword',label:'Confirm password',type:'password',required:true,minLength:8}]);override async submit(event:SubmitEvent):Promise<void>{if(this.values()['password']!==this.values()['confirmPassword']){event.preventDefault();this.error.set('Passwords do not match.');return;}await super.submit(event);}`;
  if (port.id === "stacked-cards")
    port.template = port.template.replace(
      '<div class="k-cards',
      `<nav class="kit-row" aria-label="Choose a card" (keydown)="keys($event)">@for(item of items();track item.id){${itemButton}}</nav><div class="k-cards`,
    );

}
const directory = path.join(root, "packages/angular/src");
const pascal = (id: string) =>
  id
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
const base: Record<Kind, string> = {
  action: "KitActionController",
  collection: "KitCollectionController",
  form: "KitFormController",
  canvas: "KitCanvasController",
  plain: "",
};
const entries = ports
  .sort((a, b) => a.id.localeCompare(b.id))
  .map((port) => {
    const name = CATALOG_INDEX.find((c) => c.id === port.id)!.name;
    const exportName = `Kit${pascal(port.id)}Component`;
    const selector = `kit-${port.id}`;
    const controller = port.controller ?? base[port.kind];
    const body = port.body.replace(
      "const from=this.displayed();",
      "const from=untracked(this.displayed);",
    );
    const used = (symbol: string) =>
      new RegExp(`(?<![.$\\w])${symbol}\\b`).test(body);
    const core = [
      "Component",
      ...(port.stylesFile && !port.imports?.includes("ViewEncapsulation")
        ? ["ViewEncapsulation"]
        : []),
      ...[
        "DestroyRef",
        "ElementRef",
        "HostListener",
        "computed",
        "effect",
        "inject",
        "input",
        "model",
        "output",
        "signal",
        "untracked",
        "viewChild",
      ].filter(used),
    ];
    const controllers = [
      ...(used("portId") ? ["portId"] : []),
      ...(controller && !port.controller && port.kind !== "canvas" ? [controller] : []),
    ];
    const types = [
      "KitItem",
      "KitTableColumn",
      "KitTableRow",
      "KitField",
      "KitMessage",
      "KitGraphNode",
      "KitGraphEdge",
      "KitPlan",
      "KitCompareFeature",
      "KitChatHandler",
    ].filter(used);
    const source = `// Generated from authored native templates in scripts/generate-angular-ports.ts.\nimport { ${core.join(", ")} } from '@angular/core';\n${controllers.length ? `import { ${controllers.join(", ")} } from './port-controllers';\n` : ""}${port.kind === "canvas" ? `import { ${controller} } from './port-canvas';\n` : ""}${types.length ? `import type { ${types.join(", ")} } from './port-types';\n` : ""}${port.imports ?? ""}\n@Component({\n selector:${JSON.stringify(port.componentSelector ?? selector)}, standalone:true,\n host:${port.hostMetadata ?? `{'data-kit':${JSON.stringify(port.id)},style:'display:block;min-width:0'}`},\n ${port.componentImports ? `imports:[${port.componentImports}],\n` : ""}${port.stylesFile ? `encapsulation:ViewEncapsulation.None,styleUrls:[${JSON.stringify(port.stylesFile)}],\n` : ""}${port.providers ? `providers:${port.providers},\n` : ""}template:\`\n${port.template.replaceAll("><", ">\n<").replaceAll("`", "\\`").replaceAll("${", "\\${")}\n\`\n})\nexport class ${exportName}${port.typeParameters ?? ""}${controller ? ` extends ${controller}` : ""} {\n${body}\n}\n`;
    fs.writeFileSync(path.join(directory, `${port.id}.component.ts`), source);
    const outputs = [
      ...port.outputs,
      ...port.inputs
        .filter((input) => input.includes("(two-way)"))
        .map((input) =>
          input.replace(":", "Change:").replace(" (two-way)", ""),
        ),
    ];
    return {
      id: port.id,
      name,
      exportName,
      selector,
      description: port.description,
      inputs: port.inputs,
      outputs,
    };
  });
fs.writeFileSync(
  path.join(root, "src/lib/framework/angular-ports.ts"),
  `// Generated by npm run angular:sync.\nexport const ANGULAR_PORTS = ${JSON.stringify(entries, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(root, "packages/angular-demo/src/ports.ts"),
  `// Generated by npm run angular:sync.\nimport type { Type } from '@angular/core';\nimport { ${entries.map((e) => e.exportName).join(", ")} } from 'kit-ui-angular';\nexport const DEMO_PORTS:Record<string,Type<unknown>>={\n${entries.map((e) => `  '${e.id}':${e.exportName}`).join(",\n")}\n};\nexport const DEMO_PORT_KINDS:Record<string,string>=${JSON.stringify(Object.fromEntries(ports.map((p) => [p.id, p.kind])))};\n`,
);
const apiFile = path.join(directory, "public-api.ts");
let api = fs
  .readFileSync(apiFile, "utf8")
  .split("// Generated catalog exports.")[0]
  .trimEnd();
api +=
  '\n\n// Generated catalog exports.\nexport * from "./port-types";\n' +
  entries.map((e) => `export * from './${e.id}.component';`).join("\n") +
  "\n";
fs.writeFileSync(apiFile, api);
fs.writeFileSync(
  path.join(root, "packages/angular/catalog.json"),
  JSON.stringify(entries, null, 2) + "\n",
);
console.log(
  `Generated ${entries.length} native Angular ports; ${entries.length + originals.size} catalog components covered.`,
);

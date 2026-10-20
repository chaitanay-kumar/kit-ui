import {buildChatParts} from './angular-chat';
import {dynamicIslandPort,buildDynamicIslandStyles} from './angular-dynamic-island';
import {particleDeletePort} from './angular-particle-delete';
import {signUpPort} from './angular-sign-up';
import {formPort} from './angular-form';
import {loginPort} from './angular-login';
import {animatedFileUploadPort} from './angular-animated-file-upload';
import {dotShaderPort} from './angular-dot-shader';
import {shootingStarsPort} from './angular-shooting-stars';
import {glyphMatrixPort} from './angular-glyph-matrix';
import {thinkingOrbPort} from './angular-thinking-orb';
import {sparklesCorePort} from './angular-sparkles-core';
import {dragToConfirmPort} from './angular-drag-to-confirm';
import {commandMenuPort,spotlightSearchPort} from './angular-search-palettes';
import {evilEyePort,nimbuMirchiPort} from './angular-hanging-charms';
import {torqueDialPort} from './angular-torque-dial';
import {rocketPartyPopperPort} from './angular-rocket-party-popper';
import {codeSnippetDeckPort} from './angular-code-snippet-deck';
import {batchGestureTrayPort} from './angular-batch-gesture-tray';
import {speedWarpPort} from './angular-speed-warp';
import {depthCorridorPort} from './angular-depth-corridor';
import {expandableDataRowPort} from './angular-expandable-data-row';
import {interactiveTimelinePort} from './angular-interactive-timeline';
import {storyCardsPort} from './angular-story-cards';
import {folderCardsPort} from './angular-folder-cards';
import {stackedCardsPort} from './angular-stacked-cards';
import {recoveryLedgerPort} from './angular-recovery-ledger';
import {morphingDialogPort} from './angular-morphing-dialog';
import {velocityToastPort} from './angular-velocity-toast';
import {gooeyMenuPort} from './angular-gooey-menu';
import {springSelectPort} from './angular-spring-select';
import {walletCardPort} from './angular-wallet-card';
import {stickyPagesPort} from './angular-sticky-pages';
import {glassNavbarPort} from './angular-glass-navbar';
import {scrollProgressNavPort} from './angular-scroll-progress-nav';
import {branchingSubmenuPort} from './angular-branching-submenu';
import {smallFloatingDockPort} from './angular-small-floating-dock';
import {animatedTabsPort} from './angular-animated-tabs';
import {scrollVelocityTextPort} from './angular-scroll-velocity-text';
import {stackUnfoldPanelPort} from './angular-stack-unfold-panel';
import {settleModalPort} from './angular-settle-modal';
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
add('drag-to-confirm','plain',dragToConfirmPort.description,dragToConfirmPort.template,dragToConfirmPort.body,dragToConfirmPort);
add('code-snippet-deck','plain',codeSnippetDeckPort.description,codeSnippetDeckPort.template,codeSnippetDeckPort.body,codeSnippetDeckPort);

add("stretch-switch","plain",stretchSwitchPort.description,stretchSwitchPort.template,stretchSwitchPort.body,stretchSwitchPort);

add("draw-checkbox", "plain", drawCheckboxPort.description, drawCheckboxPort.template, drawCheckboxPort.body.replace("readonly internal=signal(false);", "readonly internal=signal<boolean|undefined>(undefined);").replace("readonly current=computed(()=>this.checked()??this.internal());", "readonly current=computed(()=>this.checked()??this.internal()??this.defaultChecked());").replace("constructor(){effect(()=>{this.defaultChecked();untracked(()=>{if(this.checked()===undefined&&!this.initialized){this.initialized=true;this.internal.set(this.defaultChecked());}});});}private initialized=false;", "").replace("this.onChange()?.(event);}", "this.onChange()?.(event);if(this.checked()!==undefined)input.checked=this.checked()!;}").replace("this.host.nativeElement.querySelector<HTMLInputElement>('input')?.click()", "(this.host.nativeElement.querySelector('input') as HTMLInputElement|null)?.click()"), drawCheckboxPort);
add("liquid-toggle", "plain", liquidTogglePort.description, liquidTogglePort.template.replace("isOn()?.7:0", "isOn() ? .7 : 0"), liquidTogglePort.body.replace("readonly internal=signal(false);", "readonly internal=signal<boolean|undefined>(undefined);").replace("readonly isOn=computed(()=>this.value()??this.internal());", "readonly isOn=computed(()=>this.value()??this.internal()??this.defaultValue());").replace("private initialized=false;constructor(){effect(()=>{this.defaultValue();untracked(()=>{if(this.value()===undefined&&!this.initialized){this.initialized=true;this.internal.set(this.defaultValue());}});});}", ""), liquidTogglePort);
add('spring-select','plain',springSelectPort.description,springSelectPort.template,springSelectPort.body,springSelectPort);

add("otp-input", "plain", otpInputPort.description, otpInputPort.template, otpInputPort.body, otpInputPort);
add("lock-input", "plain", lockInputPort.description, lockInputPort.template, lockInputPort.body, lockInputPort);
add('sign-up','plain',signUpPort.description,signUpPort.template,signUpPort.body,signUpPort);
add('animated-file-upload','plain',animatedFileUploadPort.description,animatedFileUploadPort.template,animatedFileUploadPort.body,animatedFileUploadPort);
add('form','plain',formPort.description,formPort.template,formPort.body,formPort);
add('login','plain',loginPort.description,loginPort.template,loginPort.body,loginPort);

add('animated-tabs','plain',animatedTabsPort.description,animatedTabsPort.template,animatedTabsPort.body,animatedTabsPort);
add('glass-navbar','plain',glassNavbarPort.description,glassNavbarPort.template,glassNavbarPort.body,glassNavbarPort);
add('small-floating-dock','plain',smallFloatingDockPort.description,smallFloatingDockPort.template,smallFloatingDockPort.body,smallFloatingDockPort);
add('floating-action-dock','plain',floatingActionDockPort.description,floatingActionDockPort.template,floatingActionDockPort.body,floatingActionDockPort);
add('gooey-menu','plain',gooeyMenuPort.description,gooeyMenuPort.template,gooeyMenuPort.body,gooeyMenuPort);
add("pill-navigation","plain",pillNavigationPort.description,pillNavigationPort.template,pillNavigationPort.body,pillNavigationPort);
add("origin-dropdown", "plain", originDropdownPort.description, originDropdownPort.template, originDropdownPort.body, originDropdownPort);
add('branching-submenu','plain',branchingSubmenuPort.description,branchingSubmenuPort.template,branchingSubmenuPort.body,branchingSubmenuPort);
add("ios-search-bar","plain",iosSearchPort.description,iosSearchPort.template,iosSearchPort.body,iosSearchPort);
add('command-menu','plain',commandMenuPort.description,commandMenuPort.template,commandMenuPort.body,commandMenuPort);
add('spotlight-search','plain',spotlightSearchPort.description,spotlightSearchPort.template,spotlightSearchPort.body,spotlightSearchPort);
add('dynamic-island','plain',dynamicIslandPort.description,dynamicIslandPort.template,dynamicIslandPort.body,dynamicIslandPort);
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
add('scroll-progress-nav','plain',scrollProgressNavPort.description,scrollProgressNavPort.template,scrollProgressNavPort.body,scrollProgressNavPort);

add("activity-feed", "plain", activityFeedPort.description, activityFeedPort.template, "", activityFeedPort);

add("smooth-accordion","plain",smoothAccordionPort.description,smoothAccordionPort.template,smoothAccordionPort.body,smoothAccordionPort);

// Expandable information and selectable collections.
add('stack-unfold-panel','plain',stackUnfoldPanelPort.description,stackUnfoldPanelPort.template,stackUnfoldPanelPort.body,stackUnfoldPanelPort);
add("faq", "plain", faqPort.description, faqPort.template, faqPort.body.replace("input.required<FAQItem[]>()", "input<FAQItem[]>([])") , faqPort);
add('expandable-data-row','plain',expandableDataRowPort.description,expandableDataRowPort.template,expandableDataRowPort.body,expandableDataRowPort);
add('recovery-ledger','plain',recoveryLedgerPort.description,recoveryLedgerPort.template,recoveryLedgerPort.body,recoveryLedgerPort);
add('ai-agent-activity','plain',agentActivityPort.description,agentActivityPort.template,agentActivityPort.body,agentActivityPort);
add('interactive-timeline','plain',interactiveTimelinePort.description,interactiveTimelinePort.template,interactiveTimelinePort.body,interactiveTimelinePort);
add('selection-basket','plain',selectionBasketPort.description,selectionBasketPort.template,selectionBasketPort.body,selectionBasketPort);
add('batch-gesture-tray','plain',batchGestureTrayPort.description,batchGestureTrayPort.template,batchGestureTrayPort.body,batchGestureTrayPort);
add('velocity-toast','plain',velocityToastPort.description,velocityToastPort.template,velocityToastPort.body,velocityToastPort);
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
add('wallet-card','plain',walletCardPort.description,walletCardPort.template,walletCardPort.body,walletCardPort);
add('sticky-pages','plain',stickyPagesPort.description,stickyPagesPort.template,stickyPagesPort.body,stickyPagesPort);
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
};
add('thinking-orb','plain',thinkingOrbPort.description,thinkingOrbPort.template,thinkingOrbPort.body,thinkingOrbPort);
add('glyph-matrix','plain',glyphMatrixPort.description,glyphMatrixPort.template,glyphMatrixPort.body,glyphMatrixPort);
add('shooting-stars','plain',shootingStarsPort.description,shootingStarsPort.template,shootingStarsPort.body,shootingStarsPort);
add('dot-shader','plain',dotShaderPort.description,dotShaderPort.template,dotShaderPort.body,dotShaderPort);
add('sparkles-core','plain',sparklesCorePort.description,sparklesCorePort.template,sparklesCorePort.body,sparklesCorePort);
add('evil-eye','plain',evilEyePort.description,evilEyePort.template,evilEyePort.body,evilEyePort);
add('nimbu-mirchi','plain',nimbuMirchiPort.description,nimbuMirchiPort.template,nimbuMirchiPort.body,nimbuMirchiPort);
add('meteors','plain',meteorsPort.description,meteorsPort.template,meteorsPort.body,meteorsPort);
add('speed-warp','plain',speedWarpPort.description,speedWarpPort.template,speedWarpPort.body,speedWarpPort);
add('depth-corridor','plain',depthCorridorPort.description,depthCorridorPort.template,depthCorridorPort.body,depthCorridorPort);
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
add('rocket-party-popper','plain',rocketPartyPopperPort.description,rocketPartyPopperPort.template,rocketPartyPopperPort.body,rocketPartyPopperPort);
add("cursor-follower","plain",cursorFollowerPort.description,cursorFollowerPort.template,cursorFollowerPort.body,cursorFollowerPort);
add('particle-delete','plain',particleDeletePort.description,particleDeletePort.template,particleDeletePort.body,particleDeletePort);
add(
  "car-smoke-page-transition",
  "collection",
  "Switch projected page summaries through a restrained car/smoke CSS transition with keyboard navigation.",
  `<section class="kit-control kit-stack"><nav class="kit-row" (keydown)="keys($event)">@for(item of items();track item.id){${itemButton}}</nav><div class="k-road" aria-hidden="true"><span class="k-car">▰</span><span class="k-smoke"></span></div>@for(item of [current()];track item?.id){<article class="kit-surface k-page-enter"><h3>{{item?.label}}</h3><p>{{item?.description}}</p><ng-content></ng-content></article>}</section>`,
);
add("morphing-icon","plain",morphingIconPort.description,morphingIconPort.template,morphingIconPort.body,morphingIconPort);

// Scroll-driven continuous text uses its authored source-contract implementation.
add('scrollvelocitytext','plain',scrollVelocityTextPort.description,scrollVelocityTextPort.template,scrollVelocityTextPort.body,scrollVelocityTextPort);
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
add('torque-dial','plain',torqueDialPort.description,torqueDialPort.template,torqueDialPort.body,torqueDialPort);

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
add('settle-modal','plain',settleModalPort.description,settleModalPort.template,settleModalPort.body,settleModalPort);
add('morphing-dialog','plain',morphingDialogPort.description,morphingDialogPort.template,morphingDialogPort.body,morphingDialogPort);

add('story-card','plain',storyCardsPort.description,storyCardsPort.template,storyCardsPort.body,storyCardsPort);
add('mac-os-folder-cards','plain',folderCardsPort.description,folderCardsPort.template,folderCardsPort.body,folderCardsPort);
add('stacked-cards','plain',stackedCardsPort.description,stackedCardsPort.template,stackedCardsPort.body,stackedCardsPort);

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
};
for (const port of ports) {
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
  if (port.kind === 'collection' && cardDefaults[port.id])
    port.body += `\noverride readonly items=input<KitItem[]>(${JSON.stringify(cardDefaults[port.id])});`;
  if (port.id === "settle-modal")
    port.body = port.body.replace(
      "await this.run();",
      "const request=this.run();const controller=this.controller;await request;if(controller?.signal.aborted)return;",
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
await buildDynamicIslandStyles(root);
await buildChatParts(root);
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

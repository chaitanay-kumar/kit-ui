import {Component,ElementRef,signal,viewChild} from '@angular/core';
import {KitAnimatedTabsComponent,KitScrollvelocitytextComponent} from 'kit-ui-angular';

const typography = `:host{display:block}.k-b28-demo{font-family:var(--font-body,Geist,sans-serif);font-size:16px;line-height:1.5;letter-spacing:var(--tracking-body,-.011em);font-feature-settings:'cv02','cv03','cv04','cv11';color:var(--foreground,oklch(.141 .005 285.823));--radius:.875rem;--border:oklch(.92 .004 286.32)}:host-context(.dark) .k-b28-demo{color:var(--foreground,oklch(.985 0 0));--border:oklch(1 0 0 / .1)}*{box-sizing:border-box}`;

@Component({selector:'kit-animated-tabs-demo',standalone:true,imports:[KitAnimatedTabsComponent],styles:typography+`
.k-b28-tabs{padding-block:32px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.k-b28-tabs-card{font-size:12px;line-height:1.3333333333333333;color:var(--text-secondary);padding:16px;background:var(--surface-raised);border:1px solid var(--border);border-radius:calc(var(--radius)*1.4)}
:host-context(.dark) .k-b28-tabs-card{background:#141414;border-color:#1f1f1f;color:#a1a1a1}`,
template:`<div class="k-b28-demo k-b28-tabs"><ng-template #overview><div class="k-b28-tabs-card">Overview metrics &amp; telemetry</div></ng-template><ng-template #integration><div class="k-b28-tabs-card">Next.js App Router setup</div></ng-template><ng-template #security><div class="k-b28-tabs-card">Zero external runtime network dependencies</div></ng-template><kit-animated-tabs [tabs]="[{id:'tab1',label:'Overview',content:overview},{id:'tab2',label:'Integration',content:integration},{id:'tab3',label:'Security',content:security}]" defaultTab="tab1"/></div>`})
export class AnimatedTabsDemoComponent {}

@Component({selector:'kit-scroll-velocity-demo',standalone:true,imports:[KitScrollvelocitytextComponent],styles:typography+`
.k-b28-velocity{width:100%;display:flex;flex-direction:column;gap:16px}
.k-b28-toolbar{display:flex;flex-direction:column;justify-content:space-between;gap:10px;padding:10px;border-radius:calc(var(--radius)*1.4);background:#202020;border:1px solid #363636;font-size:12px;line-height:1.3333333333333333}
.k-b28-buttons{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.k-b28-buttons button{display:flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid #363636;border-radius:var(--radius);background:#242424;color:#f5f5f5;cursor:pointer;font:inherit;font-feature-settings:inherit;letter-spacing:inherit;font-size:11px;font-weight:500;transition:background-color .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1)}
.k-b28-buttons button.reset{gap:4px;padding-inline:8px;color:#a3a3a3;font-weight:400}
.k-b28-buttons button:hover{background:#2c2c2c}.k-b28-buttons button.reset:hover{background:#242424;color:white}
.k-b28-buttons svg{width:14px;height:14px;display:block;flex-shrink:0;color:white}.k-b28-buttons .reset svg{width:12px;height:12px;color:inherit}
.k-b28-settings{display:flex;align-items:center;gap:16px;color:#a3a3a3;flex-shrink:0}
.k-b28-settings label{display:flex;align-items:center;gap:6px;font-size:11px}
.k-b28-settings input{background:transparent;color:inherit;width:64px;accent-color:white;cursor:pointer;margin:0;padding:0;font:inherit;letter-spacing:inherit}
.k-b28-settings .value{font-family:var(--font-mono);font-size:11px;color:#f5f5f5;width:24px}
.k-b28-scroller{position:relative;width:100%;height:340px;overflow-y:auto;border-radius:calc(var(--radius)*1.8);border:1px solid #363636;background:#151515;padding:16px;box-shadow:0 25px 50px -12px rgb(0 0 0 / .25);user-select:none}
.k-b28-track{min-height:900px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding-block:32px;text-align:center}
.k-b28-hint{position:sticky;top:8px;z-index:20;padding:4px 10px;border-radius:calc(var(--radius)*.8);background:#202020;border:1px solid #363636;font-size:10px;font-family:var(--font-mono);color:#a3a3a3;backdrop-filter:blur(8px);max-width:100%}
.k-b28-title-area{margin-block:auto;padding-block:40px;display:flex;flex-direction:column;align-items:center;gap:12px;width:100%}
.k-b28-title{font-family:var(--font-mono);font-size:24px;line-height:1.3333333333333333;font-weight:900;color:#f5f5f5;text-transform:uppercase;text-align:center;margin:0}
.k-b28-description{font-family:var(--font-body);font-weight:400;font-size:12px;line-height:1.3333333333333333;letter-spacing:var(--tracking-body,-.011em);color:#a3a3a3;max-width:384px;padding-inline:8px;margin:0}
.k-b28-end{font-size:11px;font-family:var(--font-mono);color:#737373}
@media(min-width:640px){.k-b28-toolbar{flex-direction:row;align-items:center;gap:12px;padding:12px}.k-b28-buttons{gap:8px}.k-b28-buttons button{font-size:12px;padding-inline:12px}.k-b28-buttons button.reset{padding-inline:10px}.k-b28-settings label{font-size:12px}.k-b28-scroller{height:380px;padding:24px}.k-b28-track{padding-block:48px}.k-b28-hint{top:16px;padding-inline:12px;font-size:11px}.k-b28-title-area{padding-block:64px}.k-b28-title{font-size:60px;line-height:1}.k-b28-description{font-size:14px;line-height:1.4285714285714286}.k-b28-end{font-size:12px;line-height:1.3333333333333333}}`,
template:`<div class="k-b28-demo k-b28-velocity"><div class="k-b28-toolbar"><div class="k-b28-buttons"><button type="button" (click)="scroll(120)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 18L12 22L16 18"/><path d="M12 2V22"/></svg><span>Scroll Down</span></button><button type="button" (click)="scroll(-120)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6L12 2L16 6"/><path d="M12 2V22"/></svg><span>Scroll Up</span></button><button type="button" class="reset" (click)="reset()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg><span>Reset</span></button></div><div class="k-b28-settings"><label><span>Intensity:</span><input type="range" min="0.5" max="2.5" step="0.1" [value]="intensity()" (input)="intensity.set(+$any($event.target).value)"/><span class="value">{{intensity()}}x</span></label></div></div><div #scroller class="k-b28-scroller"><div class="k-b28-track"><div class="k-b28-hint">Scroll the container down and up to observe kinetic velocity physics</div><div class="k-b28-title-area"><h2 kitScrollVelocityText class="k-b28-title" text="BUILD THE FUTURE" [scrollContainerRef]="{current:scroller}" [expandDistance]="300" [intensity]="intensity()" [minLetterSpacing]="0.02" [maxLetterSpacing]="0.6" [maxScale]="1.4" [fadeStart]="0.6"></h2><p class="k-b28-description">Direction-aware letter-spacing expanding on downward momentum with zero per-frame React re-renders.</p></div><div class="k-b28-end">End of velocity track &#183; Scroll back up to restore rest state</div></div></div></div>`})
export class ScrollVelocityDemoComponent {
  readonly intensity=signal(1.2);
  readonly scroller=viewChild.required<ElementRef<HTMLDivElement>>('scroller');
  scroll(top:number):void { this.scroller().nativeElement.scrollBy({top,behavior:'smooth'}); }
  reset():void { this.scroller().nativeElement.scrollTo({top:0,behavior:'smooth'}); }
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import {afterEveryRender,NgZone,type SimpleChanges} from '@angular/core';import {AnimatedTabsIndicatorMotion} from './animated-tabs-motion';import {ScrollProgressLayoutMotion} from './scroll-progress-nav-motion';let progressSequence=0;export interface NavSectionItem{id:string;label:string;index?:string}export interface ScrollProgressContainerRef{current:HTMLElement|null}const DEFAULT_PROGRESS_SECTIONS:NavSectionItem[]=[{id:'overview',index:'01',label:'Overview'},{id:'features',index:'02',label:'Features'},{id:'components',index:'03',label:'Components'},{id:'documentation',index:'04',label:'Documentation'},{id:'pricing',index:'05',label:'Pricing'}];
@Component({
 selector:"kit-scroll-progress-nav", standalone:true,
 host:{'style':'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./scroll-progress-nav.css"],
template:`
<div [class]="'k-scroll-progress k-progress-'+mode()+' k-progress-'+position()+' '+className()">
<nav #nav role="navigation" aria-label="Table of contents" [class.k-progress-floating]="floating()">
<div class="k-progress-track">
<div class="k-progress-line" [style.width.%]="progress()">
</div>
</div>
<div class="k-progress-compact">
<span class="k-progress-number">{{current()?.index}}</span>
<span class="k-progress-current">{{current()?.label}}</span>
<button type="button" class="k-progress-toggle" aria-label="Toggle section menu" (click)="toggleExpanded()">
<svg aria-hidden="true" [class.k-progress-rotated]="expanded()" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m9 18 6-6-6-6"/>
</svg>
</button>
</div>
<div class="k-progress-sections" [class.k-progress-expanded]="expanded()">@for(section of sections();track section.id;let index=$index){<button type="button" class="k-progress-section" [class.k-progress-active]="activeSection()===section.id" (click)="choose(section.id)">@if(activeSection()===section.id){<div class="k-progress-indicator">
</div>}<span class="k-progress-number">{{section.index||'0'+(index+1)}}</span>
<span class="k-progress-label">{{section.label}}</span>
</button>}</div>@if(floating()){<button type="button" class="k-progress-top" title="Scroll to top" aria-label="Scroll back to top" (click)="top()">
<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m5 12 7-7 7 7"/>
<path d="M12 19V5"/>
</svg>
</button>}</nav>
</div>
`
})
export class KitScrollProgressNavComponent {
readonly sections=input<NavSectionItem[],NavSectionItem[]|undefined>(DEFAULT_PROGRESS_SECTIONS,{transform:value=>value===undefined?DEFAULT_PROGRESS_SECTIONS:value});readonly scrollThreshold=input<number,number|undefined>(150,{transform:value=>value===undefined?150:value});readonly activeId=input<string>();readonly mode=input<'fixed'|'inline'|'sticky','fixed'|'inline'|'sticky'|undefined>('fixed',{transform:value=>value===undefined?'fixed':value});readonly containerRef=input<ScrollProgressContainerRef|undefined>();readonly onSectionClick=input<((id:string)=>void)|undefined>();readonly position=input<'top-center'|'bottom-center'|'top-right','top-center'|'bottom-center'|'top-right'|undefined>('top-center',{transform:value=>value===undefined?'top-center':value});readonly className=input<string,string|undefined>('',{transform:value=>value===undefined?'':value});readonly floating=signal(true);readonly progress=signal(0);readonly activeSection=signal('');readonly expanded=signal(false);readonly current=computed(()=>this.sections().find(section=>section.id===this.activeSection())||this.sections()[0]);readonly nav=viewChild.required<ElementRef<HTMLElement>>('nav');private zone=inject(NgZone);private layoutMotion:ScrollProgressLayoutMotion|undefined;private indicatorMotion:AnimatedTabsIndicatorMotion|undefined;private readonly indicatorId='kit-scroll-progress-indicator-'+(++progressSequence);private initialized=false;private removeScroll:(()=>void)|undefined;
ngOnInit():void{this.activeSection.set(this.activeId()||this.sections()[0]?.id||'');this.floating.set(this.mode()!=='inline');this.initialized=true;this.configureScroll()}
ngOnChanges(changes:SimpleChanges):void{this.layoutMotion?.capture();this.indicatorMotion?.capture(true);if(!this.initialized)return;if(changes['activeId']&&this.activeId())this.activeSection.set(this.activeId()!);if(['sections','scrollThreshold','activeId','mode','containerRef'].some(key=>changes[key]))this.configureScroll()}
private configureScroll():void{this.removeScroll?.();this.removeScroll=undefined;if(typeof window==='undefined')return;const target=this.containerRef()?.current||(this.mode()==='fixed'?window:null);if(!target)return;target.addEventListener('scroll',this.track,{passive:true});this.track();this.removeScroll=()=>target.removeEventListener('scroll',this.track)}
private capture():void{this.layoutMotion?.capture();this.indicatorMotion?.capture()}
toggleExpanded():void{this.capture();this.expanded.set(!this.expanded())}
constructor(){afterEveryRender(()=>this.rendered())}
private rendered():void{this.zone.runOutsideAngular(()=>{const nav=this.nav().nativeElement;this.layoutMotion??=new ScrollProgressLayoutMotion(nav,()=>this.indicatorMotion?.projected());this.indicatorMotion??=new AnimatedTabsIndicatorMotion(nav,'.k-progress-indicator',undefined,()=>this.layoutMotion!.projection);this.layoutMotion.rendered(()=>{const pill=nav.querySelector<HTMLElement>('.k-progress-indicator');if(pill&&!pill.getClientRects().length){this.indicatorMotion?.destroy();this.indicatorMotion=undefined;return}this.indicatorMotion??=new AnimatedTabsIndicatorMotion(nav,'.k-progress-indicator',undefined,()=>this.layoutMotion!.projection);this.indicatorMotion.rendered(this.indicatorId)})})}
private track=():void=>{this.capture();const container=this.containerRef()?.current;let total=0,current=0;if(container){total=container.scrollHeight-container.clientHeight;current=container.scrollTop}else if(this.mode()==='fixed'){total=document.documentElement.scrollHeight-window.innerHeight;current=window.scrollY}if(total>0)this.progress.set(Math.min(100,Math.max(0,current/total*100)));if(this.mode()==='fixed')this.floating.set(current>this.scrollThreshold());if(!this.activeId()){const sections=this.sections();if(container){const origin=container.getBoundingClientRect().top;for(let i=sections.length-1;i>=0;i--){const node=container.querySelector<HTMLElement>('#'+sections[i].id);if(node&&node.getBoundingClientRect().top-origin<=120){this.activeSection.set(sections[i].id);break}}}else if(this.mode()==='fixed'){for(let i=sections.length-1;i>=0;i--){const node=document.getElementById(sections[i].id);if(node&&node.getBoundingClientRect().top<=window.innerHeight*.4){this.activeSection.set(sections[i].id);break}}}}};
choose(id:string):void{this.capture();this.activeSection.set(id);this.onSectionClick()?.(id);const container=this.containerRef()?.current;if(container){const node=container.querySelector<HTMLElement>('#'+id);if(node)container.scrollBy({top:node.getBoundingClientRect().top-container.getBoundingClientRect().top-20,behavior:'smooth'})}else if(typeof document!=='undefined')document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});this.expanded.set(false)}
top():void{const container=this.containerRef()?.current;if(container)container.scrollTo({top:0,behavior:'smooth'});else if(typeof window!=='undefined')window.scrollTo({top:0,behavior:'smooth'})}
ngOnDestroy():void{this.layoutMotion?.destroy();this.indicatorMotion?.destroy();this.removeScroll?.()}
}

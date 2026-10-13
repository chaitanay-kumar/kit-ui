// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, computed, effect, inject, input, signal, untracked } from '@angular/core';
import {DOCUMENT,NgTemplateOutlet} from '@angular/common';
import {TemplateRef,ViewEncapsulation} from '@angular/core';
export type FocusModeContent=string|TemplateRef<unknown>;
export interface FocusModeItem{id:string;title:string;category?:string;metric?:string;delta?:string;content:FocusModeContent;}
const defaultFocusItems:FocusModeItem[]=[{id:'revenue',title:'Monthly Recurring Revenue',category:'Financials',metric:'$148,290',delta:'+18.4% vs last month',content:'Gross expansion revenue driven by 42 net-new enterprise team conversions this cycle.'},{id:'traffic',title:'Edge API Throughput',category:'Infrastructure',metric:'42.8M req/s',delta:'99.998% uptime',content:'Global Anycast network serving p99 latencies under 14ms across all regions.'},{id:'users',title:'Active Developers',category:'Adoption',metric:'18,450',delta:'+2,100 this week',content:'Weekly active engineers utilizing CLI component scaffolding across 140+ countries.'}];
@Component({
 selector:"kit-focus-mode", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./focus-mode.css"],
template:`
<section [class]="'k-focus-mode '+className()">@if(activeId()){<header>
<span>◎ Focus Mode Active: <strong>{{activeTitle()}}</strong>
</span>
<span>Press <kbd>ESC</kbd> to exit <button type="button" (click)="setFocus(null)">× Exit</button>
</span>
</header>}<div class="k-focus-grid">@for(item of items();track item.id){<article [class.k-focused]="activeId()===item.id" [class.k-dimmed]="activeId()!==null&&activeId()!==item.id" [style.opacity]="activeId()!==null&&activeId()!==item.id?dimOpacity():1">
<div class="k-focus-heading">
<div>@if(item.category){<small>{{item.category}}</small>}<h4>{{item.title}}</h4>
</div>
<button type="button" [title]="activeId()===item.id?'Exit Focus':'Focus on this card'" [attr.aria-label]="(activeId()===item.id?'Exit focus on ':'Focus on ')+item.title" (click)="setFocus(activeId()===item.id?null:item.id)">{{activeId()===item.id?'×':'◎'}}</button>
</div>@if(item.metric){<div class="k-focus-metric">
<strong>{{item.metric}}</strong>@if(item.delta){<small>{{item.delta}}</small>}</div>}<div class="k-focus-content">@if(template(item.content);as content){<ng-container [ngTemplateOutlet]="content"/>}@else{ {{text(item.content)}} }</div>@if(activeId()!==item.id&&activeId()===null){<button type="button" class="k-focus-action" (click)="setFocus(item.id)">◎ Focus View</button>}</article>}</div>
</section>
`
})
export class KitFocusModeComponent {
readonly items=input<FocusModeItem[],FocusModeItem[]|undefined>(defaultFocusItems,{transform:v=>v??defaultFocusItems});readonly focusedId=input<string|null>();readonly onFocusChange=input<((id:string|null)=>void)|undefined>();readonly dimOpacity=input<number,number|undefined>(.2,{transform:v=>v??.2});readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly activeId=signal<string|null>(null);readonly activeTitle=computed(()=>this.items().find(item=>item.id===this.activeId())?.title??'');private readonly document=inject(DOCUMENT);private readonly keydown=(event:KeyboardEvent)=>{if(event.key==='Escape'&&this.activeId()){event.preventDefault();this.setFocus(null);}};constructor(){effect(()=>{const id=this.focusedId();if(id!==undefined)untracked(()=>this.activeId.set(id));});this.document.defaultView?.addEventListener('keydown',this.keydown);inject(DestroyRef).onDestroy(()=>this.document.defaultView?.removeEventListener('keydown',this.keydown));}setFocus(id:string|null):void{this.activeId.set(id);this.onFocusChange()?.(id);}template(value:FocusModeContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}text(value:FocusModeContent):string{return typeof value==='string'?value:'';}
}

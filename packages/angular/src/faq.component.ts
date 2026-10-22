// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, computed, effect, input, signal } from '@angular/core';
import {TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
export type FAQContent=string|number|boolean|null|undefined|TemplateRef<unknown>;
export interface FAQItem{id:string;question:string;answer:FAQContent;category?:string;badge?:string;icon?:FAQContent;}
export type FAQIconStyle='chevron'|'plus-minus'|'custom';
export type FAQVariant='unified'|'separated';
let faqId=0;
@Component({
 selector:"kit-faq", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./faq.css"],
template:`
<div [class]="'k-faq '+className()">@if(searchable()){<div class="k-faq-search">
<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<circle cx="11" cy="11" r="8"/>
<path d="m21 21-4.3-4.3"/>
</svg>
<input type="search" [value]="query()" [placeholder]="searchPlaceholder()" (input)="query.set($any($event.target).value)" />
</div>}@if(showCategories()&&categories().length>1){<div class="k-faq-categories">@for(category of categories();track category){<button type="button" [attr.aria-pressed]="selectedCategory()===category" (click)="selectedCategory.set(category)">{{category}}</button>}</div>}@if(!filtered().length){<div class="k-faq-empty">
<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10"/>
<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
<path d="M12 17h.01"/>
</svg>
<p>No matching questions found.</p>
</div>}@else{<div [class]="variant()==='separated'?'k-faq-separated':'k-faq-unified'">@for(item of filtered();track item.id){<div class="k-faq-item">
<button type="button" [id]="headerId(item.id)" [attr.aria-expanded]="active().includes(item.id)" [attr.aria-controls]="contentId(item.id)" (click)="toggle(item.id)">
<span class="k-faq-question">@if(template(item.icon);as icon){<ng-container [ngTemplateOutlet]="icon"/>}@else{ {{text(item.icon)}} }<span class="k-faq-label">
<span>{{item.question}}</span>@if(item.badge){<small>{{item.badge}}</small>}</span>
</span>
<span class="k-faq-indicator" [class.k-open]="!renderIcon()&&active().includes(item.id)" aria-hidden="true">@if(renderIcon()){<ng-container [ngTemplateOutlet]="renderIcon()!" [ngTemplateOutletContext]="{$implicit:active().includes(item.id),isOpen:active().includes(item.id)}"/>}@else{<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">@if(iconStyle()==='plus-minus'){<path d="M5 12h14"/>@if(!active().includes(item.id)){<path d="M12 5v14"/>}}@else{<path d="m6 9 6 6 6-6"/>}</svg>}</span>
</button>@if(active().includes(item.id)){<div class="k-faq-answer" role="region" [id]="contentId(item.id)" [attr.aria-labelledby]="headerId(item.id)">@if(template(item.answer);as answer){<ng-container [ngTemplateOutlet]="answer"/>}@else{ {{text(item.answer)}} }</div>}</div>}</div>}</div>
`
})
export class KitFaqComponent {
readonly items=input<FAQItem[]>([]);readonly allowMultiple=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly defaultOpen=input<string[]|string>();readonly openIds=input<string[]>();readonly onOpenChange=input<(ids:string[])=>void>();readonly iconStyle=input<FAQIconStyle,FAQIconStyle|undefined>('chevron',{transform:value=>value??'chevron'});readonly renderIcon=input<TemplateRef<{isOpen:boolean;$implicit:boolean}>>();readonly searchable=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly searchPlaceholder=input<string,string|undefined>('Search questions...',{transform:value=>value??'Search questions...'});readonly showCategories=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly variant=input<FAQVariant,FAQVariant|undefined>('unified',{transform:value=>value??'unified'});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly internal=signal<string[]>([]);readonly query=signal('');readonly selectedCategory=signal('All');readonly uid='kit-faq-'+(++faqId);private initialized=false;constructor(){effect(()=>{const value=this.defaultOpen();if(!this.initialized){this.initialized=true;this.internal.set(value===undefined?[]:Array.isArray(value)?value:[value]);}});}readonly active=computed(()=>this.openIds()??this.internal());readonly categories=computed(()=>{if(!this.showCategories())return[];const values=[...new Set(this.items().map(item=>item.category).filter((value):value is string=>!!value))];return values.length?['All',...values]:[];});readonly filtered=computed(()=>{const query=this.query().trim().toLowerCase(),category=this.selectedCategory();return this.items().filter(item=>(category==='All'||item.category===category)&&(!query||item.question.toLowerCase().includes(query)||(typeof item.answer==='string'&&item.answer.toLowerCase().includes(query))));});toggle(id:string):void{const active=this.active();const next=this.allowMultiple()?(active.includes(id)?active.filter(value=>value!==id):[...active,id]):active.includes(id)?[]:[id];if(this.openIds()===undefined)this.internal.set(next);this.onOpenChange()?.(next);}headerId(id:string):string{return this.uid+'-header-'+id;}contentId(id:string):string{return this.uid+'-content-'+id;}indicator(open:boolean):string{return this.iconStyle()==='plus-minus'?(open?'−':'+'):'⌄';}template(value:FAQContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}text(value:FAQContent):string|number{return typeof value==='string'||typeof value==='number'?value:'';}
}

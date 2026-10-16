// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import {afterRenderEffect} from '@angular/core';import {DEFAULT_STACKED_CARDS,type StackedCard} from './stacked-cards-types';import {StackedCardsScroll} from './stacked-cards-scroll';import {NativeRootBindings,type NativeAttributes,type NativeStyle} from './native-root-bindings';export type {StackedCard} from './stacked-cards-types';export type {NativeAttributes as StackedCardsAttributes,NativeStyle as StackedCardsStyle} from './native-root-bindings';
@Component({
 selector:"kit-stacked-cards", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./stacked-cards.css"],
template:`
@if(cards()?.length){<section #root aria-label="Stacked Stories" [class]="'k-native-stacked '+className()" (click)="rootClick($event)" (keydown)="rootKey($event)">
<div class="k-stacked-inner">@if(title()||subtitle()){<div class="k-stacked-heading">@if(title()){<h2>{{title()}}</h2>}@if(subtitle()){<p>{{subtitle()}}</p>}</div>}<div #stack class="k-stacked-track">@for(card of cards();track card.id;let index=$index){<div class="k-stacked-wrapper" [style.top]="'calc(4.5rem + '+index*16+'px)'" [style.z-index]="index+1">
<article class="k-stacked-article" [class.odd]="index%2===1">
<div class="k-stacked-grid">
<div class="k-stacked-content">
<div>
<h3>{{card.title}}</h3>
</div>
<div class="k-stacked-footer">
<p>{{card.description}}</p>@if(card.ctaLabel){<div class="k-stacked-action">
<a [href]="card.href||'#'">
<span>{{card.ctaLabel}}</span>
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
<path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</a>
</div>}</div>
</div>
<div class="k-stacked-image">
<img [src]="card.image" [alt]="card.imageAlt||card.title" loading="lazy"/>
<div class="k-stacked-scrim">
</div>
</div>
</div>
</article>
</div>}</div>
</div>
</section>}
`
})
export class KitStackedCardsComponent {
readonly cards=input<StackedCard[]|null,StackedCard[]|null|undefined>(DEFAULT_STACKED_CARDS,{transform:v=>v===undefined?DEFAULT_STACKED_CARDS:v});readonly title=input<string|undefined>();readonly subtitle=input<string|undefined>();readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly styles=input<NativeStyle|undefined>(undefined,{alias:'style'});readonly attributes=input<NativeAttributes|undefined>();readonly onClick=input<((event:MouseEvent)=>void)|undefined>();readonly onKeyDown=input<((event:KeyboardEvent)=>void)|undefined>();readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly stack=viewChild<ElementRef<HTMLElement>>('stack');private scroll:StackedCardsScroll|undefined;private scrollTarget:HTMLElement|undefined;private bindings:NativeRootBindings|undefined;private boundRoot:HTMLElement|undefined;rootClick(event:MouseEvent):void{this.onClick()?.(event)}rootKey(event:KeyboardEvent):void{this.onKeyDown()?.(event)}constructor(){afterRenderEffect(()=>{const root=this.root()?.nativeElement,styles=this.styles(),attributes=this.attributes();if(root){if(root!==this.boundRoot){this.bindings=new NativeRootBindings(root);this.boundRoot=root}this.bindings!.apply(styles,attributes,{'aria-label':'Stacked Stories'})}});afterRenderEffect(()=>{const target=this.stack()?.nativeElement;this.cards();if(target!==this.scrollTarget){this.scroll?.destroy();this.scrollTarget=target;this.scroll=target?new StackedCardsScroll(target):undefined}else this.scroll?.schedule()});inject(DestroyRef).onDestroy(()=>this.scroll?.destroy())}
}

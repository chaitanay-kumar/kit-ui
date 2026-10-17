import {Component,DestroyRef,ElementRef,ErrorHandler,afterRenderEffect,inject,input} from '@angular/core';
import type {PricingFeature,PricingTier} from './pricing-types';
import {PricingEntryMotion} from './pricing-motion';
import {invokeNativeEventCallback} from './native-event-callback';
@Component({selector:'div[kitPricingCard]',standalone:true,host:{class:'k-pricing-card','[class.featured]':'featured()','[style.opacity]':'reduceMotion()?1:0','[style.transform]':"reduceMotion()?'none':'translateY(8px)'"},template:`<div class="k-pricing-tier-header"><div><h3>{{tier().name}}</h3></div>@if(tier().tagline){<p>{{tier().tagline}}</p>}</div><div class="k-pricing-price"><span>{{tier().price}}</span><span>{{tier().cadence}}</span></div><div class="k-pricing-divider" aria-hidden="true"></div><ul class="k-pricing-features">@for(feature of features();track tier().name+'-'+$index){<li><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>{{feature.label}}</span></li>}</ul><button type="button" class="k-pricing-cta" (click)="activate($event)">@if(featured()){<span aria-hidden="true" data-pro-sheen></span><span aria-hidden="true" data-pro-shimmer></span>}<span class="k-pricing-cta-label">{{tier().ctaLabel}}</span></button>`})
export class PricingCardComponent{
 readonly tier=input.required<PricingTier>();readonly featured=input.required<boolean>();readonly reduceMotion=input.required<boolean>();private host=inject<ElementRef<HTMLElement>>(ElementRef);private entry:PricingEntryMotion|undefined;private initialized=false;private errors=inject(ErrorHandler);
 features():PricingFeature[]{return this.tier().features.map(feature=>typeof feature==='string'?{label:feature}:feature)}
 activate(event:MouseEvent):void{invokeNativeEventCallback(this.tier().onCtaClick,event,this.errors)}
 constructor(){afterRenderEffect(()=>{if(this.initialized)return;this.initialized=true;if(!this.reduceMotion())this.entry=new PricingEntryMotion(this.host.nativeElement,this.featured())});inject(DestroyRef).onDestroy(()=>this.entry?.destroy())}
}

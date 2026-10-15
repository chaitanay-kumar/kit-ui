// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ElementRef, computed, input, viewChild } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
@Component({
 selector:"kit-not-found", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./not-found.css"],
template:`
<section #root [class]="'k-not-found '+className()" aria-labelledby="not-found-heading" (pointermove)="move($event)" (pointerleave)="reset()">
<span class="sr-only">Error {{errorCode()}}: {{title()}}</span>@if(badgeLabel()){<div class="k-not-found-badge">
<i aria-hidden="true">
</i>{{badgeLabel()}}</div>}<div class="k-not-found-code" aria-hidden="true">@for(char of characters();track $index){<button type="button" tabindex="-1" (click)="tap($event,$index)">{{char}}</button>}</div>
<div>
<h1 id="not-found-heading">{{title()}}</h1>@if(description()){<p>{{description()}}</p>}</div>
<div class="k-not-found-actions">
<ng-content>@if(actionLabel()){<button type="button" (click)="primary()">⌂ {{actionLabel()}}</button>}@if(secondaryActionLabel()){<button type="button" (click)="secondary()">← {{secondaryActionLabel()}}</button>}</ng-content>
</div>
</section>
`
})
export class KitNotFoundComponent {
readonly errorCode=input<string,string|undefined>('404',{transform:v=>v??'404'});readonly badgeLabel=input<string>();readonly title=input<string,string|undefined>('This page took a wrong turn.',{transform:v=>v??'This page took a wrong turn.'});readonly description=input<string,string|undefined>("The requested page doesn't exist or may have moved.",{transform:v=>v??"The requested page doesn't exist or may have moved."});readonly actionLabel=input<string,string|undefined>('Go back home',{transform:v=>v??'Go back home'});readonly onAction=input<(()=>void)|undefined>();readonly secondaryActionLabel=input<string>();readonly onSecondaryAction=input<(()=>void)|undefined>();readonly showCoordinates=input<boolean,boolean|undefined>(true,{transform:v=>v??true});readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly characters=computed(()=>this.errorCode().split(''));readonly root=viewChild.required<ElementRef<HTMLElement>>('root');move(event:PointerEvent):void{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const rect=this.root().nativeElement.getBoundingClientRect();this.root().nativeElement.style.setProperty('--pointer-x',String((event.clientX-rect.left)/rect.width-.5));this.root().nativeElement.style.setProperty('--pointer-y',String((event.clientY-rect.top)/rect.height-.5));}reset():void{this.root().nativeElement.style.removeProperty('--pointer-x');this.root().nativeElement.style.removeProperty('--pointer-y');}tap(event:Event,index:number):void{const el=event.currentTarget as HTMLElement;el.animate([{transform:'translateY(-16px) rotate('+(index%2?'-6deg':'6deg')+')'},{transform:''}],{duration:180});}primary():void{if(this.onAction())this.onAction()!();else location.assign('/');}secondary():void{if(this.onSecondaryAction())this.onSecondaryAction()!();else if(history.length>1)history.back();else location.assign('/');}
}

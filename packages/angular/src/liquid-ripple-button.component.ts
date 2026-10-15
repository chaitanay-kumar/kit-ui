// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ElementRef, computed, inject, input, signal } from '@angular/core';
import {ViewEncapsulation,booleanAttribute} from '@angular/core';import {installLiquidRippleMotion} from './liquid-ripple-button-motion';import {NgTemplateOutlet} from '@angular/common';export type LiquidRippleVariant='primary'|'secondary';interface LiquidRipple{id:number;x:number;y:number}
@Component({
 selector:"kit-liquid-ripple-button,button[kitLiquidRippleButton]", standalone:true,
 host:{'[style.display]':'native ? null : "contents"','[class]':'native ? buttonClass() : ""','[attr.type]':'native ? type() : null','[attr.disabled]':'native && disabled() ? "" : null','(mouseenter)':'native ? enter() : null','(mouseleave)':'native ? hovered.set(false) : null','(pointerdown)':'native ? press($event) : null','(click)':'native ? click($event) : null'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./liquid-ripple-button.css"],
template:`
<ng-template #content>@if(!reduced){<span class="k-liquid-waves" aria-hidden="true">
<i>
<svg viewBox="0 0 2000 100" preserveAspectRatio="none">
<path d="M0,30 Q250,70 500,30 T1000,30 T1500,70 T2000,30 L2000,100 L0,100 Z"/>
</svg>
</i>
<i>
<svg viewBox="0 0 2000 100" preserveAspectRatio="none">
<path d="M0,45 Q250,10 500,45 T1000,45 T1500,10 T2000,45 L2000,100 L0,100 Z"/>
</svg>
</i>
<b>
</b>
</span>}<span class="k-liquid-sheen" aria-hidden="true">
</span>@if(!reduced){@for(ripple of ripples();track ripple.id){<span aria-hidden="true" class="k-liquid-ring outer" (animationend)="complete(ripple.id)" [style.left.px]="ripple.x" [style.top.px]="ripple.y">
</span>
<span aria-hidden="true" class="k-liquid-ring inner" [style.left.px]="ripple.x" [style.top.px]="ripple.y">
</span>}}<span class="k-liquid-content">@if(showIcon()){<svg viewBox="0 0 24 24" aria-hidden="true">
<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
<path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
</svg>}<span>
<ng-content>{{label()}}</ng-content>
</span>
</span>
</ng-template>@if(native){<ng-container [ngTemplateOutlet]="content"/>}@else{<button [attr.type]="type()" [class]="buttonClass()" [class.hovered]="hovered()" [disabled]="disabled()" (mouseenter)="enter()" (mouseleave)="hovered.set(false)" (pointerdown)="press($event)" (click)="click($event)">
<ng-container [ngTemplateOutlet]="content"/>
</button>}
`
})
export class KitLiquidRippleButtonComponent {
readonly reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;readonly native=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName==='BUTTON';readonly type=input<'button'|'submit'|'reset'|undefined>('button');readonly buttonClass=computed(()=>'k-liquid-ripple '+this.variant()+' '+this.className()+(this.hovered()?' hovered':''));readonly label=input<string,string|undefined>('Water Ripple',{alias:'children',transform:value=>value??'Water Ripple'});readonly variant=input<LiquidRippleVariant,LiquidRippleVariant|undefined>('secondary',{transform:value=>value??'secondary'});readonly showIcon=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly disabled=input(false,{transform:(value:unknown)=>value===undefined?false:booleanAttribute(value)});readonly onClick=input<((event:MouseEvent)=>void)|undefined>();readonly onPointerDown=input<((event:PointerEvent)=>void)|undefined>();readonly hovered=signal(false);readonly ripples=signal<LiquidRipple[]>([]);private id=0;enter():void{if(!this.disabled())this.hovered.set(true);}click(event:MouseEvent):void{if(!this.disabled())this.onClick()?.(event);}press(event:PointerEvent):void{const rect=(event.currentTarget as HTMLElement).getBoundingClientRect(),ripple={id:++this.id,x:event.clientX-rect.left,y:event.clientY-rect.top};this.ripples.update(items=>[...items.slice(-3),ripple]);this.onPointerDown()?.(event);}complete(id:number):void{this.ripples.update(items=>items.filter(item=>item.id!==id));}constructor(){installLiquidRippleMotion();}
}

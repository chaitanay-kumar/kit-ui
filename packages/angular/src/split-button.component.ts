// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';import {TemplateRef,ViewEncapsulation} from '@angular/core';export type SplitButtonSize='sm'|'md'|'lg';export type SplitButtonVariant='primary'|'secondary'|'danger'|'info';export interface SplitButtonOption{value:string;label:string;icon?:TemplateRef<unknown>;disabled?:boolean;onSelect?:()=>void}
@Component({
 selector:"kit-split-button", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./split-button.css"],
template:`
<div #root [class]="'k-split '+size()+' '+variant()+' '+className()" [class.disabled]="disabled()">
<div class="k-split-group">
<button type="button" [disabled]="disabled()" (click)="onClick()?.()">{{label()}}</button>
<span aria-hidden="true">
</span>
<button #trigger type="button" aria-haspopup="menu" [attr.aria-expanded]="open()" [attr.aria-label]="'More '+label()+' options'" [disabled]="disabled()" (click)="toggle()">
<i [class.open]="open()">⌄</i>
</button>
</div>@if(open()){<div #menu role="menu" [attr.aria-label]="label()+' options'" tabindex="-1" [attr.data-placement]="placement()" (keydown)="keys($event)">@for(option of options();track option.value;let index=$index){<button type="button" role="menuitem" [disabled]="option.disabled" [attr.aria-disabled]="option.disabled||null" [class.active]="index===activeIndex()&&!option.disabled" (mouseenter)="!option.disabled&&activeIndex.set(index)" (click)="select(option)">@if(option.icon){<ng-container [ngTemplateOutlet]="option.icon!"/>}<span>{{option.label}}</span>
</button>}</div>}</div>
`
})
export class KitSplitButtonComponent {
readonly label=input.required<string>();readonly onClick=input<(()=>void)|undefined>();readonly options=input.required<SplitButtonOption[]>();readonly size=input<SplitButtonSize,SplitButtonSize|undefined>('md',{transform:value=>value??'md'});readonly variant=input<SplitButtonVariant,SplitButtonVariant|undefined>('primary',{transform:value=>value??'primary'});readonly disabled=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly open=signal(false);readonly placement=signal<'top'|'bottom'>('bottom');readonly activeIndex=signal(0);readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly trigger=viewChild<ElementRef<HTMLButtonElement>>('trigger');readonly menu=viewChild<ElementRef<HTMLElement>>('menu');private outside=(event:PointerEvent)=>{if(!this.root()?.nativeElement.contains(event.target as Node))this.open.set(false);};ngOnInit():void{document.addEventListener('pointerdown',this.outside);}toggle():void{if(this.disabled())return;this.open.update(value=>!value);if(this.open()){const enabled=this.enabled();this.activeIndex.set(enabled[0]??0);const rect=this.trigger()?.nativeElement.getBoundingClientRect(),height=this.options().length*36+16;if(rect)this.placement.set(innerHeight-rect.bottom<height&&rect.top>height?'top':'bottom');requestAnimationFrame(()=>this.menu()?.nativeElement.focus());}}private enabled():number[]{return this.options().flatMap((option,index)=>option.disabled?[]:[index]);}select(option:SplitButtonOption):void{if(option.disabled)return;option.onSelect?.();this.close();}close():void{this.open.set(false);this.trigger()?.nativeElement.focus();}keys(event:KeyboardEvent):void{const enabled=this.enabled();if(!enabled.length){if(event.key==='Escape')this.close();return;}const position=enabled.indexOf(this.activeIndex());if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const step=event.key==='ArrowDown'?1:-1;this.activeIndex.set(enabled[(position+step+enabled.length)%enabled.length]);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();this.activeIndex.set(event.key==='Home'?enabled[0]:enabled.at(-1)!);}else if(event.key==='Enter'||event.key===' '){event.preventDefault();const option=this.options()[this.activeIndex()];if(option)this.select(option);}else if(event.key==='Escape'){event.preventDefault();this.close();}else if(event.key==='Tab')this.open.set(false);}constructor(){inject(DestroyRef).onDestroy(()=>document.removeEventListener('pointerdown',this.outside));}
}

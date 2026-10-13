// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {TemplateRef,ViewEncapsulation} from '@angular/core';
export type TooltipSide='top'|'right'|'bottom'|'left';
export type TooltipAlign='start'|'center'|'end';
export type TooltipContent=string|number|TemplateRef<unknown>;
let tooltipId=0;
@Component({
 selector:"kit-directional-tooltip", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./directional-tooltip.css"],
template:`
<span [class]="'k-directional-wrap '+className()" (mouseenter)="schedule()" (mouseleave)="close()" (focusin)="schedule()" (focusout)="close()">
<span class="k-directional-trigger" [attr.aria-describedby]="isOpen()?uid:null">
<ng-content select="[tooltipTrigger]">
</ng-content>
</span>@if(isOpen()){<span [id]="uid" role="tooltip" [class]="'k-directional-tip k-'+side()+' k-align-'+align()" [style.--offset.px]="offset()">@if(template(content());as rich){<ng-container [ngTemplateOutlet]="rich"/>}@else{ {{text(content())}} }@if(showArrow()){<i aria-hidden="true">
</i>}</span>}</span>
`
})
export class KitDirectionalTooltipComponent {
readonly content=input.required<TooltipContent>();readonly side=input<TooltipSide,TooltipSide|undefined>('top',{transform:value=>value??'top'});readonly align=input<TooltipAlign,TooltipAlign|undefined>('center',{transform:value=>value??'center'});readonly delayDuration=input<number,number|undefined>(150,{transform:value=>value??150});readonly showArrow=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly offset=input<number,number|undefined>(8,{transform:value=>value??8});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly forceOpen=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly open=signal(false);readonly isOpen=computed(()=>this.open()||this.forceOpen());readonly uid='directional-tooltip-'+(++tooltipId);private timer:ReturnType<typeof setTimeout>|undefined;schedule():void{if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(()=>this.open.set(true),this.delayDuration());}close():void{if(this.timer)clearTimeout(this.timer);this.open.set(false);}template(value:TooltipContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}text(value:TooltipContent):string|number{return typeof value==='string'||typeof value==='number'?value:'';}constructor(){inject(DestroyRef).onDestroy(()=>{if(this.timer)clearTimeout(this.timer);});}
}

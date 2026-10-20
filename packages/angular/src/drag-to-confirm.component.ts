// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, effect, inject, input, untracked, viewChild } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';import {TemplateRef,afterRenderEffect,ErrorHandler} from '@angular/core';import {DragConfirmController,type DragConfirmActionType,type DragConfirmVariant,type DragConfirmSize} from './drag-confirm-controller';import {Batch43IconComponent} from './batch43-icons';import {DragConfirmRevealDirective} from './drag-confirm-reveal';export type {DragConfirmActionType,DragConfirmVariant,DragConfirmSize} from './drag-confirm-controller';
@Component({
 selector:"kit-drag-to-confirm", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet,Batch43IconComponent,DragConfirmRevealDirective],
encapsulation:ViewEncapsulation.None,styleUrls:["./drag-to-confirm.css"],
template:`
<div [class]="'k-drag-confirm '+className()">
<div #track [class]="'k-drag-track '+size()+' tone-'+engine.tone()" [class.confirmed]="engine.confirmed()" [class.disabled]="disabled()">
<div #fill class="k-drag-fill">
</div>
<div #labelNode class="k-drag-label">{{label()}}</div>@if(engine.confirmed()){<div class="k-drag-confirmed-label" kitDragReveal="label">{{confirmedLabel()}}</div>}<div #thumb class="k-drag-thumb" [tabIndex]="disabled()?-1:0" role="slider" [attr.aria-label]="label()" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="engine.ariaProgress()" (keydown)="engine.key($event)" (keyup)="engine.keyUp($event)" (blur)="engine.releaseKey()">@if(engine.confirmed()){<div kitDragReveal="icon">@if(confirmedIcon()){<ng-container [ngTemplateOutlet]="confirmedIcon()!"/>}@else{<svg kitBatch43Icon icon="check" class="k-drag-check"/>}</div>}@else if(icon()){<ng-container [ngTemplateOutlet]="icon()!"/>}@else{<svg kitBatch43Icon [icon]="actionType()==='delete'?'trash-2':actionType()==='unlock'?'lock':actionType()==='archive'?'archive':actionType()==='submit'?'arrow-right':'chevron-right'"/>}</div>
</div>
<div class="k-drag-sr">
<button type="button" (click)="engine.keyboard()" [disabled]="disabled()||engine.confirmed()">{{label()}}</button>
</div>
</div>
`
})
export class KitDragToConfirmComponent {
readonly label=input<string,string|undefined>('Slide to confirm',{transform:v=>v===undefined?'Slide to confirm':v});readonly confirmedLabel=input<string,string|undefined>('Confirmed ✓',{transform:v=>v===undefined?'Confirmed ✓':v});readonly actionType=input<DragConfirmActionType,DragConfirmActionType|undefined>('confirm',{transform:v=>v===undefined?'confirm':v});readonly variant=input<DragConfirmVariant|undefined>();readonly size=input<DragConfirmSize,DragConfirmSize|undefined>('md',{transform:v=>v===undefined?'md':v});readonly icon=input<TemplateRef<unknown>|undefined|null>();readonly confirmedIcon=input<TemplateRef<unknown>|undefined|null>();readonly isConfirmed=input<boolean|undefined>();readonly onConfirm=input<(()=>void)|undefined>();readonly onReset=input<(()=>void)|undefined>();readonly autoResetDelay=input<number,number|undefined>(2500,{transform:v=>v===undefined?2500:v});readonly disabled=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly haptic=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly track=viewChild<ElementRef<HTMLElement>>('track');readonly thumb=viewChild<ElementRef<HTMLElement>>('thumb');readonly fill=viewChild<ElementRef<HTMLElement>>('fill');readonly labelNode=viewChild<ElementRef<HTMLElement>>('labelNode');private readonly errors=inject(ErrorHandler);readonly engine=new DragConfirmController(error=>queueMicrotask(()=>this.errors.handleError(error)));constructor(){effect(()=>{const options={isConfirmed:this.isConfirmed(),onConfirm:this.onConfirm(),onReset:this.onReset(),autoResetDelay:this.autoResetDelay(),disabled:this.disabled(),haptic:this.haptic(),size:this.size(),actionType:this.actionType(),variant:this.variant()};untracked(()=>this.engine.update(options))});afterRenderEffect(()=>{/* Size measurement follows DOM commit; class-only changes intentionally retain source bounds. */this.size();const track=this.track()?.nativeElement,thumb=this.thumb()?.nativeElement,fill=this.fill()?.nativeElement,label=this.labelNode()?.nativeElement;if(track&&thumb&&fill&&label)untracked(()=>this.engine.mount(track,thumb,fill,label))});inject(DestroyRef).onDestroy(()=>this.engine.destroy())}
}

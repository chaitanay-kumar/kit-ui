// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import {afterRenderEffect,ChangeDetectorRef,ErrorHandler} from '@angular/core';import {TorqueDialController} from './torque-dial-controller';
@Component({
 selector:"kit-torque-dial", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./torque-dial.css"],
template:`
<div [class]="'k-torque-dial '+className()">
<div #dial class="k-torque-slider" role="slider" [attr.aria-label]="label()" [attr.aria-valuemin]="min()" [attr.aria-valuemax]="max()" [attr.aria-valuenow]="value()" [tabIndex]="disabled()?-1:0" [class.disabled]="disabled()" [style.width.px]="size()" [style.height.px]="size()">
<svg class="k-torque-gauge" [style.width.px]="size()" [style.height.px]="size()" viewBox="0 0 100 100">
<circle cx="50" cy="50" r="40" fill="none" stroke="#1F1F1F" stroke-width="5" [attr.stroke-dasharray]="arcLength+' '+circumference" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(135 50 50)"/>
<circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" stroke-width="5" [attr.stroke-dasharray]="arcLength+' '+circumference" [attr.stroke-dashoffset]="arcLength*(1-progress())" stroke-linecap="round" transform="rotate(135 50 50)"/>
</svg>
<div class="k-torque-knob" [class.dragging]="isDragging()" [style.width.px]="size()*.65" [style.height.px]="size()*.65" [style.transform]="'rotate('+angle()+'deg)'">
<span class="k-torque-notch">
</span>
<div class="k-torque-center">
</div>
</div>
</div>@if(showValue()){<div class="k-torque-display">
<div>{{value()}}{{unit()}}</div>
<span>{{label()}}</span>
</div>}</div>
`
})
export class KitTorqueDialComponent {
readonly value=input.required<number>();readonly onChange=input.required<(value:number)=>void>();readonly onChangeEnd=input<(()=>void)|undefined>();readonly min=input<number,number|undefined>(0,{transform:v=>v===undefined?0:v});readonly max=input<number,number|undefined>(100,{transform:v=>v===undefined?100:v});readonly step=input<number,number|undefined>(1,{transform:v=>v===undefined?1:v});readonly label=input<string,string|undefined>('Dial control',{transform:v=>v===undefined?'Dial control':v});readonly showValue=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly size=input<number,number|undefined>(120,{transform:v=>v===undefined?120:v});readonly disabled=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly momentum=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly unit=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly dial=viewChild<ElementRef<HTMLElement>>('dial');readonly isDragging=signal(false);readonly circumference=2*Math.PI*40;readonly arcLength=this.circumference*(270/360);readonly progress=computed(()=>Math.min(1,Math.max(0,(this.value()-this.min())/(this.max()-this.min()||1))));readonly angle=computed(()=>-135+this.progress()*270);private controller:TorqueDialController|undefined;private disposed=false;private readonly errors=inject(ErrorHandler);private readonly changes=inject(ChangeDetectorRef);constructor(){afterRenderEffect(()=>{const host=this.dial()?.nativeElement,callback=this.onChange(),end=this.onChangeEnd();const options={value:this.value(),min:this.min(),max:this.max(),step:this.step(),disabled:this.disabled(),momentum:this.momentum(),onChange:(value:number)=>{try{callback(value)}finally{if(!this.disposed)this.changes.markForCheck()}},onChangeEnd:end?()=>{try{end()}finally{if(!this.disposed)this.changes.markForCheck()}}:undefined};if(host?.ownerDocument.defaultView){if(this.controller)this.controller.configure(options);else this.controller=new TorqueDialController(host,host.ownerDocument.defaultView,options,dragging=>this.isDragging.set(dragging),error=>queueMicrotask(()=>this.errors.handleError(error)))}});inject(DestroyRef).onDestroy(()=>{this.disposed=true;this.controller?.destroy()})}
}

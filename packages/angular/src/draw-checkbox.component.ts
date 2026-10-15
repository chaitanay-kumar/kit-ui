// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ElementRef, computed, inject, input, signal } from '@angular/core';
import {TemplateRef,ViewEncapsulation} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
export type DrawCheckboxContent=string|number|boolean|null|undefined|TemplateRef<unknown>;
let drawCheckboxId=0;
@Component({
 selector:"kit-draw-checkbox", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./draw-checkbox.css"],
template:`
<div [class]="'k-draw-checkbox '+(disabled()?'k-draw-disabled ':'')+className()">
<span class="k-draw-control">
<input #nativeInput [id]="inputId" type="checkbox" [checked]="current()" [indeterminate]="indeterminate()" [disabled]="disabled()" [required]="required()" [attr.name]="name()" [attr.aria-label]="ariaLabel()" (change)="change($event)"/>
<span class="k-draw-box" [class.k-draw-active]="current()||indeterminate()" aria-hidden="true" (click)="activate()">@if(current()&&!indeterminate()){<svg viewBox="0 0 16 16">
<path d="M3.5 8.5 L6.5 11.5 L12.5 5"/>
</svg>}@if(indeterminate()){<span class="k-draw-bar">
</span>}</span>
</span>@if(label()!==null&&label()!==undefined||description()){<label [for]="inputId">@if(template(label());as content){<ng-container [ngTemplateOutlet]="content"/>}@else{<span>{{text(label())}}</span>}@if(description()){<small>{{description()}}</small>}</label>}</div>
`
})
export class KitDrawCheckboxComponent {
readonly checked=input<boolean>();readonly defaultChecked=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly onChange=input<(event:Event)=>void>();readonly disabled=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly indeterminate=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly label=input<DrawCheckboxContent>();readonly description=input<string>();readonly id=input<string>();readonly name=input<string>();readonly required=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly ariaLabel=input<string>('',{alias:'aria-label'});readonly internal=signal<boolean|undefined>(undefined);readonly generatedId='kit-draw-checkbox-'+(++drawCheckboxId);readonly inputId=computed(()=>this.id()||this.generatedId);readonly current=computed(()=>this.checked()??this.internal()??this.defaultChecked());private readonly host=inject(ElementRef<HTMLElement>);change(event:Event):void{const input=event.target as HTMLInputElement;if(this.checked()===undefined)this.internal.set(input.checked);this.onChange()?.(event);if(this.checked()!==undefined)input.checked=this.checked()!;}activate():void{if(!this.disabled())(this.host.nativeElement.querySelector('input') as HTMLInputElement|null)?.click();}template(value:DrawCheckboxContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}text(value:DrawCheckboxContent):string|number{return typeof value==='string'||typeof value==='number'?value:'';}
}

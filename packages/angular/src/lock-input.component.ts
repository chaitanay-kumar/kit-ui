// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, computed, input, signal } from '@angular/core';
import {TemplateRef,ViewEncapsulation} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
export type LockInputContent=string|number|boolean|null|undefined|TemplateRef<unknown>;
let lockInputId=0;
@Component({
 selector:"kit-lock-input", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./lock-input.css"],
template:`
<div class="k-lock-root">@if(label()){<label [for]="inputId">{{label()}}</label>}<div class="k-lock-wrap">@if(template(leftIcon());as icon){<span class="k-lock-left">
<ng-container [ngTemplateOutlet]="icon"/>
</span>}@else if(text(leftIcon())){<span class="k-lock-left">{{text(leftIcon())}}</span>}<input [id]="inputId" [type]="type()" [value]="current()" [disabled]="disabled()" [readOnly]="readOnly()" [required]="required()" [attr.name]="name()" [attr.placeholder]="placeholder()" [attr.autocomplete]="autocomplete()" [attr.aria-label]="ariaLabel()" [attr.aria-invalid]="!!error()" [attr.aria-describedby]="description()?inputId+'-desc':null" [class]="'k-lock-input '+(leftIcon()?'k-lock-has-left ':'')+(rightIcon()?'k-lock-has-right ':'')+(error()?'k-lock-error ':'')+className()" (input)="change($event)" (focus)="focus($event)" (blur)="blur($event)"/> <span class="k-lock-ring" [class.k-lock-focused]="focused()" aria-hidden="true">
</span>@if(template(rightIcon());as icon){<span class="k-lock-right">
<ng-container [ngTemplateOutlet]="icon"/>
</span>}@else if(text(rightIcon())){<span class="k-lock-right">{{text(rightIcon())}}</span>}</div>@if(description()&&!error()){<p [id]="inputId+'-desc'">{{description()}}</p>}@if(error()){<p role="alert" class="k-lock-alert">{{error()}}</p>}</div>
`
})
export class KitLockInputComponent {
readonly label=input<string>();readonly description=input<string>();readonly error=input<string>();readonly leftIcon=input<LockInputContent>();readonly rightIcon=input<LockInputContent>();readonly value=input<string>();readonly defaultValue=input<string,string|undefined>('',{transform:value=>value??''});readonly onChange=input<(event:Event)=>void>();readonly onFocus=input<(event:FocusEvent)=>void>();readonly onBlur=input<(event:FocusEvent)=>void>();readonly disabled=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly readOnly=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly required=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly type=input<string,string|undefined>('text',{transform:value=>value??'text'});readonly id=input<string>();readonly name=input<string>();readonly placeholder=input<string>();readonly autocomplete=input<string>();readonly ariaLabel=input<string>('',{alias:'aria-label'});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly internal=signal<string|undefined>(undefined);readonly focused=signal(false);readonly generatedId='kit-lock-input-'+(++lockInputId);readonly inputId=computed(()=>this.id()||this.generatedId);readonly current=computed(()=>this.value()??this.internal()??this.defaultValue());change(event:Event):void{const input=event.target as HTMLInputElement;if(this.value()===undefined)this.internal.set(input.value);this.onChange()?.(event);if(this.value()!==undefined)input.value=this.value()!;}focus(event:FocusEvent):void{this.focused.set(true);this.onFocus()?.(event);}blur(event:FocusEvent):void{this.focused.set(false);this.onBlur()?.(event);}template(value:LockInputContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}text(value:LockInputContent):string|number{return typeof value==='string'||typeof value==='number'?value:'';}
}

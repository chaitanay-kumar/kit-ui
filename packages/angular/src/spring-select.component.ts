// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, effect, input, signal, untracked, viewChild } from '@angular/core';
import {SpringSelectMotion} from './spring-select-motion';let springSelectSequence=0;export interface SpringSelectOption{value:string;label:string;disabled?:boolean;description?:string}
@Component({
 selector:"kit-spring-select", standalone:true,
 host:{'style':'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./spring-select.css"],
template:`
<div #root class="k-spring-select" [class]="'k-spring-select '+className()" [id]="rootId">@if(label()){<label [for]="rootId+'-trigger'">{{label()}}</label>}<button #trigger type="button" [id]="rootId+'-trigger'" [disabled]="disabled()" aria-haspopup="listbox" [attr.aria-expanded]="open()" [class.k-select-open]="open()" [class.k-select-error]="!!error()" [class.k-select-chosen]="!!currentOption()" (click)="toggle()" (keydown)="triggerKey($event)">
<span class="k-select-value">{{currentOption()?.label??placeholder()}}</span>
<div #chevron class="k-select-chevron">
<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m6 9 6 6 6-6"/>
</svg>
</div>
</button>@if(present()){<ul #panel role="listbox" tabindex="-1" (keydown)="listKey($event)">@for(option of renderedOptions();track $index;let index=$index){<li role="option" [attr.aria-selected]="option.value===renderedValue()" [attr.aria-disabled]="option.disabled" [class.k-select-selected]="option.value===renderedValue()" [class.k-select-disabled]="option.disabled" [class.k-select-active]="renderedIndex()===index&&!option.disabled" (mouseenter)="activeIndex.set(index)" (click)="choose(option,index)">
<span class="k-select-option-content">
<span>{{option.label}}</span>@if(option.description){<span class="k-select-description">{{option.description}}</span>}</span>@if(option.value===renderedValue()){<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M20 6 9 17l-5-5"/>
</svg>}</li>}</ul>}@if(error()){<p #alert role="alert">{{error()}}</p>}</div>
`
})
export class KitSpringSelectComponent {
readonly options=input.required<SpringSelectOption[]>();readonly value=input<string|undefined>();readonly defaultValue=input<string|undefined>();readonly placeholder=input<string,string|undefined>('Select…',{transform:value=>value===undefined?'Select…':value});readonly onChange=input<((value:string)=>void)|undefined>();readonly label=input<string|undefined>();readonly disabled=input<boolean,boolean|undefined>(false,{transform:value=>value===undefined?false:value});readonly error=input<string|undefined>();readonly className=input<string,string|undefined>('',{transform:value=>value===undefined?'':value});readonly open=signal(false);readonly internalValue=signal<string|undefined>(undefined);readonly activeIndex=signal(-1);readonly controlled=computed(()=>this.value()!==undefined);readonly current=computed(()=>this.controlled()?this.value():this.internalValue());readonly currentOption=computed(()=>this.options().find(option=>option.value===this.current()));readonly rootId='kit-spring-select-'+(++springSelectSequence);readonly root=viewChild.required<ElementRef<HTMLElement>>('root');readonly trigger=viewChild.required<ElementRef<HTMLButtonElement>>('trigger');readonly present=signal(false);readonly panel=viewChild<ElementRef<HTMLElement>>('panel');readonly chevron=viewChild<ElementRef<HTMLElement>>('chevron');readonly alert=viewChild<ElementRef<HTMLElement>>('alert');private snapshot:{options:SpringSelectOption[];value:string|undefined;index:number}|undefined;
renderedOptions():SpringSelectOption[]{return this.open()?this.options():this.snapshot?.options??this.options()}
renderedValue():string|undefined{return this.open()?this.current():this.snapshot?.value}
renderedIndex():number{return this.open()?this.activeIndex():this.snapshot?.index??-1}
private panelMotion:SpringSelectMotion|undefined;
constructor(){effect(cleanup=>{const node=this.panel()?.nativeElement;if(!node)return;const motion=new SpringSelectMotion(node,[0,-6,.98],([opacity,y,scale])=>{node.style.opacity=String(opacity);node.style.transform='translateY('+y+'px) scale('+scale+')'});this.panelMotion=motion;untracked(()=>motion.to(this.open()?[1,0,1]:[0,-4,.98],this.open()?undefined:()=>this.present.set(false)));cleanup(()=>{motion.destroy();if(this.panelMotion===motion)this.panelMotion=undefined})});effect(()=>{const open=this.open();untracked(()=>this.panelMotion?.to(open?[1,0,1]:[0,-4,.98],open?undefined:()=>this.present.set(false)))});effect(cleanup=>{const node=this.chevron()?.nativeElement;if(!node)return;const motion=new SpringSelectMotion(node,[0],([rotate])=>node.style.transform='rotate('+rotate+'deg)');this.chevronMotion=motion;cleanup(()=>{motion.destroy();this.chevronMotion=undefined})});effect(()=>{const open=this.open();untracked(()=>this.chevronMotion?.to([open?192:0]))});effect(cleanup=>{const node=this.alert()?.nativeElement;if(!node)return;const motion=new SpringSelectMotion(node,[0,-2],([opacity,y])=>{node.style.opacity=String(opacity);node.style.transform='translateY('+y+'px)'});motion.to([1,0]);cleanup(()=>motion.destroy())});}
private chevronMotion:SpringSelectMotion|undefined;
private removeDismiss:(()=>void)|undefined;
ngOnInit():void{this.internalValue.set(this.defaultValue())}
setOpen(value:boolean):void{if(this.open()===value)return;if(!value)this.snapshot={options:this.options().map(option=>({...option})),value:this.current(),index:this.activeIndex()};this.open.set(value);if(value)this.present.set(true);this.removeDismiss?.();this.removeDismiss=undefined;if(value&&typeof document!=='undefined'){const outside=(event:MouseEvent)=>{if(!this.root().nativeElement.contains(event.target as Node))this.setOpen(false)},escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){this.setOpen(false);this.trigger().nativeElement.focus()}};document.addEventListener('mousedown',outside);document.addEventListener('keydown',escape);this.removeDismiss=()=>{document.removeEventListener('mousedown',outside);document.removeEventListener('keydown',escape)}}}
toggle():void{if(!this.disabled())this.setOpen(!this.open())}
choose(option:SpringSelectOption,index:number):void{if(option.disabled)return;const previous={options:this.options().map(item=>({...item})),value:this.current(),index:this.activeIndex()};if(!this.controlled())this.internalValue.set(option.value);this.onChange()?.(option.value);this.setOpen(false);this.snapshot=previous;this.activeIndex.set(index);this.trigger().nativeElement.focus()}
triggerKey(event:KeyboardEvent):void{if(this.disabled())return;if(event.key==='ArrowDown'||event.key==='Enter'||event.key===' '){event.preventDefault();this.setOpen(true);if(this.activeIndex()<0)this.activeIndex.set(this.options().findIndex(option=>option.value===this.current()))}}
listKey(event:KeyboardEvent):void{if(event.key==='ArrowDown'){event.preventDefault();this.activeIndex.set(Math.min(this.options().length-1,this.activeIndex()+1))}else if(event.key==='ArrowUp'){event.preventDefault();this.activeIndex.set(Math.max(0,this.activeIndex()-1))}else if(event.key==='Enter'&&this.activeIndex()>=0){event.preventDefault();this.choose(this.options()[this.activeIndex()],this.activeIndex())}}
ngOnDestroy():void{this.removeDismiss?.()}
}

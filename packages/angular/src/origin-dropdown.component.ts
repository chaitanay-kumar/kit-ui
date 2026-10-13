// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, ElementRef, computed, inject, input, signal } from '@angular/core';
import {DOCUMENT,NgTemplateOutlet} from '@angular/common';
import {TemplateRef,ViewEncapsulation} from '@angular/core';
export type DropdownSide='top'|'right'|'bottom'|'left';
export type OriginDropdownContent=string|number|boolean|null|undefined|TemplateRef<unknown>;
export interface OriginDropdownItem{id:string;label:string;description?:string;icon?:OriginDropdownContent;destructive?:boolean;disabled?:boolean;onSelect?:()=>void;}
@Component({
 selector:"kit-origin-dropdown", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./origin-dropdown.css"],
template:`
<div #root [class]="'k-origin-root '+className()">
<button type="button" aria-haspopup="menu" [attr.aria-expanded]="isOpen()" (click)="setOpen(!isOpen())">@if(template(trigger());as content){<ng-container [ngTemplateOutlet]="content"/>}@else if(trigger()!==null&&trigger()!==undefined){ {{text(trigger())}} }@else{<span>{{placeholder()}}</span>}<span class="k-origin-chevron" [class.k-origin-chevron-open]="isOpen()" aria-hidden="true">⌄</span>
</button>@if(isOpen()){<div role="menu" [class]="'k-origin-menu k-origin-'+side()">@if(template(children());as content){<ng-container [ngTemplateOutlet]="content"/>}@else if(children()!==null&&children()!==undefined){ {{text(children())}} }@else{<ul>@for(item of items();track item.id){<li>
<button type="button" role="menuitem" [disabled]="item.disabled" [class.k-origin-destructive]="item.destructive" (click)="select(item)">@if(template(item.icon);as icon){<ng-container [ngTemplateOutlet]="icon"/>}@else if(text(item.icon)){<span>{{text(item.icon)}}</span>}<span>
<strong>{{item.label}}</strong>@if(item.description){<small>{{item.description}}</small>}</span>
</button>
</li>}</ul>}</div>}</div>
`
})
export class KitOriginDropdownComponent {
readonly trigger=input<OriginDropdownContent>();readonly items=input<OriginDropdownItem[]>();readonly children=input<OriginDropdownContent>();readonly side=input<DropdownSide,DropdownSide|undefined>('bottom',{transform:value=>value??'bottom'});readonly open=input<boolean>();readonly defaultOpen=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly onOpenChange=input<(open:boolean)=>void>();readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly placeholder=input<string,string|undefined>('Open menu',{transform:value=>value??'Open menu'});readonly internal=signal<boolean|undefined>(undefined);readonly isOpen=computed(()=>this.open()??this.internal()??this.defaultOpen());private readonly host=inject(ElementRef<HTMLElement>);private readonly document=inject(DOCUMENT);private readonly down=(event:MouseEvent)=>{if(this.isOpen()&&!this.host.nativeElement.contains(event.target as Node))this.setOpen(false);};private readonly keydown=(event:KeyboardEvent)=>{if(event.key==='Escape'&&this.isOpen())this.setOpen(false);};constructor(){this.document.addEventListener('mousedown',this.down);this.document.addEventListener('keydown',this.keydown);inject(DestroyRef).onDestroy(()=>{this.document.removeEventListener('mousedown',this.down);this.document.removeEventListener('keydown',this.keydown);});}setOpen(next:boolean):void{if(this.open()===undefined)this.internal.set(next);this.onOpenChange()?.(next);}select(item:OriginDropdownItem):void{if(item.disabled)return;item.onSelect?.();this.setOpen(false);}template(value:OriginDropdownContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}text(value:OriginDropdownContent):string|number{return typeof value==='string'||typeof value==='number'?value:'';}
}

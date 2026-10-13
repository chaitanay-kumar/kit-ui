// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, effect, input, signal, untracked } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {UnfoldAccordionRowComponent} from './unfold-accordion-row';
import type {UnfoldAccordionItem} from './unfold-accordion-types';
@Component({
 selector:"kit-unfold-accordion", standalone:true,
 host:{'data-kit':'unfold-accordion',class:'k-uf-host'},
 imports:[UnfoldAccordionRowComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./unfold-accordion.css"],
template:`
<div [class]="'k-uf-root '+className()">@for(item of items();track item.id){<kit-unfold-accordion-row [item]="item" [open]="openIds().includes(item.id)" (toggleRequested)="toggle(item.id)"/>}</div>
`
})
export class KitUnfoldAccordionComponent {
readonly items=input.required<UnfoldAccordionItem[]>();readonly allowMultiple=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly defaultOpen=input<string[],string[]|undefined>([],{transform:v=>v===undefined?[]:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly openIds=signal<string[]>([]);private initialized=false;constructor(){effect(()=>{this.items();untracked(()=>{if(!this.initialized){this.initialized=true;this.openIds.set(this.defaultOpen());}});});}toggle(id:string):void{this.openIds.update(ids=>this.allowMultiple()?(ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]):ids.includes(id)?[]:[id]);}
}

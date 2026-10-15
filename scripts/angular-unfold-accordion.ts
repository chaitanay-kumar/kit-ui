export const unfoldAccordionPort={
 imports:`import {ViewEncapsulation} from '@angular/core';
import {UnfoldAccordionRowComponent} from './unfold-accordion-row';
import type {UnfoldAccordionItem} from './unfold-accordion-types';`,componentImports:'UnfoldAccordionRowComponent',stylesFile:'./unfold-accordion.css',
 hostMetadata:`{'data-kit':'unfold-accordion',class:'k-uf-host'}`,
 description:'React-matched native accordion with initial defaultOpen, single/multiple disclosure, typed template content and coordinated height, opacity, spacing and chevron motion.',
 inputs:['items: UnfoldAccordionItem[] (required)','allowMultiple: boolean','defaultOpen: string[]','className: string'],outputs:[],
 template:`<div [class]="'k-uf-root '+className()">@for(item of items();track item.id){<kit-unfold-accordion-row [item]="item" [open]="openIds().includes(item.id)" (toggleRequested)="toggle(item.id)"/>}</div>`,
 body:`readonly items=input.required<UnfoldAccordionItem[]>();readonly allowMultiple=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly defaultOpen=input<string[],string[]|undefined>([],{transform:v=>v===undefined?[]:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly openIds=signal<string[]>([]);private initialized=false;constructor(){effect(()=>{this.items();untracked(()=>{if(!this.initialized){this.initialized=true;this.openIds.set(this.defaultOpen());}});});}toggle(id:string):void{this.openIds.update(ids=>this.allowMultiple()?(ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]):ids.includes(id)?[]:[id]);}`
};

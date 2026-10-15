// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import {NgZone} from '@angular/core';import type {StackCard} from './stack-unfold-types';export type {StackCard} from './stack-unfold-types';import {StackUnfoldRowComponent} from './stack-unfold-row';import {StackUnfoldLayout} from './stack-unfold-motion';
@Component({
 selector:"kit-stack-unfold-panel", standalone:true,
 host:{'style':'display:contents'},
 imports:[StackUnfoldRowComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./stack-unfold-panel.css"],
template:`
<div #root [class]="'k-stack-unfold '+className()">@for(card of cards();track card.id;let index=$index){<kit-stack-unfold-row [card]="card" [index]="index" [expanded]="activeIds().includes(card.id)" [variant]="variant()" (toggleRequested)="toggle(card.id)"/>}</div>
`
})
export class KitStackUnfoldPanelComponent {
readonly cards=input.required<StackCard[]>();readonly expandedIds=input<string[]>();readonly onExpandedChange=input<((ids:string[])=>void)|undefined>();readonly allowMultiple=input<boolean,boolean|undefined>(false,{transform:v=>v??false});readonly variant=input<'default'|'minimal','default'|'minimal'|undefined>('default',{transform:v=>v??'default'});readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly root=viewChild<ElementRef<HTMLElement>>('root');private internal=signal<string[]>([]);readonly activeIds=computed(()=>this.expandedIds()!==undefined?this.expandedIds()!:this.internal());private layout:StackUnfoldLayout|undefined;private zone=inject(NgZone);ngOnInit():void{this.internal.set([this.cards()[0]?.id||''])}ngOnChanges():void{this.layout?.capture()}toggle(id:string):void{const current=this.activeIds(),next=current.includes(id)?current.filter(value=>value!==id):this.allowMultiple()?[...current,id]:[id];this.layout?.capture();const change=this.onExpandedChange();if(change)change(next);else this.internal.set(next)}ngAfterViewChecked():void{this.zone.runOutsideAngular(()=>{const node=this.root()?.nativeElement;if(!node)return;if(!this.layout)this.layout=new StackUnfoldLayout(node);this.layout.rendered()})}ngOnDestroy():void{this.layout?.destroy();this.layout=undefined}
}

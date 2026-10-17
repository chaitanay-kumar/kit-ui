// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, effect, inject, input, signal, viewChild } from '@angular/core';
import {afterEveryRender,ErrorHandler,TemplateRef} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import type {BatchAction,BatchItem,BatchTraySnapshot} from './batch-gesture-tray-types';import {Batch39IconComponent} from './batch39-icons';import {BatchHoverDirective} from './batch39-motion';import {BatchCheckComponent,BatchTrayPresence} from './batch-tray-presence';export type {BatchAction,BatchItem} from './batch-gesture-tray-types';
@Component({
 selector:"kit-batch-gesture-tray", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet,Batch39IconComponent,BatchHoverDirective,BatchCheckComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./batch-gesture-tray.css"],
template:`
<ng-template #icon let-value>@if(asTemplate(value);as template){<ng-container [ngTemplateOutlet]="template"/>}@else{<ng-container>{{value}}</ng-container>}</ng-template>
<div [class]="'k-batch-tray-root '+className()" [class.k-batch-pending]="!!loadingActionId()">
<div class="k-batch-list" role="group" aria-label="Selectable items list">@for(item of items();track item.id){<div role="checkbox" [attr.aria-checked]="selected().includes(item.id)" tabindex="0" class="k-batch-item" [class.selected]="selected().includes(item.id)" kitBatchHover="item" (click)="toggle(item.id)" (keydown)="itemKey($event,item.id)">
<div class="k-batch-item-inner">
<div class="k-batch-checkbox" [class.selected]="selected().includes(item.id)">
<kit-batch-check [checked]="selected().includes(item.id)"/>
</div>
<div class="k-batch-item-content">@if(item.icon){<span class="k-batch-item-icon">
<ng-container [ngTemplateOutlet]="icon" [ngTemplateOutletContext]="{$implicit:item.icon}"/>
</span>}<div>
<h4>{{item.title}}</h4>@if(item.subtitle){<p>{{item.subtitle}}</p>}</div>
</div>
</div>
</div>}</div>@if(trayPresent()) {<div #tray role="toolbar" aria-label="Batch actions toolbar" aria-live="polite" class="k-batch-tray">
<div class="k-batch-counter">
<span class="k-batch-count">{{snapshot.ids.length}}</span>
<span class="k-batch-selected-label">selected</span>
<div class="k-batch-counter-divider">
</div>
<button type="button" (click)="selectAll()">{{snapshot.items.length>0&&snapshot.ids.length===snapshot.items.length?'Deselect all':'Select all'}}</button>
</div>
<div class="k-batch-actions">@for(action of snapshot.actions;track action.id){<button type="button" [disabled]="!!snapshot.loading" kitBatchHover="action" class="k-batch-action" [class.danger]="action.color==='danger'" (click)="execute(action)">@if(snapshot.loading===action.id){<svg kitBatch39Icon icon="loader" class="k-batch-spinner"/>}@else if(action.icon){<span>
<ng-container [ngTemplateOutlet]="icon" [ngTemplateOutletContext]="{$implicit:action.icon}"/>
</span>}<span>{{action.label}}</span>
</button>}<div class="k-batch-actions-divider">
</div>
<button type="button" class="k-batch-dismiss" aria-label="Dismiss selection (Esc)" title="Dismiss selection (Esc)" (click)="clear(snapshot.selection)">
<svg kitBatch39Icon icon="x"/>
</button>
</div>
</div>}</div>
`
})
export class KitBatchGestureTrayComponent {
readonly items=input.required<BatchItem[]>();readonly actions=input.required<BatchAction[]>();readonly selectedIds=input<string[]|undefined>();readonly onSelectionChange=input<((ids:string[])=>void)|undefined>();readonly onActionComplete=input<((id:string)=>void)|undefined>();readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly internal=signal<string[]>([]);readonly loadingActionId=signal<string|null>(null);readonly trayPresent=signal(false);readonly tray=viewChild<ElementRef<HTMLElement>>('tray');snapshot:BatchTraySnapshot={ids:[],items:[],actions:[],loading:null,selection:undefined,complete:undefined};private readonly errors=inject(ErrorHandler);private destroyed=false;private presence=new BatchTrayPresence(()=>this.trayPresent.set(false),()=>this.selected().length>0);private escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&this.selected().length)this.clear(this.onSelectionChange())};selected():string[]{return this.selectedIds()!==undefined?this.selectedIds()!:this.internal()}ngOnInit():void{if(typeof window!=='undefined')window.addEventListener('keydown',this.escape)}private assign(ids:string[],callback:((ids:string[])=>void)|undefined):void{if(callback)callback(ids);else this.internal.set(ids)}private observedAssign(ids:string[],callback:((ids:string[])=>void)|undefined):void{try{this.assign(ids,callback)}catch(error){queueMicrotask(()=>this.errors.handleError(error))}}toggle(id:string):void{const ids=this.selected();this.observedAssign(ids.includes(id)?ids.filter(value=>value!==id):[...ids,id],this.onSelectionChange())}clear(callback:((ids:string[])=>void)|undefined):void{this.observedAssign([],callback)}selectAll():void{const snapshot=this.snapshot;this.observedAssign(snapshot.ids.length===snapshot.items.length?[]:snapshot.items.map(item=>item.id),snapshot.selection)}itemKey(event:KeyboardEvent,id:string):void{if(event.key==='Enter'||event.key===' '){event.preventDefault();this.toggle(id)}}async execute(action:BatchAction):Promise<void>{const snapshot=this.snapshot;if(!snapshot.ids.length||snapshot.loading)return;this.loadingActionId.set(action.id);try{await action.action(snapshot.ids);if(this.destroyed)return;snapshot.complete?.(action.id);this.assign([],snapshot.selection)}catch{}finally{if(!this.destroyed)this.loadingActionId.set(null)}}asTemplate(value:unknown):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null}constructor(){effect(()=>{const ids=this.selected();if(ids.length){this.snapshot={ids,items:this.items(),actions:this.actions(),loading:this.loadingActionId(),selection:this.onSelectionChange(),complete:this.onActionComplete()};this.trayPresent.set(true)}});afterEveryRender(()=>this.presence.rendered(this.tray()?.nativeElement,this.selected().length>0));inject(DestroyRef).onDestroy(()=>{this.destroyed=true;this.presence.destroy();if(typeof window!=='undefined')window.removeEventListener('keydown',this.escape)})}
}

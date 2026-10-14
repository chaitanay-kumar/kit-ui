// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import {NgZone,TemplateRef} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {SelectionBasketMotion} from './selection-basket-motion';export interface SelectionActionItem{id:string;label:string;icon?:TemplateRef<unknown>|string|number|boolean|null;variant?:'default'|'danger'|'primary';onClick?:()=>void;defaultIcon?:'download'|'folder'|'share'|'trash'}interface SelectionBasketData{selectedCount:number;totalCount:number|undefined;mode:'fixed'|'contained'|'inline';actions:SelectionActionItem[];onClearSelection:(()=>void)|undefined;onSelectAll:(()=>void)|undefined;className:string}const defaultSelectionActions:SelectionActionItem[]=[{id:'export',label:'Export',defaultIcon:'download'},{id:'move',label:'Move to Folder',defaultIcon:'folder'},{id:'share',label:'Share',defaultIcon:'share'},{id:'delete',label:'Delete',defaultIcon:'trash',variant:'danger'}];
@Component({
 selector:"kit-selection-basket", standalone:true,
 host:{'style':'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./selection-basket.css"],
template:`
@if(present()){<div [class]="'k-selection-wrapper mode-'+data().mode">
<div #panel [class]="'k-selection-toolbar '+data().className" role="toolbar" aria-label="Bulk actions toolbar">
<div class="k-selection-count">
<span class="k-selection-number">{{data().selectedCount}}</span>
<span class="k-selection-caption">{{data().selectedCount===1?'item selected':'items selected'}}</span>@if(data().onSelectAll&&data().totalCount){<button type="button" class="k-selection-all" (click)="selectAll()">{{allSelected()?'Select none':'All ('+data().totalCount+')'}}</button>}@else if(data().onSelectAll&&data().totalCount===0){<ng-container>0</ng-container>}</div>
<div class="k-selection-actions">@for(action of data().actions;track action.id){<button type="button" [class]="'k-selection-action '+(action.variant??'default')" (click)="act(action)">@if(iconTemplate(action.icon);as icon){<ng-container [ngTemplateOutlet]="icon"/>}@else if(action.defaultIcon){<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">@switch(action.defaultIcon){@case('download'){<path d="M12 15V3"/>
<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
<path d="m7 10 5 5 5-5"/>}@case('folder'){<path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/>
<path d="M2 13h10"/>
<path d="m9 16 3-3-3-3"/>}@case('share'){<circle cx="18" cy="5" r="3"/>
<circle cx="6" cy="12" r="3"/>
<circle cx="18" cy="19" r="3"/>
<path d="m8.59 13.51 6.83 3.98m-.01-10.98-6.82 3.98"/>}@case('trash'){<path d="M10 11v6M14 11v6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>}}</svg>}@else{<ng-container>{{iconText(action.icon)}}</ng-container>}<span>{{action.label}}</span>
</button>}</div>@if(data().onClearSelection){<button type="button" class="k-selection-clear" title="Clear selection" aria-label="Clear selection" (click)="clear()">
<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
<path d="m18 6-12 12M6 6l12 12"/>
</svg>
</button>}</div>
</div>}
`
})
export class KitSelectionBasketComponent {
readonly selectedCount=input.required<number>();readonly totalCount=input<number>();readonly mode=input<'fixed'|'contained'|'inline','fixed'|'contained'|'inline'|undefined>('fixed',{transform:v=>v??'fixed'});readonly actions=input<SelectionActionItem[],SelectionActionItem[]|undefined>(defaultSelectionActions,{transform:v=>v??defaultSelectionActions});readonly onClearSelection=input<(()=>void)|undefined>();readonly onSelectAll=input<(()=>void)|undefined>();readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly panel=viewChild<ElementRef<HTMLElement>>('panel');readonly present=signal(false);private snapshot=signal<SelectionBasketData|undefined>(undefined);readonly live=computed<SelectionBasketData>(()=>({selectedCount:this.selectedCount(),totalCount:this.totalCount(),mode:this.mode(),actions:this.actions(),onClearSelection:this.onClearSelection(),onSelectAll:this.onSelectAll(),className:this.className()}));readonly data=computed(()=>this.selectedCount()>0?this.live():this.snapshot()!);readonly allSelected=computed(()=>{const d=this.data();return d.totalCount!==undefined&&d.selectedCount===d.totalCount&&d.totalCount>0});private motion:SelectionBasketMotion|undefined;private zone=inject(NgZone);ngOnChanges():void{if(this.selectedCount()>0){this.snapshot.set(this.live());this.present.set(true);}}ngAfterViewChecked():void{const node=this.panel()?.nativeElement;if(!node){this.motion?.destroy();this.motion=undefined;return}this.zone.runOutsideAngular(()=>{if(this.motion?.node!==node){this.motion?.destroy();this.motion=new SelectionBasketMotion(node,()=>{if(!(this.selectedCount()>0)){this.present.set(false);this.snapshot.set(undefined)}})}this.motion.update(this.selectedCount()>0)})}iconTemplate(value:SelectionActionItem['icon']):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null}iconText(value:SelectionActionItem['icon']):string|number|null|undefined{return typeof value==='boolean'||value instanceof TemplateRef?'':value}act(action:SelectionActionItem):void{action.onClick?.()}selectAll():void{this.data().onSelectAll?.()}clear():void{this.data().onClearSelection?.()}ngOnDestroy():void{this.motion?.destroy();this.motion=undefined;this.snapshot.set(undefined)}
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, inject, input, signal } from '@angular/core';
import {afterRenderEffect,ErrorHandler} from '@angular/core';import {DEFAULT_DATA_ROWS,type DataRowItem} from './expandable-data-row-types';import {DataDetailsIconComponent} from './data-details-icon';import {DataDetailsPresenceDirective} from './data-details-presence';import {DataDetailsRotationDirective} from './data-details-rotation';import {DataDetailsCopyFeedback} from './data-details-copy';export type {DataRowItem} from './expandable-data-row-types';
@Component({
 selector:"kit-expandable-data-row", standalone:true,
 host:{style:'display:contents'},
 imports:[DataDetailsIconComponent,DataDetailsPresenceDirective,DataDetailsRotationDirective],
encapsulation:ViewEncapsulation.None,styleUrls:["./expandable-data-row.css"],
template:`
@if(isLoading()){<div [class]="'k-data-loading '+className()">@for(n of [1,2,3];track n){<div>
</div>}</div>}@else{<div [class]="'k-data-rows '+className()">
<div class="k-data-heading k-data-desktop">
<div>User &amp; Account</div>
<div>Status</div>
<div>Revenue</div>
<div>Date Added</div>
<div>Details</div>
</div>
<div class="k-data-list">@for(item of items();track item.id){<div class="k-data-row" kitDataDetailsPresence [open]="expandedIds().includes(item.id)" #presence="detailsPresence">
<button type="button" class="k-data-trigger" [attr.aria-expanded]="expandedIds().includes(item.id)" (click)="toggleRow(item.id)">
<div class="k-data-desktop k-data-columns">
<div class="k-data-user">
<span kitDataDetailsRotation [angle]="expandedIds().includes(item.id)?90:0" class="k-data-chevron">
<svg kitDataDetailsIcon/>
</span>
<span class="k-data-avatar">{{item.user.name.slice(0,2).toUpperCase()}}</span>
<div class="k-data-identity">
<p>{{item.user.name}}</p>
<p>{{item.user.email}}</p>
</div>
</div>
<div>
<span [class]="'k-data-status '+item.status">
<i>
</i>{{statusLabel(item.status)}}</span>
</div>
<div class="k-data-revenue">{{item.revenue}}</div>
<div class="k-data-date">{{item.date}}</div>
<div class="k-data-view">{{expandedIds().includes(item.id)?'Hide':'View'}}</div>
</div>
<div class="k-data-mobile">
<div class="k-data-user">
<span class="k-data-avatar">{{item.user.name.slice(0,2).toUpperCase()}}</span>
<div class="k-data-identity">
<div class="k-data-mobile-name">
<p>{{item.user.name}}</p>
<span [class]="'k-data-status '+item.status">
<i>
</i>{{statusLabel(item.status)}}</span>
</div>
<div class="k-data-mobile-meta">
<span>{{item.revenue}}</span>
<span>&#183;</span>
<span>{{item.user.email}}</span>
</div>
</div>
</div>
<span kitDataDetailsRotation [angle]="expandedIds().includes(item.id)?90:0" class="k-data-chevron">
<svg kitDataDetailsIcon/>
</span>
</div>
</button>@if(presence.present()){<div class="k-sa-panel k-data-panel">
<div class="k-data-detail-inner">
<div class="k-data-detail-grid">
<div class="k-data-metadata">
<span class="k-data-section-title">Account Metadata</span>
<div class="k-data-fields">
<div>
<span>Plan Tier</span>
<span>{{item.metadata?.plan||'Standard'}}</span>
</div>
<div>
<span>Location</span>
<span>{{item.metadata?.location||'Unknown'}}</span>
</div>
<div>
<span>Payment Method</span>
<span>{{item.metadata?.billingMethod||'Card'}}</span>
</div>
<div>
<span>Last Active</span>
<span>{{item.metadata?.lastActive||'Recently'}}</span>
</div>
</div>
</div>
<div class="k-data-activity">
<span class="k-data-section-title">Recent Activity</span>
<div>@for(activity of item.recentActivity;track $index){<div class="k-data-activity-entry">
<i>
</i>
<div>
<p>{{activity.action}}</p>
<span>{{activity.timestamp}}</span>
</div>
</div>}</div>
</div>
<div class="k-data-actions">
<div>
<span class="k-data-section-title">Actions</span>
<div class="k-data-action-buttons">
<button type="button" (click)="copyEmail($event,item)">
<span>Copy Email</span>
<svg kitDataDetailsIcon [icon]="copiedId()===item.id?'check':'copy'" [class.k-data-copied]="copiedId()===item.id"/>
</button>
<button type="button" (click)="action('manage-billing',item)">
<span>Manage Billing</span>
<svg kitDataDetailsIcon icon="creditCard"/>
</button>
<button type="button" (click)="action('view-profile',item)">
<span>User Profile</span>
<svg kitDataDetailsIcon icon="arrowUpRight"/>
</button>
</div>
</div>
<div class="k-data-ref">Ref: {{item.id}}</div>
</div>
</div>
</div>
</div>}</div>}</div>
</div>}
`
})
export class KitExpandableDataRowComponent {
readonly items=input<DataRowItem[],DataRowItem[]|undefined>(DEFAULT_DATA_ROWS,{transform:v=>v===undefined?DEFAULT_DATA_ROWS:v});readonly allowMultiple=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly defaultExpandedIds=input<string[],string[]|undefined>(['usr_01'],{transform:v=>v===undefined?['usr_01']:v});readonly isLoading=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly onRowAction=input<((action:string,row:DataRowItem)=>void)|undefined>();readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly expandedIds=signal<string[]>([]);readonly copiedId=signal<string|null>(null);private readonly errors=inject(ErrorHandler);private copy:DataDetailsCopyFeedback|undefined;ngOnInit():void{this.expandedIds.set(this.defaultExpandedIds())}toggleRow(id:string):void{this.expandedIds.update(ids=>this.allowMultiple()?(ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]):ids.includes(id)?[]:[id])}statusLabel(status:DataRowItem['status']):string{return {active:'Active',pending:'Pending',paused:'Paused',churned:'Churned'}[status]??''}copyEmail(event:MouseEvent,item:DataRowItem):void{this.copy?.copy(event,item.user.email,item.id)}action(action:string,item:DataRowItem):void{try{this.onRowAction()?.(action,item)}catch(error){queueMicrotask(()=>this.errors.handleError(error))}}constructor(){afterRenderEffect(()=>{if(!this.copy&&typeof window!=='undefined')this.copy=new DataDetailsCopyFeedback(window,value=>this.copiedId.set(value))});inject(DestroyRef).onDestroy(()=>this.copy?.destroy())}
}

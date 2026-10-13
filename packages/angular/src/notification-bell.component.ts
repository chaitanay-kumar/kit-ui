// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, ElementRef, computed, inject, input, signal } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {afterRenderEffect,ViewEncapsulation} from '@angular/core';
export interface Notification{id:string;message:string;timestamp:Date|string;read:boolean;action?:()=>void;}
@Component({
 selector:"kit-notification-bell", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./notification-bell.css"],
template:`
<div #root [class]="'k-bell-root '+className()">
<button type="button" class="k-bell-trigger" [class.k-bell-shake]="shaking()" [attr.aria-label]="triggerLabel()" [attr.aria-expanded]="isPanelOpen()" (click)="setPanelOpen(!isPanelOpen())">
<span aria-hidden="true">♧</span>@if(unreadCount()>0){<span class="k-bell-badge" [class.k-bell-dot]="!showCount()">{{showCount()?(unreadCount()>99?'99+':unreadCount()):''}}</span>}</button>@if(isPanelOpen()){<section class="k-bell-panel" aria-label="Notifications">
<header>
<div>
<h3>Notifications</h3>@if(unreadCount()>0){<span>{{unreadCount()}} new</span>}</div>
<div>@if(unreadCount()>0&&onMarkAllAsRead()){<button type="button" (click)="onMarkAllAsRead()?.()">Read all</button>}<button type="button" aria-label="Close notifications" (click)="setPanelOpen(false)">×</button>
</div>
</header>
<div class="k-bell-list">@for(notification of notifications();track notification.id){<article [class.k-bell-unread]="!notification.read">
<div>
<p>{{notification.message}}</p>
<time>{{formatTimestamp(notification.timestamp)}}</time>
</div>@if(!notification.read){<button type="button" aria-label="Mark notification as read" (click)="onMarkAsRead()(notification.id)">✓</button>}</article>}@empty{<p class="k-bell-empty">No notifications right now</p>}</div>
</section>}</div>
`
})
export class KitNotificationBellComponent {
readonly notifications=input.required<Notification[]>();readonly onMarkAsRead=input.required<(id:string)=>void>();readonly onMarkAllAsRead=input<(()=>void)|undefined>();readonly isOpen=input<boolean>();readonly onOpenChange=input<((open:boolean)=>void)|undefined>();readonly showCount=input<boolean,boolean|undefined>(true,{transform:v=>v??true});readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly internalIsOpen=signal(false);readonly shaking=signal(false);readonly unreadCount=computed(()=>this.notifications().filter(item=>!item.read).length);readonly isPanelOpen=computed(()=>this.isOpen()!==undefined?this.isOpen()!:this.internalIsOpen());readonly triggerLabel=computed(()=>this.unreadCount()?this.unreadCount()+' unread notifications':'Notifications');private previousUnread=0;private shakeTimer:ReturnType<typeof setTimeout>|undefined;private readonly host=inject(ElementRef<HTMLElement>);private readonly document=inject(DOCUMENT);private readonly outside=(event:MouseEvent)=>{if(this.isPanelOpen()&&!this.host.nativeElement.contains(event.target as Node))this.setPanelOpen(false);};constructor(){afterRenderEffect(()=>{const count=this.unreadCount();if(count>this.previousUnread){this.shaking.set(true);if(this.shakeTimer)clearTimeout(this.shakeTimer);this.shakeTimer=setTimeout(()=>this.shaking.set(false),600);}this.previousUnread=count;});this.document.addEventListener('mousedown',this.outside);inject(DestroyRef).onDestroy(()=>{this.document.removeEventListener('mousedown',this.outside);if(this.shakeTimer)clearTimeout(this.shakeTimer);});}setPanelOpen(open:boolean):void{if(this.onOpenChange())this.onOpenChange()!(open);else this.internalIsOpen.set(open);}formatTimestamp(value:Date|string):string{return value instanceof Date?value.toLocaleDateString():value;}
}

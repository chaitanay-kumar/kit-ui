// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, inject, input, viewChild } from '@angular/core';
import {NgZone,TemplateRef} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {FloatingActionDockMotion} from './floating-action-dock-motion';export interface DockItem{id:string;label:string;icon:TemplateRef<unknown>|string|number|null;onClick?:()=>void;badge?:boolean}
@Component({
 selector:"kit-floating-action-dock", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./floating-action-dock.css"],
template:`
<div #root [class]="'k-floating-action-dock '+className()">@for(item of items();track item.id){<button class="k-fad-button" [class.active]="activeId()===item.id" [attr.aria-label]="item.label" (click)="click(item)">
<div class="k-fad-tooltip">{{item.label}}</div>
<span class="k-fad-icon">@if(iconTemplate(item.icon);as icon){<ng-container [ngTemplateOutlet]="icon"/>}@else{<ng-container>{{item.icon}}</ng-container>}</span>@if(activeId()===item.id){<span class="k-fad-active">
</span>}</button>}</div>
`
})
export class KitFloatingActionDockComponent {
readonly items=input.required<DockItem[]>();readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly activeId=input<string|undefined>();readonly root=viewChild.required<ElementRef<HTMLElement>>('root');private motion:FloatingActionDockMotion|undefined;private zone=inject(NgZone);iconTemplate(icon:DockItem['icon']):TemplateRef<unknown>|null{return icon instanceof TemplateRef?icon:null;}click(item:DockItem):void{item.onClick?.();}ngAfterViewInit():void{this.zone.runOutsideAngular(()=>{this.motion=new FloatingActionDockMotion(this.root().nativeElement);});}ngAfterViewChecked():void{this.motion?.prune();}ngOnDestroy():void{this.motion?.destroy();}
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import {NgZone,TemplateRef,type SimpleChanges} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {AnimatedTabsContentMotion,AnimatedTabsIndicatorMotion} from './animated-tabs-motion';export type AnimatedTabContent=TemplateRef<unknown>|string|number|boolean|null|undefined;export interface AnimatedTabItem{id:string;label:string;icon?:AnimatedTabContent;content?:AnimatedTabContent;badge?:string|number}let tabsSequence=0;
@Component({
 selector:"kit-animated-tabs", standalone:true,
 host:{'style':'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./animated-tabs.css"],
template:`
<ng-template #content let-value>@if(contentTemplate(value);as tpl){<ng-container [ngTemplateOutlet]="tpl"/>}@else{<ng-container>{{contentText(value)}}</ng-container>}</ng-template>
<div #root [class]="'k-animated-tabs '+className()" [class.k-tabs-glass]="variant()==='glass'||variant()==='pill'">
<div [class]="'k-tabs-bar '+tabsContainerClassName()">@for(tab of tabs();track tab.id){<button [class.k-tab-active]="activeId()===tab.id" (click)="choose(tab.id)">@if(activeId()===tab.id){<div class="k-tabs-indicator" [attr.data-layout-id]="indicatorId()">
</div>}<span class="k-tabs-label">@if(tab.icon){<span>
<ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{$implicit:tab.icon}"/>
</span>}@else if(tab.icon===0){<ng-container>0</ng-container>}{{tab.label}}@if(tab.badge){<span class="k-tabs-badge">{{tab.badge}}</span>}@else if(tab.badge===0){<ng-container>0</ng-container>}</span>
</button>}</div>@if(renderContent()){<div class="k-tabs-content">@for(tab of displayed()?[displayed()!]:[];track tab.id){<div class="k-tabs-panel">
<ng-container [ngTemplateOutlet]="content" [ngTemplateOutletContext]="{$implicit:tab.content}"/>
</div>}</div>}</div>
`
})
export class KitAnimatedTabsComponent {
readonly tabs=input.required<AnimatedTabItem[]>();
readonly defaultTab=input<string>();readonly activeTab=input<string>();readonly onChange=input<((id:string)=>void)|undefined>();
readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});
readonly tabsContainerClassName=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});
readonly renderContent=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});
readonly layoutId=input<string>();readonly variant=input<'default'|'glass'|'pill','default'|'glass'|'pill'|undefined>('default',{transform:v=>v===undefined?'default':v});
private readonly uniqueId='kit-tabs-indicator-'+(++tabsSequence);readonly indicatorId=computed(()=>this.layoutId()||this.uniqueId);
private internal=signal('');readonly activeId=computed(()=>this.activeTab()!==undefined?this.activeTab()!:this.internal());readonly current=computed(()=>this.tabs().find(tab=>tab.id===this.activeId()));
readonly root=viewChild.required<ElementRef<HTMLElement>>('root');readonly displayed=signal<AnimatedTabItem|undefined>(undefined);
private initialized=false;private phase:'enter'|'exit'='enter';private pending:AnimatedTabItem|undefined;private contentMotion:AnimatedTabsContentMotion|undefined;private indicatorMotion:AnimatedTabsIndicatorMotion|undefined;private zone=inject(NgZone);
ngOnInit():void{this.internal.set(this.defaultTab()||this.tabs()[0]?.id||'');this.initialized=true;this.syncContent()}
ngOnChanges(changes:SimpleChanges):void{this.indicatorMotion?.capture(true);if(!this.initialized)return;if((changes['defaultTab']||changes['activeTab'])&&this.defaultTab()&&this.activeTab()===undefined)this.internal.set(this.defaultTab()!);this.syncContent()}
choose(id:string):void{this.indicatorMotion?.capture();if(this.activeTab()===undefined)this.internal.set(id);this.syncContent();this.onChange()?.(id)}
private syncContent():void{
 if(!this.renderContent()){this.contentMotion?.destroy();this.contentMotion=undefined;this.displayed.set(undefined);this.pending=undefined;this.phase='enter';return}
 const current=this.current(),next=current?.content?current:undefined,shown=this.displayed();
 if(!shown){this.displayed.set(next);this.phase='enter';return}
 if(next?.id===shown.id){this.displayed.set(next);this.pending=undefined;if(this.phase==='exit'){this.phase='enter';this.contentMotion?.set(true)}return}
 this.pending=next;if(this.phase==='exit')return;
 if(!this.contentMotion){this.displayed.set(next);this.phase='enter';return}
 this.phase='exit';this.contentMotion.set(false);
}
ngAfterViewChecked():void{this.zone.runOutsideAngular(()=>{const root=this.root().nativeElement;this.indicatorMotion??=new AnimatedTabsIndicatorMotion(root);this.indicatorMotion.rendered(this.indicatorId());const node=root.querySelector<HTMLElement>('.k-tabs-panel')??undefined;if(this.contentMotion?.node!==node){this.contentMotion?.destroy();this.contentMotion=node?new AnimatedTabsContentMotion(node,()=>{this.contentMotion?.destroy();this.contentMotion=undefined;this.displayed.set(this.pending);this.pending=undefined;this.phase='enter'}):undefined}this.contentMotion?.set(this.phase==='enter')})}
contentTemplate(value:AnimatedTabContent):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null}
contentText(value:AnimatedTabContent):string|number|null|undefined{return typeof value==='boolean'||value instanceof TemplateRef?'':value}
ngOnDestroy():void{this.contentMotion?.destroy();this.indicatorMotion?.destroy();this.displayed.set(undefined);this.pending=undefined;}
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, computed } from '@angular/core';
import {TemplateRef,afterRenderEffect} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {PullToRefreshController,type PullIndicatorContext} from './pull-to-refresh-state';import {PullTranslateMotion} from './pull-refresh-motion';import {KitFinancialStatsCardComponent} from './financial-stats.component';import {KitPullIconComponent} from './pull-icons';import {KitFormContentComponent} from './form-parts';import {KitFormMotionDirective} from './form-motion';import {KitPullTurnDirective,KitPullSpinDirective} from './pull-indicator-motion';export {KitFinancialStatsCardComponent} from './financial-stats.component';export type {FinancialDataPoint,PullState,PullStatus} from './pull-to-refresh-data';export type {PullIndicator,PullIndicatorContext} from './pull-to-refresh-state';
@Component({
 selector:"kit-pull-to-refresh", standalone:true,
 host:{class:'kptr-native',style:'display:contents'},
 imports:[NgTemplateOutlet,KitFinancialStatsCardComponent,KitPullIconComponent,KitFormContentComponent,KitFormMotionDirective,KitPullTurnDirective,KitPullSpinDirective],
encapsulation:ViewEncapsulation.None,styleUrls:["./pull-to-refresh.css"],
template:`
<div #element data-kit="pull-to-refresh" (pointerdown)="pointerDown($event)" (keydown)="key($event)" [attr.tabindex]="disabled()?-1:0" role="region" aria-label="Pull to refresh panel. Press R to refresh when focused." [attr.aria-busy]="pullState().status==='refreshing'" [class]="panelClass()">
 @if(showDefaultIndicator()&&!pullIndicator()){<div aria-hidden="true" class="kpr-indicator" [style.opacity]="indicatorOpacity()" [style.transform]="'scale('+indicatorScale()+')'">
<div class="kpr-pill">
 @switch(pullState().status){@case('refreshing'){<div kitPullSpin class="kpr-spinner">
<svg kitPullIcon icon="refresh" class="kpr-refreshIcon"/>
</div>}@case('complete'){<div class="kpr-complete" [kitFormMotion]="{scale:1}" [initial]="{scale:0}">
<svg kitPullIcon icon="check" class="kpr-checkIcon"/>
</div>}@default{<div class="kpr-progress">
<svg class="kpr-ring">
<circle cx="8" cy="8" r="6.5" stroke="currentColor" class="kpr-track" stroke-width="1.6" fill="none"/>
<circle cx="8" cy="8" r="6.5" stroke="#E5E5E5" stroke-width="1.8" fill="none" stroke-dasharray="40.8" [attr.stroke-dashoffset]="40.8*(1-pullState().progress)" stroke-linecap="round"/>
</svg>
<div class="kpr-arrow" [kitPullTurn]="pullState().status==='ready'?180:0">
<svg kitPullIcon icon="down" class="kpr-arrowIcon"/>
</div>
</div>}}
 <span class="kpr-label">{{pullState().status==='refreshing'?'Refreshing...':pullState().status==='complete'?'Updated':pullState().status==='ready'?'Release to refresh':'Pull to refresh'}}</span>
</div>
</div>}
 @if(pullIndicator()){@if(indicatorTemplate()){<ng-container [ngTemplateOutlet]="indicatorTemplate()" [ngTemplateOutletContext]="indicatorContext()"/>}@else{<ng-container>{{indicatorText()}}</ng-container>}}
 <div class="kpr-body" [style.transform]="reducedMotion()||smoothTranslate()===0?'none':'translateY('+smoothTranslate()+'px)'">@if(content()){<kit-form-content [content]="content()"/>}@else{<ng-content>
<kit-financial-stats-card [dataMap]="demoValues()" [isRefreshing]="pullState().status==='refreshing'" [showMetrics]="true"/>
</ng-content>}</div>
 <button type="button" (click)="refresh()" [disabled]="disabled()||pullState().status==='refreshing'" class="kpr-fallback">Refresh financial statistics</button>
 </div>
`
})
export class KitPullToRefreshComponent extends PullToRefreshController {
private motionReady=false;readonly indicatorTemplate=computed(()=>this.indicatorContent() instanceof TemplateRef?this.indicatorContent() as TemplateRef<PullIndicatorContext>:null);readonly indicatorText=computed(()=>typeof this.indicatorContent()==='boolean'?null:this.indicatorContent());constructor(){super();afterRenderEffect(()=>{const element=this.element()?.nativeElement,view=element?.ownerDocument.defaultView;if(view&&!this.motionReady){this.motionReady=true;this.bindMotion(new PullTranslateMotion(view,(raw,smooth)=>this.paintMotion(raw,smooth)))}})}
}

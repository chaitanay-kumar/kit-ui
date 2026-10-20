// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import {TemplateRef,Injector} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {AIResponseRootController,AI_RESPONSE_CONTEXT} from './ai-response-state';import {KitAiResponseHeaderComponent,KitAiResponseContentComponent,KitAiResponseSourcesComponent,KitAiResponseActionsComponent} from './ai-response-parts';import {KitFormContentComponent} from './form-parts';export * from './ai-response-parts';export {AI_RESPONSE_CONTEXT,injectAIResponse,type AIResponseContextValue} from './ai-response-state';export * from './ai-response-types';
@Component({
 selector:"kit-ai-response", standalone:true,
 host:{class:'kar-native',style:'display:contents'},
 imports:[NgTemplateOutlet,KitFormContentComponent,KitAiResponseHeaderComponent,KitAiResponseContentComponent,KitAiResponseSourcesComponent,KitAiResponseActionsComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./ai-response.css"],
providers:[{provide:AI_RESPONSE_CONTEXT,useFactory:()=>inject(KitAiResponseComponent).contextValue}],
template:`
<div [class]="classes('kar-c30630f81b')" style="font-family:var(--font-sans, 'Geist', sans-serif)" [style.--accent-custom]="accentColor()||null">
 @if(children()){@if(childrenTemplate()){<ng-container [ngTemplateOutlet]="childrenTemplate()" [ngTemplateOutletInjector]="contentInjector"/>}@else{<kit-form-content [content]="children()"/>}}@else{<ng-content>
<kit-ai-response-header/>
<kit-ai-response-content/>@if(sources().length){<kit-ai-response-sources [sources]="sources()"/>}<kit-ai-response-actions/>
</ng-content>}
</div>
`
})
export class KitAiResponseComponent extends AIResponseRootController {
readonly contentInjector=inject(Injector);readonly childrenTemplate=computed(()=>this.children() instanceof TemplateRef?this.children() as TemplateRef<unknown>:null);
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import {Injector,TemplateRef,contentChildren,forwardRef} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {ChatRootController,CHAT_CONTEXT,CHAT_CONTENT} from './chat-context';import {KitChatHeaderComponent,KitChatSidebarComponent,KitChatMessagesComponent,KitChatComposerComponent} from './chat-parts';export * from './chat-parts';export * from './chat-context';
@Component({
 selector:"kit-chat", standalone:true,
 host:{'data-kit':'chat',class:'kc-native',style:'display:contents'},
 imports:[NgTemplateOutlet,KitChatHeaderComponent,KitChatSidebarComponent,KitChatMessagesComponent,KitChatComposerComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./chat.css"],
providers:[{provide:CHAT_CONTEXT,useExisting:forwardRef(()=>KitChatComponent)}],
template:`
<div data-chat-root style="font-family:var(--font-sans,'Geist',sans-serif)" [style.--accent-custom]="accentColor()||null" [class]="classes('kc-9d50f32148 ')">@if(content()){@if(contentTemplate()){<ng-container [ngTemplateOutlet]="contentTemplate()" [ngTemplateOutletInjector]="contextInjector"/>}@else{<ng-container>{{contentText()}}</ng-container>}}@else if(projected().length){<ng-content/>}@else{@if(threads()?.length){<kit-chat-sidebar/>}<div class="kc-7452036c4f">
<kit-chat-header [onClearChat]="onClearChat()"/>
<kit-chat-messages/>
<kit-chat-composer/>
</div>}</div>
`
})
export class KitChatComponent extends ChatRootController {
readonly projected=contentChildren(CHAT_CONTENT,{descendants:true});readonly contextInjector=inject(Injector);readonly contentTemplate=computed(()=>this.content() instanceof TemplateRef?this.content() as TemplateRef<unknown>:null);readonly contentText=computed(()=>typeof this.content()==='boolean'?null:this.content());
}

import {Component,DestroyRef,inject,signal} from '@angular/core';
import {KitDynamicIslandComponent,KitChatComponent,type ChatMessageItem,type ChatAttachment} from 'kit-ui-angular';
@Component({selector:'kit-dynamic-island-demo',standalone:true,imports:[KitDynamicIslandComponent],template:`<kit-dynamic-island/>`})
export class DynamicIslandDemoComponent{}
@Component({selector:'kit-chat-demo',standalone:true,imports:[KitChatComponent],template:`<kit-chat [messages]="messages()" [onSendMessage]="send" [isGenerating]="generating()" [threads]="threads" [activeThreadId]="active()" [onSelectThread]="select" [onNewChat]="clear" [onClearChat]="clear"/>`})
export class ChatDemoComponent{
 readonly messages=signal<ChatMessageItem[]>([{id:'welcome',role:'assistant',content:'This is a local conversation demo. Try sending a message.'}]);readonly generating=signal(false);readonly active=signal('today');
 readonly threads=[{id:'today',title:'Local conversation',timestamp:'Today',group:'Today'},{id:'previous',title:'Component ideas',timestamp:'Yesterday',group:'Yesterday'}];
 private serial=0;private timer:ReturnType<typeof setTimeout>|undefined;
 readonly send=(content:string,attachments?:ChatAttachment[])=>{this.messages.update(previous=>[...previous,{id:'message-'+ ++this.serial,role:'user',content,attachments}]);this.generating.set(true);if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(()=>{this.messages.update(previous=>[...previous,{id:'message-'+ ++this.serial,role:'assistant',content:'Message received locally. Connect your own transport to receive live replies.'}]);this.generating.set(false)},350)};
 readonly clear=()=>{if(this.timer)clearTimeout(this.timer);this.messages.set([]);this.generating.set(false)};
 readonly select=(id:string)=>this.active.set(id);
 constructor(){inject(DestroyRef).onDestroy(()=>{if(this.timer)clearTimeout(this.timer)})}
}

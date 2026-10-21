import {INITIAL_CHAT_MESSAGES,INITIAL_THREADS} from './chat-showcase-data';
import {Component,DestroyRef,inject,signal} from '@angular/core';
import {KitDynamicIslandComponent,KitChatComponent,type ChatMessageItem,type ChatAttachment} from 'kit-ui-angular';
@Component({selector:'kit-dynamic-island-demo',standalone:true,imports:[KitDynamicIslandComponent],template:`<kit-dynamic-island/>`})
export class DynamicIslandDemoComponent{}
@Component({selector:'kit-chat-demo',standalone:true,imports:[KitChatComponent],styles:`:host{display:block;min-width:0}.chat-stage{min-width:0;padding:44px;display:flex;align-items:center;justify-content:center}.chat-showcase{min-width:0;width:100%;max-width:896px;margin-inline:auto;padding-block:4px}@media(max-width:639px){.chat-stage{padding:22px}}@media(min-width:640px){.chat-showcase{padding-block:0}}`,template:`<div class="chat-stage"><div class="chat-showcase"><kit-chat [messages]="messages()" [onSendMessage]="send" [isGenerating]="generating()" [threads]="threads()" [activeThreadId]="active()" [onSelectThread]="select" [onNewChat]="newChat" [onClearChat]="clear"/></div></div>`})
export class ChatDemoComponent{

 readonly messages=signal<ChatMessageItem[]>(INITIAL_CHAT_MESSAGES.map(message=>({...message})));readonly generating=signal(false);readonly active=signal('t-1');
 readonly threads=signal(INITIAL_THREADS.map(thread=>({...thread})));
 private timer:ReturnType<typeof setTimeout>|undefined;
 private cancelReply(){clearTimeout(this.timer);this.timer=undefined;this.generating.set(false);}
 readonly send=(content:string,attachments?:ChatAttachment[])=>{
  this.messages.update(previous=>[...previous,{id:'msg-'+Date.now(),role:'user',content,author:'You',timestamp:'Just now',status:'sent',attachments:attachments?.map(a=>({id:a.id,name:a.name,size:a.size,type:a.type}))}]);this.generating.set(true);clearTimeout(this.timer);
  this.timer=setTimeout(()=>{this.messages.update(previous=>[...previous,{id:'msg-'+(Date.now()+1),role:'assistant',content:'Acknowledged! I received your instruction regarding: "'+content.slice(0,40)+(content.length>40?'...':'')+'". The Kit UI component library has synchronized these updates with zero breaking changes.',author:'Kit AI Assistant',timestamp:'Just now',status:'delivered'}]);this.generating.set(false);this.timer=undefined;},1200);
 };
 readonly clear=()=>{this.cancelReply();this.messages.set([]);};
 readonly newChat=()=>{this.cancelReply();const id='t-'+Date.now();this.threads.update(previous=>[{id,title:'New Conversation',timestamp:'Just now',group:'Today'},...previous]);this.active.set(id);this.messages.set([{id:'welcome-'+Date.now(),role:'assistant',content:'Hello! I am your Kit UI assistant. How can I assist you with your component design today?',timestamp:'Just now'}]);};
 readonly select=(id:string)=>this.active.set(id);
 constructor(){inject(DestroyRef).onDestroy(()=>clearTimeout(this.timer));}
}

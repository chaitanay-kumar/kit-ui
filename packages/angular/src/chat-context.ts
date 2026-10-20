import {Directive,ElementRef,ErrorHandler,InjectionToken,afterRenderEffect,computed,inject,input,signal,viewChild,type Signal} from '@angular/core';
import type {FormContent} from './form-parts';
import type {ChatAttachment,ChatConversationThread,ChatMessageItem,ChatSendMessage} from './chat-types';
import {invokeNativeEventCallback} from './native-event-callback';
import {nativeClasses} from './native-classes';
import {CHAT_CLASS_SOURCES} from './chat-classnames';
export * from './chat-types';

/** Signal getters replace the source context's render-time values. */
export interface ChatContextValue{
 messages:Signal<ChatMessageItem[]>;onSendMessage:Signal<ChatSendMessage>;isGenerating:Signal<boolean>;
 activeThreadId:Signal<string|undefined>;onSelectThread:Signal<((id:string)=>void)|undefined>;onNewChat:Signal<(()=>void)|undefined>;
 isSidebarOpen:Signal<boolean>;setIsSidebarOpen:(open:boolean)=>void;threads:Signal<ChatConversationThread[]|undefined>;accentColor:Signal<string|undefined>;
}
export const CHAT_CONTEXT=new InjectionToken<ChatContextValue>('kit-ui Chat context');
export const CHAT_CONTENT=new InjectionToken<unknown>('kit-ui Chat projected content');
@Directive({selector:'[kitChatContent]',standalone:true,providers:[{provide:CHAT_CONTENT,useValue:true}]})
export class KitChatContentDirective{}
/** Native counterpart of useChat; call in an Angular injection context. */
export function injectChat():ChatContextValue{const context=inject(CHAT_CONTEXT,{optional:true});if(!context)throw new Error('Chat compound subcomponents must be used within <Chat>');return context}

@Directive()
export abstract class ChatPart{
 readonly className=input<string,string|undefined>('',{transform:value=>value??''});
 protected readonly errors=inject(ErrorHandler);
 classes(scoped:string):string{return nativeClasses(scoped,scoped.split(/\s+/).map(name=>CHAT_CLASS_SOURCES[name]??'').join(' '),this.className())}
}

@Directive()
export abstract class ChatRootController extends ChatPart implements ChatContextValue{
 readonly messages=input.required<ChatMessageItem[]>();readonly onSendMessage=input.required<ChatSendMessage>();
 readonly isGenerating=input<boolean,boolean|undefined>(false,{transform:value=>value??false});
 readonly threads=input<ChatConversationThread[]|undefined>();readonly activeThreadId=input<string|undefined>();readonly accentColor=input<string|undefined>();
 readonly onSelectThread=input<((id:string)=>void)|undefined>();readonly onNewChat=input<(()=>void)|undefined>();readonly onClearChat=input<(()=>void)|undefined>();
 readonly content=input<FormContent|undefined>();readonly isSidebarOpen=signal(false);readonly setIsSidebarOpen=(open:boolean)=>this.isSidebarOpen.set(open);
}

@Directive()
export abstract class ChatHeaderController extends ChatPart{
 readonly chat=injectChat();
 readonly title=input<string,string|undefined>('AI Assistant',{transform:value=>value===undefined?'AI Assistant':value});
 readonly subtitle=input<string,string|undefined>('Claude 3.7 Sonnet',{transform:value=>value===undefined?'Claude 3.7 Sonnet':value});
 readonly modelBadge=input<string|undefined>();readonly onClearChat=input<(()=>void)|undefined>();
 toggle():void{this.chat.setIsSidebarOpen(!this.chat.isSidebarOpen())}
 clear(event:MouseEvent):void{invokeNativeEventCallback(this.onClearChat(),event,this.errors)}
}

@Directive()
export abstract class ChatSidebarController extends ChatPart{
 readonly chat=injectChat();
 readonly groups=computed(()=>{const groups:Record<string,ChatConversationThread[]>={};for(const thread of this.chat.threads()??[]){const group=thread.group||'Today';if(!groups[group])groups[group]=[];groups[group].push(thread)}return Object.entries(groups)});
 close():void{this.chat.setIsSidebarOpen(false)}
 newChat(event:MouseEvent):void{invokeNativeEventCallback(()=>{const callback=this.chat.onNewChat();callback?.();this.close()},event,this.errors)}
 selectThread(id:string,event:MouseEvent):void{invokeNativeEventCallback(()=>{const callback=this.chat.onSelectThread();callback?.(id);this.close()},event,this.errors)}
}

@Directive()
export abstract class ChatComposerController extends ChatPart{
 readonly chat=injectChat();
 readonly placeholder=input<string,string|undefined>('Ask a question or type a message...',{transform:value=>value===undefined?'Ask a question or type a message...':value});
 readonly allowAttachments=input<boolean,boolean|undefined>(true,{transform:value=>value===undefined?true:value});
 readonly inputText=signal('');readonly attachments=signal<ChatAttachment[]>([]);
 readonly textarea=viewChild<ElementRef<HTMLTextAreaElement>>('textarea');readonly fileInput=viewChild<ElementRef<HTMLInputElement>>('fileInput');
 readonly blocked=computed(()=>(!this.inputText().trim()&&this.attachments().length===0)||this.chat.isGenerating());
 change(event:Event):void{this.inputText.set((event.target as HTMLTextAreaElement).value)}
 send(event:Event):void{invokeNativeEventCallback(()=>{
  if(this.blocked())return;
  const callback=this.chat.onSendMessage();callback(this.inputText().trim(),this.attachments());
  this.inputText.set('');this.attachments.set([]);
  const textarea=this.textarea()?.nativeElement;if(textarea)textarea.style.height='auto';
 },event,this.errors)}
 key(event:KeyboardEvent):void{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();this.send(event)}}
 chooseFiles():void{this.fileInput()?.nativeElement.click()}
 selectFiles(event:Event):void{
  const input=event.target as HTMLInputElement,files=input.files;if(!files?.length)return;
  const attachments:ChatAttachment[]=Array.from(files).map((file,index)=>({id:'att-'+Date.now()+'-'+index,name:file.name,size:(file.size/1024).toFixed(1)+' KB',type:file.type.startsWith('image/')?'image':'file'}));
  this.attachments.update(previous=>[...previous,...attachments]);input.value='';
 }
 removeAttachment(id:string):void{this.attachments.update(previous=>previous.filter(attachment=>attachment.id!==id))}
 constructor(){super();afterRenderEffect(()=>{this.inputText();const textarea=this.textarea()?.nativeElement;if(textarea){textarea.style.height='auto';textarea.style.height=Math.min(textarea.scrollHeight,160)+'px'}})}
}

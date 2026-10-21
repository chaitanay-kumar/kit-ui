import {Directive,DestroyRef,ElementRef,afterRenderEffect,computed,inject,input,signal,viewChild} from '@angular/core';
import type {FormContent} from './form-parts';
import {ChatPart,injectChat} from './chat-context';
import type {ChatMessageItem} from './chat-types';
import {copyDataDetails} from './data-details-copy';
import {invokeNativeEventCallback} from './native-event-callback';

/** Optimistic copied feedback retains separate source timers for repeated clicks. */
@Directive()
export abstract class ChatCopyController extends ChatPart{
 readonly copied=signal(false);private readonly host=inject<ElementRef<HTMLElement>>(ElementRef);private timers=new Set<number>();
 protected copyText(text:string,event:MouseEvent):void{invokeNativeEventCallback(()=>{const view=this.host.nativeElement.ownerDocument.defaultView;if(!view)return;void copyDataDetails(text,view);this.copied.set(true);const timer=view.setTimeout(()=>{this.timers.delete(timer);this.copied.set(false)},2000);this.timers.add(timer)},event,this.errors)}
 constructor(){super();inject(DestroyRef).onDestroy(()=>{const view=this.host.nativeElement.ownerDocument.defaultView;for(const timer of this.timers)view?.clearTimeout(timer);this.timers.clear()})}
}

@Directive()
export abstract class ChatCodeBlockController extends ChatCopyController{
 readonly language=input<string|undefined>();readonly code=input.required<string>();copy(event:MouseEvent):void{this.copyText(this.code(),event)}
}

@Directive()
export abstract class ChatMessageController extends ChatCopyController{
 readonly message=input.required<ChatMessageItem>();readonly onRetry=input<((id:string)=>void)|undefined>();
 readonly isUser=computed(()=>this.message().role==='user');readonly isAssistant=computed(()=>this.message().role==='assistant');
 copy(event:MouseEvent):void{this.copyText(this.message().content,event)}
 retry(event:MouseEvent):void{invokeNativeEventCallback(()=>{const callback=this.onRetry();callback?.(this.message().id)},event,this.errors)}
}

@Directive()
export abstract class ChatMessagesController extends ChatPart{
 readonly chat=injectChat();readonly emptyPlaceholder=input<FormContent|undefined>();readonly bottom=viewChild<ElementRef<HTMLDivElement>>('bottom');
 readonly spacing=signal(16);
 constructor(){super();const view=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.ownerDocument.defaultView,media=view?.matchMedia?.('(min-width:640px)'),resize=()=>this.spacing.set(media?media.matches?16:12:16);resize();media?.addEventListener('change',resize);inject(DestroyRef).onDestroy(()=>media?.removeEventListener('change',resize));
  afterRenderEffect(onCleanup=>{
   this.chat.messages();this.chat.isGenerating();const bottom=this.bottom()?.nativeElement;
   if(typeof bottom?.scrollIntoView!=='function')return;
   // Transparent hosts receive their spacing after render. Scroll on the next
   // frame, once that layout is committed, rather than targeting stale height.
   if(view?.requestAnimationFrame){const frame=view.requestAnimationFrame(()=>bottom.scrollIntoView({behavior:'smooth'}));onCleanup(()=>view.cancelAnimationFrame(frame));}
   else bottom.scrollIntoView({behavior:'smooth'});
  });
 }
}

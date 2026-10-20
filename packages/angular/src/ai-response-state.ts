import {Directive,DestroyRef,ElementRef,ErrorHandler,InjectionToken,Injector,TemplateRef,computed,effect,inject,input,signal,untracked,type Signal} from '@angular/core';
import type {FormContent} from './form-parts';
import type {AIResponseSource,AIResponseStatus,AIResponseTool} from './ai-response-types';
import {nativeClasses} from './native-classes';
import {AI_RESPONSE_CLASSES} from './ai-response-classes';
import {copyDataDetails} from './data-details-copy';
import {invokeNativeEventCallback} from './native-event-callback';
export * from './ai-response-types';

export interface AIResponseContextValue{
 content:Signal<string>;status:Signal<AIResponseStatus>;modelName:Signal<string|undefined>;sources:Signal<AIResponseSource[]>;
 copied:Signal<boolean>;feedback:Signal<'like'|'dislike'|null>;accentColor:Signal<string|undefined>;
 onRegenerate:Signal<(()=>void)|undefined>;onFeedback:Signal<((type:'like'|'dislike')=>void)|undefined>;copyContent:(event?:MouseEvent)=>void;giveFeedback:(type:'like'|'dislike',event?:MouseEvent)=>void;regenerate:(event?:MouseEvent)=>void;
}
export const AI_RESPONSE_CONTEXT=new InjectionToken<AIResponseContextValue>('kit-ui AIResponse context');
/** Nearest-root native counterpart of the React compound context hook. */
export function injectAIResponse():AIResponseContextValue{const context=inject(AI_RESPONSE_CONTEXT,{optional:true});if(!context)throw new Error('AIResponse compound components must be used within <AIResponse>');return context}

@Directive()
export abstract class AIResponsePart{
 readonly className=input<string,string|undefined>('',{transform:value=>value===undefined?'':value});
 protected readonly errors=inject(ErrorHandler);
 // Precompiled scoped utilities style the merged classes; removed defaults must
 // not retain custom properties (for example --tw-leading) through a fallback.
 classes(scoped:string):string{return nativeClasses('',scoped.split(/\s+/).map(name=>AI_RESPONSE_CLASSES[name]??'').join(' '),this.className()).trim()}
 variants(scoped:string):string{const names=scoped.split(/\s+/).filter(name=>Object.prototype.hasOwnProperty.call(AI_RESPONSE_CLASSES,name));return nativeClasses(names.join(' '),names.map(name=>AI_RESPONSE_CLASSES[name]).join(' '),'')}
}
@Directive()
export abstract class AIResponseCopyController extends AIResponsePart{
 readonly copied=signal(false);private readonly view=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.ownerDocument.defaultView;private readonly timers=new Set<number>();private disposed=false;
 protected copyText(text:string,event?:MouseEvent):void{invokeNativeEventCallback(()=>{const view=this.view;if(!view||this.disposed)return;void copyDataDetails(text,view);if(this.disposed)return;this.copied.set(true);const timer=view.setTimeout(()=>{this.timers.delete(timer);this.copied.set(false)},2000);this.timers.add(timer)},event??new Event('click'),this.errors)}
 constructor(){super();inject(DestroyRef).onDestroy(()=>{this.disposed=true;for(const timer of this.timers)this.view?.clearTimeout(timer);this.timers.clear()})}
}
@Directive()
export abstract class AIResponseRootController extends AIResponseCopyController implements AIResponseContextValue{
 readonly content=input<string,string|undefined>('',{transform:value=>value===undefined?'':value});
 readonly status=input<AIResponseStatus,AIResponseStatus|undefined>('complete',{transform:value=>value===undefined?'complete':value});
 readonly modelName=input<string,string|undefined>('Kit AI 2.0',{transform:value=>value===undefined?'Kit AI 2.0':value});
 readonly sources=input<AIResponseSource[],AIResponseSource[]|undefined>([],{transform:value=>value===undefined?[]:value});
 readonly accentColor=input<string|undefined>();readonly onRegenerate=input<(()=>void)|undefined>();readonly onFeedback=input<((type:'like'|'dislike')=>void)|undefined>();readonly children=input<FormContent|undefined>();
 readonly feedback=signal<'like'|'dislike'|null>(null);
 readonly copyContent=(event?:MouseEvent)=>this.copyText(this.content(),event);
 readonly giveFeedback=(type:'like'|'dislike',event?:MouseEvent)=>invokeNativeEventCallback(()=>{this.feedback.update(previous=>previous===type?null:type);const callback=this.onFeedback();callback?.(type)},event??new Event('click'),this.errors);
 readonly regenerate=(event?:MouseEvent)=>invokeNativeEventCallback(this.onRegenerate(),event??new Event('click'),this.errors);
 readonly contextFeedback=computed(()=>this.giveFeedback);
 readonly contextValue:AIResponseContextValue={content:this.content,status:this.status,modelName:this.modelName,sources:this.sources,copied:this.copied,feedback:this.feedback,accentColor:this.accentColor,onRegenerate:this.onRegenerate,onFeedback:this.contextFeedback,copyContent:this.copyContent,giveFeedback:this.giveFeedback,regenerate:this.regenerate};
}
@Directive()
export abstract class AIResponseHeaderController extends AIResponsePart{
 readonly response=injectAIResponse();readonly title=input<string,string|undefined>('Assistant',{transform:value=>value===undefined?'Assistant':value});readonly modelBadge=input<string|undefined>();readonly timestamp=input<string|undefined>();readonly icon=input<FormContent|undefined>();readonly badge=computed(()=>this.modelBadge()||this.response.modelName());
 readonly contentInjector=inject(Injector);readonly iconTemplate=computed(()=>this.icon() instanceof TemplateRef?this.icon() as TemplateRef<unknown>:null);
}
@Directive()
export abstract class AIResponseContentController extends AIResponsePart{readonly response=injectAIResponse()}
@Directive()
export abstract class AIResponseActionsController extends AIResponsePart{readonly response=injectAIResponse();readonly busy=computed(()=>this.response.status()==='streaming'||this.response.status()==='generating')}
@Directive()
export abstract class AIResponseCodeController extends AIResponseCopyController{
 readonly language=input<string,string|undefined>('typescript',{transform:value=>value===undefined?'typescript':value});readonly filename=input<string|undefined>();readonly code=input.required<string>();copy(event?:MouseEvent):void{this.copyText(this.code(),event)}
}
@Directive()
export abstract class AIResponseDisclosureController<T> extends AIResponsePart{
 readonly expanded=signal(false);readonly panelPresent=signal(false);readonly panelLeaving=signal(false);readonly panelItems=signal<T[]>([]);
 toggle():void{this.expanded.update(value=>!value)}
 protected syncPanel(items:T[],expanded:boolean,outerVisible:boolean):void{untracked(()=>{if(!outerVisible){this.panelPresent.set(false);this.panelLeaving.set(false)}else if(expanded&&items.length){this.panelItems.set(items);this.panelPresent.set(true);this.panelLeaving.set(false)}else if(this.panelPresent())this.panelLeaving.set(true)})}
 finishExit():void{if(this.panelLeaving())this.panelPresent.set(false)}
}
@Directive()
export abstract class AIResponseSourcesController extends AIResponseDisclosureController<AIResponseSource>{
 readonly response=injectAIResponse();readonly sources=input<AIResponseSource[]|undefined>();readonly title=input<string,string|undefined>('Cited Sources',{transform:value=>value===undefined?'Cited Sources':value});readonly defaultExpanded=input<boolean,boolean|undefined>(false,{transform:value=>value===undefined?false:value});readonly items=computed(()=>this.sources()||this.response.sources());
 constructor(){super();let mounted=false;effect(()=>{const expanded=this.defaultExpanded();if(!mounted){mounted=true;this.expanded.set(expanded)}});effect(()=>{const items=this.items();this.syncPanel(items,this.expanded(),items.length>0)})}
}
@Directive()
export abstract class AIResponseToolsController extends AIResponseDisclosureController<AIResponseTool>{
 readonly toolCount=input.required<number>();readonly tools=input<AIResponseTool[],AIResponseTool[]|undefined>([],{transform:value=>value===undefined?[]:value});readonly onToggleDetails=input<(()=>void)|undefined>();
 toggleDetails(event:MouseEvent):void{invokeNativeEventCallback(()=>{this.toggle();const callback=this.onToggleDetails();callback?.()},event,this.errors)}
 constructor(){super();effect(()=>this.syncPanel(this.tools(),this.expanded(),!(this.toolCount()<=0)))}
}

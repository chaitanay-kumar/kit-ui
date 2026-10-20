import {Directive,DestroyRef,ElementRef,TemplateRef,afterRenderEffect,computed,inject,input,signal} from '@angular/core';
import {FormPart,type FormContent} from './form-parts';
import {PullRefreshSession,type PullRefreshMotion,type PullRefreshOptions} from './pull-refresh-session';
import type {PullState} from './pull-to-refresh-data';
import {nativeClasses} from './native-classes';
import {PULL_CLASSES} from './pull-refresh-classes';
import {NativeRootBindings} from './native-root-bindings';
export interface PullIndicatorContext extends PullState{$implicit:PullState}
export type PullIndicator=TemplateRef<PullIndicatorContext>|((state:PullState)=>FormContent);

/** Native input/event ownership; the authored template supplies its motion driver. */
@Directive()
export abstract class PullToRefreshController extends FormPart<HTMLDivElement>{
 readonly onRefresh=input<(()=>void|Promise<void>)|undefined>();
 readonly threshold=input<number,number|undefined>(68,{transform:value=>value===undefined?68:value});
 readonly maxPull=input<number,number|undefined>(110,{transform:value=>value===undefined?110:value});
 readonly resistance=input<number,number|undefined>(.45,{transform:value=>value===undefined?.45:value});
 readonly refreshingHoldOffset=input<number,number|undefined>(48,{transform:value=>value===undefined?48:value});
 readonly disabled=input<boolean,boolean|undefined>(false,{transform:value=>value===undefined?false:value});
 readonly showDefaultIndicator=input<boolean,boolean|undefined>(true,{transform:value=>value===undefined?true:value});
 readonly pullIndicator=input<PullIndicator|undefined>();readonly content=input<FormContent|undefined>();
 private readonly revision=signal(0);private driver:PullRefreshMotion|undefined;
 readonly session:PullRefreshSession;
 readonly pullState=computed(()=>{this.revision();return this.session.state});
 readonly demoValues=computed(()=>{this.revision();return this.session.demoValues});
 readonly indicatorContent=computed(()=>{const renderer=this.pullIndicator();return typeof renderer==='function'?renderer(this.pullState()):renderer});
 readonly indicatorContext=computed(()=>({$implicit:this.pullState(),...this.pullState()}));
 readonly reducedMotion=signal(false);
 readonly rawTranslate=signal(0);readonly smoothTranslate=signal(0);
 readonly panelClass=computed(()=>nativeClasses('kpr-panel',PULL_CLASSES.panel+' '+(this.disabled()?PULL_CLASSES.disabled:PULL_CLASSES.enabled),this.className()));
 readonly indicatorOpacity=computed(()=>{const raw=this.rawTranslate(),threshold=this.threshold();if(this.pullState().status==='refreshing'||this.pullState().status==='complete')return 1;return raw<=threshold*.3?Math.max(0,raw/(threshold*.3)*.75):Math.min(1,.75+(raw-threshold*.3)/(threshold*.7)*.25)});
 readonly indicatorScale=computed(()=>this.pullState().status==='refreshing'||this.pullState().status==='complete'?1:Math.max(.75,Math.min(1,.75+.25*this.rawTranslate()/this.threshold())));
 protected paintMotion(raw:number,smooth:number):void{
  this.rawTranslate.set(raw);this.smoothTranslate.set(smooth);
  // Motion values paint during the animation frame, before Angular's next render.
  const root=this.element()?.nativeElement,body=root?.querySelector<HTMLElement>('.kpr-body'),indicator=root?.querySelector<HTMLElement>('.kpr-indicator');
  if(body)body.style.transform=this.reducedMotion()||smooth===0?'none':'translateY('+smooth+'px)';
  if(indicator){indicator.style.opacity=String(this.indicatorOpacity());indicator.style.transform='scale('+this.indicatorScale()+')'}
 }
 private readonly view=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.ownerDocument.defaultView;
 private readonly move=(event:PointerEvent)=>this.session.move(event.clientX,event.clientY);
 private readonly up=()=>this.session.up();
 protected bindMotion(driver:PullRefreshMotion):void{this.driver?.destroy();this.driver=driver}
 private options():PullRefreshOptions{return{onRefresh:this.onRefresh(),threshold:this.threshold(),maxPull:this.maxPull(),resistance:this.resistance(),refreshingHoldOffset:this.refreshingHoldOffset(),disabled:this.disabled()}}
 pointerDown(event:PointerEvent):void{if(Object.prototype.hasOwnProperty.call(this.events()??{},'pointerdown'))return;const target=event.target as Element,scroll=target.closest('[data-scrollable="true"]');this.session.down(event.clientX,event.clientY,!target.closest('button')&&!target.closest('svg.cursor-crosshair')&&!(scroll&&scroll.scrollTop>0))}
 key(event:KeyboardEvent):void{if(!Object.prototype.hasOwnProperty.call(this.events()??{},'keydown'))this.session.key(event)}
 refresh():void{void this.session.refresh()}
 constructor(){super();const view=this.view;
  this.session=new PullRefreshSession(()=>this.options(),{set:value=>this.driver?.set(value),spring:(...args)=>this.driver?.spring(...args),destroy:()=>this.driver?.destroy()},{now:()=>Date.now(),setTimeout:(callback,duration)=>view?.setTimeout(callback,duration)??0,clearTimeout:id=>view?.clearTimeout(id)},()=>this.revision.update(value=>value+1));
  const media=view?.matchMedia?.('(prefers-reduced-motion: reduce)'),preference=()=>this.reducedMotion.set(media?.matches??false);preference();media?.addEventListener('change',preference);
  afterRenderEffect(()=>{const element=this.element()?.nativeElement,attributes=this.attributes(),disabled=this.disabled(),busy=this.pullState().status==='refreshing';if(element)new NativeRootBindings(element).apply(undefined,attributes,{role:'region','aria-label':'Pull to refresh panel. Press R to refresh when focused.',tabindex:disabled?-1:0,'aria-busy':busy})});
  view?.addEventListener('pointermove',this.move,{passive:true});view?.addEventListener('pointerup',this.up);view?.addEventListener('pointercancel',this.up);
  inject(DestroyRef).onDestroy(()=>{this.session.destroy();media?.removeEventListener('change',preference);view?.removeEventListener('pointermove',this.move);view?.removeEventListener('pointerup',this.up);view?.removeEventListener('pointercancel',this.up)});
 }
}

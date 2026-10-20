import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {Batch39Spring} from './batch39-motion';
@Directive({selector:'[kitDragReveal]',standalone:true})
export class DragConfirmRevealDirective{
 readonly kind=input<'icon'|'label'>('label',{alias:'kitDragReveal'});private host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;
 constructor(){afterRenderEffect(()=>{if(this.spring)return;const view=this.host.ownerDocument.defaultView;if(!view)return;const icon=this.kind()==='icon';this.spring=new Batch39Spring(view,{scale:icon?0:.94,rotate:icon?-20:0,opacity:icon?1:0},380,30,.5,value=>{this.host.style.transform=`scale(${value.scale}) rotate(${value.rotate}deg)`;this.host.style.opacity=String(value.opacity)});this.spring.to({scale:1,rotate:0,opacity:1})});inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}

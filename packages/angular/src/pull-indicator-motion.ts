import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {Batch39Spring} from './batch39-motion';
@Directive({selector:'[kitPullTurn]',standalone:true})
export class KitPullTurnDirective{
 readonly angle=input(0,{alias:'kitPullTurn'});private node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;
 constructor(){afterRenderEffect(()=>{const angle=this.angle(),view=this.node.ownerDocument.defaultView;if(!view)return;this.spring??=new Batch39Spring(view,{angle:0},380,30,.5,value=>this.node.style.transform=value.angle===0?'none':'rotate('+value.angle+'deg)');this.spring.to({angle})});inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}
/** Source refresh rotation remains active even with reduced motion enabled. */
@Directive({selector:'[kitPullSpin]',standalone:true})
export class KitPullSpinDirective{
 private node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private view=this.node.ownerDocument.defaultView;private frame=0;private started=0;
 private tick=(now:number)=>{this.node.style.transform='rotate('+((now-this.started)%750)/750*360+'deg)';this.frame=this.view?.requestAnimationFrame(this.tick)??0};
 constructor(){afterRenderEffect(()=>{if(!this.frame&&this.view){this.started=this.view.performance.now();this.node.style.transform='none';this.frame=this.view.requestAnimationFrame(this.tick)}});inject(DestroyRef).onDestroy(()=>{if(this.frame)this.view?.cancelAnimationFrame(this.frame)})}
}

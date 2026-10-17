import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
@Directive({selector:'[kitDataTimelineProgress]',standalone:true})
export class DataTimelineProgressDirective{
 readonly percent=input(0);private readonly host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private axis:Batch20Spring={value:0,target:100,velocity:0,restDelta:.5,restSpeed:2};private from=0;private to=0;private initialized=false;private frame=0;private last=0;
 constructor(){afterRenderEffect(()=>{const target=this.percent(),view=this.host.ownerDocument.defaultView;if(!view||this.initialized&&this.to===target)return;this.initialized=true;this.from=this.from+(this.to-this.from)*this.axis.value/100;this.to=target;this.axis.value=0;this.axis.target=100;this.host.style.height=this.from+'%';if(!this.frame){this.last=view.performance.now();this.frame=view.requestAnimationFrame(this.tick)}});inject(DestroyRef).onDestroy(()=>this.host.ownerDocument.defaultView?.cancelAnimationFrame(this.frame))}
 private tick=(now:number):void=>{const dt=Math.max(0,(now-this.last)/1000);this.last=now;const running=stepBatch20Spring(this.axis,dt,170,26,.9);this.host.style.height=(this.from+(this.to-this.from)*this.axis.value/100)+'%';this.frame=running?this.host.ownerDocument.defaultView!.requestAnimationFrame(this.tick):0};
}

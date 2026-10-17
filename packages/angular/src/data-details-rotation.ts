import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
function easeOut(x:number):number{let low=0,high=1,t=x;for(let index=0;index<20;index++){t=(low+high)/2;const px=3*(1-t)*t*t*.58+t*t*t;if(px<x)low=t;else high=t}return 3*(1-t)*t*t+t*t*t}
/** Source row chevrons use springSnappy; timeline chevrons use a 200ms ease-out tween. */
@Directive({selector:'[kitDataDetailsRotation]',standalone:true})
export class DataDetailsRotationDirective{
 readonly angle=input(0);readonly tween=input(false);private readonly host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 private axis:Batch20Spring={value:0,target:0,velocity:0};private frame=0;private last=0;private initialized=false;private origin=0;private start=0;
 constructor(){afterRenderEffect(()=>{const value=this.angle(),view=this.host.ownerDocument.defaultView;if(!view)return;if(!this.initialized){this.initialized=true;this.axis.value=value;this.axis.target=value;this.paint();return}if(this.axis.target===value)return;this.axis.target=value;this.origin=this.axis.value;this.start=view.performance.now();if(!this.frame){this.last=this.start;this.frame=view.requestAnimationFrame(this.tick)}});inject(DestroyRef).onDestroy(()=>this.host.ownerDocument.defaultView?.cancelAnimationFrame(this.frame))}
 private paint():void{this.host.style.transform=this.axis.value===0?'none':'rotate('+this.axis.value+'deg)'}
 private tick=(now:number):void=>{const dt=Math.max(0,(now-this.last)/1000);this.last=now;let running:boolean;if(this.tween()){const progress=Math.min(1,(now-this.start)/200);this.axis.value=this.origin+(this.axis.target-this.origin)*easeOut(progress);running=progress<1}else running=stepBatch20Spring(this.axis,dt,380,30,.5);this.paint();this.frame=running?this.host.ownerDocument.defaultView!.requestAnimationFrame(this.tick):0};
}

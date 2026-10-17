import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
import type {DepthGeometry} from './depth-corridor-types';
const keys=['x','y','z','scale','opacity','blur','rotateY'] as const;
/** Motion's springSmooth contract, including preserved velocity on interruption. */
@Directive({selector:'[kitDepthMotion]',standalone:true})
export class DepthCorridorMotionDirective {
 readonly geometry=input.required<DepthGeometry>({alias:'kitDepthMotion'});private host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 private axes={} as Record<keyof DepthGeometry,Batch20Spring>;private initialized=false;private frame=0;private last=0;
 constructor(){afterRenderEffect(()=>{const target=this.geometry(),view=this.host.ownerDocument.defaultView;if(!view)return;
  if(!this.initialized){this.initialized=true;for(const key of keys)this.axes[key]={value:target[key],target:target[key],velocity:0};this.paint();return}
  if(keys.every(key=>this.axes[key].target===target[key]))return;
  const now=view.performance.now();if(this.frame){this.step(Math.max(0,(now-this.last)/1000));this.last=now}
  for(const key of keys){const axis=this.axes[key];if(axis.target===target[key])continue;axis.target=target[key];const granular=Math.abs(axis.target-axis.value)<5;axis.restDelta=granular?.005:.5;axis.restSpeed=granular?.01:2}
  if(!this.frame){this.last=now;this.frame=view.requestAnimationFrame(this.tick)}
 });inject(DestroyRef).onDestroy(()=>this.host.ownerDocument.defaultView?.cancelAnimationFrame(this.frame))}
 private step(dt:number):boolean{let running=false;for(const key of keys)running=stepBatch20Spring(this.axes[key],dt,200,28,.85)||running;return running}
 private paint():void{const a=this.axes,parts:string[]=[];if(a.x.value)parts.push('translateX('+a.x.value+'px)');if(a.y.value)parts.push('translateY('+a.y.value+'px)');if(a.z.value)parts.push('translateZ('+a.z.value+'px)');if(a.scale.value!==1)parts.push('scale('+a.scale.value+')');if(a.rotateY.value)parts.push('rotateY('+a.rotateY.value+'deg)');this.host.style.transform=parts.join(' ')||'none';this.host.style.opacity=String(a.opacity.value);this.host.style.filter='blur('+a.blur.value+'px)'}
 private tick=(now:number):void=>{const running=this.step(Math.max(0,(now-this.last)/1000));this.last=now;this.paint();this.frame=running?this.host.ownerDocument.defaultView!.requestAnimationFrame(this.tick):0};
}

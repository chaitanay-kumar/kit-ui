import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
/** Independent numerical axes, preserving velocity when a source spring reverses. */
export class Batch39Spring {
 private axes:Record<string,Batch20Spring>={};private frame=0;private last=0;private disposed=false;
 constructor(private view:Window,initial:Record<string,number>,private stiffness:number,private damping:number,private mass:number,private paint:(value:Record<string,number>)=>void,private done?:()=>void){for(const [key,value]of Object.entries(initial))this.axes[key]={value,target:value,velocity:0};this.write()}
 to(target:Record<string,number>):void{if(this.disposed||Object.entries(target).every(([key,value])=>this.axes[key].target===value))return;const now=this.view.performance.now();if(this.frame)this.step(Math.max(0,(now-this.last)/1000));this.last=now;for(const [key,value]of Object.entries(target)){const axis=this.axes[key];if(axis.target!==value){axis.target=value;const granular=Math.abs(value-axis.value)<5;axis.restDelta=granular?.005:.5;axis.restSpeed=granular?.01:2}}if(!this.frame)this.frame=this.view.requestAnimationFrame(this.tick)}
 private step(dt:number):boolean{let running=false;for(const axis of Object.values(this.axes))running=stepBatch20Spring(axis,dt,this.stiffness,this.damping,this.mass)||running;return running}
 private write():void{this.paint(Object.fromEntries(Object.entries(this.axes).map(([key,axis])=>[key,axis.value])))}
 private tick=(now:number):void=>{if(this.disposed)return;const running=this.step(Math.max(0,(now-this.last)/1000));this.last=now;this.write();this.frame=running?this.view.requestAnimationFrame(this.tick):0;if(!running)this.done?.()};
 destroy():void{this.disposed=true;if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0}
}
@Directive({selector:'[kitBatchHover]',standalone:true})
export class BatchHoverDirective {
 readonly kind=input<'item'|'action'>('item',{alias:'kitBatchHover'});private host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;private hover=false;private pressed=false;private hoverPressed=false;private deferredLeave=false;private keyboardPressed=false;
 private target=()=>this.spring?.to({scale:this.pressed?(this.kind()==='item'?.995:.97):this.hover?(this.kind()==='item'?1.005:1.02):1});
 private primary=(event:PointerEvent)=>event.pointerType==='mouse'?event.button<=0:event.isPrimary!==false;
 private enter=(event:PointerEvent)=>{if(event.pointerType==='touch')return;this.deferredLeave=false;this.hover=true;this.target()};
 private leave=(event:PointerEvent)=>{if(event.pointerType==='touch')return;if(this.hoverPressed){this.deferredLeave=true;return}this.hover=false;this.target()};
 private down=(event:PointerEvent)=>{this.hoverPressed=true;if(!this.primary(event))return;this.pressed=true;this.target()};
 private up=(event?:PointerEvent)=>{this.hoverPressed=false;if(this.deferredLeave){this.deferredLeave=false;this.hover=false}if(!event||this.primary(event))this.pressed=false;this.target()};
 private keydown=(event:KeyboardEvent)=>{if(event.target!==this.host||event.key!=='Enter'||event.repeat)return;this.keyboardPressed=true;this.pressed=true;this.target()};
 private keyup=(event:KeyboardEvent)=>{if(event.key==='Enter'&&this.keyboardPressed){this.keyboardPressed=false;this.up()}};
 private blur=()=>{if(this.keyboardPressed){this.keyboardPressed=false;this.up()}};
 constructor(){afterRenderEffect(()=>{const view=this.host.ownerDocument.defaultView;if(!view||this.spring)return;this.spring=new Batch39Spring(view,{scale:1},this.kind()==='item'?380:400,this.kind()==='item'?30:25,this.kind()==='item'?.5:1,value=>this.host.style.transform=value.scale===1?'none':'scale('+value.scale+')');this.host.addEventListener('pointerenter',this.enter);this.host.addEventListener('pointerleave',this.leave);this.host.addEventListener('pointerdown',this.down);this.host.addEventListener('keydown',this.keydown);this.host.addEventListener('keyup',this.keyup);this.host.addEventListener('blur',this.blur);view.addEventListener('pointerup',this.up,true);view.addEventListener('pointercancel',this.up,true)});inject(DestroyRef).onDestroy(()=>{this.spring?.destroy();this.host.removeEventListener('pointerenter',this.enter);this.host.removeEventListener('pointerleave',this.leave);this.host.removeEventListener('pointerdown',this.down);this.host.removeEventListener('keydown',this.keydown);this.host.removeEventListener('keyup',this.keyup);this.host.removeEventListener('blur',this.blur);const view=this.host.ownerDocument.defaultView;view?.removeEventListener('pointerup',this.up,true);view?.removeEventListener('pointercancel',this.up,true)})}
}

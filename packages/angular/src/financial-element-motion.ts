import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {Batch39Spring} from './batch39-motion';
function cubic(x:number,a:number,b:number,c:number,d:number):number{let low=0,high=1,t=x;for(let index=0;index<24;index++){t=(low+high)/2;const value=3*(1-t)**2*t*a+3*(1-t)*t*t*c+t**3;if(value<x)low=t;else high=t}return 3*(1-t)**2*t*b+3*(1-t)*t*t*d+t**3}
/** Each key corresponds to the source motion element's React key. */
@Directive({selector:'[kitFinancialTween]',standalone:true})
export class KitFinancialTweenDirective{
 readonly mode=input.required<'area'|'path'|'change'|'pulse'>({alias:'kitFinancialTween'});readonly motionKey=input('');readonly reduced=input(false);
 private node=inject<ElementRef<HTMLElement|SVGElement>>(ElementRef).nativeElement;private view=this.node.ownerDocument.defaultView;private frame=0;private started=0;private seen:string|undefined;private kind:string|undefined;private duration=0;private disposed=false;
 private paint(progress:number):void{const mode=this.mode(),p=mode==='path'?cubic(progress,.16,1,.3,1):cubic(progress,0,0,.58,1);
  if(mode==='pulse'){this.node.style.opacity=String(.9*(1-p));this.node.style.transform='scale('+(.7+p)+')'}
  else{this.node.style.opacity=String(mode==='path'?.6+.4*p:mode==='change'?.4+.6*p:p);if(mode==='path'){this.node.setAttribute('pathLength','1');this.node.setAttribute('stroke-dashoffset','0px');this.node.setAttribute('stroke-dasharray',(.3+.7*p)+'px 1px')}}
 }
 private tick=(now:number)=>{if(this.disposed||!this.view)return;const elapsed=Math.max(0,now-this.started),pulse=this.mode()==='pulse',progress=pulse?(elapsed%1000===0&&elapsed>0?1:elapsed%1000/1000):Math.min(1,elapsed/this.duration);this.paint(progress);this.frame=pulse||progress<1?this.view.requestAnimationFrame(this.tick):0};
 constructor(){afterRenderEffect(()=>{const key=this.motionKey(),mode=this.mode(),reduced=this.reduced(),view=this.view;if(!view||key===this.seen&&mode===this.kind)return;const first=this.seen===undefined;this.seen=key;this.kind=mode;if(this.frame)view.cancelAnimationFrame(this.frame);this.frame=0;this.started=view.performance.now();this.duration=mode==='path'?500:mode==='area'?400:180;
  if(mode==='pulse')this.node.style.transformOrigin=this.node.getAttribute('cx')+'px '+this.node.getAttribute('cy')+'px';
  if(mode!=='pulse'&&(reduced||first&&mode==='change')){this.paint(1);return}this.paint(0);this.frame=view.requestAnimationFrame(this.tick);
 });inject(DestroyRef).onDestroy(()=>{this.disposed=true;if(this.frame)this.view?.cancelAnimationFrame(this.frame)})}
}
@Directive({selector:'[kitFinancialPoint]',standalone:true})
export class KitFinancialPointDirective{
 readonly motionKey=input('');readonly reduced=input(false);private node=inject<ElementRef<SVGElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;private seen:string|undefined;
 constructor(){afterRenderEffect(()=>{const key=this.motionKey(),reduced=this.reduced(),view=this.node.ownerDocument.defaultView;if(!view||key===this.seen)return;this.seen=key;this.spring?.destroy();this.node.style.transformOrigin=this.node.getAttribute('cx')+'px '+this.node.getAttribute('cy')+'px';this.spring=new Batch39Spring(view,{opacity:reduced?1:0,scale:reduced?1:.5},380,30,.5,value=>{this.node.style.opacity=String(value.opacity);this.node.style.transform=value.scale===1?'none':'scale('+value.scale+')'});this.spring.to({opacity:1,scale:1})});inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}

import {Directive,DestroyRef,ElementRef,ChangeDetectorRef,afterRenderEffect,inject,input,output} from '@angular/core';
import {AIResponseSpring} from './ai-response-spring';
import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';

/** Source and tool expansion remain animated under reduced motion in React. */
@Directive({selector:'[kitAiPresence]',standalone:true})
export class KitAiResponsePresenceDirective{
 readonly leaving=input(false,{alias:'kitAiPresence'});readonly exited=output<void>();
 private readonly node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private readonly changes=inject(ChangeDetectorRef);private spring:AIResponseSpring|undefined;
 constructor(){afterRenderEffect(()=>{const leaving=this.leaving(),view=this.node.ownerDocument.defaultView;if(!view)return;const previous=this.node.style.height;this.node.style.height='auto';const height=this.node.getBoundingClientRect().height;this.node.style.height=previous;
  this.spring??=new AIResponseSpring(view,{opacity:0,height:0},300,32,.6,value=>{this.node.style.opacity=String(value.opacity);this.node.style.height=value.height+'px'},()=>{if(this.leaving()){this.exited.emit();this.changes.detectChanges()}else this.node.style.height='auto'});
  this.spring.to({opacity:leaving?0:1,height:leaving?0:height});
 });inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}

@Directive({selector:'[kitAiPress]',standalone:true})
export class KitAiResponsePressDirective{
 readonly scale=input(.96,{alias:'kitAiPress'});
 private readonly node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private view=this.node.ownerDocument.defaultView;
 private axis:Batch20Spring={value:1,target:1,velocity:0,restDelta:.005,restSpeed:10};private frame=0;private last=0;private pressed=false;private keyboard=false;private disposed=false;
 private painted=1;private previousPainted=1;private paintedAt=this.view?.performance.now()??0;private previousPaintedAt:number|undefined;
 private move(target:number):void{const view=this.view;if(!view)return;if(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches){this.axis={...this.axis,value:1,target:1,velocity:0};this.node.style.transform='none';if(this.frame)view.cancelAnimationFrame(this.frame);this.frame=0;return}const now=view.performance.now();if(this.frame)stepBatch20Spring(this.axis,Math.max(0,(now-this.last)/1000),550,30,1);const elapsed=this.previousPaintedAt===undefined?0:Math.min(30,this.paintedAt-this.previousPaintedAt);this.axis.velocity=elapsed>0&&now-this.paintedAt<=30?(this.painted-this.previousPainted)/(elapsed/1000):0;this.axis.target=target;this.last=now;if(!this.frame)this.frame=view.requestAnimationFrame(this.tick)}
 private down=(event:PointerEvent)=>{if(event.pointerType==='mouse'&&event.button!==0||event.isPrimary===false||this.node.hasAttribute('disabled'))return;this.pressed=true;this.move(this.scale())};
 private up=()=>{if(!this.pressed)return;this.pressed=false;this.keyboard=false;this.move(1)};
 private keydown=(event:KeyboardEvent)=>{if(event.key==='Enter'&&!event.repeat&&!this.node.hasAttribute('disabled')){this.keyboard=true;this.pressed=true;this.move(this.scale())}};
 private keyup=(event:KeyboardEvent)=>{if(event.key==='Enter'&&this.keyboard)this.up()};
 private blur=()=>{if(this.keyboard)this.up()};
 private tick=(now:number)=>{if(this.disposed||!this.view)return;const moving=stepBatch20Spring(this.axis,Math.max(0,(now-this.last)/1000),550,30,1);this.last=now;if(now!==this.paintedAt){this.previousPainted=this.painted;this.previousPaintedAt=this.paintedAt}this.painted=this.axis.value;this.paintedAt=now;this.node.style.transform=this.axis.value===1?'none':'scale('+this.axis.value+')';this.frame=moving?this.view.requestAnimationFrame(this.tick):0};
 constructor(){this.node.addEventListener('pointerdown',this.down);this.node.addEventListener('keydown',this.keydown);this.node.addEventListener('keyup',this.keyup);this.node.addEventListener('blur',this.blur);this.view?.addEventListener('pointerup',this.up);this.view?.addEventListener('pointercancel',this.up);inject(DestroyRef).onDestroy(()=>{this.disposed=true;if(this.frame)this.view?.cancelAnimationFrame(this.frame);this.node.removeEventListener('pointerdown',this.down);this.node.removeEventListener('keydown',this.keydown);this.node.removeEventListener('keyup',this.keyup);this.node.removeEventListener('blur',this.blur);this.view?.removeEventListener('pointerup',this.up);this.view?.removeEventListener('pointercancel',this.up)})}
}

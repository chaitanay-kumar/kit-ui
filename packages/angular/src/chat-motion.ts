import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input,output} from '@angular/core';
import {Batch39Spring} from './batch39-motion';
import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';

@Directive({selector:'[kitChatEnter]',standalone:true})
export class KitChatEnterDirective{
 private readonly node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;private initialized=false;private frame=0;
 constructor(){afterRenderEffect(()=>{const view=this.node.ownerDocument.defaultView;if(!view||this.initialized)return;this.initialized=true;if(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches){this.node.style.opacity='0';this.node.style.transform='translateY(4px)';this.frame=view.requestAnimationFrame(()=>{this.frame=0;this.node.style.opacity='1';this.node.style.transform='none'});return}this.spring=new Batch39Spring(view,{opacity:0,y:4},320,34,.7,value=>{this.node.style.opacity=String(value.opacity);this.node.style.transform=value.y===0?'none':'translateY('+value.y+'px)'});this.spring.to({opacity:1,y:0})});inject(DestroyRef).onDestroy(()=>{this.spring?.destroy();if(this.frame)this.node.ownerDocument.defaultView?.cancelAnimationFrame(this.frame)})}
}

/** Attachment presence deliberately follows the source's unconditional spring. */
@Directive({selector:'[kitChatPresence]',standalone:true})
export class KitChatPresenceDirective{
 readonly leaving=input(false,{alias:'kitChatPresence'});readonly contentKey=input<unknown>();readonly exited=output<void>();
 private readonly node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;
 constructor(){afterRenderEffect(()=>{const leaving=this.leaving();this.contentKey();const view=this.node.ownerDocument.defaultView;if(!view)return;const previous=this.node.style.height;this.node.style.height='auto';const height=this.node.getBoundingClientRect().height;this.node.style.height=previous;
  this.spring??=new Batch39Spring(view,{opacity:0,height:0},320,34,.7,value=>{this.node.style.opacity=String(value.opacity);this.node.style.height=value.height+'px'},()=>{if(this.leaving())this.exited.emit();else this.node.style.height='auto'});
  this.spring.to({opacity:leaving?0:1,height:leaving?0:height});
 });inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}

/** Motion's default scale transition is 550/30/1 with explicit restSpeed 10. */
@Directive({selector:'[kitChatPress]',standalone:true})
export class KitChatPressDirective{
 private readonly node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private view=this.node.ownerDocument.defaultView;
 private axis:Batch20Spring={value:1,target:1,velocity:0,restDelta:.005,restSpeed:10};private frame=0;private last=0;private pressed=false;private keyboard=false;private disposed=false;
 private move(target:number):void{const view=this.view;if(!view)return;if(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches){this.axis={...this.axis,value:1,target:1,velocity:0};this.node.style.transform='none';if(this.frame)view.cancelAnimationFrame(this.frame);this.frame=0;return}const now=view.performance.now();if(this.frame)stepBatch20Spring(this.axis,Math.max(0,(now-this.last)/1000),550,30,1);this.axis.target=target;this.last=now;if(!this.frame)this.frame=view.requestAnimationFrame(this.tick)}
 private down=(event:PointerEvent)=>{if(event.pointerType==='mouse'&&event.button!==0||event.isPrimary===false||this.node.hasAttribute('disabled'))return;this.pressed=true;this.move(.94)};
 private up=()=>{if(!this.pressed)return;this.pressed=false;this.keyboard=false;this.move(1)};
 private keydown=(event:KeyboardEvent)=>{if(event.key==='Enter'&&!event.repeat&&!this.node.hasAttribute('disabled')){this.keyboard=true;this.pressed=true;this.move(.94)}};
 private keyup=(event:KeyboardEvent)=>{if(event.key==='Enter'&&this.keyboard)this.up()};
 private blur=()=>{if(this.keyboard)this.up()};
 private tick=(now:number)=>{if(this.disposed||!this.view)return;const moving=stepBatch20Spring(this.axis,Math.max(0,(now-this.last)/1000),550,30,1);this.last=now;this.node.style.transform=this.axis.value===1?'none':'scale('+this.axis.value+')';this.frame=moving?this.view.requestAnimationFrame(this.tick):0};
 constructor(){this.node.addEventListener('pointerdown',this.down);this.node.addEventListener('keydown',this.keydown);this.node.addEventListener('keyup',this.keyup);this.node.addEventListener('blur',this.blur);this.view?.addEventListener('pointerup',this.up);this.view?.addEventListener('pointercancel',this.up);inject(DestroyRef).onDestroy(()=>{this.disposed=true;if(this.frame)this.view?.cancelAnimationFrame(this.frame);this.node.removeEventListener('pointerdown',this.down);this.node.removeEventListener('keydown',this.keydown);this.node.removeEventListener('keyup',this.keyup);this.node.removeEventListener('blur',this.blur);this.view?.removeEventListener('pointerup',this.up);this.view?.removeEventListener('pointercancel',this.up)})}
}

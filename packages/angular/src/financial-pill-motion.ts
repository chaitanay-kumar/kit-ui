import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input} from '@angular/core';
import {Batch39Spring} from './batch39-motion';
type Box={x:number;y:number;width:number;height:number};
type Lead={node:HTMLElement;rect:Box;target:Box};
const groups=new WeakMap<Document,Map<string,Lead>>();
/** Shared timeRangePill projection remains animated under the source reduced-motion setting. */
@Directive({selector:'[kitFinancialPill]',standalone:true})
export class KitFinancialPillDirective{
 readonly name=input('',{alias:'kitFinancialPill'});readonly layoutKey=input<unknown>();private node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;private registered:string|undefined;private previousKey:unknown;
 constructor(){afterRenderEffect(()=>{const name=this.name(),key=this.layoutKey(),document=this.node.ownerDocument,view=document.defaultView;if(!view||this.registered===name&&this.previousKey===key)return;this.registered=name;this.previousKey=key;let group=groups.get(document);if(!group){group=new Map();groups.set(document,group)}const previous=group.get(name),transform=this.node.style.transform;this.node.style.transform='none';const rect=this.node.getBoundingClientRect(),target={x:rect.x,y:rect.y,width:rect.width,height:rect.height};this.node.style.transform=transform;if(previous?.node===this.node&&Object.keys(target).every(key=>Math.abs(previous.target[key as keyof Box]-target[key as keyof Box])<.01))return;const lead:Lead={node:this.node,rect:target,target};group.set(name,lead);
  if(previous){this.spring?.destroy();const from=previous.rect;this.node.style.transformOrigin='50% 50%';this.spring=new Batch39Spring(view,{p:0},380,30,.5,value=>{const p=value.p/1000,box={x:from.x+(target.x-from.x)*p,y:from.y+(target.y-from.y)*p,width:from.width+(target.width-from.width)*p,height:from.height+(target.height-from.height)*p};lead.rect=box;const x=box.x+box.width/2-target.x-target.width/2,y=box.y+box.height/2-target.y-target.height/2,sx=target.width?box.width/target.width:1,sy=target.height?box.height/target.height:1;this.node.style.transform=p===1?'none':'translate('+x+'px,'+y+'px) scale('+sx+','+sy+')'});this.spring.to({p:1000})}
 });inject(DestroyRef).onDestroy(()=>{this.spring?.destroy();const document=this.node.ownerDocument,group=groups.get(document),name=this.registered;if(!group||name===undefined)return;const lead=group.get(name);if(lead?.node===this.node)queueMicrotask(()=>{if(group.get(name)===lead)group.delete(name)})})}
}

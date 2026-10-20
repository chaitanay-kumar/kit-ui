import {Directive,DestroyRef,ElementRef,afterRenderEffect,inject,input,output} from '@angular/core';
import {Batch39Spring} from './batch39-motion';
/** The source form controls use springSnappy without a reduced-motion branch. */
@Directive({selector:'[kitFormMotion]',standalone:true})
export class KitFormMotionDirective{
 readonly target=input<Record<string,number>>({}, {alias:'kitFormMotion'});readonly initial=input<Record<string,number>|undefined>();
 private node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;
 constructor(){afterRenderEffect(()=>{const target=this.target(),view=this.node.ownerDocument.defaultView;if(!view)return;if(!this.spring)this.spring=new Batch39Spring(view,this.initial()??target,380,30,.5,value=>{if(value.opacity!==undefined)this.node.style.opacity=String(value.opacity);const transforms=[];if(value.x!==undefined)transforms.push(`translateX(${value.x}px)`);if(value.y!==undefined)transforms.push(`translateY(${value.y}px)`);if(value.scale!==undefined)transforms.push(`scale(${value.scale})`);this.node.style.transform=transforms.join(' ')});this.spring.to(target)});inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}
@Directive({selector:'[kitFormPresence]',standalone:true})
export class KitFormPresenceDirective{
 readonly leaving=input(false,{alias:'kitFormPresence'});readonly offset=input(-4);readonly exited=output<void>();private node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;private value={height:0,y:-4,opacity:0};private auto=false;private mounted=false;
 constructor(){afterRenderEffect(()=>{const leaving=this.leaving(),offset=this.offset(),view=this.node.ownerDocument.defaultView;if(!view)return;if(!this.mounted){this.mounted=true;this.value.y=offset}if(this.auto){this.value.height=this.node.getBoundingClientRect().height;this.spring?.destroy();this.spring=undefined;this.auto=false}if(!this.spring)this.spring=new Batch39Spring(view,this.value,380,30,.5,value=>{this.value={height:value.height,y:value.y,opacity:value.opacity};this.node.style.height=Math.max(0,value.height)+'px';this.node.style.opacity=String(value.opacity);this.node.style.transform=`translateY(${value.y}px)`},()=>{if(this.leaving())this.exited.emit();else{this.auto=true;this.node.style.height='auto'}});this.spring.to({height:leaving?0:(this.node.firstElementChild?.getBoundingClientRect().height??this.node.scrollHeight),y:leaving?offset:0,opacity:leaving?0:1})});inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}
const radioGroups=new WeakMap<Document,Map<string,{node:HTMLElement;rect:DOMRect}>>();
/** Corresponds to the source's document-wide radio-dot-${name} layoutId. */
@Directive({selector:'[kitFormRadioMotion]',standalone:true})
export class KitFormRadioMotionDirective{
 readonly name=input('',{alias:'kitFormRadioMotion'});private node=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private spring:Batch39Spring|undefined;private registeredName:string|undefined;
 constructor(){afterRenderEffect(()=>{const name=this.name(),document=this.node.ownerDocument,view=document.defaultView;if(!view||this.registeredName===name)return;let group=radioGroups.get(document);if(!group){group=new Map();radioGroups.set(document,group)}const previous=group.get(name),rect=this.node.getBoundingClientRect();this.registeredName=name;group.set(name,{node:this.node,rect});if(previous&&previous.node!==this.node){this.spring?.destroy();this.spring=new Batch39Spring(view,{x:previous.rect.x-rect.x,y:previous.rect.y-rect.y},380,30,.5,value=>this.node.style.transform=`translate(${value.x}px,${value.y}px)`);this.spring.to({x:0,y:0})}});inject(DestroyRef).onDestroy(()=>{this.spring?.destroy();const group=radioGroups.get(this.node.ownerDocument),name=this.registeredName;if(name===undefined||!group)return;const entry=group.get(name);if(entry?.node===this.node){const rect=this.node.getBoundingClientRect();if(rect.width)entry.rect=rect;queueMicrotask(()=>{if(group.get(name)===entry)group.delete(name)})}})}
}

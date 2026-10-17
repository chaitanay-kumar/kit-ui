import {Component,DestroyRef,ElementRef,afterEveryRender,afterRenderEffect,inject,input,signal,viewChild} from '@angular/core';
import {Batch39Spring} from './batch39-motion';import {Batch39IconComponent} from './batch39-icons';
@Component({selector:'kit-batch-check',standalone:true,imports:[Batch39IconComponent],host:{style:'display:contents'},template:`@if(present()){<div #mark class="k-batch-mark"><svg kitBatch39Icon icon="check"/></div>}`})
export class BatchCheckComponent {
 readonly checked=input(false);readonly present=signal(false);readonly mark=viewChild<ElementRef<HTMLElement>>('mark');private initial=false;private first=true;private node:HTMLElement|undefined;private spring:Batch39Spring|undefined;
 ngOnInit():void{this.initial=this.checked();this.present.set(this.initial)}
 constructor(){afterRenderEffect(()=>{if(this.checked())this.present.set(true)});afterEveryRender(()=>{const node=this.mark()?.nativeElement,view=node?.ownerDocument.defaultView;if(node!==this.node){this.spring?.destroy();this.node=node;this.spring=undefined;if(node&&view){const direct=this.first&&this.initial;this.first=false;this.spring=new Batch39Spring(view,{scale:direct?1:.4,opacity:direct?1:0},500,30,1,value=>{node.style.transform=value.scale===1?'none':'scale('+value.scale+')';node.style.opacity=String(value.opacity)},()=>{if(!this.checked())this.present.set(false)})}}this.spring?.to({scale:this.checked()?1:.4,opacity:this.checked()?1:0})});inject(DestroyRef).onDestroy(()=>this.spring?.destroy())}
}
export class BatchTrayPresence {
 private spring:Batch39Spring|undefined;private node:HTMLElement|undefined;
 constructor(private remove:()=>void,private visible:()=>boolean){}
 rendered(node:HTMLElement|undefined,visible:boolean):void{if(node!==this.node){this.spring?.destroy();this.node=node;this.spring=undefined;const view=node?.ownerDocument.defaultView;if(node&&view)this.spring=new Batch39Spring(view,{opacity:0,y:24,scale:.96},380,30,.5,value=>{node.style.opacity=String(value.opacity);node.style.transform=value.y===0&&value.scale===1?'none':'translateY('+value.y+'px) scale('+value.scale+')'},()=>{if(!this.visible())this.remove()})}this.spring?.to(visible?{opacity:1,y:0,scale:1}:{opacity:0,y:24,scale:.96})}
 destroy():void{this.spring?.destroy()}
}

import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
/** Motion maps CSS-unit springs through 0..100; velocity expires after 30ms and differences clamp to a 30ms window. */
class UnitSpring{
 value:number;target:number;private origin:number;private velocity=0;private updated=0;private spring:Batch20Spring;
 constructor(value:number){this.value=this.target=this.origin=value;this.spring={value:100,target:100,velocity:0,restDelta:.5,restSpeed:2}}
 set(target:number,instant:boolean,now:number):void{if(instant){this.value=this.target=this.origin=target;this.velocity=0;this.spring={value:100,target:100,velocity:0,restDelta:.5,restSpeed:2};return}if(this.target===target)return;this.origin=this.value;this.target=target;this.spring={value:0,target:100,velocity:now-this.updated>30?0:this.velocity,restDelta:.5,restSpeed:2}}
 step(dt:number,now:number):boolean{if(this.value===this.target&&this.spring.value===100)return false;const previous=this.value,active=stepBatch20Spring(this.spring,dt,150,24,.8);this.value=this.origin+(this.target-this.origin)*this.spring.value/100;this.velocity=dt>0?(this.value-previous)/Math.min(dt,.03):0;this.updated=now;return active}
}
export class StorySlotMotion{
 private width:UnitSpring;private margin:UnitSpring;private opacity:Batch20Spring;private scale:Batch20Spring={value:1,target:1,velocity:0,restDelta:.005,restSpeed:.01};private frame=0;private last=0;private window:Window;
 constructor(private node:HTMLElement,width:number,margin:number,opacity:number){this.window=node.ownerDocument.defaultView!;this.width=new UnitSpring(width);this.margin=new UnitSpring(margin);this.opacity={value:opacity,target:opacity,velocity:0,restDelta:.005,restSpeed:.01};this.write()}
 set(width:number,margin:number,opacity:number,hover:boolean,reduced:boolean):void{const now=this.window.performance.now();this.width.set(width,reduced,now);this.margin.set(margin,reduced,now);this.opacity.target=opacity;this.scale.target=hover?1.02:1;if(reduced){this.opacity.value=opacity;this.opacity.velocity=0;this.scale.value=this.scale.target;this.scale.velocity=0;this.write();this.window.cancelAnimationFrame(this.frame);this.frame=0;return}if(!this.frame){this.last=this.window.performance.now();this.frame=this.window.requestAnimationFrame(this.tick)}}
 private tick=(now:number):void=>{this.frame=0;const dt=Math.max(0,now-this.last)/1000;this.last=now;const width=this.width.step(dt,now),margin=this.margin.step(dt,now),opacity=stepBatch20Spring(this.opacity,dt,150,24,.8),scale=stepBatch20Spring(this.scale,dt,150,24,.8);this.write();if(width||margin||opacity||scale)this.frame=this.window.requestAnimationFrame(this.tick)};
 private write():void{this.node.style.width=this.width.value+'%';this.node.style.marginRight=this.margin.value+'rem';this.node.style.opacity=String(this.opacity.value);this.node.style.transform=this.scale.value===1?'none':'scale('+this.scale.value+')'}
 destroy():void{this.window.cancelAnimationFrame(this.frame);this.frame=0}
}
function easeOut(x:number):number{let low=0,high=1,t=x;for(let index=0;index<20;index++){t=(low+high)/2;const px=3*(1-t)*t*t*.58+t*t*t;if(px<x)low=t;else high=t}return 3*(1-t)*t*t+t*t*t}
export class StoryContentMotion{
 private opacity:number;private y:number;private target:boolean|undefined;private frame=0;private start=0;private originOpacity=0;private originY=0;private reduced:boolean;private window:Window;private done:(()=>void)|undefined;
 constructor(private node:HTMLElement,reduced:boolean){this.window=node.ownerDocument.defaultView!;this.reduced=reduced;this.opacity=reduced?1:0;this.y=reduced?0:14;this.write()}
 set(visible:boolean,done?:()=>void):void{this.done=done;if(this.target===visible)return;this.target=visible;this.originOpacity=this.opacity;this.originY=this.y;this.start=this.window.performance.now()+50;if(!this.frame)this.frame=this.window.requestAnimationFrame(this.tick)}
 private tick=(now:number):void=>{this.frame=0;const t=Math.max(0,Math.min(1,(now-this.start)/280)),e=easeOut(t);this.opacity=this.originOpacity+((this.target?1:0)-this.originOpacity)*e;const endY=this.target||this.reduced?0:6;this.y=this.originY+(endY-this.originY)*e;this.write();if(t<1)this.frame=this.window.requestAnimationFrame(this.tick);else{const done=this.done;this.done=undefined;done?.()}};
 private write():void{this.node.style.opacity=String(this.opacity);this.node.style.transform=this.y===0?'none':'translateY('+this.y+'px)'}destroy():void{this.window.cancelAnimationFrame(this.frame);this.frame=0;this.done=undefined}
}

import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
/** Native counterpart to source springSnappy, preserving velocity on interruption. */
export class VelocityToastMotion{
 private axes:Batch20Spring[];private frame=0;private last=0;private done:(()=>void)|undefined;private window:Window;
 constructor(node:HTMLElement,top:boolean,private paint:(values:number[])=>void){this.window=node.ownerDocument.defaultView!;this.axes=[0,top?-22:22,.94].map(value=>({value,target:value,velocity:0}));paint(this.axes.map(axis=>axis.value))}
 set(visible:boolean,top:boolean,done?:()=>void):void{const values=visible?[1,0,1]:[0,top?-12:12,.96];this.done=done;this.axes.forEach((axis,index)=>{const granular=Math.abs(values[index]-axis.value)<5;axis.target=values[index];axis.restDelta=granular?.005:.5;axis.restSpeed=granular?.01:2});if(!this.frame){this.last=this.window.performance.now();this.frame=this.window.requestAnimationFrame(this.tick)}}
 private tick=(now:number)=>{let moving=false;for(const axis of this.axes)moving=stepBatch20Spring(axis,(now-this.last)/1000,380,30,.5)||moving;this.last=now;this.paint(this.axes.map(axis=>axis.value));this.frame=moving?this.window.requestAnimationFrame(this.tick):0;if(!moving){const done=this.done;this.done=undefined;done?.()}};
 destroy():void{this.window.cancelAnimationFrame(this.frame);this.frame=0;this.done=undefined}
}

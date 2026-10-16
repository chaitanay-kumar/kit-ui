import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
export type GooeyTarget={value:number;stiffness:number;damping:number;mass?:number;delay?:number};
/** Independent axes preserve velocity when an open/close animation is interrupted. */
export class GooeyMenuMotion {
 private axes:Batch20Spring[];private targets:GooeyTarget[]=[];private frame=0;private last=0;private start=0;private done:(()=>void)|undefined;private window:Window;
 constructor(node:Element,values:number[],private paint:(values:number[])=>void){this.window=node.ownerDocument.defaultView!;this.axes=values.map(value=>({value,target:value,velocity:0}));paint(values)}
 to(targets:GooeyTarget[],done?:()=>void):void{this.targets=targets;this.done=done;this.start=this.window.performance.now();this.axes.forEach((axis,index)=>{const distance=Math.abs(targets[index].value-axis.value);axis.target=targets[index].value;axis.restDelta=distance<5?.005:.5;axis.restSpeed=distance<5?.01:2});if(!this.frame){this.last=this.start;this.frame=this.window.requestAnimationFrame(this.tick)}}
 private tick=(now:number)=>{let moving=false;this.axes.forEach((axis,index)=>{const target=this.targets[index],begins=this.start+(target.delay??0)*1000;if(now<begins){moving=true;return}const dt=Math.max(0,now-Math.max(this.last,begins))/1000;moving=stepBatch20Spring(axis,dt,target.stiffness,target.damping,target.mass??1)||moving});this.last=now;this.paint(this.axes.map(axis=>axis.value));this.frame=moving?this.window.requestAnimationFrame(this.tick):0;if(!moving){const done=this.done;this.done=undefined;done?.()}};
 destroy():void{this.window.cancelAnimationFrame(this.frame);this.frame=0;this.done=undefined}
}

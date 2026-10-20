import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
interface MotionAxis{spring:Batch20Spring;updatedAt:number;previousAt?:number;previousValue:number;active:boolean}
/** Source MotionValue velocities use rendered-frame deltas, including final clamps. */
export class AIResponseSpring{
 private readonly axes:Record<string,MotionAxis>={};private frame=0;private last:number;private disposed=false;
 constructor(private view:Window,initial:Record<string,number>,private stiffness:number,private damping:number,private mass:number,private paint:(value:Record<string,number>)=>void,private done?:()=>void){this.last=view.performance.now();for(const[key,value]of Object.entries(initial))this.axes[key]={spring:{value,target:value,velocity:0},updatedAt:this.last,previousValue:value,active:false};this.write()}
 to(target:Record<string,number>):void{
  if(this.disposed||Object.entries(target).every(([key,value])=>this.axes[key].spring.target===value))return;
  const now=this.view.performance.now();if(this.frame&&now!==this.last)this.step(now);
  for(const[key,value]of Object.entries(target)){const axis=this.axes[key],spring=axis.spring;if(spring.target===value)continue;const delta=axis.previousAt===undefined?0:Math.min(30,axis.updatedAt-axis.previousAt);spring.velocity=delta>0&&now-axis.updatedAt<=30?(spring.value-axis.previousValue)/(delta/1000):0;spring.target=value;const granular=Math.abs(value-spring.value)<5;spring.restDelta=granular?.005:.5;spring.restSpeed=granular?.01:2;axis.active=true}
  this.last=now;if(!this.frame)this.frame=this.view.requestAnimationFrame(this.tick);
 }
 private step(now:number):boolean{let moving=false;const dt=Math.max(0,(now-this.last)/1000);for(const axis of Object.values(this.axes)){if(!axis.active)continue;const previous=axis.spring.value;axis.active=stepBatch20Spring(axis.spring,dt,this.stiffness,this.damping,this.mass);if(now!==axis.updatedAt){axis.previousValue=previous;axis.previousAt=axis.updatedAt}axis.updatedAt=now;moving=axis.active||moving}this.last=now;return moving}
 private write():void{this.paint(Object.fromEntries(Object.entries(this.axes).map(([key,axis])=>[key,axis.spring.value])))}
 private tick=(now:number)=>{if(this.disposed)return;const moving=this.step(now);this.write();this.frame=moving?this.view.requestAnimationFrame(this.tick):0;if(!moving)this.done?.()};
 destroy():void{this.disposed=true;if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;for(const axis of Object.values(this.axes))axis.active=false}
}

import type {CarSmokeAxis,CarSmokeMotion,CarSmokeTransition} from './car-smoke-timeline';
export type CarSmokeValues=Record<CarSmokeAxis,number>;
type Track={values:number[];times:number[];transition:CarSmokeTransition;started:number};
// Match Motion's bounded subdivision: tiny easing differences amplify over wheel rotations.
function cubic(x:number,curve:readonly number[]):number{if(x===0||x===1)return x;const polynomial=(t:number,a:number,b:number)=>(((1-3*b+3*a)*t+(3*b-6*a))*t+3*a)*t;let low=0,high=1,t=x;for(let index=0;index<12;index++){t=low+(high-low)/2;const delta=polynomial(t,curve[0],curve[2])-x;if(delta>0)high=t;else low=t;if(Math.abs(delta)<=.0000001)break}return polynomial(t,curve[1],curve[3])}
function eased(progress:number,ease:string|readonly number[]):number{if(typeof ease!=='string')return cubic(progress,ease);if(ease==='easeIn')return cubic(progress,[.42,0,1,1]);if(ease==='easeInOut')return cubic(progress,[.42,0,.58,1]);if(ease==='easeOut')return cubic(progress,[0,0,.58,1]);return progress}
/** Native keyframe tracks preserve source per-segment easing and delay semantics. */
export class CarSmokeKeyframes implements CarSmokeMotion{
 readonly values:CarSmokeValues={x:-1200,y:0,angle:0,steer:0,wheel:0,opacity:0};private tracks=new Map<CarSmokeAxis,Track>();private frame=0;private disposed=false;
 constructor(private view:Window,private paint:(values:CarSmokeValues)=>void){this.paint({...this.values})}
 set(axis:CarSmokeAxis,value:number):void{if(this.disposed)return;this.values[axis]=value;this.paint({...this.values})}
 animate(axis:CarSmokeAxis,value:number|number[],transition:CarSmokeTransition):void{if(this.disposed)return;const values=Array.isArray(value)?[...value]:[this.values[axis],value],times=transition.times?[...transition.times]:values.map((_,index)=>index/(values.length-1));this.tracks.set(axis,{values,times,transition,started:this.view.performance.now()});if(!this.frame)this.frame=this.view.requestAnimationFrame(this.tick)}
 private tick=(now:number)=>{if(this.disposed)return;this.frame=0;
  for(const[axis,track]of this.tracks){const elapsed=now-track.started-(track.transition.delay??0)*1000;if(elapsed<0)continue;const progress=track.transition.duration<=0?1:Math.min(1,elapsed/(track.transition.duration*1000));let index=0;while(index<track.times.length-2&&progress>=track.times[index+1])index++;const from=track.times[index],to=track.times[index+1],p=eased(to===from?1:(progress-from)/(to-from),track.transition.ease);this.values[axis]=track.values[index]+(track.values[index+1]-track.values[index])*p;if(progress===1){this.values[axis]=track.values.at(-1)!;this.tracks.delete(axis)}}
  this.paint({...this.values});if(!this.disposed&&this.tracks.size)this.frame=this.view.requestAnimationFrame(this.tick);
 };
 destroy():void{this.disposed=true;if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;this.tracks.clear()}
}

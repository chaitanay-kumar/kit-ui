import {carSmokeDimensions} from './car-smoke-engine';
export type CarSmokeAxis='x'|'y'|'angle'|'steer'|'wheel'|'opacity';
export type CarSmokeState='idle'|'carRunning'|'transitioning'|'complete';
export interface CarSmokeTransition{duration:number;delay?:number;times?:number[];ease:string|readonly number[]}
export interface CarSmokeMotion{set:(axis:CarSmokeAxis,value:number)=>void;animate:(axis:CarSmokeAxis,value:number|number[],transition:CarSmokeTransition)=>void;destroy:()=>void}
export interface CarSmokeClock{setTimeout:(callback:()=>void,duration:number)=>number;clearTimeout:(id:number)=>void}
export interface CarSmokeTimingOptions{direction:'left-to-right'|'right-to-left';carSize:'sm'|'md'|'lg';carDuration:number;carDelay:number;pageTransitionDelay:number;pageTransitionDuration:number;resetDelay:number;onTransitionComplete?:()=>void}
/** Independent source timers intentionally retain their original ordering and arithmetic. */
export class CarSmokeTimeline{
 state:CarSmokeState='idle';running=false;private disposed=false;private timers=new Set<number>();
 constructor(private options:()=>CarSmokeTimingOptions,private reduced:()=>boolean,private viewport:()=>number,private motion:CarSmokeMotion,private clock:CarSmokeClock,private stateChanged:(state:CarSmokeState)=>void,private startEngine:()=>void,private stopEngine:()=>void,private clearCanvas:()=>void,private report:(error:unknown)=>void){}
 private stateTo(state:CarSmokeState):void{this.state=state;this.stateChanged(state)}
 private later(callback:()=>void,duration:number):void{if(this.disposed)return;const id=this.clock.setTimeout(()=>{this.timers.delete(id);if(!this.disposed)callback()},duration);this.timers.add(id)}
 private clearTimers():void{for(const id of this.timers)this.clock.clearTimeout(id);this.timers.clear()}
 private complete(callback:(()=>void)|undefined):boolean{try{callback?.();return !this.disposed}catch(error){this.report(error);return false}}
 start():void{
  if(this.disposed||this.running)return;this.running=true;this.clearTimers();const options=this.options(),callback=options.onTransitionComplete;
  if(this.reduced()){
   this.stateTo('transitioning');this.motion.set('opacity',1);
   this.later(()=>{if(!this.complete(callback))return;this.stateTo('complete');this.later(()=>{this.motion.set('opacity',0);this.stateTo('idle');this.running=false},options.resetDelay)},options.pageTransitionDuration);return;
  }
  const {width,scale}=carSmokeDimensions(options.carSize,this.viewport()),ltr=options.direction==='left-to-right',start=ltr?-width-100:this.viewport()+100,end=ltr?this.viewport()+160:-width-160,travel=Math.abs(end-start),wheel=travel/(2*Math.PI*(14*scale))*360*(ltr?1:-1)*1.35;
  for(const[axis,value]of [['x',start],['y',0],['angle',0],['steer',0],['wheel',0],['opacity',0]] as const)this.motion.set(axis,value);
  this.stateTo('carRunning');this.startEngine();const duration=options.carDuration/1000,delay=options.carDelay/1000,ease=[.22,1,.36,1] as const,max=ltr?-6.5:6.5;
  this.motion.animate('x',end,{duration,ease,delay});
  this.motion.animate('angle',[0,0,max,max*.7,1.5*(ltr?1:-1),0],{duration,times:[0,.22,.48,.70,.88,1],ease:'easeInOut',delay});
  this.motion.animate('steer',[0,ltr?14:-14,ltr?18:-18,ltr?6:-6,0],{duration,times:[0,.26,.52,.74,1],ease:'easeInOut',delay});
  this.motion.animate('y',[0,-4*scale,3*scale,5*scale,-2*scale,0],{duration,times:[0,.2,.45,.68,.85,1],ease:'easeInOut',delay});
  this.motion.animate('wheel',wheel,{duration,ease,delay});
  this.later(()=>{this.stateTo('transitioning');this.motion.animate('opacity',1,{duration:options.pageTransitionDuration/1000,ease:[.16,1,.3,1]})},options.carDelay+options.carDuration*.65);
  const completion=options.carDelay+options.pageTransitionDelay+100;
  this.later(()=>{if(this.complete(callback))this.stateTo('complete')},completion);
  this.later(()=>{this.motion.animate('opacity',0,{duration:.35,ease:'easeIn'});this.later(()=>{this.stateTo('idle');this.running=false;this.stopEngine();this.clearCanvas()},350)},completion+options.resetDelay+options.pageTransitionDuration);
 }
 click(event:Pick<MouseEvent,'preventDefault'|'stopPropagation'>):void{event.preventDefault();event.stopPropagation();this.start()}
 key(event:Pick<KeyboardEvent,'key'|'preventDefault'>):void{if((event.key==='Enter'||event.key===' ')&&!this.running){event.preventDefault();this.start()}}
 destroy():void{if(this.disposed)return;this.disposed=true;this.clearTimers();this.motion.destroy();this.stopEngine();this.running=false}
}

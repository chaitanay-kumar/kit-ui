import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
import type {PullRefreshMotion} from './pull-refresh-session';

/** Raw gesture/animation value followed by the source's post-render 380/28/.65 spring. */
export class PullTranslateMotion implements PullRefreshMotion{
 private raw=0;private previousRaw=0;private rawAt=0;private previousRawAt=0;
 private rawAxis:Batch20Spring|undefined;private rawConfig=[300,26,.75];private rawLast=0;
 private smooth:Batch20Spring={value:0,target:0,velocity:0,restDelta:.001,restSpeed:.01};private smoothActive=false;
 private pending:number|undefined;private frame=0;private last=0;private disposed=false;
 constructor(private view:Window,private paint:(raw:number,smooth:number)=>void){this.rawAt=view.performance.now();this.paint(0,0)}
 private publish(value:number):void{if(value===this.raw)return;const now=this.view.performance.now();if(now!==this.rawAt){this.previousRaw=this.raw;this.previousRawAt=this.rawAt;this.rawAt=now}this.raw=value;this.pending=value;this.paint(this.raw,this.smooth.value);this.schedule()}
 set(value:number):void{if(!this.disposed)this.publish(value)}
 spring(value:number,stiffness:number,damping:number,mass:number):void{if(this.disposed)return;const now=this.view.performance.now(),elapsed=Math.min(30,this.rawAt-this.previousRawAt),velocity=now-this.rawAt<=30&&elapsed>0?(this.raw-this.previousRaw)/(elapsed/1000):0,granular=Math.abs(value-this.raw)<5;this.rawAxis={value:this.raw,target:value,velocity,restDelta:granular?.005:.5,restSpeed:granular?.01:2};this.rawConfig=[stiffness,damping,mass];this.rawLast=now;this.schedule()}
 private schedule():void{if(!this.frame){this.last=this.view.performance.now();this.frame=this.view.requestAnimationFrame(this.tick)}}
 private tick=(now:number)=>{if(this.disposed)return;this.frame=0;
  if(this.smoothActive)this.smoothActive=stepBatch20Spring(this.smooth,Math.max(0,(now-this.last)/1000),380,28,.65);
  if(this.rawAxis){const active=stepBatch20Spring(this.rawAxis,Math.max(0,(now-this.rawLast)/1000),this.rawConfig[0],this.rawConfig[1],this.rawConfig[2]);this.rawLast=now;this.publish(this.rawAxis.value);if(!active)this.rawAxis=undefined}
  this.paint(this.raw,this.smooth.value);
  if(this.pending!==undefined){this.smooth.target=this.pending;this.pending=undefined;this.smoothActive=this.smooth.value!==this.smooth.target;if(!this.smoothActive)this.smooth.velocity=0}
  this.last=now;if(this.rawAxis||this.smoothActive||this.pending!==undefined){if(!this.frame)this.frame=this.view.requestAnimationFrame(this.tick)}
 };
 destroy():void{this.disposed=true;if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;this.rawAxis=undefined;this.pending=undefined}
}

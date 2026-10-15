import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
import type {IndicatorProjection} from './animated-tabs-motion';
interface ProgressRect{x:number;y:number;width:number;height:number}
const box=(node:HTMLElement):ProgressRect=>{const rect=node.getBoundingClientRect();return {x:rect.x,y:rect.y,width:rect.width,height:rect.height}};
const identity=():IndicatorProjection=>({sx:1,sy:1,tx:0,ty:0});
/** World-space nav projection; selected pills compensate for this parent transform. */
export class ScrollProgressLayoutMotion {
 projection=identity();private base:ProgressRect|undefined;private before:ProgressRect|undefined;private from:ProgressRect|undefined;private progress:Batch20Spring={value:1,target:1,velocity:0,restDelta:.0005,restSpeed:.01};private frame=0;private last=0;
 constructor(readonly node:HTMLElement,private projected:()=>void){}
 capture():void{this.before=box(this.node)}
 rendered(measureChildren:()=>void):void{const current=this.before??box(this.node);this.node.style.transform='none';const next=box(this.node),changed=this.base&&(['x','y','width','height'] as const).some(key=>Math.abs(next[key]-this.base![key])>.001);this.base=next;this.projection=identity();if(changed){this.from=current;this.progress={value:0,target:1,velocity:0,restDelta:.0005,restSpeed:.01};this.last=performance.now();if(!this.frame)this.frame=requestAnimationFrame(this.tick)}measureChildren();this.paint();this.before=undefined}
 private paint():void{if(!this.base||!this.from){this.node.style.transform='none';this.projection=identity();this.projected();return}const base=this.base,p=this.progress.value,pose={x:this.from.x+(base.x-this.from.x)*p,y:this.from.y+(base.y-this.from.y)*p,width:this.from.width+(base.width-this.from.width)*p,height:this.from.height+(base.height-this.from.height)*p},sx=base.width?pose.width/base.width:1,sy=base.height?pose.height/base.height:1;this.node.style.transform=`translate(${pose.x-base.x+(pose.width-base.width)/2}px,${pose.y-base.y+(pose.height-base.height)/2}px) scale(${sx},${sy})`;this.projection={sx,sy,tx:pose.x-sx*base.x,ty:pose.y-sy*base.y};this.projected()}
 private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;const moving=stepBatch20Spring(this.progress,dt,220,32,1);if(!moving)this.from=undefined;this.paint();this.frame=moving?requestAnimationFrame(this.tick):0};
 destroy():void{cancelAnimationFrame(this.frame);this.frame=0;this.from=undefined;this.before=undefined;this.base=undefined;this.node.style.transform='none';this.projection=identity()}
}

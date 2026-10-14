import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
export class SelectionBasketMotion{
 private axes:Batch20Spring[]=[{value:24,target:0,velocity:0,restDelta:.5,restSpeed:2},{value:.95,target:1,velocity:0},{value:0,target:1,velocity:0}];private frame=0;private last=0;private visible=true;private exitStarted=0;private exitValues:number[]=[];
 constructor(readonly node:HTMLElement,private done:()=>void){this.paint();this.last=performance.now();this.frame=requestAnimationFrame(this.tick)}
 update(visible:boolean):void{if(this.visible===visible)return;this.visible=visible;this.last=performance.now();if(!visible){this.exitStarted=this.last;this.exitValues=this.axes.map(a=>a.value)}else{this.axes.forEach((a,i)=>{a.target=i===0?0:1})}if(!this.frame)this.frame=requestAnimationFrame(this.tick)}
 private paint():void{this.node.style.opacity=String(this.axes[2].value);this.node.style.transform=`translateY(${this.axes[0].value}px) scale(${this.axes[1].value})`}
 private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;if(this.visible){const active=this.axes.map(a=>stepBatch20Spring(a,dt,320,24,.7));this.paint();this.frame=active.some(Boolean)?requestAnimationFrame(this.tick):0}else{const t=Math.min(1,Math.max(0,(now-this.exitStarted)/150));const progress=exitEase(t);const targets=[16,.95,0];this.axes.forEach((a,i)=>{a.value=this.exitValues[i]+(targets[i]-this.exitValues[i])*progress;a.velocity=0});this.paint();if(t===1){this.frame=0;this.done()}else this.frame=requestAnimationFrame(this.tick)}};
 destroy():void{cancelAnimationFrame(this.frame);this.frame=0}
}
// Motion's default tween ease is cubic-bezier(.42,0,.58,1).
function exitEase(x:number):number{let lo=0,hi=1,t=x;for(let i=0;i<18;i++){t=(lo+hi)/2;const curve=3*(1-t)*(1-t)*t*.42+3*(1-t)*t*t*.58+t*t*t;if(curve<x)lo=t;else hi=t}return 3*(1-t)*t*t+t*t*t}

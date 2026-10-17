import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
export type RocketScene='pad'|'success';
const axis=(value:number):Batch20Spring=>({value,target:value,velocity:0,restDelta:.005,restSpeed:.01});
function bezier(x:number,x1:number,y1:number,x2:number,y2:number):number{if(x<=0)return 0;if(x>=1)return 1;let lo=0,hi=1,t=x;for(let i=0;i<22;i++){t=(lo+hi)/2;const px=3*(1-t)*(1-t)*t*x1+3*(1-t)*t*t*x2+t*t*t;if(px<x)lo=t;else hi=t}return 3*(1-t)*(1-t)*t*y1+3*(1-t)*t*t*y2+t*t*t}
/** AnimatePresence wait: finish the outgoing scene before mounting the next. */
export class RocketScenes {
 private node:HTMLElement|undefined;private shown:RocketScene='pad';private target:RocketScene='pad';private opacity=axis(0);private scale=axis(.98);private frame=0;private start=0;private last=0;private exiting=false;private disposed=false;private fromOpacity=0;private fromScale=.98;
 constructor(private view:Window,private show:(scene:RocketScene)=>void){}
 rendered(node:HTMLElement|undefined,shown:RocketScene,target:RocketScene,reduced:boolean):void{this.target=target;if(!node)return;if(node!==this.node){if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;this.node=node;this.shown=shown;this.exiting=false;this.opacity=axis(0);this.scale=axis(shown==='pad'?.98:reduced?1:.95);this.opacity.target=1;this.scale.target=1;this.scale.restSpeed=shown==='pad'?10:.01;this.fromOpacity=0;this.fromScale=this.scale.value;this.start=this.last=this.view.performance.now();this.paint();this.frame=this.view.requestAnimationFrame(this.tick)}
  if((shown!==target)!==this.exiting){this.exiting=shown!==target;this.fromOpacity=this.opacity.value;this.fromScale=this.scale.value;this.start=this.view.performance.now();this.opacity.target=this.exiting?0:1;this.scale.target=this.exiting?(shown==='pad'?.98:reduced?1:.95):1;if(!this.frame){this.last=this.start;this.frame=this.view.requestAnimationFrame(this.tick)}}
 }
 private paint():void{if(!this.node)return;this.node.style.opacity=String(this.opacity.value);this.node.style.transform=this.scale.value===1?'none':'scale('+this.scale.value+')'}
 private tick=(now:number):void=>{this.frame=0;if(this.disposed)return;const dt=Math.max(0,(now-this.last)/1000),elapsed=now-this.start;this.last=now;let done:boolean;
  if(this.shown==='pad'&&this.exiting){const t=Math.min(1,elapsed/180),e=bezier(t,.42,0,.58,1);this.opacity.value=this.fromOpacity+(this.opacity.target-this.fromOpacity)*e;this.scale.value=this.fromScale+(this.scale.target-this.fromScale)*e;done=t===1}
  else if(this.shown==='pad'){const t=Math.min(1,elapsed/300);this.opacity.value=this.fromOpacity+(1-this.fromOpacity)*bezier(t,.25,.1,.35,1);const moving=stepBatch20Spring(this.scale,dt,550,30,1);done=t===1&&!moving}
  else{const o=stepBatch20Spring(this.opacity,dt,170,26,.9),s=stepBatch20Spring(this.scale,dt,170,26,.9);done=!o&&!s}
  this.paint();if(done){if(this.exiting)this.show(this.target)}else this.frame=this.view.requestAnimationFrame(this.tick);
 };
 destroy():void{this.disposed=true;if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;this.node=undefined}
}

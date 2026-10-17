import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';

export interface HangingCharmOptions {maxRotation:number;stiffnessX:number;stiffnessY:number;damping:number}
const axis=():Batch20Spring=>({value:0,target:0,velocity:0,restDelta:.001,restSpeed:.01});
const clamp=(value:number)=>Math.min(1,Math.max(-1,value));
/** Native normalized pointer pipeline; transformed values clamp spring overshoot like useTransform. */
export class HangingCharmMotion {
 private x=axis();private y=axis();private frame=0;private last=0;private disposed=false;
 private activeX:HangingCharmOptions;private activeY:HangingCharmOptions;
 private layers:SVGElement[];
 constructor(private root:HTMLElement,private body:HTMLElement,private view:Window,private kind:'eye'|'nimbu',private options:HangingCharmOptions,private reduced:boolean){
  this.activeX=this.activeY=options;this.layers=Array.from(body.querySelectorAll<SVGElement>('[data-charm-layer]'));
  this.paint();if(!reduced){root.addEventListener('pointermove',this.move);root.addEventListener('pointerleave',this.leave)}
 }
 configure(options:HangingCharmOptions):void{this.options=options;this.paint()}
 private target(x:number,y:number):void{if(this.disposed)return;if(x!==this.x.target){this.x.target=x;this.activeX=this.options}if(y!==this.y.target){this.y.target=y;this.activeY=this.options}if(!this.frame&&(this.x.value!==x||this.y.value!==y)){this.last=this.view.performance.now();this.frame=this.view.requestAnimationFrame(this.tick)}}
 private move=(event:PointerEvent):void=>{const rect=this.root.getBoundingClientRect();if(rect.width===0||rect.height===0)return;this.target(clamp((event.clientX-rect.left-rect.width/2)/(rect.width/2)),clamp((event.clientY-rect.top-rect.height/2)/(rect.height/2)))};
 private leave=():void=>this.target(0,0);
 private paint():void{const x=clamp(this.x.value),y=clamp(this.y.value),angle=x*this.options.maxRotation,lift=y*5;this.body.style.transform=(lift?'translateY('+lift+'px) ':'')+(angle?'rotate('+angle+'deg)':'');if(!lift&&!angle)this.body.style.transform='none';const rotations=this.kind==='eye'?[9,7,5]:[7,3,5];this.layers.forEach((node,i)=>{node.style.transform=x?'rotate('+x*rotations[i]+'deg)':'none'})}
 private tick=(now:number):void=>{this.frame=0;if(this.disposed)return;const dt=Math.max(0,(now-this.last)/1000);this.last=now;const x=stepBatch20Spring(this.x,dt,this.activeX.stiffnessX,this.activeX.damping,1.8),y=stepBatch20Spring(this.y,dt,this.activeY.stiffnessY,this.activeY.damping+1,1.6);this.paint();if(x||y)this.frame=this.view.requestAnimationFrame(this.tick)};
 destroy():void{this.disposed=true;this.root.removeEventListener('pointermove',this.move);this.root.removeEventListener('pointerleave',this.leave);if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0}
}

export interface SpeedWarpOptions {speed:number;starCount:number;paused:boolean}
interface Star {x:number;y:number;z:number;prevZ:number}
/** Source-frame simulation: intentionally no DPR multiplier or reduced-motion branch. */
export class SpeedWarpRenderer {
 private frame=0;private width:number;private height:number;private visible=true;private stars:Star[];
 private resize:ResizeObserver;private intersection:IntersectionObserver|undefined;private destroyed=false;
 constructor(private canvas:HTMLCanvasElement,private context:CanvasRenderingContext2D,private view:Window,private options:SpeedWarpOptions){
  // Angular's transparent host is not a layout viewport; use the corresponding
  // rendered parent that the source canvas would have in the same consumer.
  let parent=canvas.parentElement;while(parent&&view.getComputedStyle(parent).display==='contents')parent=parent.parentElement;
  this.width=canvas.width=parent?parent.clientWidth:view.innerWidth;this.height=canvas.height=parent?parent.clientHeight:view.innerHeight;
  this.resize=new (view as Window & typeof globalThis).ResizeObserver(entries=>{for(const entry of entries){const {width,height}=entry.contentRect;if(width>0&&height>0){this.width=canvas.width=width;this.height=canvas.height=height}}});
  if(parent)this.resize.observe(parent);
  this.stars=Array.from({length:options.starCount},()=>({x:(Math.random()-.5)*this.width*2,y:(Math.random()-.5)*this.height*2,z:Math.random()*this.width,prevZ:0}));
  const Observer=(view as Window & typeof globalThis).IntersectionObserver;
  if(typeof Observer==='function'&&parent){this.intersection=new Observer(([entry])=>{const visible=entry?(entry.isIntersecting||entry.intersectionRatio>0):true;if(visible!==this.visible){this.visible=visible;if(visible&&!options.paused){if(!this.frame)this.frame=view.requestAnimationFrame(this.render)}else if(!visible&&this.frame){view.cancelAnimationFrame(this.frame);this.frame=0}}},{rootMargin:'100px 0px'});this.intersection.observe(parent)}
  this.render();
 }
 private render=():void=>{
  if(this.destroyed)return;const ctx=this.context,width=this.width,height=this.height;ctx.clearRect(0,0,width,height);const cx=width/2,cy=height/2;
  for(const star of this.stars){star.prevZ=star.z;star.z-=this.options.speed;if(star.z<=0){star.z=width;star.prevZ=width;star.x=(Math.random()-.5)*width*2;star.y=(Math.random()-.5)*height*2}
   const sx=star.x/star.z*250+cx,sy=star.y/star.z*250+cy,previousX=star.x/star.prevZ*250+cx,previousY=star.y/star.prevZ*250+cy;
   if(sx>=0&&sx<=width&&sy>=0&&sy<=height){const alpha=Math.min(1,Math.max(.1,1-star.z/width));ctx.beginPath();ctx.moveTo(previousX,previousY);ctx.lineTo(sx,sy);ctx.strokeStyle='rgba(255, 255, 255, '+alpha+')';ctx.lineWidth=(1-star.z/width)*2.5+.5;ctx.lineCap='round';ctx.stroke()}
  }
  if(!this.visible||this.options.paused){this.frame=0;return}this.frame=this.view.requestAnimationFrame(this.render);
 };
 destroy():void{this.destroyed=true;this.resize.disconnect();this.intersection?.disconnect();if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0}
}

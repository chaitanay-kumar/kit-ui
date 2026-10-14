import {batch22FrameDelta} from './batch22-frame';
export interface MorphingBlobOptions {
  width:number;height:number;points:number;baseRadius:number;variance:number;speed:number;
  stiffness:number;damping:number;cursorFollow:boolean;cursorStrength:number;cursorSmoothness:number;
}
export function blobPath(coords:{x:number;y:number}[]):string {
  const n=coords.length;if(n<3)return '';
  let d=`M ${coords[0].x.toFixed(2)},${coords[0].y.toFixed(2)} `;
  for(let i=0;i<n;i++){
    const p0=coords[(i-1+n)%n],p1=coords[i],p2=coords[(i+1)%n],p3=coords[(i+2)%n];
    d+=`C ${(p1.x+(p2.x-p0.x)/6).toFixed(2)},${(p1.y+(p2.y-p0.y)/6).toFixed(2)}\n      ${(p2.x-(p3.x-p1.x)/6).toFixed(2)},${(p2.y-(p3.y-p1.y)/6).toFixed(2)}\n      ${p2.x.toFixed(2)},${p2.y.toFixed(2)} `;
  }
  return d+'Z';
}
export function staticBlobPath(options:Pick<MorphingBlobOptions,'width'|'height'|'points'|'baseRadius'>):string {
  return blobPath(Array.from({length:options.points},(_,i)=>({x:options.width/2+Math.cos(i/options.points*Math.PI*2)*options.baseRadius,y:options.height/2+Math.sin(i/options.points*Math.PI*2)*options.baseRadius})));
}
export class MorphingBlobMotion {
  private options:MorphingBlobOptions;
  private state:{radius:number;velocity:number;target:number}[];
  private cursor:{x:number;y:number};private position:{x:number;y:number};
  private readonly reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  private frame=0;private last:number|undefined;private timer:ReturnType<typeof setInterval>|undefined;
  constructor(private svg:SVGSVGElement,private path:SVGPathElement,options:MorphingBlobOptions){
    this.options=options;this.state=Array.from({length:options.points},()=>({radius:options.baseRadius,velocity:0,target:options.baseRadius}));
    this.cursor={x:options.width/2,y:options.height/2};this.position={...this.cursor};
    this.listen();this.retarget();if(!this.reduced)this.frame=requestAnimationFrame(this.tick);
  }
  update(options:MorphingBlobOptions):void {
    const previous=this.options;this.options=options;
    if(previous.cursorFollow!==options.cursorFollow||previous.width!==options.width||previous.height!==options.height)this.listen();
    if(previous.baseRadius!==options.baseRadius||previous.variance!==options.variance||previous.speed!==options.speed)this.retarget();
  }
  private listen():void{window.removeEventListener('pointermove',this.move);if(this.options.cursorFollow&&!this.reduced)window.addEventListener('pointermove',this.move)}
  private move=(event:PointerEvent)=>{const rect=this.svg.getBoundingClientRect();this.cursor.x=(event.clientX-rect.left)*this.options.width/rect.width;this.cursor.y=(event.clientY-rect.top)*this.options.height/rect.height};
  private retarget():void{
    clearInterval(this.timer);if(this.reduced)return;
    const update=()=>{for(const point of this.state)point.target=this.options.baseRadius+(Math.random()*2-1)*this.options.variance};
    update();this.timer=setInterval(update,1800/Math.max(this.options.speed,.01));
  }
  private tick=(now:number)=>{
    const dt=Math.min(batch22FrameDelta(now,this.last)/1000,.05);this.last=now;const o=this.options;
    if(o.cursorFollow){this.position.x+=(this.cursor.x-this.position.x)*o.cursorSmoothness;this.position.y+=(this.cursor.y-this.position.y)*o.cursorSmoothness}
    const x=o.width/2,y=o.height/2,offsetX=(this.position.x-x)*o.cursorStrength,offsetY=(this.position.y-y)*o.cursorStrength;
    this.path.setAttribute('d',blobPath(this.state.map((point,index)=>{
      point.velocity+=((point.target-point.radius)*o.stiffness-point.velocity*o.damping)*dt;point.radius+=point.velocity*dt;
      const angle=index/o.points*Math.PI*2;return {x:x+Math.cos(angle)*point.radius+offsetX,y:y+Math.sin(angle)*point.radius+offsetY};
    })));
    this.frame=requestAnimationFrame(this.tick);
  };
  destroy():void{cancelAnimationFrame(this.frame);clearInterval(this.timer);window.removeEventListener('pointermove',this.move)}
}

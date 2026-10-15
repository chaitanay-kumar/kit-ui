import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
const axis=(value:number,target=value):Batch20Spring=>({value,target,velocity:0,restDelta:Math.abs(target-value)<5?.005:.5,restSpeed:Math.abs(target-value)<5?.01:2});
export class StackUnfoldMotion{
 private height=axis(0);private opacity=axis(0);private rotation=axis(0);private entryY=axis(15,0);private entryOpacity=axis(0,1);private frame=0;private last=0;private desired=false;private panel:HTMLElement|undefined;private initialized=false;
 constructor(private host:HTMLElement,private done:()=>void){}
 rendered(open:boolean):void{
  const panel=this.host.querySelector<HTMLElement>('.k-stack-panel')??undefined,inner=panel?.firstElementChild as HTMLElement|undefined;
  if(!this.initialized){this.initialized=true;this.desired=open;this.rotation=axis(open?180:0);if(panel&&inner){this.panel=panel;this.height=axis(inner.getBoundingClientRect().height);this.opacity=axis(1);panel.style.height='auto';panel.style.opacity='1'}this.paint();this.start();return}
  if(panel!==this.panel){this.panel=panel;if(panel&&inner){this.height=axis(0);this.opacity=axis(0);panel.style.height='0px';panel.style.opacity='0'}}
  if(open!==this.desired||open&&panel&&panel.style.height!=='auto'){
   if(panel?.style.height==='auto'){this.height=axis(panel.getBoundingClientRect().height)}this.desired=open;this.target(this.rotation,open?180:0);if(panel&&inner){this.target(this.height,open?inner.getBoundingClientRect().height:0);this.target(this.opacity,open?1:0)}this.start();
  }
 }
 private target(a:Batch20Spring,value:number):void{if(a.target===value)return;const granular=Math.abs(value-a.value)<5;a.restDelta=granular?.005:.5;a.restSpeed=granular?.01:2;a.target=value}
 private start():void{if(!this.frame){this.last=performance.now();this.frame=requestAnimationFrame(this.tick)}}
 private paint():void{this.host.style.opacity=String(this.entryOpacity.value);this.host.style.transform=this.entryY.value===0?'none':`translateY(${this.entryY.value}px)`;const chevron=this.host.querySelector<HTMLElement>('.k-stack-chevron');if(chevron)chevron.style.transform=this.rotation.value===0?'none':`rotate(${this.rotation.value}deg)`;if(this.panel){this.panel.style.opacity=String(this.opacity.value);if(this.panel.style.height!=='auto'||!this.desired)this.panel.style.height=Math.max(0,this.height.value)+'px'}}
 private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;const h=stepBatch20Spring(this.height,dt,200,28,.85),o=stepBatch20Spring(this.opacity,dt,200,28,.85),r=stepBatch20Spring(this.rotation,dt,380,30,.5),y=stepBatch20Spring(this.entryY,dt,200,28,.85),e=stepBatch20Spring(this.entryOpacity,dt,200,28,.85);this.paint();if(!h&&!o&&this.panel){if(this.desired)this.panel.style.height='auto';else{this.panel=undefined;this.done()}}this.frame=h||o||r||y||e?requestAnimationFrame(this.tick):0};
 destroy():void{cancelAnimationFrame(this.frame);this.frame=0}
}
/** Layout projection for React's keyed row layout changes, independent of entry transforms. */
export class StackUnfoldLayout{
 private before=new Map<string,DOMRect>();private offsets=new Map<HTMLElement,{x:Batch20Spring;y:Batch20Spring;sx:Batch20Spring;sy:Batch20Spring}>();private frame=0;private last=0;
 constructor(private root:HTMLElement){}
 capture():void{this.before=new Map(Array.from(this.root.querySelectorAll<HTMLElement>('.k-stack-row')).map(n=>[n.dataset['stackId']!,n.getBoundingClientRect()]))}
 rendered():void{
  const nodes=Array.from(this.root.querySelectorAll<HTMLElement>('.k-stack-row'));for(const [n]of this.offsets)if(!nodes.includes(n)){n.style.translate='';n.style.scale='';this.offsets.delete(n)}if(!this.before.size)return;
  for(const n of nodes){const old=this.before.get(n.dataset['stackId']!);if(!old)continue;const previous=this.offsets.get(n);n.style.translate='';n.style.scale='';const rect=n.getBoundingClientRect(),sx=axis(rect.width?old.width/rect.width:1,1),sy=axis(rect.height?old.height/rect.height:1,1),x=axis(old.x-rect.x+(old.width-rect.width)/2,0),y=axis(old.y-rect.y+(old.height-rect.height)/2,0);if(previous){x.velocity=previous.x.velocity;y.velocity=previous.y.velocity;sx.velocity=previous.sx.velocity;sy.velocity=previous.sy.velocity}if(Math.abs(x.value)>.01||Math.abs(y.value)>.01||Math.abs(sx.value-1)>.001||Math.abs(sy.value-1)>.001){this.offsets.set(n,{x,y,sx,sy});n.style.translate=`${x.value}px ${y.value}px`;n.style.scale=`${sx.value} ${sy.value}`}}
  this.before.clear();if(this.offsets.size&&!this.frame){this.last=performance.now();this.frame=requestAnimationFrame(this.tick)}
 }
 private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;for(const [n,p]of this.offsets){const x=stepBatch20Spring(p.x,dt,200,28,.85),y=stepBatch20Spring(p.y,dt,200,28,.85),sx=stepBatch20Spring(p.sx,dt,200,28,.85),sy=stepBatch20Spring(p.sy,dt,200,28,.85);n.style.translate=`${p.x.value}px ${p.y.value}px`;n.style.scale=`${p.sx.value} ${p.sy.value}`;if(!x&&!y&&!sx&&!sy){n.style.translate='';n.style.scale='';this.offsets.delete(n)}}this.frame=this.offsets.size?requestAnimationFrame(this.tick):0};
 destroy():void{cancelAnimationFrame(this.frame);this.frame=0;for(const [n]of this.offsets){n.style.translate='';n.style.scale='';}this.offsets.clear();this.before.clear()}
}

import {stepBatch20Spring, type Batch20Spring} from './batch20-spring';

const axis = (value: number, target = value): Batch20Spring => ({
  value, target, velocity: 0,
  restDelta: Math.abs(target - value) < 5 ? .005 : .5,
  restSpeed: Math.abs(target - value) < 5 ? .01 : 2,
});

export class AnimatedTabsContentMotion {
  private opacity = axis(0, 1);
  private y = axis(6, 0);
  private frame = 0;
  private last = 0;
  private visible: boolean | undefined;
  constructor(readonly node: HTMLElement, private done: () => void) { this.paint(); }
  set(visible: boolean): void {
    if (visible === this.visible) return;
    this.visible = visible;
    this.opacity.target = visible ? 1 : 0;
    this.y.target = visible ? 0 : -6;
    if (!this.frame) { this.last = performance.now(); this.frame = requestAnimationFrame(this.tick); }
  }
  private paint(): void {
    this.node.style.opacity = String(this.opacity.value);
    this.node.style.transform = this.y.value === 0 ? 'none' : `translateY(${this.y.value}px)`;
  }
  private tick = (now: number) => {
    const dt = Math.max(0, now - this.last) / 1000; this.last = now;
    const opacity = stepBatch20Spring(this.opacity, dt, 170, 26, .9);
    const y = stepBatch20Spring(this.y, dt, 170, 26, .9);
    this.paint();
    this.frame = opacity || y ? requestAnimationFrame(this.tick) : 0;
    if (!this.frame && !this.visible) this.done();
  };
  destroy(): void { cancelAnimationFrame(this.frame); this.frame = 0; }
}

interface IndicatorRect {x:number;y:number;width:number;height:number}
const groups = new WeakMap<Document,Map<string,AnimatedTabsIndicatorGroup>>();
const rect = (value:DOMRect):IndicatorRect => ({x:value.x,y:value.y,width:value.width,height:value.height});
const mixRect = (from:IndicatorRect,to:IndicatorRect,p:number):IndicatorRect => ({
 x:from.x+(to.x-from.x)*p,y:from.y+(to.y-from.y)*p,
 width:from.width+(to.width-from.width)*p,height:from.height+(to.height-from.height)*p,
});
export interface IndicatorProjection{sx:number;sy:number;tx:number;ty:number}
export interface IndicatorSpring{stiffness:number;damping:number;mass:number}
const defaultIndicatorSpring:Readonly<IndicatorSpring>={stiffness:220,damping:32,mass:1};
class AnimatedTabsIndicatorGroup {
 readonly members=new Set<AnimatedTabsIndicatorMotion>();
 lead:AnimatedTabsIndicatorMotion|undefined;
 private from:IndicatorRect|undefined;private initialSnapshot:IndicatorRect|undefined;
 private to:IndicatorRect|undefined;
 private progress:Batch20Spring={value:1,target:1,velocity:0,restDelta:.0005,restSpeed:.01};
 private frame=0;private last=0;private ready=false;private readyFrame:number;
 private active=false;private crossfade=false;private onlyMember=true;private fromOpacity=1;private leadOpacity=1;
 constructor(private dispose:()=>void){this.readyFrame=requestAnimationFrame(()=>{this.ready=true;this.readyFrame=0})}
 add(member:AnimatedTabsIndicatorMotion):void{
  const old=this.snapshot(true);if(!this.members.size&&member.base)this.initialSnapshot={...member.base};this.members.add(member);
  if(this.ready&&old&&this.lead)this.promote(member,old);else this.lead=member;
 }
 snapshot(initialOrigin=false):IndicatorRect|undefined{return this.active&&this.from&&this.to?mixRect(this.from,this.to,this.progress.value):initialOrigin&&this.initialSnapshot?{...this.initialSnapshot}:this.lead?.base?{...this.lead.base}:undefined}
 refreshInitialSnapshot():void{this.initialSnapshot=undefined}
 refresh():void{this.paint()}
 promote(member:AnimatedTabsIndicatorMotion,from:IndicatorRect,shared=true):void{
  if(!member.base)return;this.initialSnapshot=undefined;this.fromOpacity=this.active?this.leadOpacity:1;this.lead=member;this.from=from;this.to=member.base;this.active=true;this.onlyMember=this.members.size<=1;this.crossfade=shared&&!this.onlyMember;
  this.progress={value:0,target:1,velocity:0,restDelta:.0005,restSpeed:.01};
  cancelAnimationFrame(this.frame);this.frame=0;this.paint();
  // Source flushes pending projection updates during the layout commit.
  this.last=performance.now();this.frame=requestAnimationFrame(this.tick);
 }
 private paint():void{
  if(!this.active||!this.from||!this.to)return;
  const p=this.progress.value,pose=mixRect(this.from,this.to,p),crossfade=this.crossfade;
  const enter=Math.min(1,Math.max(0,p/.5));
  const leadOpacity=crossfade?Math.sqrt(Math.max(0,1-(enter-1)**2)):this.onlyMember?this.fromOpacity+(1-this.fromOpacity)*p:1;
  this.leadOpacity=leadOpacity;const followerOpacity=crossfade?this.fromOpacity*(1-Math.min(1,Math.max(0,(p-.5)/.45))):0;
  for(const member of this.members)member.project(pose,member===this.lead?leadOpacity:followerOpacity);
 }
 private tick=(now:number)=>{
  const dt=Math.max(0,now-this.last)/1000;this.last=now;
  const physics=this.lead?.spring??defaultIndicatorSpring;const active=stepBatch20Spring(this.progress,dt,physics.stiffness,physics.damping,physics.mass);this.paint();this.frame=active?requestAnimationFrame(this.tick):0;
 };
 remove(member:AnimatedTabsIndicatorMotion):void{
  const wasLead=this.lead===member,previous=this.snapshot();this.members.delete(member);
  if(!this.members.size){cancelAnimationFrame(this.frame);cancelAnimationFrame(this.readyFrame);this.frame=0;this.dispose();return}
  if(wasLead){const next=[...this.members].at(-1)!;const from=previous??next.visualRect();if(from)this.promote(next,from);else this.lead=next}
 }
}

/** Shared source layout identity, world-space projection and crossfade ownership. */
export class AnimatedTabsIndicatorMotion {
 base:IndicatorRect|undefined;
 private before:IndicatorRect|undefined;
 private node:HTMLElement|undefined;
 private key:string|undefined;
 private group:AnimatedTabsIndicatorGroup|undefined;
 constructor(private root:HTMLElement,private selector='.k-tabs-indicator',readonly spring:Readonly<IndicatorSpring>=defaultIndicatorSpring,private projection?:()=>IndicatorProjection){}
 capture(refreshInitial=false):void{if(refreshInitial)this.group?.refreshInitialSnapshot();const value=this.visualRect();if(value)this.before=value}
 visualRect():IndicatorRect|undefined{const value=this.node?.getBoundingClientRect();return value?rect(value):undefined}
 rendered(key:string):void{
  const node=this.root.querySelector<HTMLElement>(this.selector)??undefined;
  if(!node){this.leave();this.base=undefined;this.before=undefined;this.node=undefined;return}
  const previousNode=this.node,current=this.before??this.visualRect(),sharedSnapshot=this.group?.snapshot(previousNode!==node);
  const transform=node.style.transform;node.style.transform='none';const base=rect(node.getBoundingClientRect());node.style.transform=transform;
  const changed=!this.base||(['x','y','width','height'] as const).some(k=>base[k]!==this.base![k]);
  if(this.key!==key)this.leave();
  this.node=node;this.base=base;
  if(!this.group){
   let map=groups.get(this.root.ownerDocument);if(!map){map=new Map();groups.set(this.root.ownerDocument,map)}
   let group=map.get(key);if(!group){group=new AnimatedTabsIndicatorGroup(()=>map!.delete(key));map.set(key,group)}
   this.key=key;this.group=group;node.style.transform='none';node.style.opacity='1';group.add(this);
  }else if(previousNode!==node){this.group.promote(this,sharedSnapshot??current??base)}else if(changed){if(this.group.lead===this)this.group.promote(this,sharedSnapshot??current??base,false);else this.group.refresh()}
  this.before=undefined;
 }
 projected():void{this.group?.refresh()}
 project(pose:IndicatorRect,opacity:number):void{
  if(!this.node||!this.base)return;
  const projection=this.projection?.();if(projection)pose={x:(pose.x-projection.tx)/projection.sx,y:(pose.y-projection.ty)/projection.sy,width:pose.width/projection.sx,height:pose.height/projection.sy};
  const base=this.base,sx=base.width?pose.width/base.width:1,sy=base.height?pose.height/base.height:1;
  const x=pose.x-base.x+(pose.width-base.width)/2,y=pose.y-base.y+(pose.height-base.height)/2;
  this.node.style.transform=Math.abs(x)<.000001&&Math.abs(y)<.000001&&Math.abs(sx-1)<.000001&&Math.abs(sy-1)<.000001?'none':`translate(${x}px,${y}px) scale(${sx},${sy})`;
  this.node.style.opacity=String(opacity);
 }
 private leave():void{this.group?.remove(this);this.group=undefined;this.key=undefined;if(this.node){this.node.style.transform='none';this.node.style.opacity='1'}}
 destroy():void{this.leave();this.node=undefined;this.before=undefined;this.base=undefined}
}

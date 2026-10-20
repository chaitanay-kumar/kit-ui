import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';

type Box={x:number;y:number;width:number;height:number};
export interface IslandPresenceEntry{state:string;leaving:boolean;initial:boolean}
type EntryMotion={node:HTMLElement;state:string;leaving:boolean;born:number;fromOpacity:number;fromScale:number;opacity:number;scale:number;hasAvatar:boolean};
type AvatarPose={node:HTMLElement;entry:EntryMotion;from:Box;target:Box;shared:boolean;lead:boolean};
const box=(node:HTMLElement):Box=>{const rect=node.getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height}};
const mix=(from:Box,to:Box,p:number):Box=>({x:from.x+(to.x-from.x)*p,y:from.y+(to.y-from.y)*p,width:from.width+(to.width-from.width)*p,height:from.height+(to.height-from.height)*p});
const differs=(a:Box,b:Box)=>Object.keys(a).some(key=>Math.abs(a[key as keyof Box]-b[key as keyof Box])>.01);
function contentEase(x:number):number{let low=0,high=1,t=x;for(let i=0;i<24;i++){t=(low+high)/2;const value=3*(1-t)**2*t*.22+3*(1-t)*t*t*.36+t**3;if(value<x)low=t;else high=t}return 3*(1-t)**2*t+3*(1-t)*t*t+t**3}

/** Pop-layout presence, source 400/30/.8 projection and shared-avatar crossfade. */
export class DynamicIslandMotion{
 private view:Window;private frame=0;private disposed=false;private last=0;private initialized=false;
 private axis:Batch20Spring={value:1000,target:1000,velocity:0,restDelta:.5,restSpeed:2};
 private from:Box|undefined;private target:Box|undefined;private previousTarget:Box|undefined;private pending:Box|undefined;
 private entries=new Map<string,EntryMotion>();private avatars:AvatarPose[]=[];
 private capturedEntries=new Map<string,{left:number;top:number;width:number;height:number}>();
 private capturedAvatars=new Map<HTMLElement,Box>();private capturedLeads=new Map<string,{node:HTMLElement;rect:Box}>();
 private reduced=false;
 constructor(private panel:HTMLElement,private remove:(state:string)=>void){this.view=panel.ownerDocument.defaultView!}
 capture():void{
  if(this.disposed)return;
  this.pending=box(this.panel);this.capturedEntries.clear();this.capturedAvatars.clear();this.capturedLeads.clear();
  for(const node of Array.from(this.panel.querySelectorAll<HTMLElement>('[data-island-entry]'))){
   this.capturedEntries.set(node.dataset['islandEntry']!,{left:node.offsetLeft,top:node.offsetTop,width:node.offsetWidth,height:node.offsetHeight});
   for(const avatar of Array.from(node.querySelectorAll<HTMLElement>('[data-island-avatar]'))){
    const actual=box(avatar),key=avatar.dataset['islandAvatar']!,entry=this.entries.get(node.dataset['islandEntry']!),scale=entry?.scale??1,projection=this.avatars.find(pose=>pose.node===avatar),parent=box(node);
    const width=actual.width/(projection?.shared?1:scale),height=actual.height/(projection?.shared?1:scale),centerX=parent.x+parent.width/2,centerY=parent.y+parent.height/2;
    const rect={x:centerX+(actual.x+actual.width/2-centerX)/scale-width/2,y:centerY+(actual.y+actual.height/2-centerY)/scale-height/2,width,height};
    this.capturedAvatars.set(avatar,rect);this.capturedLeads.set(key,{node:avatar,rect});
   }
  }
 }
 sync(states:readonly IslandPresenceEntry[],reduced:boolean):void{
  if(this.disposed)return;
  const now=this.view.performance.now();this.updateEntries(now);this.reduced=reduced;
  const nodes=Array.from(this.panel.querySelectorAll<HTMLElement>('[data-island-entry]'));
  for(const state of states){
   const node=nodes.find(node=>node.dataset['islandEntry']===state.state);if(!node)continue;
   let entry=this.entries.get(state.state);
   if(!entry){const initial=!this.initialized||state.initial;entry={node,state:state.state,leaving:state.leaving,born:initial?now-200:now,fromOpacity:initial?1:0,fromScale:initial?1:state.state==='collapsed'?.95:.98,opacity:initial?1:0,scale:initial?1:state.state==='collapsed'?.95:.98,hasAvatar:!!node.querySelector('[data-island-avatar]')};this.entries.set(state.state,entry)}
   else if(entry.leaving!==state.leaving){entry.fromOpacity=entry.opacity;entry.fromScale=entry.scale;entry.leaving=state.leaving;entry.born=now}
   entry.hasAvatar=!!node.querySelector('[data-island-avatar]');
   if(state.leaving){const previous=this.capturedEntries.get(state.state);if(previous){node.style.position='absolute';node.style.left=previous.left+'px';node.style.top=previous.top+'px';node.style.width=previous.width+'px';node.style.height=previous.height+'px'}}
   else{node.style.position='';node.style.left='';node.style.top='';node.style.width='';node.style.height=''}
   node.style.transform='';
  }
  for(const[key]of this.entries)if(!states.some(entry=>entry.state===key))this.entries.delete(key);
  this.panel.style.transform='';this.panel.style.transformOrigin='0 0';
  for(const node of Array.from(this.panel.querySelectorAll<HTMLElement>('[data-island-avatar]'))){node.style.transform='';node.style.transformOrigin='0 0';node.style.opacity=''}
  const target=box(this.panel),changing=!!this.pending&&(!this.previousTarget||differs(this.previousTarget,target));
  if(!this.initialized){this.from=this.target=target;this.axis.value=1000;this.initialized=true}
  else if(changing){this.from=this.pending;this.target=target;this.axis.value=0;this.axis.velocity=0;this.last=now}
  this.previousTarget=target;this.target=target;
  const active=states.find(entry=>!entry.leaving),leadEntry=active?this.entries.get(active.state):undefined;
  const leads=new Map<string,HTMLElement>();
  for(const avatar of Array.from(leadEntry?.node.querySelectorAll<HTMLElement>('[data-island-avatar]')??[]))leads.set(avatar.dataset['islandAvatar']!,avatar);
  if(this.pending||!this.avatars.length){
   this.avatars=[];
   for(const entry of this.entries.values())for(const node of Array.from(entry.node.querySelectorAll<HTMLElement>('[data-island-avatar]'))){
    const key=node.dataset['islandAvatar']!,lead=leads.get(key),captured=this.capturedLeads.get(key),shared=!!lead&&!!captured&&lead!==captured.node;
    const targetBox=box(shared?lead!:node),from=shared?captured!.rect:this.capturedAvatars.get(node)??targetBox;
    this.avatars.push({node,entry,from,target:targetBox,shared,lead:node===lead});
   }
  }
  if(!changing&&this.pending&&this.avatars.some(avatar=>avatar.shared||differs(avatar.from,avatar.target))){this.from=this.pending;this.axis.value=0;this.axis.velocity=0;this.last=now}
  this.pending=undefined;
  if(reduced)this.finishReduced();
  this.paint();this.collect(now,false);
  if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;
  if(!reduced&&this.moving(now)){this.last=now;this.frame=this.view.requestAnimationFrame(this.tick)}
 }
 private updateEntries(now:number):void{
  for(const entry of this.entries.values()){const p=contentEase(Math.max(0,Math.min(1,(now-entry.born)/200)));entry.opacity=entry.fromOpacity+((entry.leaving?0:1)-entry.fromOpacity)*p;entry.scale=entry.fromScale+((entry.leaving?(entry.state==='collapsed'?.95:.98):1)-entry.fromScale)*p}
 }
 private paint():void{
  if(!this.from||!this.target)return;
  const p=this.axis.value/1000,current=mix(this.from,this.target,p),sx=current.width/this.target.width,sy=current.height/this.target.height;
  this.panel.style.transform=p===1?'none':'translate('+(current.x-this.target.x)+'px,'+(current.y-this.target.y)+'px) scale('+(Math.abs(sx-1)<.0001?1:sx)+','+(Math.abs(sy-1)<.0001?1:sy)+')';
  for(const entry of this.entries.values()){entry.node.style.opacity=String(entry.opacity);entry.node.style.transform=entry.scale===1?'none':'scale('+entry.scale+')'}
  for(const avatar of this.avatars){
   if(!avatar.node.isConnected)continue;
   avatar.node.style.transform='none';
   const entry=avatar.entry,node=avatar.node,base=box(node),sizeX=base.width/node.offsetWidth,sizeY=base.height/node.offsetHeight;
   if(!sizeX||!sizeY)continue;
   // The content tween moves an avatar around its parent's center. Shared
   // projection cancels that scale's size distortion, but retains its position.
   const entryBox=box(entry.node),centerX=entryBox.x+entryBox.width/2,centerY=entryBox.y+entryBox.height/2;
   const desired=mix(avatar.from,avatar.target,p),centerAvatarX=desired.x+desired.width/2,centerAvatarY=desired.y+desired.height/2;
   const width=desired.width*(avatar.shared?1:entry.scale),height=desired.height*(avatar.shared?1:entry.scale);
   const x=centerX+(centerAvatarX-centerX)*entry.scale-width/2,y=centerY+(centerAvatarY-centerY)*entry.scale-height/2;
   node.style.transform='translate('+((x-base.x)/sizeX)+'px,'+((y-base.y)/sizeY)+'px) scale('+(width/base.width)+','+(height/base.height)+')';
   if(avatar.shared){const enter=p<=0?0:p>=.5?1:Math.sqrt(1-(1-p/.5)**2),exit=p<=.5?1:p>=.95?0:1-(p-.5)/.45;node.style.opacity=String(avatar.lead?enter:exit)}else node.style.opacity='1';
  }
  if(p===1)for(const avatar of this.avatars)if(!avatar.entry.leaving){avatar.node.style.transform='none';avatar.node.style.transformOrigin='';avatar.node.style.opacity=''}
 }
 private moving(now:number):boolean{return this.axis.value!==1000||Array.from(this.entries.values()).some(entry=>now<entry.born+200)}
 private finishReduced():void{this.axis.value=1000;this.axis.velocity=0;for(const entry of this.entries.values()){entry.opacity=entry.fromOpacity=entry.leaving?0:1;entry.scale=entry.fromScale=entry.leaving?(entry.state==='collapsed'?.95:.98):1;entry.born=this.view.performance.now()-200}}
 private collect(now:number,rootMoving:boolean):void{for(const entry of [...this.entries.values()])if(entry.leaving&&(this.reduced||now>=entry.born+200&&(!entry.hasAvatar||!rootMoving&&this.axis.value===1000))){this.entries.delete(entry.state);this.remove(entry.state)}}
 private tick=(now:number):void=>{
  if(this.disposed)return;
  const rootMoving=stepBatch20Spring(this.axis,Math.max(0,(now-this.last)/1000),400,30,.8);this.last=now;this.updateEntries(now);this.paint();this.collect(now,rootMoving);
  this.frame=this.moving(now)?this.view.requestAnimationFrame(this.tick):0;
 };
 destroy():void{this.disposed=true;if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;this.entries.clear();this.avatars=[];this.capturedEntries.clear();this.capturedAvatars.clear();this.capturedLeads.clear();this.panel.style.transform='';this.panel.style.transformOrigin=''}
}

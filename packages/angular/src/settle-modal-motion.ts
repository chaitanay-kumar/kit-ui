interface Pose{opacity:number;y:number;scale:number}
function bezier(x:number,a:number,b:number):number{let lo=0,hi=1,t=x;for(let i=0;i<20;i++){t=(lo+hi)/2;const px=3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;if(px<x)lo=t;else hi=t}return 1-(1-t)**3}
export class SettleModalMotion{
 private animations:Animation[]=[];private visible:boolean|undefined;private generation=0;
 constructor(readonly root:HTMLElement,private done:()=>void){this.pose(this.panel,{opacity:0,y:8,scale:.94});this.pose(this.inner,{opacity:0,y:4,scale:.98});this.backdrop.style.opacity='0'}
 private get panel():HTMLElement{return this.root.querySelector('.k-settle-panel')!}private get inner():HTMLElement{return this.root.querySelector('.k-settle-inner')!}private get backdrop():HTMLElement{return this.root.querySelector('.k-settle-backdrop')!}
 private pose(node:HTMLElement,p:Pose):void{node.style.opacity=String(p.opacity);node.style.transform=`translateY(${p.y}px) scale(${p.scale})`}
 private read(node:HTMLElement):Pose{const style=getComputedStyle(node),matrix=new DOMMatrix(style.transform==='none'?undefined:style.transform);return {opacity:Number(style.opacity),y:matrix.m42,scale:matrix.m11}}
 set(visible:boolean):void{
  if(this.visible===visible)return;this.visible=visible;const generation=++this.generation;
  if(typeof this.panel.animate!=='function'){this.pose(this.panel,{opacity:visible?1:0,y:visible?0:4,scale:visible?1:.96});this.pose(this.inner,{opacity:visible?1:0,y:visible?0:2,scale:visible?1:.99});this.backdrop.style.opacity=visible?'1':'0';if(!visible)this.done();return}
  const panelStart=this.read(this.panel),innerStart=this.read(this.inner),backdropStart=Number(getComputedStyle(this.backdrop).opacity);this.animations.forEach(a=>a.cancel());this.animations=[];
  const animate=(node:HTMLElement,start:Pose,end:Pose,duration:number,delay:number,overshoot=false)=>{
   const frames:Keyframe[]=Array.from({length:85},(_,i)=>{const t=i/84,e=bezier(t,.16,.3);let scale=start.scale+(end.scale-start.scale)*e;if(overshoot)scale=t<=.5?.94+(1.02-.94)*bezier(t*2,.16,.3):1.02+(1-1.02)*bezier((t-.5)*2,.16,.3);return {offset:t,opacity:start.opacity+(end.opacity-start.opacity)*e,transform:`translateY(${start.y+(end.y-start.y)*e}px) scale(${scale})`}});
   const animation=node.animate(frames,{duration,delay,fill:'both',easing:'linear'});this.animations.push(animation);void animation.finished.then(()=>{if(generation!==this.generation)return;this.pose(node,end);if(end.y===0&&end.scale===1)node.style.transform='none';animation.cancel()}).catch(()=>undefined);
  };
  animate(this.panel,panelStart,{opacity:visible?1:0,y:visible?0:4,scale:visible?1:.96},420,0,visible);
  animate(this.inner,innerStart,{opacity:visible?1:0,y:visible?0:2,scale:visible?1:.99},400,50);
  const backdrop=this.backdrop.animate([{opacity:backdropStart},{opacity:visible?1:0}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});this.animations.push(backdrop);void backdrop.finished.then(()=>{if(generation!==this.generation)return;this.backdrop.style.opacity=visible?'1':'0';backdrop.cancel()}).catch(()=>undefined);
  void Promise.all(this.animations.map(a=>a.finished.catch(()=>undefined))).then(()=>{if(generation===this.generation&&!this.visible)this.done()});
 }
 destroy():void{this.generation++;this.animations.forEach(a=>a.cancel());this.animations=[]}
}

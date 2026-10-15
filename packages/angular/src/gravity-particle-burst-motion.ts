interface GravityParticle{x:number;y:number;vx:number;vy:number;life:number;age:number;size:number;color:string}
const palette=['#FFFFFF','#F4F4F5','#E4E4E7','#FDE047','#93C5FD'];
export class GravityParticleBurstMotion{
  private particles:GravityParticle[]=[];private frame:number|null=null;private reduced=false;private media:MediaQueryList|undefined;
  constructor(private canvas:HTMLCanvasElement){if(typeof window==='undefined')return;this.media=window.matchMedia('(prefers-reduced-motion: reduce)');this.updatePreference();this.media.addEventListener('change',this.updatePreference)}
  private updatePreference=()=>{this.reduced=this.media?.matches??false};
  burst(clientX:number,clientY:number,count:number):void{
    if(this.reduced)return;const rect=this.canvas.getBoundingClientRect(),scale=window.devicePixelRatio||1;
    if(this.canvas.width!==rect.width*scale||this.canvas.height!==rect.height*scale){this.canvas.width=rect.width*scale;this.canvas.height=rect.height*scale}
    const originX=(clientX-rect.left)*scale,originY=(clientY-rect.top)*scale;
    this.particles.push(...Array.from({length:count},(_,index)=>{const angle=-Math.PI+Math.PI*2*index/count+(Math.random()-.5)*.4,force=(2.4+Math.random()*4.2)*scale;return {x:originX,y:originY,vx:Math.cos(angle)*force,vy:Math.sin(angle)*force-1.8*scale,life:42+Math.random()*32,age:0,size:(1.5+Math.random()*2.2)*scale,color:palette[Math.floor(Math.random()*palette.length)]}}));
    if(!this.frame)this.frame=requestAnimationFrame(this.draw);
  }
  private draw=()=>{
    const context=this.canvas.getContext('2d');if(!context)return;
    context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.particles=this.particles.map(p=>({...p,x:p.x+p.vx,y:p.y+p.vy,vx:p.vx*.98,vy:p.vy*.98+.16,age:p.age+1})).filter(p=>p.age<p.life);
    for(const p of this.particles){const progress=p.age/p.life;context.globalAlpha=Math.max(1-progress,0);context.fillStyle=p.color;context.beginPath();context.ellipse(p.x,p.y,p.size*(1-progress*.3),p.size*(1-progress*.3),0,0,Math.PI*2);context.fill()}
    context.globalAlpha=1;this.frame=this.particles.length?requestAnimationFrame(this.draw):null;
  };
  destroy():void{if(this.frame)cancelAnimationFrame(this.frame);this.media?.removeEventListener('change',this.updatePreference);this.particles=[]}
}

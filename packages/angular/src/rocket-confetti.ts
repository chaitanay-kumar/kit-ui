export interface RocketConfettiParticle{x:number;y:number;vx:number;vy:number;width:number;height:number;color:string;rotation:number;vRot:number;wobble:number;vWobble:number;life:number;age:number;shape:'rect'|'circle'|'strip'}
const colors=['#FAFAFA','#38BDF8','#34D399','#FBBF24','#F472B6','#A78BFA','#E4E4E7'];
/** Source frame-based physics; canvas pixels resize only at the next burst. */
export class RocketConfetti {
 private particles:RocketConfettiParticle[]=[];private frame=0;private disposed=false;
 constructor(private canvas:HTMLCanvasElement,private view:Window){}
 spawn(count:number,originX:number,originY:number,reduced=false):void{if(reduced||this.disposed)return;const canvas=this.canvas,rect=canvas.getBoundingClientRect(),scale=this.view.devicePixelRatio||1;if(canvas.width!==rect.width*scale||canvas.height!==rect.height*scale){canvas.width=rect.width*scale;canvas.height=rect.height*scale}const shapes=['rect','circle','strip'] as const;
  this.particles=Array.from({length:count}).map(()=>{const angle=-Math.PI/2+(Math.random()-.5)*(Math.PI*1.3),speed=(4.8+Math.random()*7.5)*scale;return {x:originX*scale,y:originY*scale,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-2.2*scale,width:(4+Math.random()*4.5)*scale,height:(6+Math.random()*8)*scale,color:colors[Math.floor(Math.random()*colors.length)],rotation:Math.random()*360,vRot:(Math.random()-.5)*10,wobble:Math.random()*Math.PI,vWobble:.08+Math.random()*.1,life:70+Math.random()*40,age:0,shape:shapes[Math.floor(Math.random()*shapes.length)]}});
  if(!this.frame)this.frame=this.view.requestAnimationFrame(this.draw);
 }
 private draw=():void=>{if(this.disposed)return;const canvas=this.canvas,ctx=canvas.getContext('2d');if(!ctx)return;ctx.clearRect(0,0,canvas.width,canvas.height);this.particles=this.particles.map(p=>({...p,x:p.x+p.vx,y:p.y+p.vy,vx:p.vx*.985,vy:p.vy*.985+.2,rotation:p.rotation+p.vRot,wobble:p.wobble+p.vWobble,age:p.age+1})).filter(p=>p.age<p.life&&p.y<canvas.height+40);
  for(const p of this.particles){const progress=p.age/p.life,alpha=progress>.75?1-(progress-.75)/.25:1;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,alpha));ctx.translate(p.x,p.y);ctx.rotate(p.rotation*Math.PI/180);ctx.fillStyle=p.color;const wobble=Math.sin(p.wobble);if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.width/2,0,Math.PI*2);ctx.fill()}else ctx.fillRect(-p.width/2,-p.height*wobble/2,p.width,p.height*wobble);ctx.restore()}
  this.frame=this.particles.length?this.view.requestAnimationFrame(this.draw):0;
 };
 reset():void{this.particles=[];if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;this.canvas.getContext('2d')?.clearRect(0,0,this.canvas.width,this.canvas.height)}
 destroy():void{this.disposed=true;if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0;this.particles=[]}
}

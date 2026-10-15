import {Component,DestroyRef,ElementRef,afterEveryRender,inject,input} from '@angular/core';

@Component({selector:'kit-number-digit',standalone:true,host:{style:'display:contents'},template:`@if(numeric()){<div class="k-an-column"><div class="k-an-track">@for(n of digits;track n){<div class="k-an-cell">{{n}}</div>}</div></div>}@else{<span class="k-an-character">{{digit()}}</span>}`})
export class AnimatedNumberDigitComponent {
  readonly digit=input.required<string>();readonly stiffness=input(170);readonly damping=input(22);readonly mass=input(.6);readonly digits=[0,1,2,3,4,5,6,7,8,9];
  numeric(){return !Number.isNaN(parseInt(this.digit(),10));}
  private readonly host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly media=window.matchMedia('(prefers-reduced-motion: reduce)');
  private current=0;private target=0;private velocity=0;private initialized=false;private frame=0;private last=0;
  private write(){const track=this.host.querySelector<HTMLElement>('.k-an-track');if(track)track.style.transform='translateY('+(-this.current*10)+'%)';}
  private snap=()=>{if(this.media.matches){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;this.current=this.target;this.velocity=0;this.write();}};
  /** Solve the damped spring analytically so a delayed frame does not discard elapsed time. */
  private tick=(time:number)=>{
    const dt=Math.max(0,(time-this.last)/1000);this.last=time;
    const x=this.current-this.target,v=this.velocity,decay=this.damping()/(2*this.mass()),discriminant=decay*decay-this.stiffness()/this.mass();
    if(Math.abs(discriminant)<1e-8){const b=v+decay*x,e=Math.exp(-decay*dt);this.current=this.target+(x+b*dt)*e;this.velocity=(v-decay*b*dt)*e;}
    else if(discriminant>0){const root=Math.sqrt(discriminant),r1=-decay+root,r2=-decay-root,c1=(v-r2*x)/(r1-r2),c2=x-c1,a=c1*Math.exp(r1*dt),b=c2*Math.exp(r2*dt);this.current=this.target+a+b;this.velocity=r1*a+r2*b;}
    else{const omega=Math.sqrt(-discriminant),b=(v+decay*x)/omega,angle=omega*dt,e=Math.exp(-decay*dt),cos=Math.cos(angle),sin=Math.sin(angle);this.current=this.target+e*(x*cos+b*sin);this.velocity=e*((-decay*x+omega*b)*cos+(-decay*b-omega*x)*sin);}
    const done=Math.abs(this.current-this.target)<.001&&Math.abs(this.velocity)<.01;if(done){this.current=this.target;this.velocity=0;}this.write();this.frame=done?0:requestAnimationFrame(this.tick);
  };
  constructor(){afterEveryRender(()=>{const target=this.numeric()?parseInt(this.digit(),10):0;if(!this.initialized){this.initialized=true;this.current=this.target=target;}else if(target!==this.target){this.target=target;this.last=performance.now();if(this.media.matches)this.snap();else if(!this.frame){this.last=performance.now();this.frame=requestAnimationFrame(this.tick);}}this.write();});this.media.addEventListener('change',this.snap);inject(DestroyRef).onDestroy(()=>{if(this.frame)cancelAnimationFrame(this.frame);this.media.removeEventListener('change',this.snap);});}
}

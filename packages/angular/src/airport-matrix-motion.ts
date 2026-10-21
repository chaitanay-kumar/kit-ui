// Native row rebuild motion uses the reference springSnappy physics.
export class AirportMatrixMotion {
  private readonly animations=new Set<Animation>();
  private readonly ghosts=new Set<Element>();
  private readonly preference=typeof matchMedia==='undefined'?undefined:matchMedia('(prefers-reduced-motion: reduce)');
  private readonly stop=()=>{for(const animation of this.animations)animation.cancel();this.animations.clear();for(const ghost of this.ghosts)ghost.remove();this.ghosts.clear();};
  constructor(){this.preference?.addEventListener('change',this.stop);}
  rebuild(event:PointerEvent){
    if(event.pointerType==='touch'||this.preference?.matches)return;
    const row=event.currentTarget as HTMLElement;
    // Repeated entry replaces this row's transient layers; other rows keep moving.
    row.querySelectorAll('[data-airport-ghost]').forEach(ghost=>ghost.remove());
    row.querySelectorAll<HTMLElement>('.k-am-face:not([data-airport-ghost])').forEach(face=>{
      for(const animation of face.getAnimations())animation.cancel();
      const ghost=face.cloneNode(true) as HTMLElement;ghost.dataset['airportGhost']='';face.before(ghost);this.ghosts.add(ghost);
      const delay=Math.min(indexWithinText(face)*12,90);
      const frames=Array.from({length:121},(_,i)=>{
        const time=i/120,root=Math.sqrt(30*30-4*.5*380),r1=(-30+root)/(2*.5),r2=(-30-root)/(2*.5);
        const remaining=(-r2*Math.exp(r1*time)+r1*Math.exp(r2*time))/(r1-r2);
        return {offset:time,transform:`translateY(${72*remaining}%)`,opacity:1-.55*remaining};
      });
      this.play(face,frames,{duration:1000,delay,fill:'backwards'});
      this.play(ghost,frames.map(frame=>({...frame,transform:`translateY(${parseFloat(frame.transform.slice(11))-72}%)`,opacity:1.45-Number(frame.opacity)})),{duration:1000,delay,fill:'forwards'},()=>{ghost.remove();this.ghosts.delete(ghost);});
    });
    row.querySelectorAll<HTMLElement>('.k-am-country > span').forEach((letter,index)=>{
      for(const animation of letter.getAnimations())animation.cancel();
      if(letter.textContent===' ')return;
      this.play(letter,[{opacity:0,transform:'translateY(2px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,delay:Math.min(index*8,80),easing:'cubic-bezier(.2,0,0,1)',fill:'backwards'});
    });
  }
  private play(element:HTMLElement,frames:Keyframe[],options:KeyframeAnimationOptions,done=()=>{}){
    const animation=element.animate(frames,options);this.animations.add(animation);
    const clean=()=>{this.animations.delete(animation);done();};animation.onfinish=clean;animation.oncancel=clean;
  }
  destroy(){this.stop();this.preference?.removeEventListener('change',this.stop);}
}
function indexWithinText(face:Element){return Array.from(face.parentElement!.parentElement!.children).filter(el=>el.classList.contains('k-am-character')).indexOf(face.parentElement!);}

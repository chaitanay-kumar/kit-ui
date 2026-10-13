import {DestroyRef, ElementRef, afterEveryRender, inject, type Signal, type WritableSignal} from '@angular/core';

/** Native 200/28/.85 width spring; retains velocity when interrupted. */
export function installIOSSearchMotion(expanded: Signal<boolean>, collapsed: Signal<number|string>, open: Signal<number|string>, value: Signal<string>, showClear: WritableSignal<boolean>): void {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  let outer: HTMLElement | null = null, current = 0, target = 0, velocity = 0, frame = 0, last = 0;
  let previousWidth: number|string|undefined, observer: ResizeObserver | undefined;
  let button: HTMLElement | null = null, animation: Animation | undefined, visible = false;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => media.matches;
  const tick = (time: number) => {
    let dt = Math.min((time-last)/1000, .064); last = time;
    while(dt>0){const step=Math.min(dt,1/240);velocity+=(-200*(current-target)-28*velocity)/.85*step;current+=velocity*step;dt-=step;}
    const done = Math.abs(current-target)<.01 && Math.abs(velocity)<.01;
    if(done){current=target;velocity=0;}
    if(outer)outer.style.width=current+'px';
    frame=done?0:requestAnimationFrame(tick);
  };
  const resize = () => {
    if(!outer||previousWidth===undefined)return;
    const old=outer.style.width;
    outer.style.width=typeof previousWidth==='number'?previousWidth+'px':previousWidth;
    target=outer.getBoundingClientRect().width;
    outer.style.width=old;
    if(reduced()){if(frame)cancelAnimationFrame(frame);frame=0;current=target;velocity=0;outer.style.width=target+'px';}
    else if(!frame&&current!==target){last=performance.now();frame=requestAnimationFrame(tick);}
  };
  afterEveryRender(()=>{
    const node=host.querySelector<HTMLElement>('.k-ios-outer');if(!node)return;
    // Restore rejected edits after parent bindings settle; writing the old value inside
    // the input listener would move the caret to the end on every accepted keystroke.
    const input=node.querySelector('input');if(input&&input.value!==value())input.value=value();
    if(!outer){
      outer=node;previousWidth=expanded()?open():collapsed();outer.style.width=typeof previousWidth==='number'?previousWidth+'px':previousWidth;current=target=outer.getBoundingClientRect().width;
      // The Angular host uses display:contents and therefore has no observable layout box.
      let container=outer.parentElement;while(container&&getComputedStyle(container).display==='contents')container=container.parentElement;
      if(typeof ResizeObserver!=='undefined'&&container){observer=new ResizeObserver(resize);observer.observe(container);}
    }
    const width=expanded()?open():collapsed();if(width!==previousWidth){previousWidth=width;resize();}
    const next=value().length>0;
    if(next&&!showClear()){showClear.set(true);return;}
    const nextButton=host.querySelector<HTMLElement>('.k-ios-clear');
    if(nextButton&&(nextButton!==button||next!==visible)){
      const from=nextButton===button?Number(getComputedStyle(nextButton).opacity):0;
      const fromTransform=nextButton===button?getComputedStyle(nextButton).transform:'scale(.8)';
      animation?.cancel();button=nextButton;visible=next;
      if(reduced()||typeof button.animate!=='function'){if(!next)showClear.set(false);}
      else{animation=button.animate([{opacity:from,transform:fromTransform},{opacity:next?1:0,transform:next?'scale(1)':'scale(.8)'}],{duration:150,fill:'forwards',easing:'ease-out'});animation.onfinish=()=>{if(!visible)showClear.set(false);};}
    }
  });
  const preference = () => {resize();if(media.matches)animation?.finish();};
  media.addEventListener?.('change',preference);
  inject(DestroyRef).onDestroy(()=>{if(frame)cancelAnimationFrame(frame);observer?.disconnect();animation?.cancel();media.removeEventListener?.('change',preference);});
}

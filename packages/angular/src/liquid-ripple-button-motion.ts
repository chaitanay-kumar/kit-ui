import { DestroyRef, ElementRef, inject } from '@angular/core';
import { stepBatch20Spring } from './batch20-spring';

/** Native pointer/keyboard press lifecycle; the reference's 380/30/.5 spring. */
export function installLiquidRippleMotion(): void {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const node = () => host.tagName === 'BUTTON' ? host : host.querySelector('button');
  const axis = { value: 1, target: 1, velocity: 0 };
  let frame = 0, last = 0, hovered = false, pressed = false, keyPressed = false;
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = (time: number) => {
    const active = stepBatch20Spring(axis, Math.max(0, time - last) / 1000, 380, 30, .5);
    last = time;
    const button = node();
    if (button) button.style.transform = `scale(${axis.value})`;
    frame = active ? requestAnimationFrame(tick) : 0;
  };
  const update = () => {
    axis.target = reduced ? 1 : pressed ? .97 : hovered ? 1.02 : 1;
    if (reduced) {
      cancelAnimationFrame(frame); frame = 0; axis.value = 1; axis.velocity = 0;
      node()?.style.removeProperty('transform');
    } else if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
  };
  const primary = (event: PointerEvent) => event.pointerType === 'mouse' ? event.button <= 0 : event.isPrimary !== false;
  const enter = (event: Event) => { if ((event as PointerEvent).pointerType !== 'touch') { hovered = true; update(); } };
  const leave = () => { hovered = false; update(); };
  const down = (event: Event) => { if (primary(event as PointerEvent)) { pressed = true; update(); } };
  const release = (event: Event) => { if (primary(event as PointerEvent)) { pressed = false; update(); } };
  const fire = (type: string) => node()?.dispatchEvent(new PointerEvent('pointer' + type, { isPrimary: true, bubbles: true }));
  const keydown = (event: Event) => {
    if ((event as KeyboardEvent).key === 'Enter' && !pressed && !reduced) { keyPressed = true; fire('down'); }
  };
  const keyup = (event: Event) => { if ((event as KeyboardEvent).key === 'Enter' && keyPressed) { keyPressed = false; fire('up'); } };
  const blur = () => { if (keyPressed) { keyPressed = false; fire('cancel'); } };
  const bindings: [EventTarget, string, EventListener][] = [[host, 'pointerenter', enter], [host, 'pointerleave', leave], [host, 'pointerdown', down], [host, 'keydown', keydown], [host, 'keyup', keyup], [host, 'blur', blur]];
  if (typeof window !== 'undefined') bindings.push([window, 'pointerup', release], [window, 'pointercancel', release]);
  for (const [target, name, listener] of bindings) target.addEventListener(name, listener, true);
  inject(DestroyRef).onDestroy(() => {
    cancelAnimationFrame(frame);
    for (const [target, name, listener] of bindings) target.removeEventListener(name, listener, true);
  });
}

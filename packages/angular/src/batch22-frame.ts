/** Match the installed Motion frame batcher's default first step and elapsed clamp. */
export function batch22FrameDelta(now:number,last:number|undefined):number{
  return last===undefined?1000/60:Math.max(Math.min(now-last,40),1);
}

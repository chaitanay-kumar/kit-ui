import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';

/** Source springSnappy: stiffness 380, damping 30, mass .5. */
export class SpringSelectMotion {
  private axes:Batch20Spring[];
  private frame=0;
  private last=0;
  private readonly window:Window;
  constructor(private readonly node:HTMLElement,values:number[],private readonly paint:(values:number[])=>void){
    this.window=node.ownerDocument.defaultView!;
    this.axes=values.map(value=>({value,target:value,velocity:0,restDelta:Math.abs(value)<1?.005:.5,restSpeed:Math.abs(value)<1?.01:2}));
    this.paint(values);
  }
  to(values:number[],privateDone?:()=>void):void{
    this.done=privateDone;
    this.axes.forEach((axis,index)=>{const granular=Math.abs(values[index]-axis.value)<5;axis.target=values[index];axis.restDelta=granular?.005:.5;axis.restSpeed=granular?.01:2});
    if(!this.frame){this.last=this.window.performance.now();this.frame=this.window.requestAnimationFrame(this.tick)}
  }
  private done:(()=>void)|undefined;
  private tick=(now:number)=>{
    let moving=false;
    for(const axis of this.axes)moving=stepBatch20Spring(axis,(now-this.last)/1000,380,30,.5)||moving;
    this.last=now;this.paint(this.axes.map(axis=>axis.value));
    this.frame=moving?this.window.requestAnimationFrame(this.tick):0;
    if(!moving){const done=this.done;this.done=undefined;done?.()}
  };
  destroy():void{this.window.cancelAnimationFrame(this.frame);this.frame=0;this.done=undefined}
}

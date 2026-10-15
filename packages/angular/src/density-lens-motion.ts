import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
export class DensityLensMotion{
  private axes:Batch20Spring[]=[{value:0,target:0,velocity:0},{value:0,target:0,velocity:0},{value:.8,target:.8,velocity:0},{value:0,target:0,velocity:0}];
  private frame=0;private last=0;private exiting=false;
  constructor(readonly node:HTMLElement,private finished:()=>void){this.paint()}
  update(x:number,y:number,visible:boolean):void{
    let changed=false;const values=[x,y,visible?1:.8,visible?1:0];
    for(let i=visible?0:2;i<4;i++){const axis=this.axes[i],target=values[i];if(axis.target===target)continue;const granular=Math.abs(target-axis.value)<5;axis.restDelta=granular?.005:.5;axis.restSpeed=granular?.01:2;axis.target=target;changed=true}
    this.exiting=!visible;if((changed||this.exiting)&&!this.frame){this.last=performance.now();this.frame=requestAnimationFrame(this.tick)}
  }
  private paint():void{this.node.style.opacity=String(this.axes[3].value);this.node.style.transform=`translateX(${this.axes[0].value}px) translateY(${this.axes[1].value}px) scale(${this.axes[2].value})`}
  private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;const active=this.axes.map(axis=>stepBatch20Spring(axis,dt,450,28,.2));this.paint();if(this.exiting&&!active[2]&&!active[3]){this.frame=0;this.finished();return}this.frame=active.some(Boolean)?requestAnimationFrame(this.tick):0};
  destroy():void{cancelAnimationFrame(this.frame);this.frame=0}
}

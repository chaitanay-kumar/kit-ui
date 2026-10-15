import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
const axis=(value:number):Batch20Spring=>({value,target:value,velocity:0,restDelta:.005,restSpeed:.01});
const sampledDuration=(value:Batch20Spring,stiffness:number,damping:number,mass:number):number=>{for(let elapsed=0;elapsed<20000;elapsed+=50){const sample={...value};if(!stepBatch20Spring(sample,elapsed/1000,stiffness,damping,mass))return elapsed}return 20000};
/** Key replacement starts a new icon entry; source has no retained icon exit. */
export class GlassNavbarIconMotion {
 private opacity=axis(0);private rotation=axis(-90);private frame=0;private last=0;
 constructor(readonly node:HTMLElement){this.opacity.target=1;this.rotation.target=0;this.rotation.restDelta=.5;this.rotation.restSpeed=2;this.paint();this.last=performance.now();this.frame=requestAnimationFrame(this.tick)}
 private paint():void{this.node.style.opacity=String(this.opacity.value);this.node.style.transform=this.rotation.value===0?'none':`rotate(${this.rotation.value}deg)`}
 private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;const opacity=stepBatch20Spring(this.opacity,dt,380,30,.5),rotation=stepBatch20Spring(this.rotation,dt,380,30,.5);this.paint();this.frame=opacity||rotation?requestAnimationFrame(this.tick):0};
 destroy():void{cancelAnimationFrame(this.frame);this.frame=0}
}
/** Auto-height panel retains its DOM and restores natural flow after height entry. */
export class GlassNavbarPanelMotion {
 private opacity=axis(0);private y=axis(-8);private height=axis(0);private heightAuto=false;private frame=0;private last=0;private endTime=0;private heightEndTime=0;private showing:boolean|undefined;
 constructor(readonly node:HTMLElement,private exited:()=>void){this.y.restDelta=.5;this.y.restSpeed=2;this.height.restDelta=.5;this.height.restSpeed=2;this.paint()}
 private measureHeight(target:string):number{const height=this.node.style.height;this.node.style.height=target;const value=this.node.getBoundingClientRect().height;this.node.style.height=height;return value}
 set(showing:boolean):void{if(this.showing===showing)return;const wasAuto=this.heightAuto;if(wasAuto||this.showing===undefined){this.height.value=this.node.getBoundingClientRect().height;this.height.velocity=0}this.heightAuto=false;this.showing=showing;this.opacity.target=showing?1:0;this.y.target=showing?0:-8;this.height.target=showing?this.measureHeight('auto'):wasAuto?this.measureHeight('0px'):0;const now=performance.now();this.heightEndTime=now+sampledDuration(this.height,170,26,.9);this.endTime=Math.max(this.heightEndTime,now+sampledDuration(this.opacity,170,26,.9),now+sampledDuration(this.y,170,26,.9));if(!this.frame){this.last=now;this.frame=requestAnimationFrame(this.tick)}}
 private paint():void{this.node.style.opacity=String(this.opacity.value);this.node.style.transform=this.y.value===0?'none':`translateY(${this.y.value}px)`;if(!this.heightAuto)this.node.style.height=this.height.value+'px'}
 private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;let moving=false;for(const value of [this.opacity,this.y,this.height])moving=stepBatch20Spring(value,dt,170,26,.9)||moving;this.paint();if(this.showing&&now>=this.heightEndTime){this.heightAuto=true;this.node.style.height='auto'}const running=moving||now<this.endTime;this.frame=running?requestAnimationFrame(this.tick):0;if(!running&&!this.showing){this.node.style.height='0px';this.exited()}};
 destroy():void{cancelAnimationFrame(this.frame);this.frame=0}
}

import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
const axis=(value:number):Batch20Spring=>({value,target:value,velocity:0,restDelta:.005,restSpeed:.01});
/** Native spring lifecycle for the fixed dock and its pointer feedback. */
export class SmallFloatingDockMotion {
 private opacity=axis(0);private y=axis(20);private scale=axis(.92);private frame=0;private last=0;private endTime=0;private showing:boolean|undefined;private hovered:boolean|undefined;
 private badges=new Map<HTMLElement,Batch20Spring>();private tooltips=new Map<HTMLElement,number>();
 private buttons=new Map<HTMLButtonElement,{scale:Batch20Spring;y:Batch20Spring;hover:boolean;pressed:boolean;remove:()=>void}>();
 constructor(readonly node:HTMLElement,private exited:()=>void){this.y.restDelta=.5;this.y.restSpeed=2;this.paint();this.update(true,false)}
 update(showing:boolean,hovered:boolean):void{const changed=this.showing!==showing||this.hovered!==hovered;this.showing=showing;this.hovered=hovered;this.opacity.target=showing?1:0;this.y.target=showing?0:20;this.scale.target=showing?(hovered?1:.95):.92;this.refreshButtons();const added=this.refreshEntrances();if(changed){let duration=0;for(const value of [this.opacity,this.y,this.scale]){let elapsed=0;for(;elapsed<20000;elapsed+=50){const sample={...value};if(!stepBatch20Spring(sample,elapsed/1000,200,28,.85))break}duration=Math.max(duration,elapsed)}this.endTime=performance.now()+duration}if(changed||added)this.start()}
 private refreshButtons():void{
  for(const [button,state] of this.buttons)if(!this.node.contains(button)){state.remove();this.buttons.delete(button)}
  for(const button of Array.from(this.node.querySelectorAll<HTMLButtonElement>('button')))if(!this.buttons.has(button)){
   const state={scale:axis(1),y:axis(0),hover:false,pressed:false,remove:()=>{}};
   const target=()=>{state.scale.target=state.pressed?.95:state.hover?1.12:1;state.y.target=state.hover?-2:0;this.start()};
   const enter=()=>{state.hover=true;target()},leave=()=>{state.hover=false;target()},down=(event:PointerEvent)=>{if(event.button!==0)return;state.pressed=true;target()},up=()=>{if(!state.pressed)return;state.pressed=false;target()};
   button.addEventListener('mouseenter',enter);button.addEventListener('mouseleave',leave);button.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
   state.remove=()=>{button.removeEventListener('mouseenter',enter);button.removeEventListener('mouseleave',leave);button.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};this.buttons.set(button,state);
  }
 }
 private refreshEntrances():boolean{let added=false;for(const node of this.badges.keys())if(!this.node.contains(node))this.badges.delete(node);for(const node of this.tooltips.keys())if(!this.node.contains(node))this.tooltips.delete(node);
 for(const node of Array.from(this.node.querySelectorAll<HTMLElement>('.k-small-floating-dock-badge')))if(!this.badges.has(node)){const value=axis(0);value.target=1;value.restSpeed=10;this.badges.set(node,value);node.style.transform='scale(0)';added=true}
 for(const node of Array.from(this.node.querySelectorAll<HTMLElement>('.k-small-floating-dock-tooltip')))if(!this.tooltips.has(node)){this.tooltips.set(node,performance.now());node.style.opacity='0';node.style.transform='translateX(-50%) translateY(6px) scale(.9)';added=true}return added}
 private ease(progress:number):number{let low=0,high=1,t=progress;for(let i=0;i<24;i++){t=(low+high)/2;const x=3*(1-t)*t*t*.58+t*t*t;if(x<progress)low=t;else high=t}return 3*(1-t)*t*t+t*t*t}
 private start():void{if(!this.frame){this.last=performance.now();this.frame=requestAnimationFrame(this.tick)}}
 private paint():void{this.node.style.opacity=String(this.opacity.value);this.node.style.transform=`translateY(${this.y.value}px) scale(${this.scale.value})`;for(const [button,state] of this.buttons)button.style.transform=`translateY(${state.y.value}px) scale(${state.scale.value})`}
 private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;let moving=false;for(const value of [this.opacity,this.y,this.scale])moving=stepBatch20Spring(value,dt,200,28,.85)||moving;for(const state of this.buttons.values())for(const value of [state.scale,state.y])moving=stepBatch20Spring(value,dt,380,30,.5)||moving;for(const [node,value] of this.badges){moving=stepBatch20Spring(value,dt,550,30,1)||moving;node.style.transform=`scale(${value.value})`}for(const [node,start] of this.tooltips){const progress=Math.min(1,Math.max(0,(now-start)/150)),eased=this.ease(progress);node.style.opacity=String(eased);node.style.transform=`translateX(-50%) translateY(${6-42*eased}px) scale(${.9+.1*eased})`;moving=progress<1||moving}this.paint();const running=moving||now<this.endTime;this.frame=running?requestAnimationFrame(this.tick):0;if(!running&&!this.showing)this.exited()};
 destroy():void{cancelAnimationFrame(this.frame);this.frame=0;for(const state of this.buttons.values())state.remove();this.buttons.clear();this.badges.clear();this.tooltips.clear()}
}

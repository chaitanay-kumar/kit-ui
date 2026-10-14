import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
interface DockMotionState{width:Batch20Spring;scale:Batch20Spring;pressed:boolean;keyPressed:boolean}
export class FloatingActionDockMotion{
  private states=new Map<HTMLButtonElement,DockMotionState>();private frame=0;private last=0;
  private bindings:[EventTarget,string,EventListener][];
  constructor(private root:HTMLElement){
    this.bindings=[[root,'mousemove',this.move],[root,'mouseleave',this.leave],[root,'pointerdown',this.down],[root,'keydown',this.keydown],[root,'keyup',this.keyup],[root,'blur',this.blur],[window,'pointerup',this.release],[window,'pointercancel',this.release]];
    for(const [target,name,listener]of this.bindings)target.addEventListener(name,listener,name!=='mousemove');
  }
  private state(button:HTMLButtonElement):DockMotionState{
    let state=this.states.get(button);if(!state){state={width:{value:40,target:40,velocity:0},scale:{value:1,target:1,velocity:0},pressed:false,keyPressed:false};this.states.set(button,state)}return state;
  }
  private button(event:Event):HTMLButtonElement|null{const node=event.target instanceof Element?event.target.closest<HTMLButtonElement>('.k-fad-button'):null;return node&&this.root.contains(node)?node:null}
  private start():void{if(!this.frame){this.last=performance.now();this.frame=requestAnimationFrame(this.tick)}}
  private move=(event:Event)=>{const x=(event as MouseEvent).clientX;for(const button of Array.from(this.root.querySelectorAll<HTMLButtonElement>('.k-fad-button'))){const bounds=button.getBoundingClientRect(),state=this.state(button),target=40+16*Math.max(0,1-Math.abs(x-bounds.x-bounds.width/2)/120);if(state.width.target!==target){const granular=Math.abs(target-state.width.value)<5;state.width.restDelta=granular?.005:.5;state.width.restSpeed=granular?.01:2;state.width.target=target;}}this.start()};
  private leave=(event:Event)=>{if(event.target!==this.root)return;for(const button of Array.from(this.root.querySelectorAll<HTMLButtonElement>('.k-fad-button'))){const state=this.state(button);const granular=Math.abs(40-state.width.value)<5;state.width.restDelta=granular?.005:.5;state.width.restSpeed=granular?.01:2;state.width.target=40}this.start()};
  private primary(event:PointerEvent){return event.pointerType==='mouse'?event.button<=0:event.isPrimary!==false}
  private down=(event:Event)=>{const button=this.button(event);if(!button||!this.primary(event as PointerEvent))return;const state=this.state(button);state.pressed=true;state.scale.target=.88;this.start()};
  private release=(event:Event)=>{if(!this.primary(event as PointerEvent))return;let changed=false;for(const state of this.states.values()){if(state.pressed||state.scale.target!==1){state.pressed=false;state.scale.target=1;changed=true}}if(changed)this.start()};
  private fire(button:HTMLButtonElement,type:string):void{button.dispatchEvent(new PointerEvent('pointer'+type,{isPrimary:true,bubbles:true}))}
  private keydown=(event:Event)=>{const button=this.button(event);if(!button||(event as KeyboardEvent).key!=='Enter')return;const state=this.state(button);if(!state.pressed){state.keyPressed=true;this.fire(button,'down')}};
  private keyup=(event:Event)=>{const button=this.button(event);if(!button||(event as KeyboardEvent).key!=='Enter')return;const state=this.state(button);if(state.keyPressed){state.keyPressed=false;this.fire(button,'up')}};
  private blur=(event:Event)=>{const button=this.button(event);if(button){const state=this.state(button);if(state.keyPressed){state.keyPressed=false;this.fire(button,'cancel')}}};
  private tick=(now:number)=>{const dt=Math.max(0,now-this.last)/1000;this.last=now;let active=false;for(const [button,state]of this.states){if(!this.root.contains(button)){this.states.delete(button);continue}active=stepBatch20Spring(state.width,dt,180,14,.1)||active;active=stepBatch20Spring(state.scale,dt,380,30,.5)||active;button.style.width=state.width.value+'px';button.style.height=state.width.value+'px';button.style.transform=`scale(${state.scale.value})`;}this.frame=active?requestAnimationFrame(this.tick):0};
  prune():void{for(const button of this.states.keys())if(!this.root.contains(button))this.states.delete(button);if(!this.states.size){cancelAnimationFrame(this.frame);this.frame=0}}
  destroy():void{cancelAnimationFrame(this.frame);for(const [target,name,listener]of this.bindings)target.removeEventListener(name,listener,name!=='mousemove');this.states.clear()}
}

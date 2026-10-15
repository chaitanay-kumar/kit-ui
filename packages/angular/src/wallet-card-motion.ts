import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';

/** Native counterpart to Motion's default scale spring; no document listeners survive disposal. */
export class WalletCardPressMotion {
  private axis:Batch20Spring={value:1,target:1,velocity:0,restDelta:.005,restSpeed:10};
  private frame=0;
  private last=0;
  private readonly window:Window;
  constructor(private readonly button:HTMLButtonElement){
    this.window=button.ownerDocument.defaultView!;
    button.addEventListener('pointerdown',this.down);
    button.addEventListener('keydown',this.keyDown);
    button.addEventListener('keyup',this.keyUp);
    button.addEventListener('blur',this.up);
    this.window.addEventListener('pointerup',this.up);
    this.window.addEventListener('pointercancel',this.up);
  }
  private down=(event:PointerEvent)=>{if(event.button===0)this.press()};
  private keyDown=(event:KeyboardEvent)=>{if(event.key==='Enter')this.press()};
  private keyUp=(event:KeyboardEvent)=>{if(event.key==='Enter')this.up()};
  private press():void{if(!this.button.disabled&&!this.window.matchMedia('(prefers-reduced-motion: reduce)').matches)this.set(.97)}
  private up=()=>this.set(1);
  private set(target:number):void{if(this.axis.target===target)return;this.axis.target=target;if(!this.frame){this.last=this.window.performance.now();this.frame=this.window.requestAnimationFrame(this.tick)}}
  private tick=(now:number)=>{const moving=stepBatch20Spring(this.axis,(now-this.last)/1000,550,30,1);this.last=now;this.button.style.transform=this.axis.value===1?'none':`scale(${this.axis.value})`;this.frame=moving?this.window.requestAnimationFrame(this.tick):0};
  destroy():void{this.window.cancelAnimationFrame(this.frame);this.button.removeEventListener('pointerdown',this.down);this.button.removeEventListener('keydown',this.keyDown);this.button.removeEventListener('keyup',this.keyUp);this.button.removeEventListener('blur',this.up);this.window.removeEventListener('pointerup',this.up);this.window.removeEventListener('pointercancel',this.up)}
}

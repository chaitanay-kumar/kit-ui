import {Directive,DestroyRef,ElementRef,computed,inject,input,signal,viewChild} from '@angular/core';
import type {FormContent} from './form-parts';
import {nativeClasses} from './native-classes';import {CAR_SMOKE_CLASSES} from './car-smoke-classes';
import {CarSmokeCanvasEngine,carSmokeDimensions,type CarSmokeEngineOptions} from './car-smoke-engine';
import {CarSmokeKeyframes,type CarSmokeValues} from './car-smoke-motion';
import {CarSmokeTimeline,type CarSmokeState,type CarSmokeTimingOptions} from './car-smoke-timeline';
import {ErrorHandler} from '@angular/core';
@Directive()
export abstract class CarSmokeController{
 readonly direction=input<'left-to-right'|'right-to-left','left-to-right'|'right-to-left'|undefined>('left-to-right',{transform:value=>value??'left-to-right'});
 readonly carDuration=input<number,number|undefined>(1350,{transform:value=>value??1350});readonly carDelay=input<number,number|undefined>(0,{transform:value=>value??0});
 readonly carSize=input<'sm'|'md'|'lg','sm'|'md'|'lg'|undefined>('md',{transform:value=>value??'md'});
 readonly smokeDensity=input<'off'|'low'|'medium'|'high','off'|'low'|'medium'|'high'|undefined>('medium',{transform:value=>value??'medium'});
 readonly smokeLifetime=input<number,number|undefined>(1400,{transform:value=>value??1400});readonly showSpeedLines=input<boolean,boolean|undefined>(true,{transform:value=>value??true});
 readonly pageTransitionDelay=input<number,number|undefined>(900,{transform:value=>value??900});readonly pageTransitionDuration=input<number,number|undefined>(400,{transform:value=>value??400});readonly resetDelay=input<number,number|undefined>(350,{transform:value=>value??350});
 readonly onTransitionComplete=input<(()=>void)|undefined>();readonly verticalPosition=input<'center'|'top'|'bottom'|number,'center'|'top'|'bottom'|number|undefined>('center',{transform:value=>value??'center'});
 readonly content=input<FormContent|undefined>();readonly className=input<string,string|undefined>('',{transform:value=>value??''});
 readonly canvas=viewChild<ElementRef<HTMLCanvasElement>>('canvas');readonly car=viewChild<ElementRef<HTMLElement>>('car');readonly backdrop=viewChild<ElementRef<HTMLElement>>('backdrop');readonly state=signal<CarSmokeState>('idle');readonly dark=signal(false);
 readonly values=signal<CarSmokeValues>({x:-1200,y:0,angle:0,steer:0,wheel:0,opacity:0});
 private readonly host=inject<ElementRef<HTMLElement>>(ElementRef);private readonly view=this.host.nativeElement.ownerDocument.defaultView;private timeline:CarSmokeTimeline|undefined;private reduced=false;private engineFrame=0;
 readonly panelClass=computed(()=>nativeClasses('kcar-root',CAR_SMOKE_CLASSES.root,this.className()));
 readonly isLtr=computed(()=>this.direction()==='left-to-right');
 readonly top=computed(()=>this.verticalPosition()==='top'?'30%':this.verticalPosition()==='bottom'?'72%':typeof this.verticalPosition()==='number'?this.verticalPosition()+'%':'50%');
 // Source dimensions are recomputed on React renders, not on every motion-value frame.
 readonly dimensions=computed(()=>{this.state();this.timingOptions();this.engineOptions();this.className();this.content();return carSmokeDimensions(this.carSize(),this.view?.innerWidth??1200)});
 readonly carTransform=computed(()=>{const value=this.values();return[value.x?'translateX('+value.x+'px)':'',value.y?'translateY('+value.y+'px)':'',value.angle?'rotate('+value.angle+'deg)':''].filter(Boolean).join(' ')||'none'});
 private timingOptions():CarSmokeTimingOptions{return{direction:this.direction(),carSize:this.carSize(),carDuration:this.carDuration(),carDelay:this.carDelay(),pageTransitionDelay:this.pageTransitionDelay(),pageTransitionDuration:this.pageTransitionDuration(),resetDelay:this.resetDelay(),onTransitionComplete:this.onTransitionComplete()}}
 private engineOptions():CarSmokeEngineOptions{return{theme:this.dark()?'dark':'light',direction:this.direction(),carSize:this.carSize(),verticalPosition:this.verticalPosition(),smokeDensity:this.smokeDensity(),smokeLifetime:this.smokeLifetime(),showSpeedLines:this.showSpeedLines()}}
 trigger(event:MouseEvent):void{this.timeline?.click(event)}key(event:KeyboardEvent):void{this.timeline?.key(event)}
 private paintMotion(value:CarSmokeValues):void{const car=this.car()?.nativeElement,backdrop=this.backdrop()?.nativeElement;if(car){car.style.transform=this.carTransform();for(const node of Array.from(car.querySelectorAll<SVGElement>('[data-car-axis]'))){const angle=node.getAttribute('data-car-axis')==='steer'?value.steer:value.wheel;node.style.transform=angle===0?'none':'rotate('+angle+'deg)'}}if(backdrop)backdrop.style.opacity=String(value.opacity)}
 constructor(){const view=this.view,errors=inject(ErrorHandler);if(!view)return;const document=this.host.nativeElement.ownerDocument,theme=()=>this.dark.set(document.documentElement.classList.contains('dark'));theme();const observer=new view.MutationObserver(theme);observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  const media=view.matchMedia('(prefers-reduced-motion: reduce)'),preference=()=>this.reduced=media.matches;preference();media.addEventListener('change',preference);
  const motion=new CarSmokeKeyframes(view,value=>{this.values.set(value);this.paintMotion(value)});let options=this.engineOptions();const engine=new CarSmokeCanvasEngine(()=>this.canvas()?.nativeElement??null,()=>options,()=>this.values(),()=>this.timeline?.running??false,()=>view.innerWidth);
  let destroyed=false;const stop=()=>{if(this.engineFrame)view.cancelAnimationFrame(this.engineFrame);this.engineFrame=0;engine.clear()},loop=()=>{if(destroyed)return;engine.frame();if(!destroyed)this.engineFrame=view.requestAnimationFrame(loop)},start=()=>{options=this.engineOptions();engine.clear();if(!this.engineFrame)this.engineFrame=view.requestAnimationFrame(loop)};
  const clear=()=>{const canvas=this.canvas()?.nativeElement;if(canvas)canvas.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height)};
  this.timeline=new CarSmokeTimeline(()=>this.timingOptions(),()=>this.reduced,()=>view.innerWidth,motion,{setTimeout:(callback,duration)=>view.setTimeout(callback,duration),clearTimeout:id=>view.clearTimeout(id)},state=>this.state.set(state),start,stop,clear,error=>errors.handleError(error));
  const resize=()=>{const canvas=this.canvas()?.nativeElement;if(canvas){const dpr=view.devicePixelRatio||1;canvas.width=view.innerWidth*dpr;canvas.height=view.innerHeight*dpr}};resize();view.addEventListener('resize',resize);
  inject(DestroyRef).onDestroy(()=>{destroyed=true;this.timeline?.destroy();view.removeEventListener('resize',resize);media.removeEventListener('change',preference);observer.disconnect()});
 }
}

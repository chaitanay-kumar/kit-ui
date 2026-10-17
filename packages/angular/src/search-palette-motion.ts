import {Batch39Spring} from './batch39-motion';
import {AnimatedTabsIndicatorMotion} from './animated-tabs-motion';

function ease(x:number):number{if(x<=0)return 0;if(x>=1)return 1;let lo=0,hi=1,t=x;for(let i=0;i<22;i++){t=(lo+hi)/2;const p=3*(1-t)*(1-t)*t*.25+3*(1-t)*t*t*.35+t*t*t;if(p<x)lo=t;else hi=t}return 3*(1-t)*(1-t)*t*.1+3*(1-t)*t*t+t*t*t}
/** Descendant presence keeps the non-motion outer element mounted through both exits. */
export class SearchPalettePresence {
 private spring:Batch39Spring;private view:Window;private panel:HTMLElement;private backdrop:HTMLElement;
 private visible:boolean|undefined;private panelDone=false;private backdropDone=false;private opacity=0;private from=0;private start=0;private frame=0;private disposed=false;
 constructor(root:HTMLElement,private kind:'command'|'spotlight',private remove:()=>void){this.view=root.ownerDocument.defaultView!;this.panel=root.querySelector<HTMLElement>('[data-palette-panel]')!;this.backdrop=root.querySelector<HTMLElement>('[data-palette-backdrop]')!;this.backdrop.style.opacity='0';this.spring=new Batch39Spring(this.view,{opacity:0,scale:kind==='command'?.97:.98,y:kind==='command'?-8:-6},380,30,.5,value=>{this.panel.style.opacity=String(value.opacity);this.panel.style.transform=value.scale===1&&value.y===0?'none':'translateY('+value.y+'px) scale('+value.scale+')'},()=>{this.panelDone=true;this.finish()})}
 set(visible:boolean):void{if(this.visible===visible||this.disposed)return;this.visible=visible;this.panelDone=this.backdropDone=false;this.spring.to(visible?{opacity:1,scale:1,y:0}:{opacity:0,scale:this.kind==='command'?.97:.98,y:this.kind==='command'?-8:-6});this.from=this.opacity;this.start=this.view.performance.now();if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=this.view.requestAnimationFrame(this.tick)}
 private tick=(now:number):void=>{this.frame=0;if(this.disposed)return;const t=Math.min(1,(now-this.start)/(this.kind==='command'?300:150));this.opacity=this.from+((this.visible?1:0)-this.from)*ease(t);this.backdrop.style.opacity=String(this.opacity);if(t<1)this.frame=this.view.requestAnimationFrame(this.tick);else{this.backdropDone=true;this.finish()}};
 private finish():void{if(!this.visible&&this.panelDone&&this.backdropDone&&!this.disposed)this.remove()}
 destroy():void{this.disposed=true;this.spring.destroy();if(this.frame)this.view.cancelAnimationFrame(this.frame);this.frame=0}
}
let identity=0;
/** Measure in the panel's untransformed layout space; its own presence transform then composes naturally. */
export class SearchPaletteHighlight {
 private motion:AnimatedTabsIndicatorMotion;private key='kit-spotlight-'+(++identity);
 constructor(private panel:HTMLElement){this.motion=new AnimatedTabsIndicatorMotion(panel,'[data-palette-highlight]',{stiffness:170,damping:26,mass:.9})}
 private measure(action:()=>void):void{const transform=this.panel.style.transform;this.panel.style.transform='none';try{action()}finally{this.panel.style.transform=transform}}
 capture():void{this.measure(()=>this.motion.capture(true))}
 rendered():void{this.measure(()=>this.motion.rendered(this.key))}
 destroy():void{this.motion.destroy()}
}

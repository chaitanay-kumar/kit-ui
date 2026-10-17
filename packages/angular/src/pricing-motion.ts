import {stepBatch20Spring,type Batch20Spring} from './batch20-spring';
/** Source springSmooth entry; CSS owns CTA hover, active and shimmer behavior. */
export class PricingEntryMotion{
 private opacity:Batch20Spring={value:0,target:1,velocity:0,restDelta:.005,restSpeed:.01};private y:Batch20Spring={value:8,target:0,velocity:0,restDelta:.5,restSpeed:2};private frame=0;private last=0;private begins=0;private window:Window;
 constructor(private node:HTMLElement,featured:boolean){this.window=node.ownerDocument.defaultView!;this.last=this.window.performance.now();this.begins=this.last+(featured?50:0);node.style.opacity='0';node.style.transform='translateY(8px)';this.frame=this.window.requestAnimationFrame(this.tick)}
 private tick=(now:number)=>{if(now<this.begins){this.last=now;this.frame=this.window.requestAnimationFrame(this.tick);return}const dt=Math.max(0,now-Math.max(this.last,this.begins))/1000;this.last=now;const opacity=stepBatch20Spring(this.opacity,dt,200,28,.85),y=stepBatch20Spring(this.y,dt,200,28,.85);this.node.style.opacity=String(this.opacity.value);this.node.style.transform=this.y.value===0?'none':'translateY('+this.y.value+'px)';this.frame=opacity||y?this.window.requestAnimationFrame(this.tick):0};
 destroy():void{this.window.cancelAnimationFrame(this.frame);this.frame=0}
}

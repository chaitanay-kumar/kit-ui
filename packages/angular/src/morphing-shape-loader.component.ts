// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
export type ShapeKind='circle'|'square'|'triangle'|'hexagon'|'star'|'pentagon';
let morphLoaderId=0;
function buildShapePath(kind:ShapeKind):string{const anchors:Array<[number,number]>=[];for(let i=0;i<8;i++){const angle=Math.PI*2*i/8-Math.PI/2;let radius=36;if(kind==='square'){const local=((angle+Math.PI/2)%(Math.PI/2))-Math.PI/4;radius=36/Math.cos(local);}else if(kind==='triangle'){const phase=(angle+Math.PI/2)/(Math.PI*2),peak=Math.abs((phase*3%1)-.5),factor=1-Math.min(1,peak*1.6);radius=36*(.45+factor*.55);}else if(kind==='star'){const phase=(angle+Math.PI/2)/(Math.PI*2),within=phase*5-Math.floor(phase*5);radius=36*(within<.5?1:.45);}anchors.push([50+Math.cos(angle)*radius,50+Math.sin(angle)*radius]);}return anchors.map(([x,y],i)=>(i?'L':'M')+x.toFixed(3)+','+y.toFixed(3)).join(' ')+' Z';}
@Component({
 selector:"kit-morphing-shape-loader", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./morphing-shape-loader.css"],
template:`
<div [class]="'k-morph-loader '+className()" [style.width.px]="size()" [style.height.px]="size()" role="status" [attr.aria-label]="label()">
<svg viewBox="0 0 100 100" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
<defs>
<linearGradient [id]="gradientId" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" [attr.stop-color]="foreground()" stop-opacity=".95"/>
<stop offset="100%" [attr.stop-color]="foreground()" stop-opacity=".55"/>
</linearGradient>
</defs>
<path [attr.d]="currentPath()" [attr.fill]="filled()?(reducedMotion()?foreground():'url(#'+gradientId+')'):'none'" [attr.stroke]="filled()?'none':foreground()" [attr.stroke-width]="strokeWidth()*100" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span class="sr-only">{{label()}}</span>
</div>
`
})
export class KitMorphingShapeLoaderComponent {
readonly shapes=input<ShapeKind[],ShapeKind[]|undefined>(['circle','square','triangle','circle'],{transform:value=>value??['circle','square','triangle','circle']});readonly duration=input<number,number|undefined>(1.6,{transform:value=>value??1.6});readonly holdDuration=input<number,number|undefined>(.4,{transform:value=>value??.4});readonly loop=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly size=input<number,number|undefined>(96,{transform:value=>value??96});readonly color=input<string>();readonly strokeWidth=input<number,number|undefined>(.08,{transform:value=>value??.08});readonly filled=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly label=input<string,string|undefined>('Loading',{transform:value=>value??'Loading'});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;readonly index=signal(0);readonly foreground=computed(()=>this.color()??'#FAFAFA');readonly paths=computed(()=>this.shapes().map(shape=>buildShapePath(shape)));readonly currentPath=computed(()=>this.paths()[this.index()]??this.paths()[0]??'');readonly gradientId='morph-loader-fill-'+(++morphLoaderId);private timer:ReturnType<typeof setTimeout>|undefined;ngOnInit():void{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)this.schedule();}private schedule():void{if(this.shapes().length<=1)return;this.timer=setTimeout(()=>{if(!this.loop()&&this.index()===this.shapes().length-1)return;this.index.update(value=>(value+1)%this.shapes().length);this.schedule();},(this.duration()+this.holdDuration())*1000);}constructor(){inject(DestroyRef).onDestroy(()=>{if(this.timer)clearTimeout(this.timer);});}
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import {afterRenderEffect,contentChild,TemplateRef} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {SpeedWarpRenderer} from './speed-warp-renderer';
@Component({
 selector:"kit-speed-warp", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./speed-warp.css"],
template:`
@if(content()||projected()){<div [class]="'k-speed-warp-overlay '+className()">
<canvas #canvas aria-hidden="true" class="k-speed-warp-canvas">
</canvas>
<div class="k-speed-warp-content">
<ng-container [ngTemplateOutlet]="content()||projected()||null"/>
</div>
</div>}@else{<canvas #canvas aria-hidden="true" [class]="'k-speed-warp-canvas '+className()">
</canvas>}
`
})
export class KitSpeedWarpComponent {
readonly speed=input<number,number|undefined>(25,{transform:v=>v===undefined?25:v});readonly starCount=input<number,number|undefined>(600,{transform:v=>v===undefined?600:v});readonly paused=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly content=input<TemplateRef<unknown>|undefined>();readonly projected=contentChild(TemplateRef);readonly canvas=viewChild<ElementRef<HTMLCanvasElement>>('canvas');private renderer:SpeedWarpRenderer|undefined;constructor(){afterRenderEffect(onCleanup=>{const canvas=this.canvas()?.nativeElement,speed=this.speed(),starCount=this.starCount(),paused=this.paused();if(!canvas)return;const context=canvas.getContext('2d'),view=canvas.ownerDocument.defaultView;if(context&&view){const renderer=new SpeedWarpRenderer(canvas,context,view,{speed,starCount,paused});this.renderer=renderer;onCleanup(()=>{renderer.destroy();if(this.renderer===renderer)this.renderer=undefined})}});inject(DestroyRef).onDestroy(()=>this.renderer?.destroy())}
}

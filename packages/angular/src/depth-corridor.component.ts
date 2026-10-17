// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import {ErrorHandler,TemplateRef} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {DepthCorridorMotionDirective} from './depth-corridor-motion';import type {DepthLayer,DepthGeometry} from './depth-corridor-types';export type {DepthLayer} from './depth-corridor-types';
@Component({
 selector:"kit-depth-corridor", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet,DepthCorridorMotionDirective],
encapsulation:ViewEncapsulation.None,styleUrls:["./depth-corridor.css"],
template:`
<div #root role="region" aria-label="3D Depth Corridor Carousel" tabindex="0" [class]="'k-depth-corridor '+className()" [style.perspective]="perspectiveDepth()+'px'" (mousemove)="move($event)" (mouseleave)="leave()" (keydown)="key($event)">
<div class="k-depth-scene">@for(layer of layers();track layer.id;let index=$index){@if(visible(index)){<div [class]="'k-depth-layer'+(index===activeIndex()?' current':'')" [kitDepthMotion]="geometry(index)" (click)="select(index)">@if(layer.title){<div class="k-depth-heading">
<h4>{{layer.title}}</h4>
<span>0{{index+1}}</span>
</div>}@if(layer.subtitle){<p>{{layer.subtitle}}</p>}<div class="k-depth-content">@if(asTemplate(layer.content);as template){<ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{$implicit:layer,index:index}"/>}@else{<ng-container>{{layer.content}}</ng-container>}</div>
</div>}}</div>
<div class="k-depth-nav">
<button type="button" aria-label="Previous layer" [disabled]="activeIndex()===0" (click)="select(activeIndex()-1)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m15 18-6-6 6-6"/>
</svg>
</button>
<div class="k-depth-dots">@for(layer of layers();track $index;let index=$index){<span [class.current]="index===activeIndex()" (click)="select(index)">
</span>}</div>
<button type="button" aria-label="Next layer" [disabled]="activeIndex()===layers().length-1" (click)="select(activeIndex()+1)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 18 6-6-6-6"/>
</svg>
</button>
</div>
</div>
`
})
export class KitDepthCorridorComponent {
readonly layers=input.required<DepthLayer[]>();readonly activeLayerIndex=input<number|undefined>();readonly onLayerChange=input<((index:number)=>void)|undefined>();readonly perspectiveDepth=input<number,number|undefined>(1000,{transform:v=>v===undefined?1000:v});readonly enableParallax=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly internalIndex=signal(0);readonly mouseOffset=signal({x:0,y:0});private readonly errors=inject(ErrorHandler);activeIndex():number{return this.activeLayerIndex()!==undefined?this.activeLayerIndex()!:this.internalIndex()}select(index:number):void{const clamped=Math.max(0,Math.min(this.layers().length-1,index)),callback=this.onLayerChange();if(callback){try{callback(clamped)}catch(error){queueMicrotask(()=>this.errors.handleError(error))}}else this.internalIndex.set(clamped)}visible(index:number):boolean{return Math.abs(index-this.activeIndex())<=3}geometry(index:number):DepthGeometry{const offset=index-this.activeIndex(),distance=Math.abs(offset),mouse=this.mouseOffset(),parallax=this.enableParallax();return {x:offset*45+(parallax?mouse.x*(1-distance*.2):0),y:offset*20+(parallax?mouse.y*(1-distance*.2):0),z:-distance*120,scale:Math.max(.65,1-distance*.12),opacity:offset===0?1:Math.max(.2,.75-distance*.25),blur:offset===0?0:Math.min(8,distance*2.5),rotateY:offset*-6+(parallax?mouse.x*.5:0)}}move(event:MouseEvent):void{const root=this.root()?.nativeElement;if(!this.enableParallax()||!root)return;const rect=root.getBoundingClientRect();this.mouseOffset.set({x:((event.clientX-rect.left)/rect.width-.5)*15,y:((event.clientY-rect.top)/rect.height-.5)*15})}leave():void{this.mouseOffset.set({x:0,y:0})}key(event:KeyboardEvent):void{if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();this.select(this.activeIndex()+1)}else if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();this.select(this.activeIndex()-1)}}asTemplate(content:DepthLayer['content']):TemplateRef<{$implicit:DepthLayer;index:number}>|null{return typeof content==='string'?null:content}
}

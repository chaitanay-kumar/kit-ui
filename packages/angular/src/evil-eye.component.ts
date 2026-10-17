// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import {afterRenderEffect,ErrorHandler} from '@angular/core';import {HangingCharmMotion} from './hanging-charm-motion';import {NativeRootBindings,type NativeAttributes,type NativeStyle} from './native-root-bindings';import {invokeNativeEventCallback} from './native-event-callback';
@Component({
 selector:"kit-evil-eye", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./hanging-charm.css"],
template:`
<div #root [class]="'k-hanging-charm k-hanging-eye '+className()" (click)="clicked($event)" (keydown)="keyed($event)" (pointermove)="moved($event)" (pointerleave)="left($event)">
<div class="k-charm-ceiling">
</div>
<div #body class="k-charm-body">
<svg viewBox="0 0 360 520" aria-hidden="true" class="k-charm-svg">
<defs>
<radialGradient id="ee-disc-body" cx="38%" cy="32%" r="78%">
<stop offset="0%" stop-color="#3A55B0">
</stop>
<stop offset="55%" stop-color="#1B2C73">
</stop>
<stop offset="100%" stop-color="#0A1340">
</stop>
</radialGradient>
<radialGradient id="ee-disc-shadow" cx="65%" cy="80%" r="55%">
<stop offset="0%" stop-color="#04082A" stop-opacity="0.55">
</stop>
<stop offset="100%" stop-color="#04082A" stop-opacity="0">
</stop>
</radialGradient>
<radialGradient id="ee-disc-highlight" cx="32%" cy="22%" r="22%">
<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45">
</stop>
<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0">
</stop>
</radialGradient>
<radialGradient id="ee-disc-rim" cx="50%" cy="50%" r="50%">
<stop offset="92%" stop-color="#3A55B0" stop-opacity="0">
</stop>
<stop offset="100%" stop-color="#3A55B0" stop-opacity="0.9">
</stop>
</radialGradient>
<radialGradient id="ee-ring-white" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="#FFFFFF">
</stop>
<stop offset="100%" stop-color="#D8DCEA">
</stop>
</radialGradient>
<radialGradient id="ee-ring-blue" cx="40%" cy="35%" r="60%">
<stop offset="0%" stop-color="#A6D9F2">
</stop>
<stop offset="100%" stop-color="#5FA8DA">
</stop>
</radialGradient>
<radialGradient id="ee-pupil" cx="40%" cy="35%" r="65%">
<stop offset="0%" stop-color="#1B2C73">
</stop>
<stop offset="100%" stop-color="#04082A">
</stop>
</radialGradient>
<linearGradient id="ee-cap-body" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#D8D8E0">
</stop>
<stop offset="50%" stop-color="#9C9CA8">
</stop>
<stop offset="100%" stop-color="#6A6A78">
</stop>
</linearGradient>
<linearGradient id="ee-cap-rim" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#5A5A66">
</stop>
<stop offset="50%" stop-color="#E8E8F0">
</stop>
<stop offset="100%" stop-color="#5A5A66">
</stop>
</linearGradient>
<linearGradient id="ee-cord" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#1F3FB0">
</stop>
<stop offset="50%" stop-color="#4F7AE8">
</stop>
<stop offset="100%" stop-color="#1F3FB0">
</stop>
</linearGradient>
<radialGradient id="ee-floor" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="#000000" stop-opacity="0.45">
</stop>
<stop offset="100%" stop-color="#000000" stop-opacity="0">
</stop>
</radialGradient>
</defs>
<g data-charm-layer="0" style="transform-origin:50% 50%;transform:none;transform-box:fill-box">
<path d="M166 0 C 158 30, 174 60, 170 92" stroke="url(#ee-cord)" stroke-width="7" fill="none" stroke-linecap="round">
</path>
<path d="M166 0 C 158 30, 174 60, 170 92" stroke="#A8C4F5" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="3 3" opacity="0.85">
</path>
<path d="M194 0 C 202 30, 186 60, 190 92" stroke="url(#ee-cord)" stroke-width="7" fill="none" stroke-linecap="round">
</path>
<path d="M194 0 C 202 30, 186 60, 190 92" stroke="#A8C4F5" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="3 3" opacity="0.85">
</path>
</g>
<g data-charm-layer="1" style="transform-origin:50% 50%;transform:none;transform-box:fill-box">
<rect x="162" y="158" width="36" height="22" rx="6" fill="url(#ee-cap-body)">
</rect>
<rect x="162" y="176" width="36" height="4" fill="url(#ee-cap-rim)" opacity="0.7">
</rect>
<rect x="178.5" y="158" width="3" height="22" fill="#3A3A44" opacity="0.9">
</rect>
<ellipse cx="172" cy="166" rx="8" ry="2" fill="#FFFFFF" opacity="0.4">
</ellipse>
</g>
<g data-charm-layer="2" style="transform-origin:50% 50%;transform:none;transform-box:fill-box">
<circle cx="180" cy="280" r="118" fill="url(#ee-disc-body)">
</circle>
<circle cx="180" cy="280" r="118" fill="url(#ee-disc-shadow)">
</circle>
<circle cx="180" cy="280" r="118" fill="url(#ee-disc-rim)">
</circle>
<ellipse cx="144" cy="232" rx="36" ry="22" fill="url(#ee-disc-highlight)">
</ellipse>
<circle cx="180" cy="280" r="84.96" fill="url(#ee-ring-white)">
</circle>
<circle cx="180" cy="280" r="56.64" fill="url(#ee-ring-blue)">
</circle>
<circle cx="180" cy="280" r="30.68" fill="url(#ee-pupil)">
</circle>
<ellipse cx="170.56" cy="268.2" rx="6" ry="4" fill="#FFFFFF" opacity="0.9">
</ellipse>
<circle cx="191.8" cy="289.44" r="1.6" fill="#FFFFFF" opacity="0.7">
</circle>
</g>
<ellipse cx="180" cy="458" rx="106.2" ry="10" fill="url(#ee-floor)">
</ellipse>
</svg>
</div>@if(caption()){<span class="k-charm-caption">{{caption()}}</span>}</div>
`
})
export class KitEvilEyeComponent {
readonly maxRotation=input<number,number|undefined>(13,{transform:v=>v===undefined?13:v});readonly stiffnessX=input<number,number|undefined>(55,{transform:v=>v===undefined?55:v});readonly stiffnessY=input<number,number|undefined>(45,{transform:v=>v===undefined?45:v});readonly damping=input<number,number|undefined>(9,{transform:v=>v===undefined?9:v});readonly caption=input<string|undefined>();readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly styles=input<NativeStyle|undefined>(undefined,{alias:'style'});readonly attributes=input<NativeAttributes|undefined>();readonly onClick=input<((event:MouseEvent)=>void)|undefined>();readonly onKeyDown=input<((event:KeyboardEvent)=>void)|undefined>();readonly onPointerMove=input<((event:PointerEvent)=>void)|undefined>();readonly onPointerLeave=input<((event:PointerEvent)=>void)|undefined>();readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly body=viewChild<ElementRef<HTMLElement>>('body');private motion:HangingCharmMotion|undefined;private bindings:NativeRootBindings|undefined;private reduced=false;private readonly errors=inject(ErrorHandler);ngOnInit():void{this.reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)').matches:false}clicked(event:MouseEvent):void{invokeNativeEventCallback(this.onClick(),event,this.errors)}keyed(event:KeyboardEvent):void{invokeNativeEventCallback(this.onKeyDown(),event,this.errors)}moved(event:PointerEvent):void{invokeNativeEventCallback(this.onPointerMove(),event,this.errors)}left(event:PointerEvent):void{invokeNativeEventCallback(this.onPointerLeave(),event,this.errors)}constructor(){afterRenderEffect(()=>{const root=this.root()?.nativeElement,body=this.body()?.nativeElement,options={maxRotation:this.maxRotation(),stiffnessX:this.stiffnessX(),stiffnessY:this.stiffnessY(),damping:this.damping()};if(root&&body&&root.ownerDocument.defaultView){if(this.motion)this.motion.configure(options);else this.motion=new HangingCharmMotion(root,body,root.ownerDocument.defaultView,'eye',options,this.reduced);this.bindings??=new NativeRootBindings(root);this.bindings.apply(this.styles(),this.attributes(),{role:'img','aria-label':this.caption()||'Hanging evil eye amulet that swings with the pointer'})}});inject(DestroyRef).onDestroy(()=>this.motion?.destroy())}
}

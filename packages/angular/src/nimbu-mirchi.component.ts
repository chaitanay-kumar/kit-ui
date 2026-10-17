// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import {afterRenderEffect,ErrorHandler} from '@angular/core';import {HangingCharmMotion} from './hanging-charm-motion';import {NativeRootBindings,type NativeAttributes,type NativeStyle} from './native-root-bindings';import {invokeNativeEventCallback} from './native-event-callback';
@Component({
 selector:"kit-nimbu-mirchi", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./hanging-charm.css"],
template:`
<div #root [class]="'k-hanging-charm k-hanging-nimbu '+className()" (click)="clicked($event)" (keydown)="keyed($event)" (pointermove)="moved($event)" (pointerleave)="left($event)">
<div class="k-charm-ceiling">
</div>
<div #body class="k-charm-body">
<div class="k-charm-string">
</div>
<svg viewBox="0 0 360 520" aria-hidden="true" class="k-charm-svg">
<defs>
<linearGradient id="nm-chilli-body" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#3F8B2A">
</stop>
<stop offset="55%" stop-color="#2E6B1E">
</stop>
<stop offset="100%" stop-color="#234F18">
</stop>
</linearGradient>
<linearGradient id="nm-chilli-shine" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#9BD86A" stop-opacity="0.85">
</stop>
<stop offset="100%" stop-color="#9BD86A" stop-opacity="0">
</stop>
</linearGradient>
<linearGradient id="nm-chilli-dark" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#1E3F14">
</stop>
<stop offset="100%" stop-color="#0F2409">
</stop>
</linearGradient>
<radialGradient id="nm-lemon-body" cx="40%" cy="35%" r="75%">
<stop offset="0%" stop-color="#FFE36B">
</stop>
<stop offset="60%" stop-color="#F2C72F">
</stop>
<stop offset="100%" stop-color="#C2901A">
</stop>
</radialGradient>
<radialGradient id="nm-lemon-shadow" cx="65%" cy="80%" r="55%">
<stop offset="0%" stop-color="#7A5A0E" stop-opacity="0.45">
</stop>
<stop offset="100%" stop-color="#7A5A0E" stop-opacity="0">
</stop>
</radialGradient>
<radialGradient id="nm-lemon-highlight" cx="35%" cy="30%" r="22%">
<stop offset="0%" stop-color="#FFFBE0" stop-opacity="0.9">
</stop>
<stop offset="100%" stop-color="#FFFBE0" stop-opacity="0">
</stop>
</radialGradient>
<linearGradient id="nm-knot-body" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#3A3A3A">
</stop>
<stop offset="100%" stop-color="#161616">
</stop>
</linearGradient>
</defs>
<g data-charm-layer="0" style="transform-origin:50% 50%;transform:none;transform-box:fill-box">
<g transform="rotate(-3 180 60)">
<path d="M50 30 C 80 14, 220 16, 305 50 C 318 56, 318 70, 305 76 C 220 100, 90 96, 56 80 C 42 70, 38 42, 50 30 Z" fill="url(#nm-chilli-body)">
</path>
<path d="M50 30 C 80 14, 220 16, 305 50 C 318 56, 318 70, 305 76 C 220 100, 90 96, 56 80 C 42 70, 38 42, 50 30 Z" fill="url(#nm-chilli-dark)" opacity="0.35">
</path>
<path d="M70 32 C 140 24, 230 26, 290 50" stroke="url(#nm-chilli-shine)" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.9">
</path>
<ellipse cx="305" cy="60" rx="5" ry="3.4" fill="#1B3A11">
</ellipse>
<ellipse cx="303.5" cy="59" rx="2" ry="1.2" fill="#2E5A1F" opacity="0.8">
</ellipse>
</g>
<g transform="rotate(2 180 60)">
<path d="M30 92 C 90 78, 260 82, 320 110 C 332 118, 330 130, 316 138 C 240 158, 90 156, 44 142 C 28 134, 18 102, 30 92 Z" fill="url(#nm-chilli-body)">
</path>
<path d="M30 92 C 90 78, 260 82, 320 110 C 332 118, 330 130, 316 138 C 240 158, 90 156, 44 142 C 28 134, 18 102, 30 92 Z" fill="url(#nm-chilli-dark)" opacity="0.35">
</path>
<path d="M60 96 C 150 86, 250 88, 308 112" stroke="url(#nm-chilli-shine)" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.9">
</path>
<ellipse cx="320" cy="120" rx="5" ry="3.4" fill="#1B3A11">
</ellipse>
<ellipse cx="318.5" cy="119" rx="2" ry="1.2" fill="#2E5A1F" opacity="0.8">
</ellipse>
</g>
<g transform="rotate(-2 180 60)">
<path d="M52 158 C 100 144, 250 146, 308 170 C 322 178, 320 192, 304 198 C 230 218, 90 216, 60 200 C 44 192, 40 168, 52 158 Z" fill="url(#nm-chilli-body)">
</path>
<path d="M52 158 C 100 144, 250 146, 308 170 C 322 178, 320 192, 304 198 C 230 218, 90 216, 60 200 C 44 192, 40 168, 52 158 Z" fill="url(#nm-chilli-dark)" opacity="0.35">
</path>
<path d="M70 162 C 160 152, 240 154, 296 174" stroke="url(#nm-chilli-shine)" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.9">
</path>
<ellipse cx="308" cy="180" rx="5" ry="3.4" fill="#1B3A11">
</ellipse>
<ellipse cx="306.5" cy="179" rx="2" ry="1.2" fill="#2E5A1F" opacity="0.8">
</ellipse>
</g>
<g transform="rotate(4 180 60)">
<path d="M40 220 C 90 206, 260 208, 314 232 C 326 240, 322 254, 308 260 C 230 278, 100 276, 52 262 C 38 254, 28 230, 40 220 Z" fill="url(#nm-chilli-body)">
</path>
<path d="M40 220 C 90 206, 260 208, 314 232 C 326 240, 322 254, 308 260 C 230 278, 100 276, 52 262 C 38 254, 28 230, 40 220 Z" fill="url(#nm-chilli-dark)" opacity="0.35">
</path>
<path d="M64 224 C 160 214, 250 216, 302 236" stroke="url(#nm-chilli-shine)" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.9">
</path>
<ellipse cx="314" cy="240" rx="5" ry="3.4" fill="#1B3A11">
</ellipse>
<ellipse cx="312.5" cy="239" rx="2" ry="1.2" fill="#2E5A1F" opacity="0.8">
</ellipse>
</g>
</g>
<g data-charm-layer="1" style="transform-origin:50% 50%;transform:none;transform-box:fill-box">
<ellipse cx="180" cy="340" rx="92" ry="86" fill="url(#nm-lemon-body)">
</ellipse>
<ellipse cx="188" cy="350" rx="92" ry="86" fill="url(#nm-lemon-shadow)">
</ellipse>
<ellipse cx="158" cy="312" rx="36" ry="22" fill="url(#nm-lemon-highlight)">
</ellipse>
<path d="M254 332 q 6 -2 10 4 q -2 8 -10 6 z" fill="#C28A12" opacity="0.85">
</path>
<circle cx="142" cy="332" r="1.6" fill="#E0A91A" opacity="0.55">
</circle>
<circle cx="208" cy="322" r="1.4" fill="#E0A91A" opacity="0.55">
</circle>
<circle cx="168" cy="370" r="1.6" fill="#E0A91A" opacity="0.5">
</circle>
<circle cx="216" cy="362" r="1.4" fill="#E0A91A" opacity="0.5">
</circle>
<circle cx="138" cy="356" r="1.2" fill="#E0A91A" opacity="0.45">
</circle>
<circle cx="184" cy="338" r="1.2" fill="#E0A91A" opacity="0.4">
</circle>
</g>
<g>
<rect x="152" y="418" width="56" height="28" rx="6" fill="url(#nm-knot-body)">
</rect>
<rect x="179" y="418" width="2" height="28" fill="#0A0A0A" opacity="0.7">
</rect>
<rect x="164" y="418" width="1" height="28" fill="#2A2A2A" opacity="0.6">
</rect>
</g>
<g data-charm-layer="2" style="transform-origin:50% 50%;transform:none;transform-box:fill-box">
<path d="M168 446 C 162 466, 174 482, 158 500 C 152 506, 156 514, 150 520" stroke="#5A5A5A" stroke-width="1.4" fill="none" stroke-linecap="round">
</path>
<path d="M180 446 C 188 466, 172 482, 188 500 C 196 508, 192 514, 200 520" stroke="#777777" stroke-width="1.1" fill="none" stroke-linecap="round">
</path>
<path d="M156 446 C 144 462, 156 478, 142 494" stroke="#8C8C8C" stroke-width="1" fill="none" stroke-linecap="round">
</path>
</g>
</svg>
</div>@if(caption()){<span class="k-charm-caption">{{caption()}}</span>}</div>
`
})
export class KitNimbuMirchiComponent {
readonly maxRotation=input<number,number|undefined>(13,{transform:v=>v===undefined?13:v});readonly stiffnessX=input<number,number|undefined>(55,{transform:v=>v===undefined?55:v});readonly stiffnessY=input<number,number|undefined>(45,{transform:v=>v===undefined?45:v});readonly damping=input<number,number|undefined>(9,{transform:v=>v===undefined?9:v});readonly caption=input<string|undefined>();readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly styles=input<NativeStyle|undefined>(undefined,{alias:'style'});readonly attributes=input<NativeAttributes|undefined>();readonly onClick=input<((event:MouseEvent)=>void)|undefined>();readonly onKeyDown=input<((event:KeyboardEvent)=>void)|undefined>();readonly onPointerMove=input<((event:PointerEvent)=>void)|undefined>();readonly onPointerLeave=input<((event:PointerEvent)=>void)|undefined>();readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly body=viewChild<ElementRef<HTMLElement>>('body');private motion:HangingCharmMotion|undefined;private bindings:NativeRootBindings|undefined;private reduced=false;private readonly errors=inject(ErrorHandler);ngOnInit():void{this.reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)').matches:false}clicked(event:MouseEvent):void{invokeNativeEventCallback(this.onClick(),event,this.errors)}keyed(event:KeyboardEvent):void{invokeNativeEventCallback(this.onKeyDown(),event,this.errors)}moved(event:PointerEvent):void{invokeNativeEventCallback(this.onPointerMove(),event,this.errors)}left(event:PointerEvent):void{invokeNativeEventCallback(this.onPointerLeave(),event,this.errors)}constructor(){afterRenderEffect(()=>{const root=this.root()?.nativeElement,body=this.body()?.nativeElement,options={maxRotation:this.maxRotation(),stiffnessX:this.stiffnessX(),stiffnessY:this.stiffnessY(),damping:this.damping()};if(root&&body&&root.ownerDocument.defaultView){if(this.motion)this.motion.configure(options);else this.motion=new HangingCharmMotion(root,body,root.ownerDocument.defaultView,'nimbu',options,this.reduced);this.bindings??=new NativeRootBindings(root);this.bindings.apply(this.styles(),this.attributes(),{role:'img','aria-label':this.caption()||'Hanging nimbu-mirchi charm that swings with the pointer'})}});inject(DestroyRef).onDestroy(()=>this.motion?.destroy())}
}

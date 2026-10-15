// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, inject, input, viewChild } from '@angular/core';
import {NgZone} from '@angular/core';import {CircularOrbitMotion,DEFAULT_ORBIT_ITEMS} from './circular-orbit-motion';import type {OrbitItem} from './circular-orbit-motion';export type {OrbitItem} from './circular-orbit-motion';
@Component({
 selector:"kit-circular-orbit", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./circular-orbit.css"],
template:`
<section #root [class]="'k-circular-orbit '+className()" role="region" [attr.aria-label]="title()||'Circular floating gallery'">
<div #container [class]="'k-orbit-container '+containerClassName()">@for(item of items();track item.id){<div class="k-orbit-tile" aria-hidden="true" [style.margin-left.px]="-(item.size??92)/2" [style.margin-top.px]="-(item.size??92)/2">
<div [class]="'k-orbit-image '+(item.className??'')" style="border-radius:6px" [style.width.px]="item.size??92" [style.height.px]="item.size??92">
<img [src]="item.src" alt="" draggable="false" loading="lazy" decoding="async"/>
<span class="k-orbit-edge">
</span>
</div>
</div>}<div class="k-orbit-heading" aria-hidden="true">
<h1 [class]="titleClassName()">{{title()}}</h1>
</div>
</div>
</section>
`
})
export class KitCircularOrbitComponent {
readonly items=input<OrbitItem[],OrbitItem[]|undefined>(DEFAULT_ORBIT_ITEMS,{transform:v=>v??DEFAULT_ORBIT_ITEMS});readonly title=input<string,string|undefined>('Push',{transform:v=>v??'Push'});readonly speed=input<number,number|undefined>(.00022,{transform:v=>v??.00022});readonly radius=input<number,number|undefined>(270,{transform:v=>v??270});readonly pauseOnHover=input<boolean,boolean|undefined>(true,{transform:v=>v??true});readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly containerClassName=input<string,string|undefined>('',{transform:v=>v??''});readonly titleClassName=input<string,string|undefined>('',{transform:v=>v??''});readonly root=viewChild.required<ElementRef<HTMLElement>>('root');readonly container=viewChild.required<ElementRef<HTMLElement>>('container');private motion:CircularOrbitMotion|undefined;private zone=inject(NgZone);private options(){return {items:this.items(),speed:this.speed(),radius:this.radius(),pauseOnHover:this.pauseOnHover()};}ngAfterViewInit():void{this.zone.runOutsideAngular(()=>{this.motion=new CircularOrbitMotion(this.root().nativeElement,this.container().nativeElement,this.options());});}ngOnChanges():void{this.zone.runOutsideAngular(()=>this.motion?.update(this.options()));}ngAfterViewChecked():void{this.motion?.paint();}ngOnDestroy():void{this.motion?.destroy();}
}

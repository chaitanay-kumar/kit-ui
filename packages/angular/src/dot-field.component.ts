// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, inject, input, viewChild } from '@angular/core';
import {NgZone,type SimpleChanges} from '@angular/core';import {DotFieldDrawing} from './dot-field-drawing';
@Component({
 selector:"kit-dot-field,div[kitDotField]", standalone:true,
 host:{'[style.display]':'native ? null : "contents"','[class]':'native ? rootClass() : ""','[style]':'native ? styles() : null','aria-hidden':'true'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./dot-field.css"],
template:`
@if(native){<canvas #canvas class="k-dot-field-canvas">
</canvas>}@else{<div #root [class]="rootClass()" [style]="styles()" aria-hidden="true">
<canvas #canvas class="k-dot-field-canvas">
</canvas>
</div>}
`
})
export class KitDotFieldComponent {
readonly host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;readonly native=this.host.tagName==='DIV';readonly rootClass=computed(()=>'k-dot-field '+this.className());readonly dotRadius=input<number,number|undefined>(1.5,{transform:v=>v??1.5});readonly dotSpacing=input<number,number|undefined>(14,{transform:v=>v??14});readonly gradientFrom=input<string,string|undefined>('rgba(255, 255, 255, 0.12)',{transform:v=>v??'rgba(255, 255, 255, 0.12)'});readonly gradientTo=input<string,string|undefined>('rgba(255, 255, 255, 0.04)',{transform:v=>v??'rgba(255, 255, 255, 0.04)'});readonly className=input<string,string|undefined>('',{transform:v=>v??''});readonly styles=input<Record<string,string|number>|undefined>(undefined,{alias:'style'});readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly canvas=viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');private drawing:DotFieldDrawing|undefined;private zone=inject(NgZone);private options(){return {dotRadius:this.dotRadius(),dotSpacing:this.dotSpacing(),gradientFrom:this.gradientFrom(),gradientTo:this.gradientTo()};}ngAfterViewInit():void{this.zone.runOutsideAngular(()=>{this.drawing=new DotFieldDrawing(this.native?this.host:this.root()!.nativeElement,this.canvas().nativeElement,this.options());});}ngOnChanges(changes:SimpleChanges):void{if(['dotRadius','dotSpacing','gradientFrom','gradientTo'].some(key=>key in changes))this.zone.runOutsideAngular(()=>this.drawing?.update(this.options()));}ngOnDestroy():void{this.drawing?.destroy();}
}

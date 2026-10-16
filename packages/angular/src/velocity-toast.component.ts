// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, effect, input, signal, untracked, viewChild } from '@angular/core';
import {TemplateRef} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {VelocityToastMotion} from './velocity-toast-motion';export type VelocityToastVariant='default'|'success'|'warning'|'error'|'info';export type VelocityToastPosition='top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right';
@Component({
 selector:"kit-velocity-toast", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./velocity-toast.css"],
template:`
<div [class]="'k-velocity-position '+position()">@if(present()){<div #toast [class]="'k-velocity-toast '+rendered().className" role="status" aria-live="polite" (mouseenter)="isPaused.set(true)" (mouseleave)="isPaused.set(false)">
<div class="k-velocity-row">
<div [class]="'k-velocity-icon '+(rendered().icon?'custom':rendered().variant)">@if(iconTemplate();as template){<ng-container [ngTemplateOutlet]="template"/>}@else if(rendered().icon){ {{rendered().icon}} }@else{<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">@switch(rendered().variant){@case('success'){<path d="M20 6 9 17l-5-5"/>}@case('warning'){<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
<path d="M12 9v4M12 17h.01"/>}@case('error'){<circle cx="12" cy="12" r="10"/>
<path d="M12 8v4M12 16h.01"/>}@default{<circle cx="12" cy="12" r="10"/>
<path d="M12 16v-4M12 8h.01"/>}}</svg>}</div>
<div class="k-velocity-copy">
<p>{{rendered().title}}</p>@if(rendered().description){<p>{{rendered().description}}</p>}</div>
<button type="button" class="k-velocity-close" aria-label="Close notification" (click)="dismiss()">
<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M18 6 6 18M6 6l12 12"/>
</svg>
</button>
</div>@if(rendered().showProgress){<div class="k-velocity-progress">
<div [style.width.%]="displayProgress()">
</div>
</div>}</div>}</div>
`
})
export class KitVelocityToastComponent {
readonly open=input.required<boolean>();readonly title=input.required<string>();readonly description=input<string|undefined>();readonly onDismiss=input<(()=>void)|undefined>();readonly duration=input<number,number|undefined>(4000,{transform:v=>v===undefined?4000:v});readonly variant=input<VelocityToastVariant,VelocityToastVariant|undefined>('default',{transform:v=>v===undefined?'default':v});readonly position=input<VelocityToastPosition,VelocityToastPosition|undefined>('bottom-center',{transform:v=>v===undefined?'bottom-center':v});readonly showProgress=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly icon=input<TemplateRef<unknown>|string|number|null|undefined>();readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly isVisible=signal(false);readonly isPaused=signal(false);readonly progress=signal(100);readonly displayProgress=signal(100);private visualFrame=0;private drawProgress():void{if(!this.visualFrame)this.visualFrame=requestAnimationFrame(()=>{this.visualFrame=0;this.displayProgress.set(this.progress())})}readonly present=signal(false);readonly toast=viewChild<ElementRef<HTMLElement>>('toast');private remaining=4000;private start=0;private progressFrame=0;private motion:VelocityToastMotion|undefined;private snapshot:{title:string;description:string|undefined;variant:VelocityToastVariant;icon:TemplateRef<unknown>|string|number|null|undefined;className:string;showProgress:boolean;top:boolean}|undefined;
readonly current=computed(()=>({title:this.title(),description:this.description(),variant:this.variant(),icon:this.icon(),className:this.className(),showProgress:this.showProgress(),top:this.position().startsWith('top')}));rendered(){return this.isVisible()?this.current():this.snapshot??this.current()}iconTemplate():TemplateRef<unknown>|null{const icon=this.rendered().icon;return icon instanceof TemplateRef?icon:null}
dismiss():void{this.isVisible.set(false);this.onDismiss()?.()}
constructor(){effect(()=>{const open=this.open(),duration=this.duration();untracked(()=>{if(!open){this.isVisible.set(false);return}this.isVisible.set(true);this.progress.set(100);this.drawProgress();this.remaining=duration;this.start=performance.now()})});effect(cleanup=>{const visible=this.isVisible(),paused=this.isPaused(),duration=this.duration(),show=this.showProgress(),callback=this.onDismiss();if(!visible||!show)return;this.start=performance.now()-(duration-this.remaining);if(paused)return;const tick=()=>{const remaining=Math.max(0,duration-(performance.now()-this.start));this.remaining=remaining;this.progress.set(Math.pow(remaining/duration,1.05)*100);this.drawProgress();if(remaining<=0){this.progressFrame=0;this.isVisible.set(false);callback?.();return}this.progressFrame=requestAnimationFrame(tick)};this.progressFrame=requestAnimationFrame(tick);cleanup(()=>{cancelAnimationFrame(this.progressFrame);this.progressFrame=0})});effect(()=>{const visible=this.isVisible(),current=this.current();if(visible){this.snapshot=current;this.present.set(true)}untracked(()=>this.motion?.set(visible,this.snapshot?.top??current.top,visible?undefined:()=>this.present.set(false)))});effect(cleanup=>{const node=this.toast()?.nativeElement;if(!node)return;untracked(()=>{const top=this.rendered().top,motion=new VelocityToastMotion(node,top,([opacity,y,scale])=>{node.style.opacity=String(opacity);node.style.transform='translateY('+y+'px) scale('+scale+')'});this.motion=motion;motion.set(this.isVisible(),top,this.isVisible()?undefined:()=>this.present.set(false));cleanup(()=>{motion.destroy();if(this.motion===motion)this.motion=undefined})})});}
ngOnDestroy():void{cancelAnimationFrame(this.visualFrame);cancelAnimationFrame(this.progressFrame);this.visualFrame=0;this.progressFrame=0}
}

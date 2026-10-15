// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {TemplateRef,ViewEncapsulation} from '@angular/core';
export type UndoToastVariant='default'|'success'|'warning'|'error'|'info';
export type UndoToastPosition='top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right';
@Component({
 selector:"kit-undo-toast", standalone:true,
 host:{style:'display:contents'},
 imports:[NgTemplateOutlet],
encapsulation:ViewEncapsulation.None,styleUrls:["./undo-toast.css"],
template:`
<div [class]="'k-undo-position k-'+position()">@if(visible()){<article [class]="'k-undo-toast '+className()" role="status" aria-live="polite" (mouseenter)="paused.set(true)" (mouseleave)="paused.set(false)">
<div class="k-undo-icon">@if(restored()){✓}@else if(template(icon());as custom){<ng-container [ngTemplateOutlet]="custom"/>}@else{ {{variantIcon()}} }</div>
<div>
<strong>{{restored()?restoredMessage():title()}}</strong>@if(description()&&!restored()){<p>{{description()}}</p>}</div>
<div>@if(!restored()){<button type="button" (click)="undo()">↶ {{undoLabel()}}</button>}<button type="button" aria-label="Close notification" (click)="dismiss()">×</button>
</div>@if(showProgress()&&!restored()){<i class="k-undo-progress" [style.width.%]="progress()">
</i>}</article>}</div>
`
})
export class KitUndoToastComponent {
readonly open=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly title=input<string,string|undefined>('Project archived',{transform:value=>value??'Project archived'});readonly description=input<string,string|undefined>('Changes will be permanent in a few seconds',{transform:value=>value??'Changes will be permanent in a few seconds'});readonly undoLabel=input<string,string|undefined>('Undo',{transform:value=>value??'Undo'});readonly restoredMessage=input<string,string|undefined>('Restored successfully',{transform:value=>value??'Restored successfully'});readonly duration=input<number,number|undefined>(5000,{transform:value=>value??5000});readonly variant=input<UndoToastVariant,UndoToastVariant|undefined>('default',{transform:value=>value??'default'});readonly position=input<UndoToastPosition,UndoToastPosition|undefined>('bottom-center',{transform:value=>value??'bottom-center'});readonly onUndo=input<(()=>void)|undefined>();readonly onDismiss=input<(()=>void)|undefined>();readonly showProgress=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly icon=input<TemplateRef<unknown>>();readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly visible=signal(true);readonly restored=signal(false);readonly paused=signal(false);readonly progress=signal(100);private interval:ReturnType<typeof setInterval>|undefined;private restoredTimer:ReturnType<typeof setTimeout>|undefined;private lastTick=Date.now();constructor(){effect(()=>{const open=this.open(),duration=this.duration();untracked(()=>{this.visible.set(open);if(open){this.restored.set(false);this.progress.set(100);this.start(duration);}else this.stop();});});inject(DestroyRef).onDestroy(()=>{this.stop();if(this.restoredTimer)clearTimeout(this.restoredTimer);});}private start(duration:number):void{this.stop();if(duration<=0)return;this.lastTick=Date.now();this.interval=setInterval(()=>{const now=Date.now();if(!this.paused()){const next=Math.max(0,this.progress()-(now-this.lastTick)/duration*100);this.progress.set(next);if(next<=0)this.dismiss();}this.lastTick=now;},50);}private stop():void{if(this.interval){clearInterval(this.interval);this.interval=undefined;}}dismiss():void{if(!this.visible())return;this.visible.set(false);this.stop();this.onDismiss()?.();}undo():void{if(this.restored())return;this.restored.set(true);this.stop();this.onUndo()?.();this.restoredTimer=setTimeout(()=>this.dismiss(),1400);}variantIcon():string{return({default:'⌫',success:'✓',warning:'!',error:'!',info:'i'})[this.variant()];}template(value:TemplateRef<unknown>|undefined):TemplateRef<unknown>|null{return value??null;}
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ViewEncapsulation} from '@angular/core';
export interface GreetingItem{text:string;lang?:string;}
export type IntroGreeting=string|GreetingItem;
const defaultGreetings:GreetingItem[]=[{text:'Hello',lang:'EN'},{text:'Hola',lang:'ES'},{text:'Bonjour',lang:'FR'},{text:'Ciao',lang:'IT'},{text:'こんにちは',lang:'JA'},{text:'नमस्कार',lang:'HI'}];
@Component({
 selector:"kit-intro-loader", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./intro-loader.css"],
template:`
@if(stage()==='greeting'){<section [class]="'k-intro '+(fullScreen()?'k-intro-full ':'')+className()" role="dialog" [attr.aria-modal]="fullScreen()" aria-label="Welcome intro screen">
<span class="sr-only" aria-live="polite" aria-atomic="true">{{current()?.text}}</span>@if(allowSkip()){<button type="button" class="k-intro-skip" aria-label="Skip welcome sequence" (click)="finish()">Skip <kbd>ESC</kbd>
</button>}<div class="k-intro-greeting">
<strong>{{current()?.text}}</strong>@if(showLangBadge()&&current()?.lang){<small>{{current()?.lang}}</small>}</div>@if(showProgress()){<i class="k-intro-progress">
<span [style.width.%]="progress()">
</span>
</i>}</section>}@else if(!fullScreen()){<div [class]="'k-intro-replay '+className()">
<button type="button" aria-label="Replay intro animation" (click)="replay()">↻ Replay Intro</button>
</div>}
`
})
export class KitIntroLoaderComponent {
readonly greetings=input<IntroGreeting[],IntroGreeting[]|undefined>(defaultGreetings,{transform:value=>value??defaultGreetings});readonly onComplete=input<(()=>void)|undefined>();readonly fullScreen=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly intervalMs=input<number,number|undefined>(240,{transform:value=>value??240});readonly showProgress=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly showLangBadge=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly allowSkip=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly speedMultiplier=input<number,number|undefined>(1,{transform:value=>value??1});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly index=signal(0);readonly stage=signal<'greeting'|'done'>('greeting');readonly normalized=computed<GreetingItem[]>(()=>this.greetings().map(item=>typeof item==='string'?{text:item}:item));readonly current=computed(()=>this.normalized()[this.index()]??this.normalized()[0]);readonly progress=computed(()=>this.stage()==='greeting'?(this.index()+1)/this.normalized().length*100:100);private interval:ReturnType<typeof setInterval>|undefined;private finishTimer:ReturnType<typeof setTimeout>|undefined;private readonly document=inject(DOCUMENT);private readonly key=(event:KeyboardEvent)=>{if(event.key==='Escape'&&this.allowSkip()&&this.stage()!=='done'){event.preventDefault();this.finish();}};ngOnInit():void{this.document.defaultView?.addEventListener('keydown',this.key);if(this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches)this.finish();else this.start();}private start():void{this.stop();this.index.set(0);const items=this.normalized();if(!items.length){this.finish();return;}const adjusted=Math.max(100,Math.round(this.intervalMs()/this.speedMultiplier()));this.interval=setInterval(()=>{if(this.index()<items.length-1)this.index.update(value=>value+1);else{if(this.interval)clearInterval(this.interval);this.finishTimer=setTimeout(()=>this.finish(),Math.round(450/this.speedMultiplier()));}},adjusted);}private stop():void{if(this.interval)clearInterval(this.interval);if(this.finishTimer)clearTimeout(this.finishTimer);this.interval=undefined;this.finishTimer=undefined;}finish():void{if(this.stage()==='done')return;this.stop();this.stage.set('done');this.onComplete()?.();}replay():void{this.stage.set('greeting');this.start();}constructor(){inject(DestroyRef).onDestroy(()=>{this.stop();this.document.defaultView?.removeEventListener('keydown',this.key);});}
}

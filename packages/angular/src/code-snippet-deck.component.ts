// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import {afterEveryRender,afterRenderEffect,ErrorHandler} from '@angular/core';import type {SnippetItem,SnippetParameter} from './code-snippet-deck-types';import {Batch39IconComponent} from './batch39-icons';import {copyDataDetails} from './data-details-copy';import {CodeDeckTabs} from './code-deck-tabs';import {NativeRootBindings,type NativeAttributes,type NativeStyle} from './native-root-bindings';import {invokeNativeEventCallback} from './native-event-callback';export type {SnippetItem,SnippetParameter} from './code-snippet-deck-types';export type {NativeAttributes as CodeSnippetDeckAttributes,NativeStyle as CodeSnippetDeckStyle} from './native-root-bindings';
@Component({
 selector:"kit-code-snippet-deck", standalone:true,
 host:{style:'display:contents'},
 imports:[Batch39IconComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./code-snippet-deck.css"],
template:`
<div #root role="region" aria-label="Multi-runtime code snippet deck" [class]="'k-code-deck '+className()" (click)="rootClick($event)" (keydown)="rootKey($event)">
<div class="k-code-header">
<div class="k-code-identity">@if(showWindowBar()){<div class="k-code-window">
<span>
</span>
<span>
</span>
<span>
</span>
</div>}@if(activeSnippet()?.filename){<div class="k-code-filename">
<svg kitBatch39Icon icon="terminal"/>
<span>{{activeSnippet()!.filename}}</span>
</div>}</div>
<div class="k-code-tabs">@for(snippet of snippets();track snippet.language){<button type="button" [class.selected]="activeLang()===snippet.language" (click)="choose(snippet.language)">@if(activeLang()===snippet.language){<div class="k-code-tab-indicator">
</div>}<span>{{snippet.label}}</span>
</button>}</div>
<div class="k-code-tools">@if(parameters().length){<button type="button" title="Customize snippet parameters" class="k-code-params-toggle" [class.open]="showConfig()" (click)="showConfig.set(!showConfig())">
<svg kitBatch39Icon icon="sliders"/>
<span>Params</span>
</button>}<button type="button" title="Copy code" class="k-code-copy" (click)="copy()">
<svg kitBatch39Icon [icon]="copied()?'check':'copy'" [class.copied]="copied()"/>
<span>{{copied()?'Copied':'Copy'}}</span>
</button>
</div>
</div>@if(showConfig()&&parameters().length){<div class="k-code-config">
<div class="k-code-config-title">
<svg kitBatch39Icon icon="sparkles"/>
<span>Interactive Variables:</span>
</div>@for(param of parameters();track param.id){@switch(param.type){@case('boolean'){<label class="k-code-boolean">
<input type="checkbox" [checked]="!!paramValues()[param.id]" (change)="setParam(param.id,$any($event.target).checked)"/>
<span>{{param.label}}</span>
</label>}@case('select'){<div class="k-code-select">
<span>{{param.label}}:</span>
<select [value]="paramValues()[param.id]" (change)="setParam(param.id,$any($event.target).value)">@for(option of param.options;track option){<option [value]="option">{{option}}</option>}</select>
</div>}@case('text'){<div class="k-code-text">
<span>{{param.label}}:</span>
<input type="text" [value]="paramValues()[param.id]||''" (input)="setParam(param.id,$any($event.target).value)"/>
</div>}}}</div>}<div class="k-code-scroll">
<pre>@for(line of codeLines();track $index;let index=$index){<div class="k-code-line" [class.highlighted]="activeSnippet()?.highlightLines?.includes(index+1)">@if(showLineNumbers()){<span class="k-code-number">{{index+1}}</span>}<span class="k-code-text-line">{{line||' '}}</span>
</div>}</pre>
</div>
<div class="k-code-footer">
<span>Runtime: {{activeSnippet()?.label}}</span>
<span>{{codeLines().length}} lines</span>
</div>
</div>
`
})
export class KitCodeSnippetDeckComponent {
readonly snippets=input<SnippetItem[],SnippetItem[]|undefined>([],{transform:v=>v===undefined?[]:v});readonly parameters=input<SnippetParameter[],SnippetParameter[]|undefined>([],{transform:v=>v===undefined?[]:v});readonly defaultLanguage=input<string|undefined>();readonly showLineNumbers=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly showWindowBar=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly styles=input<NativeStyle|undefined>(undefined,{alias:'style'});readonly attributes=input<NativeAttributes|undefined>();readonly onClick=input<((event:MouseEvent)=>void)|undefined>();readonly onKeyDown=input<((event:KeyboardEvent)=>void)|undefined>();readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly activeLang=signal('typescript');readonly copied=signal(false);readonly showConfig=signal(false);readonly paramValues=signal<Record<string,any>>({});readonly activeSnippet=computed(()=>this.snippets().find(snippet=>snippet.language===this.activeLang())||this.snippets()[0]);readonly resolvedCode=computed(()=>{const snippet=this.activeSnippet();return !snippet?'':typeof snippet.code==='function'?snippet.code(this.paramValues()):snippet.code});readonly codeLines=computed(()=>this.resolvedCode().split('\n'));private readonly errors=inject(ErrorHandler);private tabs:CodeDeckTabs|undefined;private bindings:NativeRootBindings|undefined;private timers=new Set<number>();ngOnInit():void{this.activeLang.set(this.defaultLanguage()||this.snippets()[0]?.language||'typescript');this.paramValues.set(Object.fromEntries(this.parameters().map(param=>[param.id,param.defaultValue])))}choose(language:string):void{this.tabs?.capture();this.activeLang.set(language)}setParam(id:string,value:any):void{this.paramValues.update(previous=>({...previous,[id]:value}))}copy():void{const view=this.root()?.nativeElement.ownerDocument.defaultView;if(!view)return;void copyDataDetails(this.resolvedCode(),view);this.copied.set(true);const timer=view.setTimeout(()=>{this.timers.delete(timer);this.copied.set(false)},2000);this.timers.add(timer)}rootClick(event:MouseEvent):void{invokeNativeEventCallback(this.onClick(),event,this.errors)}rootKey(event:KeyboardEvent):void{invokeNativeEventCallback(this.onKeyDown(),event,this.errors)}constructor(){afterRenderEffect(()=>{const root=this.root()?.nativeElement;if(root){this.tabs??=new CodeDeckTabs(root);this.bindings??=new NativeRootBindings(root);this.bindings.apply(this.styles(),this.attributes(),{role:'region','aria-label':'Multi-runtime code snippet deck'})}});afterEveryRender(()=>this.tabs?.rendered());inject(DestroyRef).onDestroy(()=>{this.tabs?.destroy();const view=this.root()?.nativeElement.ownerDocument.defaultView;for(const timer of this.timers)view?.clearTimeout(timer);this.timers.clear()})}
}

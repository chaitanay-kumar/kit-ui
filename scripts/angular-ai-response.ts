import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Copy,Check,RotateCw,ThumbsUp,ThumbsDown,ExternalLink,ChevronDown,Sparkles,AlertCircle,Wrench} from 'lucide-react';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import {buildScopedUtilityDefaults} from './angular-scoped-utilities';

const utilities=new Map<string,string>();
function u(value:string):string{const name='kar-'+createHash('sha256').update(value).digest('hex').slice(0,10);utilities.set(name,value);return name+' '+value}
const icon=(name:string,classes='w-3.5 h-3.5')=>`<svg kitAiIcon icon="${name}" class="${u(classes)}"/>`;
const caller=(value:string)=>`[class]="classes('${u(value).split(' ')[0]}')"`;
interface Part{name:string;selector:string;base?:string;imports:string;body?:string;template:string}
const parts:Part[]=[];
const add=(part:Part)=>parts.push(part);

add({name:'KitAiResponseCodeBlockComponent',selector:'kit-ai-response-code-block',base:'AIResponseCodeController',imports:'KitAiResponseIconComponent,KitAiResponsePressDirective',template:`
<div ${caller('my-4 overflow-hidden rounded-xl border border-border/60 bg-surface-raised/30 dark:bg-surface-raised/15 font-sans text-xs')}>
 <div class="${u('flex items-center justify-between border-b border-border/40 bg-surface-raised/25 px-3.5 sm:px-4 py-2')}"><div class="${u('flex items-center gap-2 min-w-0')}"><span class="${u('text-xs font-normal text-muted-foreground truncate')}">{{filename()||language()}}</span></div>
  <button [kitAiPress]=".96" type="button" (click)="copy($event)" [attr.aria-label]="copied()?'Code copied':'Copy code to clipboard'" class="${u('flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer')}">
   @if(copied()){${icon('check','w-3 h-3 text-emerald-500 stroke-[2.5]')}<span class="${u('text-emerald-500 font-normal')}">Copied</span>}@else{${icon('copy','w-3 h-3')}<span class="${u('font-normal')}">Copy</span>}
  </button></div>
 <div class="${u('overflow-x-auto p-3 sm:p-4 text-foreground/90 leading-relaxed font-sans')}"><pre class="${u('font-sans text-xs leading-relaxed select-text')}"><code>{{code()}}</code></pre></div>
</div>`});

add({name:'KitAiResponseInlineComponent',selector:'kit-ai-response-inline',imports:'KitAiResponseIconComponent',body:'readonly text=input.required<string>();readonly tokens=computed(()=>aiResponseInline(this.text()));',template:`@for(part of tokens();track $index){@switch(part.type){@case('text'){<ng-container>{{part.text}}</ng-container>}@case('strong'){<strong class="${u('font-semibold text-foreground')}">{{part.text}}</strong>}@case('code'){<code class="${u('rounded px-1.5 py-0.5 bg-muted/40 border border-border/40 text-xs font-sans text-foreground')}">{{part.text}}</code>}@case('link'){<a [href]="part.url" target="_blank" rel="noopener noreferrer" class="${u('inline-flex items-center gap-1 text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors')}"><span>{{part.text}}</span>${icon('external','w-2.5 h-2.5 text-muted-foreground inline')}</a>}}}`});

add({name:'KitAiResponseHeaderComponent',selector:'kit-ai-response-header',base:'AIResponseHeaderController',imports:'NgTemplateOutlet,KitAiResponseIconComponent,KitFormContentComponent',template:`
<div ${caller('flex items-center justify-between gap-2.5 sm:gap-4 pb-3.5 sm:pb-4 border-b border-border/50 select-none')}>
 <div class="${u('flex items-center gap-2 sm:gap-2.5 min-w-0')}"><div class="${u('text-foreground/80 shrink-0')}">@if(icon()){@if(iconTemplate()){<ng-container [ngTemplateOutlet]="iconTemplate()" [ngTemplateOutletInjector]="contentInjector"/>}@else{<kit-form-content [content]="icon()"/>}}@else{${icon('sparkles','w-4 h-4 stroke-[2]')}}</div><span class="${u('text-sm font-medium text-foreground tracking-tight truncate')}">{{title()}}</span>
  @if(badge()){<span class="${u('inline-flex items-center gap-1.5 text-xs text-muted-foreground font-normal')}"><span class="${u('text-border')}">/</span><span>{{badge()}}</span></span>}
 </div>
 <div class="${u('flex items-center gap-2.5 sm:gap-3 shrink-0 text-xs text-muted-foreground font-normal')}">
  @if(response.status()==='streaming'){<span class="${u('flex items-center gap-1.5 text-foreground font-medium')}"><span class="${u('w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse')}"></span><span>Streaming</span></span>}
  @if(response.status()==='generating'){<span class="${u('flex items-center gap-1.5 text-muted-foreground')}">${icon('rotate','w-3 h-3 animate-spin')}<span>Thinking</span></span>}
  @if(timestamp()){<span class="${u('hidden sm:inline')}">{{timestamp()}}</span>}
 </div>
</div>`});

add({name:'KitAiResponseContentComponent',selector:'kit-ai-response-content',base:'AIResponseContentController',imports:'KitAiResponseIconComponent,KitAiResponseInlineComponent,KitAiResponseCodeBlockComponent',body:'readonly blocks=computed(()=>parseAIResponseMarkdown(this.response.content()));',template:`
@if(response.status()==='generating'&&!response.content()){
 <div class="${u('py-8 space-y-4 font-sans')}" role="status" aria-label="Generating response"><div class="${u('flex items-center gap-2 text-xs text-muted-foreground')}">${icon('rotate','w-3 h-3 animate-spin text-foreground')}<span>Synthesizing response...</span></div><div class="${u('space-y-2.5 pt-1')}"><div class="${u('h-2.5 w-3/4 rounded-full bg-muted/40 animate-pulse')}"></div><div class="${u('h-2.5 w-11/12 rounded-full bg-muted/40 animate-pulse')}"></div><div class="${u('h-2.5 w-1/2 rounded-full bg-muted/40 animate-pulse')}"></div></div></div>
}@else if(response.status()==='error'){
 <div class="${u('my-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-500 flex items-start gap-3 font-sans')}" role="alert">${icon('alert','w-4 h-4 shrink-0 mt-0.5')}<div class="${u('space-y-1')}"><p class="${u('font-medium text-foreground')}">Unable to complete response generation</p><p class="${u('text-muted-foreground')}">{{response.content()||'An unexpected connection or model timeout occurred. Please retry.'}}</p></div></div>
}@else if(!response.content()&&response.status()==='idle'){
 <div class="${u('py-8 text-center text-xs text-muted-foreground font-sans')}">Ready to generate response.</div>
}@else{
 <div ${caller('py-4 text-sm leading-relaxed text-foreground/85 space-y-3.5 font-sans')} role="region" [attr.aria-live]="response.status()==='streaming'?'polite':'off'">
 @for(block of blocks();track $index){@switch(block.type){
  @case('heading'){@switch(block.level){@case(1){<h2 class="${u('text-base font-semibold text-foreground tracking-tight pt-2')}">{{block.content}}</h2>}@case(2){<h3 class="${u('text-sm font-semibold text-foreground tracking-tight pt-2')}">{{block.content}}</h3>}@default{<h4 class="${u('text-xs font-medium text-foreground pt-1')}">{{block.content}}</h4>}}}
  @case('paragraph'){<p class="${u('text-sm text-foreground/85 leading-relaxed')}"><kit-ai-response-inline [text]="block.content||''"/></p>}
  @case('code'){<kit-ai-response-code-block [language]="block.language" [code]="block.content||''"/>}
  @case('list'){<ul class="${u('space-y-1.5 pl-4 list-disc text-sm text-foreground/85 marker:text-muted-foreground')}">@for(item of block.items;track $index){<li><kit-ai-response-inline [text]="item"/></li>}</ul>}
  @case('blockquote'){<blockquote class="${u('border-l-2 border-border/70 pl-4 py-1 my-3 text-sm italic text-muted-foreground')}"><kit-ai-response-inline [text]="block.content||''"/></blockquote>}
  @case('table'){<div class="${u('my-4 overflow-x-auto rounded-xl border border-border/60 bg-surface/30')}"><table class="${u('w-full border-collapse text-left text-xs font-sans')}"><thead><tr class="${u('border-b border-border/60 bg-surface-raised/30 text-xs font-medium text-muted-foreground')}">@for(header of block.headers;track $index){<th class="${u('px-4 py-2.5 font-medium')}">{{header}}</th>}</tr></thead><tbody class="${u('divide-y divide-border/40 text-xs')}">@for(row of block.rows;track $index){<tr class="${u('hover:bg-surface-hover/50 transition-colors')}">@for(cell of row;track $index){<td class="${u('px-4 py-2.5 text-foreground/80')}">{{cell}}</td>}</tr>}</tbody></table></div>}
 }}
 @if(response.status()==='streaming'){<span class="${u('inline-block w-1.5 h-3.5 ml-1 align-middle bg-foreground rounded-xs animate-pulse')}"></span>}
 </div>
}`});

add({name:'KitAiResponseSourcesComponent',selector:'kit-ai-response-sources',base:'AIResponseSourcesController',imports:'KitAiResponseIconComponent,KitAiResponsePresenceDirective',template:`
@if(items().length){<div ${caller('pt-3 border-t border-border/50 font-sans')}>
 <button type="button" (click)="toggle()" [attr.aria-expanded]="expanded()" class="${u('flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1')}"><svg kitAiIcon icon="chevron" [class]="'${u('w-3.5 h-3.5 transition-transform duration-200')} '+(expanded()?'${u('rotate-180')}':'')"/><span>{{title()}} ({{items().length}})</span></button>
 @if(panelPresent()){<div [kitAiPresence]="panelLeaving()" (exited)="finishExit()" class="${u('overflow-hidden')}"><div class="${u('grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3')}">
 @for(source of panelItems();track source.id||$index){<a [href]="source.url||'#'" target="_blank" rel="noopener noreferrer" class="${u('flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-border/50 bg-surface-raised/20 hover:bg-surface-raised/40 transition-colors group cursor-pointer')}"><span class="${u('text-xs text-muted-foreground font-medium shrink-0 pt-0.5')}">{{$index+1}}.</span><div class="${u('min-w-0 flex-1')}"><div class="${u('flex items-center justify-between gap-1')}"><p class="${u('text-xs font-medium text-foreground group-hover:text-foreground transition-colors truncate')}">{{source.title}}</p>${icon('external','w-3 h-3 text-muted-foreground/60 group-hover:text-foreground shrink-0 transition-colors')}</div>@if(source.snippet){<p class="${u('text-xs text-muted-foreground line-clamp-1 mt-0.5')}">{{source.snippet}}</p>}</div></a>}
 </div></div>}
</div>}`});

add({name:'KitAiResponseToolsSummaryComponent',selector:'kit-ai-response-tools-summary',base:'AIResponseToolsController',imports:'KitAiResponseIconComponent,KitAiResponsePresenceDirective,KitAiResponsePressDirective',template:`
@if(!(toolCount()<=0)){<div ${caller('py-1 font-sans')}>
 <button [kitAiPress]=".98" type="button" (click)="toggleDetails($event)" class="${u('inline-flex items-center gap-2 rounded-lg border border-border/50 bg-surface-raised/20 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer')}">${icon('wrench','w-3 h-3 text-muted-foreground')}<span>Used {{toolCount()}} {{toolCount()===1?'tool':'tools'}}</span><svg kitAiIcon icon="chevron" [class]="'${u('w-3 h-3 transition-transform duration-200')} '+(expanded()?'${u('rotate-180')}':'')"/></button>
 @if(panelPresent()){<div [kitAiPresence]="panelLeaving()" (exited)="finishExit()" class="${u('overflow-hidden mt-2 space-y-1.5')}">@for(tool of panelItems();track $index){<div class="${u('flex items-center justify-between px-3 py-1.5 rounded-lg border border-border/40 bg-surface-raised/15 text-xs')}"><span class="${u('text-foreground/80 truncate')}">{{tool.name}}</span>@if(tool.duration){<span class="${u('text-muted-foreground tabular-nums shrink-0 ml-2')}">{{tool.duration}}</span>}</div>}</div>}
</div>}`});

add({name:'KitAiResponseActionsComponent',selector:'kit-ai-response-actions',base:'AIResponseActionsController',imports:'KitAiResponseIconComponent,KitAiResponsePressDirective',template:`
<div ${caller('flex items-center justify-between pt-3.5 sm:pt-4 border-t border-border/50 font-sans select-none')}>
 <div class="${u('flex items-center gap-1.5 sm:gap-2')}"><button [kitAiPress]=".96" type="button" (click)="response.copyContent($event)" title="Copy response" [attr.aria-label]="response.copied()?'Response copied':'Copy response'" class="${u('flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer min-h-[32px]')}">@if(response.copied()){${icon('check','w-3.5 h-3.5 text-emerald-500 stroke-[2.5]')}}@else{${icon('copy')}}<span [class]="response.copied()?'${u('text-emerald-500')}':''">{{response.copied()?'Copied':'Copy'}}</span></button>
 @if(response.onRegenerate()){<button [kitAiPress]=".96" type="button" (click)="response.regenerate($event)" [disabled]="busy()" title="Regenerate response" aria-label="Regenerate response" class="${u('flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-h-[32px]')}"><svg kitAiIcon icon="rotate" [class]="'${u('w-3.5 h-3.5')} '+(busy()?'${u('animate-spin')}':'')"/><span>Regenerate</span></button>}
 </div>
 <div class="${u('flex items-center gap-1')}"><button [kitAiPress]=".94" type="button" (click)="response.giveFeedback('like',$event)" title="Good response" aria-label="Good response" [class]="variants(variants('${u('p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center')} '+(response.feedback()==='like'?'${u('text-foreground bg-surface-raised')}':'')))">${icon('like')}</button><button [kitAiPress]=".94" type="button" (click)="response.giveFeedback('dislike',$event)" title="Poor response" aria-label="Poor response" [class]="variants(variants('${u('p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center')} '+(response.feedback()==='dislike'?'${u('text-foreground bg-surface-raised')}':'')))">${icon('dislike')}</button></div>
</div>`});

export const aiResponsePort={
 id:'ai-response',kind:'plain' as const,controller:'AIResponseRootController',description:'Native compound AI response with source markdown, externally supplied streaming status, citations, tools, copy and feedback ownership.',stylesFile:'./ai-response.css',hostMetadata:"{class:'kar-native',style:'display:contents'}",providers:"[{provide:AI_RESPONSE_CONTEXT,useFactory:()=>inject(KitAiResponseComponent).contextValue}]",
 imports:"import {TemplateRef,Injector} from '@angular/core';import {NgTemplateOutlet} from '@angular/common';import {AIResponseRootController,AI_RESPONSE_CONTEXT} from './ai-response-state';import {KitAiResponseHeaderComponent,KitAiResponseContentComponent,KitAiResponseSourcesComponent,KitAiResponseActionsComponent} from './ai-response-parts';import {KitFormContentComponent} from './form-parts';export * from './ai-response-parts';export {AI_RESPONSE_CONTEXT,injectAIResponse,type AIResponseContextValue} from './ai-response-state';export * from './ai-response-types';",
 componentImports:'NgTemplateOutlet,KitFormContentComponent,KitAiResponseHeaderComponent,KitAiResponseContentComponent,KitAiResponseSourcesComponent,KitAiResponseActionsComponent',
 body:'readonly contentInjector=inject(Injector);readonly childrenTemplate=computed(()=>this.children() instanceof TemplateRef?this.children() as TemplateRef<unknown>:null);',
 template:`<div ${caller('w-full font-sans rounded-2xl border border-border/70 bg-surface/50 dark:bg-surface/25 p-4 sm:p-7 text-foreground transition-colors')} style="font-family:var(--font-sans, 'Geist', sans-serif)" [style.--accent-custom]="accentColor()||null">
 @if(children()){@if(childrenTemplate()){<ng-container [ngTemplateOutlet]="childrenTemplate()" [ngTemplateOutletInjector]="contentInjector"/>}@else{<kit-form-content [content]="children()"/>}}@else{<ng-content><kit-ai-response-header/><kit-ai-response-content/>@if(sources().length){<kit-ai-response-sources [sources]="sources()"/>}<kit-ai-response-actions/></ng-content>}
</div>`,
 inputs:['content: string','status: AIResponseStatus','modelName: string','sources: AIResponseSource[]','accentColor: string','onRegenerate: () => void','onFeedback: (type: \'like\' | \'dislike\') => void','children: FormContent','className: string'],outputs:[],
};

export async function buildAIResponseParts(root:string):Promise<void>{
 const directory=path.join(root,'packages/angular/src');
 const icons={copy:Copy,check:Check,rotate:RotateCw,like:ThumbsUp,dislike:ThumbsDown,external:ExternalLink,chevron:ChevronDown,sparkles:Sparkles,alert:AlertCircle,wrench:Wrench};
 const cases=Object.entries(icons).map(([name,Component])=>{const markup=renderToStaticMarkup(createElement(Component)),inner=markup.slice(markup.indexOf('>')+1,markup.lastIndexOf('</svg>')).replace(/<(\/?)(path|circle|rect|line|polyline|polygon|ellipse|g)\b/g,'<$1svg:$2');return '@case('+JSON.stringify(name)+'){'+inner+'}'}).join('');
 fs.writeFileSync(path.join(directory,'ai-response-icons.ts'),`// Generated from installed Lucide geometry by scripts/angular-ai-response.ts.\nimport {Component,input} from '@angular/core';\n@Component({selector:'svg[kitAiIcon]',standalone:true,host:{viewBox:'0 0 24 24',width:'24',height:'24',fill:'none',stroke:'currentColor','stroke-width':'2','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'},template:${JSON.stringify('@switch(icon()){'+cases+'}')}})\nexport class KitAiResponseIconComponent{readonly icon=input('sparkles')}\n`);
 const imports=`import {Component,ViewEncapsulation,computed,input} from '@angular/core';\nimport {NgTemplateOutlet} from '@angular/common';\nimport {AIResponseCodeController,AIResponseHeaderController,AIResponseContentController,AIResponseSourcesController,AIResponseToolsController,AIResponseActionsController} from './ai-response-state';\nimport {KitAiResponseIconComponent} from './ai-response-icons';\nimport {KitAiResponsePresenceDirective,KitAiResponsePressDirective} from './ai-response-motion';\nimport {KitFormContentComponent} from './form-parts';\nimport {parseAIResponseMarkdown,aiResponseInline} from './ai-response-content';\n`;
 const definitions=parts.map(part=>`@Component({selector:${JSON.stringify(part.selector)},standalone:true,host:{style:'display:contents',class:'kar-native'},imports:[${part.imports}],encapsulation:ViewEncapsulation.None,styleUrls:['./ai-response.css'],template:${JSON.stringify(part.template)}})\nexport class ${part.name}${part.base?' extends '+part.base:''}{${part.body??''}}\n`).join('\n');
 fs.writeFileSync(path.join(directory,'ai-response-parts.ts'),'// Generated from scripts/angular-ai-response.ts; edit authored definitions.\n'+imports+definitions);
 fs.writeFileSync(path.join(directory,'ai-response-classes.ts'),'// Generated from scripts/angular-ai-response.ts.\nexport const AI_RESPONSE_CLASSES:Record<string,string>='+JSON.stringify(Object.fromEntries(utilities),null,2)+';\n');
 const rules=[...utilities].map(([name,value])=>'.'+name+'{@apply '+value.split(/\s+/).filter(token=>token!=='group').join(' ')+';}').join('\n');
 const css=await postcss([tailwind()]).process('@reference "../src/styles/index.css";@layer components{'+rules+'}',{from:path.join(root,'scripts/angular-ai-response.css')});
 const defaults=await buildScopedUtilityDefaults(root,'.kar-native',[...utilities.values()]);
 const reset='@layer components{:where(.kar-native,.kar-native *,.kar-native *::before,.kar-native *::after){box-sizing:border-box;border-width:0;border-style:solid}:where(.kar-native button){font:inherit;color:inherit;padding:0;background:transparent}:where(.kar-native h2,.kar-native h3,.kar-native h4,.kar-native p,.kar-native pre,.kar-native ul,.kar-native blockquote){margin:0}:where(.kar-native h2,.kar-native h3,.kar-native h4){font:inherit;font-family:var(--font-heading,var(--font-sans,sans-serif))}:where(.kar-native ul){padding:0;list-style:none}:where(.kar-native svg){display:block;vertical-align:middle}:where(.kar-native table){text-indent:0;border-color:inherit;border-collapse:collapse}}\n';
 fs.writeFileSync(path.join(directory,'ai-response.css'),'/* Generated from scripts/angular-ai-response.ts; default styles need no consumer Tailwind build. */\n'+reset+defaults+css.css+'\n');
}

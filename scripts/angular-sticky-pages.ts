export const stickyPagesPort = {
  description: 'Native CSS sticky page stacking with configurable height/offsets, data content and projected page templates.',
  stylesFile: './sticky-pages.css',
  hostMetadata: "{style:'display:contents'}",
  imports: `import {NgTemplateOutlet} from '@angular/common';
import {TemplateRef,contentChildren} from '@angular/core';
export interface StickyPageItem{id?:string|number;title?:string;subtitle?:string;description?:string;badge?:string;content?:string|number|TemplateRef<unknown>;className?:string;bg?:string;}`,
  componentImports: 'NgTemplateOutlet',
  template: `<div [class]="'k-sticky-pages '+className()">
    @for(page of renderedPages();track $index;let index=$index){<div class="k-sticky-page-card" [style.top.px]="topOffset()+index*stackOffset()" [style.height]="pageHeight()" [style.z-index]="index+1"><div [class]="'k-sticky-page-surface '+(page.bg===undefined?'k-sticky-default-bg':page.bg)+' '+(page.className??'')"><div class="k-sticky-page-content">
    @if(template(page.content);as content){<ng-container [ngTemplateOutlet]="content"/>}@else if(page.content){ {{page.content}} }@else{<div class="k-sticky-page-default">@if(page.badge){<span class="k-sticky-page-badge">{{page.badge}}</span>}@if(page.subtitle){<span class="k-sticky-page-subtitle">{{page.subtitle}} • 0{{index+1}} / 0{{renderedPages().length}}</span>}@if(page.title){<h2>{{page.title}}</h2>}@if(page.description){<p>{{page.description}}</p>}</div>}
    </div></div></div>}
  </div>`,
  body: `readonly pages=input<StickyPageItem[]|undefined>();
readonly pageHeight=input<string,string|undefined>('100vh',{transform:v=>v===undefined?'100vh':v});
readonly topOffset=input<number,number|undefined>(0,{transform:v=>v===undefined?0:v});
readonly stackOffset=input<number,number|undefined>(0,{transform:v=>v===undefined?0:v});
// React currently accepts these options without applying them to the cards.
readonly rounded=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});
readonly shadow=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});
readonly border=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});
readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});
readonly children=contentChildren<TemplateRef<unknown>>('stickyPage',{descendants:true});
readonly renderedPages=computed<StickyPageItem[]>(()=>this.children().length?this.children().map(content=>({content})):this.pages()??[]);
template(value:StickyPageItem['content']):TemplateRef<unknown>|null{return value instanceof TemplateRef?value:null;}`,
  inputs:['pages: StickyPageItem[]','pageHeight: string','topOffset: number','stackOffset: number','rounded: boolean','shadow: boolean','border: boolean','className: string'],
  outputs:[],
};

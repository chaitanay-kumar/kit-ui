// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import {afterEveryRender,NgZone} from '@angular/core';import {BranchingSubmenuPanelMotion,BranchingSubmenuLayoutMotion} from './branching-submenu-motion';import {AnimatedTabsIndicatorMotion} from './animated-tabs-motion';export interface BranchingSubmenuItem{id:string;label:string;description?:string;children?:Array<{id:string;label:string;description?:string}>}const DEFAULT_BRANCHING_ITEMS:BranchingSubmenuItem[]=[{id:'build',label:'Build',description:'Component pipeline',children:[{id:'registry',label:'Registry sync',description:'Generate shadcn entries'},{id:'types',label:'Type check',description:'Validate exports'},{id:'audit',label:'SEO audit',description:'Review metadata'}]},{id:'review',label:'Review',description:'Quality gates',children:[{id:'motion',label:'Motion pass',description:'Reduce noise'},{id:'a11y',label:'Accessibility',description:'Keyboard and focus'}]}];
@Component({
 selector:"kit-branching-submenu", standalone:true,
 host:{'style':'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./branching-submenu.css"],
template:`
<div #root [class]="'k-branching-submenu '+className()" role="navigation" [attr.aria-label]="label()" (keydown)="dispatchKeys($event)">
<div class="k-branching-grid">
<div class="k-branching-parents">@for(item of items();track item.id;let index=$index){<button type="button" class="k-branching-parent" [class.k-branching-selected]="item.id===active()?.id" [attr.aria-expanded]="item.id===active()?.id&&open()" (focus)="focusIndex.set(index)" (mouseenter)="choose(item.id)" (click)="choose(item.id)">@if(item.id===active()?.id){<span class="k-branching-pill" [class.k-branching-static]="reduced()">
</span>}<span class="k-branching-parent-text">
<span class="k-branching-title">{{item.label}}</span>@if(item.description){<span class="k-branching-description">{{item.description}}</span>}</span>
<svg aria-hidden="true" class="k-branching-chevron" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m9 18 6-6-6-6"/>
</svg>
</button>}</div>
<div class="k-branching-branch">
<div class="k-branching-connector" aria-hidden="true">
</div>@for(item of displayed()?[displayed()!]:[];track item.id){<div class="k-branching-panel">
<div class="k-branching-heading">
<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>
<path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/>
<path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>
</svg>
<span>{{item.label}}</span>
</div>
<div class="k-branching-children">@for(child of item.children||[];track child.id){<button type="button" class="k-branching-child">
<span class="k-branching-twig" aria-hidden="true">
</span>
<span class="k-branching-child-text">
<span class="k-branching-title">{{child.label}}</span>@if(child.description){<span class="k-branching-description">{{child.description}}</span>}</span>
</button>}</div>
</div>}</div>
</div>
</div>
`
})
export class KitBranchingSubmenuComponent {
readonly items=input<BranchingSubmenuItem[],BranchingSubmenuItem[]|undefined>(DEFAULT_BRANCHING_ITEMS,{transform:value=>value===undefined?DEFAULT_BRANCHING_ITEMS:value});readonly label=input<string,string|undefined>('Branching navigation',{transform:value=>value===undefined?'Branching navigation':value});readonly className=input<string,string|undefined>('',{transform:value=>value===undefined?'':value});readonly styles=input<Record<string,string|number|null|undefined>|undefined>(undefined,{alias:'style'});readonly attributes=input<Record<string,string|number|boolean|null|undefined>|undefined>();readonly onKeyDown=input<((event:KeyboardEvent)=>void)|undefined>();private previousStyle:Record<string,string|number|null|undefined>={};private previousAttributes:Record<string,string|number|boolean|null|undefined>={};readonly root=viewChild.required<ElementRef<HTMLElement>>('root');readonly activeId=signal<string|undefined>(undefined);readonly active=computed(()=>this.items().find(item=>item.id===this.activeId())||this.items()[0]);readonly focusIndex=signal(0);readonly open=signal(true);readonly keyboard=signal(false);readonly reduced=signal(false);private lastFocus='';readonly displayed=signal<BranchingSubmenuItem|undefined>(undefined);private pending:BranchingSubmenuItem|undefined;private exiting=false;private initialized=false;private initialPanel=true;private panelMotion:BranchingSubmenuPanelMotion|undefined;private indicatorMotion:AnimatedTabsIndicatorMotion|undefined;private layoutMotion:BranchingSubmenuLayoutMotion|undefined;private skipLayout=false;private zone=inject(NgZone);
ngOnInit():void{this.activeId.set(this.items()[0]?.id);this.initialized=true;this.syncPanel();if(typeof window!=='undefined'&&window.matchMedia){this.reduced.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches)}}
get element():HTMLElement{return this.root().nativeElement}
dispatchKeys(event:KeyboardEvent):void{const handler=this.onKeyDown();if(handler)handler(event);else this.keys(event)}
private applyBindings():void{const node=this.root().nativeElement,styles=this.styles()??{},cssName=(key:string)=>key==='cssFloat'?'float':key.startsWith('--')?key:key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),unitless=new Set('animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth'.split(' '));for(const key of Object.keys(this.previousStyle))if(!(key in styles))node.style.removeProperty(cssName(key));for(const [key,value] of Object.entries(styles))if(value!==this.previousStyle[key])node.style.setProperty(cssName(key),value==null?'':typeof value==='number'&&value!==0&&!key.startsWith('--')&&!unitless.has(key)?value+'px':String(value));this.previousStyle={...styles};const attrs={role:'navigation','aria-label':this.label(),...this.attributes()},booleans=new Set('hidden inert itemscope'.split(' '));for(const key of Object.keys(this.previousAttributes))if(!(key in attrs))node.removeAttribute(key);for(const [key,value] of Object.entries(attrs)){if(value==null||booleans.has(key.toLowerCase())&&!value)node.removeAttribute(key);else node.setAttribute(key,booleans.has(key.toLowerCase())?'':String(value))}this.previousAttributes={...attrs}}
choose(id:string):void{this.indicatorMotion?.capture();this.layoutMotion?.capture();this.activeId.set(id);this.open.set(true);this.syncPanel()}
keys(event:KeyboardEvent):void{this.indicatorMotion?.capture();this.layoutMotion?.capture();const items=this.items();if(event.key==='Escape'){this.open.set(false);this.syncPanel();return}if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();this.keyboard.set(true);const next=(this.focusIndex()+(event.key==='ArrowDown'?1:-1)+items.length)%items.length;this.activeId.set(items[next]?.id);this.focusIndex.set(next)}if(event.key==='ArrowRight'||event.key==='Enter'){event.preventDefault();this.keyboard.set(true);this.activeId.set(items[this.focusIndex()]?.id);this.open.set(true)}this.syncPanel()}
ngOnChanges():void{this.indicatorMotion?.capture(true);this.layoutMotion?.capture();if(this.initialized)this.syncPanel()}
private syncPanel():void{const next=this.open()?this.active():undefined,shown=this.displayed();if(!shown){this.displayed.set(next);this.exiting=false;return}if(next?.id===shown.id){this.displayed.set(next);this.pending=undefined;if(this.exiting){this.exiting=false;this.panelMotion?.set(true,this.reduced())}return}this.pending=next;if(this.exiting)return;this.exiting=true;if(this.panelMotion)this.panelMotion.set(false,this.reduced());else{this.displayed.set(next);this.exiting=false}}
constructor(){afterEveryRender(()=>this.rendered())}
private rendered():void{this.applyBindings();this.zone.runOutsideAngular(()=>{if(this.reduced()){this.layoutMotion?.destroy();this.layoutMotion=undefined;this.indicatorMotion?.destroy();this.indicatorMotion=undefined}else{this.layoutMotion??=new BranchingSubmenuLayoutMotion(this.root().nativeElement);this.layoutMotion.rendered(!this.skipLayout);this.skipLayout=false;this.indicatorMotion??=new AnimatedTabsIndicatorMotion(this.root().nativeElement,'.k-branching-pill');this.indicatorMotion.rendered('kit-ui-branching-active-pill')}const node=this.root().nativeElement.querySelector<HTMLElement>('.k-branching-panel')??undefined;if(this.panelMotion?.node!==node){this.panelMotion?.destroy();this.panelMotion=node?new BranchingSubmenuPanelMotion(node,this.reduced(),this.initialPanel,()=>{this.skipLayout=true;this.panelMotion?.destroy();this.panelMotion=undefined;this.displayed.set(this.pending);this.pending=undefined;this.exiting=false}):undefined;if(node)this.initialPanel=false}this.panelMotion?.set(!this.exiting,this.reduced());this.panelMotion?.refreshChildren();this.initialPanel=false});const key=String(this.focusIndex())+':'+this.keyboard()+':'+this.open();if(key!==this.lastFocus){this.lastFocus=key;if(this.keyboard()&&this.open())this.root().nativeElement.querySelectorAll<HTMLButtonElement>('.k-branching-parent')[this.focusIndex()]?.focus()}}
ngOnDestroy():void{this.layoutMotion?.destroy();this.indicatorMotion?.destroy();this.panelMotion?.destroy();}
}

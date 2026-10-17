import {computed,effect,signal,untracked} from '@angular/core';
import {SearchPalettePresence,SearchPaletteHighlight} from './search-palette-motion';

export interface SpotlightSearchItem {id:string;title:string;category:string;description?:string;icon?:unknown;shortcut?:string[];action?:()=>void}
export interface SearchCatalogItem {id:string;name:string;category:string}
export interface SearchPaletteItem extends SpotlightSearchItem {glyph?:string;badge?:string;glyphColor?:string}
export interface SearchPaletteOptions {
 isOpen?:boolean;open?:boolean;onClose?:()=>void;onOpenChange?:(open:boolean)=>void;
 onSelectComponent?:(id:string)=>void;onNavigateDocs?:(topicId?:string)=>void;
 items?:SpotlightSearchItem[];onSelect?:(item:SpotlightSearchItem)=>void;
 enableGlobalShortcut?:boolean;placeholder?:string;className?:string;
}
const github='https://github.com/chaitanay-kumar/kit-ui';
const cli='npx shadcn@latest add chaitanay-kumar/kit-ui/magnetic-button';
/** The source helper intentionally returns a promise without awaiting it at selection. */
export function copyPaletteCommand(view:Window):Promise<boolean>{
 const navigator=view.navigator;
 if(navigator.clipboard&&view.isSecureContext)return navigator.clipboard.writeText(cli).then(()=>true).catch(()=>false);
 const area=view.document.createElement('textarea');area.value=cli;area.style.position='fixed';area.style.left='-999999px';area.style.top='-999999px';view.document.body.append(area);area.focus();area.select();
 return new Promise(resolve=>{const successful=view.document.execCommand('copy');area.remove();resolve(successful)});
}
interface PaletteFrame {query:string;index:number;items:SearchPaletteItem[];labels:Map<SearchPaletteItem,SearchPaletteItem>;close:()=>void;backdrop:(event:MouseEvent)=>void;select:(item:SearchPaletteItem)=>void;placeholder:string;className:string}
/** Source state ownership and captured render callbacks; no invented focus trap, scroll or body lock. */
export class SearchPaletteController {
 readonly query=signal('');readonly index=signal(0);readonly present=signal(false);private internal=signal(false);
 readonly open=computed(()=>this.kind==='command'?!!this.options().isOpen:this.options().open!==undefined?!!this.options().open:this.internal());
 readonly current=computed(()=>this.makeFrame());
 readonly rendered=computed(()=>this.open()?this.current():this.snapshot??this.current());
 private previousCustomItems:SpotlightSearchItem[]|undefined;private cachedItems:SearchPaletteItem[]|undefined;private itemDeps:unknown[]=[];private snapshot:PaletteFrame|undefined;private previousOpen=false;private timer:number|undefined;private view:Window|undefined;
 private root:HTMLElement|undefined;private presence:SearchPalettePresence|undefined;private highlight:SearchPaletteHighlight|undefined;private disposed=false;
 constructor(readonly kind:'command'|'spotlight',private options:()=>SearchPaletteOptions,private catalog:SearchCatalogItem[],private dirty:()=>void,private report:(error:unknown)=>void,private input:()=>HTMLInputElement|undefined){
  effect(()=>{const open=this.open(),frame=this.current();if(open){this.snapshot=frame;this.present.set(true)}if(open!==this.previousOpen){this.previousOpen=open;untracked(()=>{if(this.timer!==undefined)this.view?.clearTimeout(this.timer);this.timer=undefined;if(open&&kind==='spotlight'){this.query.set('');this.index.set(0);if(this.view)this.timer=this.view.setTimeout(()=>{this.timer=undefined;if(!this.disposed)this.input()?.focus()},30)}})}});
 }
 mount():void{if(typeof window!=='undefined'){this.view=window;window.addEventListener('keydown',this.globalKey)}}
 private closeFor(options:SearchPaletteOptions):()=>void{const controlled=options.open!==undefined,change=options.onOpenChange,close=options.onClose;return ()=>{if(this.kind==='spotlight'){if(!controlled)this.internal.set(false);change?.(false)}close?.()}}
 private makeFrame():PaletteFrame{
  const options=this.options(),close=this.closeFor(options),selectComponent=options.onSelectComponent,navigate=options.onNavigateDocs,select=options.onSelect;
  if(options.items!==this.previousCustomItems){this.previousCustomItems=options.items;this.cachedItems=undefined}
  let items:SearchPaletteItem[];
  if(this.kind==='spotlight'&&options.items)items=options.items;
  else{
   const deps=[selectComponent,navigate,options.onClose,this.kind==='spotlight'?options.onOpenChange:undefined,options.open!==undefined];
   if(this.cachedItems&&deps.every((value,index)=>value===this.itemDeps[index]))items=this.cachedItems;else{
   items=this.catalog.map(component=>({id:this.kind==='command'?component.id:'comp-'+component.id,title:component.name,category:'Components',glyph:component.category==='Motion'?'sparkles':'layout',glyphColor:'#D4D4D4',badge:'C',action:()=>{selectComponent?.(component.id);close()}}));
   const docs=this.kind==='command'?[
    ['doc-intro','Docs: Introduction & Vision','introduction','book'],['doc-quickstart','Docs: Quick Start & shadcn CLI','quick-start','terminal'],['doc-architecture','Docs: Automatic Structure & Registry Engine','architecture','cpu'],['doc-collaboration','Docs: How to Collaborate & Add Components','collaboration','pull'],['doc-motion','Docs: Motion Tokens & Physics Curves','motion','sliders']
   ]:[
    ['doc-intro','Introduction & Architecture','introduction','book'],['doc-quickstart','Quick Start & CLI Installation','quick-start','terminal'],['doc-architecture','Registry Engine & Sync Automation','architecture','cpu'],['doc-motion','Motion Tokens & Physics Curves','motion-tokens','sliders'],['doc-collaboration','Contributing & Collaboration Guide','collaboration','pull']
   ];
   for(const [id,title,topic,glyph]of docs)items.push({id,title,category:'Documentation',glyph,glyphColor:'#ECECEC',badge:'D',action:()=>{navigate?.(topic);close()}});
   if(this.kind==='command')items.push({id:'cli-add',title:'Copy CLI Add Command',category:'Actions',glyph:'terminal',glyphColor:'#A1A1A1',badge:'⌘C',action:()=>{if(this.view)copyPaletteCommand(this.view);close()}});
   items.push({id:this.kind==='command'?'github-repo':'action-github',title:'View GitHub Repository',category:this.kind==='command'?'Navigation':'Actions',glyph:'github',glyphColor:'#A1A1A1',badge:'G',action:()=>{this.view?.open(github,'_blank','noopener,noreferrer');close()}});
   this.cachedItems=items;this.itemDeps=deps;
   }
  }
  const query=this.query(),q=query.toLowerCase();const filtered=this.kind==='spotlight'&&!query.trim()?items:items.filter(item=>item.title.toLowerCase().includes(q)||item.category.toLowerCase().includes(q)||(this.kind==='spotlight'&&item.description?.toLowerCase().includes(q)));
  const backdropClose=options.onClose;return {query,index:this.index(),items:filtered,labels:new Map(filtered.map(item=>[item,{...item}])),close,backdrop:event=>{if(this.kind==='command')(backdropClose as ((event:MouseEvent)=>void)|undefined)?.(event);else close()},select:item=>{item.action?.();if(this.kind==='spotlight'){select?.(item);close()}},placeholder:options.placeholder===undefined?'Search components, guides, documentation...':options.placeholder,className:options.className??''};
 }
 private safe(action:()=>void):void{if(this.disposed)return;try{action()}catch(error){this.report(error)}finally{if(!this.disposed)this.dirty()}}
 close():void{const frame=this.rendered();this.safe(frame.close)}
 backdrop(event:MouseEvent):void{const frame=this.rendered();this.safe(()=>frame.backdrop(event))}
 select(item:SearchPaletteItem):void{const frame=this.rendered();this.safe(()=>frame.select(item))}
 setQuery(event:Event):void{this.highlight?.capture();const value=(event.target as HTMLInputElement).value;this.query.set(value);this.index.set(0);if(!this.open())(event.target as HTMLInputElement).value=this.rendered().query}
 hover(index:number):void{this.highlight?.capture();this.index.set(index)}
 private moveIndex(delta:number,count:number):void{this.highlight?.capture();this.index.update(index=>(index+delta+(delta<0?count:0))%(count||1))}
 inputKey(event:KeyboardEvent):void{
  if(this.kind!=='spotlight')return;const frame=this.rendered();this.safe(()=>{if(event.key==='Escape'){event.preventDefault();frame.close();return}if(!frame.items.length)return;if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();this.moveIndex(event.key==='ArrowDown'?1:-1,frame.items.length)}else if(event.key==='Enter'){event.preventDefault();const item=frame.items[frame.index];if(item)frame.select(item)}});
 }
 private globalKey=(event:KeyboardEvent):void=>{
  const open=this.open(),options=this.options(),frame=this.current();
  this.safe(()=>{if(this.kind==='command'){
   if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(open)frame.close()}if(!open)return;
   if(event.key==='Escape')frame.close();else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();this.moveIndex(event.key==='ArrowDown'?1:-1,frame.items.length)}else if(event.key==='Enter'&&frame.items[frame.index]){event.preventDefault();frame.select(frame.items[frame.index])}
  }else if(options.enableGlobalShortcut){
   if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(open)frame.close();else{const change=options.onOpenChange;if(options.open===undefined)this.internal.set(true);change?.(true);this.query.set('');this.index.set(0)}}
   if(event.key==='Escape'&&open){event.preventDefault();frame.close()}
  }});
 };
 afterRender(root:HTMLElement|undefined):void{
  if(root!==this.root){this.presence?.destroy();this.highlight?.destroy();this.presence=undefined;this.highlight=undefined;this.root=root;if(root){this.presence=new SearchPalettePresence(root,this.kind,()=>{if(!this.open()&&!this.disposed)this.present.set(false)});if(this.kind==='spotlight')this.highlight=new SearchPaletteHighlight(root.querySelector<HTMLElement>('[data-palette-panel]')!);else this.input()?.focus()}}
  this.presence?.set(this.open());this.highlight?.rendered();
 }
 destroy():void{this.disposed=true;if(this.timer!==undefined)this.view?.clearTimeout(this.timer);this.view?.removeEventListener('keydown',this.globalKey);this.presence?.destroy();this.highlight?.destroy()}
}

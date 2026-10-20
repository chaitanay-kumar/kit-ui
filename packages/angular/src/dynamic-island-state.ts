import {Directive,DestroyRef,ElementRef,ErrorHandler,afterRenderEffect,computed,effect,inject,input,signal,untracked} from '@angular/core';
import type {FormContent} from './form-parts';
import {invokeNativeEventCallback} from './native-event-callback';
import {DynamicIslandMotion,type IslandPresenceEntry} from './dynamic-island-motion';
import {nativeClasses} from './native-classes';
import {DYNAMIC_ISLAND_CLASS_SOURCES} from './dynamic-island-classnames';

export type DynamicIslandState='collapsed'|'expanded'|'profile'|'share';
export type DynamicIslandSocialPlatform='github'|'x'|'twitter'|'linkedin'|'instagram'|'email'|'website'|'custom';
export interface DynamicIslandSocialItem{type?:DynamicIslandSocialPlatform;href:string;label?:string;icon?:FormContent}
export type DynamicIslandSocials=DynamicIslandSocialItem[]|{github?:string;x?:string;twitter?:string;linkedin?:string;instagram?:string;email?:string;website?:string;[key:string]:string|undefined};
export interface DynamicIslandMetadataItem{label:string;value:string}
interface IslandRenderData{avatar?:string;avatarAlt:string;instanceId:string;name:string;role:string;description:string;greeting:string;statusText:string;metadata?:DynamicIslandMetadataItem[];socials:DynamicIslandSocialItem[];profileContent?:FormContent;shareContent?:FormContent;content?:FormContent}
interface IslandRenderEntry extends IslandPresenceEntry{state:DynamicIslandState;data:IslandRenderData}

/** Preserve array items verbatim; only object email entries gain mailto:. */
export function normalizeDynamicIslandSocials(socials:DynamicIslandSocials|undefined):DynamicIslandSocialItem[]{
 if(!socials)return[{type:'github',href:'https://github.com',label:'GitHub'},{type:'x',href:'https://x.com',label:'X (Twitter)'},{type:'linkedin',href:'https://linkedin.com',label:'LinkedIn'},{type:'instagram',href:'https://instagram.com',label:'Instagram'},{type:'email',href:'mailto:contact@example.com',label:'Email'}];
 if(Array.isArray(socials))return socials;
 const items:DynamicIslandSocialItem[]=[];
 for(const[key,value]of Object.entries(socials)){
  if(!value)continue;
  const lower=key.toLowerCase();let type:DynamicIslandSocialPlatform='custom',label=key;
  if(lower==='github'){type='github';label='GitHub'}else if(lower==='x'||lower==='twitter'){type='x';label='X'}else if(lower==='linkedin'){type='linkedin';label='LinkedIn'}else if(lower==='instagram'){type='instagram';label='Instagram'}else if(lower==='email'){type='email';label='Email'}else if(lower==='website'){type='website';label='Website'}
  items.push({type,href:type==='email'&&!value.startsWith('mailto:')?'mailto:'+value:value,label});
 }
 return items;
}

let islandSerial=0;
/** State/DOM ownership shared by the authored native island template and motion. */
@Directive()
export abstract class DynamicIslandController{
 readonly avatar=input<string|undefined>();readonly avatarAlt=input<string|undefined>();
 readonly name=input<string,string|undefined>('Kit UI contributors',{transform:value=>value===undefined?'Kit UI contributors':value});
 readonly role=input<string,string|undefined>('Frontend Developer',{transform:value=>value===undefined?'Frontend Developer':value});
 readonly description=input<string,string|undefined>('Building thoughtful interfaces with React, Next.js, and Framer Motion.',{transform:value=>value===undefined?'Building thoughtful interfaces with React, Next.js, and Framer Motion.':value});
 readonly greeting=input<string|undefined>();readonly statusText=input<string,string|undefined>('Available for work',{transform:value=>value===undefined?'Available for work':value});
 readonly metadata=input<DynamicIslandMetadataItem[]|undefined>();readonly socials=input<DynamicIslandSocials|undefined>();
 readonly defaultState=input<DynamicIslandState,DynamicIslandState|undefined>('collapsed',{transform:value=>value===undefined?'collapsed':value});
 readonly state=input<DynamicIslandState|undefined>();readonly onStateChange=input<((state:DynamicIslandState)=>void)|undefined>();
 readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly profileContent=input<FormContent|undefined>();readonly shareContent=input<FormContent|undefined>();readonly content=input<FormContent|undefined>();readonly idPrefix=input<string|undefined>();
 private readonly host=inject<ElementRef<HTMLElement>>(ElementRef);
 readonly container=()=>this.host;
 private readonly generatedId='dyn-island-native-'+ ++islandSerial;
 readonly instanceId=computed(()=>this.idPrefix()||this.generatedId);
 private readonly internal=signal<DynamicIslandState|undefined>(undefined);
 readonly currentState=computed(()=>this.state()!==undefined?this.state()!:this.internal()??this.defaultState());
 readonly panelClass=computed(()=>{const profile=this.currentState()==='profile';return nativeClasses('kdi-panel '+(profile?'kdi-profile-radius':'kdi-rounded'),DYNAMIC_ISLAND_CLASS_SOURCES.panel+' '+(profile?DYNAMIC_ISLAND_CLASS_SOURCES.profile:DYNAMIC_ISLAND_CLASS_SOURCES.rounded),this.className())});
 readonly normalizedSocials=computed(()=>normalizeDynamicIslandSocials(this.socials()));
 readonly effectiveGreeting=computed(()=>this.greeting()||(this.name()?"Hello, I'm "+this.name():'Welcome to Kit UI'));
 readonly effectiveAvatarAlt=computed(()=>this.avatarAlt()||this.name()||'Avatar');
 readonly entries=signal<IslandRenderEntry[]>([]);
 private motion:DynamicIslandMotion|undefined;
 private readonly reducedMotion=signal(false);
 private mounted=false;private releaseDocumentListeners:(()=>void)|undefined;private readonly errors=inject(ErrorHandler);
 changeState(next:DynamicIslandState,event:Event):void{
  if(this.state()===undefined)this.internal.set(next);
  invokeNativeEventCallback(()=>{const callback=this.onStateChange();callback?.(next)},event,this.errors);
 }
 constructor(){
  const view=this.host.nativeElement.ownerDocument.defaultView,media=view?.matchMedia?.('(prefers-reduced-motion: reduce)');
  this.reducedMotion.set(media?.matches??false);
  const preference=()=>this.reducedMotion.set(media?.matches??false);media?.addEventListener('change',preference);
  effect(()=>{
   const state=this.currentState(),data:IslandRenderData={avatar:this.avatar(),avatarAlt:this.effectiveAvatarAlt(),instanceId:this.instanceId(),name:this.name(),role:this.role(),description:this.description(),greeting:this.effectiveGreeting(),statusText:this.statusText(),metadata:this.metadata(),socials:this.normalizedSocials(),profileContent:this.profileContent(),shareContent:this.shareContent(),content:this.content()};this.className();
   untracked(()=>{this.motion?.capture();this.entries.update(previous=>{const first=previous.length===0,existing=previous.find(entry=>entry.state===state);return[...previous.map(entry=>entry.state===state?{...entry,leaving:false,data}:{...entry,leaving:true}),...(existing?[]:[{state,data,initial:first,leaving:false}])]})});
  });
  afterRenderEffect(()=>{
   const entries=this.entries(),reduced=this.reducedMotion(),panel=this.host.nativeElement.querySelector<HTMLElement>('.kdi-panel');
   if(!panel)return;
   untracked(()=>{this.motion??=new DynamicIslandMotion(panel,state=>this.entries.update(previous=>previous.filter(entry=>entry.state!==state||!entry.leaving)));this.motion.sync(entries,reduced)});
  });
  afterRenderEffect(()=>{const initial=this.defaultState();untracked(()=>{if(!this.mounted){this.mounted=true;this.internal.set(initial)}})});
  afterRenderEffect(()=>{
   const state=this.currentState(),container=this.container()?.nativeElement;this.onStateChange();
   this.releaseDocumentListeners?.();this.releaseDocumentListeners=undefined;
   if(state==='collapsed'||!container)return;
   const document=container.ownerDocument;
   const pointer=(event:PointerEvent)=>{if(!container.contains(event.target as Node))this.changeState('collapsed',event)};
   const key=(event:KeyboardEvent)=>{if(event.key==='Escape')this.changeState('collapsed',event)};
   document.addEventListener('pointerdown',pointer);document.addEventListener('keydown',key);
   this.releaseDocumentListeners=()=>{document.removeEventListener('pointerdown',pointer);document.removeEventListener('keydown',key)};
  });
  inject(DestroyRef).onDestroy(()=>{this.releaseDocumentListeners?.();this.motion?.destroy();media?.removeEventListener('change',preference)});
 }
}

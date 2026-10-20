import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import {buildScopedUtilityDefaults} from './angular-scoped-utilities';

// Expand the source's utilities into scoped native CSS; consumers need no Tailwind compiler.
const styles:Record<string,string>={
 '.kdi-region':'relative inline-flex items-center justify-center',
 '.kdi-panel':'relative z-30 inline-flex flex-col items-center justify-center overflow-hidden border backdrop-blur-md transition-colors bg-white/95 dark:bg-[#141416]/95 border-black/[0.08] dark:border-white/[0.12] text-[#0A0A0A] dark:text-[#F4F4F5] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]',
 '.kdi-rounded':'rounded-full', '.kdi-profile-radius':'rounded-[26px]',
 '.kdi-collapsed':'flex items-center gap-2 px-2 py-1.5 min-h-[44px]',
 '.kdi-expanded':'flex items-center gap-2.5 px-3 py-1.5 min-h-[44px] max-w-[calc(100vw-2rem)]',
 '.kdi-avatar':'relative shrink-0 overflow-hidden rounded-full border border-black/10 dark:border-white/15 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center select-none shadow-xs w-7 h-7',
 '.kdi-avatar-large':'w-12 h-12', '.kdi-avatar-image':'w-full h-full object-cover',
 '.kdi-avatar-placeholder':'w-full h-full flex items-center justify-center text-neutral-600 dark:text-neutral-300',
 '.kdi-avatar-user':'w-3.5 h-3.5 stroke-[1.8]', '.kdi-avatar-user-large':'w-6 h-6',
 '.kdi-control':'w-7 h-7 flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer',
 '.kdi-muted-control':'text-neutral-500', '.kdi-collapse-control':'text-neutral-400 dark:text-neutral-500',
 '.kdi-icon':'w-3.5 h-3.5', '.kdi-icon-large':'w-4 h-4', '.kdi-icon-small':'w-3 h-3',
 '.kdi-summary':'flex items-center min-w-0 pr-1',
 '.kdi-greeting':'text-xs sm:text-sm font-medium tracking-tight truncate max-w-[140px] sm:max-w-[210px] text-neutral-900 dark:text-neutral-100',
 '.kdi-actions':'flex items-center gap-1 shrink-0', '.kdi-separator':'w-px h-3.5 bg-neutral-200 dark:bg-neutral-800 mx-0.5',
 '.kdi-profile':'w-full max-w-[min(380px,calc(100vw-2rem))] p-4 flex flex-col gap-3.5',
 '.kdi-profile-header':'flex items-start justify-between gap-3', '.kdi-profile-person':'flex items-center gap-3 min-w-0',
 '.kdi-profile-copy':'min-w-0 flex flex-col', '.kdi-profile-title':'flex items-center gap-1.5',
 '.kdi-name':'text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 truncate',
 '.kdi-status':'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
 '.kdi-status-dot':'w-1.5 h-1.5 rounded-full bg-emerald-500', '.kdi-status-text':'truncate max-w-[90px]',
 '.kdi-role':'text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5',
 '.kdi-profile-back':'w-7 h-7 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0',
 '.kdi-description':'text-xs leading-relaxed text-neutral-600 dark:text-neutral-300',
 '.kdi-metadata':'flex flex-wrap gap-1.5 pt-0.5',
 '.kdi-metadata-item':'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300',
 '.kdi-metadata-label':'text-neutral-400 dark:text-neutral-500', '.kdi-metadata-value':'font-medium text-neutral-900 dark:text-neutral-100',
 '.kdi-footer':'flex items-center justify-between pt-1 border-t border-neutral-200/80 dark:border-neutral-800/80 mt-0.5',
 '.kdi-share-profile':'inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors py-1 px-1.5 rounded cursor-pointer',
 '.kdi-back':'inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors py-1 px-1.5 rounded cursor-pointer',
 '.kdi-share':'flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] max-w-[calc(100vw-2rem)]',
 '.kdi-share-back':'w-7 h-7 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0',
 '.kdi-share-separator':'w-px h-3.5 bg-neutral-200 dark:bg-neutral-800 mx-1 shrink-0',
 '.kdi-socials':'flex items-center gap-1 overflow-x-auto py-0.5', '.kdi-no-links':'text-xs text-neutral-500 px-2',
 '.kdi-social-link':'relative w-7 h-7 flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all shrink-0'
};
export async function buildDynamicIslandStyles(root:string):Promise<void>{
 const sources={panel:styles['.kdi-panel'],rounded:styles['.kdi-rounded'],profile:styles['.kdi-profile-radius']};
 fs.writeFileSync(path.join(root,'packages/angular/src/dynamic-island-classnames.ts'),'// Generated from scripts/angular-dynamic-island.ts.\nexport const DYNAMIC_ISLAND_CLASS_SOURCES='+JSON.stringify(sources,null,2)+';\n');
 const source='@reference "../src/styles/index.css";\n@layer components{\n'+Object.entries(styles).map(([selector,utilities])=>selector+'{@apply '+utilities+';}').join('\n')+'\n}';
 const result=await postcss([tailwind()]).process(source,{from:path.join(root,'scripts/angular-dynamic-island.css')});
 const defaults=await buildScopedUtilityDefaults(root,'.kdi-region',Object.values(sources));
 const reset='\n@layer components{ :where(.kdi-region,.kdi-region *){box-sizing:border-box} :where(.kdi-region button){font:inherit;color:inherit;padding:0;border-width:0;background:transparent} :where(.kdi-region a){color:inherit;text-decoration:inherit} :where(.kdi-region h4,.kdi-region p){margin:0} .kdi-focus{outline:none}.kdi-focus:focus-visible{outline:1px solid var(--accent-ring,#525252);outline-offset:1px}.kdi-region svg{display:block;vertical-align:middle}.kdi-status-dot{animation:kdi-pulse 2s cubic-bezier(.4,0,.6,1) infinite}@keyframes kdi-pulse{50%{opacity:.5}}}\n';
 fs.writeFileSync(path.join(root,'packages/angular/src/dynamic-island.css'),'/* Generated from scripts/angular-dynamic-island.ts; edit authored utility definitions. */\n'+reset+(defaults+result.css).replaceAll('var(--radius)','var(--radius, .875rem)')+'\n');
}

const template=`<ng-template #avatarTemplate let-profile="profile" let-data="data"><div [class]="'kdi-avatar '+(profile?'kdi-avatar-large':'')" [attr.data-island-avatar]="data.instanceId">@if(data.avatar){<img [src]="data.avatar" [alt]="data.avatarAlt" class="kdi-avatar-image"/>}@else{<div data-testid="dynamic-island-profile-icon" class="kdi-avatar-placeholder"><svg kitIslandIcon icon="user" [class]="'kdi-avatar-user '+(profile?'kdi-avatar-user-large':'')"/></div>}</div></ng-template>
<div #panel [class]="panelClass()">
@for(entry of entries();track entry.state){@switch(entry.state){
@case('collapsed'){<div class="kdi-collapsed" data-island-entry="collapsed"><ng-container [ngTemplateOutlet]="avatarTemplate" [ngTemplateOutletContext]="{profile:false,data:entry.data}"/><button type="button" class="kdi-control kdi-focus" aria-label="Expand dynamic island" [attr.aria-expanded]="false" (click)="changeState('expanded',$event)"><svg kitIslandIcon icon="plus" class="kdi-icon-large"/></button></div>}
@case('expanded'){<div class="kdi-expanded" data-island-entry="expanded"><ng-container [ngTemplateOutlet]="avatarTemplate" [ngTemplateOutletContext]="{profile:false,data:entry.data}"/><div class="kdi-summary"><span class="kdi-greeting">{{entry.data.greeting}}</span></div><kit-form-content [content]="entry.data.content"/><ng-content/><div class="kdi-actions"><button type="button" class="kdi-control kdi-focus" aria-label="View profile" title="View profile" (click)="changeState('profile',$event)"><svg kitIslandIcon icon="user" class="kdi-icon"/></button><button type="button" class="kdi-control kdi-focus" aria-label="Share links" title="Share links" (click)="changeState('share',$event)"><svg kitIslandIcon icon="arrow-up-right" class="kdi-icon"/></button><div class="kdi-separator"></div><button type="button" class="kdi-control kdi-collapse-control kdi-focus" aria-label="Collapse dynamic island" title="Collapse" (click)="changeState('collapsed',$event)"><svg kitIslandIcon icon="xmark" class="kdi-icon"/></button></div></div>}
@case('profile'){<div class="kdi-profile" data-island-entry="profile">@if(entry.data.profileContent){<kit-form-content [content]="entry.data.profileContent"/>}@else{<div class="kdi-profile-header"><div class="kdi-profile-person"><ng-container [ngTemplateOutlet]="avatarTemplate" [ngTemplateOutletContext]="{profile:true,data:entry.data}"/><div class="kdi-profile-copy"><div class="kdi-profile-title"><h4 class="kdi-name">{{entry.data.name}}</h4>@if(entry.data.statusText){<span class="kdi-status" [title]="entry.data.statusText"><span class="kdi-status-dot"></span><span class="kdi-status-text">{{entry.data.statusText}}</span></span>}</div>@if(entry.data.role){<p class="kdi-role">{{entry.data.role}}</p>}</div></div><button type="button" class="kdi-profile-back kdi-focus" aria-label="Back to summary" title="Back to summary" (click)="changeState('expanded',$event)"><svg kitIslandIcon icon="xmark" class="kdi-icon-large"/></button></div>@if(entry.data.description){<p class="kdi-description">{{entry.data.description}}</p>}@if(entry.data.metadata?.length){<div class="kdi-metadata">@for(item of entry.data.metadata;track $index){<div class="kdi-metadata-item"><span class="kdi-metadata-label">{{item.label}}:</span><span class="kdi-metadata-value">{{item.value}}</span></div>}</div>}<div class="kdi-footer"><button type="button" class="kdi-share-profile kdi-focus" (click)="changeState('share',$event)"><span>Share Profile</span><svg kitIslandIcon icon="arrow-up-right" class="kdi-icon"/></button><button type="button" class="kdi-back kdi-focus" (click)="changeState('expanded',$event)"><svg kitIslandIcon icon="arrow-left" class="kdi-icon-small"/><span>Back</span></button></div>}</div>}
@case('share'){<div class="kdi-share" data-island-entry="share">@if(entry.data.shareContent){<kit-form-content [content]="entry.data.shareContent"/>}@else{<button type="button" class="kdi-share-back kdi-focus" aria-label="Back to overview" title="Back to overview" (click)="changeState('expanded',$event)"><svg kitIslandIcon icon="arrow-left" class="kdi-icon"/></button><div class="kdi-share-separator"></div><div class="kdi-socials">@if(entry.data.socials.length===0){<span class="kdi-no-links">No links configured</span>}@else{@for(item of entry.data.socials;track item.href+'-'+$index){<a [href]="item.href" [attr.target]="item.type==='email'?null:'_blank'" [attr.rel]="item.type==='email'?null:'noopener noreferrer'" [attr.aria-label]="item.label||item.type||'Social link'" [attr.title]="item.label||item.type||null" class="kdi-social-link kdi-focus">@if(item.icon){<kit-form-content [content]="item.icon"/>}@else{<svg kitIslandIcon [icon]="socialIcon(item.type)" [class]="item.type==='x'||item.type==='twitter'?'kdi-icon':'kdi-icon-large'"/>}</a>}}</div>}</div>}
}}</div>`;
export const dynamicIslandPort={
 description:'Native four-state profile island with controlled/default state, configurable social content, outside/Escape dismissal and source layout motion.',
 hostMetadata:"{'data-kit':'dynamic-island',class:'kdi-region',role:'region','aria-label':'Dynamic Island'}",stylesFile:'./dynamic-island.css',controller:'DynamicIslandController',
 imports:"import {NgTemplateOutlet} from '@angular/common';import {DynamicIslandController} from './dynamic-island-state';export * from './dynamic-island-state';import {KitDynamicIslandIconComponent} from './dynamic-island-icons';import {KitFormContentComponent} from './form-parts';",
 componentImports:'NgTemplateOutlet,KitDynamicIslandIconComponent,KitFormContentComponent',template,
 body:"socialIcon(type:string|undefined):string{return type==='email'?'mail':type==='website'?'globe':type==='twitter'?'x':['github','x','linkedin','instagram'].includes(type??'')?type!:'external'}",
 inputs:['avatar: string','avatarAlt: string','name: string','role: string','description: string','greeting: string','statusText: string','metadata: DynamicIslandMetadataItem[]','socials: DynamicIslandSocials','defaultState: DynamicIslandState','state: DynamicIslandState','onStateChange: (state: DynamicIslandState) => void','className: string','profileContent: FormContent','shareContent: FormContent','content: FormContent','idPrefix: string'],outputs:[]
};

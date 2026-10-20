// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';import {DynamicIslandController} from './dynamic-island-state';export * from './dynamic-island-state';import {KitDynamicIslandIconComponent} from './dynamic-island-icons';import {KitFormContentComponent} from './form-parts';
@Component({
 selector:"kit-dynamic-island", standalone:true,
 host:{'data-kit':'dynamic-island',class:'kdi-region',role:'region','aria-label':'Dynamic Island'},
 imports:[NgTemplateOutlet,KitDynamicIslandIconComponent,KitFormContentComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./dynamic-island.css"],
template:`
<ng-template #avatarTemplate let-profile="profile" let-data="data">
<div [class]="'kdi-avatar '+(profile?'kdi-avatar-large':'')" [attr.data-island-avatar]="data.instanceId">@if(data.avatar){<img [src]="data.avatar" [alt]="data.avatarAlt" class="kdi-avatar-image"/>}@else{<div data-testid="dynamic-island-profile-icon" class="kdi-avatar-placeholder">
<svg kitIslandIcon icon="user" [class]="'kdi-avatar-user '+(profile?'kdi-avatar-user-large':'')"/>
</div>}</div>
</ng-template>
<div #panel [class]="panelClass()">
@for(entry of entries();track entry.state){@switch(entry.state){
@case('collapsed'){<div class="kdi-collapsed" data-island-entry="collapsed">
<ng-container [ngTemplateOutlet]="avatarTemplate" [ngTemplateOutletContext]="{profile:false,data:entry.data}"/>
<button type="button" class="kdi-control kdi-focus" aria-label="Expand dynamic island" [attr.aria-expanded]="false" (click)="changeState('expanded',$event)">
<svg kitIslandIcon icon="plus" class="kdi-icon-large"/>
</button>
</div>}
@case('expanded'){<div class="kdi-expanded" data-island-entry="expanded">
<ng-container [ngTemplateOutlet]="avatarTemplate" [ngTemplateOutletContext]="{profile:false,data:entry.data}"/>
<div class="kdi-summary">
<span class="kdi-greeting">{{entry.data.greeting}}</span>
</div>
<kit-form-content [content]="entry.data.content"/>
<ng-content/>
<div class="kdi-actions">
<button type="button" class="kdi-control kdi-focus" aria-label="View profile" title="View profile" (click)="changeState('profile',$event)">
<svg kitIslandIcon icon="user" class="kdi-icon"/>
</button>
<button type="button" class="kdi-control kdi-focus" aria-label="Share links" title="Share links" (click)="changeState('share',$event)">
<svg kitIslandIcon icon="arrow-up-right" class="kdi-icon"/>
</button>
<div class="kdi-separator">
</div>
<button type="button" class="kdi-control kdi-collapse-control kdi-focus" aria-label="Collapse dynamic island" title="Collapse" (click)="changeState('collapsed',$event)">
<svg kitIslandIcon icon="xmark" class="kdi-icon"/>
</button>
</div>
</div>}
@case('profile'){<div class="kdi-profile" data-island-entry="profile">@if(entry.data.profileContent){<kit-form-content [content]="entry.data.profileContent"/>}@else{<div class="kdi-profile-header">
<div class="kdi-profile-person">
<ng-container [ngTemplateOutlet]="avatarTemplate" [ngTemplateOutletContext]="{profile:true,data:entry.data}"/>
<div class="kdi-profile-copy">
<div class="kdi-profile-title">
<h4 class="kdi-name">{{entry.data.name}}</h4>@if(entry.data.statusText){<span class="kdi-status" [title]="entry.data.statusText">
<span class="kdi-status-dot">
</span>
<span class="kdi-status-text">{{entry.data.statusText}}</span>
</span>}</div>@if(entry.data.role){<p class="kdi-role">{{entry.data.role}}</p>}</div>
</div>
<button type="button" class="kdi-profile-back kdi-focus" aria-label="Back to summary" title="Back to summary" (click)="changeState('expanded',$event)">
<svg kitIslandIcon icon="xmark" class="kdi-icon-large"/>
</button>
</div>@if(entry.data.description){<p class="kdi-description">{{entry.data.description}}</p>}@if(entry.data.metadata?.length){<div class="kdi-metadata">@for(item of entry.data.metadata;track $index){<div class="kdi-metadata-item">
<span class="kdi-metadata-label">{{item.label}}:</span>
<span class="kdi-metadata-value">{{item.value}}</span>
</div>}</div>}<div class="kdi-footer">
<button type="button" class="kdi-share-profile kdi-focus" (click)="changeState('share',$event)">
<span>Share Profile</span>
<svg kitIslandIcon icon="arrow-up-right" class="kdi-icon"/>
</button>
<button type="button" class="kdi-back kdi-focus" (click)="changeState('expanded',$event)">
<svg kitIslandIcon icon="arrow-left" class="kdi-icon-small"/>
<span>Back</span>
</button>
</div>}</div>}
@case('share'){<div class="kdi-share" data-island-entry="share">@if(entry.data.shareContent){<kit-form-content [content]="entry.data.shareContent"/>}@else{<button type="button" class="kdi-share-back kdi-focus" aria-label="Back to overview" title="Back to overview" (click)="changeState('expanded',$event)">
<svg kitIslandIcon icon="arrow-left" class="kdi-icon"/>
</button>
<div class="kdi-share-separator">
</div>
<div class="kdi-socials">@if(entry.data.socials.length===0){<span class="kdi-no-links">No links configured</span>}@else{@for(item of entry.data.socials;track item.href+'-'+$index){<a [href]="item.href" [attr.target]="item.type==='email'?null:'_blank'" [attr.rel]="item.type==='email'?null:'noopener noreferrer'" [attr.aria-label]="item.label||item.type||'Social link'" [attr.title]="item.label||item.type||null" class="kdi-social-link kdi-focus">@if(item.icon){<kit-form-content [content]="item.icon"/>}@else{<svg kitIslandIcon [icon]="socialIcon(item.type)" [class]="item.type==='x'||item.type==='twitter'?'kdi-icon':'kdi-icon-large'"/>}</a>}}</div>}</div>}
}}</div>
`
})
export class KitDynamicIslandComponent extends DynamicIslandController {
socialIcon(type:string|undefined):string{return type==='email'?'mail':type==='website'?'globe':type==='twitter'?'x':['github','x','linkedin','instagram'].includes(type??'')?type!:'external'}
}

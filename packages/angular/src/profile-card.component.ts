// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, computed, input } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
@Component({
 selector:"kit-profile-card", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./profile-card.css"],
template:`
<article [class]="'k-profile-card '+className()">
<div class="k-profile-cover" aria-hidden="true">
</div>
<div class="k-profile-actions">
<a [href]="socialUrl()" target="_blank" rel="noreferrer noopener" aria-label="Open X (Twitter) profile in a new tab">𝕏</a>
<button type="button" [attr.aria-label]="actionLabel()" (click)="onAction()?.()">{{actionLabel()}}</button>
</div>
<section>
<div class="k-profile-avatar" aria-hidden="true">
<svg viewBox="0 0 82 82">
<rect width="82" height="82" rx="23" fill="#dce5ff"/>
<path d="M29 20H48V38H29V20ZM48 20H67V47L48 58V20ZM29 38H48V67L29 57V38ZM48 48H67V67H48V48Z" fill="#000"/>
</svg>
</div>
<h2>{{name()}} <span aria-label="Verified">✓</span>
</h2>
<p class="k-profile-handle">{{username()}}</p>
<p class="k-profile-bio">{{description()}}</p>
<div class="k-profile-stats">
<span>
<strong>{{followers()}}</strong> Followers</span>
<span>
<strong>{{posts()}}</strong> Posts</span>
</div>
<a class="k-profile-site" [href]="websiteUrl()" target="_blank" rel="noreferrer noopener" [attr.aria-label]="'Visit '+website()+' (opens in a new tab)'">↗ {{website()}}</a>
</section>
</article>
`
})
export class KitProfileCardComponent {
readonly name=input<string,string|undefined>('Kit UI contributors',{transform:value=>value??'Kit UI contributors'});readonly username=input<string,string|undefined>('@kit-ui',{transform:value=>value??'@kit-ui'});readonly description=input<string,string|undefined>('Building Kit UI. Engineer.',{transform:value=>value??'Building Kit UI. Engineer.'});readonly followers=input<string,string|undefined>('200K',{transform:value=>value??'200K'});readonly posts=input<string,string|undefined>('72',{transform:value=>value??'72'});readonly website=input<string,string|undefined>('github.com/chaitanay-kumar/kit-ui',{transform:value=>value??'github.com/chaitanay-kumar/kit-ui'});readonly actionLabel=input<string,string|undefined>('Follow',{transform:value=>value??'Follow'});readonly onAction=input<(()=>void)|undefined>();readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly socialUrl=input<string,string|undefined>('https://x.com/kit_ui',{transform:value=>value??'https://x.com/kit_ui'});readonly websiteUrl=computed(()=>/^https?:\/\//.test(this.website())?this.website():'https://'+this.website());
}

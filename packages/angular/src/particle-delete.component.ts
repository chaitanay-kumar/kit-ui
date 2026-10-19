// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, computed, inject, input, signal, untracked } from '@angular/core';
import{afterRenderEffect}from '@angular/core';import{FormPart}from './form-parts';import{particleDelete,type ParticleDeleteOptions}from './particle-delete-engine';import{KitParticleDeleteIconComponent}from './particle-delete-icons';export*from './particle-delete-parts';export interface ParticleDeleteItem{id:string;title:string;category:string;description:string;icon:'shield'|'database'|'cpu'|'layers';tag:string;meta:string}
const DEFAULT_SAMPLE_ITEMS: ParticleDeleteItem[] = [
  {
    id: 'edge-cluster-iad1',
    title: 'Edge Cluster (iad-1)',
    category: 'Infra',
    description: '12 active workers · 42ms latency',
    icon: 'cpu',
    tag: 'Healthy',
    meta: 'Primary route',
  },
  {
    id: 'auth-session-vault',
    title: 'Prod Session Vault',
    category: 'Security',
    description: 'RSA-4096 secret pair · Token rotation active',
    icon: 'shield',
    tag: 'Active',
    meta: 'Vault #01',
  },
  {
    id: 'redis-cache-layer',
    title: 'L2 Memory Cache',
    category: 'Database',
    description: '1.2 GB stored · 99.8% hit ratio',
    icon: 'database',
    tag: 'Optimal',
    meta: 'Redis v7',
  },
];
@Component({
 selector:"kit-particle-delete", standalone:true,
 host:{'data-kit':'particle-delete',style:'display:contents'},
 imports:[KitParticleDeleteIconComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./particle-delete.css"],
template:`
<div #element role="region" aria-label="Particle Delete Items" [class]="'k-particle-delete '+rootClass()">
<div class="k-particle-header">
<div class="k-particle-heading">
<span>Active Resources</span>
<span class="k-particle-count">{{items().length}}</span>
</div>@if(items().length<initialItems().length){<button type="button" class="k-particle-restore" (click)="reset()">
<svg kitParticleDeleteIcon icon="rotate-ccw"/>
<span>Restore ({{initialItems().length-items().length}})</span>
</button>}</div>
<div class="k-particle-list">@if(items().length===0){<div class="k-particle-empty">
<svg kitParticleDeleteIcon icon="sparkles"/>
<p>All items dissolved into particles.</p>
<button type="button" (click)="reset()">Reset resources</button>
</div>}@else{@for(item of items();track item.id){<div [attr.data-particle-id]="item.id" [class]="'k-particle-card '+(deletingId()===item.id?'is-deleting':'')">
<div class="k-particle-info">
<div class="k-particle-icon">
<svg kitParticleDeleteIcon [icon]="item.icon==='shield'||item.icon==='database'||item.icon==='layers'?item.icon:'cpu'"/>
</div>
<div class="k-particle-copy">
<div class="k-particle-title">
<span>{{item.title}}</span>
<span class="k-particle-category">{{item.category}}</span>
</div>
<p>{{item.description}}</p>
</div>
</div>
<button type="button" [disabled]="deletingId()!==null" (click)="remove(item.id)" [class]="'k-particle-trigger '+(deletingId()===item.id?'is-deleting':'')" [title]="'Delete '+item.title" [attr.aria-label]="'Delete '+item.title">
<svg kitParticleDeleteIcon icon="trash-2"/>
</button>
</div>}}</div>
</div>
`
})
export class KitParticleDeleteComponent extends FormPart<HTMLDivElement> {
readonly rootClass=computed(()=>{const value=this.className();return (/(?:^|\s)sm:p-/.test(value)?'':'sm:p-4 ')+value});readonly initialItems=input<ParticleDeleteItem[],ParticleDeleteItem[]|undefined>(DEFAULT_SAMPLE_ITEMS,{transform:value=>value===undefined?DEFAULT_SAMPLE_ITEMS:value});readonly options=input<ParticleDeleteOptions|undefined>();readonly items=signal<ParticleDeleteItem[]>([]);readonly deletingId=signal<string|null>(null);private mounted=false;private controller:AbortController|undefined;private readonly destroyRef=inject(DestroyRef);readonly reset=()=>this.items.set(this.initialItems());async remove(id:string):Promise<void>{if(this.deletingId())return;const root=this.element()?.nativeElement;const element=root?Array.from(root.querySelectorAll<HTMLElement>('[data-particle-id]')).find(node=>node.dataset.particleId===id):undefined;this.deletingId.set(id);const controller=new AbortController();this.controller=controller;try{if(element)await particleDelete(element,this.options(),controller.signal);if(this.destroyRef.destroyed)return;this.items.update(items=>items.filter(item=>item.id!==id));this.deletingId.set(null)}catch(error){if(!controller.signal.aborted)throw error}finally{if(this.controller===controller)this.controller=undefined}}constructor(){super();afterRenderEffect(()=>{const initial=this.initialItems();untracked(()=>{if(!this.mounted){this.mounted=true;this.items.set(initial)}})});this.destroyRef.onDestroy(()=>this.controller?.abort())}
}

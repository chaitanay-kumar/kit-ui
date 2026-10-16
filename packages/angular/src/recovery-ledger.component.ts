// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, input, signal } from '@angular/core';
import {RecoveryLedgerEntryComponent} from './recovery-ledger-entry';import type {LedgerEntry} from './recovery-ledger-types';export type {LedgerEntry} from './recovery-ledger-types';
@Component({
 selector:"kit-recovery-ledger", standalone:true,
 host:{style:'display:contents'},
 imports:[RecoveryLedgerEntryComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./recovery-ledger.css"],
template:`
<div [class]="'k-recovery-ledger '+className()">
<div class="k-ledger-header">
<div class="k-ledger-heading">
<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10"/>
<path d="M12 6v6l4 2"/>
</svg>
<h3>Recovery Ledger</h3>
<span class="k-ledger-count">{{entries().length}} snapshots</span>
</div>
</div>
<div class="k-ledger-list">@if(variant()==='timeline'){<div class="k-ledger-rail">
</div>}@for(entry of entries();track entry.id;let index=$index){<div kitRecoveryEntry [entry]="entry" [index]="index" [current]="entry.id===currentEntryId()" [expanded]="expandedId()===entry.id" [restoringId]="restoringId()" [hasRestore]="!!onRestore()" [onToggle]="toggleEntry" [onRestore]="restoreEntry">
</div>}</div>
</div>
`
})
export class KitRecoveryLedgerComponent {
readonly entries=input.required<LedgerEntry[]>();readonly currentEntryId=input<string|undefined>();readonly onRestore=input<((id:string)=>Promise<void>|void)|undefined>();readonly onSelect=input<((id:string)=>void)|undefined>();readonly variant=input<'timeline'|'compact','timeline'|'compact'|undefined>('timeline',{transform:v=>v===undefined?'timeline':v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly expandedId=signal<string|null>(null);readonly restoringId=signal<string|null>(null);readonly toggleEntry=(id:string):void=>{this.expandedId.set(this.expandedId()===id?null:id);this.onSelect()?.(id)};readonly restoreEntry=(id:string,event:MouseEvent):Promise<void>=>this.restore(id,event);
async restore(id:string,event:MouseEvent):Promise<void>{event.stopPropagation();const callback=this.onRestore();if(!callback||this.restoringId())return;this.restoringId.set(id);try{await callback(id)}finally{this.restoringId.set(null)}}
}

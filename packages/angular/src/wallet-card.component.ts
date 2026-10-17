// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, ElementRef, effect, inject, input, viewChild } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {WalletCardPressMotion} from './wallet-card-motion';
@Component({
 selector:"kit-wallet-card", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./wallet-card.css"],
template:`
<article [class]="'k-wallet '+className()" (pointermove)="move($event)" (pointerleave)="leave($event)">
    <div class="k-wallet-header">
<div>
<h2>Wallet</h2>
<p>{{cardType()}} Ending with {{cardLastFour()}}</p>
</div>
<button #action type="button" [disabled]="disabled()" [attr.aria-label]="buttonLabel()" (click)="useWallet()">{{buttonLabel()}}</button>
</div>
    <div class="k-wallet-surface">
<div class="k-wallet-shine" aria-hidden="true">
</div>
<div class="k-wallet-bloom" aria-hidden="true">
</div>
<div class="k-wallet-sweep" aria-hidden="true">
</div>
<div class="k-wallet-toggle" aria-hidden="true">
<span>
</span>
</div>
<div class="k-wallet-balance">
<span>{{balance()}}</span>
<small>{{balanceLabel()}}</small>
</div>
</div>
  </article>
`
})
export class KitWalletCardComponent {
readonly balance=input<string,string|undefined>('$4,566.00',{transform:v=>v===undefined?'$4,566.00':v});
readonly cardType=input<string,string|undefined>('Mastercard',{transform:v=>v===undefined?'Mastercard':v});
readonly cardLastFour=input<string,string|undefined>('3040',{transform:v=>v===undefined?'3040':v});
readonly buttonLabel=input<string,string|undefined>('Use Wallet',{transform:v=>v===undefined?'Use Wallet':v});
readonly balanceLabel=input<string,string|undefined>('Total Balance',{transform:v=>v===undefined?'Total Balance':v});
readonly disabled=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});
readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});
readonly onUseWallet=input<(()=>void)|undefined>();
private readonly defaultPointer=Symbol('default pointer');
readonly onPointerMove=input<((event:PointerEvent)=>void)|symbol|undefined,((event:PointerEvent)=>void)|undefined>(this.defaultPointer,{transform:v=>v});
readonly onPointerLeave=input<((event:PointerEvent)=>void)|symbol|undefined,((event:PointerEvent)=>void)|undefined>(this.defaultPointer,{transform:v=>v});
private readonly document=inject(DOCUMENT);
readonly action=viewChild<ElementRef<HTMLButtonElement>>('action');
constructor(){effect(cleanup=>{const node=this.action()?.nativeElement;if(node&&this.document.defaultView){const motion=new WalletCardPressMotion(node);cleanup(()=>motion.destroy());}});}
move(event:PointerEvent):void{const handler=this.onPointerMove();if(typeof handler!=='symbol'){handler?.(event);return;}if(this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=event.currentTarget as HTMLElement;const rect=el.getBoundingClientRect();el.style.setProperty('--wallet-x',(event.clientX-rect.left)+'px');el.style.setProperty('--wallet-y',(event.clientY-rect.top)+'px');}
leave(event:PointerEvent):void{const handler=this.onPointerLeave();if(typeof handler!=='symbol'){handler?.(event);return;}const el=event.currentTarget as HTMLElement;el.style.removeProperty('--wallet-x');el.style.removeProperty('--wallet-y');}
useWallet():void{if(!this.disabled())this.onUseWallet()?.();}
}

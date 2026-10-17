import '../../src/styles/index.css';
import '../../packages/angular/styles.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import '@angular/compiler';
import {Component,provideZonelessChangeDetection,signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {WalletCard} from '../../src/components/ui/WalletCard';
import {StickyPages} from '../../src/components/ui/StickyPages';
import {KitWalletCardComponent,KitStickyPagesComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';

const api=window as any;
api.events=[];
const useWallet=()=>api.events.push('wallet');
const pages=[{id:'a',title:'First page',subtitle:'Introduction',badge:'New',description:'Scroll down to reveal the next page.'},{id:'b',title:'Second page',subtitle:'Details',description:'Native sticky composition.'},{id:'c',title:'Final page',subtitle:'Finish'}];
let options:any={pages,pageHeight:'300px',topOffset:12,stackOffset:24,rich:false};
document.body.style.cssText='margin:0;padding:24px';
const host=document.body.appendChild(document.createElement('div'));host.id='fixture';
if(new URLSearchParams(location.search).get('framework')==='react'){
  const root=createRoot(host);
  const render=()=>flushSync(()=>root.render(<><WalletCard balance={options.balance} cardType={options.cardType} cardLastFour={options.cardLastFour} buttonLabel={options.buttonLabel} balanceLabel={options.balanceLabel} disabled={options.disabled} onUseWallet={useWallet}/><div id="scroller" style={{height:400,overflow:'auto',marginTop:40}}><StickyPages pages={options.pages} pageHeight={options.pageHeight} topOffset={options.topOffset} stackOffset={options.stackOffset} rounded={options.rounded} shadow={options.shadow} border={options.border}>{options.rich?<div><button onClick={()=>api.events.push('child')}>Projected action</button></div>:undefined}</StickyPages><div style={{height:400}}>After stack</div></div></>));
  api.update=(patch:any)=>{options={...options,...patch};render()};api.unmount=()=>root.unmount();render();api.ready=true;
}else{
  class Consumer{opts=signal(options);useWallet=useWallet;child=()=>api.events.push('child')}
  Component({selector:'batch31-consumer',standalone:true,imports:[KitWalletCardComponent,KitStickyPagesComponent],template:`<kit-wallet-card [balance]="opts().balance" [cardType]="opts().cardType" [cardLastFour]="opts().cardLastFour" [buttonLabel]="opts().buttonLabel" [balanceLabel]="opts().balanceLabel" [disabled]="opts().disabled" [onUseWallet]="useWallet"/><div id="scroller" style="height:400px;overflow:auto;margin-top:40px"><kit-sticky-pages [pages]="opts().pages" [pageHeight]="opts().pageHeight" [topOffset]="opts().topOffset" [stackOffset]="opts().stackOffset" [rounded]="opts().rounded" [shadow]="opts().shadow" [border]="opts().border">@if(opts().rich){<ng-template #stickyPage><div><button (click)="child()">Projected action</button></div></ng-template>}</kit-sticky-pages><div style="height:400px">After stack</div></div>`})(Consumer);
  host.append(document.createElement('batch31-consumer'));
  void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{api.update=(patch:any)=>{const instance=app.components[0].instance;instance.opts.update((value:any)=>({...value,...patch}));app.tick()};api.unmount=()=>app.destroy();api.ready=true});
}

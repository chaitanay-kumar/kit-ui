import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitWalletCardComponent,KitStickyPagesComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';

const dom=new JSDOM('<!doctype html><html><body></body></html>',{pretendToBeVisual:true});
for(const key of ['window','document','HTMLElement','Element','Node','Event','MouseEvent'])globalThis[key]=dom.window[key];
window.matchMedia=()=>({matches:false});
const listeners=new Set();
const add=window.addEventListener.bind(window),remove=window.removeEventListener.bind(window);
window.addEventListener=(type,callback,options)=>{if(type.startsWith('pointer'))listeners.add(callback);add(type,callback,options)};
window.removeEventListener=(type,callback,options)=>{if(type.startsWith('pointer'))listeners.delete(callback);remove(type,callback,options)};
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const make=component=>TestBed.configureTestingModule({imports:[component],providers:[provideZonelessChangeDetection()]}).createComponent(component);
const wallet=make(KitWalletCardComponent);
try{
  wallet.detectChanges();assert.equal(wallet.componentInstance.balance(),'$4,566.00');assert.equal(wallet.componentInstance.disabled(),false);assert.equal(listeners.size,1);
  let calls=0;wallet.componentRef.setInput('onUseWallet',()=>calls++);wallet.detectChanges();wallet.nativeElement.querySelector('button').click();assert.equal(calls,1);
  wallet.componentRef.setInput('disabled',true);wallet.detectChanges();wallet.componentInstance.useWallet();assert.equal(calls,1);
  wallet.componentRef.setInput('disabled',undefined);wallet.componentRef.setInput('balance',undefined);wallet.detectChanges();assert.equal(wallet.componentInstance.disabled(),false);assert.equal(wallet.componentInstance.balance(),'$4,566.00');
  wallet.componentRef.setInput('onUseWallet',()=>{throw new Error('consumer failure')});wallet.detectChanges();assert.throws(()=>wallet.componentInstance.useWallet(),/consumer failure/);
  wallet.componentRef.setInput('balance','');wallet.detectChanges();assert.equal(wallet.componentInstance.balance(),'','empty values do not fall back');
}finally{wallet.destroy();assert.equal(listeners.size,0);TestBed.resetTestingModule()}
const sticky=make(KitStickyPagesComponent);
try{
  sticky.detectChanges();assert.equal(sticky.nativeElement.querySelectorAll('.k-sticky-page-card').length,0);
  sticky.componentRef.setInput('pages',[{id:0,title:'Fallback',content:0},{id:1,title:'Hidden',content:'Rich content'}]);sticky.componentRef.setInput('topOffset',10);sticky.componentRef.setInput('stackOffset',22);sticky.componentRef.setInput('pageHeight','45vh');sticky.detectChanges();
  const cards=sticky.nativeElement.querySelectorAll('.k-sticky-page-card');assert.equal(cards.length,2);assert.equal(cards[0].style.top,'10px');assert.equal(cards[1].style.top,'32px');assert.equal(cards[1].style.height,'45vh');assert.equal(cards[1].style.zIndex,'2');assert.match(cards[0].textContent,/Fallback/);assert.match(cards[1].textContent,/Rich content/);assert.doesNotMatch(cards[1].textContent,/Hidden/);
  for(const key of ['pageHeight','topOffset','stackOffset','rounded','shadow','border'])sticky.componentRef.setInput(key,undefined);sticky.detectChanges();assert.equal(sticky.componentInstance.pageHeight(),'100vh');assert.equal(sticky.componentInstance.rounded(),true);assert.equal(cards[1].style.top,'0px');
}finally{sticky.destroy();TestBed.resetTestingModule()}
console.log('Batch 31 packaged contracts pass: defaults, callbacks/failure, disabled action, disposal, page offsets/content and empty state.');

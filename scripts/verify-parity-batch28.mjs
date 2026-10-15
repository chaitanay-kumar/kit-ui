import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {spring} from 'motion-dom';
import {ErrorHandler,provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitAnimatedTabsComponent,KitScrollvelocitytextComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const dom=new JSDOM('<!doctype html><html><body></body></html>');
for(const key of ['window','document','HTMLElement','Element','Node','Event','KeyboardEvent'])globalThis[key]=dom.window[key];
let now=0,nextFrame=0;const frames=new Map();
const raf=callback=>{frames.set(++nextFrame,callback);return nextFrame},cancel=id=>frames.delete(id);
window.requestAnimationFrame=globalThis.requestAnimationFrame=raf;window.cancelAnimationFrame=globalThis.cancelAnimationFrame=cancel;
Object.defineProperty(window.performance,'now',{value:()=>now});globalThis.performance={now:()=>now};
const mediaListeners=new Set();let reduced=false;window.matchMedia=()=>({get matches(){return reduced},addEventListener:(type,fn)=>mediaListeners.add(fn),removeEventListener:(type,fn)=>mediaListeners.delete(fn)});
Object.defineProperty(window,'scrollY',{value:0,writable:true});
const listeners=new Map();let added=0;const add=window.addEventListener.bind(window),remove=window.removeEventListener.bind(window);
window.addEventListener=(type,fn,options)=>{if(['scroll','resize'].includes(type)){listeners.set(fn,type);added++}add(type,fn,options)};
window.removeEventListener=(type,fn,options)=>{listeners.delete(fn);remove(type,fn,options)};
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const make=component=>TestBed.configureTestingModule({imports:[component],providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError(error){throw error}}}]}).createComponent(component);
const advance=(ms,fixture)=>{for(let elapsed=0;elapsed<ms;elapsed+=16){now+=16;const callbacks=[...frames.values()];frames.clear();for(const callback of callbacks)callback(now);fixture?.detectChanges()}};
const comparePanel=(fixture,opacityFrames,yFrames,elapsed)=>{
 const panel=fixture.nativeElement.querySelector('.k-tabs-panel'),options={stiffness:170,damping:26,mass:.9};
 const opacity=spring({...options,keyframes:opacityFrames}).next(elapsed).value,y=spring({...options,keyframes:yFrames}).next(elapsed).value;
 assert.ok(Math.abs(Number(panel.style.opacity)-opacity)<1e-8,'native panel opacity follows the source spring generator');
 const actualY=panel.style.transform==='none'?0:Number(panel.style.transform.match(/translateY\(([^p]+)px\)/)[1]);
 assert.ok(Math.abs(actualY-y)<1e-8,'native panel translation follows the source spring generator');
};
const tabs=make(KitAnimatedTabsComponent),t=tabs.componentInstance,events=[];
try{
 tabs.componentRef.setInput('tabs',[{id:'a',label:'Alpha',icon:0,badge:0,content:'First'},{id:'b',label:'Beta',badge:2,content:'Second'}]);tabs.detectChanges();assert.equal(t.activeId(),'a');assert.equal(tabs.nativeElement.querySelector('[role=tab]'),null);const first=tabs.nativeElement.querySelector('button');assert.equal(first.getAttribute('type'),null);assert.equal(first.type,'submit');assert.equal(first.tabIndex,0);assert.equal(first.textContent,'0Alpha0');assert.equal(first.querySelector('.k-tabs-badge'),null);advance(128,tabs);comparePanel(tabs,[0,1],[6,0],128);advance(1500,tabs);
 tabs.componentRef.setInput('onChange',id=>{events.push(id);return false});tabs.detectChanges();t.choose('b');tabs.detectChanges();assert.equal(t.activeId(),'b');assert.deepEqual(events,['b']);advance(128,tabs);comparePanel(tabs,[1,0],[0,-6],128);advance(1500,tabs);assert.equal(tabs.nativeElement.querySelector('.k-tabs-panel').textContent,'Second');
 tabs.componentRef.setInput('activeTab','a');tabs.detectChanges();t.choose('b');assert.equal(t.activeId(),'a');assert.deepEqual(events,['b','b']);tabs.componentRef.setInput('defaultTab','b');tabs.componentRef.setInput('activeTab',undefined);tabs.detectChanges();assert.equal(t.activeId(),'b');tabs.componentRef.setInput('defaultTab','a');tabs.detectChanges();assert.equal(t.activeId(),'a');
 tabs.componentRef.setInput('defaultTab',undefined);tabs.componentRef.setInput('onChange',()=>{throw Error('consumer failure')});tabs.detectChanges();assert.throws(()=>t.choose('b'),/consumer failure/);assert.equal(t.activeId(),'b');tabs.componentRef.setInput('onChange',undefined);tabs.componentRef.setInput('renderContent',false);tabs.detectChanges();assert.equal(tabs.nativeElement.querySelector('.k-tabs-content'),null);tabs.componentRef.setInput('renderContent',undefined);tabs.componentRef.setInput('activeTab','missing');tabs.detectChanges();assert.equal(tabs.nativeElement.querySelector('.k-tabs-panel'),null);assert.ok(tabs.nativeElement.querySelector('.k-tabs-content'));tabs.destroy();
 console.log('Batch 28 packaged tabs: first/default/controlled selection, callback return/failure behavior, ordinary submit buttons, zero icon/badge, source-generator entry/exit motion, retained panel completion and content toggling pass.');
}finally{if(!tabs.componentRef.hostView.destroyed)tabs.destroy();TestBed.resetTestingModule()}
const velocity=make(KitScrollvelocitytextComponent),v=velocity.componentInstance;
try{
 velocity.componentRef.setInput('text','Continuous native text');velocity.componentRef.setInput('as','h2');velocity.componentRef.setInput('minLetterSpacing',.1);velocity.componentRef.setInput('style',{fontSize:20,opacity:.7,cssFloat:'left'});velocity.componentRef.setInput('attributes',{'aria-label':'Kinetic','data-item':'token',hidden:false,'aria-hidden':false});velocity.detectChanges();let node=v.element;assert.equal(node.localName,'h2');assert.equal(node.childNodes.length,1);assert.equal(node.getAttribute('aria-label'),'Kinetic');assert.equal(node.style.fontSize,'20px');assert.equal(node.style.cssFloat,'left');assert.equal(node.hasAttribute('hidden'),false);assert.equal(node.getAttribute('aria-hidden'),'false');velocity.componentRef.setInput('className','scroll-velocity-text-base custom-a');velocity.detectChanges();velocity.componentRef.setInput('className','custom-b');velocity.detectChanges();assert.ok(node.classList.contains('scroll-velocity-text-base'));assert.ok(node.classList.contains('custom-b'));assert.equal(node.classList.contains('custom-a'),false);assert.equal(listeners.size,2);
 const scroll=y=>{window.scrollY=y;window.dispatchEvent(new Event('scroll'));advance(2000,velocity)};
 scroll(250);assert.equal(node.style.letterSpacing,'0.55em');assert.equal(node.style.opacity,'0.8333');const held=node.getAttribute('style');advance(500,velocity);assert.equal(node.getAttribute('style'),held);scroll(125);assert.equal(node.style.letterSpacing,'0.325em');
 window.scrollY=175;window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('scroll'));advance(1000,velocity);assert.equal(node.style.letterSpacing,'0.325em');scroll(225);assert.equal(node.style.letterSpacing,'0.415em');
 velocity.componentRef.setInput('style',{fontSize:30,opacity:.25});velocity.detectChanges();assert.equal(node.style.letterSpacing,'0.415em');assert.equal(node.style.opacity,'0.25');assert.equal(node.style.cssFloat,'');velocity.componentRef.setInput('as','p');velocity.detectChanges();node=v.element;assert.equal(node.localName,'p');assert.equal(node.style.letterSpacing,'0.1em');scroll(250);assert.equal(node.style.letterSpacing,'0.46em');
 velocity.componentRef.setInput('as','svg');velocity.detectChanges();node=v.element;assert.equal(node.namespaceURI,'http://www.w3.org/2000/svg');assert.equal(node.textContent,'Continuous native text');velocity.componentRef.setInput('intensity',-1);velocity.detectChanges();const additions=added;velocity.componentRef.setInput('intensity',-2);velocity.detectChanges();assert.equal(added,additions,'equal clamped dependencies do not reinstall listeners');const retained=node.getAttribute('style');velocity.destroy();assert.equal(listeners.size,0);assert.equal(mediaListeners.size,0);window.scrollY=500;window.dispatchEvent(new Event('scroll'));advance(500);assert.equal(node.getAttribute('style'),retained);
 console.log('Batch 28 packaged velocity: readable polymorphic node, numeric style units/attributes, accumulation/reversal/idle, resize baseline, style updates, retained progress across tag replacement, normalized dependencies and disposal pass.');
}finally{if(!velocity.componentRef.hostView.destroyed)velocity.destroy();TestBed.resetTestingModule()}
reduced=true;const resting=make(KitScrollvelocitytextComponent),r=resting.componentInstance;
try{
 resting.componentRef.setInput('text','Reduced');resting.detectChanges();assert.equal(listeners.size,0);assert.equal(r.element.style.letterSpacing,'0em');reduced=false;for(const listener of mediaListeners)listener();window.scrollY=750;window.dispatchEvent(new Event('scroll'));advance(500,resting);assert.equal(r.element.style.letterSpacing,'0em');assert.equal(listeners.size,0);resting.componentRef.setInput('intensity',2);resting.detectChanges();assert.equal(listeners.size,2);window.scrollY=1000;window.dispatchEvent(new Event('scroll'));advance(2000,resting);assert.equal(r.element.style.letterSpacing,'1em');resting.destroy();assert.equal(listeners.size,0);assert.equal(mediaListeners.size,0);
 console.log('Batch 28 packaged initial reduced-motion enable/reconfigure lifecycle passes. Motion rendering is compared in browsers.');
}finally{if(!resting.componentRef.hostView.destroyed)resting.destroy();TestBed.resetTestingModule();dom.window.close()}

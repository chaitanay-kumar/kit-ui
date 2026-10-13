import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ErrorHandler,provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitInteractiveDataCardComponent,KitTimelineScrubberComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';

const dom=new JSDOM('<html><body></body></html>');
for(const key of ['window','document','HTMLElement','Element','Node'])globalThis[key]=dom.window[key];
globalThis.getComputedStyle=dom.window.getComputedStyle.bind(dom.window);
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const errors=[];
TestBed.configureTestingModule({imports:[KitInteractiveDataCardComponent,KitTimelineScrubberComponent],providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError:error=>errors.push(error)}}]});
const card=TestBed.createComponent(KitInteractiveDataCardComponent),timeline=TestBed.createComponent(KitTimelineScrubberComponent);
try{
 card.componentRef.setInput('title',undefined);card.componentRef.setInput('summary',undefined);card.componentRef.setInput('actionLabel',undefined);card.detectChanges();
 assert.match(card.nativeElement.textContent,/Weekly momentum/);assert.match(card.nativeElement.textContent,/24 tasks completed · 12% ahead/);
 const cardButtons=card.nativeElement.querySelectorAll('button');assert.equal(cardButtons[0].getAttribute('aria-controls'),card.componentInstance.detailsId);cardButtons[0].click();card.detectChanges();assert.equal(card.nativeElement.querySelector(`#${card.componentInstance.detailsId}`).hidden,false);
 let resolve;card.componentRef.setInput('onAction',()=>new Promise(done=>{resolve=done;}));card.detectChanges();cardButtons[1].click();card.detectChanges();assert.match(card.nativeElement.textContent,/Updating report…/);resolve();await Promise.resolve();card.detectChanges();assert.match(card.nativeElement.textContent,/Report updated\./);
 card.componentRef.setInput('onAction',async()=>{throw Error('expected');});card.detectChanges();cardButtons[1].click();await Promise.resolve();card.detectChanges();assert.match(card.nativeElement.textContent,/Unable to update\. Try again\./);
 timeline.componentRef.setInput('events',undefined);timeline.componentRef.setInput('disabled',undefined);timeline.componentRef.setInput('loading',undefined);timeline.detectChanges();
 const range=timeline.nativeElement.querySelector('input');assert.equal(timeline.nativeElement.querySelector('label').htmlFor,range.id);assert.equal(range.getAttribute('aria-valuetext'),'09:00 A small beginning');
 const changes=[];timeline.componentRef.setInput('onChange',(event,index)=>changes.push([event.id,index]));timeline.detectChanges();timeline.nativeElement.querySelectorAll('button')[1].click();timeline.detectChanges();assert.deepEqual(changes,[['build',1]]);assert.match(timeline.nativeElement.textContent,/2 of 3/);
 timeline.componentRef.setInput('events',[{id:'only',title:'Only'}]);timeline.detectChanges();assert.equal(range.disabled,true);assert.equal(timeline.componentInstance.index(),0);timeline.componentRef.setInput('events',undefined);timeline.detectChanges();assert.equal(timeline.componentInstance.index(),1);assert.deepEqual(errors,[]);
 console.log('Batch 5 packaged defaults, accessibility, async recovery, callbacks and controlled updates pass.');
}finally{card.destroy();timeline.destroy();TestBed.resetTestingModule();dom.window.close();}

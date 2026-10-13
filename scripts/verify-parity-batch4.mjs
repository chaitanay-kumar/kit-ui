import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ErrorHandler,provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitAnimatedNumberComponent,KitUnfoldAccordionComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const dom=new JSDOM('<html><body></body></html>');for(const key of ['window','document','HTMLElement','Element','Node'])globalThis[key]=dom.window[key];globalThis.getComputedStyle=dom.window.getComputedStyle.bind(dom.window);dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());const errors=[];
TestBed.configureTestingModule({imports:[KitAnimatedNumberComponent,KitUnfoldAccordionComponent],providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError:e=>errors.push(e)}}]});
const number=TestBed.createComponent(KitAnimatedNumberComponent),unfold=TestBed.createComponent(KitUnfoldAccordionComponent);
const items=[{id:'one',title:'One',content:'First content'},{id:'two',title:'Two',content:0}];unfold.componentRef.setInput('items',items);unfold.componentRef.setInput('defaultOpen',['one']);
try{
 number.componentRef.setInput('value',12450);number.detectChanges();assert.equal(number.componentInstance.formatted(),'12,450');assert.equal(number.componentInstance.stiffness(),170);assert.equal(number.componentInstance.damping(),22);assert.equal(number.componentInstance.mass(),.6);
 for(const [value,compact,decimals,grouping,expected] of [[-1234.56,false,2,true,'-1,234.56'],[1234567,true,1,false,'1.2M'],[1234,false,0,false,'1234']]){for(const[key,input]of Object.entries({value,compact,decimals,useGrouping:grouping}))number.componentRef.setInput(key,input);number.detectChanges();assert.equal(number.componentInstance.formatted(),expected);}
 number.componentRef.setInput('decimals',undefined);number.componentRef.setInput('useGrouping',undefined);number.detectChanges();assert.equal(number.componentInstance.decimals(),0);assert.equal(number.componentInstance.useGrouping(),true);
 unfold.detectChanges();assert.deepEqual(unfold.componentInstance.openIds(),['one']);
 unfold.componentRef.setInput('defaultOpen',['two']);unfold.detectChanges();assert.deepEqual(unfold.componentInstance.openIds(),['one']);const buttons=unfold.nativeElement.querySelectorAll('button');assert.equal(buttons[0].type,'button');buttons[1].click();unfold.detectChanges();assert.deepEqual(unfold.componentInstance.openIds(),['two']);
 unfold.componentRef.setInput('allowMultiple',true);unfold.detectChanges();buttons[0].click();unfold.detectChanges();assert.deepEqual(unfold.componentInstance.openIds(),['two','one']);unfold.componentRef.setInput('items',[]);unfold.detectChanges();assert.equal(unfold.nativeElement.querySelectorAll('button').length,0);assert.deepEqual(errors,[]);
 console.log('Batch 4 packaged formatting, defaults, single/multiple state, initial-only defaultOpen and disposal pass.');
}finally{number.destroy();unfold.destroy();TestBed.resetTestingModule();dom.window.close();}

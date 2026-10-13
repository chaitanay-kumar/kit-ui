import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ErrorHandler,provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitIosSearchBarComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';

const dom=new JSDOM('<html><body></body></html>');
for(const key of ['window','document','HTMLElement','Element','Node'])globalThis[key]=dom.window[key];
dom.window.matchMedia=()=>({matches:true});
globalThis.getComputedStyle=dom.window.getComputedStyle.bind(dom.window);
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const runtimeErrors=[];
TestBed.configureTestingModule({imports:[KitIosSearchBarComponent],providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError:error=>runtimeErrors.push(error)}}]});
const fixture=TestBed.createComponent(KitIosSearchBarComponent), instance=fixture.componentInstance, events=[];
const set=(key,value)=>fixture.componentRef.setInput(key,value);
set('value','');set('onChange',value=>{events.push(['change',value]);set('value',value);});set('onSubmit',value=>events.push(['submit',value]));set('onClear',()=>events.push(['clear']));
try{
  fixture.detectChanges();
  const input=fixture.nativeElement.querySelector('input');
  assert.equal(input.type,'search');assert.equal(input.placeholder,'Search...');assert.equal(input.getAttribute('aria-label'),'Search...');
  assert.equal(instance.collapsedWidth(),'220px');assert.equal(instance.expandedWidth(),'340px');
  input.value=' telemetry ';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));fixture.detectChanges();
  assert.equal(instance.value(),' telemetry ');assert.equal(input.value,' telemetry ');assert.equal(instance.expanded(),true);
  input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));assert.equal(events.length,1,'blur change must not repeat an input callback');
  const enter=new dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});input.dispatchEvent(enter);assert.equal(enter.defaultPrevented,true);
  instance.clear();fixture.detectChanges();assert.equal(input.value,'');assert.deepEqual(events,[['change',' telemetry '],['submit',' telemetry '],['change',''],['clear']]);
  set('onSubmit',undefined);fixture.detectChanges();const nativeEnter=new dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});input.dispatchEvent(nativeEnter);assert.equal(nativeEnter.defaultPrevented,false);
  set('value','escape');fixture.detectChanges();input.value='';input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));fixture.detectChanges();assert.equal(instance.value(),'','native search change must synchronize the controlled state');
  set('value','parent');set('onChange',value=>events.push(['ignored',value]));fixture.detectChanges();input.value='rejected';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));fixture.detectChanges();assert.equal(input.value,'parent');
  set('disabled',true);set('placeholder','Records');set('className','customer-pill');set('collapsedWidth',180);fixture.detectChanges();assert.equal(input.disabled,true);assert.equal(input.placeholder,'Records');assert.ok(fixture.nativeElement.querySelector('.customer-pill'));
  for(const key of ['disabled','placeholder','className','collapsedWidth','expandedWidth','autoFocus'])set(key,undefined);fixture.detectChanges();assert.equal(input.disabled,false);assert.equal(input.placeholder,'Search...');assert.equal(instance.collapsedWidth(),'220px');assert.equal(instance.expandedWidth(),'340px');
  assert.deepEqual(runtimeErrors,[],'render callbacks must complete without runtime errors');
  console.log('iOS Search Bar packaged controlled API, callbacks, form keys and optional defaults pass.');
}finally{fixture.destroy();TestBed.resetTestingModule();dom.window.close();}

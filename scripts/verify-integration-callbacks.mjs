import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ErrorHandler,provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import * as kit from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const dom=new JSDOM('<!doctype html><html><body></body></html>');
for(const key of ['window','document','HTMLElement','Element','Node','Event','MouseEvent'])globalThis[key]=dom.window[key];
globalThis.requestAnimationFrame=cb=>setTimeout(cb,0);
globalThis.cancelAnimationFrame=clearTimeout;
window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const cases=[
 ['BookCallButton',{},'onClick','button'],
 ['SplitButton',{label:'Publish',options:[]},'onClick','button'],
 ['NotificationBell',{notifications:[{id:'one',message:'Unread',timestamp:'now',read:false}],onMarkAsRead:()=>{},isOpen:true},'onMarkAllAsRead','header button'],
 ['NotificationBell',{notifications:[{id:'one',message:'Unread',timestamp:'now',read:false}],isOpen:true},'onMarkAsRead','article button'],
 ['PaymentStatus',{status:'failed'},'onRetry','.k-payment-actions button'],
 ['PaymentStatus',{status:'failed'},'onChangePaymentMethod','.k-payment-actions button:nth-child(2)'],
 ['ProfileCard',{},'onAction','button'],
 ['PeekCard',{data:{title:'Payment',actions:[]}},'nested','button'],
];
let assertions=0;
for(const [name,inputs,input,selector] of cases){
 const errors=[];
 const fixture=TestBed.configureTestingModule({imports:[kit['Kit'+name+'Component']],providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError:e=>errors.push(e)}}]}).createComponent(kit['Kit'+name+'Component']);
 try{
  for(const [key,value] of Object.entries(inputs))fixture.componentRef.setInput(key,value);
  for(const behavior of ['false','throw','prevent']){
   let calls=0;
   const action={label:'Act',onClick(){assert.equal(this,action);calls++;if(behavior==='throw')throw new Error('observer failure');return false}};
   const callback=event=>{calls++;if(behavior==='throw')throw new Error('observer failure');if(behavior==='prevent'&&event instanceof Event)event.preventDefault();return false};
   if(input==='nested')fixture.componentRef.setInput('data',{title:'Payment',actions:[action]});
   else fixture.componentRef.setInput(input,callback);
   fixture.detectChanges();
   if(input==='nested')fixture.componentInstance.open.set(true);
   fixture.detectChanges();
   const button=fixture.nativeElement.querySelector(selector);
   assert.ok(button,name+' renders tested action');
   const event=new MouseEvent('click',{bubbles:true,cancelable:true});
   button.dispatchEvent(event);
   await Promise.resolve();
   assert.equal(calls,1,name+' invokes observer once');
   // ID-only and nested actions do not receive the DOM event.
   const explicit=behavior==='prevent'&&!['onMarkAsRead','nested'].includes(input);
   assert.equal(event.defaultPrevented,explicit,name+' preserves event default semantics');
   assert.equal(errors.length,behavior==='false'?0:1,name+' reports errors asynchronously');
   assertions++;
  }
 }finally{fixture.destroy();TestBed.resetTestingModule()}
}
{
 const errors=[];
 const fixture=TestBed.configureTestingModule({imports:[kit.KitSplitButtonComponent],providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError:e=>errors.push(e)}}]}).createComponent(kit.KitSplitButtonComponent);
 try{
  fixture.componentRef.setInput('label','Publish');
  let calls=0;
  const option={value:'draft',label:'Draft',onSelect(){assert.equal(this,option);calls++;throw new Error('option failure')}};
  fixture.componentRef.setInput('options',[option]);
  fixture.detectChanges();fixture.componentInstance.open.set(true);fixture.detectChanges();
  const event=new MouseEvent('click',{bubbles:true,cancelable:true});
  fixture.nativeElement.querySelector('[role="menuitem"]').dispatchEvent(event);
  await Promise.resolve();
  assert.equal(calls,1);assert.equal(event.defaultPrevented,false);assert.equal(errors.length,1);
  assert.equal(fixture.componentInstance.open(),true,'failed option does not run the subsequent close');
  assertions++;
 }finally{fixture.destroy();TestBed.resetTestingModule()}
}
console.log(`${assertions} packaged callback scenarios pass: false returns, reported exceptions, explicit cancellation and nested receiver.`);

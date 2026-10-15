import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitSmartUploadComponent,KitLiquidCommandPaletteComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const dom=new JSDOM('<!doctype html><html><body></body></html>');
for(const key of ['window','document','HTMLElement','Element','Node','Event','KeyboardEvent'])globalThis[key]=dom.window[key];
// JSDOM has no native dialog API; top-layer/focus behavior is tested in Playwright.
dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute("open")};
dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute("open","")};
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const created=[],revoked=[];
const originalCreate=URL.createObjectURL,originalRevoke=URL.revokeObjectURL;
URL.createObjectURL=()=>{const url=`blob:test-${created.length}`;created.push(url);return url};URL.revokeObjectURL=url=>revoked.push(url);
const make=type=>TestBed.configureTestingModule({imports:[type],providers:[provideZonelessChangeDetection()]}).createComponent(type);
const f=make(KitSmartUploadComponent),c=f.componentInstance;
try {
 f.detectChanges();const fileInput=f.nativeElement.querySelector('input');assert.equal(f.nativeElement.querySelector('label').htmlFor,fileInput.id);assert.equal(fileInput.parentElement.tagName,'SECTION');
 f.componentRef.setInput('maxSize',1.6*1024*1024);f.componentRef.setInput('maxFiles',2);f.detectChanges();
 c.add([new File(['x'],'bad.txt',{type:'text/plain'}),new File([new Uint8Array(2*1024*1024)],'large.pdf',{type:'application/pdf'})]);assert.equal(c.message(),'bad.txt: unsupported file type. large.pdf exceeds 2 MB.');assert.equal(c.entries().length,0);
 c.add([new File(['x'],'a.PNG',{type:'image/png'}),new File(['x'],'b.PDF',{type:'application/pdf'}),new File(['x'],'extra.txt')]);assert.equal(c.message(),'Only 2 files allowed.');assert.equal(c.entries().length,2);assert.equal(created.length,1);
 await c.send(c.entries()[0]);assert.equal(c.message(),'Connect an upload handler before sending files.');
 const runs=[];f.componentRef.setInput('upload',(file,context)=>new Promise((resolve,reject)=>runs.push({file,context,resolve,reject})));f.detectChanges();
 const entry=c.entries()[0],first=c.send(entry);assert.equal(c.entries()[0].state,'pending');await c.send(entry);assert.equal(runs.length,1);
 runs[0].context.onProgress(33.7);f.detectChanges();assert.equal(c.entries()[0].progress,33.7);assert.match(f.nativeElement.querySelector('li [role=status]').textContent,/pending\s+34%/);
 runs[0].context.onProgress(Infinity);assert.equal(c.entries()[0].progress,0);runs[0].context.onProgress(150);assert.equal(c.entries()[0].progress,100);
 c.cancel(entry);assert.ok(runs[0].context.signal.aborted);assert.equal(c.entries()[0].state,'cancelled');const second=c.send(entry);runs[0].context.onProgress(80);assert.equal(c.entries()[0].progress,0);runs[0].resolve();await first;assert.equal(c.entries()[0].state,'pending');
 runs[1].reject(new Error(''));await second;f.detectChanges();assert.equal(c.entries()[0].error,'');assert.equal(f.nativeElement.querySelector('li [role=status]').textContent.trim(),'');
 const third=c.send(entry);runs[2].resolve();await third;assert.equal(c.entries()[0].state,'success');assert.equal(c.entries()[0].progress,100);c.remove(c.entries()[0]);assert.deepEqual(revoked,created);
 const fourth=c.send(c.entries()[0]);f.destroy();assert.ok(runs[3].context.signal.aborted);runs[3].context.onProgress(50);runs[3].resolve();await fourth;
 console.log('Batch 27 packaged upload: association, validation ordering/messages, preview URLs, missing handler, duplicate exclusion, progress, cancellation, stale completion, empty errors, recovery and destruction pass.');
} finally {if(!f.componentRef.hostView.destroyed)f.destroy();TestBed.resetTestingModule();URL.createObjectURL=originalCreate;URL.revokeObjectURL=originalRevoke;}
const p=make(KitLiquidCommandPaletteComponent),palette=p.componentInstance;
try {
 p.detectChanges();assert.deepEqual(palette.commands().map(c=>c.id),['home','components','docs']);
 p.componentRef.setInput('commands',[{id:'disabled',label:'Disabled',disabled:true,onSelect:()=>assert.fail('disabled')},{id:'a',label:'Alpha',keywords:'catalog',onSelect:()=>{throw Error('failure')}},{id:'b',label:'Beta',onSelect:()=>{}}]);p.detectChanges();assert.equal(palette.current().id,'a');
 assert.equal(p.nativeElement.querySelector('[role=option]').getAttribute('aria-disabled'),'true');assert.equal(p.nativeElement.querySelectorAll('[role=option]')[1].getAttribute('aria-disabled'),null);
 palette.navigate(new KeyboardEvent('keydown',{key:'End',cancelable:true}));assert.equal(palette.current().id,'b');palette.query.set(' catalog');assert.equal(palette.results().length,1);palette.query.set('catalog ');assert.equal(palette.results().length,0);palette.query.set('');
 await palette.run(palette.commands()[1]);assert.equal(palette.status(),'Command failed. Try again.');await palette.run(palette.commands()[2]);assert.equal(palette.status(),'Command completed.');assert.equal(palette.busy(),false);
 const shortcut=new KeyboardEvent('keydown',{key:'k',ctrlKey:true,cancelable:true});window.dispatchEvent(shortcut);assert.ok(shortcut.defaultPrevented);assert.equal(palette.opened(),true);p.destroy();const disposedShortcut=new KeyboardEvent('keydown',{key:'k',ctrlKey:true,cancelable:true});window.dispatchEvent(disposedShortcut);assert.equal(disposedShortcut.defaultPrevented,false);console.log('Batch 27 packaged palette: defaults, disabled options, ARIA omission, keyboard selection, untrimmed filtering, failure recovery and capture-listener disposal pass. Native top-layer lifecycle and capture order require browser evidence.');
} finally {if(!p.componentRef.hostView.destroyed)p.destroy();TestBed.resetTestingModule();dom.window.close()}

import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitMeteorsComponent,KitTextScrambleDecoderComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const dom=new JSDOM('<html><body></body></html>');
for(const key of ['window','document','HTMLElement','Element','Node','MouseEvent','Event'])globalThis[key]=dom.window[key];
let reduced=false,sequence=0;const frames=new Map(),listeners=new Set();
globalThis.matchMedia=()=>({get matches(){return reduced},addEventListener(_type,callback){listeners.add(callback)},removeEventListener(_type,callback){listeners.delete(callback)}});
globalThis.requestAnimationFrame=callback=>{frames.set(++sequence,callback);return sequence};
globalThis.cancelAnimationFrame=id=>frames.delete(id);
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
function fixture(Component,inputs={}){TestBed.configureTestingModule({imports:[Component],providers:[provideZonelessChangeDetection()]});const f=TestBed.createComponent(Component);for(const [key,value]of Object.entries(inputs))f.componentRef.setInput(key,value);f.detectChanges();return f}
function set(f,key,value){f.componentRef.setInput(key,value);f.detectChanges()}
function tick(now){const current=[...frames.values()];frames.clear();for(const callback of current)callback(now)}
const meteors=fixture(KitMeteorsComponent),angleSheet=meteors.componentInstance.angleSheet;try{
 const c=meteors.componentInstance;assert.match(angleSheet.textContent,/rotate\(215deg\)/);assert.equal(c.angle(),215);set(meteors,'angle',45);assert.match(angleSheet.textContent,/rotate\(45deg\)/);assert.equal(c.number(),20);assert.equal(c.color(),'#94A3B8');assert.equal(c.angle(),45);assert.equal(c.tailLength(),60);
 const distribution=c.distribution();assert.equal(distribution.length,20);set(meteors,'color','#ff0000');assert.equal(c.distribution(),distribution,'palette changes must retain random placement');set(meteors,'number',3);assert.equal(c.distribution().length,3);set(meteors,'minDelay',2);set(meteors,'maxDelay',2);assert.ok(c.distribution().every(item=>item.delay==='2.00s'));set(meteors,'number',undefined);assert.equal(c.number(),20);
}finally{meteors.destroy();assert.equal(angleSheet.parentNode,null);TestBed.resetTestingModule()}
const decoder=fixture(KitTextScrambleDecoderComponent,{text:'ABC DEF',trigger:'manual',duration:800,characters:'X'});try{
 const c=decoder.componentInstance;assert.equal(c.displayText(),'ABC DEF');assert.equal(c.isDecoding(),false);c.decode();assert.equal(c.isDecoding(),true);assert.ok(frames.has(c.frame));tick(performance.now()+1000);assert.equal(c.displayText(),'ABC DEF');assert.equal(c.isDecoding(),false);assert.equal(c.frame,0);
 c.decode();assert.ok(frames.has(c.frame));const previous=c.frame;c.decode();assert.ok(frames.has(c.frame),'replay schedules replacement frame');assert.notEqual(c.frame,previous);assert.equal(frames.has(previous),false);const interrupted=c.frame;set(decoder,'text','NEW');assert.equal(c.frame,0);assert.equal(frames.has(interrupted),false);assert.equal(c.displayText(),'NEW');
 reduced=true;for(const listener of listeners)listener();decoder.detectChanges();c.decode();assert.equal(c.displayText(),'NEW');assert.equal(c.isDecoding(),false);assert.equal(c.frame,0);reduced=false;for(const listener of listeners)listener();decoder.detectChanges();set(decoder,'trigger','mount');assert.ok(frames.has(c.frame));set(decoder,'duration',undefined);assert.equal(c.duration(),800);
}finally{decoder.destroy();TestBed.resetTestingModule()}
assert.equal(decoder.componentInstance.frame,0);assert.equal(listeners.size,0);dom.window.close();
console.log('Batch 21 packaged defaults, distribution stability, decoder completion, interruption, reduced motion and disposal pass.');

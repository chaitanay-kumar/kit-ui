import '@angular/compiler';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {JSDOM} from 'jsdom';
import {provideZonelessChangeDetection} from '@angular/core';import {TestBed} from '@angular/core/testing';import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitDotShaderComponent,KitAnimatedFileUploadComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const dom=new JSDOM('<!doctype html><html><body></body></html>');for(const key of ['window','document','HTMLElement','HTMLCanvasElement','Element','Node','Event','MouseEvent'])globalThis[key]=dom.window[key];
const frames=new Map(),observers=new Set(),mediaListeners=new Set();let serial=0,time=0,arcs=0;
window.requestAnimationFrame=callback=>{frames.set(++serial,callback);return serial};window.cancelAnimationFrame=id=>frames.delete(id);globalThis.requestAnimationFrame=window.requestAnimationFrame;globalThis.cancelAnimationFrame=window.cancelAnimationFrame;Object.defineProperty(window.performance,'now',{value:()=>time});
window.matchMedia=()=>({matches:false,addEventListener:(type,listener)=>mediaListeners.add(listener),removeEventListener:(type,listener)=>mediaListeners.delete(listener)});
class Observer{constructor(callback){this.callback=callback}observe(){observers.add(this)}disconnect(){observers.delete(this)}}globalThis.ResizeObserver=Observer;globalThis.IntersectionObserver=Observer;
const context={clearRect(){},fillRect(){},getImageData(){return{data:new Uint8ClampedArray([255,255,255,38])}},setTransform(){},beginPath(){},arc(){arcs++},fill(){}};HTMLCanvasElement.prototype.getContext=function(kind){return kind==='2d'?context:null};
HTMLElement.prototype.getBoundingClientRect=()=>({x:0,y:0,left:0,top:0,width:320,height:240,right:320,bottom:240,toJSON(){return{}}});
const advance=count=>{for(let step=0;step<count;step++){time+=16;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(callback=>callback(time))}};
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const dot=TestBed.configureTestingModule({imports:[KitDotShaderComponent],providers:[provideZonelessChangeDetection()]}).createComponent(KitDotShaderComponent);
dot.detectChanges();await Promise.resolve();dot.detectChanges();
assert.equal(dot.componentInstance.spacing(),22);assert.equal(dot.componentInstance.dotSize(),1.5);assert.equal(dot.nativeElement.querySelector('canvas').width,320);assert.ok(arcs>0);
dot.componentRef.setInput('paused',true);dot.detectChanges();const frozen=arcs;advance(5);assert.equal(arcs,frozen);
dot.componentRef.setInput('spacing',0);dot.componentRef.setInput('dotSize',0);dot.componentRef.setInput('cursorRadius',0);dot.detectChanges();assert.ok(arcs>frozen,'safe minima still render');
dot.destroy();TestBed.resetTestingModule();assert.equal(frames.size,0);assert.equal(observers.size,0);assert.equal(mediaListeners.size,0);
const upload=TestBed.configureTestingModule({imports:[KitAnimatedFileUploadComponent],providers:[provideZonelessChangeDetection()]}).createComponent(KitAnimatedFileUploadComponent);
const events=[],pending=[];upload.componentRef.setInput('maxFiles',1);upload.componentRef.setInput('uploadHandler',(item,progress)=>new Promise((resolve,reject)=>pending.push({item,progress,resolve,reject})));upload.componentRef.setInput('onUploadComplete',item=>events.push(item));upload.detectChanges();
const engine=upload.componentInstance.engine;engine.incoming([new dom.window.File(['a'],'a.txt'),new dom.window.File(['b'],'b.txt')]);upload.detectChanges();assert.equal(engine.files().length,1);assert.equal(pending.length,2);
pending[0].progress(135);assert.equal(engine.files()[0].progress,135);engine.remove(engine.files()[0].id);pending[0].resolve();await Promise.resolve();await Promise.resolve();assert.equal(events[0],pending[0].item,'removed custom completion retains original item');
upload.destroy();pending[1].resolve();await Promise.resolve();await Promise.resolve();assert.equal(events.length,1,'late callbacks suppressed after destruction');TestBed.resetTestingModule();assert.equal(frames.size,0);
for(const[id,files]of [['dot-shader',['dot-shader-renderer.ts','dot-shader.css','native-root-bindings.ts','native-event-callback.ts']],['animated-file-upload',['animated-upload-state.ts','animated-upload-motion.ts','animated-upload-icons.ts','animated-file-upload.css','batch39-motion.ts','batch20-spring.ts','native-event-callback.ts']]]){
 const source=JSON.parse(readFileSync(new URL('../public/angular-source/'+id+'.json',import.meta.url),'utf8'));for(const file of files)assert.ok(source.dependencies[file],id+' complete source dependency '+file);
}
console.log('Batch 46 packaged defaults, safe canvas minima, pause/disposal, capped task ownership, unbounded progress, captured removed-file completion and source dependency closure pass.');

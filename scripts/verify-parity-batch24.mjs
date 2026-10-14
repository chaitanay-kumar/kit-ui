import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {KitDensityLensComponent,KitGravityParticleBurstComponent} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const dom=new JSDOM('<!doctype html><html><body></body></html>');
for(const key of ['window','document','HTMLElement','Element','Node','MouseEvent','Event'])globalThis[key]=dom.window[key];
const frames=new Map(),listeners=new Set(),ellipses=[];let sequence=0,available=true,clears=0;
globalThis.requestAnimationFrame=cb=>{frames.set(++sequence,cb);return sequence};globalThis.cancelAnimationFrame=id=>frames.delete(id);
const media={matches:false,addEventListener:(_,cb)=>listeners.add(cb),removeEventListener:(_,cb)=>listeners.delete(cb)};window.matchMedia=()=>media;
Object.defineProperty(window,'devicePixelRatio',{value:3});
const context={clearRect(){clears++},beginPath(){},ellipse(...args){ellipses.push({args,alpha:this.globalAlpha,color:this.fillStyle})},fill(){}};
window.HTMLCanvasElement.prototype.getContext=()=>available?context:null;
TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
function fixture(Component,inputs={}){TestBed.configureTestingModule({imports:[Component],providers:[provideZonelessChangeDetection()]});const f=TestBed.createComponent(Component);for(const [key,value]of Object.entries(inputs))f.componentRef.setInput(key,value);f.detectChanges();return f}
function rootOf(f,selector){return f.nativeElement.matches(selector)?f.nativeElement:f.nativeElement.querySelector(selector)}
function advance(){const pending=[...frames];frames.clear();for(const [,cb]of pending)cb(performance.now()+16)}
function dispose(f){f.destroy();TestBed.resetTestingModule();frames.clear()}
const originalRandom=Math.random;Math.random=()=>.5;
try{
 const f=fixture(KitGravityParticleBurstComponent),root=rootOf(f,'.k-gravity-burst'),canvas=f.nativeElement.querySelector('canvas');
 assert.ok(root);assert.equal(f.componentInstance.particleCount(),36);assert.equal(f.nativeElement.querySelector('button').type,'button');assert.equal(canvas.getAttribute('aria-hidden'),'true');
 canvas.getBoundingClientRect=()=>({left:10,top:20,width:200.5,height:100.5});
 root.dispatchEvent(new MouseEvent('pointerdown',{clientX:110,clientY:70,bubbles:true}));advance();
 assert.equal(canvas.width,601);assert.equal(canvas.height,301);assert.equal(ellipses.length,36);
 const p=ellipses[0],force=4.5*3,life=58,size=2.6*3;
 assert.deepEqual(p.args,[300-force,150-5.4,size*(1-1/life*.3),size*(1-1/life*.3),0,0,Math.PI*2]);assert.equal(p.alpha,1-1/life);assert.equal(p.color,'#E4E4E7');
 ellipses.length=0;advance();assert.equal(ellipses[0].args[0],300-force-force*.98);assert.equal(ellipses[0].args[1],150-5.4-5.4*.98+.16);
 media.matches=true;for(const cb of listeners)cb();root.dispatchEvent(new MouseEvent('pointerdown',{bubbles:true}));ellipses.length=0;advance();assert.equal(ellipses.length,36,'existing particles survive preference change');
 for(let i=0;i<80;i++)advance();assert.equal(frames.size,0);const before=clears;root.dispatchEvent(new MouseEvent('pointerdown',{bubbles:true}));advance();assert.equal(clears,before,'new reduced-motion bursts suppressed');
 media.matches=false;for(const cb of listeners)cb();available=false;root.dispatchEvent(new MouseEvent('pointerdown',{bubbles:true}));advance();available=true;root.dispatchEvent(new MouseEvent('pointerdown',{bubbles:true}));assert.equal(frames.size,0,'source null-context occupied handle preserved');dispose(f);assert.equal(listeners.size,0);
 for(const callback of [undefined,()=>false]){const f=fixture(KitGravityParticleBurstComponent,{onPointerDown:callback});frames.clear();rootOf(f,'.k-gravity-burst').dispatchEvent(new MouseEvent('pointerdown',{bubbles:true}));assert.equal(f.componentInstance.motion.frame,null);dispose(f)}
 const lens=fixture(KitDensityLensComponent,{children:'Content'}),lensRoot=rootOf(lens,'.k-density-lens');lensRoot.getBoundingClientRect=()=>({left:10,top:20});lensRoot.dispatchEvent(new MouseEvent('mouseenter'));lensRoot.dispatchEvent(new MouseEvent('mousemove',{clientX:100,clientY:80}));lens.detectChanges();assert.equal(lens.componentInstance.x(),90);assert.equal(lens.componentInstance.y(),60);assert.equal(lens.nativeElement.querySelectorAll('.k-density-base,.k-density-zoom').length,2);assert.equal(lens.nativeElement.querySelector('.k-density-zoom').textContent,'Content');lensRoot.dispatchEvent(new MouseEvent('mouseleave'));lens.detectChanges();assert.ok(lens.nativeElement.querySelector('.k-density-surface'),'exit retains view');dispose(lens);
 const overridden=fixture(KitDensityLensComponent,{children:'Content',onMouseEnter:undefined});rootOf(overridden,'.k-density-lens').dispatchEvent(new MouseEvent('mouseenter'));overridden.detectChanges();assert.equal(overridden.nativeElement.querySelector('.k-density-surface'),null);dispose(overridden);
 console.log('Batch 24 packaged defaults, exact particle physics/DPR/palette, live reduced motion, context failure, callback overrides, lens coordinates/content/exit and disposal pass.');
}finally{Math.random=originalRandom;dom.window.close()}

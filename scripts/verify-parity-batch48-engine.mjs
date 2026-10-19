import '@angular/compiler';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {particleDelete as sourceDelete} from '../src/lib/particle-delete.ts';
import {particleDelete as nativeDelete} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';

// Compare the actual exported engines with identical sampled pixels, random stream,
// frame times and device metrics. Browser tests separately exercise real capture.
const dom=new JSDOM('<!doctype html><body></body>');
for(const key of ['window','document','HTMLElement','XMLSerializer'])globalThis[key]=dom.window[key];
let time=0,serial=0,seed=1,operations=[],frames=new Map(),reduced=false,failImage=false,noContext=false,holdImages=false;
const images=[];
const originalRandom=Math.random,originalPerformance=globalThis.performance;
globalThis.performance={now:()=>time};
Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
window.matchMedia=()=>({matches:reduced});
globalThis.requestAnimationFrame=callback=>{frames.set(++serial,callback);return serial};
globalThis.cancelAnimationFrame=id=>frames.delete(id);
globalThis.Image=class{constructor(){images.push(this)}set src(value){this.currentSource=value;if(!value||holdImages)return;queueMicrotask(()=>failImage?this.onerror?.(new Error('capture blocked')):this.onload?.())}};
window.HTMLCanvasElement.prototype.getContext=function(){
 if(noContext)return null;
 const draws=[];operations.push(draws);
 return{fillStyle:'',strokeStyle:'',lineWidth:1,scale:(...args)=>draws.push(['scale',...args]),drawImage:()=>draws.push(['capture']),fillRect(...args){draws.push(['fill',this.fillStyle,...args])},strokeRect(...args){draws.push(['stroke',this.strokeStyle,...args])},clearRect:(...args)=>draws.push(['clear',...args]),getImageData:(x,y,width,height)=>{const data=new Uint8ClampedArray(width*height*4);for(let i=0;i<data.length;i+=4){data[i]=(i*3)%255;data[i+1]=(i*7)%255;data[i+2]=(i*11)%255;data[i+3]=i%20===0?0:230}return{width,height,data}}};
};
async function run(engine,options,metrics={width:18,height:12,dpr:1,viewport:1024}){
 document.body.innerHTML='';time=0;seed=1234;serial=0;operations=[];frames=new Map();
 Object.defineProperty(window,'innerWidth',{configurable:true,value:metrics.viewport});Object.defineProperty(window,'devicePixelRatio',{configurable:true,value:metrics.dpr});
 const element=document.createElement('div');element.style.backgroundColor='#141414';element.textContent='Captured pixels';document.body.append(element);element.getBoundingClientRect=()=>({left:10,top:20,width:metrics.width,height:metrics.height});
 let completions=0,settled=false;const promise=engine(element,{...options,onComplete:()=>completions++}).then(()=>settled=true);
 for(let index=0;index<8;index++)await Promise.resolve();
 const overlay=document.querySelector('canvas');const overlayMetrics=overlay?{width:overlay.width,height:overlay.height,style:overlay.getAttribute('style'),aria:overlay.getAttribute('aria-hidden')}:null;
 for(let index=0;index<100&&frames.size;index++){time+=16;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(callback=>callback(time));await Promise.resolve()}
 await promise;
 assert.equal(settled,true);assert.equal(completions,1);assert.equal(frames.size,0);assert.equal(document.querySelectorAll('canvas').length,0);assert.equal(element.style.visibility,'');
 return{operations,overlayMetrics};
}
let comparisons=0;
try{
 for(const pattern of ['center-first','edges-first','uniform','random'])for(const metrics of [{width:18,height:12,dpr:1,viewport:1024},{width:18.5,height:12.5,dpr:3,viewport:390}]){
  const options={duration:320,dissolvePattern:pattern,maxParticles:17,force:.7,drift:.2,particleSize:2,drag:.94};
  const source=await run(sourceDelete,options,metrics),native=await run(nativeDelete,options,metrics);assert.deepEqual(native,source,'sampled capture, fixed overlay and all physics draws: '+pattern+' '+metrics.viewport);comparisons++;
 }
 failImage=true;assert.deepEqual(await run(nativeDelete,{duration:250,maxParticles:9}),await run(sourceDelete,{duration:250,maxParticles:9}),'procedural capture fallback');failImage=false;comparisons++;
 for(const engine of [sourceDelete,nativeDelete]){let completed=0;const detached=document.createElement('div');await engine(detached,{onComplete:()=>completed++});assert.equal(completed,1)}
 const controller=new AbortController();controller.abort();await assert.rejects(nativeDelete(document.createElement('div'),{},controller.signal),{name:'AbortError'});
 holdImages=true;const captureTarget=document.createElement('div');document.body.append(captureTarget);captureTarget.getBoundingClientRect=()=>({left:0,top:0,width:18,height:12});const captureController=new AbortController();const capturing=nativeDelete(captureTarget,{},captureController.signal);const pendingImage=images.at(-1);assert.equal(typeof pendingImage.onload,'function');captureController.abort();await assert.rejects(capturing,{name:'AbortError'});assert.equal(pendingImage.onload,null);assert.equal(pendingImage.onerror,null);assert.equal(pendingImage.currentSource,'');assert.equal(frames.size,0);holdImages=false;
 const fadeTarget=document.createElement('div');document.body.append(fadeTarget);fadeTarget.style.opacity='.7';fadeTarget.style.transition='color 1s linear';let abortedCompletion=0;reduced=true;const fadeController=new AbortController();const fading=nativeDelete(fadeTarget,{onComplete:()=>abortedCompletion++},fadeController.signal);assert.equal(fadeTarget.style.opacity,'0');fadeController.abort();await assert.rejects(fading,{name:'AbortError'});assert.equal(fadeTarget.style.opacity,'0.7');assert.equal(fadeTarget.style.transition,'color 1s linear');assert.equal(abortedCompletion,0);reduced=false;
 const active=document.createElement('div');document.body.append(active);active.getBoundingClientRect=()=>({left:0,top:0,width:18,height:12});const activeController=new AbortController();const deleting=nativeDelete(active,{onComplete:()=>abortedCompletion++},activeController.signal);for(let i=0;i<12;i++)await Promise.resolve();assert.equal(active.style.visibility,'hidden');assert.ok(frames.size>0);activeController.abort();await assert.rejects(deleting,{name:'AbortError'});assert.equal(frames.size,0);assert.equal(document.querySelectorAll('canvas').length,0);assert.equal(active.style.visibility,'');assert.equal(abortedCompletion,0);
 console.log(`${comparisons} exact source/native pixel/physics comparisons pass, including four patterns, mobile sampling, DPR cap and capture fallback; detached completion, pre-abort and image/fade/frame disposal pass.`);
}finally{Math.random=originalRandom;globalThis.performance=originalPerformance;dom.window.close()}

import '../../src/styles/index.css';
import React from 'react';import {createRoot} from 'react-dom/client';
import '@angular/compiler';import {Component,provideZonelessChangeDetection,signal} from '@angular/core';import {bootstrapApplication} from '@angular/platform-browser';
import {KitDensityLensComponent,KitGravityParticleBurstComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {DensityLens} from '../../src/components/ui/DensityLens';import {GravityParticleBurst} from '../../src/components/ui/GravityParticleBurst';
const api=window as any,p=new URLSearchParams(location.search),framework=p.get('framework');api.unmount?.();api.events=[];
const initial={stateful:false,lensSize:150,lensShape:'circle' as 'circle'|'oval'|'square',zoomScale:2,showBorder:true,custom:false,content:'Inspect this content',label:'Create particle burst',particleCount:36};
const style=document.createElement('style');style.textContent='#fixture{padding:40px}#lens{width:300px;height:180px;margin-bottom:80px}#lens>div,#lens .k-density-lens{width:100%;height:100%}.sample-content{padding:20px;background:#18212a;width:300px;height:180px}';document.head.append(style);
function Counter(){const [count,setCount]=React.useState(0);return <button className="counter" onClick={()=>setCount(n=>n+1)}>{count}</button>}
class NativeCounter{count=signal(0)}
Component({selector:'native-counter',standalone:true,template:'<button class="counter" (click)="count.set(count()+1)">{{count()}}</button>',styles:':host{display:contents}'})(NativeCounter);
if(framework==='react'){
 let opts=initial;const root=createRoot(document.body.appendChild(document.createElement('div')));
 const render=()=>root.render(<div id="fixture" data-framework="react"><div id="lens"><DensityLens lensSize={opts.lensSize} lensShape={opts.lensShape} zoomScale={opts.zoomScale} showBorder={opts.showBorder} renderLensContent={opts.custom?({x,y,scale})=><span id="context">{x},{y},{scale}</span>:undefined}><div className="sample-content">{opts.stateful?<Counter/>:opts.content}</div></DensityLens></div><form onSubmit={e=>{e.preventDefault();api.events.push('submit')}}><div id="burst"><GravityParticleBurst label={opts.label} particleCount={opts.particleCount} onClick={()=>api.events.push('click')}/></div></form></div>);
 api.update=(patch:any)=>{opts={...opts,...patch};render()};api.unmount=()=>root.unmount();render();
}else{
 class Consumer{opts=signal(initial);click=()=>api.events.push('click');submit(e:Event){e.preventDefault();api.events.push('submit')}}
 Component({selector:'batch24-consumer',standalone:true,imports:[NativeCounter,KitDensityLensComponent,KitGravityParticleBurstComponent],template:`<div id="fixture" data-framework="angular"><ng-template #content><div class="sample-content">@if(opts().stateful){<native-counter/>}@else{{{opts().content}}}</div></ng-template><ng-template #renderer let-x="x" let-y="y" let-scale="scale"><span id="context">{{x}},{{y}},{{scale}}</span></ng-template><div id="lens"><kit-density-lens [children]="content" [lensSize]="opts().lensSize" [lensShape]="opts().lensShape" [zoomScale]="opts().zoomScale" [showBorder]="opts().showBorder" [renderLensContent]="opts().custom?renderer:undefined"/></div><form (submit)="submit($event)"><div id="burst"><kit-gravity-particle-burst [label]="opts().label" [particleCount]="opts().particleCount" [onClick]="click"/></div></form></div>`})(Consumer);
 document.body.append(document.createElement('batch24-consumer'));void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{const c=app.components[0].instance;api.update=(patch:any)=>c.opts.update(old=>({...old,...patch}));api.unmount=()=>app.destroy()});
}

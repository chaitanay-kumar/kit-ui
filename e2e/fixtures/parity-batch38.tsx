import '../../src/styles/index.css';import '../../packages/angular/styles.css';
import React from 'react';import {createRoot} from 'react-dom/client';import {flushSync} from 'react-dom';
import '@angular/compiler';import {Component,ErrorHandler,provideZonelessChangeDetection,signal} from '@angular/core';import {bootstrapApplication} from '@angular/platform-browser';
import {SpeedWarp} from '../../src/components/ui/SpeedWarp';import {DepthCorridor} from '../../src/components/ui/DepthCorridor';import {KitSpeedWarpComponent,KitDepthCorridorComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const api=window as any;api.events=[];api.failures=[];api.draws=[];api.clears=0;
window.addEventListener('error',event=>{api.failures.push(event.message);event.preventDefault()});
const nativeContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(...args:any[]):any{
 const context=(nativeContext as any).apply(this,args);if(args[0]!=='2d'||!context)return context;let seed=17;Math.random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
 if(!(context as any).tracked){(context as any).tracked=true;let from:number[]=[],to:number[]=[];const move=context.moveTo.bind(context),line=context.lineTo.bind(context),stroke=context.stroke.bind(context),clear=context.clearRect.bind(context);
 context.moveTo=(x:number,y:number)=>{from=[x,y];move(x,y)};context.lineTo=(x:number,y:number)=>{to=[x,y];line(x,y)};context.stroke=()=>{api.draws.push({from,to,color:context.strokeStyle,width:context.lineWidth,cap:context.lineCap});stroke()};context.clearRect=(...rect:number[])=>{api.clears++;clear(...rect)};
 }return context;
} as any;
const query=new URLSearchParams(location.search),warp=query.has('warp');document.body.style.cssText='margin:0;padding:24px';document.documentElement.classList.add('dark');
const host=document.body.appendChild(document.createElement('div'));host.id='fixture';host.style.cssText='position:relative;width:100%;max-width:1000px;height:400px';
const layers=Array.from({length:9},(_,index)=>({id:'layer-'+index,title:'Layer '+(index+1),subtitle:'Depth '+index,content:'Content for layer '+(index+1),blurAmount:99}));let opts:any=warp?{paused:true,starCount:24}:{layers};
const select=(index:number)=>{api.events.push(index);if(opts.throwSelect)throw new Error('Selection failed');if(opts.follow)api.update({activeLayerIndex:index})};
if(query.get('framework')==='react'){
 const root=createRoot(host);const render=()=>flushSync(()=>root.render(warp?<SpeedWarp {...opts}>{opts.overlay?<button onClick={()=>api.events.push('overlay')}>Overlay action</button>:undefined}</SpeedWarp>:<DepthCorridor {...opts} layers={opts.layers.map((layer:any,index:number)=>opts.templateLayer===index?{...layer,content:<button onClick={()=>api.events.push('content')}>Projected {layer.title}</button>}:layer)} onLayerChange={opts.observe?select:undefined}/>));
 api.update=(patch:any)=>{opts={...opts,...patch};render()};api.unmount=()=>root.unmount();api.read=()=>opts;render();api.ready=true;
}else{
 class Consumer{opts=signal(opts);warp=warp;select=select;overlayAction=()=>api.events.push('overlay');contentAction=()=>api.events.push('content');layers=(template:any)=>this.opts().layers.map((layer:any,index:number)=>this.opts().templateLayer===index?{...layer,content:template}:layer)}
 Component({selector:'batch38-consumer',standalone:true,host:{style:'display:contents'},imports:[KitSpeedWarpComponent,KitDepthCorridorComponent],template:`@if(warp){<ng-template #overlayContent><button (click)="overlayAction()">Overlay action</button></ng-template><kit-speed-warp [speed]="opts().speed" [starCount]="opts().starCount" [paused]="opts().paused" [className]="opts().className" [content]="opts().overlay?overlayContent:undefined"/>}@else{<ng-template #layerContent let-layer><button (click)="contentAction()">Projected {{layer.title}}</button></ng-template><kit-depth-corridor [layers]="layers(layerContent)" [activeLayerIndex]="opts().activeLayerIndex" [onLayerChange]="opts().observe?select:undefined" [enableParallax]="opts().enableParallax" [perspectiveDepth]="opts().perspectiveDepth" [className]="opts().className"/>}`})(Consumer);
 host.append(document.createElement('batch38-consumer'));void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError(error:Error){api.failures.push(error.message)}}}]}).then(app=>{api.update=(patch:any)=>{opts={...opts,...patch};app.components[0].instance.opts.set(opts);app.tick()};api.unmount=()=>app.destroy();api.read=()=>opts;api.ready=true});
}

import '../../packages/angular/styles.css';import '../../src/styles/index.css';
import React from 'react';import {createRoot} from 'react-dom/client';
import '@angular/compiler';import {Component,provideZonelessChangeDetection,signal} from '@angular/core';import {bootstrapApplication} from '@angular/platform-browser';
import {KitMorphingBlobComponent,KitCircularOrbitComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {MorphingBlob} from '../../src/components/ui/MorphingBlob';import {CircularOrbit} from '../../src/components/ui/CircularOrbit';
const api=window as any,framework=new URLSearchParams(location.search).get('framework');
const items=Array.from({length:4},(_,i)=>({id:String(i),src:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="92" height="92"><rect width="92" height="92" fill="purple"/></svg>'),alt:'Ignored description',size:i===0?110:92}));
const initial={width:400,height:400,points:8,baseRadius:120,variance:0,speed:.7,stiffness:45,damping:9,cursorFollow:true,cursorStrength:.35,cursorSmoothness:.08,colors:['#7C3AED','#06B6D4'] as [string,string],items,title:'Push',orbitSpeed:.00022,radius:270,pauseOnHover:true,stageWidth:400};
if(framework==='react'){
 const root=createRoot(document.body.appendChild(document.createElement('div')));let opts=initial;
 const render=()=>root.render(<div id="fixture" data-framework="react"><div id="blob"><MorphingBlob width={opts.width} height={opts.height} points={opts.points} baseRadius={opts.baseRadius} variance={opts.variance} speed={opts.speed} stiffness={opts.stiffness} damping={opts.damping} cursorFollow={opts.cursorFollow} cursorStrength={opts.cursorStrength} cursorSmoothness={opts.cursorSmoothness} colors={opts.colors}/></div><div id="second-blob"><MorphingBlob width={100} height={100} baseRadius={20}/></div><div id="orbit" style={{width:opts.stageWidth}}><CircularOrbit items={opts.items} title={opts.title} speed={opts.orbitSpeed} radius={opts.radius} pauseOnHover={opts.pauseOnHover}/></div></div>);
 api.update=(patch:any)=>{opts={...opts,...patch};render()};api.unmount=()=>root.unmount();render();
}else{
 class Consumer{opts=signal(initial)}
 Component({selector:'batch22-consumer',standalone:true,imports:[KitMorphingBlobComponent,KitCircularOrbitComponent],template:`<div id="fixture" data-framework="angular"><div id="blob"><kit-morphing-blob [width]="opts().width" [height]="opts().height" [points]="opts().points" [baseRadius]="opts().baseRadius" [variance]="opts().variance" [speed]="opts().speed" [stiffness]="opts().stiffness" [damping]="opts().damping" [cursorFollow]="opts().cursorFollow" [cursorStrength]="opts().cursorStrength" [cursorSmoothness]="opts().cursorSmoothness" [colors]="opts().colors"/></div><div id="second-blob"><kit-morphing-blob [width]="100" [height]="100" [baseRadius]="20"/></div><div id="orbit" [style.width.px]="opts().stageWidth"><kit-circular-orbit [items]="opts().items" [title]="opts().title" [speed]="opts().orbitSpeed" [radius]="opts().radius" [pauseOnHover]="opts().pauseOnHover"/></div></div>`})(Consumer);
 document.body.append(document.createElement('batch22-consumer'));void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{const c=app.components[0].instance;api.update=(patch:any)=>c.opts.update(old=>({...old,...patch}));api.unmount=()=>app.destroy()});
}

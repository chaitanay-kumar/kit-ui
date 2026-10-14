import '../../packages/angular/styles.css';
import '../../src/styles/index.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import '@angular/compiler';
import {Component,provideZonelessChangeDetection,signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitMeteorsComponent,KitTextScrambleDecoderComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {Meteors} from '../../src/components/ui/Meteors';
import {TextScrambleDecoder} from '../../src/components/ui/TextScrambleDecoder';
const api=window as any,framework=new URLSearchParams(location.search).get('framework');
const initial={text:'KIT_UI.REGISTRY.SYNCED',trigger:'manual',duration:400,characters:'X',replayLabel:'Replay text decode',number:20,color:'#94A3B8',trailColor:'#64748B',tailLength:60,angle:215,minDelay:.2,maxDelay:1.2,minDuration:2,maxDuration:8};
api.enters=0;
if(framework==='react'){
 const root=createRoot(document.body.appendChild(document.createElement('div')));let opts=initial;
 const render=()=>root.render(<div id="fixture" data-framework="react"><div id="decoder"><TextScrambleDecoder text={opts.text} trigger={opts.trigger as any} duration={opts.duration} characters={opts.characters} replayLabel={opts.replayLabel} onMouseEnter={()=>api.enters++}/></div><div id="meteor-stage" style={{position:'relative',width:400,height:240}}><Meteors number={opts.number} color={opts.color} trailColor={opts.trailColor} tailLength={opts.tailLength} angle={opts.angle} minDelay={opts.minDelay} maxDelay={opts.maxDelay} minDuration={opts.minDuration} maxDuration={opts.maxDuration}><span>Projected content</span></Meteors></div></div>);
 api.update=(patch:any)=>{opts={...opts,...patch};render()};api.unmount=()=>root.unmount();render();
}else{
 class Consumer{opts=signal(initial);enter=()=>api.enters++}
 Component({selector:'batch21-consumer',standalone:true,imports:[KitMeteorsComponent,KitTextScrambleDecoderComponent],template:`<div id="fixture" data-framework="angular"><div id="decoder"><kit-text-scramble-decoder [text]="opts().text" [trigger]="opts().trigger" [duration]="opts().duration" [characters]="opts().characters" [replayLabel]="opts().replayLabel" [onMouseEnter]="enter"/></div><div id="meteor-stage" style="position:relative;width:400px;height:240px"><kit-meteors [number]="opts().number" [color]="opts().color" [trailColor]="opts().trailColor" [tailLength]="opts().tailLength" [angle]="opts().angle" [minDelay]="opts().minDelay" [maxDelay]="opts().maxDelay" [minDuration]="opts().minDuration" [maxDuration]="opts().maxDuration"><span>Projected content</span></kit-meteors></div></div>`})(Consumer);
 document.body.append(document.createElement('batch21-consumer'));
 void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{const c=app.components[0].instance;api.update=(patch:any)=>c.opts.update(old=>({...old,...patch}));api.unmount=()=>app.destroy()});
}

import "../../packages/angular/styles.css";
import "../../src/styles/index.css";
import React from 'react';
import {createRoot} from 'react-dom/client';
import '@angular/compiler';
import {Component,provideZonelessChangeDetection,signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitCursorFollowerComponent,KitLiquidRippleButtonComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {CursorFollower} from '../../src/components/ui/CursorFollower';
import {LiquidRippleButton} from '../../src/components/ui/LiquidRippleButton';
const p=new URLSearchParams(location.search),api=window as any;
const initial={offsetX:10,offsetY:20,size:32,stiffness:450,damping:32,mass:.5,hideOnLeave:true,scaleOnMove:true,custom:true,variant:'secondary',showIcon:true,disabled:false,className:''};
api.events=[];api.framework=p.get('framework');
const click=()=>api.events.push('click'),pointer=()=>api.events.push('pointer');
if(api.framework==='react'){
 const root=createRoot(document.body.appendChild(document.createElement('div')));let opts=initial;
 const render=()=>root.render(<div id="fixture" data-framework="react" style={{padding:100}}><CursorFollower size={opts.size} offsetX={opts.offsetX} offsetY={opts.offsetY} stiffness={opts.stiffness} damping={opts.damping} mass={opts.mass} hideOnLeave={opts.hideOnLeave} scaleOnMove={opts.scaleOnMove}>{opts.custom?<span>Follow</span>:undefined}</CursorFollower><CursorFollower className="default-follower" scaleOnMove={false}/><CursorFollower data-native-id="native-follower" className="native-follower" style={{width:64,height:48,backgroundColor:"rgb(200, 0, 0)"}}><span>Native follower</span></CursorFollower><LiquidRippleButton variant={opts.variant as any} showIcon={opts.showIcon} disabled={opts.disabled} className={opts.className} onClick={click} onPointerDown={pointer}>Ripple</LiquidRippleButton><LiquidRippleButton disabled>Disabled</LiquidRippleButton><LiquidRippleButton type="submit" form="native-form" onClick={()=>false} name="intent" value="save" aria-label="Native action">Native</LiquidRippleButton><form id="native-form" onSubmit={event=>{event.preventDefault();api.events.push("submit")}}/><LiquidRippleButton disabled>Static disabled</LiquidRippleButton></div>);
 api.update=(patch:any)=>{opts={...opts,...patch};render()};api.unmount=()=>root.unmount();render();
}else{
 class C{returnFalse=()=>false;submit(event:Event){event.preventDefault();api.events.push("submit")}nativeStyle={width:"64px",height:"48px",backgroundColor:"rgb(200, 0, 0)"};opts=signal(initial);click=click;pointer=pointer}
 Component({selector:'batch-consumer',standalone:true,imports:[KitCursorFollowerComponent,KitLiquidRippleButtonComponent],template:`<div id="fixture" data-framework="angular" style="padding:100px"><kit-cursor-follower [size]="opts().size" [offsetX]="opts().offsetX" [offsetY]="opts().offsetY" [stiffness]="opts().stiffness" [damping]="opts().damping" [mass]="opts().mass" [hideOnLeave]="opts().hideOnLeave" [scaleOnMove]="opts().scaleOnMove">@if(opts().custom){<span>Follow</span>}</kit-cursor-follower><kit-cursor-follower className="default-follower" [scaleOnMove]="false"/><div kitCursorFollower data-native-id="native-follower" className="native-follower" [style]="nativeStyle"><span>Native follower</span></div><kit-liquid-ripple-button [variant]="opts().variant" [showIcon]="opts().showIcon" [disabled]="opts().disabled" [className]="opts().className" [onClick]="click" [onPointerDown]="pointer">Ripple</kit-liquid-ripple-button><kit-liquid-ripple-button [disabled]="true">Disabled</kit-liquid-ripple-button><button kitLiquidRippleButton type="submit" form="native-form" [onClick]="returnFalse" name="intent" value="save" aria-label="Native action">Native</button><form id="native-form" (submit)="submit($event)"></form><button kitLiquidRippleButton disabled>Static disabled</button></div>`})(C);
 document.body.append(document.createElement('batch-consumer'));
 void bootstrapApplication(C,{providers:[provideZonelessChangeDetection()]}).then(app=>{const c=app.components[0].instance;api.update=(patch:any)=>c.opts.update((old:any)=>({...old,...patch}));api.unmount=()=>app.destroy()})
}

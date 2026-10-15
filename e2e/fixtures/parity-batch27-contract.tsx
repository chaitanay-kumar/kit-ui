import '../../packages/angular/styles.css';import '../../src/styles/index.css';import React from 'react';import {createRoot} from 'react-dom/client';import '@angular/compiler';import {Component,provideZonelessChangeDetection,signal} from '@angular/core';import {bootstrapApplication} from '@angular/platform-browser';
import {KitSmartUploadComponent,KitLiquidCommandPaletteComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';import {SmartUpload} from '../../src/components/ui/SmartUpload';import {LiquidCommandPalette} from '../../src/components/ui/LiquidCommandPalette';
const api=window as any;api.unmount?.();api.runs=[];api.commandsRun=[];api.scrolls=[];
api.createdUrls=[];api.revokedUrls=[];const createURL=URL.createObjectURL.bind(URL),revokeURL=URL.revokeObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=createURL(blob);api.createdUrls.push(url);return url};URL.revokeObjectURL=url=>{api.revokedUrls.push(url);revokeURL(url)};
const originalScroll=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(options){api.scrolls.push(this.id);originalScroll?.call(this,options)};
const commands=[{id:'a',label:'Alpha',keywords:'first catalog',onSelect:()=>new Promise((resolve,reject)=>api.commandsRun.push({resolve,reject}))},{id:'disabled',label:'Disabled',disabled:true,onSelect:()=>{throw Error('disabled')}},{id:'b',label:'Beta',onSelect:()=>new Promise((resolve,reject)=>api.commandsRun.push({resolve,reject}))}];
const upload=(file:File,context:any)=>new Promise<void>((resolve,reject)=>api.runs.push({file,context,resolve,reject}));
const initial={disabled:false,accept:'image/*,.pdf',maxSize:1.6*1024*1024,maxFiles:2,commands,upload};
if(new URLSearchParams(location.search).get('framework')==='react'){
 let opts=initial;const root=createRoot(document.body.appendChild(document.createElement('div')));const render=()=>root.render(<div id="fixture" style={{padding:24}}><LiquidCommandPalette commands={opts.commands} disabled={opts.disabled}/><SmartUpload {...opts}/></div>);api.update=(patch:any)=>{opts={...opts,...patch};render()};api.unmount=()=>root.unmount();render();
}else{
 class Consumer{opts=signal(initial)}
 Component({selector:'batch27-consumer',standalone:true,imports:[KitLiquidCommandPaletteComponent,KitSmartUploadComponent],template:`<div id="fixture" style="padding:24px"><kit-liquid-command-palette [commands]="opts().commands" [disabled]="opts().disabled"/><kit-smart-upload [accept]="opts().accept" [maxSize]="opts().maxSize" [maxFiles]="opts().maxFiles" [disabled]="opts().disabled" [upload]="opts().upload"/></div>`})(Consumer);
 document.body.append(document.createElement('batch27-consumer'));void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{const c=app.components[0].instance;api.update=(patch:any)=>c.opts.update(old=>({...old,...patch}));api.unmount=()=>app.destroy()});
}

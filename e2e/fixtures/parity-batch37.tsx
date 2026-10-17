import '../../src/styles/index.css';
import '../../packages/angular/styles.css';
import React from 'react';import {createRoot} from 'react-dom/client';import {flushSync} from 'react-dom';
import '@angular/compiler';import {Component,ErrorHandler,provideZonelessChangeDetection,signal} from '@angular/core';import {bootstrapApplication} from '@angular/platform-browser';
import {ExpandableDataRow} from '../../src/components/ui/ExpandableDataRow';import {InteractiveTimeline} from '../../src/components/ui/InteractiveTimeline';
import {KitExpandableDataRowComponent,KitInteractiveTimelineComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const api=window as any;api.events=[];api.failures=[];api.copies=[];
const query=new URLSearchParams(location.search),timeline=query.has('timeline');
document.body.style.cssText='margin:0;padding:24px';document.documentElement.classList.add('dark');
const host=document.body.appendChild(document.createElement('div'));host.id='fixture';host.style.width='min(1000px,100%)';
const samples=[{id:'a',title:'Build artifacts',timestamp:'Now',status:'completed',description:'Production build verified.',tag:'CI/CD',commitHash:'123456789abcd',metrics:[{label:'Size',value:'142 KB'},{label:'Time',value:'48s'},{label:'Checks',value:'289'}],author:{name:'Ada',role:'Engineer'}},{id:'b',title:'Replicate',timestamp:'Active',status:'in-progress',description:'Replicating to the edge.'},{id:'c',title:'Cutover',timestamp:'Pending',status:'pending'},{id:'d',title:'Rollback',timestamp:'Yesterday',status:'failed'}];
let opts:any=timeline?{items:samples}:{};
Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:(value:string)=>{api.copies.push(value);return api.failCopy?Promise.reject(new Error('Denied')):Promise.resolve()}}});
const action=(name:string,item:any)=>{api.events.push([name,item.id]);if(api.throwAction)throw new Error('Action failure')};
const select=(item:any)=>{api.events.push(['select',item.id]);if(api.throwSelect)throw new Error('Select failure')};
const click=(event:MouseEvent)=>{api.events.push(['root',event.defaultPrevented]);if(api.preventRoot)event.preventDefault();if(api.throwRoot)throw new Error('Root failure');return false};
window.addEventListener('error',event=>{api.failures.push(event.message);event.preventDefault()});
if(query.get('framework')==='react'){
 const root=createRoot(host);let mount=0;
 const render=()=>flushSync(()=>root.render(timeline?<InteractiveTimeline key={mount} {...opts} {...opts.attributes} onItemSelect={select} onClick={click}/>:<ExpandableDataRow key={mount} {...opts} onRowAction={action}/>));
 api.update=(patch:any)=>{opts={...opts,...patch};render()};api.remount=()=>{mount++;render()};api.read=()=>opts;api.flush=()=>render();api.unmount=()=>root.unmount();render();api.ready=true;
}else{
 class Consumer{opts=signal(opts);mounted=signal(true);timeline=timeline;action=action;select=select;click=click}
 Component({selector:'batch37-consumer',standalone:true,imports:[KitExpandableDataRowComponent,KitInteractiveTimelineComponent],template:`@if(mounted()){@if(timeline){<kit-interactive-timeline [items]="opts().items" [defaultSelectedId]="opts().defaultSelectedId" [collapsible]="opts().collapsible" [className]="opts().className" [style]="opts().style" [attributes]="opts().attributes" [onItemSelect]="select" [onClick]="click"/>}@else{<kit-expandable-data-row [items]="opts().items" [allowMultiple]="opts().allowMultiple" [defaultExpandedIds]="opts().defaultExpandedIds" [isLoading]="opts().isLoading" [className]="opts().className" [onRowAction]="action"/>}}`})(Consumer);
 host.append(document.createElement('batch37-consumer'));
 void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError(error:Error){api.failures.push(error.message)}}}]}).then(app=>{api.update=(patch:any)=>{app.components[0].instance.opts.update((old:any)=>({...old,...patch}));app.tick()};api.remount=()=>{app.components[0].instance.mounted.set(false);app.tick();app.components[0].instance.mounted.set(true);app.tick()};api.read=()=>app.components[0].instance.opts();api.flush=()=>app.tick();api.unmount=()=>app.destroy();api.ready=true});
}

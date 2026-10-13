import '../../packages/angular/styles.css';
import '../../src/styles/index.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import '@angular/compiler';
import {Component,provideZonelessChangeDetection,signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitAnimatedNumberComponent,KitUnfoldAccordionComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {AnimatedNumber,type AnimatedNumberProps} from '../../src/components/ui/AnimatedNumber';
import {UnfoldAccordion,type UnfoldAccordionProps} from '../../src/components/ui/UnfoldAccordion';

type Options=Partial<AnimatedNumberProps>&Partial<UnfoldAccordionProps>&{rich?:boolean};
const params=new URLSearchParams(location.search),kind=params.get('kind')||'number';
document.documentElement.classList.toggle('dark',params.get('theme')==='dark');document.body.style.margin='20px';
const initial:Options=JSON.parse(params.get('initial')||'{}');
const items=[{id:'one',title:'First section',subtitle:'Summary',content:'First paragraph with enough detail to wrap on a small screen.'},{id:'two',title:'Second section',content:'Second paragraph.'}];
const api=window as unknown as {setBatchOptions:(options:Options)=>void;destroyBatch:()=>void;batchEvents:string[]};
api.batchEvents=[];
if(params.get('framework')==='react'){
 const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
 api.setBatchOptions=options=>root.render(<form onSubmit={e=>{e.preventDefault();api.batchEvents.push('submit');}}><div id="fixture" style={{width:Math.min(innerWidth-40,360),fontSize:32}}>{kind==='number'?<AnimatedNumber {...options} value={options.value??12450}/>:<UnfoldAccordion {...options} items={options.rich?[{id:'rich',title:'Rich content',content:<button type="button" onClick={()=>api.batchEvents.push('rich')}>Nested action</button>}]:options.items??items}/>}</div></form>);
 api.destroyBatch=()=>root.unmount();api.setBatchOptions(initial);
}else{
 class Consumer{readonly options=signal<Options>(initial);readonly initialItems=items;readonly kind=kind;readonly width=Math.min(innerWidth-40,360);event(){api.batchEvents.push('rich');}submit(event:Event){event.preventDefault();api.batchEvents.push('submit');}}
 Component({selector:'batch-consumer',standalone:true,imports:[KitAnimatedNumberComponent,KitUnfoldAccordionComponent],template:`<form (submit)="submit($event)"><div id="fixture" [style.width.px]="width" style="font-size:32px">@if(kind==='number'){<kit-animated-number [value]="options().value??12450" [decimals]="options().decimals" [prefix]="options().prefix" [suffix]="options().suffix" [stiffness]="options().stiffness" [damping]="options().damping" [mass]="options().mass" [useGrouping]="options().useGrouping" [compact]="options().compact" [className]="options().className"/>}@else{<ng-template #rich><button type="button" (click)="event()">Nested action</button></ng-template><kit-unfold-accordion [items]="options().rich?[{id:'rich',title:'Rich content',content:rich}]:(options().items??initialItems)" [allowMultiple]="options().allowMultiple" [defaultOpen]="options().defaultOpen" [className]="options().className"/>}</div></form>`})(Consumer);
 document.body.append(document.createElement('batch-consumer'));void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{api.setBatchOptions=options=>app.components[0].instance.options.set(options);api.destroyBatch=()=>app.destroy();});
}

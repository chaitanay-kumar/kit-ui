import '../../packages/angular/styles.css';
import '../../src/styles/index.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import '@angular/compiler';
import {Component,provideZonelessChangeDetection,signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitInteractiveDataCardComponent,KitTimelineScrubberComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {InteractiveDataCard} from '../../src/components/ui/InteractiveDataCard';
import {TimelineScrubber,type TimelineEvent} from '../../src/components/ui/TimelineScrubber';

type Options={loading?:boolean;disabled?:boolean;error?:string;empty?:boolean;one?:boolean;fail?:boolean;rich?:boolean};
const params=new URLSearchParams(location.search),kind=params.get('kind')||'card',initial:Options=JSON.parse(params.get('initial')||'{}');
document.body.style.margin='20px';const events:TimelineEvent[]=[{id:'idea',title:'A small beginning',time:'09:00',description:'Sketch the idea.'},{id:'build',title:'Find the rhythm',time:'11:30',description:'Build a working prototype.'},{id:'ship',title:'Ready to share',time:'16:00',description:'Bring the details together.'}];
const api=window as unknown as {setBatchOptions:(value:Options)=>void;settleAction:()=>void;destroyBatch:()=>void;batchEvents:string[]};api.batchEvents=[];let settle=()=>{};
const action=(options:Options)=>()=>new Promise<void>((resolve,reject)=>{settle=()=>options.fail?reject(Error('expected')):resolve();api.settleAction=settle;});
if(params.get('framework')==='react'){
 const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
 api.setBatchOptions=options=>root.render(<div id="fixture" style={{width:Math.min(innerWidth-40,420)}}>{kind==='card'?<InteractiveDataCard loading={options.loading} disabled={options.disabled} error={options.error} onAction={action(options)}>{options.rich?<button type="button" onClick={()=>api.batchEvents.push('rich')}>Nested action</button>:undefined}</InteractiveDataCard>:<TimelineScrubber events={options.empty?[]:options.one?[events[0]]:events} loading={options.loading} disabled={options.disabled} onChange={(event,index)=>api.batchEvents.push(`${event.id}:${index}`)}/>}</div>);
 api.destroyBatch=()=>root.unmount();api.setBatchOptions(initial);
}else{
 class Consumer{readonly options=signal<Options>(initial);readonly events=events;readonly kind=kind;action=()=>action(this.options())();change=(event:TimelineEvent,index:number)=>api.batchEvents.push(`${event.id}:${index}`);recordRich(){api.batchEvents.push('rich');}}
 Component({selector:'batch-consumer',standalone:true,imports:[KitInteractiveDataCardComponent,KitTimelineScrubberComponent],template:`<div id="fixture" style="width:min(calc(100vw - 40px),420px)">@if(kind==='card'){<ng-template #rich><button type="button" (click)="recordRich()">Nested action</button></ng-template><kit-interactive-data-card [loading]="options().loading" [disabled]="options().disabled" [error]="options().error" [onAction]="action" [children]="options().rich?rich:undefined"/>}@else{<kit-timeline-scrubber [events]="options().empty?[]:options().one?[events[0]]:events" [loading]="options().loading" [disabled]="options().disabled" [onChange]="change"/>}</div>`})(Consumer);
 document.body.append(document.createElement('batch-consumer'));void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{api.setBatchOptions=value=>app.components[0].instance.options.set(value);api.destroyBatch=()=>app.destroy();});
}

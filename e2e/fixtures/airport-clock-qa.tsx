import '../../packages/angular/styles.css';
import '../../src/styles/index.css';
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@angular/compiler';
import {Component,signal,provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitAirportMatrixClockComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {AirportMatrixClock} from '../../src/components/ui/AirportMatrixClock';

const query=new URLSearchParams(location.search),api=window as any;
const initial=JSON.parse(query.get('initial')||'{}');api.events=[];
document.documentElement.classList.toggle('dark',query.get('theme')==='dark');
if(query.get('framework')==='react'){
  const root=createRoot(document.body.appendChild(document.createElement('div')));
  function Consumer(){
    const [options,setOptions]=useState(initial);
    api.patch=(patch:object)=>setOptions((current:any)=>({...current,...patch}));
    const changed=(cities:any)=>{api.events.push(cities);if(options.acceptChanges)setOptions({...options,cities});};
    return <div id="fixture" style={{padding:20,maxWidth:616}}><AirportMatrixClock {...options} onCitiesChange={options.callback===false?undefined:changed}/></div>;
  }
  api.destroy=()=>root.unmount();root.render(<Consumer/>);
}else{
  class Consumer{
    options=signal(initial);
    changed=(cities:any)=>{api.events.push(cities);if(this.options().acceptChanges)this.options.update((value:any)=>({...value,cities}));};
    constructor(){api.patch=(patch:object)=>this.options.update((current:any)=>({...current,...patch}));}
  }
  Component({selector:'airport-qa',standalone:true,imports:[KitAirportMatrixClockComponent],template:`<div id="fixture" style="padding:20px;max-width:616px"><kit-airport-matrix-clock [cities]="options().cities" [format]="options().format" [showSeconds]="options().showSeconds" [showCountry]="options().showCountry" [showControls]="options().showControls" [updateInterval]="options().updateInterval" [onCitiesChange]="options().callback===false?undefined:changed"/></div>`})(Consumer);
  document.body.append(document.createElement('airport-qa'));
  void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(ref=>api.destroy=()=>ref.destroy());
}

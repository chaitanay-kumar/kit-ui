import '../../packages/angular/styles.css';
import '../../src/styles/index.css';
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@angular/compiler';
import {Component, provideZonelessChangeDetection, signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitIosSearchBarComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
import {IOSSearchBar, type IOSSearchBarProps} from '../../src/components/ui/IOSSearchBar';

type Options = Partial<IOSSearchBarProps> & {submit?:boolean; ignoreChange?:boolean};
const api=window as unknown as {setIOSOptions:(options:Options)=>void;destroyIOS:()=>void;iosEvents:string[]};
const events:string[]=api.iosEvents=[];
const params=new URLSearchParams(location.search);
const initial:Options={autoFocus:params.get('autoFocus')==='true'};
document.documentElement.classList.toggle('dark',params.get('theme')==='dark');
document.body.style.margin='20px';
if(params.get('framework')==='react'){
  let update:(options:Options)=>void;
  // eslint-disable-next-line react/only-export-components
  function Consumer(){
    const [options,setOptions]=useState<Options>(initial);const [value,setValue]=useState('');
    update=(next)=>{setOptions(next);if(next.value!==undefined)setValue(next.value);};
    return <form onSubmit={e=>{e.preventDefault();events.push('form-submit');}}><IOSSearchBar {...options} value={value} onChange={value=>{events.push('change:'+value);if(!options.ignoreChange)setValue(value);}} onSubmit={options.submit?value=>events.push('submit:'+value):undefined} onClear={()=>events.push('clear')}/></form>;
  }
  const node=document.createElement('div');document.body.append(node);const root=createRoot(node);root.render(<Consumer/>);
  api.setIOSOptions=options=>update(options);api.destroyIOS=()=>root.unmount();
}else{
  class Consumer{
    readonly options=signal<Options>(initial);readonly value=signal('');
    readonly change=(value:string)=>{events.push('change:'+value);if(!this.options().ignoreChange)this.value.set(value);};
    readonly submit=(value:string)=>events.push('submit:'+value);readonly clear=()=>events.push('clear');
    formSubmit(event:Event){event.preventDefault();events.push('form-submit');}
  }
  Component({selector:'ios-consumer',standalone:true,imports:[KitIosSearchBarComponent],template:`<form (submit)="formSubmit($event)"><kit-ios-search-bar [value]="value()" [onChange]="change" [onSubmit]="options().submit?submit:undefined" [onClear]="clear" [placeholder]="options().placeholder" [disabled]="options().disabled" [autoFocus]="options().autoFocus" [collapsedWidth]="options().collapsedWidth" [expandedWidth]="options().expandedWidth" [className]="options().className"/></form>`})(Consumer);
  document.body.append(document.createElement('ios-consumer'));
  void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{
    api.setIOSOptions=options=>{app.components[0].instance.options.set(options);if(options.value!==undefined)app.components[0].instance.value.set(options.value);};
    api.destroyIOS=()=>app.destroy();
  });
}

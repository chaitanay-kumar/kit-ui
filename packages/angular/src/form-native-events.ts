import type {ErrorHandler} from '@angular/core';
import {invokeNativeEventCallback} from './native-event-callback';
export type FormEventHandlers=Partial<{[Name in keyof HTMLElementEventMap]:(event:HTMLElementEventMap[Name])=>unknown}>;
/** Native event map forwards remaining DOM callbacks to the ref element. */
export class FormNativeEvents{
 private listeners=new Map<string,{callback:unknown;listener:EventListener}>();
 constructor(private element:HTMLElement,private errors:ErrorHandler){}
 apply(handlers:FormEventHandlers|undefined):void{
  for(const[name,entry]of this.listeners)if(!handlers||handlers[name as keyof FormEventHandlers]!==entry.callback){this.element.removeEventListener(name,entry.listener);this.listeners.delete(name)}
  for(const[name,callback]of Object.entries(handlers??{}))if(callback&&!this.listeners.has(name)){const listener:EventListener=event=>invokeNativeEventCallback(callback as (event:Event)=>void,event,this.errors);this.element.addEventListener(name,listener);this.listeners.set(name,{callback,listener})}
 }
 destroy():void{for(const[name,entry]of this.listeners)this.element.removeEventListener(name,entry.listener);this.listeners.clear()}
}

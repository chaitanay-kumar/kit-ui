import {NativeRootBindings,type NativeAttributes,type NativeStyle} from './native-root-bindings';
const booleanAttributes=new Set('allowfullscreen async autofocus autoplay checked controls default defer disabled formnovalidate hidden inert ismap itemscope loop multiple muted nomodule novalidate open playsinline readonly required reversed selected'.split(' '));
/** Boolean native form attributes use presence, unlike aria/data scalar strings. */
export class FormNativeBindings{
 private bindings:NativeRootBindings;constructor(element:HTMLElement){this.bindings=new NativeRootBindings(element)}
 apply(style:NativeStyle|undefined,attributes:NativeAttributes|undefined):void{const normalized:NativeAttributes={};for(const[key,value]of Object.entries(attributes??{})){const name=key==='className'?'class':key==='htmlFor'?'for':key.toLowerCase();normalized[name]=booleanAttributes.has(name)?value?'':null:value}this.bindings.apply(style,normalized)}
}

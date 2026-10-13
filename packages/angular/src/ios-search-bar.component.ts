// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {installIOSSearchMotion} from './ios-search-motion';
@Component({
 selector:"kit-ios-search-bar", standalone:true,
 host:{'data-kit':'ios-search-bar',class:'k-ios-host'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./ios-search.css"],
template:`
<div [class]="'k-ios-outer '+className()">
<div class="k-ios-control" [class.k-ios-focused]="focused()">
<svg aria-hidden="true" class="k-ios-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m21 21-4.34-4.34"/>
<circle cx="11" cy="11" r="8"/>
</svg>
<input #searchInput type="search" [value]="value()" [placeholder]="placeholder()" [attr.aria-label]="placeholder()" [disabled]="disabled()" (input)="change($event)" (change)="change($event)" (focus)="focused.set(true)" (blur)="focused.set(false)" (keydown)="keys($event)"/>@if(showClear()){<button type="button" class="k-ios-clear" aria-label="Clear search" (click)="clear()">
<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
<path d="M18 6 6 18"/>
<path d="m6 6 12 12"/>
</svg>
</button>}@if(!expanded()&&!value()){<div class="k-ios-shortcut">
<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
</svg>
<span>K</span>
</div>}</div>
</div>
`
})
export class KitIosSearchBarComponent {
readonly value=input.required<string>();readonly onChange=input.required<(value:string)=>void>();readonly onSubmit=input<(value:string)=>void>();readonly onClear=input<()=>void>();
readonly placeholder=input<string,string|undefined>('Search...',{transform:value=>value===undefined?'Search...':value});readonly disabled=input<boolean,boolean|undefined>(false,{transform:value=>value===undefined?false:value});readonly autoFocus=input<boolean,boolean|undefined>(false,{transform:value=>value===undefined?false:value});readonly collapsedWidth=input<number|string,number|string|undefined>('220px',{transform:value=>value===undefined?'220px':value});readonly expandedWidth=input<number|string,number|string|undefined>('340px',{transform:value=>value===undefined?'340px':value});readonly className=input<string,string|undefined>('',{transform:value=>value===undefined?'':value});
readonly focused=signal(false);readonly expanded=computed(()=>this.focused()||this.value().length>0);readonly showClear=signal(false);readonly searchInput=viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
constructor(){installIOSSearchMotion(this.expanded,this.collapsedWidth,this.expandedWidth,this.value,this.showClear);}
ngAfterViewInit():void{if(this.autoFocus())this.searchInput().nativeElement.focus();}
change(event:Event):void{const input=event.target as HTMLInputElement;if(input.value!==this.value())this.onChange()(input.value);}
clear():void{this.onChange()('');this.onClear()?.();this.searchInput().nativeElement.focus();}
keys(event:KeyboardEvent):void{if(event.key==='Enter'&&this.onSubmit()){event.preventDefault();this.onSubmit()!(this.value());}else if(event.key==='Escape')this.searchInput().nativeElement.blur();}
}

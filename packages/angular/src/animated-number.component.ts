// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, computed, input } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {AnimatedNumberDigitComponent} from './animated-number-digit';
@Component({
 selector:"kit-animated-number", standalone:true,
 host:{'data-kit':'animated-number',class:'k-an-host'},
 imports:[AnimatedNumberDigitComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./animated-number.css"],
template:`
<span [class]="'k-an-root '+className()" [attr.aria-label]="prefix()+formatted()+suffix()">@if(prefix()){<span class="k-an-prefix">{{prefix()}}</span>}<span class="k-an-digits">@for(char of chars();track char.key){<kit-number-digit [digit]="char.value" [stiffness]="stiffness()" [damping]="damping()" [mass]="mass()"/>}</span>@if(suffix()){<span class="k-an-suffix">{{suffix()}}</span>}</span>
`
})
export class KitAnimatedNumberComponent {
readonly value=input.required<number>();
readonly decimals=input<number,number|undefined>(0,{transform:v=>v===undefined?0:v});readonly prefix=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly suffix=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly stiffness=input<number,number|undefined>(170,{transform:v=>v===undefined?170:v});readonly damping=input<number,number|undefined>(22,{transform:v=>v===undefined?22:v});readonly mass=input<number,number|undefined>(.6,{transform:v=>v===undefined?.6:v});readonly useGrouping=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly compact=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});
readonly formatted=computed(()=>{const value=this.value(),decimals=this.decimals();if(this.compact())return new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:decimals,minimumFractionDigits:decimals}).format(value);const[intPart,decPart]=Math.abs(value).toFixed(decimals).split('.');const integer=this.useGrouping()?intPart.replace(/\B(?=(\d{3})+(?!\d))/g,','):intPart;return(value<0?'-':'')+integer+(decPart!==undefined?'.'+decPart:'');});readonly chars=computed(()=>Array.from(this.formatted()).map((value,index)=>({value,key:index+'-'+([',','.','-'].includes(value)?value:'num')})));
}

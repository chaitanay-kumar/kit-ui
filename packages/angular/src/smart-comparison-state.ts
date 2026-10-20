import {computed,signal,type TemplateRef} from '@angular/core';
export interface ComparisonPlan{id:string;name:string;tagline:string;price:string;billingPeriod?:string;badge?:string;featured?:boolean;ctaText?:string;onCtaClick?:()=>void}
/** Native projected content with the source value's JSON-comparison representation. */
export interface ComparisonTemplateValue{template:TemplateRef<unknown>;comparisonValue:unknown}
export type ComparisonValue=string|boolean|number|null|undefined|ComparisonTemplateValue;
export interface ComparisonFeature{id:string;name:string;description?:string;values:Record<string,ComparisonValue>}
export interface ComparisonCategory{id:string;title:string;features:ComparisonFeature[]}
interface ComparisonFrame{features:ComparisonFeature[];plans:ComparisonPlan[];selected:string;tooltip:string|null}
export class SmartComparisonState{
 readonly plans=signal<ComparisonPlan[]>([]);readonly categories=signal<ComparisonCategory[]>([]);readonly selected=signal('');readonly query=signal('');readonly differences=signal(false);readonly collapsed=signal(new Set<string>());readonly tooltip=signal<string|null>(null);readonly exited=signal(new Set<string>());
 readonly entering=signal(new Set<string>());private mounted=false;private snapshots=new Map<string,ComparisonFrame>();private visible=new Set<string>();
 update(plans:ComparisonPlan[],categories:ComparisonCategory[],defaultPlanId?:string):void{this.plans.set(plans);this.categories.set(categories);if(!this.mounted){this.mounted=true;this.selected.set(defaultPlanId||plans.find(p=>p.featured)?.id||plans[0]?.id||'')}}
 private comparisonValue(value:ComparisonValue):unknown{return value&&typeof value==='object'&&'template'in value?value.comparisonValue:value}
 readonly filtered=computed(()=>{const query=this.query(),diff=this.differences(),plans=this.plans();return this.categories().map(category=>({...category,features:category.features.filter(feature=>{const match=!query.trim()||feature.name.toLowerCase().includes(query.toLowerCase())||feature.description?.toLowerCase().includes(query.toLowerCase());if(!match)return false;if(!diff||plans.length<=1)return true;const first=JSON.stringify(this.comparisonValue(feature.values[plans[0].id]));return plans.slice(1).some(plan=>JSON.stringify(this.comparisonValue(feature.values[plan.id]))!==first)})})).filter(category=>category.features.length>0)});
 toggle(id:string):void{const next=new Set(this.collapsed());if(next.has(id)){next.delete(id);const exited=new Set(this.exited());if(exited.has(id))this.entering.update(value=>new Set([...value,id]));exited.delete(id);this.exited.set(exited)}else{const features=(this.filtered().find(category=>category.id===id)?.features??[]).map(feature=>({...feature,values:{...feature.values}}));this.snapshots.set(id,{features,plans:this.plans().map(plan=>({...plan})),selected:this.selected(),tooltip:this.tooltip()});next.add(id)}this.collapsed.set(next)}
 frame(category:ComparisonCategory):ComparisonFrame{return this.collapsed().has(category.id)?this.snapshots.get(category.id)??{features:[],plans:[],selected:'',tooltip:null}:{features:category.features,plans:this.plans(),selected:this.selected(),tooltip:this.tooltip()}}
 reconcile(groups:ComparisonCategory[]):void{const visible=new Set(groups.map(group=>group.id));for(const id of this.visible)if(!visible.has(id)){if(this.collapsed().has(id))this.exited.update(value=>new Set([...value,id]));this.snapshots.delete(id);this.entering.update(value=>{const next=new Set(value);next.delete(id);return next})}this.visible=visible}
 finishExit(id:string):void{if(!this.collapsed().has(id))return;this.exited.update(value=>new Set([...value,id]));this.snapshots.delete(id)}
 template(value:ComparisonValue):TemplateRef<unknown>|undefined{if(value&&typeof value==='object'&&'template'in value)return value.template;return undefined}
 scalar(value:ComparisonValue):string|number{return typeof value==='string'||typeof value==='number'?value:''}
}

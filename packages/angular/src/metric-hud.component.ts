// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, DestroyRef, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
export type MetricTrend='up'|'down'|'neutral';export interface MetricDelta{value:string;trend:MetricTrend;isPositiveGood?:boolean}export interface MetricItem{id:string;label:string;value:string;unit?:string;delta:MetricDelta;timeSeries:Record<string,number[]>;status?:'normal'|'warning'|'critical';description?:string}interface MetricPoint{x:number;y:number;val:number}let metricHudId=0;
@Component({
 selector:"kit-metric-hud", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./metric-hud.css"],
template:`
<section [class]="'k-metric-hud '+className()" role="region" aria-label="Developer telemetry and metrics HUD">
<header>
<div>
<strong>System Telemetry HUD</strong>
<i [attr.data-status]="activeMetric()?.status??'normal'">
</i>
<small>Live hardware-accelerated telemetry</small>
</div>
<nav aria-label="Time range">@for(range of timeRanges();track range){<button type="button" [class.active]="selectedTimeRange()===range" [attr.aria-pressed]="selectedTimeRange()===range" (click)="selectedTimeRange.set(range)">{{range}}</button>}</nav>
</header>
<div class="k-metric-grid">@for(metric of metrics();track metric.id){<article [class.active]="activeMetric()?.id===metric.id" (click)="selectedMetricId.set(metric.id)">
<div>
<span>{{metric.label}}</span>
<button type="button" title="Copy value" [attr.aria-label]="'Copy '+metric.label+' value'" (click)="copy($event,metric)">{{copiedId()===metric.id?'✓':'⧉'}}</button>
</div>
<p>
<strong>{{metric.value}}</strong>
<small>{{metric.unit}}</small>
<em [attr.data-trend]="metric.delta.trend" [attr.data-good]="deltaGood(metric.delta)">{{trendSymbol(metric.delta.trend)}} {{metric.delta.value}}</em>
</p>
</article>}</div>@if(activeMetric();as metric){<div class="k-metric-chart">
<div>
<strong>{{metric.label}}</strong>
<span>({{selectedTimeRange()}})</span>
<output>{{hoveredPoint()?'Indexed: '+hoveredPoint()!.val.toFixed(1)+' '+(metric.unit??''):'Hover canvas to inspect timeline values'}}</output>
</div>
<svg #chart viewBox="0 0 400 120" preserveAspectRatio="none" role="img" [attr.aria-label]="metric.label+' '+selectedTimeRange()+' series'" (pointermove)="inspect($event)" (pointerleave)="hoverIndex.set(null)">
<defs>
<linearGradient [id]="gradientId" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#3b82f6" stop-opacity=".18"/>
<stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
</linearGradient>
</defs>@if(areaD()){<path [attr.d]="areaD()" [attr.fill]="'url(#'+gradientId+')'"/>}<path [attr.d]="pathD()" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>@if(hoveredPoint();as point){<line [attr.x1]="point.x" y1="0" [attr.x2]="point.x" y2="120"/>
<circle [attr.cx]="point.x" [attr.cy]="point.y" r="4"/>}</svg>
<footer>
<span>Min: {{minVal().toFixed(1)}}</span>
<span>Max: {{maxVal().toFixed(1)}}</span>
</footer>
</div>}</section>
`
})
export class KitMetricHudComponent {
readonly metrics=input.required<MetricItem[]>();readonly timeRanges=input<string[],string[]|undefined>(['1h','24h','7d','30d'],{transform:value=>value??['1h','24h','7d','30d']});readonly defaultTimeRange=input<string,string|undefined>('24h',{transform:value=>value??'24h'});readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly selectedMetricId=signal('');readonly selectedTimeRange=signal('');readonly hoverIndex=signal<number|null>(null);readonly copiedId=signal<string|null>(null);readonly chart=viewChild<ElementRef<SVGSVGElement>>('chart');readonly gradientId='metric-gradient-'+(++metricHudId);readonly activeMetric=computed(()=>this.metrics().find(metric=>metric.id===this.selectedMetricId())??this.metrics()[0]);readonly activeData=computed(()=>{const metric=this.activeMetric();if(!metric)return[];return metric.timeSeries[this.selectedTimeRange()]??metric.timeSeries[Object.keys(metric.timeSeries)[0]]??[];});readonly minVal=computed(()=>Math.min(...this.activeData(),0));readonly maxVal=computed(()=>Math.max(...this.activeData(),1));readonly points=computed<MetricPoint[]>(()=>{const data=this.activeData();if(data.length<2)return[];const min=this.minVal(),range=this.maxVal()-min||1;return data.map((val,index)=>({x:10+index/(data.length-1)*380,y:110-(val-min)/range*100,val}));});readonly pathD=computed(()=>{const points=this.points();if(!points.length)return'';let path='M '+points[0].x+' '+points[0].y;for(let index=0;index<points.length-1;index++){const p0=points[index===0?0:index-1],p1=points[index],p2=points[index+1],p3=points[index+2]??p2;path+=` C ${(p1.x+(p2.x-p0.x)/6).toFixed(1)} ${(p1.y+(p2.y-p0.y)/6).toFixed(1)}, ${(p2.x-(p3.x-p1.x)/6).toFixed(1)} ${(p2.y-(p3.y-p1.y)/6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;}return path;});readonly areaD=computed(()=>{const points=this.points(),path=this.pathD();return points.length?path+' L '+points.at(-1)!.x+' 120 L '+points[0].x+' 120 Z':'';});readonly hoveredPoint=computed(()=>{const index=this.hoverIndex();return index===null?null:this.points()[index]??null;});private copyTimer:ReturnType<typeof setTimeout>|undefined;constructor(){effect(()=>{if(!this.selectedMetricId()&&this.metrics()[0])this.selectedMetricId.set(this.metrics()[0].id);if(!this.selectedTimeRange())this.selectedTimeRange.set(this.defaultTimeRange());},{allowSignalWrites:true});inject(DestroyRef).onDestroy(()=>clearTimeout(this.copyTimer));}trendSymbol(trend:MetricTrend):string{return trend==='up'?'↗':trend==='down'?'↘':'−';}deltaGood(delta:MetricDelta):boolean{return delta.trend==='neutral'||(delta.trend==='up')===(delta.isPositiveGood!==false);}inspect(event:PointerEvent):void{const svg=this.chart()?.nativeElement,points=this.points();if(!svg||!points.length)return;const rect=svg.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*400;let closest=0;points.forEach((point,index)=>{if(Math.abs(point.x-x)<Math.abs(points[closest].x-x))closest=index;});this.hoverIndex.set(closest);}async copy(event:MouseEvent,metric:MetricItem):Promise<void>{event.stopPropagation();try{await navigator.clipboard.writeText(metric.value+' '+(metric.unit??''));}catch{}this.copiedId.set(metric.id);clearTimeout(this.copyTimer);this.copyTimer=setTimeout(()=>this.copiedId.set(null),2000);}
}

// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, DestroyRef, ElementRef, computed, inject, input, signal, untracked, viewChild } from '@angular/core';
import {afterRenderEffect} from '@angular/core';import {DependencyTraceMotion} from './dependency-trace-motion';export interface TraceNode{id:string;label:string;type?:'service'|'database'|'api'|'client';x?:number;y?:number}export interface TraceConnection{from:string;to:string;label?:string;type?:string}
@Component({
 selector:"kit-dependency-trace", standalone:true,
 host:{style:'display:contents'},
 encapsulation:ViewEncapsulation.None,styleUrls:["./dependency-trace.css"],
template:`
<div #root role="region" aria-label="Dependency Relationship Graph" [class]="'k-dependency-trace '+className()">
<svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">@for(connection of connections();track connection.from+'-'+connection.to+'-'+$index){@if(pathFor(connection);as path){<g>@if(isConnected(connection)){<path data-trace-kind="glow" [attr.d]="path" fill="none" stroke="rgba(59, 130, 246, 0.3)" stroke-width="6" stroke-linecap="round"/>}<path data-trace-kind="path" [attr.data-opacity]="activeId()&&!isConnected(connection)?0.2:isConnected(connection)?1:.7" [attr.d]="path" fill="none" [attr.stroke]="isConnected(connection)?'#3B82F6':'#1F1F1F'" [attr.stroke-width]="isConnected(connection)?'2.5':'1.5'" [attr.stroke-dasharray]="isConnected(connection)?'none':'4 4'" stroke-linecap="round"/>
</g>}}@for(node of positionedNodes();track node.id){<g class="k-trace-node" [attr.transform]="'translate('+node.x+', '+node.y+')'" [attr.data-node-id]="node.id" (click)="select(node.id)" (mouseenter)="hover(node.id)" (mouseleave)="hover(null)">@if(activeId()===node.id){<circle data-trace-kind="ring" [attr.r]="nodeSize()/2+6" fill="none" stroke="rgba(59, 130, 246, 0.4)" stroke-width="2"/>}<circle data-trace-kind="circle" [attr.data-scale]="activeId()===node.id?1.15:1" [attr.data-opacity]="dimmed(node.id)?0.25:1" [attr.r]="nodeSize()/2" [attr.fill]="activeId()===node.id?'#141414':'#0E0E0E'" [attr.stroke]="activeId()===node.id?'#3B82F6':connectedNodeIds().has(node.id)&&activeId()?'#A1A1A1':'#1F1F1F'" stroke-width="1.5"/>
<text data-trace-kind="text" [attr.data-opacity]="dimmed(node.id)?0.25:1" [attr.data-weight]="activeId()===node.id?700:500" text-anchor="middle" dy="3.5">{{node.label.length>8?node.label.slice(0,7)+'…':node.label}}</text>
</g>}</svg>
<div class="k-trace-status">
<span>{{activeId()?'Selected: '+activeId():'Hover node to trace dependencies'}}</span>
<span>{{connections().length}} connections</span>
</div>
</div>
`
})
export class KitDependencyTraceComponent {
readonly nodes=input.required<TraceNode[]>();readonly connections=input.required<TraceConnection[]>();readonly onNodeSelect=input<((id:string)=>void)|undefined>();readonly onNodeHover=input<((id:string|null)=>void)|undefined>();readonly nodeSize=input<number,number|undefined>(36,{transform:v=>v===undefined?36:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly hoveredNodeId=signal<string|null>(null);readonly selectedNodeId=signal<string|null>(null);readonly activeId=computed(()=>this.hoveredNodeId()||this.selectedNodeId());readonly positionedNodes=computed(()=>this.nodes().map((node,index)=>{if(node.x!==undefined&&node.y!==undefined)return node;if(this.nodes().length===1)return {...node,x:200,y:150};const angle=index/this.nodes().length*2*Math.PI-Math.PI/2;return {...node,x:200+140*Math.cos(angle),y:140+80*Math.sin(angle)}}));readonly connectedNodeIds=computed(()=>{const active=this.activeId(),ids=new Set<string>();if(!active)return ids;ids.add(active);for(const connection of this.connections()){if(connection.from===active)ids.add(connection.to);if(connection.to===active)ids.add(connection.from)}return ids});readonly root=viewChild<ElementRef<HTMLElement>>('root');private motion:DependencyTraceMotion|undefined;
pathFor(connection:TraceConnection):string|null{const from=this.positionedNodes().find(node=>node.id===connection.from),to=this.positionedNodes().find(node=>node.id===connection.to);if(!from||!to||from.x===undefined||from.y===undefined||to.x===undefined||to.y===undefined)return null;return 'M '+from.x+' '+from.y+' Q '+((from.x+to.x)/2)+' '+((from.y+to.y)/2-15)+' '+to.x+' '+to.y}
isConnected(connection:TraceConnection):boolean{return !!this.activeId()&&(connection.from===this.activeId()||connection.to===this.activeId())}
dimmed(id:string):boolean{return this.activeId()!==null&&!this.connectedNodeIds().has(id)}
hover(id:string|null):void{this.hoveredNodeId.set(id);this.onNodeHover()?.(id)}select(id:string):void{this.selectedNodeId.set(id===this.selectedNodeId()?null:id);this.onNodeSelect()?.(id)}
constructor(){afterRenderEffect(()=>{const root=this.root()?.nativeElement;this.positionedNodes();this.connections();this.activeId();if(root)untracked(()=>{this.motion??=new DependencyTraceMotion(root);this.motion.refresh()})});inject(DestroyRef).onDestroy(()=>this.motion?.destroy())}
}

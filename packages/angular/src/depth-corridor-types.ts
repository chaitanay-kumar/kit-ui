import type {TemplateRef} from '@angular/core';
export interface DepthLayer {id:string;title?:string;subtitle?:string;content:string|TemplateRef<{$implicit:DepthLayer;index:number}>;blurAmount?:number}
export interface DepthGeometry {x:number;y:number;z:number;scale:number;opacity:number;blur:number;rotateY:number}

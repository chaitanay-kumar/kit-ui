import type {TemplateRef} from '@angular/core';
export interface BatchAction{id:string;label:string;icon?:TemplateRef<unknown>|string;action:(selectedIds:string[])=>Promise<void>|void;color?:'default'|'danger'|'success'}
export interface BatchItem{id:string;title:string;subtitle?:string;icon?:TemplateRef<unknown>|string;[key:string]:any}
export interface BatchTraySnapshot{ids:string[];items:BatchItem[];actions:BatchAction[];loading:string|null;selection:((ids:string[])=>void)|undefined;complete:((id:string)=>void)|undefined}

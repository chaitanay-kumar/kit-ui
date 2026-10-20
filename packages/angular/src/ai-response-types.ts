export type AIResponseStatus='idle'|'generating'|'streaming'|'complete'|'error'|'cancelled';
export interface AIResponseSource{id:string|number;title:string;url?:string;snippet?:string;sourceType?:'doc'|'github'|'web'|'api'|string}
export interface AIResponseTool{name:string;status?:'success'|'running'|'error';duration?:string}
export interface AIResponseBlock{type:'paragraph'|'heading'|'code'|'list'|'blockquote'|'table';level?:number;content?:string;language?:string;items?:string[];headers?:string[];rows?:string[][]}
export interface AIResponseInline{type:'text'|'strong'|'code'|'link';text:string;url?:string}

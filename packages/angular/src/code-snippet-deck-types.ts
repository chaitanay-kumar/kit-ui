export interface SnippetParameter{id:string;label:string;type:'boolean'|'select'|'text';defaultValue:any;options?:string[]}
export interface SnippetItem{language:string;label:string;filename?:string;code:string|((params:Record<string,any>)=>string);highlightLines?:number[]}

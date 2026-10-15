import type {TemplateRef} from '@angular/core';
export interface StackCard{id:string;title:string;subtitle?:string;content:TemplateRef<unknown>|string|number|boolean|null|undefined;badge?:string;disabled?:boolean}

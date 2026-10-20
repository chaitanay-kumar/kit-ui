import {twMerge} from 'tailwind-merge';
/** Keep scoped CSS fallbacks while preserving the source's utility merge contract. */
export function nativeClasses(scoped:string,defaults:string,custom:string):string{return scoped+' '+twMerge(defaults,custom)}

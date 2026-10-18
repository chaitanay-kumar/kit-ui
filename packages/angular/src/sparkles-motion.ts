export type SparklesMotionTarget=Record<string,string|number>;
export interface SparklesTransition{duration?:number;delay?:number;ease?:'linear'|'easeIn'|'easeOut'|'easeInOut'|[number,number,number,number]}
/** Native scalar CSS targets for the source root's initial/animate overrides. */
export class SparklesRootMotion{
 private node:HTMLElement|undefined;private animation:Animation|undefined;private target='';private initialized=false;
 update(node:HTMLElement,ready:boolean,initial:SparklesMotionTarget|false|undefined,animate:SparklesMotionTarget|undefined,transition:SparklesTransition|undefined):void{
  this.node=node;const target=animate??{opacity:ready?1:0},key=JSON.stringify(target);
  if(!this.initialized){this.initialized=true;Object.assign(node.style,initial===false?target:initial??{opacity:0})}
  if(key===this.target)return;this.target=key;const computed=node.ownerDocument.defaultView?.getComputedStyle(node),from:SparklesMotionTarget={};for(const property of Object.keys(target))from[property]=computed?.getPropertyValue(property.replace(/[A-Z]/g,v=>'-'+v.toLowerCase()))||String(target[property]);this.animation?.cancel();
  const custom=transition!==undefined,defined=custom&&Object.keys(transition).some(key=>key!=='delay');
  const ease=transition?.ease??(custom&&!defined?[.25,.1,.35,1]:'easeOut'),easing=Array.isArray(ease)?`cubic-bezier(${ease.join(',')})`:({easeIn:'cubic-bezier(.42,0,1,1)',easeOut:'cubic-bezier(0,0,.58,1)',easeInOut:'cubic-bezier(.42,0,.58,1)',linear:'linear'}[ease]);
  if(!node.animate){Object.assign(node.style,target);return}const animation=node.animate([from,target],{duration:(transition?.duration??(custom?.3:.8))*1000,delay:(transition?.delay??0)*1000,easing,fill:'both'});this.animation=animation;animation.onfinish=()=>{if(this.animation!==animation)return;Object.assign(node.style,target);animation.cancel();this.animation=undefined};
 }
 destroy():void{this.animation?.cancel();this.animation=undefined;this.node=undefined}
}

import {DestroyRef, inject, signal} from '@angular/core';
import {particleDelete, type ParticleDeleteOptions} from './particle-delete-engine';

/** Native equivalent of useParticleDelete. Create in an Angular injection context. */
export function createParticleDelete(defaultOptions:()=>ParticleDeleteOptions=()=>({})){
  const isDeleting=signal(false);
  const destroyRef=inject(DestroyRef);
  let controller:AbortController|undefined;
  destroyRef.onDestroy(()=>controller?.abort());
  const triggerDelete=async(elementOrRef:HTMLElement|{current:HTMLElement|null},onDeleteAction?:()=>void,overrideOptions?:ParticleDeleteOptions):Promise<void>=>{
    if(destroyRef.destroyed||isDeleting())return;
    const element=elementOrRef instanceof HTMLElement?elementOrRef:elementOrRef.current;
    if(!element){onDeleteAction?.();return}
    controller=new AbortController();
    const request=controller;
    isDeleting.set(true);
    try{
      await particleDelete(element,{...defaultOptions(),...overrideOptions},request.signal);
      if(!destroyRef.destroyed)onDeleteAction?.();
    }catch(error){
      if(request.signal.aborted)return;
      console.error('Particle delete fallback triggered:',error);
      onDeleteAction?.();
    }finally{
      if(controller===request)controller=undefined;
      if(!destroyRef.destroyed)isDeleting.set(false);
    }
  };
  return {isDeleting:isDeleting.asReadonly(),triggerDelete};
}

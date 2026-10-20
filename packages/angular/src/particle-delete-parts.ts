import {Component,ErrorHandler,TemplateRef,computed,inject,input} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {FormPart} from './form-parts';
import {createParticleDelete} from './particle-delete-controller';
import type {ParticleDeleteOptions} from './particle-delete-engine';
export {createParticleDelete} from './particle-delete-controller';
export {particleDelete,type ParticleDeleteOptions} from './particle-delete-engine';

export interface ParticleDeleteContext{isDeleting:boolean;handleDelete:()=>void}

/** Project static children or supply content with let-isDeleting/let-handleDelete. */
@Component({selector:'kit-particle-delete-container',standalone:true,imports:[NgTemplateOutlet],host:{style:'display:contents'},template:`<div #element [class]="'relative '+className()" [style.position]="'relative'" [attr.data-deleting]="isDeleting()">@if(content()){<ng-container [ngTemplateOutlet]="content()!" [ngTemplateOutletContext]="context()"/>}@else{<ng-content/>}</div>`})
export class KitParticleDeleteContainerComponent extends FormPart<HTMLDivElement>{
  readonly options=input<ParticleDeleteOptions|undefined>();
  readonly onDelete=input<(()=>void)|undefined>();
  readonly content=input<TemplateRef<ParticleDeleteContext>|undefined>();
  private readonly deletion=createParticleDelete(()=>this.options()??{});
  private readonly errors=inject(ErrorHandler);
  readonly isDeleting=this.deletion.isDeleting;
  readonly handleDelete=():void=>{
    const element=this.element()?.nativeElement;
    const callback=this.onDelete();
    if(!element){callback?.();return}
    void this.deletion.triggerDelete(element,callback).catch(error=>this.errors.handleError(error));
  };
  readonly context=computed<ParticleDeleteContext>(()=>({isDeleting:this.isDeleting(),handleDelete:this.handleDelete}));
}

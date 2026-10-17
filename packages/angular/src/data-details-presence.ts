import {Directive,DestroyRef,ElementRef,afterEveryRender,effect,inject,input,output,signal,untracked} from '@angular/core';
import {AccordionMotion} from './smooth-accordion-motion';
/** The source details use the same gentle height/opacity presence contract as Smooth Accordion. */
@Directive({selector:'[kitDataDetailsPresence]',standalone:true,exportAs:'detailsPresence'})
export class DataDetailsPresenceDirective{
 readonly open=input.required<boolean>();readonly present=signal(false);readonly removed=output<void>();
 private readonly host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 private readonly motion=new AccordionMotion(this.host,()=>{this.present.set(false);this.removed.emit()});
 private initialized=false;private previous=false;
 constructor(){effect(()=>{const open=this.open();untracked(()=>{if(!this.initialized){this.initialized=true;this.previous=open;this.present.set(open);this.motion.initialize(open);return}if(open!==this.previous){this.previous=open;if(open)this.present.set(true);this.motion.toggle(open)}})});afterEveryRender(()=>this.motion.rendered(this.open()));inject(DestroyRef).onDestroy(()=>this.motion.destroy())}
}

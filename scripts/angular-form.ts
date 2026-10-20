export const formPort={
 description:'Native composable Form root with noValidate, projected controls, scalar native attributes/styles, submit callback and forwarded-element equivalent.',
 hostMetadata:"{'data-kit':'form',style:'display:contents'}",stylesFile:'./form.css',
 imports:"import {ErrorHandler} from '@angular/core';import {FormPart} from './form-parts';import {KitFormSpacingDirective} from './form-spacing';import {invokeNativeEventCallback} from './native-event-callback';export * from './form-parts';",
 controller:'FormPart<HTMLFormElement>',componentImports:'KitFormSpacingDirective',
 template:'<form #element [kitFormSpacing]="16" [class]="\'k-form \'+className()" [noValidate]="!!noValidate()" (submit)="submit($event)"><ng-content/></form>',
 body:"readonly noValidate=input<boolean|undefined>(true);readonly onSubmit=input<((event:SubmitEvent)=>void)|undefined>();private readonly errors=inject(ErrorHandler);submit(event:Event):void{invokeNativeEventCallback(this.onSubmit(),event as SubmitEvent,this.errors)}",
 inputs:['className: string','style: FormStyle','attributes: FormAttributes','events: FormEventHandlers','noValidate: boolean','onSubmit: (event: SubmitEvent) => void'],outputs:[]
};

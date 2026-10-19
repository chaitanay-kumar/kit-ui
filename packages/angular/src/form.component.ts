// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation, inject, input } from '@angular/core';
import {ErrorHandler} from '@angular/core';import {FormPart} from './form-parts';import {KitFormSpacingDirective} from './form-spacing';import {invokeNativeEventCallback} from './native-event-callback';export * from './form-parts';
@Component({
 selector:"kit-form", standalone:true,
 host:{'data-kit':'form',style:'display:contents'},
 imports:[KitFormSpacingDirective],
encapsulation:ViewEncapsulation.None,styleUrls:["./form.css"],
template:`
<form #element [kitFormSpacing]="16" [class]="'k-form '+className()" [noValidate]="!!noValidate()" (submit)="submit($event)">
<ng-content/>
</form>
`
})
export class KitFormComponent extends FormPart<HTMLFormElement> {
readonly noValidate=input<boolean|undefined>(true);readonly onSubmit=input<((event:SubmitEvent)=>void)|undefined>();private readonly errors=inject(ErrorHandler);submit(event:Event):void{invokeNativeEventCallback(this.onSubmit(),event as SubmitEvent,this.errors)}
}

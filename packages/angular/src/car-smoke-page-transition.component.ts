// Generated from authored native templates in scripts/generate-angular-ports.ts.
import { Component, ViewEncapsulation } from '@angular/core';
import {CarSmokeController} from './car-smoke-state';import {KitCarSmokeSvgComponent} from './car-smoke-svg';import {KitFormContentComponent} from './form-parts';
@Component({
 selector:"kit-car-smoke-page-transition", standalone:true,
 host:{class:'kcar-native',style:'display:contents'},
 imports:[KitCarSmokeSvgComponent,KitFormContentComponent],
encapsulation:ViewEncapsulation.None,styleUrls:["./car-smoke.css"],
template:`
<div data-kit="car-smoke-page-transition" [class]="panelClass()" dir="ltr">
<span class="kcar-trigger" (click)="trigger($event)" (keydown)="key($event)" tabindex="0" role="button" aria-label="Trigger Ferrari drift page transition">@if(content()){<kit-form-content [content]="content()"/>}@else{<ng-content>
<button type="button" class="kcar-button">
<span>Launch Transition</span>
<span class="kcar-arrow">→</span>
</button>
</ng-content>}</span>
 @if(state()!=='idle'){<div class="kcar-overlay" aria-hidden="true">
<canvas #canvas class="kcar-canvas" style="pointer-events:none">
</canvas>
<div #car class="kcar-car" [style.top]="top()" [style.transform]="carTransform()">
<kit-car-smoke-svg [width]="dimensions().width" [height]="dimensions().height" [dark]="dark()" [isLtr]="isLtr()" [wheelRotation]="values().wheel" [frontSteerAngle]="values().steer"/>
</div>
<div #backdrop class="kcar-backdrop" [style.background-color]="dark()?'#050505':'#FAFAFA'" [style.opacity]="values().opacity">
</div>
</div>}
 </div>
`
})
export class KitCarSmokePageTransitionComponent extends CarSmokeController {

}

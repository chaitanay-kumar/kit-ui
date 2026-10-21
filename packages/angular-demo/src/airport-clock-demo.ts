import {Component,HostListener,signal} from '@angular/core';
import {KitAirportMatrixClockComponent} from 'kit-ui-angular';
@Component({selector:'kit-airport-clock-demo',standalone:true,imports:[KitAirportMatrixClockComponent],styles:`:host{display:block}.k-am-stage{min-height:440px;display:flex;align-items:center;justify-content:center;padding:44px}.k-am-demo{width:100%;max-width:576px}@media(max-width:639px){.k-am-stage{min-height:360px;padding:22px}}`,template:`<div class="k-am-stage" [style.--amc-vw]="viewportUnit()"><div class="k-am-demo"><kit-airport-matrix-clock [showControls]="true"/></div></div>`})
export class AirportClockDemoComponent{
 readonly viewportUnit=signal('1vw');
 constructor(){this.updateViewport();}
 @HostListener('window:resize')updateViewport(){try{this.viewportUnit.set((window.parent.innerWidth/100)+'px');}catch{this.viewportUnit.set('1vw');}}
}

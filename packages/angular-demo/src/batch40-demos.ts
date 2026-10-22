import {Component,signal} from '@angular/core';
import {KitTorqueDialComponent,KitRocketPartyPopperComponent} from 'kit-ui-angular';
@Component({selector:'kit-torque-dial-demo',standalone:true,imports:[KitTorqueDialComponent],template:`<div class="k-motion-qa-stage"><div class="k-torque-example"><div class="k-torque-example-card"><kit-torque-dial [value]="gain()" [onChange]="change" [min]="0" [max]="100" unit="%" label="Master Output Gain"/><span>Click and drag or use mouse wheel to rotate dial with physical momentum</span></div></div></div>`})
export class TorqueDialDemoComponent{readonly gain=signal(48);readonly change=(value:number)=>this.gain.set(value)}
@Component({selector:'kit-rocket-party-popper-demo',standalone:true,imports:[KitRocketPartyPopperComponent],template:`<kit-rocket-party-popper/>`})
export class RocketPartyPopperDemoComponent{}

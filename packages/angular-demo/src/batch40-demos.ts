import {Component,signal} from '@angular/core';
import {KitTorqueDialComponent,KitRocketPartyPopperComponent} from 'kit-ui-angular';
@Component({selector:'kit-torque-dial-demo',standalone:true,imports:[KitTorqueDialComponent],template:`<div style="display:flex;justify-content:center;padding:24px"><kit-torque-dial [value]="gain()" [onChange]="change" unit="%" label="Gain Level"/></div>`})
export class TorqueDialDemoComponent{readonly gain=signal(48);readonly change=(value:number)=>this.gain.set(value)}
@Component({selector:'kit-rocket-party-popper-demo',standalone:true,imports:[KitRocketPartyPopperComponent],template:`<kit-rocket-party-popper/>`})
export class RocketPartyPopperDemoComponent{}

import {Component} from '@angular/core';
import {KitSpeedWarpComponent,KitDepthCorridorComponent,type DepthLayer} from 'kit-ui-angular';
@Component({selector:'kit-speed-warp-demo',standalone:true,imports:[KitSpeedWarpComponent],template:`<div style="position:relative;height:360px;background:#050505;border-radius:20px;overflow:hidden"><kit-speed-warp [speed]="25"><ng-template><div style="display:flex;height:100%;align-items:center;justify-content:center"><h2>Engage Warp Drive</h2></div></ng-template></kit-speed-warp></div>`})
export class SpeedWarpDemoComponent{}
@Component({selector:'kit-depth-corridor-demo',standalone:true,imports:[KitDepthCorridorComponent],template:`<kit-depth-corridor [layers]="layers"/>`})
export class DepthCorridorDemoComponent{readonly layers:DepthLayer[]=[{id:'interface',title:'Interface',subtitle:'Foreground layer',content:'Explore the interface.'},{id:'logic',title:'Application',subtitle:'Middle layer',content:'Connect presentation and behavior.'},{id:'data',title:'Data',subtitle:'Deep layer',content:'Keep the source of truth close.'}]}

import {Component,TemplateRef,computed,viewChild} from '@angular/core';
import {KitSpeedWarpComponent,KitDepthCorridorComponent,type DepthLayer} from 'kit-ui-angular';
@Component({selector:'kit-speed-warp-demo',standalone:true,imports:[KitSpeedWarpComponent],template:`<div style="position:relative;height:360px;background:#050505;border-radius:20px;overflow:hidden"><kit-speed-warp [speed]="25"><ng-template><div style="display:flex;height:100%;align-items:center;justify-content:center"><h2>Engage Warp Drive</h2></div></ng-template></kit-speed-warp></div>`})
export class SpeedWarpDemoComponent{}
@Component({selector:'kit-depth-corridor-demo',standalone:true,imports:[KitDepthCorridorComponent],template:`<ng-template #telemetry let-layer><div class="k-depth-telemetry" [style.color]="details[layer.id].color">{{details[layer.id].text}}</div></ng-template><div class="k-motion-qa-stage"><div class="k-depth-example"><kit-depth-corridor [layers]="layers()"/></div></div>`})
export class DepthCorridorDemoComponent{
 readonly telemetry=viewChild<TemplateRef<{$implicit:DepthLayer;index:number}>>('telemetry');
 readonly definitions=[{id:'1',title:'Edge Telemetry Gateway',subtitle:'Real-time routing engine'},{id:'2',title:'Serverless Worker Pool',subtitle:'Autonomous scaling nodes'},{id:'3',title:'Distributed State Cache',subtitle:'In-memory key-value mesh'},{id:'4',title:'Cold Storage Archive',subtitle:'S3-compatible immutable vault'}];
 readonly details:Record<string,{color:string;text:string}>={
  '1':{color:'oklch(.765 .177 163.223)',text:'● 12.4ms avg global latency'},
  '2':{color:'oklch(.746 .16 232.661)',text:'● 128 active clusters'},
  '3':{color:'oklch(.828 .189 84.429)',text:'● 99.98% cache hit ratio'},
  '4':{color:'oklch(.705 .015 286.067)',text:'● 42.8 TB encrypted data'},
 };
 readonly layers=computed<DepthLayer[]>(()=>{const content=this.telemetry();return content?this.definitions.map(layer=>({...layer,content})):[]});
}

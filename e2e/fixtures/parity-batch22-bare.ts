import '../../packages/angular/styles.css';import '@angular/compiler';
import {Component,provideZonelessChangeDetection} from '@angular/core';import {bootstrapApplication} from '@angular/platform-browser';
import {KitMorphingBlobComponent,KitCircularOrbitComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
class Consumer{items=[{id:'a',src:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E'}]}
Component({selector:'bare-batch22',standalone:true,imports:[KitMorphingBlobComponent,KitCircularOrbitComponent],template:'<div id="fixture"><kit-morphing-blob/><div style="width:400px"><kit-circular-orbit [items]="items"/></div></div>'})(Consumer);
document.body.append(document.createElement('bare-batch22'));void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]});

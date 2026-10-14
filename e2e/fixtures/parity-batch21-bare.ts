import '../../packages/angular/styles.css';
import '@angular/compiler';
import {Component,provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitMeteorsComponent,KitTextScrambleDecoderComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
class Consumer{}
Component({selector:'bare-batch21',standalone:true,imports:[KitMeteorsComponent,KitTextScrambleDecoderComponent],template:'<div id="fixture"><kit-text-scramble-decoder text="READY" trigger="manual"/><div style="position:relative;width:400px;height:240px"><kit-meteors [number]="3"/></div></div>'})(Consumer);
document.body.append(document.createElement('bare-batch21'));
void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]});

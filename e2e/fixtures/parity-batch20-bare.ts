import '../../packages/angular/styles.css';
import '@angular/compiler';
import {Component,provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitCursorFollowerComponent,KitLiquidRippleButtonComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
class BareConsumer {}
Component({selector:'bare-consumer',standalone:true,imports:[KitCursorFollowerComponent,KitLiquidRippleButtonComponent],template:'<div id="fixture"><kit-cursor-follower/><kit-liquid-ripple-button>Ripple</kit-liquid-ripple-button></div>'})(BareConsumer);
document.body.append(document.createElement('bare-consumer'));
void bootstrapApplication(BareConsumer,{providers:[provideZonelessChangeDetection()]});

import '@angular/compiler';
import '../../packages/angular/styles.css';
import {Component,provideZonelessChangeDetection,signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {KitWalletCardComponent,KitStickyPagesComponent} from '../../packages/angular/dist/fesm2022/kit-ui-angular.mjs';
const api=window as any;
class Consumer {count=signal(0);use=()=>this.count.update(v=>v+1);pages=[{title:'First'},{title:'Second'}]}
Component({selector:'batch31-bare',standalone:true,imports:[KitWalletCardComponent,KitStickyPagesComponent],template:`<kit-wallet-card balance="R500" [onUseWallet]="use"/><p role="status">Actions {{count()}}</p><div id="scroller" style="height:300px;overflow:auto"><kit-sticky-pages [pages]="pages" pageHeight="250px" [stackOffset]="20"/></div><kit-sticky-pages pageHeight="100px"><ng-template #stickyPage><button (click)="use()">Template action</button></ng-template></kit-sticky-pages>`})(Consumer);
document.body.style.cssText='margin:16px;font:16px/1.5 sans-serif';document.body.append(document.createElement('batch31-bare'));
void bootstrapApplication(Consumer,{providers:[provideZonelessChangeDetection()]}).then(app=>{api.unmount=()=>app.destroy();api.ready=true});

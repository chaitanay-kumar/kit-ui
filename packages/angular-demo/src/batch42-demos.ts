import {Component,signal} from '@angular/core';
import {KitCommandMenuComponent,KitSpotlightSearchComponent} from 'kit-ui-angular';
@Component({selector:'kit-command-menu-demo',standalone:true,imports:[KitCommandMenuComponent],template:`<button class="kit-button" (click)="open.set(true)">Open commands</button><kit-command-menu [isOpen]="open()" [onClose]="close"/>`})
export class CommandMenuDemoComponent{readonly open=signal(false);readonly close=()=>this.open.set(false)}
@Component({selector:'kit-spotlight-search-demo',standalone:true,imports:[KitSpotlightSearchComponent],template:`<button class="kit-button" (click)="open.set(true)">Open Spotlight</button><kit-spotlight-search [open]="open()" [onOpenChange]="change" [enableGlobalShortcut]="true"/>`})
export class SpotlightSearchDemoComponent{readonly open=signal(false);readonly change=(open:boolean)=>this.open.set(open)}

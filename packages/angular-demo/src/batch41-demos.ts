import {Component} from '@angular/core';
import {KitEvilEyeComponent,KitNimbuMirchiComponent} from 'kit-ui-angular';
@Component({selector:'kit-evil-eye-demo',standalone:true,imports:[KitEvilEyeComponent],template:`<kit-evil-eye caption="Hanging evil eye amulet"/>`})
export class EvilEyeDemoComponent{}
@Component({selector:'kit-nimbu-mirchi-demo',standalone:true,imports:[KitNimbuMirchiComponent],template:`<kit-nimbu-mirchi caption="Hanging nimbu-mirchi charm"/>`})
export class NimbuMirchiDemoComponent{}

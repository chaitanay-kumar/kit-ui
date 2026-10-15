import {Component} from '@angular/core';
import {KitWalletCardComponent,KitStickyPagesComponent} from 'kit-ui-angular';

@Component({selector:'kit-wallet-card-demo',standalone:true,imports:[KitWalletCardComponent],template:`<div style="width:100%;max-width:448px;margin-inline:auto"><kit-wallet-card/></div>`})
export class WalletCardDemoComponent {}

@Component({selector:'kit-sticky-pages-demo',standalone:true,imports:[KitStickyPagesComponent],template:`<p>Scroll to stack the pages. This preview uses the native Sticky Pages component.</p><div style="height:400px;overflow-y:auto"><kit-sticky-pages [pages]="pages" pageHeight="300px" [stackOffset]="24"/><div style="height:150px">Natural flow resumes</div></div>`})
export class StickyPagesDemoComponent {
  readonly pages=[{id:'architecture',title:'High-Performance Sub-system',subtitle:'Architecture',description:'Distributed architecture designed for low-latency web interactions with zero layout shifts.'},{id:'design',title:'Modern Monochromatic Aesthetic',subtitle:'Design system',description:'Curated typography and physical shadow depth.'},{id:'production',title:'Zero Third-Party Lock-in',subtitle:'Production ready',description:'Direct code ownership with full typing.'}];
}

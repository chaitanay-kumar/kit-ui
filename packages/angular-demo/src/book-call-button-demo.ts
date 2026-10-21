import {Component} from '@angular/core';
import {KitBookCallButtonComponent} from 'kit-ui-angular';

@Component({
  selector:'kit-book-call-button-demo',standalone:true,imports:[KitBookCallButtonComponent],
  styles:':host{display:block}.k-book-demo{min-height:440px;padding-block:48px;display:flex;align-items:center;justify-content:center}@media(max-width:639px){.k-book-demo{min-height:360px}}',
  template:'<div class="k-book-demo"><kit-book-call-button/></div>',
})
export class BookCallButtonDemoComponent{}

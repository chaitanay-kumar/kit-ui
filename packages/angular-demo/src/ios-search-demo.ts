import {Component, signal} from '@angular/core';
import {KitIosSearchBarComponent} from 'kit-ui-angular';

@Component({
  selector: 'kit-ios-search-demo', standalone: true, imports: [KitIosSearchBarComponent],
  styles: `:host{display:block}.ios-demo{padding-block:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}.ios-panel{padding:32px;border-radius:16px;background:#0e0e0e;border:1px solid #1f1f1f;display:flex;flex-direction:column;align-items:center;gap:16px;box-shadow:0 4px 6px -1px #0000001a,0 2px 4px -2px #0000001a}.ios-caption{font:12px/16px var(--font-mono,monospace);color:#6b6b6b}`,
  template: `<div class="ios-demo"><div class="ios-panel"><kit-ios-search-bar [value]="query()" [onChange]="change" placeholder="Search telemetry..."/><span class="ios-caption">{{query()?'Active query: "'+query()+'"':'Focus pill to test spring expansion (or press ⌘K)'}}</span></div></div>`,
})
export class IOSSearchDemoComponent {
  readonly query=signal('');
  readonly change=(value:string)=>this.query.set(value);
}

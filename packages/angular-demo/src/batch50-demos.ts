import {Component,signal} from '@angular/core';
import {KitPullToRefreshComponent,KitCarSmokePageTransitionComponent} from 'kit-ui-angular';
@Component({selector:'kit-pull-refresh-demo',standalone:true,imports:[KitPullToRefreshComponent],template:`<kit-pull-to-refresh/>`})
export class PullRefreshDemoComponent{}
@Component({selector:'kit-car-smoke-demo',standalone:true,imports:[KitCarSmokePageTransitionComponent],template:`<kit-car-smoke-page-transition [onTransitionComplete]="complete"/><p role="status">{{completed()?'Local transition complete.':'Launch a local transition.'}}</p>`})
export class CarSmokeDemoComponent{readonly completed=signal(false);readonly complete=()=>this.completed.set(true)}

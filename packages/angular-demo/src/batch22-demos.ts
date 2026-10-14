import {Component} from '@angular/core';import {KitMorphingBlobComponent,KitCircularOrbitComponent} from 'kit-ui-angular';
@Component({selector:'kit-morphing-blob-demo',standalone:true,imports:[KitMorphingBlobComponent],styles:':host{display:block}.k-blob-detail{display:flex;align-items:center;justify-content:center;height:400px;width:100%}',template:'<div class="k-blob-detail"><kit-morphing-blob [speed]="10" [baseRadius]="180" [points]="18"/></div>'})
export class MorphingBlobDemoComponent{}
@Component({selector:'kit-circular-orbit-demo',standalone:true,imports:[KitCircularOrbitComponent],styles:':host{display:block}.k-orbit-detail{width:100%;max-width:672px;margin-inline:auto}',template:'<div class="k-orbit-detail"><kit-circular-orbit title="Orbit" [speed]="0.00022" [radius]="240" [pauseOnHover]="true"/></div>'})
export class CircularOrbitDemoComponent{}

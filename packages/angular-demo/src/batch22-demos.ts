import {Component} from '@angular/core';import {KitMorphingBlobComponent,KitCircularOrbitComponent} from 'kit-ui-angular';
@Component({selector:'kit-morphing-blob-demo',standalone:true,imports:[KitMorphingBlobComponent],template:'<div class="flex items-center justify-center h-[400px] w-full"><kit-morphing-blob [speed]="10" [baseRadius]="180" [points]="18"/></div>'})
export class MorphingBlobDemoComponent{}
@Component({selector:'kit-circular-orbit-demo',standalone:true,imports:[KitCircularOrbitComponent],template:'<div class="w-full max-w-2xl mx-auto"><kit-circular-orbit title="Orbit" [speed]="0.00022" [radius]="240" [pauseOnHover]="true"/></div>'})
export class CircularOrbitDemoComponent{}

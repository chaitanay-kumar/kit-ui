import {AnimatedTabsIndicatorMotion} from './animated-tabs-motion';
let sequence=0;
/** Source layoutId projection and crossfade, isolated to this deck's identity. */
export class CodeDeckTabs {
 private readonly key='kit-code-deck-'+(++sequence);
 private readonly motion:AnimatedTabsIndicatorMotion;
 constructor(root:HTMLElement){this.motion=new AnimatedTabsIndicatorMotion(root,'.k-code-tab-indicator',{stiffness:380,damping:30,mass:.5})}
 capture():void{this.motion.capture(true)}
 rendered():void{this.motion.rendered(this.key)}
 destroy():void{this.motion.destroy()}
}

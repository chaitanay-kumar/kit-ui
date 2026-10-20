import {Component,signal} from '@angular/core';
import {KitDragToConfirmComponent,KitSmartComparisonComponent,type ComparisonPlan,type ComparisonCategory} from 'kit-ui-angular';
@Component({selector:'kit-drag-to-confirm-demo',standalone:true,imports:[KitDragToConfirmComponent],template:`<kit-drag-to-confirm actionType="archive" label="Slide to archive" confirmedLabel="Archived" [onConfirm]="confirm" [onReset]="reset"/><p class="kit-helper" aria-live="polite">{{message()}}</p>`})
export class DragToConfirmDemoComponent{readonly message=signal('Slide the handle or use its keyboard control.');readonly confirm=()=>this.message.set('Archive confirmed.');readonly reset=()=>this.message.set('Ready for another confirmation.')}
@Component({selector:'kit-smart-comparison-demo',standalone:true,imports:[KitSmartComparisonComponent],template:`<kit-smart-comparison [plans]="plans" [categories]="categories"/><p class="kit-helper" aria-live="polite">{{message()}}</p>`})
export class SmartComparisonDemoComponent{
 readonly message=signal('Choose a plan to continue.');
 readonly plans:ComparisonPlan[]=[{id:'starter',name:'Starter',tagline:'For personal projects',price:'$0',ctaText:'Start free',onCtaClick:()=>this.message.set('Starter selected.')},{id:'team',name:'Team',tagline:'For growing teams',price:'$24',billingPeriod:'month',featured:true,badge:'Popular',onCtaClick:()=>this.message.set('Team selected.')},{id:'scale',name:'Scale',tagline:'For larger organizations',price:'Custom',ctaText:'Contact sales',onCtaClick:()=>this.message.set('Sales contact requested.')}];
 readonly categories:ComparisonCategory[]=[{id:'core',title:'Workspace',features:[{id:'projects',name:'Projects',description:'Number of active projects in your workspace.',values:{starter:'3',team:'Unlimited',scale:'Unlimited'}},{id:'sharing',name:'Team sharing',values:{starter:false,team:true,scale:true}},{id:'export',name:'Export data',values:{starter:true,team:true,scale:true}}]}];
}

import {Component,signal} from '@angular/core';
import {KitDragToConfirmComponent,KitSmartComparisonComponent,type DragConfirmActionType,type DragConfirmSize,type ComparisonPlan,type ComparisonCategory} from 'kit-ui-angular';
@Component({selector:'kit-drag-to-confirm-demo',standalone:true,imports:[KitDragToConfirmComponent],template:`<div class="k-drag-qa-stage"><div class="k-drag-qa-example"><div class="k-drag-qa-toolbar"><div class="k-drag-qa-actions">@for(action of actions;track action){<button type="button" [class.selected]="actionType()===action" (click)="selectAction(action)">{{action}}</button>}</div><div class="k-drag-qa-sizes">@for(value of sizes;track value){<button type="button" [class.selected]="size()===value" (click)="selectSize(value)">{{value}}</button>}</div></div><div class="k-drag-qa-card"><div class="k-drag-qa-slider">@for(instance of [generation()];track instance){<kit-drag-to-confirm [actionType]="actionType()" [size]="size()" [label]="preset().label" [confirmedLabel]="preset().confirmedLabel" [onConfirm]="confirm" [onReset]="reset"/>}</div><div class="k-drag-qa-status"><span [class.confirmed]="statusText()!==null">{{statusText()||'Drag slider or press Enter / Space to trigger'}}</span></div></div><div class="k-drag-qa-footer"><span>{{preset().desc}}</span><button type="button" (click)="restart()">Reset</button></div></div></div>`})
export class DragToConfirmDemoComponent{
 readonly actions=['delete','confirm','unlock','archive','submit'] as const;
 readonly sizes=['sm','md','lg'] as const;
 readonly actionType=signal<DragConfirmActionType>('delete');readonly size=signal<DragConfirmSize>('md');readonly statusText=signal<string|null>(null);readonly generation=signal(0);
 readonly presets={
  delete:{title:'Destructive Action',label:'Slide to delete database →',confirmedLabel:'Database Deleted ✓',desc:'Protects critical databases with explicit drag confirmation'},
  confirm:{title:'Deployment Release',label:'Slide to confirm release →',confirmedLabel:'Production Deployed ✓',desc:'High-stakes multi-region deployments with spring tactile slider'},
  unlock:{title:'Access Security',label:'Slide to unlock vault →',confirmedLabel:'Vault Unlocked ✓',desc:'Safeguards privileged API credentials and hardware tokens'},
  archive:{title:'Archive Project',label:'Slide to archive project →',confirmedLabel:'Project Archived ✓',desc:'Bulk state transitions with elastic snapback resistance'},
  submit:{title:'Transfer Funds',label:'Slide to transfer funds →',confirmedLabel:'Transfer Completed ✓',desc:'Financial payments and irrevocable wire settlements'},
  continue:{title:'Proceed Step',label:'Slide to continue →',confirmedLabel:'Step Completed ✓',desc:'Multi-step provisioning wizards and deployment checks'},
 };
 readonly preset=()=>this.presets[this.actionType()];
 readonly confirm=()=>this.statusText.set('Confirmed: '+this.preset().title);readonly reset=()=>this.statusText.set(null);
 selectAction(action:DragConfirmActionType){this.actionType.set(action);this.restart()}
 selectSize(value:DragConfirmSize){this.size.set(value);this.generation.update(value=>value+1)}
 restart(){this.reset();this.generation.update(value=>value+1)}
}
@Component({selector:'kit-smart-comparison-demo',standalone:true,imports:[KitSmartComparisonComponent],template:`<kit-smart-comparison [plans]="plans" [categories]="categories"/><p class="kit-helper" aria-live="polite">{{message()}}</p>`})
export class SmartComparisonDemoComponent{
 readonly message=signal('Choose a plan to continue.');
 readonly plans:ComparisonPlan[]=[{id:'starter',name:'Starter',tagline:'For personal projects',price:'$0',ctaText:'Start free',onCtaClick:()=>this.message.set('Starter selected.')},{id:'team',name:'Team',tagline:'For growing teams',price:'$24',billingPeriod:'month',featured:true,badge:'Popular',onCtaClick:()=>this.message.set('Team selected.')},{id:'scale',name:'Scale',tagline:'For larger organizations',price:'Custom',ctaText:'Contact sales',onCtaClick:()=>this.message.set('Sales contact requested.')}];
 readonly categories:ComparisonCategory[]=[{id:'core',title:'Workspace',features:[{id:'projects',name:'Projects',description:'Number of active projects in your workspace.',values:{starter:'3',team:'Unlimited',scale:'Unlimited'}},{id:'sharing',name:'Team sharing',values:{starter:false,team:true,scale:true}},{id:'export',name:'Export data',values:{starter:true,team:true,scale:true}}]}];
}

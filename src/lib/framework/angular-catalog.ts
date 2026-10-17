import { ANGULAR_PORTS } from './angular-ports';
export interface AngularEntry {
  id: string;
  name: string;
  exportName: string;
  selector: string;
  description: string;
  inputs: string[];
  outputs?: string[];
  binding?: string;
  handler?: string;
}
export const ANGULAR_COMPONENTS: AngularEntry[] = [
  {
    id: "elastic-sheet",
    name: "Elastic Sheet",
    exportName: "KitElasticSheetComponent",
    selector: "kit-elastic-sheet",
    description:
      "A draggable native modal sheet with keyboard resizing and snap positions.",
    inputs: ["title: string", "snapPositions: number[]", "disabled: boolean", "children: ElasticSheetContent", "onSnapChange: (position: number) => void"],
    outputs: ["snapChange: number"],
    binding: '[snapPositions]="[35, 65, 90]"',
  },
  {
    id: "smart-upload",
    name: "Smart Upload",
    exportName: "KitSmartUploadComponent",
    selector: "kit-smart-upload",
    description:
      "Validated file queues, previews, progress, cancellation, and fresh retries.",
    inputs: [
      "upload: UploadHandler",
      "accept: string",
      "maxSize: number",
      "maxFiles: number",
      "disabled: boolean",
    ],
    binding: '[upload]="upload"',
    handler: `  readonly upload: UploadHandler = async (file, { signal, onProgress }) => {\n    const response = await fetch('/api/files', { method: 'POST', body: file, signal });\n    if (!response.ok) throw new Error('Upload failed');\n    onProgress(100);\n  };`,
  },
  {
    id: "liquid-command-palette",
    name: "Liquid Command Palette",
    exportName: "KitLiquidCommandPaletteComponent",
    selector: "kit-liquid-command-palette",
    description:
      "Search commands with keyboard navigation, disabled entries, and async recovery.",
    inputs: ["commands: LiquidCommand[]", "disabled: boolean"],
    binding: '[commands]="commands"',
    handler: `  readonly commands: LiquidCommand[] = [\n    { id: 'home', label: 'Go home', onSelect: () => { window.location.assign('/'); } },\n  ];`,
  },
  {
    id: "hold-to-confirm",
    name: "Hold-to-Confirm",
    exportName: "KitHoldToConfirmComponent",
    selector: "kit-hold-to-confirm",
    description:
      "Deliberate pointer and keyboard confirmation with visible progress and retry.",
    inputs: [
      "label: string",
      "duration: number",
      "onConfirm: () => void | Promise<void>",
      "confirm: () => void | Promise<void> (deprecated alias)",
      "disabled: boolean",
    ],
    outputs: ["confirmed: void"],
    binding: '[duration]="1200"',
  },
  {
    id: "swipe-action-list",
    name: "Swipe Action List",
    exportName: "KitSwipeActionListComponent",
    selector: "kit-swipe-action-list",
    description:
      "Swipe to reveal actions, with keyboard buttons, loading, and failure recovery.",
    inputs: [
      "items: SwipeItem[]",
      "onAction: (item: SwipeItem) => void | Promise<void>",
      "action: (item: SwipeItem) => void | Promise<void> (deprecated alias)",
      "actionLabel: string",
      "loading: boolean",
      "disabled: boolean",
    ],
  },
  {
    id: "interactive-data-card",
    name: "Interactive Data Card",
    exportName: "KitInteractiveDataCardComponent",
    selector: "kit-interactive-data-card",
    description:
      "Expandable summaries and projected details with asynchronous actions.",
    inputs: [
      "title: string",
      "summary: InteractiveDataCardContent",
      "children: InteractiveDataCardContent",
      "onAction: InteractiveDataCardAction",
      "action: InteractiveDataCardAction (deprecated alias)",
      "actionLabel: string",
      "loading: boolean",
      "error: string",
      "disabled: boolean",
    ],
  },
  {
    id: "timeline-scrubber",
    name: "Timeline Scrubber",
    exportName: "KitTimelineScrubberComponent",
    selector: "kit-timeline-scrubber",
    description:
      "Explore events with native range navigation and readable event announcements.",
    inputs: [
      "events: TimelineEvent[]",
      "onChange: (event: TimelineEvent, index: number) => void",
      "loading: boolean",
      "disabled: boolean",
    ],
    outputs: ["eventChange: { event: TimelineEvent; index: number } (deprecated alias)"],
  },
  {
    id: "ai-prompt-composer",
    name: "AI Prompt Composer",
    exportName: "KitAIPromptComposerComponent",
    selector: "kit-ai-prompt-composer",
    description:
      "Draft prompts with suggestions and attachments; preserve work on cancellation or failure.",
    inputs: [
      "onSend: SendHandler",
      "sendHandler: SendHandler (deprecated alias)",
      "suggestions: string[]",
      "maxAttachments: number",
      "maxAttachmentSize: number",
      "disabled: boolean",
    ],
    binding: '[onSend]="send"',
    handler: `  readonly send: SendHandler = async ({ text, attachments }, signal) => {\n    const form = new FormData();\n    form.append('text', text);\n    attachments.forEach(file => form.append('attachments', file));\n    const response = await fetch('/api/prompts', { method: 'POST', body: form, signal });\n    if (!response.ok) throw new Error('Send failed');\n  };`,
  },
  ...ANGULAR_PORTS.map(entry => entry.id === "activity-feed" ? {
    ...entry,
    binding: '[events]="events"',
    handler: `  readonly events: ActivityEvent[] = [{
    id: 'evt-1', type: 'deploy', status: 'success',
    title: 'Production release verified', timestamp: '2 mins ago',
    traceId: 'trc_98fa20', actor: { name: 'CI Pipeline' },
    payload: { version: '2.4.0' },
  }];`,
  } : entry),
];
export function angularUsage(entry: AngularEntry) {
  if(entry.id==='expandable-data-row')return `import {Component} from '@angular/core';
import {KitExpandableDataRowComponent,type DataRowItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitExpandableDataRowComponent],template:\`<kit-expandable-data-row [items]="items" [allowMultiple]="true" [onRowAction]="action"/>\`})
export class Example{items:DataRowItem[]=[{id:'account',user:{name:'Alex Chen',email:'alex@example.com'},status:'active',revenue:'$850',date:'Oct 14, 2026'}];action=(action:string,row:DataRowItem):void=>{/* Connect account actions here. */};}`;
  if(entry.id==='interactive-timeline')return `import {Component} from '@angular/core';
import {KitInteractiveTimelineComponent,type TimelineItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitInteractiveTimelineComponent],template:\`<kit-interactive-timeline [items]="items" [onItemSelect]="select"/>\`})
export class Example{items:TimelineItem[]=[{id:'build',title:'Build verified',timestamp:'Now',status:'completed'},{id:'deploy',title:'Deploy',timestamp:'Next',status:'pending'}];select=(item:TimelineItem):void=>{/* Observe selection here. */};}`;

  if(entry.id==='mac-os-folder-cards')return `import {Component,TemplateRef} from '@angular/core';
import {KitMacOsFolderCardsComponent,type MacOSFolderCardItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitMacOsFolderCardsComponent],template:\`<ng-template #icon><span aria-hidden="true">★</span></ng-template><kit-mac-os-folder-cards folderTitle="Projects" [items]="items(icon)" [defaultOpen]="false"/>\`})
export class Example{items(icon:TemplateRef<unknown>):MacOSFolderCardItem[]{return [{id:'project',title:'Design system',description:'Shared components and tokens.',meta:'01',icon}]}}`;
  if(entry.id==='story-card')return `import {Component} from '@angular/core';
import {KitStoryCardComponent,type StoryCard} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitStoryCardComponent],template:\`<kit-story-card title="Latest stories" [cards]="cards" [autoPlay]="true" [autoPlayInterval]="5000"/>\`})
export class Example{cards:StoryCard[]=[{id:'launch',title:'A new chapter',description:'See what we are building.',image:'/images/launch.jpg',href:'/stories/launch',ctaLabel:'Read story'},{id:'team',title:'Meet the team',image:'/images/team.jpg',imageAlt:'Our team'}]}`;
  if(entry.id==='pricing')return `import {Component} from '@angular/core';
import {KitPricingComponent,type PricingTier} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitPricingComponent],template:\`<kit-pricing heading="Choose your plan" [proTier]="pro"/>\`})
export class Example{pro:PricingTier={name:'Team',price:'$49',cadence:'Per month',features:['All components',{label:'Team support',description:'Contact your team for details'}],ctaLabel:'Choose Team',onCtaClick:()=>this.chooseTeam()};chooseTeam():void{/* Connect your checkout here. */}}`;
  if(entry.id==='stacked-cards')return `import {Component} from '@angular/core';
import {KitStackedCardsComponent,type StackedCard} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitStackedCardsComponent],template:\`<kit-stacked-cards title="Latest stories" [cards]="cards"/>\`})
export class Example{cards:StackedCard[]=[{id:'story',title:'Our next chapter',description:'Read what we are building.',image:'/images/story.jpg',imageAlt:'Our team',href:'/stories/next',ctaLabel:'Read story'}]}`;
  if(entry.id==='dependency-trace')return `import {Component} from '@angular/core';
import {KitDependencyTraceComponent,type TraceNode,type TraceConnection} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitDependencyTraceComponent],template:\`<kit-dependency-trace [nodes]="nodes" [connections]="connections" [onNodeSelect]="select"/>\`})
export class ExampleComponent{readonly nodes:TraceNode[]=[{id:'client',label:'Client'},{id:'api',label:'API'},{id:'db',label:'Database'}];readonly connections:TraceConnection[]=[{from:'client',to:'api'},{from:'api',to:'db'}];readonly select=(id:string)=>console.log(id);}`;
  if(entry.id==='recovery-ledger')return `import {Component,signal} from '@angular/core';
import {KitRecoveryLedgerComponent,type LedgerEntry} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitRecoveryLedgerComponent],template:\`<kit-recovery-ledger [entries]="entries" [currentEntryId]="current()" [onRestore]="restore"/>\`})
export class ExampleComponent{readonly current=signal('v2');readonly entries:LedgerEntry[]=[{id:'v2',timestamp:'Now',action:'Current version',description:'Latest snapshot'},{id:'v1',timestamp:'Yesterday',action:'Previous version',description:'Earlier snapshot',details:{diff:'- old\\n+ restored'}}];readonly restore=async(id:string)=>{this.current.set(id)};}`;

  if(entry.id==='velocity-toast')return `import {Component,signal} from '@angular/core';
import {KitVelocityToastComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitVelocityToastComponent],template:\`<button type="button" (click)="open.set(true)">Show toast</button><kit-velocity-toast [open]="open()" title="File uploaded" description="Ready to use." variant="success" position="bottom-right" [onDismiss]="dismiss"/>\`})
export class ExampleComponent{readonly open=signal(false);readonly dismiss=()=>this.open.set(false);}`;
  if(entry.id==='morphing-dialog')return `import {Component} from '@angular/core';
import {KitMorphingDialogComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitMorphingDialogComponent],template:\`<ng-template #trigger let-open><button type="button" (click)="open()">Configure keys</button></ng-template><ng-template #body><p>Manage access permissions.</p></ng-template><kit-morphing-dialog title="API Key Configuration" subtitle="Access settings" [trigger]="trigger" [content]="body"/>\`})
export class ExampleComponent{}`;

  if(entry.id==='spring-select')return `import {Component,signal} from '@angular/core';
import {KitSpringSelectComponent,type SpringSelectOption} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitSpringSelectComponent],template:\`<kit-spring-select [options]="options" label="Workspace" [value]="selected()" [onChange]="change"/>\`})
export class ExampleComponent {readonly options:SpringSelectOption[]=[{value:'design',label:'Design'},{value:'engineering',label:'Engineering'}];readonly selected=signal('design');readonly change=(value:string)=>this.selected.set(value);}`;
  if(entry.id==='gooey-menu')return `import {Component} from '@angular/core';
import {KitGooeyMenuComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitGooeyMenuComponent],template:\`<kit-gooey-menu [options]="options" [onSelect]="select"/>\`})
export class ExampleComponent {readonly options=['Home','About','Projects','Contact'];readonly select=(option:string,index:number)=>console.log(option,index);}`;

  if (entry.id === 'wallet-card') return `import {Component} from '@angular/core';
import {KitWalletCardComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitWalletCardComponent],template:\`<kit-wallet-card balance="$4,566.00" cardType="Mastercard" cardLastFour="3040" [onUseWallet]="useWallet"/>\`})
export class ExampleComponent { readonly useWallet=()=>console.log('Wallet requested'); }`;
  if (entry.id === 'sticky-pages') return `import {Component} from '@angular/core';
import {KitStickyPagesComponent,type StickyPageItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitStickyPagesComponent],template:\`<kit-sticky-pages [pages]="pages" pageHeight="60vh" [stackOffset]="24"/>\`})
export class ExampleComponent { readonly pages:StickyPageItem[]=[{id:'one',title:'First page',subtitle:'Introduction'},{id:'two',title:'Second page',description:'Keep scrolling.'}]; }`;
  if (entry.id === 'glass-navbar') return `import {Component} from '@angular/core';
import {KitGlassNavbarComponent,type GlassNavbarItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitGlassNavbarComponent],template:\`<ng-template #cta><button type="button">Deploy Now</button></ng-template><kit-glass-navbar [items]="items" [cta]="cta" [sticky]="false" [onItemSelect]="select"/>\`})
export class ExampleComponent {
  readonly items:GlassNavbarItem[]=[{id:'platform',label:'Platform',href:'#platform'},{id:'docs',label:'Docs',href:'https://example.com/docs',external:true}];
  readonly select=(item:GlassNavbarItem)=>console.log(item.label);
}`;
  if (entry.id === 'scroll-progress-nav') return `import {Component} from '@angular/core';
import {KitScrollProgressNavComponent,type NavSectionItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitScrollProgressNavComponent],template:\`<kit-scroll-progress-nav mode="inline" [sections]="sections" [containerRef]="{current:scroller}"/><div #scroller style="height:300px;overflow:auto"><section id="overview" style="min-height:400px">Overview</section><section id="features" style="min-height:400px">Features</section></div>\`})
export class ExampleComponent {readonly sections:NavSectionItem[]=[{id:'overview',index:'01',label:'Overview'},{id:'features',index:'02',label:'Features'}]}`;
  if (entry.id === 'small-floating-dock') return `import {Component} from '@angular/core';
import {KitSmallFloatingDockComponent,type SmallFloatingDockItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitSmallFloatingDockComponent],template:\`<kit-small-floating-dock [items]="items" position="bottom-center"/>\`})
export class ExampleComponent {readonly items:SmallFloatingDockItem[]=[{id:'home',label:'Home',icon:'H',action:()=>console.log('Home')}]}`;
  if (entry.id === 'branching-submenu') return `import {Component} from '@angular/core';
import {KitBranchingSubmenuComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitBranchingSubmenuComponent],template:\`<kit-branching-submenu label="Project navigation"/>\`})
export class ExampleComponent {}`;

  if (entry.id === 'animated-tabs') return `import {Component,signal} from '@angular/core';
import {KitAnimatedTabsComponent,type AnimatedTabItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitAnimatedTabsComponent],template:\`<kit-animated-tabs [tabs]="tabs" [activeTab]="active()" [onChange]="change"/>\`})
export class ExampleComponent {
  readonly active=signal('overview');
  readonly change=(id:string)=>this.active.set(id);
  readonly tabs:AnimatedTabItem[]=[{id:'overview',label:'Overview',content:'Metrics overview'},{id:'settings',label:'Settings',content:'Preferences',badge:2}];
}`;
  if (entry.id === 'scrollvelocitytext') return `import {Component} from '@angular/core';
import {KitScrollvelocitytextComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitScrollvelocitytextComponent],template:\`<div #scroller style="height:240px;overflow:auto"><div style="min-height:800px"><h2 kitScrollVelocityText text="Build the future" [scrollContainerRef]="{current:scroller}" [expandDistance]="500" [maxScale]="1.6" [style]="{fontSize:32}"></h2></div></div>\`})
export class ExampleComponent {}`;

  if (entry.id === 'interactive-data-card') return `import {Component} from '@angular/core';
import {KitInteractiveDataCardComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitInteractiveDataCardComponent],template:\`<kit-interactive-data-card [onAction]="refresh"><p>Eight features shipped.</p></kit-interactive-data-card>\`})
export class ExampleComponent { readonly refresh = async () => { await Promise.resolve(); }; }`;
  if (entry.id === 'timeline-scrubber') return `import {Component} from '@angular/core';
import {KitTimelineScrubberComponent,type TimelineEvent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitTimelineScrubberComponent],template:\`<kit-timeline-scrubber [events]="events" [onChange]="change"/>\`})
export class ExampleComponent {
 readonly events:TimelineEvent[]=[{id:'draft',title:'Draft',time:'09:00'}];
 readonly change = (event:TimelineEvent,index:number) => { console.log(event,index); };
}`;
  if (entry.id === 'animated-number') return `import {Component} from '@angular/core';
import {KitAnimatedNumberComponent} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitAnimatedNumberComponent],template:\`<kit-animated-number [value]="revenue" prefix="$" [decimals]="2"/>\`})
export class ExampleComponent { revenue = 12450; }`;
  if (entry.id === 'unfold-accordion') return `import {Component} from '@angular/core';
import {KitUnfoldAccordionComponent,type UnfoldAccordionItem} from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitUnfoldAccordionComponent],template:\`<kit-unfold-accordion [items]="items" [defaultOpen]="['details']"/>\`})
export class ExampleComponent { readonly items:UnfoldAccordionItem[]=[{id:'details',title:'Details',content:'Native Angular content.'}]; }`;
  if (entry.id === 'ios-search-bar') return `import { Component, signal } from '@angular/core';
import { KitIosSearchBarComponent } from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitIosSearchBarComponent],template:\`<kit-ios-search-bar [value]="query()" [onChange]="change" [onSubmit]="submit" placeholder="Search telemetry..."/>\`})
export class ExampleComponent {
  readonly query = signal('');
  readonly change = (value: string) => this.query.set(value);
  readonly submit = (value: string) => { console.log(value); };
}`;
  if (entry.id === 'reveal-card') return `import { Component } from '@angular/core';
import { KitRevealCardComponent } from 'kit-ui-angular';
@Component({
 selector: 'app-example',
 imports: [KitRevealCardComponent],
 template: \`<ng-template #details><p>More information</p><button>Explore</button></ng-template>
 <kit-reveal-card [revealContent]="details" [maxTilt]="12" className="max-w-sm">
   <h2>Interactive 3D Tilt</h2><p>Hover to reveal the details.</p>
 </kit-reveal-card>\`,
})
export class ExampleComponent {}`;
  if (entry.id === 'advanced-data-table') return `import { Component } from '@angular/core';
import { KitAdvancedDataTableComponent, type ColumnDef } from 'kit-ui-angular';
interface Row { id: string; name: string; }
@Component({selector:'app-example',imports:[KitAdvancedDataTableComponent],template:\`<kit-advanced-data-table title="Directory" [data]="rows" [columns]="columns" [onBulkExport]="exportRows"/>\`})
export class ExampleComponent {
  readonly rows: Row[] = [{id:'1',name:'Kit UI'}];
  readonly columns: ColumnDef<Row>[] = [{id:'name',header:'Name',accessorKey:'name',sortable:true}];
  readonly exportRows = (ids: string[]) => { console.log(ids); };
}`;
  if (entry.id === 'ai-agent-activity') return `import { Component } from '@angular/core';
import { KitAiAgentActivityComponent, type AgentActivityItemData } from 'kit-ui-angular';
@Component({selector:'app-example',imports:[KitAiAgentActivityComponent],template:\`<kit-ai-agent-activity title="Agent trace" [activities]="activities" [isRunning]="false" [defaultExpandedIds]="['analyze']"/>\`})
export class ExampleComponent {
 readonly activities:AgentActivityItemData[]=[{id:'analyze',type:'thinking',title:'Analyze request',status:'success',details:{input:{query:'Build a timeline'},output:'Ready'}}];
}`;
  const type =
    entry.id === "activity-feed"
      ? "ActivityEvent"
      : entry.id === "smart-upload"
      ? "UploadHandler"
      : entry.id === "ai-prompt-composer"
        ? "SendHandler"
        : entry.id === "liquid-command-palette"
          ? "LiquidCommand"
          : undefined;
  return `import { Component } from '@angular/core';\nimport { ${entry.exportName}${type ? `, type ${type}` : ""} } from 'kit-ui-angular';\n\n@Component({\n  selector: 'app-example',\n  imports: [${entry.exportName}],\n  template: \`<${entry.selector}${entry.binding ? " " + entry.binding : ""} />\`,\n})\nexport class ExampleComponent {\n${entry.handler ?? ""}\n}`;
}

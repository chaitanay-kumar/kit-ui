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

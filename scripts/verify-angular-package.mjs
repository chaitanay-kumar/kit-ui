import {tsImport} from 'tsx/esm/api';
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const tarball = path.join(root, "public/downloads/kit-ui-angular-0.1.0.tgz");
const ports = JSON.parse(
  fs.readFileSync(path.join(root, "packages/angular/catalog.json"), "utf8"),
);
const portImports = ports.map((port) => port.exportName).join(", ");
// Keep every selector in the strict consumer, supplying newly required contracts.
const requiredPortTemplates = {
  'smart-comparison':'<kit-smart-comparison [plans]="[]" [categories]="[]"/>',
  'command-menu':'<kit-command-menu [isOpen]="false" [onClose]="noopClose"/>',
  'torque-dial':'<kit-torque-dial [value]="50" [onChange]="noopClose"/>',
  'batch-gesture-tray':'<kit-batch-gesture-tray [items]="[]" [actions]="[]"/>',
  'depth-corridor':'<kit-depth-corridor [layers]="[]"/>',
  'dependency-trace':'<kit-dependency-trace [nodes]="[]" [connections]="[]"/>',
  'recovery-ledger':'<kit-recovery-ledger [entries]="[]"/>',

  'velocity-toast':'<kit-velocity-toast [open]="false" title="Notification"/>',
  'morphing-dialog':'<ng-template #morphTrigger let-open><button type="button" (click)="open()">Open</button></ng-template><ng-template #morphContent>Native content</ng-template><kit-morphing-dialog title="Dialog" [trigger]="morphTrigger" [content]="morphContent"/>',

  'spring-select':'<kit-spring-select [options]="[]"/>',
  'small-floating-dock': '<kit-small-floating-dock [items]="[]"/>',
  'animated-tabs': '<kit-animated-tabs [tabs]="[]"/>',
  'scrollvelocitytext': '<kit-scrollvelocitytext text="Readable text"/>',
  'stack-unfold-panel': '<kit-stack-unfold-panel [cards]="[]"/>',
  'settle-modal': '<kit-settle-modal [open]="false" [onClose]="noopClose"/>',
  'selection-basket': '<kit-selection-basket [selectedCount]="2"/>',
  'density-lens': '<kit-density-lens children="Content"/>',
  'floating-action-dock': '<kit-floating-action-dock [items]="[]"/>',
  'text-scramble-decoder': '<kit-text-scramble-decoder text="KIT_UI.REGISTRY.SYNCED" trigger="manual"/>',
  'avatar-stack': '<kit-avatar-stack [avatars]="[]"/>',
  'directional-tooltip': '<kit-directional-tooltip content="Hint"><button>Details</button></kit-directional-tooltip>',
  'glitch-text': '<kit-glitch-text text="Hello"/>',
  'metric-hud': '<kit-metric-hud [metrics]="[]"/>',
  'notification-bell': '<kit-notification-bell [notifications]="[]" [onMarkAsRead]="noopSearch"/>',
  'slide-pagination': '<kit-slide-pagination [pageCount]="3"/>',
  'split-button': '<kit-split-button label="Save" [options]="[]"/>',
};
const portTemplates = ports.map((port) => requiredPortTemplates[port.id] ?? (port.id === "animated-number" ? `<kit-animated-number [value]="12450"/>` : port.id === "unfold-accordion" ? `<kit-unfold-accordion [items]="[]"/>` : port.id === "ios-search-bar" ? `<kit-ios-search-bar value="" [onChange]="noopSearch"/>` : port.id === "smooth-accordion" ? `<kit-smooth-accordion [items]="[]"/>` : port.id === "morphing-icon" ? `<ng-template #genericIcon>Icon</ng-template><kit-morphing-icon [from]="genericIcon" [to]="genericIcon"/>` : port.id === "hamburger-menu" ? `<kit-hamburger-menu [isOpen]="false"/>` : port.id === "typewriter-button" ? `<kit-typewriter-button text="Type this"/>` : `<${port.selector} />`)).join("\n");
// Each consumer installs and runs its own compiler. Reusing the repository's
// compiler would miss incompatibilities with older Angular versions.
const {angularUsage,ANGULAR_COMPONENTS}=await tsImport('../src/lib/framework/angular-catalog.ts',import.meta.url);
const parityUsageSources=['animated-tabs','scrollvelocitytext','small-floating-dock','branching-submenu','glass-navbar','scroll-progress-nav','wallet-card','sticky-pages','spring-select','gooey-menu','morphing-dialog','velocity-toast','dependency-trace','recovery-ledger','pricing','stacked-cards','mac-os-folder-cards','story-card','expandable-data-row','interactive-timeline','speed-warp','depth-corridor','code-snippet-deck','batch-gesture-tray','torque-dial','rocket-party-popper','evil-eye','nimbu-mirchi','command-menu','spotlight-search','drag-to-confirm','smart-comparison','thinking-orb','sparkles-core','glyph-matrix','shooting-stars'].map(id=>angularUsage(ANGULAR_COMPONENTS.find(entry=>entry.id===id)));
const matrix = [
  { angularVersion: "20.0.0", typescript: "5.8.3" },
  { angularVersion: "20.3.33", typescript: "5.9.3" },
  { angularVersion: "21.2.25", typescript: "5.9.3" },
  { angularVersion: "22.2.1", typescript: "6.0.2" },
];
for (const { angularVersion, typescript } of matrix) {
  const target = fs.mkdtempSync(
    path.join(os.tmpdir(), "kit-angular-consumer-"),
  );
  fs.writeFileSync(
    path.join(target, "package.json"),
    JSON.stringify(
      {
        name: "kit-angular-consumer-check",
        private: true,
        type: "module",
        dependencies: {
          "kit-ui-angular": `file:${tarball.replaceAll("\\", "/")}`,
          "@angular/core": angularVersion,
          "@angular/common": angularVersion,
          "@angular/compiler": angularVersion,
          "@angular/compiler-cli": angularVersion,
          typescript,
          rxjs: "7.8.2",
        },
      },
      null,
      2,
    ),
  );
  const install = spawnSync(
    process.execPath,
    [
      process.env.npm_execpath,
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
    ],
    { cwd: target, stdio: "inherit" },
  );
  if (install.status !== 0) process.exit(install.status ?? 1);
  const loaderOptionalConsumer = `import {Component} from '@angular/core';
import {KitLoaderComponent, type LoaderVariant} from 'kit-ui-angular';
@Component({selector:'loader-optional-consumer',imports:[KitLoaderComponent],template:'<kit-loader [size]="size" [variant]="variant" [label]="label" [reduceMotion]="motion" [color]="color" [className]="classes" [aria-label]="ariaLabel"/>'})
export class LoaderOptionalConsumer {size:number|undefined;variant:LoaderVariant|undefined;label:string|undefined;motion:boolean|undefined;color:string|undefined;classes:string|undefined;ariaLabel:string|undefined;}`;
  const magneticConsumer = `import {Component} from '@angular/core';
import {KitMagneticButtonComponent,type MagneticButtonVariant,type MagneticButtonSize} from 'kit-ui-angular';
@Component({selector:'magnetic-consumer',imports:[KitMagneticButtonComponent],template:'<button kitMagneticButton [strength]="strength" [variant]="variant" [size]="size" [glow]="glow" [type]="type" [className]="classes" [disabled]="false" name="intent" value="save" (click)="clicked=true">Save <em>now</em></button><kit-magnetic-button variant="ghost" size="sm">Projected</kit-magnetic-button>'})
export class MagneticConsumer{strength:number|undefined;variant:MagneticButtonVariant|undefined;size:MagneticButtonSize|undefined;glow:boolean|undefined;type:'button'|'submit'|'reset'|undefined;classes:string|undefined;clicked=false;}`;
  const morphingConsumer=`import {Component} from "@angular/core";import {KitMorphingButtonComponent,type ButtonStatusState,type MorphingButtonVariant} from "kit-ui-angular";@Component({selector:"morphing-consumer",imports:[KitMorphingButtonComponent],template:\`<ng-template #icon><b>Icon</b></ng-template><button kitMorphingButton [status]="status" [variant]="variant" [idleIcon]="icon" [successIcon]="null" [disabled]="false" type="submit" (click)="clicked=true"></button><kit-morphing-button [status]="status" idleText="Go"/>\`})export class MorphingConsumer{status:ButtonStatusState|undefined=undefined;variant:MorphingButtonVariant|undefined=undefined;clicked=false;}`;
  const rainbowConsumer=`import {Component} from '@angular/core';
import {KitRainbowButtonComponent,type RainbowButtonVariant,type RainbowButtonSize,type RainbowButtonStyle} from 'kit-ui-angular';
@Component({selector:'rainbow-consumer',standalone:true,imports:[KitRainbowButtonComponent],template:'<button kitRainbowButton [variant]="variant" [size]="size" [speed]="speed" [glow]="glow" [color1]="color" [color2]="color" [color3]="color" [color4]="color" [color5]="color" [style]="styles" [className]="classes" [disabled]="false" type="reset">Content</button><a kitRainbowButton href="/target" variant="outline">Link</a><button kitRainbowButton type="button">Child</button><kit-rainbow-button>Projected content</kit-rainbow-button>'})
export class RainbowConsumer{variant:RainbowButtonVariant|undefined;size:RainbowButtonSize|undefined;speed:number|undefined;glow:boolean|undefined;color:string|undefined;styles:RainbowButtonStyle|undefined;classes:string|undefined;}`;
  const revealConsumer=`import {Component} from '@angular/core';import {KitRevealCardComponent,type RevealCardContent} from 'kit-ui-angular';@Component({selector:'reveal-consumer',imports:[KitRevealCardComponent],template:\`<ng-template #details><button>Details</button></ng-template><kit-reveal-card [revealContent]="details" [maxTilt]="tilt" [className]="classes"><h2>Projected</h2><button>Action</button></kit-reveal-card><kit-reveal-card [revealContent]="content"/>\`})export class RevealConsumer{content:RevealCardContent=0;tilt:number|undefined;classes:string|undefined;}`;
  const hamburgerConsumer=`import {Component} from "@angular/core";import {KitHamburgerMenuComponent} from "kit-ui-angular";@Component({selector:"hamburger-consumer",imports:[KitHamburgerMenuComponent],template:\`<button kitHamburgerMenu [isOpen]="open" (change)="open=$event" [size]="size" [color]="color" [label]="label" [onClick]="click" [aria-label]="label" type="submit" name="intent" value="menu"></button><kit-hamburger-menu [isOpen]="open" (change)="open=$event"/>\`})export class HamburgerConsumer{open=false;size:number|undefined;color:string|undefined;label:string|undefined;click:((event:MouseEvent)=>void)|undefined;}`;
  const accordionConsumer=`import {Component} from "@angular/core";import {KitSmoothAccordionComponent,type AccordionItem} from "kit-ui-angular";@Component({selector:"accordion-consumer",imports:[KitSmoothAccordionComponent],template:\`<ng-template #rich><button type="button">Action</button></ng-template><kit-smooth-accordion [items]="[{id: 'one',title: 'Title',content:rich}]" [defaultOpen]="initial" [allowMultiple]="multiple" className="consumer"/><kit-smooth-accordion [items]="items"/>\`})export class AccordionConsumer{items:AccordionItem[]=[{id:"one",title:"Title",subtitle:"Subtitle",content:"Content"}];initial:string[]|undefined;multiple:boolean|undefined;}`;
  const consumerSources = [revealConsumer,accordionConsumer,hamburgerConsumer,loaderOptionalConsumer,magneticConsumer,morphingConsumer,rainbowConsumer,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler, type ActivityEvent } from 'kit-ui-angular';
@Component({selector:'consumer-app-0',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
  <kit-activity-feed [events]="events" [enableLiveSimulation]="false" [enableFilters]="true" [enableSearch]="true" [maxEntries]="10" [onEventReplay]="replay" className="consumer-feed" (eventReplay)="lastEvent = $event" />
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp0 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; readonly events:ActivityEvent[]=[{id:'one',type:'deploy',status:'success',title:'Release',timestamp:'Now',payload:{version:1}}];lastEvent:ActivityEvent|undefined;readonly replay=(event:ActivityEvent)=>{this.lastEvent=event;};height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler, type ColumnDef, KitDataTableComponent, KitDataTableToolbarComponent, KitDataTableContentComponent, KitDataTablePaginationComponent } from 'kit-ui-angular';
interface Row {id:string;name:string;}
@Component({selector:'consumer-app-1',imports:[KitDataTableComponent,KitDataTableToolbarComponent,KitDataTableContentComponent,KitDataTablePaginationComponent,${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
  <ng-template #cell let-row let-value="value">{{row.name}} {{value}}</ng-template>
  <ng-template #details let-row>Details {{row.name}}</ng-template>
  <kit-advanced-data-table [data]="rows" [columns]="columns" [getRowId]="rowId" [defaultPageSize]="2" defaultViewMode="cards" accentColor="#333" [renderSubComponent]="details" [isLoading]="false" [error]="null" [onBulkDelete]="bulk" [onBulkExport]="bulk" (bulkDelete)="ids=$event" (bulkExport)="ids=$event" className="consumer"/>
  <kit-data-table [data]="rows" [columns]="[{id:'name',header:'Name',accessorKey:'name',cell:cell}]"><kit-data-table-toolbar title="Consumer"/><kit-data-table-content emptyTitle="Empty"/><kit-data-table-pagination [pageSizeOptions]="[2,4]"/></kit-data-table>
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp1 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{};readonly rows:Row[]=[{id:'1',name:'Kit UI'}];readonly columns:ColumnDef<Row>[]=[{id:'name',header:'Name',accessorKey:'name',sortable:true}];readonly rowId=(row:Row)=>row.id;readonly bulk=(ids:string[])=>{this.ids=ids;};ids:string[]=[]; height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler, type AgentActivityItemData, KitAgentActivityHeaderComponent, KitAgentActivityTimelineComponent, KitAgentActivityItemComponent } from 'kit-ui-angular';
@Component({selector:'consumer-app-2',imports:[KitAgentActivityHeaderComponent,KitAgentActivityTimelineComponent,KitAgentActivityItemComponent,${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
  <kit-ai-agent-activity [activities]="activities" [isRunning]="false" title="Trace" agentName="Consumer" accentColor="#333" [defaultExpandedIds]="['trace']" className="consumer"/>
  <kit-ai-agent-activity [activities]="activities"><kit-agent-activity-header title="Custom trace" [showControls]="false"/><kit-agent-activity-timeline className="custom-timeline"/></kit-ai-agent-activity>
  <kit-ai-agent-activity [activities]="activities"><kit-agent-activity-item [activity]="activities[0]" [isLast]="true"/></kit-ai-agent-activity>
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp2 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{};readonly activities:AgentActivityItemData[]=[{id:'trace',type:'thinking',title:'Analyze',status:'success',details:{input:{query:'hello'},output:'Ready',codeSnippet:'const ready = true;',language:'typescript'},metadata:{score:2}}]; height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler } from 'kit-ui-angular';
@Component({selector:'consumer-app-3',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [onSend]="send" />
\`})
export class ConsumerApp3 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler } from 'kit-ui-angular';
@Component({selector:'consumer-app-4',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-loader [size]="48" variant="rings" color="#ff8800" label="Working" [reduceMotion]="true" className="consumer-loader" aria-label="Override" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp4 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler, type ButtonVariant, type ButtonSize } from 'kit-ui-angular';
@Component({selector:'consumer-app-5',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
<button kitButton variant="success" size="sm" [isLoading]="false" loadingText="Saving" [fullWidth]="true" [disabled]="false" type="submit">Save</button>
<button kitButton [variant]="optionalVariant" [size]="optionalSize" [type]="optionalType" [className]="optionalClass">Defaults</button>
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp5 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; readonly optionalVariant:ButtonVariant|undefined=undefined;readonly optionalSize:ButtonSize|undefined=undefined;readonly optionalType:'button'|'submit'|'reset'|undefined=undefined;readonly optionalClass:string|undefined=undefined;height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler } from 'kit-ui-angular';
@Component({selector:'consumer-app-6',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
<button kitNeonEdgeButton [speed]="2" [glow]="false" [disabled]="false" type="submit" className="customer-neon">Ship</button>
<button kitNeonEdgeButton [speed]="optionalSpeed" [glow]="optionalGlow" [type]="optionalType" [className]="optionalClass">Defaults</button>
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp6 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; readonly optionalSpeed:number|undefined=undefined;readonly optionalGlow:boolean|undefined=undefined;readonly optionalType:'button'|'submit'|'reset'|undefined=undefined;readonly optionalClass:string|undefined=undefined;height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler, type OrbitalLoadingRingVariant } from 'kit-ui-angular';
@Component({selector:'consumer-app-7',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
<kit-orbital-loading-ring [size]="96" [speed]="2" variant="dense" label="Reading" aria-label="Custom name" className="customer-ring"/>
<kit-orbital-loading-ring [size]="optionalSize" [speed]="optionalSpeed" [variant]="optionalVariant" [label]="optionalLabel" [className]="optionalClass" [aria-label]="optionalLabel"/>
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp7 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; readonly optionalSize:number|undefined=undefined;readonly optionalSpeed:number|undefined=undefined;readonly optionalVariant:OrbitalLoadingRingVariant|undefined=undefined;readonly optionalLabel:string|undefined=undefined;readonly optionalClass:string|undefined=undefined;height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler, type SpotlightCardMouseHandler } from 'kit-ui-angular';
@Component({selector:'consumer-app-8',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
  <kit-spotlight-card [spotlightColor]="optionalColor" [spotlightSize]="optionalSize" [className]="optionalClass" [onMouseMove]="optionalHandler" [onMouseLeave]="optionalHandler"><button (click)="done=true">Projected action</button></kit-spotlight-card>
  <kit-spotlight-card spotlightColor="rgba(255,255,255,.1)" [spotlightSize]="180" [onMouseMove]="moved">Projected content</kit-spotlight-card>
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp8 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; readonly optionalColor:string|undefined=undefined;readonly optionalSize:number|undefined=undefined;readonly optionalClass:string|undefined=undefined;readonly optionalHandler:SpotlightCardMouseHandler|undefined=undefined;readonly moved:SpotlightCardMouseHandler=event=>{this.height=event.clientX;}; height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`,
`import { Component } from '@angular/core';
import { ${portImports}, KitElasticSheetComponent, KitSmartUploadComponent, KitLiquidCommandPaletteComponent, KitHoldToConfirmComponent, KitSwipeActionListComponent, KitInteractiveDataCardComponent, KitTimelineScrubberComponent, KitAIPromptComposerComponent, type UploadHandler, type SendHandler, type MorphingIconStyle } from 'kit-ui-angular';
@Component({selector:'consumer-app-9',imports:[${portImports}, KitElasticSheetComponent,KitSmartUploadComponent,KitLiquidCommandPaletteComponent,KitHoldToConfirmComponent,KitSwipeActionListComponent,KitInteractiveDataCardComponent,KitTimelineScrubberComponent,KitAIPromptComposerComponent],template:\`
  ${portTemplates}
  <kit-morphing-icon [from]="genericIcon" [to]="genericIcon" [active]="optionalActive" [size]="optionalSize" [duration]="optionalDuration" [className]="optionalClass" [style]="optionalStyle"/>
  <kit-elastic-sheet [snapPositions]="[35,65,90]" (snapChange)="height = $event" />
  <kit-smart-upload [upload]="upload" [maxFiles]="2" />
  <kit-liquid-command-palette [commands]="[]" />
  <kit-hold-to-confirm [duration]="500" (confirmed)="done = true" />
  <kit-swipe-action-list [items]="[]" />
  <kit-interactive-data-card summary="Consumer summary">Consumer detail</kit-interactive-data-card>
  <kit-timeline-scrubber [events]="[]" (eventChange)="height = $event.index" />
  <kit-ai-prompt-composer [sendHandler]="send" />
\`})
export class ConsumerApp9 { readonly noopClose=()=>{};readonly noopSearch=(_value:string)=>{}; readonly optionalActive:boolean|undefined=undefined;readonly optionalSize:number|undefined=undefined;readonly optionalDuration:number|undefined=undefined;readonly optionalClass:string|undefined=undefined;readonly optionalStyle:MorphingIconStyle|undefined=undefined;height=0;done=false;readonly upload:UploadHandler=async(_file,{onProgress})=>{onProgress(100);};readonly send:SendHandler=async()=>{}; }
`
  ];
  consumerSources.push(`import {Component} from '@angular/core';
import {KitPressButtonComponent,type PressButtonVariant,type PressButtonSize} from 'kit-ui-angular';
@Component({selector:'press-consumer',imports:[KitPressButtonComponent],template:\`<button kitPressButton [variant]="variant" [size]="size" [pressStrength]="strength" [fullWidth]="false" [disabled]="false" [type]="type" [className]="className" name="action" value="save">Save</button><kit-press-button variant="ghost" size="icon">Cancel</kit-press-button>\`})
export class PressConsumer{variant:PressButtonVariant|undefined=undefined;size:PressButtonSize|undefined=undefined;strength:number|undefined=undefined;type:'button'|'submit'|'reset'|undefined=undefined;className:string|undefined=undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';
import {KitTypewriterButtonComponent,type TypewriterButtonVariant,type TypewriterButtonCallback} from 'kit-ui-angular';
@Component({selector:'typewriter-consumer',imports:[KitTypewriterButtonComponent],template:\`<button kitTypewriterButton text="Save" [variant]="variant" [charDuration]="duration" [soundVolume]="volume" [soundEnabled]="sound" [autoStart]="auto" [onComplete]="complete" [onClick]="click" [type]="type" [className]="classes" name="action" value="save"></button><kit-typewriter-button text="Cancel" variant="outline"/>\`})
export class TypewriterConsumer{variant:TypewriterButtonVariant|undefined=undefined;duration:number|undefined=undefined;volume:number|undefined=undefined;sound:boolean|undefined=undefined;auto:boolean|undefined=undefined;complete:TypewriterButtonCallback|undefined=undefined;click:TypewriterButtonCallback|undefined=undefined;type:'button'|'submit'|'reset'|undefined=undefined;classes:string|undefined=undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';
import {KitExpandableSearchComponent,type ExpandableSearchHandler} from 'kit-ui-angular';
@Component({selector:'expandable-search-consumer',imports:[KitExpandableSearchComponent],template:\`<kit-expandable-search [placeholder]="placeholder" [onSearch]="search" [className]="classes"/><kit-expandable-search/>\`})
export class ExpandableSearchConsumer{placeholder:string|undefined=undefined;classes:string|undefined=undefined;search:ExpandableSearchHandler|undefined=undefined;}`);
  consumerSources.push(`import {Component} from "@angular/core";
import {KitStretchSwitchComponent,type StretchSwitchLabel,type StretchSwitchChangeHandler} from "kit-ui-angular";
@Component({selector:"stretch-consumer",imports:[KitStretchSwitchComponent],template:\`<ng-template #label><b>Template label</b></ng-template><kit-stretch-switch [label]="label" [checked]="checked" [defaultChecked]="initial" [disabled]="disabled" [description]="description" [className]="classes" [onChange]="change" (checkedChange)="last=$event"/><div kitStretchSwitch [label]="text">Projected</div><kit-stretch-switch [label]="true"/>\`})
export class StretchConsumer{checked:boolean|undefined;initial:boolean|undefined;disabled:boolean|undefined;description:string|undefined;classes:string|undefined;text:StretchSwitchLabel=0;change:StretchSwitchChangeHandler|undefined;last=false;}`);
  consumerSources.push(`import {Component} from '@angular/core';
import {KitIosSearchBarComponent} from 'kit-ui-angular';
@Component({selector:'ios-consumer',imports:[KitIosSearchBarComponent],template:\`<kit-ios-search-bar [value]="value" [onChange]="change" [onSubmit]="submit" [onClear]="clear" [disabled]="disabled" [autoFocus]="autoFocus" [placeholder]="placeholder" [collapsedWidth]="collapsed" [expandedWidth]="expanded" [className]="classes"/>\`})
export class IOSConsumer{value='';readonly change=(value:string)=>{this.value=value;};submit:((value:string)=>void)|undefined;clear:(()=>void)|undefined;disabled:boolean|undefined;autoFocus:boolean|undefined;placeholder:string|undefined;collapsed:number|string|undefined;expanded:number|string|undefined;classes:string|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitAnimatedNumberComponent,KitUnfoldAccordionComponent,type UnfoldAccordionItem} from 'kit-ui-angular';@Component({selector:'batch-four-consumer',imports:[KitAnimatedNumberComponent,KitUnfoldAccordionComponent],template:\`<ng-template #content><button>Details</button></ng-template><kit-unfold-accordion [items]="items" [allowMultiple]="multiple" [defaultOpen]="open" [className]="classes"/><kit-unfold-accordion [items]="[{id:'rich',title:'Details',content:content}]"/><kit-animated-number [value]="number" [decimals]="decimals" [prefix]="prefix" [suffix]="suffix" [stiffness]="stiffness" [damping]="damping" [mass]="mass" [useGrouping]="grouping" [compact]="compact" [className]="classes"/>\`})export class BatchFourConsumer{items:UnfoldAccordionItem[]=[];number=1234;multiple:boolean|undefined;open:string[]|undefined;classes:string|undefined;decimals:number|undefined;prefix:string|undefined;suffix:string|undefined;stiffness:number|undefined;damping:number|undefined;mass:number|undefined;grouping:boolean|undefined;compact:boolean|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitCursorFollowerComponent,KitLiquidRippleButtonComponent,type LiquidRippleVariant} from 'kit-ui-angular';@Component({selector:'batch-twenty-consumer',imports:[KitCursorFollowerComponent,KitLiquidRippleButtonComponent],template:\`<div kitCursorFollower [size]="number" [offsetX]="number" [offsetY]="number" [stiffness]="number" [damping]="number" [mass]="number" [hideOnLeave]="flag" [scaleOnMove]="flag" [className]="classes" [style]="styles" data-consumer="follower"><span>Follow</span></div><kit-cursor-follower/><button kitLiquidRippleButton [variant]="variant" [showIcon]="flag" [disabled]="flag" [type]="type" [className]="classes" [onClick]="click" [onPointerDown]="pointer" name="intent" value="save" aria-label="Save">Save</button><kit-liquid-ripple-button [children]="classes"/><button kitLiquidRippleButton disabled>Disabled</button>\`})export class BatchTwentyConsumer{number:number|undefined;flag:boolean|undefined;classes:string|undefined;variant:LiquidRippleVariant|undefined;type:'button'|'submit'|'reset'|undefined;styles:Record<string,string|number|undefined>|undefined;click:((event:MouseEvent)=>void)|undefined;pointer:((event:PointerEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitMeteorsComponent,KitTextScrambleDecoderComponent} from 'kit-ui-angular';@Component({selector:'batch-twenty-one-consumer',imports:[KitMeteorsComponent,KitTextScrambleDecoderComponent],template:\`<kit-meteors [number]="number" [color]="text" [trailColor]="text" [tailLength]="number" [angle]="number" [minDelay]="number" [maxDelay]="number" [minDuration]="number" [maxDuration]="number" [className]="text" [style]="styles"><span>Content</span></kit-meteors><kit-text-scramble-decoder text="READY" [characters]="text" [duration]="number" [trigger]="trigger" [replayLabel]="text" [className]="text" [onMouseEnter]="enter"/>\`})export class BatchTwentyOneConsumer{number:number|undefined;text:string|undefined;trigger:'mount'|'hover'|'manual'|undefined;styles:Record<string,string|number>|undefined;enter:((event:MouseEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitMorphingBlobComponent,KitCircularOrbitComponent,type OrbitItem} from 'kit-ui-angular';@Component({selector:'batch-twenty-two-consumer',imports:[KitMorphingBlobComponent,KitCircularOrbitComponent],template:\`<kit-morphing-blob [width]="number" [height]="number" [points]="number" [baseRadius]="number" [variance]="number" [speed]="number" [stiffness]="number" [damping]="number" [cursorFollow]="flag" [cursorStrength]="number" [cursorSmoothness]="number" [colors]="colors" [className]="text"/><kit-circular-orbit [items]="items" [title]="text" [speed]="number" [radius]="number" [pauseOnHover]="flag" [className]="text" [containerClassName]="text" [titleClassName]="text"/>\`})export class BatchTwentyTwoConsumer{number:number|undefined;text:string|undefined;flag:boolean|undefined;colors:[string,string]|undefined;items:OrbitItem[]|undefined;}`);
  consumerSources.push(`import {Component,TemplateRef} from '@angular/core';import {KitDotFieldComponent,KitFloatingActionDockComponent,type DockItem} from 'kit-ui-angular';@Component({selector:'batch-twenty-three-consumer',imports:[KitDotFieldComponent,KitFloatingActionDockComponent],template:\`<kit-dot-field [dotRadius]="number" [dotSpacing]="number" [gradientFrom]="text" [gradientTo]="text" [className]="text" [style]="styles"/><div kitDotField [dotRadius]="number" [dotSpacing]="number" [style]="styles" [attr.aria-hidden]="false" data-native="dots"></div><ng-template #icon>Icon</ng-template><kit-floating-action-dock [items]="items(icon)" [activeId]="text" [className]="text"/>\`})export class BatchTwentyThreeConsumer{number:number|undefined;text:string|undefined;styles:Record<string,string|number>|undefined;items(icon:TemplateRef<unknown>):DockItem[]{return [{id:'a',label:'Action',icon,badge:true,onClick:()=>{}}]}}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitDensityLensComponent,KitGravityParticleBurstComponent} from 'kit-ui-angular';@Component({selector:'batch-twenty-four-consumer',imports:[KitDensityLensComponent,KitGravityParticleBurstComponent],template:\`<ng-template #content>Content</ng-template><ng-template #lens let-x="x" let-scale="scale">{{x}} {{scale}}</ng-template><kit-density-lens [children]="content" [renderLensContent]="lens" [lensSize]="number" [lensShape]="shape" [zoomScale]="number" [showBorder]="flag" [onMouseEnter]="mouse" [onMouseLeave]="mouse" [onMouseMove]="mouse"/><div kitDensityLens [children]="text" [className]="text" [style]="styles" aria-label="Inspect"></div><kit-gravity-particle-burst [label]="text" [particleCount]="number" [children]="content" [className]="text" [onPointerDown]="pointer" [onClick]="mouse"/><div kitGravityParticleBurst [label]="text" [style]="styles" data-consumer="burst"></div>\`})export class BatchTwentyFourConsumer{number:number|undefined;text:string|undefined;flag:boolean|undefined;shape:'circle'|'oval'|'square'|undefined;styles:Record<string,string|number>|undefined;mouse:((event:MouseEvent)=>void)|undefined;pointer:((event:PointerEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component,TemplateRef} from '@angular/core';import {KitElasticSheetComponent,KitSelectionBasketComponent,type SelectionActionItem} from 'kit-ui-angular';@Component({selector:'batch-twenty-five-consumer',imports:[KitElasticSheetComponent,KitSelectionBasketComponent],template:\`<ng-template #sheetContent><button>Details</button></ng-template><kit-elastic-sheet [children]="sheetContent" [title]="text" [disabled]="flag" [snapPositions]="snaps" [onSnapChange]="snap" (snapChange)="changed($event)"><button>Details</button></kit-elastic-sheet><ng-template #icon><b>Icon</b></ng-template><kit-selection-basket [selectedCount]="2" [totalCount]="total" [mode]="mode" [actions]="items(icon)" [onClearSelection]="clear" [onSelectAll]="clear" [className]="text"/>\`})export class BatchTwentyFiveConsumer{text:string|undefined;flag:boolean|undefined;snaps:number[]|undefined;total:number|undefined;mode:'fixed'|'contained'|'inline'|undefined;snap:((value:number)=>void)|undefined;clear:(()=>void)|undefined;changed(value:number):void{}items(icon:TemplateRef<unknown>):SelectionActionItem[]{return [{id:'a',label:'Action',icon,variant:'primary',onClick:()=>{}}]}}`);
  consumerSources.push(`import {Component,TemplateRef} from '@angular/core';import {KitSettleModalComponent,KitStackUnfoldPanelComponent,type SettleModalContent,type StackCard} from 'kit-ui-angular';@Component({selector:'batch-twenty-six-consumer',imports:[KitSettleModalComponent,KitStackUnfoldPanelComponent],template:\`<ng-template #content><button>Content</button></ng-template><kit-settle-modal [open]="open" [onClose]="close" [title]="text" [description]="content" [children]="content" [footer]="content" [hideCloseButton]="flag" [closeOnBackdrop]="flag" [size]="size" [className]="text"/><kit-stack-unfold-panel [cards]="cards(content)" [expandedIds]="expanded" [onExpandedChange]="change" [allowMultiple]="flag" [variant]="variant" [className]="text"/>\`})export class BatchTwentySixConsumer{open=false;readonly close=()=>{};text:string|undefined;flag:boolean|undefined;size:'sm'|'md'|'lg'|undefined;variant:'default'|'minimal'|undefined;expanded:string[]|undefined;change:((ids:string[])=>void)|undefined;content:SettleModalContent;cards(content:TemplateRef<unknown>):StackCard[]{return [{id:'a',title:'Card',content,subtitle:'Details',badge:'READY',disabled:false}]}}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitSmartUploadComponent,KitLiquidCommandPaletteComponent,type UploadHandler,type LiquidCommand} from 'kit-ui-angular';@Component({selector:'batch-twenty-seven-consumer',imports:[KitSmartUploadComponent,KitLiquidCommandPaletteComponent],template:\`<kit-smart-upload [accept]="text" [maxSize]="number" [maxFiles]="number" [disabled]="flag" [upload]="upload"/><kit-liquid-command-palette [commands]="commands" [disabled]="flag"/>\`})export class BatchTwentySevenConsumer{text:string|undefined;number:number|undefined;flag:boolean|undefined;upload:UploadHandler|undefined;commands:LiquidCommand[]|undefined;}`);
  consumerSources.push(`import {Component,TemplateRef} from '@angular/core';import {KitAnimatedTabsComponent,KitScrollvelocitytextComponent,type AnimatedTabItem,type ScrollVelocityContainerRef,type ScrollVelocityStyle} from 'kit-ui-angular';@Component({selector:'batch-twenty-eight-consumer',imports:[KitAnimatedTabsComponent,KitScrollvelocitytextComponent],template:\`<ng-template #rich><button type="button">Native content</button></ng-template><kit-animated-tabs [tabs]="tabs(rich)" [defaultTab]="text" [activeTab]="text" [onChange]="change" [className]="text" [tabsContainerClassName]="text" [renderContent]="flag" [layoutId]="text" [variant]="variant"/><h2 kitScrollVelocityText text="Heading" [expandDistance]="number" [intensity]="number" [minLetterSpacing]="number" [maxLetterSpacing]="number" [maxScale]="number" [fadeStart]="number" [smoothingMs]="number" [transformOrigin]="text" [scrollContainerRef]="scrollRef" [style]="styles" [className]="text" [attributes]="attributes"></h2><kit-scrollvelocitytext text="Readable" [as]="tag"/><kit-scrollvelocitytext text="SVG text node" as="svg"/>\`})export class BatchTwentyEightConsumer{text:string|undefined;number:number|undefined;flag:boolean|undefined;tag:keyof HTMLElementTagNameMap|undefined;variant:'default'|'glass'|'pill'|undefined;change:((id:string)=>void)|undefined;scrollRef:ScrollVelocityContainerRef|undefined;styles:ScrollVelocityStyle|undefined;attributes:Record<string,string|number|boolean|null|undefined>|undefined;tabs(content:TemplateRef<unknown>):AnimatedTabItem[]{return [{id:'a',label:'Alpha',icon:content,content,badge:0}]}}`);
  consumerSources.push(`import {Component,TemplateRef} from '@angular/core';import {KitSmallFloatingDockComponent,KitBranchingSubmenuComponent,type SmallFloatingDockItem,type BranchingSubmenuItem} from 'kit-ui-angular';@Component({selector:'batch-twenty-nine-consumer',imports:[KitSmallFloatingDockComponent,KitBranchingSubmenuComponent],template:\`<ng-template #icon><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg></ng-template><kit-small-floating-dock [items]="items(icon)" [position]="position" [size]="size" [variant]="variant" [hideOnScroll]="flag" [activeId]="text" [className]="text"/><kit-branching-submenu [items]="branches" [label]="text" [className]="text" [style]="styles" [attributes]="attributes" [onKeyDown]="key"/>\`})export class BatchTwentyNineConsumer{text:string|undefined;flag:boolean|undefined;position:'bottom-right'|'bottom-center'|'bottom-left'|undefined;size:'sm'|'md'|'lg'|undefined;variant:'icon-only'|'icon-label'|undefined;branches:BranchingSubmenuItem[]|undefined;styles:Record<string,string|number|null|undefined>|undefined;attributes:Record<string,string|number|boolean|null|undefined>|undefined;key:((event:KeyboardEvent)=>void)|undefined;items(icon:TemplateRef<unknown>):SmallFloatingDockItem[]{return [{id:'one',label:'One',icon,action:()=>{},badge:100,disabled:false}]}}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitSpringSelectComponent,KitGooeyMenuComponent,type SpringSelectOption} from 'kit-ui-angular';@Component({selector:'batch-thirty-two-consumer',imports:[KitSpringSelectComponent,KitGooeyMenuComponent],template:\`<kit-spring-select [options]="options" [value]="text" [defaultValue]="text" [placeholder]="text" [label]="text" [error]="text" [disabled]="flag" [className]="text" [onChange]="change"/><kit-gooey-menu [options]="labels" [value]="text" [defaultValue]="text" [open]="flag" [defaultOpen]="flag" [width]="number" [onOpenChange]="opened" [onSelect]="selected" [className]="text" [onKeyDown]="key"/>\`})export class BatchThirtyTwoConsumer{options:SpringSelectOption[]=[];labels:string[]|undefined;flag:boolean|undefined;text:string|undefined;number:number|undefined;change:((value:string)=>void)|undefined;opened:((open:boolean)=>void)|undefined;selected:((value:string,index:number)=>void)|undefined;key:((event:KeyboardEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitMorphingDialogComponent,KitVelocityToastComponent,type VelocityToastVariant,type VelocityToastPosition} from 'kit-ui-angular';@Component({selector:'batch-thirty-three-consumer',imports:[KitMorphingDialogComponent,KitVelocityToastComponent],template:\`<ng-template #trigger let-open let-layoutId="layoutId"><button type="button" [attr.data-morph-layout-id]="layoutId" (click)="open()">Open</button></ng-template><ng-template #content>Native content</ng-template><ng-template #icon><span>Custom icon</span></ng-template><kit-morphing-dialog title="Settings" [trigger]="trigger" [content]="content" [id]="text" [subtitle]="text" [className]="text"/><kit-velocity-toast [open]="open" title="Notification" [description]="text" [duration]="number" [variant]="variant" [position]="position" [showProgress]="flag" [className]="text" [icon]="flag?icon:undefined" [onDismiss]="dismiss"/>\`})export class BatchThirtyThreeConsumer{open=false;text:string|undefined;number:number|undefined;flag:boolean|undefined;variant:VelocityToastVariant|undefined;position:VelocityToastPosition|undefined;dismiss:(()=>void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitPricingComponent,KitStackedCardsComponent,type PricingTier,type PricingFeature,type PricingStyle,type PricingAttributes,type StackedCard} from 'kit-ui-angular';@Component({selector:'batch-thirty-five-consumer',imports:[KitPricingComponent,KitStackedCardsComponent],template:\`<kit-pricing [freeTier]="tier" [proTier]="tier" [reverse]="flag" [columns]="columns" [eyebrow]="text" [heading]="text" [subheading]="text" [className]="text" [style]="style" [attributes]="attributes" [onClick]="click" [onKeyDown]="key"/><kit-stacked-cards [cards]="cards" [title]="text" [subtitle]="text" [className]="text" [style]="style" [attributes]="attributes" [onClick]="click" [onKeyDown]="key"/>\`})export class BatchThirtyFiveConsumer{tier:PricingTier|undefined;features:PricingFeature[]=[];cards:StackedCard[]|null|undefined;text:string|undefined;flag:boolean|undefined;columns:1|2|'auto'|undefined;style:PricingStyle|undefined;attributes:PricingAttributes|undefined;click:((event:MouseEvent)=>void)|undefined;key:((event:KeyboardEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitDependencyTraceComponent,KitRecoveryLedgerComponent,type TraceNode,type TraceConnection,type LedgerEntry} from 'kit-ui-angular';@Component({selector:'batch-thirty-four-consumer',imports:[KitDependencyTraceComponent,KitRecoveryLedgerComponent],template:\`<kit-dependency-trace [nodes]="nodes" [connections]="connections" [nodeSize]="number" [className]="text" [onNodeSelect]="selected" [onNodeHover]="hovered"/><kit-recovery-ledger [entries]="entries" [currentEntryId]="text" [variant]="variant" [className]="text" [onRestore]="restore" [onSelect]="selected"/>\`})export class BatchThirtyFourConsumer{nodes:TraceNode[]=[];connections:TraceConnection[]=[];entries:LedgerEntry[]=[];text:string|undefined;number:number|undefined;variant:'timeline'|'compact'|undefined;selected:((id:string)=>void)|undefined;hovered:((id:string|null)=>void)|undefined;restore:((id:string)=>Promise<void>|void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';import {KitExpandableDataRowComponent,KitInteractiveTimelineComponent,type DataRowItem,type TimelineItem,type TimelineMetric,type TimelineStatus,type InteractiveTimelineStyle,type InteractiveTimelineAttributes} from 'kit-ui-angular';@Component({selector:'batch-thirty-seven-consumer',imports:[KitExpandableDataRowComponent,KitInteractiveTimelineComponent],template:\`<kit-expandable-data-row [items]="rows" [allowMultiple]="flag" [defaultExpandedIds]="ids" [isLoading]="flag" [onRowAction]="action" [className]="text"/><kit-interactive-timeline [items]="items" [defaultSelectedId]="text" [onItemSelect]="select" [collapsible]="flag" [className]="text" [style]="style" [attributes]="attributes" [onClick]="click" [onKeyDown]="key"/>\`})export class BatchThirtySevenConsumer{rows:DataRowItem[]|undefined;items:TimelineItem[]|undefined;ids:string[]|undefined;flag:boolean|undefined;text:string|undefined;status:TimelineStatus='pending';metric:TimelineMetric={label:'Size',value:'12kb'};style:InteractiveTimelineStyle|undefined;attributes:InteractiveTimelineAttributes|undefined;action:((action:string,row:DataRowItem)=>void)|undefined;select:((item:TimelineItem)=>void)|undefined;click:((event:MouseEvent)=>void)|undefined;key:((event:KeyboardEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component,TemplateRef} from '@angular/core';import {KitMacOsFolderCardsComponent,KitStoryCardComponent,type MacOSFolderCardItem,type MacOSFolderIcon,type MacOSFolderStyle,type MacOSFolderAttributes,type StoryCard,type StoryCardsStyle,type StoryCardsAttributes} from 'kit-ui-angular';@Component({selector:'batch-thirty-six-consumer',imports:[KitMacOsFolderCardsComponent,KitStoryCardComponent],template:\`<ng-template #icon><span>Custom icon</span></ng-template><kit-mac-os-folder-cards [folderTitle]="text" [folderCategory]="text" [items]="items(icon)" [defaultOpen]="flag" [isPeeked]="flag" [className]="text" [style]="style" [attributes]="attributes" [onClick]="click" [onKeyDown]="key"/><kit-story-card [cards]="cards" [initialIndex]="number" [autoPlay]="flag" [autoPlayInterval]="number" [showNavigation]="flag" [loop]="flag" [enableWheelScroll]="flag" [title]="text" [subtitle]="text" [className]="text" [style]="storyStyle" [attributes]="storyAttributes" [onClick]="click" [onKeyDown]="key" [onMouseEnter]="click" [onMouseLeave]="click"/>\`})export class BatchThirtySixConsumer{text:string|undefined;number:number|undefined;flag:boolean|undefined;style:MacOSFolderStyle|undefined;attributes:MacOSFolderAttributes|undefined;storyStyle:StoryCardsStyle|undefined;storyAttributes:StoryCardsAttributes|undefined;cards:StoryCard[]|undefined;icon:MacOSFolderIcon;items(icon:TemplateRef<unknown>):MacOSFolderCardItem[]{return [{id:'a',title:'Item',description:'Details',icon}]};click:((event:MouseEvent)=>void)|undefined;key:((event:KeyboardEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';
import {KitCommandMenuComponent,KitSpotlightSearchComponent,type CommandItem,type SpotlightSearchItem} from 'kit-ui-angular';
@Component({selector:'batch-forty-two-consumer',imports:[KitCommandMenuComponent,KitSpotlightSearchComponent],template:\`<kit-command-menu [isOpen]="false" [onClose]="close" [onSelectComponent]="component" [onNavigateDocs]="docs"/><kit-spotlight-search [open]="flag" [onOpenChange]="change" [onClose]="optionalClose" [items]="items" [placeholder]="text" [recentSearches]="recent" [onSelect]="select" [enableGlobalShortcut]="flag" [className]="text" [onSelectComponent]="component" [onNavigateDocs]="docs"/>\`})
export class BatchFortyTwoConsumer {flag:boolean|undefined;text:string|undefined;recent:string[]|undefined;readonly close=()=>{};optionalClose:(()=>void)|undefined;change:((open:boolean)=>void)|undefined;component:((id:string)=>void)|undefined;docs:((topic?:string)=>void)|undefined;select:((item:SpotlightSearchItem)=>void)|undefined;items:SpotlightSearchItem[]|undefined=[{id:'custom',title:'Custom action',category:'Tools',description:'Filterable description',icon:undefined,shortcut:['K'],action:()=>{}}];command:CommandItem={id:'custom',title:'Custom command',category:'Actions',icon:undefined,onSelect:()=>{}};}`);
  consumerSources.push(`import {Component,TemplateRef} from '@angular/core';
import {KitDragToConfirmComponent,KitSmartComparisonComponent,type DragConfirmActionType,type DragConfirmVariant,type DragConfirmSize,type ComparisonPlan,type ComparisonFeature,type ComparisonCategory,type ComparisonValue,type ComparisonTemplateValue,type SmartComparisonStyle,type SmartComparisonAttributes} from 'kit-ui-angular';
@Component({selector:'batch-forty-three-consumer',imports:[KitDragToConfirmComponent,KitSmartComparisonComponent],template:\`<ng-template #icon><b>Custom</b></ng-template><kit-drag-to-confirm [label]="text" [confirmedLabel]="text" [actionType]="action" [variant]="variant" [size]="size" [icon]="icon" [confirmedIcon]="optionalIcon" [isConfirmed]="flag" [onConfirm]="callback" [onReset]="callback" [autoResetDelay]="delay" [disabled]="flag" [haptic]="flag" [className]="text"/><kit-smart-comparison [plans]="plans" [categories]="categories" [defaultPlanId]="text" [enableSearch]="flag" [enableDiffFilter]="flag" [className]="text" [style]="styles" [attributes]="attributes" [onClick]="click" [onKeyDown]="key"/><kit-smart-comparison [plans]="[]" [categories]="richCategories(icon)"/>\`})
export class BatchFortyThreeConsumer{text:string|undefined;flag:boolean|undefined;delay:number|undefined;action:DragConfirmActionType|undefined;variant:DragConfirmVariant|undefined;size:DragConfirmSize|undefined;optionalIcon:TemplateRef<unknown>|null|undefined;callback:(()=>void)|undefined;styles:SmartComparisonStyle|undefined;attributes:SmartComparisonAttributes|undefined;click:((event:MouseEvent)=>void)|undefined;key:((event:KeyboardEvent)=>void)|undefined;plans:ComparisonPlan[]|undefined;categories:ComparisonCategory[]|undefined;value:ComparisonValue=0;richCategories(template:TemplateRef<unknown>):ComparisonCategory[]{const value:ComparisonTemplateValue={template,comparisonValue:{type:'b',props:{children:'Custom'}}};const feature:ComparisonFeature={id:'content',name:'Content',values:{custom:value}};return[{id:'native',title:'Native content',features:[feature]}]}}`);
  consumerSources.push(`import {Component} from '@angular/core';
import {KitThinkingOrbComponent,KitSparklesCoreComponent,type ThinkingOrbState,type ThinkingOrbStyle,type SparkleShape,type SparkleDirection,type SparkleCursorMode,type SparklesStyle,type SparklesAttributes,type SparklesMotionTarget,type SparklesTransition} from 'kit-ui-angular';
@Component({selector:'batch-forty-four-consumer',imports:[KitThinkingOrbComponent,KitSparklesCoreComponent],template:\`<kit-thinking-orb [state]="state" [size]="number" [speed]="number" [dark]="flag" [paused]="flag" [className]="text" [style]="orbStyle" [aria-label]="text"/><kit-sparkles-core [id]="text" [background]="text" [particleSize]="number" [minSize]="number" [maxSize]="number" [speed]="number" [particleColor]="text" [particleColors]="colors" [particleDensity]="number" [particleCount]="number" [particleShape]="shape" [direction]="direction" [twinkle]="flag" [twinkleSpeed]="number" [interactive]="flag" [cursorMode]="cursor" [cursorRadius]="number" [clickPush]="number" [opacity]="number" [blur]="number" [paused]="flag" [className]="text" [style]="styles" [attributes]="attributes" [initial]="initial" [animate]="animate" [transition]="transition" [onClick]="click" [onPointerMove]="pointer" [onPointerLeave]="pointer"><b>Native content</b></kit-sparkles-core>\`})
export class BatchFortyFourConsumer{state:ThinkingOrbState|undefined;shape:SparkleShape|undefined;direction:SparkleDirection|undefined;cursor:SparkleCursorMode|undefined;text:string|undefined;number:number|undefined;flag:boolean|undefined;colors:string[]|undefined;orbStyle:ThinkingOrbStyle|undefined;styles:SparklesStyle|undefined;attributes:SparklesAttributes|undefined;initial:SparklesMotionTarget|false|undefined;animate:SparklesMotionTarget|undefined;transition:SparklesTransition|undefined;click:((event:MouseEvent)=>void)|undefined;pointer:((event:PointerEvent)=>void)|undefined;}`);
  consumerSources.push(`import {Component} from '@angular/core';
import {KitGlyphMatrixComponent,KitShootingStarsComponent,type GlyphMatrixHandle,type GlyphMatrixStyle,type GlyphMatrixAttributes,type ShootingStarsStyle,type ShootingStarsAttributes,type ShootingStarsMotionTarget,type ShootingStarsTransition} from 'kit-ui-angular';
@Component({selector:'batch-forty-five-consumer',imports:[KitGlyphMatrixComponent,KitShootingStarsComponent],template:\`<kit-glyph-matrix #matrix [fontSize]="number" [color]="text" [headColor]="text" [backgroundColor]="text" [charset]="text" [speed]="number" [fadeRate]="number" [interactive]="flag" [paused]="flag" [fullPage]="flag" [opacity]="number" [className]="text" [style]="glyphStyle" [attributes]="glyphAttributes" [onPointerMove]="pointer" [onPointerLeave]="pointer" [onClick]="click" [onKeyDown]="key"><b>Glyph content</b></kit-glyph-matrix><button (click)="matrix.reset();matrix.togglePause();useHandle(matrix)">Control</button><kit-shooting-stars [background]="text" [starCount]="number" [starColors]="colors" [minStarSize]="number" [maxStarSize]="number" [twinkleSpeed]="number" [trailColor]="text" [headColor]="text" [interval]="number" [speed]="range" [trailLength]="range" [angle]="number" [maxActiveShootingStars]="number" [showEmbers]="flag" [nebula]="flag" [clickToSpawn]="flag" [parallax]="flag" [paused]="flag" [className]="text" [style]="style" [attributes]="attributes" [initial]="initial" [animate]="animate" [transition]="transition" [onClick]="click" [onPointerMove]="pointer" [onPointerLeave]="pointer" [onKeyDown]="key"><b>Sky content</b></kit-shooting-stars>\`})
export class BatchFortyFiveConsumer{text:string|undefined;number:number|undefined;range:number|[number,number]|undefined;flag:boolean|undefined;colors:string[]|undefined;glyphStyle:GlyphMatrixStyle|undefined;glyphAttributes:GlyphMatrixAttributes|undefined;style:ShootingStarsStyle|undefined;attributes:ShootingStarsAttributes|undefined;initial:ShootingStarsMotionTarget|false|undefined;animate:ShootingStarsMotionTarget|undefined;transition:ShootingStarsTransition|undefined;pointer:((event:PointerEvent)=>void)|undefined;click:((event:MouseEvent)=>void)|undefined;key:((event:KeyboardEvent)=>void)|undefined;useHandle(handle:GlyphMatrixHandle):void{handle.reset();handle.togglePause()}}`);
  consumerSources.push(...parityUsageSources);
  consumerSources.forEach((source, index) => fs.writeFileSync(path.join(target, `app${index}.ts`), source));
  fs.writeFileSync(
    path.join(target, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ES2022",
          moduleResolution: "bundler",
          experimentalDecorators: true,
          strict: true,
          skipLibCheck: true,
          outDir: "out",
        },
        angularCompilerOptions: {
          strictTemplates: true,
          compilationMode: "full",
        },
        files: consumerSources.map((_, index) => `app${index}.ts`),
      },
      null,
      2,
    ),
  );
  const compile = spawnSync(
    process.execPath,
    [
      path.join(
        target,
        "node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js",
      ),
      "-p",
      path.join(target, "tsconfig.json"),
    ],
    { cwd: target, stdio: "inherit" },
  );
  if (compile.status !== 0) process.exit(compile.status ?? 1);
  const installed = path.join(target, "node_modules/kit-ui-angular");
  for (const asset of ["styles.css", "LICENSE", "UPSTREAM-MIT.txt", "LUCIDE.txt", "LUCIDE-LICENSE.txt"])
    if (!fs.existsSync(path.join(installed, asset)))
      throw new Error(`Missing package asset: ${asset}`);
  console.log(
    `Angular ${angularVersion}: installed tarball and compiled all ${ports.length + 8} selectors with its own compiler and strict templates.`,
  );
  // Only remove the unique temporary directory created above.
  if (
    !path
      .resolve(target)
      .startsWith(
        path.resolve(os.tmpdir()) + path.sep + "kit-angular-consumer-",
      )
  )
    throw new Error("Unexpected cleanup path");
  fs.rmSync(target, { recursive: true, force: true });
}

import {PullRefreshDemoComponent,CarSmokeDemoComponent} from './batch50-demos';
import {DynamicIslandDemoComponent,ChatDemoComponent} from './batch49-demos';
import {SignUpDemoComponent,ParticleDeleteDemoComponent} from './batch48-demos';
import {FormDemoComponent,LoginDemoComponent} from './batch47-demos';
import {DotShaderDemoComponent,AnimatedFileUploadDemoComponent} from './batch46-demos';
import {GlyphMatrixDemoComponent,ShootingStarsDemoComponent} from './batch45-demos';
import {ThinkingOrbDemoComponent,SparklesCoreDemoComponent} from './batch44-demos';
import {DragToConfirmDemoComponent,SmartComparisonDemoComponent} from './batch43-demos';
import {CommandMenuDemoComponent,SpotlightSearchDemoComponent} from './batch42-demos';
import {EvilEyeDemoComponent,NimbuMirchiDemoComponent} from './batch41-demos';
import {TorqueDialDemoComponent,RocketPartyPopperDemoComponent} from './batch40-demos';
import {CodeSnippetDeckDemoComponent,BatchGestureTrayDemoComponent} from './batch39-demos';
import {SpeedWarpDemoComponent,DepthCorridorDemoComponent} from './batch38-demos';
import {DataRowDemoComponent,InteractiveTimelineDemoComponent} from './batch37-demos';
import {FolderCardsDemoComponent,StoryCardsDemoComponent} from './batch36-demos';
import {PricingDemoComponent,StackedCardsDemoComponent} from './batch35-demos';
import {DependencyTraceDemoComponent,RecoveryLedgerDemoComponent} from './batch34-demos';
import {VelocityToastDemoComponent,MorphingDialogDemoComponent} from './batch33-demos';
import {SpringSelectDemoComponent,GooeyMenuDemoComponent} from './batch32-demos';
import {WalletCardDemoComponent,StickyPagesDemoComponent} from './batch31-demos';
import {GlassNavbarDemoComponent,ScrollProgressNavDemoComponent} from './batch30-demos';
import {SmallFloatingDockDemoComponent,BranchingSubmenuDemoComponent} from './batch29-demos';
import {AnimatedTabsDemoComponent,ScrollVelocityDemoComponent} from './batch28-demos';
import {StackUnfoldDemoComponent,SettleModalDemoComponent} from './batch26-demos';
import {ElasticSheetDemoComponent,SelectionBasketDemoComponent} from './batch25-demos';
import {DensityLensDemoComponent,GravityParticleBurstDemoComponent} from './batch24-demos';
import {CursorFollowerDemoComponent,LiquidRippleButtonDemoComponent} from './batch20-demos';
import {MeteorsDemoComponent} from './batch21-demos';
import {MorphingBlobDemoComponent,CircularOrbitDemoComponent} from './batch22-demos';
import {DotFieldDemoComponent,FloatingActionDockDemoComponent} from './batch23-demos';
import {AnimatedNumberDemoComponent} from './animated-number-demo';
import {UnfoldAccordionDemoComponent} from './unfold-accordion-demo';
import {IOSSearchDemoComponent} from './ios-search-demo';
import {HamburgerMenuDemoComponent} from "./hamburger-menu-demo";
import {SmoothAccordionDemoComponent} from './smooth-accordion-demo';
import {StretchSwitchDemoComponent} from "./stretch-switch-demo";
import {RevealCardDemoComponent} from "./reveal-card-demo";
import {PressButtonDemoComponent} from "./press-button-demo";
import {MagneticButtonDemoComponent} from "./magnetic-button-demo";
import {MorphingButtonDemoComponent} from "./morphing-button-demo";
import {TypewriterButtonDemoComponent} from "./typewriter-button-demo";
import {ExpandableSearchDemoComponent} from "./expandable-search-demo";
import {ButtonDemoComponent} from "./button-demo";
import {NeonEdgeButtonDemoComponent} from "./neon-edge-button-demo";
import {OrbitalLoadingRingDemoComponent} from "./orbital-loading-ring-demo";
import {SpotlightCardDemoComponent} from "./spotlight-card-demo";
import {MorphingIconDemoComponent} from "./morphing-icon-demo";
import { Component, HostListener, signal } from "@angular/core";
import { TableDemoComponent } from "./table-demo";
import { AgentDemoComponent } from "./agent-demo";
import { NgComponentOutlet } from "@angular/common";
import {LoaderDemoComponent} from "./loader-demo";
import { DEMO_PORTS, DEMO_PORT_KINDS } from "./ports";
import {
  KitElasticSheetComponent,
  KitSmartUploadComponent,
  KitLiquidCommandPaletteComponent,
  KitHoldToConfirmComponent,
  KitSwipeActionListComponent,
  KitInteractiveDataCardComponent,
  KitTimelineScrubberComponent,
  KitAIPromptComposerComponent,
} from "kit-ui-angular";
import type {
  UploadHandler,
  SendHandler,
  ActivityEvent,
} from "kit-ui-angular";

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Cancelled", "AbortError"));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", abort, { once: true });
  });
}

import {RainbowButtonDemoComponent} from "./rainbow-button-demo";

@Component({
  selector: "kit-angular-demo",
  standalone: true,
  imports: [PullRefreshDemoComponent,CarSmokeDemoComponent,DynamicIslandDemoComponent,ChatDemoComponent,SignUpDemoComponent,ParticleDeleteDemoComponent,FormDemoComponent,LoginDemoComponent,DotShaderDemoComponent,AnimatedFileUploadDemoComponent,GlyphMatrixDemoComponent,ShootingStarsDemoComponent,ThinkingOrbDemoComponent,SparklesCoreDemoComponent,DragToConfirmDemoComponent,SmartComparisonDemoComponent,CommandMenuDemoComponent,SpotlightSearchDemoComponent,EvilEyeDemoComponent,NimbuMirchiDemoComponent,TorqueDialDemoComponent,RocketPartyPopperDemoComponent,CodeSnippetDeckDemoComponent,BatchGestureTrayDemoComponent,SpeedWarpDemoComponent,DepthCorridorDemoComponent,DataRowDemoComponent,InteractiveTimelineDemoComponent,FolderCardsDemoComponent,StoryCardsDemoComponent,PricingDemoComponent,StackedCardsDemoComponent,RecoveryLedgerDemoComponent,DependencyTraceDemoComponent,MorphingDialogDemoComponent,VelocityToastDemoComponent,SpringSelectDemoComponent,GooeyMenuDemoComponent,GlassNavbarDemoComponent,ScrollProgressNavDemoComponent,SmallFloatingDockDemoComponent,BranchingSubmenuDemoComponent,AnimatedTabsDemoComponent,ScrollVelocityDemoComponent,StackUnfoldDemoComponent,SettleModalDemoComponent,ElasticSheetDemoComponent,SelectionBasketDemoComponent,DensityLensDemoComponent,GravityParticleBurstDemoComponent,DotFieldDemoComponent,FloatingActionDockDemoComponent,MorphingBlobDemoComponent,CircularOrbitDemoComponent,MeteorsDemoComponent,CursorFollowerDemoComponent,LiquidRippleButtonDemoComponent,AnimatedNumberDemoComponent,UnfoldAccordionDemoComponent,IOSSearchDemoComponent,RevealCardDemoComponent,StretchSwitchDemoComponent,SmoothAccordionDemoComponent,HamburgerMenuDemoComponent,ExpandableSearchDemoComponent,
    PressButtonDemoComponent,ButtonDemoComponent,MagneticButtonDemoComponent,MorphingButtonDemoComponent,TypewriterButtonDemoComponent,RainbowButtonDemoComponent,
    WalletCardDemoComponent,StickyPagesDemoComponent,
    NeonEdgeButtonDemoComponent,
    OrbitalLoadingRingDemoComponent,
    SpotlightCardDemoComponent,
    MorphingIconDemoComponent,
    NgComponentOutlet,
    TableDemoComponent,
    AgentDemoComponent,
    LoaderDemoComponent,
    KitElasticSheetComponent,
    KitSmartUploadComponent,
    KitLiquidCommandPaletteComponent,
    KitHoldToConfirmComponent,
    KitSwipeActionListComponent,
    KitInteractiveDataCardComponent,
    KitTimelineScrubberComponent,
    KitAIPromptComposerComponent,
  ],
  template: `<main class="kit-stack" aria-label="Native Angular demo">
    @switch (component) {
      @case ("animated-number") { <kit-number-demo/> }
      @case ("unfold-accordion") { <kit-unfold-demo/> }
      @case ("ios-search-bar") { <kit-ios-search-demo/> }
      @case ("advanced-data-table") { <kit-table-demo/> }
      @case ("ai-agent-activity") { <kit-agent-demo/> }
      @case("expandable-data-row"){<kit-data-row-demo/>}
      @case("interactive-timeline"){<kit-interactive-timeline-demo/>}
      @case("speed-warp"){<kit-speed-warp-demo/>}
      @case("depth-corridor"){<kit-depth-corridor-demo/>}
      @case("code-snippet-deck"){<kit-code-snippet-deck-demo/>}
      @case("batch-gesture-tray"){<kit-batch-gesture-tray-demo/>}
      @case("car-smoke-page-transition"){<kit-car-smoke-demo/>}
      @case("pull-to-refresh"){<kit-pull-refresh-demo/>}
      @case("dynamic-island"){<kit-dynamic-island-demo/>}
      @case("chat"){<kit-chat-demo/>}
      @case("form"){<kit-form-demo/>}
      @case("login"){<kit-login-demo/>}
      @case("sign-up"){<kit-sign-up-demo/>}
      @case("particle-delete"){<kit-particle-delete-demo/>}
      @case("dot-shader"){<kit-dot-shader-demo/>}
      @case("animated-file-upload"){<kit-animated-file-upload-demo/>}
      @case("glyph-matrix"){<kit-glyph-matrix-demo/>}
      @case("shooting-stars"){<kit-shooting-stars-demo/>}
      @case("thinking-orb"){<kit-thinking-orb-demo/>}
      @case("sparkles-core"){<kit-sparkles-core-demo/>}
      @case("drag-to-confirm"){<kit-drag-to-confirm-demo/>}
      @case("smart-comparison"){<kit-smart-comparison-demo/>}
      @case("command-menu"){<kit-command-menu-demo/>}
      @case("spotlight-search"){<kit-spotlight-search-demo/>}
      @case("evil-eye"){<kit-evil-eye-demo/>}
      @case("nimbu-mirchi"){<kit-nimbu-mirchi-demo/>}
      @case("torque-dial"){<kit-torque-dial-demo/>}
      @case("rocket-party-popper"){<kit-rocket-party-popper-demo/>}
      @case("loader"){<kit-loader-demo/>}
      @case("stretch-switch"){<kit-stretch-switch-demo/>}
      @case("press-button"){<kit-press-button-demo/>}
      @case("hamburger-menu"){<kit-hamburger-menu-demo/>}
      @case("magnetic-button"){<kit-magnetic-button-demo/>}
      @case("smooth-accordion"){<kit-smooth-accordion-demo/>}
      @case("morphing-button"){<kit-morphing-button-demo/>}
      @case("cursor-follower"){<kit-cursor-follower-demo/>}
      @case("meteors"){<kit-meteors-demo/>}
      @case("morphing-blob"){<kit-morphing-blob-demo/>}
      @case("circular-orbit"){<kit-circular-orbit-demo/>}
      @case("density-lens"){<kit-density-lens-demo/>}
      @case("gravity-particle-burst"){<kit-gravity-particle-burst-demo/>}
      @case("dot-field"){<kit-dot-field-demo/>}
      @case("floating-action-dock"){<kit-floating-action-dock-demo/>}
      @case("liquid-ripple-button"){<kit-liquid-ripple-button-demo/>}
      @case("typewriter-button"){<kit-typewriter-button-demo/>}
      @case("rainbow-button"){<kit-rainbow-button-demo/>}
      @case("expandable-search"){<kit-expandable-search-demo/>}
      @case("button"){<kit-button-demo/>}
      @case("neon-edge-button"){<kit-neon-edge-button-demo/>}
      @case("orbital-loading-ring"){<kit-orbital-loading-ring-demo/>}
      @case("reveal-card"){<kit-reveal-card-demo/>}
      @case("spotlight-card"){<kit-spotlight-card-demo/>}
      @case("morphing-icon"){<kit-morphing-icon-demo/>}
      @case("mac-os-folder-cards"){<kit-folder-cards-demo/>}
      @case("story-card"){<kit-story-cards-demo/>}
      @case("pricing"){<kit-pricing-demo/>}
      @case("stacked-cards"){<kit-stacked-cards-demo/>}
      @case("recovery-ledger"){<kit-recovery-ledger-demo/>}
      @case("dependency-trace"){<kit-dependency-trace-demo/>}
      @case("morphing-dialog"){<kit-morphing-dialog-demo/>}
      @case("velocity-toast"){<kit-velocity-toast-demo/>}
      @case("spring-select"){<kit-spring-select-demo/>}
      @case("gooey-menu"){<kit-gooey-menu-demo/>}
      @case("wallet-card"){<kit-wallet-card-demo/>}
      @case("sticky-pages"){<kit-sticky-pages-demo/>}
      @case("glass-navbar"){<kit-glass-navbar-demo/>}
      @case("scroll-progress-nav"){<kit-scroll-progress-nav-demo/>}
      @case("small-floating-dock"){<kit-small-floating-dock-demo/>}
      @case("branching-submenu"){<kit-branching-submenu-demo/>}
      @case("animated-tabs"){<kit-animated-tabs-demo/>}
      @case("scrollvelocitytext"){<kit-scroll-velocity-demo/>}
      @case("stack-unfold-panel"){<kit-stack-unfold-demo/>}
      @case("settle-modal"){<kit-settle-modal-demo/>}
      @case("selection-basket"){<kit-selection-basket-demo/>}
      @case ("elastic-sheet") {
        <kit-elastic-sheet-demo/>
      }
      @case ("smart-upload") {
        <div class="kit-stack">
        <p class="kit-muted">
          Local simulation. Files stay on your device. A filename containing
          “fail” demonstrates retry errors.
        </p>
        <kit-smart-upload [upload]="smartUpload" />
        </div>
      }
      @case ("liquid-command-palette") {
        <kit-liquid-command-palette />
      }
      @case ("hold-to-confirm") {
        <kit-hold-to-confirm [onConfirm]="confirm" />
      }
      @case ("swipe-action-list") {
        <kit-swipe-action-list [onAction]="action" />
      }
      @case ("interactive-data-card") {
        <kit-interactive-data-card [onAction]="action" />
      }
      @case ("timeline-scrubber") {
        <kit-timeline-scrubber />
      }
      @case ("ai-prompt-composer") {
        <p class="kit-muted">
          Local simulation. No AI service is connected. Include “fail” to
          demonstrate draft recovery.
        </p>
        <kit-ai-prompt-composer [onSend]="send" />
      }
      @default {
        @if (port) {
          <ng-container *ngComponentOutlet="port; inputs: portInputs" />
          @if (asyncDemo) {
            <label class="kit-row"
              ><input
                type="checkbox"
                [checked]="failRequests()"
                (change)="failRequests.set($any($event.target).checked)"
              />Simulate request failure</label
            >
          }
          @if(component !== "activity-feed") {<p class="kit-muted">
            Local demo data. Application actions are simulated; no account,
            payment, booking, or AI service is connected.
          </p>}
        } @else {
          <p role="alert">Select an available Angular component.</p>
        }
      }
    }
  </main>`,
})
export class DemoComponent {
  readonly componentId = signal(
    new URLSearchParams(window.location.search).get("component") ||
      "elastic-sheet",
  );
  get component() {
    return this.componentId();
  }
  @HostListener("window:popstate") restoreRoute(): void {
    this.componentId.set(
      new URLSearchParams(window.location.search).get("component") ||
        "elastic-sheet",
    );
  }
  get port() {
    return DEMO_PORTS[this.component];
  }
  readonly failRequests = signal(false);
  get asyncDemo() {
    return (
      ["action", "collection", "form"].includes(
        DEMO_PORT_KINDS[this.component],
      )
    );
  }
  readonly portAction = async (signal: AbortSignal) => {
    await wait(600, signal);
    if (this.failRequests()) throw new Error("Demo action failed. Try again.");
  };
  readonly portCollectionAction = async (
    _items: unknown[],
    signal: AbortSignal,
  ) => {
    await wait(600, signal);
    if (this.failRequests())
      throw new Error("Demo batch action failed. Selection preserved.");
  };
  readonly portSubmit = async (
    values: Record<string, string>,
    signal: AbortSignal,
  ) => {
    await wait(700, signal);
    if (
      this.failRequests() ||
      Object.values(values).some((value) => value.includes("fail"))
    )
      throw new Error("Demo submission failed. Values are preserved.");
  };
  get portInputs(): Record<string, unknown> {
    if (this.component === 'text-scramble-decoder') return {text:'KIT_UI.REGISTRY.SYNCED',trigger:'manual',duration:1000};
    if (this.component === "activity-feed") return { events: this.activityEvents };

    const kind = DEMO_PORT_KINDS[this.component];
    return kind === "action"
      ? { action: this.portAction }
      : kind === "collection"
        ? { action: this.portCollectionAction }
        : kind === "form"
          ? { submitHandler: this.portSubmit }
          : {};
  }
  readonly activityEvents: ActivityEvent[] = [
                {
                  id: 'evt-1',
                  type: 'deploy',
                  status: 'success',
                  title: 'Production release v2.4.0 verified',
                  timestamp: '2 mins ago',
                  duration: '380ms',
                  traceId: 'trc_98fa20',
                  description: 'All 32 edge clusters updated. Zero errors encountered.',
                  actor: { name: 'CI Pipeline', email: 'ci@example.com' },
                  payload: { version: '2.4.0', sha: '8f3b2a', regions: ['iad1', 'sfo1', 'fra1'] },
                },
                {
                  id: 'evt-2',
                  type: 'security',
                  status: 'warning',
                  title: 'Token rotation required for API key',
                  timestamp: '14 mins ago',
                  duration: '12ms',
                  traceId: 'trc_77b31c',
                  description: 'Secret key has exceeded 90-day recommended rotation window.',
                  actor: { name: 'Security Guard' },
                  payload: { keyId: 'key_prod_8819', ageDays: 92, action: 'notify' },
                },
                {
                  id: 'evt-3',
                  type: 'api',
                  status: 'success',
                  title: 'POST /v1/chat/completions 200 OK',
                  timestamp: '28 mins ago',
                  duration: '22ms',
                  traceId: 'trc_55e10a',
                  description: 'Streaming token generation handled with 0.12s first-byte latency.',
                  actor: { name: 'External Client' },
                  payload: { model: 'example-model', promptTokens: 140, completionTokens: 420 },
                },
              ];
  readonly smartUpload: UploadHandler = async (file, { signal, onProgress }) => {
    for (let i = 10; i <= 100; i += 10) {
      await wait(120, signal);
      onProgress(i);
    }
    if (file.name.includes("fail"))
      throw new Error("Demo upload rejected. Remove this file or retry.");
  };
  readonly confirm = () => wait(600);
  readonly action = () => wait(500);
  readonly upload: UploadHandler = async (file, { signal, onProgress }) => {
    for (let i = 10; i <= 100; i += 10) {
      await wait(120, signal);
      onProgress(i);
    }
    if (file.name.includes("fail"))
      throw new Error(
        "Demo upload rejected. Retry or choose a different file.",
      );
  };
  readonly send: SendHandler = async (payload, signal) => {
    await wait(1200, signal);
    if (payload.text.includes("fail")) throw new Error("Demo error");
  };
}

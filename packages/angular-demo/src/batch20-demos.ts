import { Component } from '@angular/core';
import { KitCursorFollowerComponent, KitLiquidRippleButtonComponent } from 'kit-ui-angular';

@Component({
  selector: 'kit-liquid-ripple-button-demo', standalone: true,
  imports: [KitLiquidRippleButtonComponent],
  styles: ':host{display:block}.k-liquid-demo{padding-block:48px;display:flex;align-items:center;justify-content:center;gap:12px}',
  template: '<div class="k-liquid-demo"><button kitLiquidRippleButton variant="secondary">Generate preview</button><button kitLiquidRippleButton variant="primary">Run sync</button></div>',
})
export class LiquidRippleButtonDemoComponent {}

@Component({
  selector: 'kit-cursor-follower-demo', standalone: true,
  imports: [KitCursorFollowerComponent],
  styles: `:host{display:block}.k-follower-demo{padding-block:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}.k-follower-stage{max-width:448px;width:100%;box-sizing:border-box;padding:32px;border-radius:calc(var(--radius-lg,14px)*1.8);background:var(--surface,#fff);border:1px solid var(--border,#ddd);text-align:center}.k-follower-stage>*+*{margin-top:12px}.k-follower-badge{display:inline-flex;align-items:center;gap:8px;padding:4px 12px;border-radius:9999px;background:var(--surface-raised,#eee);border:1px solid var(--border,#ddd);font:12px/16px var(--font-mono,monospace);color:var(--text-secondary,#666)}.k-follower-badge i{width:6px;height:6px;border-radius:50%;background:#34d399;animation:k-follower-pulse 2s cubic-bezier(.4,0,.6,1) infinite}.k-follower-stage h3{font-size:20px;line-height:28px;font-weight:600;color:var(--text-primary,#0a0a0a);margin-bottom:0}.k-follower-stage p{font-size:12px;line-height:19.5px;color:var(--text-muted,#777);margin-bottom:0}@keyframes k-follower-pulse{50%{opacity:.5}}`,
  template: '<div class="k-follower-demo"><kit-cursor-follower/><div class="k-follower-stage"><div class="k-follower-badge"><i></i><span>Spring Tracked (stiffness: 450, damping: 32)</span></div><h3>Interactive Follower Stage</h3><p>Move your pointer across this page to experience fluid spring-damped momentum and velocity scaling.</p></div></div>',
})
export class CursorFollowerDemoComponent {}

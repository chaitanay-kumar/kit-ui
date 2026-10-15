export interface ScrollVelocityOptions {
  expandDistance: number;
  intensity: number;
  minLetterSpacing: number;
  maxLetterSpacing: number;
  maxScale: number;
  fadeStart: number;
  smoothingMs: number;
  scrollContainerRef?: { current: HTMLElement | null };
}

/** Direct DOM motion with the same accumulated progress and effect lifecycle as React. */
export class ScrollVelocityMotion {
  private progress = 0;
  private targetProgress = 0;
  private lastY = 0;
  private lastTime = 0;
  private frame: number | undefined;
  private enabled = true;
  private cleanup: (() => void) | undefined;
  private options!: ScrollVelocityOptions;
  private readonly view: Window;

  constructor(private node: HTMLElement) {
    this.view = node.ownerDocument.defaultView!;
  }

  setNode(node: HTMLElement): void { this.node = node; }

  configure(options: ScrollVelocityOptions): void {
    options = {...options, expandDistance: Math.max(1, options.expandDistance),
      intensity: Math.max(0, options.intensity), smoothingMs: Math.max(20, options.smoothingMs)};
    const keys: (keyof ScrollVelocityOptions)[] = ['expandDistance', 'intensity',
      'minLetterSpacing', 'maxLetterSpacing', 'maxScale', 'fadeStart', 'smoothingMs', 'scrollContainerRef'];
    if (this.options && keys.every(key => Object.is(this.options[key], options[key]))) return;
    this.cleanup?.();
    this.options = options;
    const media = this.view.matchMedia('(prefers-reduced-motion: reduce)');
    this.enabled = !media.matches;
    const change = () => {
      this.enabled = !media.matches;
      if (!this.enabled) {
        this.progress = this.targetProgress = 0;
        this.apply(0);
        this.cancel();
      }
    };
    media.addEventListener('change', change);
    if (!this.enabled) {
      this.apply(0);
      // Source does not install a scroll listener when mounted with reduced motion.
      // Enabling motion later changes the flag; a dependency change installs listeners.
      this.cleanup = () => media.removeEventListener('change', change);
      return;
    }
    const target = options.scrollContainerRef?.current ?? this.view;
    const y = () => target === this.view
      ? this.view.scrollY || this.view.pageYOffset || 0
      : (target as HTMLElement).scrollTop;
    this.lastY = y();
    const scroll = () => {
      if (!this.enabled) return;
      const position = y();
      const delta = position - this.lastY;
      this.lastY = position;
      if (delta === 0) return;
      this.targetProgress = Math.min(1, Math.max(0, this.targetProgress +
        delta / Math.max(1, options.expandDistance) * Math.max(0, options.intensity)));
      if (target === this.view && position <= 0) this.targetProgress = 0;
      this.schedule();
    };
    const resize = () => { this.lastY = y(); };
    target.addEventListener('scroll', scroll, { passive: true });
    this.view.addEventListener('resize', resize, { passive: true });
    this.cleanup = () => {
      target.removeEventListener('scroll', scroll);
      this.view.removeEventListener('resize', resize);
      media.removeEventListener('change', change);
      this.cancel();
    };
  }

  private apply(progress: number): void {
    const {minLetterSpacing, maxLetterSpacing, maxScale, fadeStart} = this.options;
    const spacing = minLetterSpacing + progress * (maxLetterSpacing - minLetterSpacing);
    const scale = 1 + progress * (maxScale - 1);
    const opacity = fadeStart >= 1 || progress <= fadeStart ? 1
      : Math.max(0, 1 - (progress - fadeStart) / (1 - fadeStart));
    this.node.style.letterSpacing = `${spacing.toFixed(4)}em`;
    this.node.style.transform = scale !== 1
      ? `scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)` : '';
    this.node.style.opacity = opacity.toFixed(4);
  }

  private schedule(): void {
    if (this.frame !== undefined) return;
    this.lastTime = this.view.performance.now();
    const tick = (now: number) => {
      if (!this.enabled) { this.frame = undefined; return; }
      const dt = Math.min(0.064, (now - this.lastTime) / 1000);
      this.lastTime = now;
      const difference = this.targetProgress - this.progress;
      if (Math.abs(difference) > 0.0003) {
        const factor = 1 - Math.exp(-(1000 / Math.max(20, this.options.smoothingMs)) * 3.5 * dt);
        this.progress += difference * factor;
        this.apply(this.progress);
        this.frame = this.view.requestAnimationFrame(tick);
      } else {
        this.progress = this.targetProgress;
        this.apply(this.targetProgress);
        this.frame = undefined;
      }
    };
    this.frame = this.view.requestAnimationFrame(tick);
  }

  private cancel(): void {
    if (this.frame !== undefined) this.view.cancelAnimationFrame(this.frame);
    this.frame = undefined;
  }

  destroy(): void {
    this.cleanup?.();
    this.cleanup = undefined;
    this.cancel();
  }
}

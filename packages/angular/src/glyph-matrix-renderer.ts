export const DEFAULT_GLYPH_CHARSET =
  'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEF:・."=*+-<>¦｜XYZ';

interface ColumnStream {
  y: number;
  speed: number;
  length: number;
  chars: string[];
  headHighlight: boolean;
  nextMutationTime: number;
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (cleanHex.length >= 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}

export interface GlyphMatrixHandle{reset():void;togglePause():void}
export interface GlyphMatrixOptions{fontSize:number;color:string;headColor:string;backgroundColor:string;charset:string;speed:number;fadeRate:number;interactive:boolean;paused:boolean}
export class GlyphMatrixRenderer implements GlyphMatrixHandle{private streams:ColumnStream[]=[];private pointer={x:-1000,y:-1000,active:false};private paused=false;private visible=true;private frame:number|null=null;private options:GlyphMatrixOptions|undefined;private canvas:HTMLCanvasElement|undefined;private cleanup:(()=>void)|undefined;private destroyed=false;
 update(container:HTMLElement,canvas:HTMLCanvasElement,options:GlyphMatrixOptions):void{if(this.destroyed)return;const previous=this.options;if(!previous||previous.paused!==options.paused)this.paused=options.paused;this.canvas=canvas;this.options={...options};if(previous&&Object.keys(options).every(key=>previous[key as keyof GlyphMatrixOptions]===options[key as keyof GlyphMatrixOptions]))return;this.cleanup?.();this.cleanup=this.start(container,canvas,options)}
 private start(container:HTMLElement,canvas:HTMLCanvasElement,options:GlyphMatrixOptions):(()=>void)|undefined{const view=container.ownerDocument.defaultView;if(!view)return;const {fontSize,color,headColor,backgroundColor,charset,speed,fadeRate,interactive,paused}=options;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const reduceMotion =
        typeof view !== 'undefined' &&
        view.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      let width = 0;
      let height = 0;
      let columns = 0;
      let dpr = 1;

      const randomChar = () =>
        charset[Math.floor(Math.random() * charset.length)];

      const initStreams = () => {
        columns = Math.floor(width / fontSize);
        this.streams = Array.from({ length: columns }, () => {
          const length = Math.floor(Math.random() * 18 + 8);
          return {
            y: Math.random() * -100,
            speed: (Math.random() * 0.7 + 0.6) * speed,
            length,
            chars: Array.from({ length }, () => randomChar()),
            headHighlight: Math.random() > 0.15,
            nextMutationTime: 0,
          };
        });
      };

      const resize = () => {
        const rect = container.getBoundingClientRect();
        dpr = Math.min(view.devicePixelRatio || 1, 2);
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = `${fontSize}px "JetBrains Mono", "Courier New", monospace`;
        ctx.textBaseline = 'top';

        // Clear canvas with base background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        initStreams();
      };

      resize();

      let resizeObserver: ResizeObserver | undefined;
      if (typeof ResizeObserver === 'function') {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
      } else {
        view.addEventListener('resize', resize);
      }

      let intersectionObserver: IntersectionObserver | undefined;
      if (typeof IntersectionObserver === 'function') {
        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            const nextVisible = entry ? (entry.isIntersecting || entry.intersectionRatio > 0) : true;
            if (nextVisible !== this.visible) {
              this.visible = nextVisible;
              if (this.visible && !this.paused && !reduceMotion) {
                if (this.frame === null) {
                  this.frame = view.requestAnimationFrame(render);
                }
              } else if (!this.visible && this.frame !== null) {
                view.cancelAnimationFrame(this.frame);
                this.frame = null;
              }
            }
          },
          { rootMargin: '100px' }
        );
        intersectionObserver.observe(container);
      }

      const handlePointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        this.pointer = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      };

      const handlePointerLeave = () => {
        this.pointer.active = false;
      };

      if (interactive) {
        container.addEventListener('pointermove', handlePointerMove,true);
        container.addEventListener('pointerleave', handlePointerLeave,true);
      }

      // Reduced motion: draw static elegant glyph matrix
      if (reduceMotion) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        const numRows = Math.floor(height / fontSize);
        for (let c = 0; c < columns; c++) {
          for (let r = 0; r < numRows; r++) {
            if (Math.random() > 0.4) continue;
            const alpha = Math.random() * 0.4 + 0.05;
            ctx.fillStyle = hexToRgba(color, alpha);
            ctx.fillText(randomChar(), c * fontSize, r * fontSize);
          }
        }
        return () => {
          resizeObserver?.disconnect();
          intersectionObserver?.disconnect();
          view.removeEventListener('resize', resize);
          if (interactive) {
            container.removeEventListener('pointermove', handlePointerMove,true);
            container.removeEventListener('pointerleave', handlePointerLeave,true);
          }
        };
      }

      // Animation Loop
      let lastTime = view.performance.now();
      const fadeColor = hexToRgba(backgroundColor, fadeRate);

      const render = (now: number) => {
        if (this.paused || !this.visible || reduceMotion) {
          this.frame = null;
          return;
        }

        this.frame = view.requestAnimationFrame(render);

        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // Fading overlay creates glowing phosphor trails
        ctx.fillStyle = fadeColor;
        ctx.fillRect(0, 0, width, height);

        const pointer = this.pointer;
        const pointerCol = Math.floor(pointer.x / fontSize);
        const pointerRow = Math.floor(pointer.y / fontSize);

        for (let i = 0; i < this.streams.length; i++) {
          const stream = this.streams[i];
          const x = i * fontSize;

          // Pointer proximity disturbance: accelerates or excites column
          let effectiveSpeed = stream.speed;
          const isNearPointer =
            pointer.active && Math.abs(pointerCol - i) <= 2;

          if (isNearPointer) {
            effectiveSpeed = stream.speed * 2.2;
          }

          stream.y += effectiveSpeed * 22 * delta;

          // Mutate characters occasionally
          if (now > stream.nextMutationTime) {
            const mutIdx = Math.floor(Math.random() * stream.chars.length);
            stream.chars[mutIdx] = randomChar();
            stream.nextMutationTime = now + Math.random() * 120 + 40;
          }

          const headY = Math.floor(stream.y);

          // Draw the characters along this column's trail
          for (let j = 0; j < stream.length; j++) {
            const charY = headY - j;
            if (charY < 0 || charY * fontSize > height) continue;

            const char = stream.chars[j] || randomChar();
            const yPos = charY * fontSize;

            if (j === 0 && stream.headHighlight) {
              // Leading head character: bright white/accent with glow
              ctx.fillStyle = isNearPointer ? '#FFFFFF' : headColor;
              ctx.shadowColor = headColor;
              ctx.shadowBlur = 8;
              ctx.fillText(char, x, yPos);
              ctx.shadowBlur = 0;
            } else {
              // Trail characters: decaying opacity
              const progress = j / stream.length;
              let alpha = Math.max(0.08, 1 - progress);

              // Proximity brightness boost
              if (isNearPointer && Math.abs(pointerRow - charY) <= 3) {
                alpha = Math.min(1, alpha + 0.5);
              }

              ctx.fillStyle = hexToRgba(color, alpha);
              ctx.fillText(char, x, yPos);
            }
          }

          // When trail completely leaves bottom, reset column above view
          if ((headY - stream.length) * fontSize > height) {
            stream.y = Math.random() * -30;
            stream.speed = (Math.random() * 0.7 + 0.6) * speed;
            stream.length = Math.floor(Math.random() * 18 + 8);
            stream.chars = Array.from({ length: stream.length }, () =>
              randomChar()
            );
            stream.headHighlight = Math.random() > 0.15;
          }
        }
      };

      if (!paused && !reduceMotion && this.visible) {
        this.frame = view.requestAnimationFrame(render);
      }

      return () => {
        if (this.frame !== null) view.cancelAnimationFrame(this.frame);
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        view.removeEventListener('resize', resize);
        if (interactive) {
          container.removeEventListener('pointermove', handlePointerMove,true);
          container.removeEventListener('pointerleave', handlePointerLeave,true);
        }
      };

}
 reset():void{for(const stream of this.streams)stream.y=Math.random()*-50}
 togglePause():void{this.paused=!this.paused}
 destroy():void{this.destroyed=true;this.cleanup?.();this.cleanup=undefined;if(this.frame!==null)this.canvas?.ownerDocument.defaultView?.cancelAnimationFrame(this.frame);this.frame=null;this.canvas=undefined;this.options=undefined}
}

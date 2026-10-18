export type SparkleShape = "circle" | "star" | "cross" | "mixed";
export type SparkleDirection = "none" | "top" | "bottom" | "left" | "right";
export type SparkleCursorMode = "repulse" | "attract" | "sparkle" | "none";


interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  currentSize: number;
  color: string;
  opacity: number;
  minOpacity: number;
  maxOpacity: number;
  twinklePhase: number;
  twinkleFreq: number;
  shape: "circle" | "star" | "cross";
  isBurst?: boolean;
  life?: number;
  maxLife?: number;
}


export interface SparklesOptions{particleSize?:number;minSize:number;maxSize:number;speed:number;particleColor:string;particleColors?:string[];particleDensity:number;particleCount?:number;particleShape:SparkleShape;direction:SparkleDirection;twinkle:boolean;twinkleSpeed:number;interactive:boolean;cursorMode:SparkleCursorMode;cursorRadius:number;clickPush:number;opacity:number;paused:boolean}
export class SparklesRenderer{private particles:Particle[]=[];private mouse={x:-9999,y:-9999,active:false};private frame:number|null=null;private container:HTMLElement|undefined;private canvas:HTMLCanvasElement|undefined;private options:SparklesOptions|undefined;private reduced=false;private media:MediaQueryList|undefined;private resize:ResizeObserver|undefined;private intersection:IntersectionObserver|undefined;private destroyed=false;private readyOnce=false;constructor(private ready:()=>void){}
 private markReady():void{this.ready();if(!this.readyOnce){this.readyOnce=true;queueMicrotask(()=>{if(!this.destroyed)this.restart()})}}
 private preference=()=>{const next=this.media?.matches??false;if(next!==this.reduced){this.reduced=next;this.restart()}};
 update(container:HTMLElement,canvas:HTMLCanvasElement,options:SparklesOptions):void{if(this.destroyed)return;const initial=!this.canvas;this.container=container;this.canvas=canvas;this.options={...options};if(initial){this.media=container.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)');this.reduced=this.media?.matches??false;this.media?.addEventListener('change',this.preference)}this.restart()}
 private createParticle(w:number,h:number,isBurst=false,originX?:number,originY?:number):Particle{const {particleSize,minSize,maxSize,speed,particleColors,particleColor,direction,particleShape,twinkleSpeed}=this.options!;const resolvedMin=particleSize??minSize,resolvedMax=particleSize??maxSize,palette=particleColors&&particleColors.length>0?particleColors:[particleColor];
      const size = resolvedMin + Math.random() * (resolvedMax - resolvedMin);
      const color = palette[Math.floor(Math.random() * palette.length)];

      let vx = 0;
      let vy = 0;
      const baseVel = 0.4 * Math.max(0.1, speed);

      if (isBurst && originX !== undefined && originY !== undefined) {
        const angle = Math.random() * Math.PI * 2;
        const pushSpeed = (1 + Math.random() * 3) * baseVel;
        vx = Math.cos(angle) * pushSpeed;
        vy = Math.sin(angle) * pushSpeed;
      } else {
        switch (direction) {
          case "top":
            vx = (Math.random() - 0.5) * 0.2 * baseVel;
            vy = -(0.5 + Math.random() * 0.8) * baseVel;
            break;
          case "bottom":
            vx = (Math.random() - 0.5) * 0.2 * baseVel;
            vy = (0.5 + Math.random() * 0.8) * baseVel;
            break;
          case "left":
            vx = -(0.5 + Math.random() * 0.8) * baseVel;
            vy = (Math.random() - 0.5) * 0.2 * baseVel;
            break;
          case "right":
            vx = (0.5 + Math.random() * 0.8) * baseVel;
            vy = (Math.random() - 0.5) * 0.2 * baseVel;
            break;
          case "none":
          default:
            vx = (Math.random() - 0.5) * 0.5 * baseVel;
            vy = (Math.random() - 0.5) * 0.5 * baseVel;
            break;
        }
      }

      let shape: "circle" | "star" | "cross" = "circle";
      if (particleShape === "mixed") {
        const r = Math.random();
        shape = r < 0.6 ? "circle" : r < 0.85 ? "star" : "cross";
      } else {
        shape = particleShape;
      }

      const minOp = 0.1 + Math.random() * 0.3;
      const maxOp = 0.7 + Math.random() * 0.3;

      return {
        x: isBurst && originX !== undefined ? originX : Math.random() * w,
        y: isBurst && originY !== undefined ? originY : Math.random() * h,
        vx,
        vy,
        baseSize: size,
        currentSize: size,
        color,
        opacity: minOp + Math.random() * (maxOp - minOp),
        minOpacity: minOp,
        maxOpacity: maxOp,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleFreq: (0.02 + Math.random() * 0.05) * Math.max(0.2, twinkleSpeed),
        shape,
        isBurst,
        life: isBurst ? 0 : undefined,
        maxLife: isBurst ? 45 + Math.random() * 35 : undefined,
      };
}
  // Draw 4-pointed radiant star sparkle
  private drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number):void {
    ctx.beginPath();
    ctx.moveTo(x, y - r * 2);
    ctx.quadraticCurveTo(x, y, x + r * 2, y);
    ctx.quadraticCurveTo(x, y, x, y + r * 2);
    ctx.quadraticCurveTo(x, y, x - r * 2, y);
    ctx.quadraticCurveTo(x, y, x, y - r * 2);
    ctx.closePath();
    ctx.fill();
  }

  // Draw 4-pointed cross starlet
  private drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, r: number):void {
    ctx.beginPath();
    ctx.rect(x - r * 0.3, y - r * 1.6, r * 0.6, r * 3.2);
    ctx.rect(x - r * 1.6, y - r * 0.3, r * 3.2, r * 0.6);
    ctx.fill();
  }

private stop():void{this.resize?.disconnect();this.intersection?.disconnect();if(this.frame!==null)this.container?.ownerDocument.defaultView?.cancelAnimationFrame(this.frame);this.frame=null}
 private restart():void{this.stop();const container=this.container,canvas=this.canvas,view=container?.ownerDocument.defaultView;if(!container||!canvas||!view||!this.options||this.destroyed)return;const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;const {particleCount,particleDensity,interactive,cursorRadius,cursorMode,twinkle,opacity,paused}=this.options,reducedMotion=this.reduced;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const initParticles = (w: number, h: number) => {
      width = w;
      height = h;
      dpr = Math.min(view.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const computedCount =
        particleCount !== undefined
          ? particleCount
          : Math.max(12, Math.floor((w * h) / (400 * 400) * particleDensity));

      this.particles = Array.from({ length: computedCount }, () =>
        this.createParticle(w,h)
      );

      this.markReady();
    };

    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      initParticles(rect.width, rect.height);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          initParticles(nw, nh);
        }
      }
    });
    observer.observe(container);

    const render = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const mx = this.mouse.x;
      const my = this.mouse.y;
      const mActive = this.mouse.active && interactive && !reducedMotion;

      this.particles = this.particles.filter((p) => {
        if (p.isBurst && p.life !== undefined && p.maxLife !== undefined) {
          p.life++;
          if (p.life >= p.maxLife) return false;
        }
        return true;
      });

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Twinkle pulsation
          if (twinkle) {
            p.twinklePhase += p.twinkleFreq;
            const sine = (Math.sin(p.twinklePhase) + 1) / 2;
            p.opacity = p.minOpacity + sine * (p.maxOpacity - p.minOpacity);
          }

          // Cursor Interaction
          if (mActive) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.hypot(dx, dy);

            if (dist < cursorRadius && dist > 0.001) {
              const force = (1 - dist / cursorRadius) * 2;
              const angle = Math.atan2(dy, dx);

              if (cursorMode === "repulse") {
                p.x += Math.cos(angle) * force * 1.8;
                p.y += Math.sin(angle) * force * 1.8;
              } else if (cursorMode === "attract") {
                p.x -= Math.cos(angle) * force * 1.2;
                p.y -= Math.sin(angle) * force * 1.2;
              } else if (cursorMode === "sparkle") {
                p.opacity = Math.min(1, p.opacity + 0.3);
                p.currentSize = p.baseSize * 1.6;
              }
            } else {
              p.currentSize = p.baseSize;
            }
          }

          // Wrap around boundary bounds
          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;

          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;
        }

        // Draw particle
        let alpha = p.opacity;
        if (p.isBurst && p.life !== undefined && p.maxLife !== undefined) {
          alpha *= 1 - p.life / p.maxLife;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * opacity));

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.currentSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          this.drawStar(ctx, p.x, p.y, p.currentSize * 1.2);
        } else if (p.shape === "cross") {
          this.drawCross(ctx, p.x, p.y, p.currentSize * 1.2);
        }
      }

      ctx.globalAlpha = 1;

      if (!isIntersecting || paused || reducedMotion) {
        this.frame = null;
        return;
      }

      this.frame = view.requestAnimationFrame(render);
    };

let isIntersecting=true;if(typeof IntersectionObserver==='function'){this.intersection=new IntersectionObserver(([entry])=>{const visible=entry?(entry.isIntersecting||entry.intersectionRatio>0):true;if(visible!==isIntersecting){isIntersecting=visible;if(isIntersecting&&!paused&&!reducedMotion){if(!this.frame)this.frame=view.requestAnimationFrame(render)}else if(!isIntersecting&&this.frame){view.cancelAnimationFrame(this.frame);this.frame=null}}},{rootMargin:'100px 0px'});this.intersection.observe(container)}this.resize=observer;render()}
 move(event:PointerEvent):void{if(!this.options?.interactive||event.pointerType==='touch')return;const rect=this.container?.getBoundingClientRect();if(rect)this.mouse={x:event.clientX-rect.left,y:event.clientY-rect.top,active:true}}leave():void{this.mouse.active=false}click(event:MouseEvent):void{const options=this.options;if(!options?.interactive||options.clickPush<=0)return;const rect=this.container?.getBoundingClientRect();if(!rect)return;this.particles.push(...Array.from({length:options.clickPush},()=>this.createParticle(rect.width,rect.height,true,event.clientX-rect.left,event.clientY-rect.top)))}
 destroy():void{this.destroyed=true;this.stop();this.media?.removeEventListener('change',this.preference);this.container=undefined;this.canvas=undefined;this.options=undefined}
}

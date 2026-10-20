/** Native canvas operations preserve the authored React drift engine. */
interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  opacity: number;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  isDriftTireSmoke?: boolean;
}
interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  width: number;
}
interface SpeedLine {
  x: number;
  y: number;
  length: number;
  vx: number;
  opacity: number;
  width: number;
}
export interface CarSmokeEngineOptions{theme:'light'|'dark';direction:'left-to-right'|'right-to-left';carSize:'sm'|'md'|'lg';verticalPosition:'center'|'bottom'|'top'|number;smokeDensity:'off'|'low'|'medium'|'high';smokeLifetime:number;showSpeedLines:boolean}
export interface CarSmokePose{x:number;y:number;angle:number}
export function carSmokeDimensions(size:'sm'|'md'|'lg'='md',viewportWidth=1200):{width:number;height:number;scale:number}{const base=size==='sm'?180:size==='lg'?420:310,scale=viewportWidth<640?.55:viewportWidth<1024?.8:1;return{width:base*scale,height:base*scale*(100/300),scale}}
/** Frame scheduling and destruction belong to the consuming native controller. */
export class CarSmokeCanvasEngine{
 private smoke:SmokeParticle[]=[];private skids:SkidMark[]=[];private lines:SpeedLine[]=[];private lastWheel:{x:number;y:number}|null=null;
 constructor(private canvas:()=>HTMLCanvasElement|null,private options:()=>CarSmokeEngineOptions,private pose:()=>CarSmokePose,private running:()=>boolean,private viewportWidth:()=>number,private random:()=>number=Math.random){}
 clear():void{this.smoke=[];this.skids=[];this.lines=[];this.lastWheel=null}
 frame():void{const {theme,direction,carSize,verticalPosition,smokeDensity,smokeLifetime,showSpeedLines}=this.options(),pose=this.pose();const densityMultiplier=smokeDensity==='off'?0:smokeDensity==='low'?2:smokeDensity==='high'?6:4;
    const canvas = this.canvas();
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const isDark = theme === 'dark';
    const isLtr = direction === 'left-to-right';
    const dirFactor = isLtr ? 1 : -1;
    const { scale } = carSmokeDimensions(carSize,this.viewportWidth());

    let carY = height / 2;
    if (verticalPosition === 'top') carY = height * 0.3;
    else if (verticalPosition === 'bottom') carY = height * 0.72;
    else if (typeof verticalPosition === 'number') carY = (height * verticalPosition) / 100;

    const currentCarX = pose.x;
    const currentYOffset = pose.y;
    const currentCarAngle = pose.angle;

    // 1. Calculate realistic tire contact positions with ground
    const rearWheelLocalX = isLtr ? 81 : 279;
    const rearWheelLocalY = 82;
    const effectiveCarY = carY + currentYOffset;

    // Apply rotation transformation to calculate exact global position of rear drift tire
    const carCenterX = currentCarX + (180 * scale);
    const carCenterY = effectiveCarY + (60 * scale);
    const rad = (currentCarAngle * Math.PI) / 180;
    const cosAngle = Math.cos(rad);
    const sinAngle = Math.sin(rad);

    const relX = (rearWheelLocalX - 150) * scale;
    const relY = (rearWheelLocalY - 50) * scale;
    const rearWheelWorldX = carCenterX + (relX * cosAngle - relY * sinAngle);
    const rearWheelWorldY = carCenterY + (relX * sinAngle + relY * cosAngle);

    // 2. Asphalt Rubber Skid Marks while drifting (when drift angle is prominent)
    const isDrifting = Math.abs(currentCarAngle) > 1.2;
    if (this.running() && isDrifting) {
      if (this.lastWheel) {
        this.skids.push({
          x1: this.lastWheel.x,
          y1: this.lastWheel.y,
          x2: rearWheelWorldX,
          y2: rearWheelWorldY,
          opacity: 0.55,
          width: 5 * scale,
        });
      }
      this.lastWheel = { x: rearWheelWorldX, y: rearWheelWorldY };
    } else {
      this.lastWheel = null;
    }

    // 3. Draw Rubber Skid Marks
    for (let i = this.skids.length - 1; i >= 0; i--) {
      const s = this.skids[i];
      s.opacity -= 0.006;
      if (s.opacity <= 0) {
        this.skids.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = isDark
        ? `rgba(10, 10, 15, ${s.opacity * 0.9})`
        : `rgba(20, 20, 25, ${s.opacity * 0.7})`;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Spawn Heavy Drift Smoke Plumes & Exhaust Sparks
    if (this.running() && densityMultiplier > 0) {
      const driftMultiplier = isDrifting ? 1.8 : 1;
      const countToSpawn = Math.min(
        Math.round(densityMultiplier * driftMultiplier),
        160 - this.smoke.length
      );

      for (let i = 0; i < countToSpawn; i++) {
        const pSize = (10 + this.random() * 18) * scale;
        const pLife = smokeLifetime * (0.8 + this.random() * 0.5);
        const smokeVelX = -dirFactor * (3.5 + this.random() * 5.5) * scale;
        const smokeVelY = (-1.2 + (this.random() * 2.4 - 1.2)) * scale;

        this.smoke.push({
          x: rearWheelWorldX + (this.random() * 14 - 7) * scale,
          y: rearWheelWorldY + (this.random() * 10 - 5) * scale,
          vx: smokeVelX,
          vy: smokeVelY,
          size: pSize,
          maxSize: pSize * (3.2 + this.random() * 2.0),
          opacity: 0.75 + this.random() * 0.25,
          rotation: this.random() * Math.PI * 2,
          vRot: this.random() * 0.05 - 0.025,
          life: pLife,
          maxLife: pLife,
          isDriftTireSmoke: isDrifting,
        });
      }
    }

    // 5. Spawn High-Velocity Speed Streaks
    if (this.running() && showSpeedLines && densityMultiplier > 0 && this.lines.length < 14) {
      const lineSpawnX = currentCarX - (isLtr ? 50 : -50) * scale;
      for (let i = 0; i < 2; i++) {
        const offsetMultiplier = this.random() * 70 - 35;
        this.lines.push({
          x: lineSpawnX,
          y: effectiveCarY + offsetMultiplier * scale,
          length: (40 + this.random() * 80) * scale,
          vx: -dirFactor * (14 + this.random() * 10) * scale,
          opacity: 0.65 + this.random() * 0.35,
          width: (1.2 + this.random() * 1.8) * scale,
        });
      }
    }

    // 6. Draw Speed Lines
    for (let i = this.lines.length - 1; i >= 0; i--) {
      const l = this.lines[i];
      l.x += l.vx;
      l.opacity -= 0.022;

      if (l.opacity <= 0) {
        this.lines.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      const strokeGradient = ctx.createLinearGradient(
        l.x,
        l.y,
        l.x + (isLtr ? -l.length : l.length),
        l.y
      );
      const strokeColor = isDark
        ? `rgba(255, 255, 255, ${l.opacity})`
        : `rgba(225, 29, 72, ${l.opacity * 0.7})`;
      strokeGradient.addColorStop(0, strokeColor);
      strokeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = strokeGradient;
      ctx.lineWidth = l.width;
      ctx.lineCap = 'round';
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x + (isLtr ? -l.length : l.length), l.y);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Draw Soft Billowing Smoke Plumes
    for (let i = this.smoke.length - 1; i >= 0; i--) {
      const p = this.smoke[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.life -= 16.67;

      const progress = 1 - Math.max(0, p.life / p.maxLife);
      const currentSize = p.size + (p.maxSize - p.size) * progress;
      const currentOpacity = p.opacity * (1 - Math.pow(progress, 1.8));

      if (p.life <= 0 || currentOpacity <= 0.01) {
        this.smoke.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Multi-layer radial smoke gradient with authentic tire friction texture
      const grad = ctx.createRadialGradient(0, 0, currentSize * 0.08, 0, 0, currentSize);
      if (isDark) {
        grad.addColorStop(0, `rgba(245, 245, 255, ${currentOpacity * 0.85})`);
        grad.addColorStop(0.35, `rgba(200, 205, 220, ${currentOpacity * 0.5})`);
        grad.addColorStop(0.7, `rgba(140, 145, 165, ${currentOpacity * 0.2})`);
        grad.addColorStop(1, 'rgba(100, 105, 125, 0)');
      } else {
        grad.addColorStop(0, `rgba(50, 50, 65, ${currentOpacity * 0.75})`);
        grad.addColorStop(0.4, `rgba(90, 95, 110, ${currentOpacity * 0.4})`);
        grad.addColorStop(1, 'rgba(160, 165, 180, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

 }
}

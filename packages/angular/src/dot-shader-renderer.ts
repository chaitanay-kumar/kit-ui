interface ParsedColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColorToRgba(colorStr: string): ParsedColor {
  if (typeof document === 'undefined') {
    return { r: 255, g: 255, b: 255, a: 0.2 };
  }
  // Use temporary canvas context to parse any CSS color format (hex, rgb, rgba, hsl)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { r: 255, g: 255, b: 255, a: 0.2 };

  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = colorStr;
  ctx.fillRect(0, 0, 1, 1);

  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: a / 255,
  };
}

// GLSL Vertex Shader for Point Grid
const VERTEX_SHADER_SRC = `
precision highp float;

attribute vec2 a_position;
attribute vec2 a_grid_pos;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_cursor_radius;
uniform float u_distortion;
uniform float u_max_scale;
uniform float u_wave_intensity;
uniform float u_base_dot_size;
uniform float u_interactive;
uniform float u_dpr;

varying float v_proximity;
varying vec2 v_center_dist;

void main() {
    vec2 pos = a_position;

    // Ambient undulating wave
    float wave = sin(a_grid_pos.x * 0.15 + a_grid_pos.y * 0.15 + u_time * 1.5) * 4.0 * u_wave_intensity;
    pos.y += wave;

    // Cursor proximity & magnetic repulsion
    float dist = distance(pos, u_mouse);
    float normDist = clamp(dist / max(u_cursor_radius, 1.0), 0.0, 1.0);
    float prox = (1.0 - smoothstep(0.0, 1.0, normDist)) * u_interactive;

    // Repulsion along radial vector
    vec2 dir = pos - u_mouse;
    float dirLen = length(dir);
    if (dirLen > 0.001) {
        dir = dir / dirLen;
    } else {
        dir = vec2(0.0, 0.0);
    }
    pos += dir * (prox * 24.0 * u_distortion);

    v_proximity = prox;

    // Point size expansion at cursor center
    float scale = 1.0 + prox * (u_max_scale - 1.0);
    gl_PointSize = u_base_dot_size * 2.0 * scale * u_dpr;

    // Convert pixels to clip space [-1, 1]
    vec2 zeroToOne = pos / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
}
`;

// GLSL Fragment Shader: Crisp antialiased circle with smooth color interpolation
const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec4 u_dot_color;
uniform vec4 u_accent_color;

varying float v_proximity;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) {
        discard;
    }

    // Soft antialiased border
    float alpha = smoothstep(0.5, 0.38, dist);

    // Color transition from base dot color to illuminated accent
    vec4 finalColor = mix(u_dot_color, u_accent_color, v_proximity);
    gl_FragColor = vec4(finalColor.rgb, finalColor.a * alpha);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string, owned: Set<WebGLShader>): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  owned.add(shader);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    owned.delete(shader);
    return null;
  }
  return shader;
}

export interface DotShaderOptions{dotColor:string;accentColor:string;dotSize:number;spacing:number;cursorRadius:number;distortionStrength:number;maxScale:number;waveIntensity:number;speed:number;interactive:boolean;paused:boolean}
export class DotShaderRenderer{private target={x:-9999,y:-9999};private current={x:-9999,y:-9999};private hovered=false;private options:DotShaderOptions|undefined;private container:HTMLElement|undefined;private canvas:HTMLCanvasElement|undefined;private media:MediaQueryList|undefined;private reduced=false;private destroyed=false;private cleanup:(()=>void)|undefined;private preference=()=>{const value=this.media?.matches??false;if(value!==this.reduced){this.reduced=value;this.restart()}};
 update(container:HTMLElement,canvas:HTMLCanvasElement,options:DotShaderOptions):void{if(this.destroyed)return;const previous=this.options;this.container=container;this.canvas=canvas;this.options={...options};if(!previous){this.media=container.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)');this.reduced=this.media?.matches??false;this.media?.addEventListener('change',this.preference)}if(!previous||Object.keys(options).some(key=>previous[key as keyof DotShaderOptions]!==options[key as keyof DotShaderOptions]))this.restart()}
 private restart():void{this.cleanup?.();this.cleanup=undefined;const container=this.container,canvas=this.canvas,view=container?.ownerDocument.defaultView;if(!container||!canvas||!view||!this.options||this.destroyed)return;try{this.cleanup=this.start(container,canvas,view,this.options)}catch(error){this.cleanup?.();this.cleanup=undefined;throw error}}
 private start(container:HTMLElement,canvas:HTMLCanvasElement,view:Window,options:DotShaderOptions):()=>void{const {dotColor,accentColor,dotSize,spacing,cursorRadius,distortionStrength,maxScale,waveIntensity,speed,interactive,paused}=options,reducedMotion=this.reduced;
    let animFrameId=0;
    let gl: WebGLRenderingContext | null = null;

    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      gl = null;
    }

    const ownedGl=gl,ownedShaders=new Set<WebGLShader>();
    const safeSpacing = Math.max(10, spacing);
    const safeDotSize = Math.max(0.5, dotSize);
    const safeCursorRadius = Math.max(40, cursorRadius);

    const baseColorParsed = parseColorToRgba(dotColor);
    const accentColorParsed = parseColorToRgba(accentColor);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let vertexCount = 0;
    let positionBuffer: WebGLBuffer | null = null;
    let gridPosBuffer: WebGLBuffer | null = null;
    let program: WebGLProgram | null = null;

    // Uniform locations
    let uResolutionLoc: WebGLUniformLocation | null = null;
    let uMouseLoc: WebGLUniformLocation | null = null;
    let uTimeLoc: WebGLUniformLocation | null = null;
    let uCursorRadiusLoc: WebGLUniformLocation | null = null;
    let uDistortionLoc: WebGLUniformLocation | null = null;
    let uMaxScaleLoc: WebGLUniformLocation | null = null;
    let uWaveIntensityLoc: WebGLUniformLocation | null = null;
    let uBaseDotSizeLoc: WebGLUniformLocation | null = null;
    let uInteractiveLoc: WebGLUniformLocation | null = null;
    let uDprLoc: WebGLUniformLocation | null = null;
    let uDotColorLoc: WebGLUniformLocation | null = null;
    let uAccentColorLoc: WebGLUniformLocation | null = null;

    let aPositionLoc = -1;
    let aGridPosLoc = -1;

    let resizeObserver:ResizeObserver|undefined,intersectionObserver:IntersectionObserver|undefined;
    const cleanup=()=>{resizeObserver?.disconnect();intersectionObserver?.disconnect();if(animFrameId)view.cancelAnimationFrame(animFrameId);if(ownedGl){if(positionBuffer)ownedGl.deleteBuffer(positionBuffer);if(gridPosBuffer)ownedGl.deleteBuffer(gridPosBuffer);if(program)ownedGl.deleteProgram(program);for(const shader of ownedShaders)ownedGl.deleteShader(shader);ownedShaders.clear()}};this.cleanup=cleanup;
    // WebGL Initialization
    if (gl) {
      const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC,ownedShaders);
      const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC,ownedShaders);

      if (vertShader && fragShader) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vertShader);
          gl.attachShader(program, fragShader);
          gl.linkProgram(program);

          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);

            aPositionLoc = gl.getAttribLocation(program, 'a_position');
            aGridPosLoc = gl.getAttribLocation(program, 'a_grid_pos');

            uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
            uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
            uTimeLoc = gl.getUniformLocation(program, 'u_time');
            uCursorRadiusLoc = gl.getUniformLocation(program, 'u_cursor_radius');
            uDistortionLoc = gl.getUniformLocation(program, 'u_distortion');
            uMaxScaleLoc = gl.getUniformLocation(program, 'u_max_scale');
            uWaveIntensityLoc = gl.getUniformLocation(program, 'u_wave_intensity');
            uBaseDotSizeLoc = gl.getUniformLocation(program, 'u_base_dot_size');
            uInteractiveLoc = gl.getUniformLocation(program, 'u_interactive');
            uDprLoc = gl.getUniformLocation(program, 'u_dpr');
            uDotColorLoc = gl.getUniformLocation(program, 'u_dot_color');
            uAccentColorLoc = gl.getUniformLocation(program, 'u_accent_color');

            positionBuffer = gl.createBuffer();
            gridPosBuffer = gl.createBuffer();
          } else {
            gl = null; // fallback to 2D
          }
        }
      } else {
        gl = null;
      }
    }

    // Grid Buffer Setup
    const setupGridBuffers = (w: number, h: number) => {
      width = w;
      height = h;
      dpr = Math.min(view.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const cols = Math.ceil(w / safeSpacing) + 2;
      const rows = Math.ceil(h / safeSpacing) + 2;
      vertexCount = cols * rows;

      const positions = new Float32Array(vertexCount * 2);
      const gridPositions = new Float32Array(vertexCount * 2);

      const offsetX = (w % safeSpacing) / 2 - safeSpacing / 2;
      const offsetY = (h % safeSpacing) / 2 - safeSpacing / 2;

      let idx = 0;
      for (let r = 0; r < rows; r++) {
        const y = offsetY + r * safeSpacing;
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * safeSpacing;
          positions[idx * 2] = x;
          positions[idx * 2 + 1] = y;

          gridPositions[idx * 2] = c;
          gridPositions[idx * 2 + 1] = r;
          idx++;
        }
      }

      if (gl && positionBuffer && gridPosBuffer) {
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, gridPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, gridPositions, gl.STATIC_DRAW);
      }
    };

    // Initial sizing
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setupGridBuffers(rect.width, rect.height);
    }

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          setupGridBuffers(nw, nh);
        }
      }
    });
    resizeObserver.observe(container);

    let startTime = view.performance.now();
    let lastTime = startTime;

    // Render Loop
    const render = (now: number = view.performance.now()) => {
      const dt = Math.min(0.064, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = (now - startTime) * 0.001 * speed;

      // Mouse position smoothing with exponential damp
      const lerpFactor = 1 - Math.exp(-14 * dt);
      this.current.x += (this.target.x - this.current.x) * lerpFactor;
      this.current.y += (this.target.y - this.current.y) * lerpFactor;

      if (gl && program && positionBuffer && gridPosBuffer) {
        // --- WebGL Shader Draw Path ---
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(program);

        gl.uniform2f(uResolutionLoc, width, height);
        gl.uniform2f(uMouseLoc, this.current.x, this.current.y);
        gl.uniform1f(uTimeLoc, reducedMotion ? 0 : elapsed);
        gl.uniform1f(uCursorRadiusLoc, safeCursorRadius);
        gl.uniform1f(uDistortionLoc, distortionStrength);
        gl.uniform1f(uMaxScaleLoc, maxScale);
        gl.uniform1f(uWaveIntensityLoc, reducedMotion ? 0 : waveIntensity);
        gl.uniform1f(uBaseDotSizeLoc, safeDotSize);
        gl.uniform1f(uInteractiveLoc, interactive && !reducedMotion ? 1 : 0);
        gl.uniform1f(uDprLoc, dpr);

        gl.uniform4f(
          uDotColorLoc,
          baseColorParsed.r,
          baseColorParsed.g,
          baseColorParsed.b,
          baseColorParsed.a
        );
        gl.uniform4f(
          uAccentColorLoc,
          accentColorParsed.r,
          accentColorParsed.g,
          accentColorParsed.b,
          accentColorParsed.a
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(aPositionLoc);
        gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, gridPosBuffer);
        gl.enableVertexAttribArray(aGridPosLoc);
        gl.vertexAttribPointer(aGridPosLoc, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, vertexCount);
      } else {
        // --- Canvas 2D Fallback Path ---
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, width, height);

          const cols = Math.ceil(width / safeSpacing) + 2;
          const rows = Math.ceil(height / safeSpacing) + 2;
          const offsetX = (width % safeSpacing) / 2 - safeSpacing / 2;
          const offsetY = (height % safeSpacing) / 2 - safeSpacing / 2;

          const mx = this.current.x;
          const my = this.current.y;

          for (let r = 0; r < rows; r++) {
            const baseY = offsetY + r * safeSpacing;
            for (let c = 0; c < cols; c++) {
              const baseX = offsetX + c * safeSpacing;

              let x = baseX;
              let y = baseY;

              if (!reducedMotion) {
                const wave = Math.sin(c * 0.15 + r * 0.15 + elapsed * 1.5) * 4.0 * waveIntensity;
                y += wave;
              }

              const dist = Math.hypot(x - mx, y - my);
              let prox = 0;
              if (interactive && !reducedMotion && dist < safeCursorRadius) {
                prox = 1 - dist / safeCursorRadius;
                const angle = Math.atan2(y - my, x - mx);
                x += Math.cos(angle) * (prox * 24.0 * distortionStrength);
                y += Math.sin(angle) * (prox * 24.0 * distortionStrength);
              }

              const scale = 1.0 + prox * (maxScale - 1.0);
              const radius = safeDotSize * scale;

              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);

              if (prox > 0.01) {
                ctx.fillStyle = accentColor;
                ctx.globalAlpha = baseColorParsed.a + prox * (accentColorParsed.a - baseColorParsed.a);
              } else {
                ctx.fillStyle = dotColor;
                ctx.globalAlpha = baseColorParsed.a;
              }
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;
        }
      }

      if (!isIntersecting || paused || reducedMotion) {
        animFrameId = 0;
        return;
      }

      animFrameId = view.requestAnimationFrame(render);
    };

    let isIntersecting = true;

    if (typeof IntersectionObserver === 'function') {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          const visible = entry ? (entry.isIntersecting || entry.intersectionRatio > 0) : true;
          if (visible !== isIntersecting) {
            isIntersecting = visible;
            if (isIntersecting && !paused && !reducedMotion) {
              if (!animFrameId) {
                animFrameId = view.requestAnimationFrame(render);
              }
            } else if (!isIntersecting && animFrameId) {
              view.cancelAnimationFrame(animFrameId);
              animFrameId = 0;
            }
          }
        },
        { rootMargin: '100px 0px' }
      );
      intersectionObserver.observe(container);
    }

    // Initial render pass
    render(view.performance.now());

    return cleanup;

}
 move(event:PointerEvent):void{if(!this.options?.interactive||this.reduced)return;const rect=this.container?.getBoundingClientRect();if(rect){this.target={x:event.clientX-rect.left,y:event.clientY-rect.top};this.hovered=true}}leave():void{if(!this.options?.interactive)return;this.hovered=false;this.target={x:-9999,y:-9999}}
 destroy():void{this.destroyed=true;this.cleanup?.();this.cleanup=undefined;this.media?.removeEventListener('change',this.preference);this.container=undefined;this.canvas=undefined;this.options=undefined}
}

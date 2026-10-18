export const glyphMatrixPort={
  "description": "Native digital glyph rain with source streams, trail fading, pointer disturbance, reduced-motion static rendering and imperative reset/pause controls.",
  "hostMetadata": "{style:'display:contents'}",
  "stylesFile": "./glyph-matrix.css",
  "imports": "import {afterRenderEffect,ErrorHandler} from '@angular/core';import {GlyphMatrixRenderer,DEFAULT_GLYPH_CHARSET} from './glyph-matrix-renderer';import {NativeRootBindings,type NativeStyle,type NativeAttributes} from './native-root-bindings';import {invokeNativeEventCallback} from './native-event-callback';export type {GlyphMatrixHandle} from './glyph-matrix-renderer';export type {NativeStyle as GlyphMatrixStyle,NativeAttributes as GlyphMatrixAttributes} from './native-root-bindings';",
  "template": "<div #root [class]=\"'k-glyph-matrix '+className()\" (click)=\"click($event)\" (pointermove)=\"pointer($event)\" (pointerleave)=\"leave($event)\" (keydown)=\"key($event)\"><canvas #canvas aria-hidden=\"true\"></canvas><div class=\"k-glyph-content\"><ng-content/></div></div>",
  "body": "readonly fontSize=input<number,number|undefined>(16,{transform:v=>v===undefined?16:v});readonly color=input<string,string|undefined>('#00FF66',{transform:v=>v===undefined?'#00FF66':v});readonly headColor=input<string,string|undefined>('#FFFFFF',{transform:v=>v===undefined?'#FFFFFF':v});readonly backgroundColor=input<string,string|undefined>('#050505',{transform:v=>v===undefined?'#050505':v});readonly charset=input<string,string|undefined>(DEFAULT_GLYPH_CHARSET,{transform:v=>v===undefined?DEFAULT_GLYPH_CHARSET:v});readonly speed=input<number,number|undefined>(1,{transform:v=>v===undefined?1:v});readonly fadeRate=input<number,number|undefined>(.06,{transform:v=>v===undefined?.06:v});readonly interactive=input<boolean,boolean|undefined>(true,{transform:v=>v===undefined?true:v});readonly paused=input<boolean,boolean|undefined>(false,{transform:v=>v===undefined?false:v});readonly opacity=input<number,number|undefined>(1,{transform:v=>v===undefined?1:v});readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});readonly fullPage=input<boolean|undefined>();readonly styles=input<NativeStyle|undefined>(undefined,{alias:'style'});readonly attributes=input<NativeAttributes|undefined>();readonly onClick=input<((event:MouseEvent)=>void)|undefined>();readonly onPointerMove=input<((event:PointerEvent)=>void)|undefined>();readonly onPointerLeave=input<((event:PointerEvent)=>void)|undefined>();readonly onKeyDown=input<((event:KeyboardEvent)=>void)|undefined>();readonly root=viewChild<ElementRef<HTMLElement>>('root');readonly canvas=viewChild<ElementRef<HTMLCanvasElement>>('canvas');private readonly renderer=new GlyphMatrixRenderer();private bindings:NativeRootBindings|undefined;private readonly errors=inject(ErrorHandler);reset():void{this.renderer.reset()}togglePause():void{this.renderer.togglePause()}click(event:MouseEvent):void{invokeNativeEventCallback(this.onClick(),event,this.errors)}pointer(event:PointerEvent):void{invokeNativeEventCallback(this.onPointerMove(),event,this.errors)}leave(event:PointerEvent):void{invokeNativeEventCallback(this.onPointerLeave(),event,this.errors)}key(event:KeyboardEvent):void{invokeNativeEventCallback(this.onKeyDown(),event,this.errors)}constructor(){afterRenderEffect(()=>{const root=this.root()?.nativeElement,styles=this.styles(),attributes=this.attributes(),opacity=this.opacity();if(root){this.bindings??=new NativeRootBindings(root);this.bindings.apply({opacity,...styles},attributes,{})}});afterRenderEffect(()=>{const root=this.root()?.nativeElement,canvas=this.canvas()?.nativeElement,options={fontSize:this.fontSize(),color:this.color(),headColor:this.headColor(),backgroundColor:this.backgroundColor(),charset:this.charset(),speed:this.speed(),fadeRate:this.fadeRate(),interactive:this.interactive(),paused:this.paused()};if(root&&canvas)untracked(()=>this.renderer.update(root,canvas,options))});inject(DestroyRef).onDestroy(()=>this.renderer.destroy())}",
  "inputs": [
    "fontSize: number",
    "color: string",
    "headColor: string",
    "backgroundColor: string",
    "charset: string",
    "speed: number",
    "fadeRate: number",
    "interactive: boolean",
    "paused: boolean",
    "opacity: number",
    "className: string",
    "fullPage: boolean",
    "style: GlyphMatrixStyle",
    "attributes: GlyphMatrixAttributes",
    "onClick: (event: MouseEvent) => void",
    "onPointerMove: (event: PointerEvent) => void",
    "onPointerLeave: (event: PointerEvent) => void",
    "onKeyDown: (event: KeyboardEvent) => void"
  ],
  "outputs": []
};

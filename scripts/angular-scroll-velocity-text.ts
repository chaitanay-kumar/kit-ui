export const scrollVelocityTextPort = {
  description: 'Continuous readable kinetic text with accumulated directional scroll, exponential damping, idle hold and source reduced-motion lifecycle.',
  template: '',
  componentSelector: 'kit-scrollvelocitytext,[kitScrollVelocityText]',
  hostMetadata: `{'[style.display]':'native ? null : "contents"'}`,
  stylesFile: './scroll-velocity-text.css',
  imports: `import type {SimpleChanges} from '@angular/core';import {NgZone} from '@angular/core';import {ScrollVelocityMotion} from './scroll-velocity-motion';export type ScrollVelocityStyle=Record<string,string|number|undefined>;export interface ScrollVelocityContainerRef{current:HTMLElement|null}`,
  body: `readonly text=input.required<string>();
readonly as=input<string,string|undefined>('span',{transform:v=>v===undefined?'span':v});
readonly className=input<string,string|undefined>('',{transform:v=>v===undefined?'':v});
readonly expandDistance=input<number,number|undefined>(500,{transform:v=>v===undefined?500:v});
readonly intensity=input<number,number|undefined>(1,{transform:v=>v===undefined?1:v});
readonly minLetterSpacing=input<number,number|undefined>(0,{transform:v=>v===undefined?0:v});
readonly maxLetterSpacing=input<number,number|undefined>(1,{transform:v=>v===undefined?1:v});
readonly maxScale=input<number,number|undefined>(1.6,{transform:v=>v===undefined?1.6:v});
readonly fadeStart=input<number,number|undefined>(.4,{transform:v=>v===undefined?.4:v});
readonly smoothingMs=input<number,number|undefined>(400,{transform:v=>v===undefined?400:v});
readonly transformOrigin=input<string,string|undefined>('center center',{transform:v=>v===undefined?'center center':v});
readonly scrollContainerRef=input<ScrollVelocityContainerRef>();
readonly styles=input<ScrollVelocityStyle|undefined>(undefined,{alias:'style'});
readonly attributes=input<Record<string,string|number|boolean|null|undefined>|undefined>();
private readonly host=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
readonly native=this.host.hasAttribute('kitScrollVelocityText');
private readonly zone=inject(NgZone);
private node:HTMLElement|undefined;
private motion:ScrollVelocityMotion|undefined;
private previousStyle:Record<string,string|number|undefined>={};
private previousAttributes:Record<string,string|number|boolean|null|undefined>={};
get element():HTMLElement|undefined{return this.node}
ngAfterViewInit():void{this.render();this.configure()}
ngOnChanges(changes:SimpleChanges):void{if(!this.node)return;this.render();if(['expandDistance','intensity','minLetterSpacing','maxLetterSpacing','maxScale','fadeStart','smoothingMs','scrollContainerRef'].some(key=>changes[key]))this.configure()}
private render():void{
 const replace=!this.node||(!this.native&&this.node.localName!==this.as());
 if(replace){const old=this.node;let namespace=this.host.namespaceURI;if(namespace==='http://www.w3.org/1999/xhtml'){if(this.as()==='svg')namespace='http://www.w3.org/2000/svg';else if(this.as()==='math')namespace='http://www.w3.org/1998/Math/MathML'}this.node=this.native?this.host:namespace&&namespace!=='http://www.w3.org/1999/xhtml'?this.host.ownerDocument.createElementNS(namespace,this.as()) as HTMLElement:this.host.ownerDocument.createElement(this.as());if(!this.native){old?.remove();this.host.append(this.node)}this.previousStyle={};this.previousAttributes={};this.motion?.setNode(this.node)}
 const node=this.node!;if(node.textContent!==this.text())node.textContent=this.text();for(const name of (node.dataset['kitVelocityClasses']??'').split(' ').filter(Boolean))node.classList.remove(name);
 node.classList.add('scroll-velocity-text-base');
 const classes=this.className().split(/\\s+/).filter(Boolean);node.classList.add(...classes);node.dataset['kitVelocityClasses']=classes.join(' ');node.setAttribute('data-kit-scroll-velocity','');
 node.style.setProperty('--kit-scroll-origin',this.transformOrigin());node.style.setProperty('--kit-scroll-rest-spacing',this.minLetterSpacing()+'em');
 const next={letterSpacing:this.minLetterSpacing()+'em',opacity:1,...this.styles()};
 const unitless=new Set('animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth'.split(' '));
 const cssName=(key:string)=>key==='cssFloat'?'float':key.startsWith('--')?key:key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
 for(const key of Object.keys(this.previousStyle))if(!(key in next))node.style.removeProperty(cssName(key));
 for(const [key,value] of Object.entries(next))if(replace||value!==this.previousStyle[key])node.style.setProperty(cssName(key),value===undefined?'':typeof value==='number'&&value!==0&&!key.startsWith('--')&&!unitless.has(key)?value+'px':String(value));
 this.previousStyle=next;
 const attrs=this.attributes()??{};for(const key of Object.keys(this.previousAttributes))if(!(key in attrs))node.removeAttribute(key);
 const booleanAttributes=new Set('allowfullscreen async autofocus autoplay controls default defer disabled formnovalidate hidden inert ismap itemscope loop multiple muted nomodule novalidate open playsinline readonly required reversed scoped seamless selected'.split(' '));
 for(const [key,value] of Object.entries(attrs)){const name=key.toLowerCase();if(value===undefined||value===null||booleanAttributes.has(name)&&!value||['capture','download'].includes(name)&&value===false)node.removeAttribute(key);else node.setAttribute(key,booleanAttributes.has(name)||['capture','download'].includes(name)&&value===true?'':String(value))}this.previousAttributes={...attrs};
}
private configure():void{if(!this.node?.ownerDocument.defaultView)return;this.zone.runOutsideAngular(()=>{this.motion??=new ScrollVelocityMotion(this.node!);this.motion.configure({expandDistance:this.expandDistance(),intensity:this.intensity(),minLetterSpacing:this.minLetterSpacing(),maxLetterSpacing:this.maxLetterSpacing(),maxScale:this.maxScale(),fadeStart:this.fadeStart(),smoothingMs:this.smoothingMs(),scrollContainerRef:this.scrollContainerRef()})})}
ngOnDestroy():void{this.motion?.destroy();if(this.node&&!this.native)this.node.remove();this.node=undefined;}`,
  inputs: ['text: string (required)','as: string','className: string','expandDistance: number','intensity: number','minLetterSpacing: number','maxLetterSpacing: number','maxScale: number','fadeStart: number','smoothingMs: number','transformOrigin: string','scrollContainerRef: ScrollVelocityContainerRef','style: ScrollVelocityStyle','attributes: Record<string, string | number | boolean | null | undefined>'],
  outputs: [],
};

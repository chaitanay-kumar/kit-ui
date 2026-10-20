import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';import tailwind from '@tailwindcss/postcss';
import {buildScopedUtilityDefaults} from './angular-scoped-utilities';
import {CAR_SMOKE_CLASSES} from '../packages/angular/src/car-smoke-classes';

/** Preserve the complete source vector asset, including all three animated wheel groups. */
export function buildCarSmokeSvg(root:string):void{
 const text=fs.readFileSync(path.join(root,'src/components/ui/CarSmokePageTransition.tsx'),'utf8');
 const ast=ts.createSourceFile('CarSmokePageTransition.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let asset:ts.Expression|undefined;
 const visit=(node:ts.Node)=>{if(ts.isVariableDeclaration(node)&&node.name.getText(ast)==='carSvg')asset=node.initializer;ts.forEachChild(node,visit)};visit(ast);
 if(!asset)throw new Error('Source car SVG missing');while(ts.isParenthesizedExpression(asset))asset=asset.expression;
 const escape=(value:string)=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 const names:Record<string,string>={strokeWidth:'stroke-width',strokeLinecap:'stroke-linecap',strokeLinejoin:'stroke-linejoin',strokeDasharray:'stroke-dasharray',stopColor:'stop-color',stopOpacity:'stop-opacity'};
 let groups=0;
 const attributes=(attributes:ts.JsxAttributes,tag:string)=>attributes.properties.map(attribute=>{
  if(!ts.isJsxAttribute(attribute))throw new Error('Unsupported SVG spread');const name=attribute.name.getText(ast),value=attribute.initializer;if(!value)return name;
  if(ts.isStringLiteral(value))return(names[name]??name)+'="'+escape(value.text)+'"';
  if(!ts.isJsxExpression(value)||!value.expression)throw new Error('Unsupported SVG attribute');const expression=value.expression.getText(ast);
  if(tag==='svg'&&name==='width'&&expression==='carWidth')return '[attr.width]="width()"';
  if(tag==='svg'&&name==='height'&&/carHeight\s*\*\s*1\.12/.test(expression))return '[attr.height]="height()*1.12"';
  if(tag==='svg'&&name==='className')return '[class]="isLtr()?\'kcar-svg\':\'kcar-svg kcar-flip\'"';
  if(tag==='svg'&&name==='style')return '[style.filter]="dark()?\'drop-shadow(0 24px 22px rgba(0,0,0,0.68))\':\'drop-shadow(0 18px 20px rgba(0,0,0,0.28))\'"';
  if(tag==='ellipse'&&name==='fill'&&expression.includes('isDark'))return '[attr.fill]="dark()?\'rgba(0,0,0,0.78)\':\'rgba(0,0,0,0.30)\'"';
  if(tag==='g'&&name==='style'){
   const origin=expression.includes('81px')?'81px 82px':'269px 82px',angle=expression.includes('frontSteerAngle')?'frontSteerAngle()':'wheelRotation()';groups++;
   return 'data-car-axis="'+(angle==='frontSteerAngle()'?'steer':'wheel')+'" style="transform-origin:'+origin+'" [style.transform]="'+angle+'===0?\'none\':\'rotate(\'+('+angle+')+\'deg)\'"';
  }
  throw new Error('Unsupported source SVG expression: '+name+'='+expression);
 }).join(' ');
 const convert=(node:ts.Node):string=>{
  if(ts.isJsxElement(node)){const tag=node.openingElement.tagName.getText(ast).replace('motion.','');return '<'+tag+' '+attributes(node.openingElement.attributes,tag)+'>'+node.children.map(convert).join('')+'</'+tag+'>'}
  if(ts.isJsxSelfClosingElement(node)){const tag=node.tagName.getText(ast).replace('motion.','');return '<'+tag+' '+attributes(node.attributes,tag)+'></'+tag+'>'}
  if(ts.isJsxText(node))return node.text.trim();if(ts.isJsxExpression(node)&&!node.expression)return '';throw new Error('Unsupported car SVG child');
 };
 const template=convert(asset);if(groups!==3)throw new Error('Expected all three source wheel groups');
 fs.writeFileSync(path.join(root,'packages/angular/src/car-smoke-svg.ts'),`// Generated from the complete authored React SVG by scripts/angular-car-smoke.ts.\nimport {Component,input} from '@angular/core';\n@Component({selector:'kit-car-smoke-svg',standalone:true,host:{style:'display:contents'},template:${JSON.stringify(template)}})\nexport class KitCarSmokeSvgComponent{readonly width=input(310);readonly height=input(310*(100/300));readonly dark=input(false);readonly isLtr=input(true);readonly wheelRotation=input(0);readonly frontSteerAngle=input(0)}\n`);
}

export async function buildCarSmokeSupport(root:string):Promise<void>{
 buildCarSmokeSvg(root);
 const rules=Object.entries(CAR_SMOKE_CLASSES).map(([name,classes])=>'.kcar-'+name+'{@apply '+classes+';}').join('\n');
 const css=await postcss([tailwind()]).process('@reference "../src/styles/index.css";@layer components{'+rules+'}',{from:path.join(root,'scripts/angular-car-smoke.css')});
 const defaults=await buildScopedUtilityDefaults(root,'.kcar-native',[CAR_SMOKE_CLASSES.root]);
 fs.writeFileSync(path.join(root,'packages/angular/src/car-smoke.css'),'/* Generated from scripts/angular-car-smoke.ts. */\n@layer components{:where(.kcar-native,.kcar-native *,.kcar-native *::before,.kcar-native *::after){box-sizing:border-box;border-style:solid;border-width:0}:where(.kcar-native button){font:inherit;color:inherit;padding:0;background:transparent}:where(.kcar-native svg){display:block;vertical-align:middle}}\n'+defaults+css.css+'\n');
}
export const carSmokePort={
 id:'car-smoke-page-transition',kind:'plain' as const,controller:'CarSmokeController',stylesFile:'./car-smoke.css',hostMetadata:"{class:'kcar-native',style:'display:contents'}",
 description:'Native full-vector drift transition with source choreography, canvas smoke/skids/speed lines, independent completion/reset timings and owned animation cleanup.',
 imports:"import {CarSmokeController} from './car-smoke-state';import {KitCarSmokeSvgComponent} from './car-smoke-svg';import {KitFormContentComponent} from './form-parts';",
 componentImports:'KitCarSmokeSvgComponent,KitFormContentComponent',body:'',
 template:`<div data-kit="car-smoke-page-transition" [class]="panelClass()" dir="ltr"><span class="kcar-trigger" (click)="trigger($event)" (keydown)="key($event)" tabindex="0" role="button" aria-label="Trigger Ferrari drift page transition">@if(content()){<kit-form-content [content]="content()"/>}@else{<ng-content><button type="button" class="kcar-button"><span>Launch Transition</span><span class="kcar-arrow">→</span></button></ng-content>}</span>
 @if(state()!=='idle'){<div class="kcar-overlay" aria-hidden="true"><canvas #canvas class="kcar-canvas" style="pointer-events:none"></canvas><div #car class="kcar-car" [style.top]="top()" [style.transform]="carTransform()"><kit-car-smoke-svg [width]="dimensions().width" [height]="dimensions().height" [dark]="dark()" [isLtr]="isLtr()" [wheelRotation]="values().wheel" [frontSteerAngle]="values().steer"/></div><div #backdrop class="kcar-backdrop" [style.background-color]="dark()?'#050505':'#FAFAFA'" [style.opacity]="values().opacity"></div></div>}
 </div>`,
 inputs:['direction: left-to-right | right-to-left','carDuration: number','carDelay: number','carSize: sm | md | lg','smokeDensity: off | low | medium | high','smokeLifetime: number','showSpeedLines: boolean','pageTransitionDelay: number','pageTransitionDuration: number','resetDelay: number','onTransitionComplete: () => void','verticalPosition: center | top | bottom | number','content: FormContent','className: string'],outputs:[],
};

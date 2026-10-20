import postcss,{type Root,type Document} from 'postcss';
import path from 'node:path';
import {compile} from '@tailwindcss/node';
/** Utility defaults ship with each feature without styling unrelated application nodes. */
export function scopeNativeUtilities(root:Root,scope:string):void{
 root.walkRules(rule=>{
  let parent:typeof rule.parent|Document=rule.parent;let utilityLayer=false;
  while(parent){if(parent.type==='rule')return;if(parent.type==='atrule'&&parent.name==='layer'&&parent.params==='utilities')utilityLayer=true;if(parent.type==='atrule'&&parent.name.endsWith('keyframes'))return;parent=parent.parent}
  if(utilityLayer)rule.selectors=rule.selectors.map(selector=>':where('+scope+') '+selector);
 });
}
/** Explicit candidates avoid scanning/emitting the application's complete utility sheet. */
export async function buildScopedUtilityDefaults(root:string,scope:string,sources:readonly string[]):Promise<string>{
 const compiler=await compile('@reference "../src/styles/index.css";@layer utilities{@tailwind utilities;}',{base:path.join(root,'scripts'),onDependency:()=>{}});
 const css=postcss.parse(compiler.build([...new Set(sources.flatMap(value=>value.split(/\s+/)).filter(Boolean))]));
 scopeNativeUtilities(css,scope);return css.toString();
}

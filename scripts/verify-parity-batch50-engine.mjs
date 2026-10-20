import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {CarSmokeCanvasEngine,carSmokeDimensions} from '../packages/angular/src/car-smoke-engine.ts';

const text=readFileSync(new URL('../src/components/ui/CarSmokePageTransition.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('CarSmokePageTransition.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let render,dimensions;
function visit(node){if(ts.isVariableDeclaration(node)){if(node.name.getText(ast)==='renderCanvasFrame')render=node.initializer.arguments[0];if(node.name.getText(ast)==='getCarDimensions')dimensions=node.initializer.arguments[0]}ts.forEachChild(node,visit)}visit(ast);
assert.ok(render&&dimensions,'actual source engine anchors exist');
const compile=text=>ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const rng=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
function recorder(width,height){
 const operations=[];let serial=0;
 const context=new Proxy({}, {get:(_,method)=>{
  if(method==='createLinearGradient'||method==='createRadialGradient')return(...args)=>{const gradient=++serial;operations.push([method,...args,gradient]);return{gradient,addColorStop:(...args)=>operations.push(['colorStop',gradient,...args])}};
  return(...args)=>operations.push([method,...args]);
 },set:(_,key,value)=>{operations.push(['set',key,value&&typeof value==='object'&&'gradient' in value?{gradient:value.gradient}:value]);return true}});
 return{operations,canvas:{width,height,getContext:()=>context}};
}
const plain=value=>JSON.parse(JSON.stringify(value));
let cases=0,frames=0;
for(const theme of ['light','dark'])for(const direction of ['left-to-right','right-to-left'])for(const smokeDensity of ['off','low','medium','high']){
 const index=cases++,viewport=[420,900,1440][index%3],dpr=index%2+1,carSize=['sm','md','lg'][index%3],verticalPosition=['top','center','bottom',82][index%4];
 const options={theme,direction,smokeDensity,carSize,verticalPosition,smokeLifetime:index%2?100:1400,showSpeedLines:index%3!==0};
 const width=index%5===0?300:viewport*dpr,height=index%5===0?150:600*dpr;
 const source=recorder(width,height),native=recorder(width,height),pose={x:0,y:0,angle:0};let running=true;
 const sourceMath=Object.create(Math);sourceMath.random=rng(index+1);
 const getCarDimensions=vm.runInNewContext(compile('const dimensions='+dimensions.getText(ast)+';dimensions'),{window:{innerWidth:viewport},carSize});
 assert.deepEqual(carSmokeDimensions(carSize,viewport),plain(getCarDimensions()));
 const reference=vm.runInNewContext(compile('const frame='+render.getText(ast)+';frame'),{
  ...options,Math:sourceMath,MAX_SMOKE_PARTICLES:160,densityMultiplier:{off:0,low:2,medium:4,high:6}[smokeDensity],getCarDimensions,
  canvasRef:{current:source.canvas},smokeRef:{current:[]},skidMarksRef:{current:[]},linesRef:{current:[]},lastWheelPosRef:{current:null},
  isRunningRef:{get current(){return running}},carX:{get:()=>pose.x},carYOffset:{get:()=>pose.y},carDriftAngle:{get:()=>pose.angle},
 });
 const engine=new CarSmokeCanvasEngine(()=>native.canvas,()=>options,()=>pose,()=>running,()=>viewport,rng(index+1));
 for(let frame=0;frame<40;frame++){
  pose.x=frame*12;pose.y=Math.sin(frame)*3;pose.angle=frame>2&&frame<20?(direction==='left-to-right'?-5:5):0;if(frame===25)running=false;
  reference();engine.frame();frames++;
  assert.deepEqual(native.operations,plain(source.operations),`exact operations case ${index}, frame ${frame}`);
  native.operations.length=0;source.operations.length=0;
 }
 engine.clear();engine.frame();assert.deepEqual(native.operations,[['clearRect',0,0,native.canvas.width,native.canvas.height]],'clear releases all particle, skid and speed-line state');
}
const noCanvas=new CarSmokeCanvasEngine(()=>null,()=>({theme:'light',direction:'left-to-right',carSize:'md',verticalPosition:'center',smokeDensity:'medium',smokeLifetime:1400,showSpeedLines:true}),()=>({x:0,y:0,angle:0}),()=>false,()=>1200);
noCanvas.frame();noCanvas.clear();
console.log(`Batch 50: ${cases} actual-source car-engine configurations and ${frames} exact canvas frames pass, including cleanup and absent canvas.`);

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {PullRefreshSession} from '../packages/angular/src/pull-refresh-session.ts';
import {DEFAULT_FINANCIAL_DATA} from '../packages/angular/src/pull-to-refresh-data.ts';

const source=readFileSync(new URL('../src/components/ui/PullToRefresh.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('PullToRefresh.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const declaration=ast.statements.find(node=>ts.isVariableStatement(node)&&node.declarationList.declarations.some(declaration=>declaration.name.getText(ast)==='PullToRefresh')).declarationList.declarations[0];
const arrow=declaration.initializer,lastReturn=arrow.body.statements.findLast(ts.isReturnStatement),start=arrow.getStart(ast),text=arrow.getText(ast);
const exposed=text.slice(0,lastReturn.getStart(ast)-start)+'return {executeRefresh,handlePointerDown,handlePointerMove,handlePointerUp,handleKeyDown,pullState,demoValues};'+text.slice(lastReturn.end-start);
const compiled=ts.transpileModule('const component='+exposed+';component',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const flush=async()=>{for(let index=0;index<8;index++)await Promise.resolve()};
function clock(){let now=0,serial=0;const timers=new Map();return{timers,now:()=>now,setTimeout:(callback,delay)=>{const id=++serial;timers.set(id,{callback,at:now+delay});return id},clearTimeout:id=>timers.delete(id),advance:async duration=>{now+=duration;for(const[id,timer]of [...timers])if(timer.at<=now){timers.delete(id);timer.callback()}await flush()}}}
function fixture(overrides={}){
 const options={threshold:68,maxPull:110,resistance:.45,refreshingHoldOffset:48,disabled:false,...overrides};
 const sourceClock=clock(),nativeClock=clock(),sourceMotion=[],nativeMotion=[],slots=[];let index=0,api;
 const useState=initial=>{const slot=index++;if(!(slot in slots))slots[slot]=typeof initial==='function'?initial():initial;return[slots[slot],value=>{slots[slot]=typeof value==='function'?value(slots[slot]):value}]};
 const useRef=initial=>{const slot=index++;return slots[slot]??=( {current:initial} )};
 const sourceMath=Object.create(Math);sourceMath.random=()=>.25;
 const component=vm.runInNewContext(compiled,{useState,useRef,useEffect:()=>{},useCallback:callback=>callback,useMotionValue:initial=>useRef({value:initial,set(value){this.value=value;sourceMotion.push(['set',value])}}).current,useSpring:value=>value,useTransform:()=>({}),useReducedMotion:()=>false,animate:(_,value,options)=>sourceMotion.push(['spring',value,options.stiffness,options.damping,options.mass]),DEFAULT_FINANCIAL_DATA,Math:sourceMath,Date:{now:sourceClock.now},setTimeout:sourceClock.setTimeout});
 const render=()=>{index=0;api=component(options)};render();
 const motion={set:value=>nativeMotion.push(['set',value]),spring:(...args)=>nativeMotion.push(['spring',...args]),destroy:()=>nativeMotion.push(['destroy'])};
 const native=new PullRefreshSession(()=>options,motion,nativeClock,()=>{},()=>.25);
 const plain=value=>JSON.parse(JSON.stringify(value));
 const compare=()=>{render();assert.deepEqual(native.state,plain(api.pullState));assert.deepEqual(native.demoValues,plain(api.demoValues));assert.deepEqual(nativeMotion,sourceMotion)};
 return{options,native,sourceClock,nativeClock,compare,
  down:(x,y,eligible=true)=>{api.handlePointerDown({clientX:x,clientY:y,target:{closest:selector=>!eligible&&selector==='button'?{}:null}});native.down(x,y,eligible);compare()},
  move:(x,y)=>{api.handlePointerMove({clientX:x,clientY:y});native.move(x,y);compare()},
  up:()=>{api.handlePointerUp();native.up();compare()},
  key:(key,ctrlKey=false)=>{const a={key,ctrlKey,metaKey:false,preventDefault(){this.prevented=true}},b={...a};api.handleKeyDown(a);native.key(b);assert.equal(a.prevented,b.prevented);compare()},
  refresh:()=>{void api.executeRefresh();void native.refresh();compare()},
  advance:async ms=>{await sourceClock.advance(ms);await nativeClock.advance(ms);compare()},
  settled:async()=>{await flush();compare()},
 };
}
let cases=0;
for(const[distance,duration]of [[30,500],[200,500],[30,10]]){
 const f=fixture({onRefresh:()=>{}});f.down(0,0);await f.advance(duration);f.move(0,distance);f.up();await f.settled();await f.advance(380);f.native.destroy();cases++;
}
const upward=fixture({onRefresh:()=>{}});upward.down(0,100);upward.move(0,300);upward.move(0,80);upward.up();await upward.settled();await upward.advance(380);upward.native.destroy();cases++;
const ignored=fixture({onRefresh:()=>{}});ignored.down(0,0,false);ignored.move(0,300);ignored.up();ignored.down(0,0);ignored.move(60,20);await ignored.advance(500);ignored.up();ignored.native.destroy();cases++;
const failed=fixture({onRefresh:()=>Promise.reject(new Error('refresh failed'))});failed.key('R');await failed.settled();assert.equal(failed.native.status,'idle');failed.native.destroy();cases++;
const simulated=fixture();simulated.key('r',true);assert.equal(simulated.native.status,'idle');simulated.key('r');await simulated.advance(1100);assert.equal(simulated.native.status,'complete');await simulated.advance(380);simulated.native.destroy();cases++;
const overlap=fixture({onRefresh:()=>{}});overlap.refresh();await overlap.settled();await overlap.advance(200);overlap.refresh();await overlap.settled();await overlap.advance(180);assert.equal(overlap.native.status,'idle','source earlier complete hold can reset a later refresh');await overlap.advance(200);overlap.native.destroy();cases++;
const disabled=fixture({disabled:true,onRefresh:()=>{}});disabled.key('r');disabled.down(0,0);disabled.move(0,500);disabled.up();disabled.native.destroy();cases++;
const toggled=fixture({onRefresh:()=>{}});toggled.down(0,0);toggled.move(0,250);toggled.options.disabled=true;toggled.compare();toggled.up();assert.equal(toggled.native.status,'ready','source disabled release can retain the ready pose');toggled.native.destroy();cases++;
const disposed=fixture();disposed.refresh();assert.equal(disposed.nativeClock.timers.size,1);disposed.native.destroy();assert.equal(disposed.nativeClock.timers.size,0);await flush();assert.equal(disposed.native.status,'refreshing','destroyed session cannot publish late lifecycle changes');cases++;
let complete;const pending=fixture({onRefresh:()=>new Promise(resolve=>{complete=resolve})});pending.native.refresh();pending.native.destroy();complete();await flush();assert.equal(pending.native.status,'refreshing');assert.equal(pending.nativeClock.timers.size,0,'external callback completion cannot create a post-destruction hold');cases++;
console.log(`Batch 50: ${cases-2} actual-source refresh/gesture scenarios and 2 native destruction cases pass.`);

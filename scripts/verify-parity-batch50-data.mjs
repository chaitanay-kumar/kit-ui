import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {DEFAULT_FINANCIAL_DATA,generateSmoothPath,refreshDemoFinancialData,calculateDampedPull} from '../packages/angular/src/pull-to-refresh-data.ts';

// Extract actual authored React calculations, rather than a second expected copy.
const source=readFileSync(new URL('../src/components/ui/PullToRefresh.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('PullToRefresh.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const path=ast.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='generateSmoothPath');
const data=ast.statements.find(node=>ts.isVariableStatement(node)&&node.declarationList.declarations.some(declaration=>declaration.name.getText(ast)==='DEFAULT_FINANCIAL_DATA'));
let update,damped;
function visit(node){
 if(ts.isCallExpression(node)&&node.expression.getText(ast)==='setDemoValues')update=node.arguments[0];
 if(ts.isVariableDeclaration(node)&&node.name.getText(ast)==='calculateDampedPull')damped=node.initializer.arguments[0];
 ts.forEachChild(node,visit);
}visit(ast);
assert.ok(path&&data&&update&&damped,'actual React contract anchors exist');
const compile=text=>ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const value=(text,context={})=>vm.runInNewContext(compile(text),context);
const plain=value=>JSON.parse(JSON.stringify(value));
assert.deepEqual(DEFAULT_FINANCIAL_DATA,plain(value(data.getText(ast)+';DEFAULT_FINANCIAL_DATA')));
const sourcePath=value(path.getText(ast)+';generateSmoothPath');
let comparisons=1;
for(const args of [[[]],[[1]],[[5,5,5]],[[10,-2,8,4]],[[1,9],500,200,0,0],[DEFAULT_FINANCIAL_DATA['1D'].points]]){
 assert.deepEqual(generateSmoothPath(...args),plain(sourcePath(...args)));comparisons++;
}
for(const[threshold,maxPull,resistance]of [[68,110,.45],[40,80,.2],[100,75,1],[0,110,.45]]){
 const reference=value('const pull='+damped.getText(ast)+';pull',{threshold,maxPull,resistance,Math});
 for(const delta of [-20,0,1,40,150,1000]){assert.equal(calculateDampedPull(delta,threshold,maxPull,resistance),reference(delta));comparisons++}
}
for(const seed of [1,42,999]){
 const rng=()=>{let state=seed;return()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296}};
 const sourceMath=Object.create(Math);sourceMath.random=rng();
 const reference=value('const update='+update.getText(ast)+';update',{Math:sourceMath});
 const original=structuredClone(DEFAULT_FINANCIAL_DATA),native=refreshDemoFinancialData(original,rng());
 assert.deepEqual(native,plain(reference(structuredClone(DEFAULT_FINANCIAL_DATA))));
 assert.deepEqual(original,DEFAULT_FINANCIAL_DATA,'simulation leaves prior data intact');
 assert.equal(native['1H'],original['1H']);assert.equal(native['4H'],original['4H']);comparisons++;
}
console.log(`Batch 50: ${comparisons} actual-source financial data, curve, resistance and seeded simulation comparisons pass.`);

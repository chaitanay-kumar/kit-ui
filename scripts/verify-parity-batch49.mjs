import '@angular/compiler';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
import {ErrorHandler,provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule,platformBrowserTesting} from '@angular/platform-browser/testing';
import {By} from '@angular/platform-browser';
import {KitChatComponent,KitChatHeaderComponent,KitChatSidebarComponent,KitChatMessagesComponent,KitChatMessageComponent,KitChatComposerComponent,KitDynamicIslandComponent,injectChat} from '../packages/angular/dist/fesm2022/kit-ui-angular.mjs';

const virtualConsole=new VirtualConsole();
virtualConsole.on('jsdomError',error=>{if(!error.message.includes('Could not parse CSS stylesheet'))throw error});
const dom=new JSDOM('<!doctype html><html><body></body></html>',{virtualConsole});
for(const key of ['window','document','HTMLElement','HTMLInputElement','HTMLTextAreaElement','Element','Node','Event','MouseEvent','KeyboardEvent','PointerEvent'])if(dom.window[key])globalThis[key]=dom.window[key];
const frames=new Map(),observers=new Set(),mediaListeners=new Set(),timers=new Map();let serial=0,time=0,reduced=false;
window.requestAnimationFrame=callback=>{frames.set(++serial,callback);return serial};window.cancelAnimationFrame=id=>frames.delete(id);
globalThis.requestAnimationFrame=window.requestAnimationFrame;globalThis.cancelAnimationFrame=window.cancelAnimationFrame;
Object.defineProperty(window.performance,'now',{value:()=>time});
window.matchMedia=query=>({matches:query.includes('reduced-motion')?reduced:true,media:query,addEventListener:(_,callback)=>mediaListeners.add(callback),removeEventListener:(_,callback)=>mediaListeners.delete(callback)});
window.setTimeout=(callback,duration)=>{timers.set(++serial,{callback,duration});return serial};window.clearTimeout=id=>timers.delete(id);
const copied=[];Object.defineProperty(window,'isSecureContext',{value:true});Object.defineProperty(window.navigator,'clipboard',{value:{writeText:text=>{copied.push(text);return Promise.resolve()}}});
const scrolls=[];HTMLElement.prototype.scrollIntoView=function(options){scrolls.push({node:this,options})};
const OriginalObserver=window.MutationObserver;
window.MutationObserver=class extends OriginalObserver{observe(...args){observers.add(this);return super.observe(...args)}disconnect(){observers.delete(this);super.disconnect()}};globalThis.MutationObserver=window.MutationObserver;
const documentListeners=new Map(),viewListeners=new Map();
for(const[target,owned,names]of [[document,documentListeners,['pointerdown','keydown']],[window,viewListeners,['pointerup','pointercancel']]]){
 const add=target.addEventListener.bind(target),remove=target.removeEventListener.bind(target);
 target.addEventListener=(name,callback,...args)=>{if(names.includes(name)){const callbacks=owned.get(name)??new Set();callbacks.add(callback);owned.set(name,callbacks)}return add(name,callback,...args)};
 target.removeEventListener=(name,callback,...args)=>{const callbacks=owned.get(name);callbacks?.delete(callback);if(callbacks?.size===0)owned.delete(name);return remove(name,callback,...args)};
}
const errors=[];TestBed.initTestEnvironment(BrowserTestingModule,platformBrowserTesting());
const make=(Component,inputs={})=>{const fixture=TestBed.configureTestingModule({imports:[Component],providers:[provideZonelessChangeDetection(),{provide:ErrorHandler,useValue:{handleError:error=>errors.push(error.message)}}]}).createComponent(Component);for(const[key,value]of Object.entries(inputs))fixture.componentRef.setInput(key,value);fixture.detectChanges();fixture.detectChanges();return fixture};
const flush=fixture=>{fixture.detectChanges();fixture.detectChanges()};
const child=(fixture,Component)=>fixture.debugElement.query(By.directive(Component)).componentInstance;
const event=()=>new MouseEvent('click',{bubbles:true,cancelable:true});
const advance=milliseconds=>{for(let tick=0;tick<milliseconds;tick+=16){time+=16;const callbacks=[...frames.values()];frames.clear();for(const callback of callbacks)callback(time)}};
const dispose=async fixture=>{fixture.destroy();TestBed.resetTestingModule();await Promise.resolve();await Promise.resolve();assert.equal(frames.size,0,'owned animation frames released');assert.equal(observers.size,0,'spacing observers released');assert.equal(mediaListeners.size,0,'media listeners released');assert.equal(viewListeners.size,0,'press listeners released');assert.equal(documentListeners.size,0,'document listeners released');assert.equal(timers.size,0,'copy timers released')};

const sends=[],root=make(KitChatComponent,{messages:[],onSendMessage:(...args)=>sends.push(args),threads:[{id:'one',title:'One'}],onClearChat:()=>{}});
const composer=child(root,KitChatComposerComponent),header=child(root,KitChatHeaderComponent),sidebar=child(root,KitChatSidebarComponent);
assert.equal(header.chat,root.componentInstance);assert.equal(composer.chat,root.componentInstance);
assert.equal(child(root,KitChatMessagesComponent).chat,root.componentInstance);
assert.equal(header.title(),'AI Assistant');assert.equal(header.subtitle(),'Claude 3.7 Sonnet');assert.equal(composer.allowAttachments(),true);
composer.inputText.set('  hello  ');composer.send(event());flush(root);
assert.deepEqual(sends,[['hello',[]]]);assert.equal(composer.inputText(),'');assert.deepEqual(root.componentInstance.messages(),[],'transport and messages stay external');
root.componentRef.setInput('isGenerating',true);composer.inputText.set('editing');const enter=new KeyboardEvent('keydown',{key:'Enter',cancelable:true});composer.key(enter);assert.equal(enter.defaultPrevented,true);assert.equal(composer.inputText(),'editing');assert.equal(sends.length,1);
root.componentRef.setInput('isGenerating',false);root.componentRef.setInput('onSendMessage',()=>{throw new Error('send failed')});composer.attachments.set([{id:'file',name:'file.txt',type:'file'}]);composer.send(event());await Promise.resolve();assert.deepEqual(errors.splice(0),['send failed']);assert.equal(composer.inputText(),'editing');assert.equal(composer.attachments().length,1);
root.componentRef.setInput('onSendMessage',()=>new Promise(()=>{}));composer.send(event());assert.equal(composer.inputText(),'');assert.equal(composer.attachments().length,0,'returned promise does not delay reset');
header.toggle();assert.equal(root.componentInstance.isSidebarOpen(),true);root.componentRef.setInput('onSelectThread',()=>{throw new Error('thread failed')});sidebar.selectThread('one',event());await Promise.resolve();assert.deepEqual(errors.splice(0),['thread failed']);assert.equal(root.componentInstance.isSidebarOpen(),true);root.componentRef.setInput('onSelectThread',id=>sends.push(id));sidebar.selectThread('one',event());assert.equal(root.componentInstance.isSidebarOpen(),false);assert.equal(sends.at(-1),'one');
root.componentRef.setInput('messages',[{id:'a',role:'assistant',content:'Plain\n```ts\nconst a = 1;\n```'}]);flush(root);assert.ok(observers.size>0);assert.ok(frames.size>0);assert.ok(scrolls.some(({options})=>options.behavior==='smooth'));
const message=child(root,KitChatMessageComponent);message.copy(event());message.copy(event());assert.deepEqual(copied,[message.message().content,message.message().content]);assert.equal([...timers.values()].filter(timer=>timer.duration===2000).length,2);const first=[...timers][0];timers.delete(first[0]);first[1].callback();assert.equal(message.copied(),false,'earlier reset remains independent');assert.equal(timers.size,1);await dispose(root);

const left=make(KitChatComponent,{messages:[],onSendMessage:()=>{}}),right=TestBed.createComponent(KitChatComponent);right.componentRef.setInput('messages',[]);right.componentRef.setInput('onSendMessage',()=>{});flush(right);left.componentInstance.setIsSidebarOpen(true);assert.equal(right.componentInstance.isSidebarOpen(),false,'roots own independent sidebar state');assert.notEqual(child(left,KitChatComposerComponent).chat,child(right,KitChatComposerComponent).chat,'compound contexts are isolated per root');right.destroy();await dispose(left);

const standalone=make(KitChatMessageComponent,{message:{id:'retry',role:'system',content:'System',status:'failed'},onRetry:id=>sends.push(id)});standalone.componentInstance.retry(event());assert.equal(sends.at(-1),'retry');assert.equal(standalone.componentInstance.isUser(),false);assert.equal(standalone.componentInstance.isAssistant(),false);await dispose(standalone);
TestBed.configureTestingModule({providers:[provideZonelessChangeDetection()]});assert.throws(()=>TestBed.runInInjectionContext(()=>injectChat()),/Chat compound subcomponents must be used within <Chat>/);TestBed.resetTestingModule();

const changes=[],island=make(KitDynamicIslandComponent,{defaultState:'profile',onStateChange:state=>changes.push(state),socials:{email:'hello@example.com',github:'https://github.com'}});
assert.equal(island.componentInstance.currentState(),'profile');assert.equal(island.componentInstance.normalizedSocials()[0].href,'mailto:hello@example.com');island.componentRef.setInput('defaultState','share');flush(island);assert.equal(island.componentInstance.currentState(),'profile','default state is mount-owned');
island.componentRef.setInput('state','expanded');flush(island);island.componentInstance.changeState('share',event());assert.equal(island.componentInstance.currentState(),'expanded','controlled requests wait for owner');assert.deepEqual(changes,['share']);island.componentRef.setInput('state',undefined);flush(island);assert.equal(island.componentInstance.currentState(),'profile');island.componentInstance.changeState('share',event());flush(island);assert.ok(frames.size>0);advance(64);await dispose(island);
reduced=true;const instantMessage=make(KitChatMessageComponent,{message:{id:'instant',role:'assistant',content:'Reduced entry'}});assert.equal(frames.size,1,'reduced message commits once on the next frame');await dispose(instantMessage);
const instant=make(KitDynamicIslandComponent);instant.componentInstance.changeState('profile',event());flush(instant);assert.equal(frames.size,0,'reduced island needs no interpolation frames');await dispose(instant);

for(const[id,files]of [['chat',['chat.css','chat-classnames.ts','chat-context.ts','chat-message-state.ts','chat-motion.ts','chat-parts.ts','chat-types.ts','chat-icons.ts','native-classes.ts','form-spacing.ts','data-details-copy.ts']],['dynamic-island',['dynamic-island.css','dynamic-island-classnames.ts','dynamic-island-state.ts','dynamic-island-motion.ts','dynamic-island-icons.ts','native-classes.ts']]]){
 const source=JSON.parse(readFileSync(new URL('../public/angular-source/'+id+'.json',import.meta.url),'utf8'));
 for(const file of files)assert.ok(source.dependencies[file],id+' recursive source closure '+file);
}
assert.equal(JSON.parse(readFileSync(new URL('../packages/angular/dist/package.json',import.meta.url),'utf8')).dependencies['tailwind-merge'],'^3.6.0');
assert.deepEqual(errors,[]);
console.log('Batch 49 packaged ownership, compounds/context, failures, ignored promises, clipboard timers, motion/listener/observer disposal, reduced motion and recursive source closure pass.');

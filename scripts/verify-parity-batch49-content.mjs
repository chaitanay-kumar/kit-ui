import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {ChatMessage} from '../src/components/ui/Chat.tsx';
import {chatInlineParts,renderNativeChatContent} from '../packages/angular/src/chat-types.ts';

const samples=['','Hello `inline` world','First\nsecond','```ts\nconst n = 1;\n```','Before\n```\n```\nAfter','```ts','```ts\nunclosed','A ```literal``` in text','```\n```','```js\nx\n```\n','<img src=x onerror=alert(1)>'];
for(const role of ['user','assistant','system'])for(const content of samples){
 const source=renderToStaticMarkup(React.createElement(ChatMessage,{message:{id:'one',role,content}}));
 const dom=new JSDOM(source),document=dom.window.document;
 const parsed=renderNativeChatContent(content,role==='user');
 assert.deepEqual([...document.querySelectorAll('pre>code')].map(node=>node.textContent),parsed.chunks.filter(chunk=>chunk.type==='code').map(chunk=>chunk.text),'source fenced code '+role+' '+JSON.stringify(content));
 assert.deepEqual([...document.querySelectorAll('.whitespace-pre-wrap')].map(node=>node.textContent),parsed.chunks.filter(chunk=>chunk.type==='text').map(chunk=>role==='user'?chunk.text:chatInlineParts(chunk.text).map(part=>part.text).join('')),'source text/inline code '+role+' '+JSON.stringify(content));
 assert.equal(document.querySelectorAll('img').length,0,'raw text stays escaped');
 dom.window.close();
}
console.log('33 actual React-rendered Chat content cases match native user/inline/fenced parsing, including empty/unclosed fences, system role and escaped HTML.');

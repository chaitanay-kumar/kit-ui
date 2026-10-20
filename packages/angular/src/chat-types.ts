export type MessageRole='user'|'assistant'|'system';
export type MessageStatus='sending'|'sent'|'delivered'|'failed'|'streaming';
export interface ChatAttachment{id:string;name:string;size?:string;type?:'image'|'file'|'code';url?:string}
export interface ChatMessageItem{id:string;role:MessageRole;content:string;author?:string;timestamp?:string;status?:MessageStatus;attachments?:ChatAttachment[]}
export interface ChatConversationThread{id:string;title:string;timestamp:string;group?:'Today'|'Yesterday'|'Previous'|string}
export type ChatSendMessage=(content:string,attachments?:ChatAttachment[])=>void;

export interface ChatInlinePart{type:'text'|'code';text:string}
export interface ChatContentChunk{type:'text'|'code';language?:string;text:string}
export interface ChatRenderedContent{mode:'user'|'inline'|'blocks';chunks:ChatContentChunk[]}

/** This is the source's small backtick renderer, not a Markdown/HTML interpreter. */
export function chatInlineParts(content:string):ChatInlinePart[]{
 return content.split(/(`[^`]+`)/g).map(part=>part.startsWith('`')&&part.endsWith('`')?{type:'code',text:part.slice(1,-1)}:{type:'text',text:part});
}

/** Preserve the source's fence boundaries, empty blocks and unfinished-fence behavior. */
export function renderNativeChatContent(content:string,isUser:boolean):ChatRenderedContent{
 if(isUser)return{mode:'user',chunks:[{type:'text',text:content}]};
 if(!content.includes('```'))return{mode:'inline',chunks:[{type:'text',text:content}]};
 const chunks:ChatContentChunk[]=[];
 let currentText:string[]=[],inCode=false,codeLang='',codeLines:string[]=[];
 for(const line of content.split('\n')){
  if(line.trim().startsWith('```')){
   if(!inCode){
    if(currentText.length){chunks.push({type:'text',text:currentText.join('\n')});currentText=[]}
    inCode=true;codeLang=line.trim().replace(/^```/,'')||'text';codeLines=[];
   }else{inCode=false;chunks.push({type:'code',language:codeLang,text:codeLines.join('\n')});codeLines=[]}
  }else if(inCode)codeLines.push(line);else currentText.push(line);
 }
 if(inCode&&codeLines.length)chunks.push({type:'code',language:codeLang,text:codeLines.join('\n')});
 else if(currentText.length)chunks.push({type:'text',text:currentText.join('\n')});
 return{mode:'blocks',chunks};
}

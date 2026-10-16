import {dependencyTracePort} from './angular-dependency-trace';
import { advancedDataTablePort } from './angular-data-table';
/** Native implementations for components with independent state/data contracts. */
export const COMPLEX_PORTS = [
  advancedDataTablePort,
  dependencyTracePort,
  {
    id: "pricing",
    kind: "plain" as const,
    description:
      "Selectable pricing plans with monthly/yearly billing, real price inputs and an application-owned selection event.",
    inputs: [
      "plans: KitPlan[]",
      "yearly: boolean (two-way)",
      "yearlyDiscount: number",
      "currency: string",
      "disabled: boolean",
    ],
    outputs: ["planSelect: { plan: KitPlan; yearly: boolean }"],
    template: `<section class="kit-control kit-stack"><label class="kit-row"><input type="checkbox" [checked]="yearly()" [disabled]="disabled()" (change)="yearly.set($any($event.target).checked)" />Yearly billing · {{yearlyDiscount()}}% discount</label><div class="k-pricing">@for(plan of plans();track plan.id){<article class="kit-surface kit-stack" [class.k-featured]="plan.featured"><h3>{{plan.label}}</h3><p class="k-price">{{price(plan)}} <small>/{{yearly()?'year':'month'}}</small></p><ul>@for(feature of plan.features;track $index){<li>{{feature}}</li>}</ul><button type="button" [disabled]="disabled()" (click)="planSelect.emit({plan,yearly:yearly()})">Choose {{plan.label}}</button></article>}</div></section>`,
    body: `readonly plans=input<KitPlan[]>([{id:'starter',label:'Starter',price:12,features:['Core components','One workspace']},{id:'team',label:'Team',price:24,features:['Shared workspace','Team controls'],featured:true}]);readonly yearly=model(false);readonly yearlyDiscount=input(20);readonly currency=input('USD');readonly disabled=input(false);readonly planSelect=output<{plan:KitPlan;yearly:boolean}>();price(plan:KitPlan):string{const value=this.yearly()?plan.price*12*(1-Math.max(0,Math.min(100,this.yearlyDiscount()))/100):plan.price;try{return new Intl.NumberFormat('en',{style:'currency',currency:this.currency()}).format(value);}catch{return value.toFixed(2)+' '+this.currency();}}`,
  },
  {
    id: "smart-comparison",
    kind: "plain" as const,
    description:
      "Searchable plan comparison with differences-only filtering, collapsible categories and plan selection.",
    inputs: [
      "plans: KitPlan[]",
      "features: KitCompareFeature[]",
      "categories: KitCompareCategory[]",
      "selected: string (two-way)",
      "disabled: boolean",
    ],
    outputs: ["planSelect: KitPlan"],
    imports: "import type { KitCompareCategory } from './port-types';",
    template: `<section class="kit-control kit-surface kit-stack"><label>Find a feature<input type="search" [value]="query()" [disabled]="disabled()" (input)="query.set($any($event.target).value)" /></label><label class="kit-row"><input type="checkbox" [checked]="differences()" [disabled]="disabled()" (change)="differences.set($any($event.target).checked)" />Show differences only</label><div class="k-table-scroll" tabindex="0" aria-label="Plan comparison"><table><thead><tr><th scope="col">Feature</th>@for(plan of plans();track plan.id){<th scope="col"><button type="button" [disabled]="disabled()" [attr.aria-pressed]="selected()===plan.id" (click)="selected.set(plan.id);planSelect.emit(plan)">{{plan.label}}</button></th>}</tr></thead><tbody>@for(group of groups();track group.id){<tr><th [attr.colspan]="plans().length+1"><button type="button" [attr.aria-expanded]="!collapsed().includes(group.id)" (click)="toggle(group.id)">{{group.label}}</button></th></tr>@if(!collapsed().includes(group.id)){@for(feature of filtered(group.features);track feature.id){<tr><th scope="row">{{feature.label}}</th>@for(plan of plans();track plan.id){<td>{{cell(feature.values[plan.id])}}</td>}</tr>}@empty{<tr><td [attr.colspan]="plans().length+1">No matching features.</td></tr>}}}</tbody></table></div></section>`,
    body: `readonly plans=input<KitPlan[]>([{id:'starter',label:'Starter',price:12,features:[]},{id:'team',label:'Team',price:24,features:[]}]);readonly features=input<KitCompareFeature[]>([{id:'components',label:'Components',values:{starter:true,team:true}},{id:'members',label:'Members',values:{starter:'1',team:'Unlimited'}},{id:'support',label:'Priority support',values:{starter:false,team:true}}]);readonly categories=input<KitCompareCategory[]>([]);readonly selected=model('');readonly disabled=input(false);readonly planSelect=output<KitPlan>();readonly query=signal('');readonly differences=signal(false);readonly collapsed=signal<string[]>([]);readonly groups=computed(()=>this.categories().length?this.categories():[{id:'features',label:'Plan features',features:this.features()}]);filtered(features:KitCompareFeature[]):KitCompareFeature[]{return features.filter(f=>f.label.toLowerCase().includes(this.query().toLowerCase())&&(!this.differences()||new Set(this.plans().map(p=>f.values[p.id])).size>1));}cell(value:string|boolean|undefined):string{return value===true?'Included':value===false?'Not included':value??'—';}toggle(id:string):void{this.collapsed.update(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);}`,
  },
  {
    id: "chat",
    kind: "plain" as const,
    description:
      "An application-connected conversation with sending, cancellation, retry, preserved drafts and accessible message history.",
    inputs: [
      "messages: KitMessage[] (two-way)",
      "sendHandler: KitChatHandler",
      "disabled: boolean",
      "label: string",
    ],
    outputs: ["messageSent: KitMessage"],
    template: `<section class="kit-control kit-surface kit-stack"><h3>{{label()}}</h3><ol class="k-chat-log" aria-label="Conversation">@for(message of messages();track message.id){<li [class.k-chat-user]="message.role==='user'"><strong>{{message.role==='user'?'You':'Assistant'}}</strong><p>{{message.text}}</p></li>}@empty{<li>No messages yet.</li>}</ol><form class="kit-stack" (submit)="send($event)"><label>Message<textarea [value]="draft()" [disabled]="disabled()||busy()" (input)="draft.set($any($event.target).value)" required rows="3"></textarea></label><button type="submit" [disabled]="disabled()||busy()||!draft().trim()||!sendHandler()">{{busy()?'Sending…':error()?'Retry message':'Send message'}}</button>@if(busy()){<button type="button" (click)="cancel()">Cancel</button>}</form>@if(!sendHandler()){<p>Connect a chat handler to send messages.</p>}@if(error()){<p role="alert">{{error()}}</p>}<p role="status">{{status()}}</p></section>`,
    body: `readonly messages=model<KitMessage[]>([]);readonly sendHandler=input<KitChatHandler>();readonly disabled=input(false);readonly label=input('Conversation');readonly draft=signal('');readonly busy=signal(false);readonly error=signal('');readonly status=signal('');readonly messageSent=output<KitMessage>();private controller?:AbortController;private destroyed=false;constructor(){inject(DestroyRef).onDestroy(()=>{this.destroyed=true;this.controller?.abort();});}async send(event:SubmitEvent):Promise<void>{event.preventDefault();const handler=this.sendHandler();const text=this.draft().trim();if(!handler||!text||this.disabled()||this.busy())return;const controller=new AbortController();this.controller=controller;this.error.set('');this.status.set('Sending message…');this.busy.set(true);try{const reply=await handler(text,controller.signal);if(this.destroyed||controller.signal.aborted)return;const message:KitMessage={id:crypto.randomUUID(),role:'user',text};this.messages.update(a=>[...a,message,{id:crypto.randomUUID(),role:'assistant',text:reply}]);this.messageSent.emit(message);this.draft.set('');this.status.set('Message received.');}catch(error){if(!this.destroyed&&!controller.signal.aborted){this.error.set(error instanceof Error?error.message:'Sending failed. Your draft is preserved.');this.status.set('Sending failed.');}}finally{if(!this.destroyed&&this.controller===controller){this.busy.set(false);this.controller=undefined;}}}cancel():void{this.controller?.abort();this.controller=undefined;this.busy.set(false);this.status.set('Cancelled. Your draft is preserved.');}`,
  },
  {
    id: "ai-response",
    kind: "plain" as const,
    description:
      "Application-provided response text with optional progressive reveal, reasoning disclosure, sources and clipboard feedback.",
    inputs: [
      "text: string",
      "reasoning: string",
      "sources: KitItem[]",
      "state: 'idle' | 'pending' | 'success' | 'error'",
      "error: string",
      "streaming: boolean",
      "charactersPerSecond: number",
    ],
    outputs: ["retry: void"],
    template: `<article class="kit-control kit-surface kit-stack" [attr.aria-busy]="state()==='pending'"><h3>Assistant response</h3>@if(reasoning()){<details><summary>Reasoning details</summary><p>{{reasoning()}}</p></details>}<p class="k-response-text">{{rendered()}}</p>@if(state()==='pending'){<p role="status">Response pending…</p>}@if(state()==='error'){<p role="alert">{{error()||'Response failed.'}}</p><button type="button" (click)="retry.emit()">Retry response</button>}<ul>@for(source of sources();track source.id){<li>@if(source.href){<a [href]="source.href" target="_blank" rel="noopener noreferrer">{{source.label}}</a>}@else{ {{source.label}} }</li>}</ul><button type="button" [disabled]="!text()" (click)="copy()">Copy response</button><p role="status">{{status()}}</p></article>`,
    body: `readonly text=input('An application-provided answer appears here.');readonly reasoning=input('');readonly sources=input<KitItem[]>([]);readonly state=input<'idle'|'pending'|'success'|'error'>('idle');readonly error=input('');readonly streaming=input(false);readonly charactersPerSecond=input(40);readonly rendered=signal('');readonly status=signal('');readonly retry=output<void>();private timer:ReturnType<typeof setInterval>|undefined;constructor(){inject(DestroyRef).onDestroy(()=>clearInterval(this.timer));effect(()=>{const text=this.text();const streaming=this.streaming();const speed=Math.max(1,Math.min(1000,this.charactersPerSecond()));clearInterval(this.timer);if(!streaming||typeof matchMedia==='undefined'||matchMedia('(prefers-reduced-motion: reduce)').matches){this.rendered.set(text);return;}let index=0;this.rendered.set('');this.timer=setInterval(()=>{index=Math.min(text.length,index+Math.max(1,Math.ceil(speed/20)));this.rendered.set(text.slice(0,index));if(index>=text.length)clearInterval(this.timer);},50);});}async copy():Promise<void>{try{await navigator.clipboard.writeText(this.text());this.status.set('Copied.');}catch{this.status.set('Clipboard unavailable. Select the response to copy it manually.');}}`,
  },
];

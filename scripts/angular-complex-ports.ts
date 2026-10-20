import {chatPort} from './angular-chat';
import {smartComparisonPort} from './angular-smart-comparison';
import {pricingPort} from './angular-pricing';
import {dependencyTracePort} from './angular-dependency-trace';
import { advancedDataTablePort } from './angular-data-table';
/** Native implementations for components with independent state/data contracts. */
export const COMPLEX_PORTS = [
  advancedDataTablePort,
  dependencyTracePort,
  pricingPort,
  smartComparisonPort,
  chatPort,
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

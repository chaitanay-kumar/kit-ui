import {Component,DestroyRef,inject,signal} from '@angular/core';
import {KitAiResponseComponent,type AIResponseStatus} from 'kit-ui-angular';
const answer='# Native response\n\nThe application supplies **content** and status.\n\n- Markdown blocks\n- Independent clipboard feedback\n\n```typescript\nconst framework = "Angular";\n```';
@Component({selector:'kit-ai-response-demo',standalone:true,imports:[KitAiResponseComponent],host:{style:'display:block;width:100%;max-width:900px;margin:auto'},template:`<kit-ai-response [content]="content()" [status]="status()" [sources]="sources" [onRegenerate]="regenerate" [onFeedback]="feedback"/><p role="status" style="font:12px var(--font-sans);margin-top:12px;color:var(--text-muted)">{{message()}}</p>`})
export class AiResponseDemoComponent{
 readonly content=signal(answer);readonly status=signal<AIResponseStatus>('complete');readonly message=signal('Local simulation; no model request.');readonly sources=[{id:'guide',title:'Application documentation',url:'https://example.com/docs',snippet:'Replace with your application sources.'}];private timer:ReturnType<typeof setTimeout>|undefined;
 readonly regenerate=()=>{this.content.set('');this.status.set('generating');this.message.set('Running the local simulation.');this.timer=setTimeout(()=>{this.content.set(answer);this.status.set('complete');this.message.set('Local simulation complete; no model request.');this.timer=undefined},300)};
 readonly feedback=(type:'like'|'dislike')=>this.message.set('Feedback: '+type+' (local only).');
 constructor(){inject(DestroyRef).onDestroy(()=>clearTimeout(this.timer))}
}

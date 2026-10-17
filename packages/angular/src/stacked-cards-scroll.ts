/** Source start/start -> end/end progress, measured through offset parents (not transformed rects). */
export class StackedCardsScroll{
 private frame=0;private window:Window;private destroyed=false;
 constructor(private target:HTMLElement){this.window=target.ownerDocument.defaultView!;this.window.addEventListener('scroll',this.schedule,{passive:true});this.window.addEventListener('resize',this.schedule);this.schedule()}
 readonly schedule=():void=>{if(!this.destroyed&&!this.frame)this.frame=this.window.requestAnimationFrame(this.update)};
 private update=():void=>{this.frame=0;if(this.destroyed)return;let top=0,node:HTMLElement|null=this.target;while(node&&node!==this.target.ownerDocument.scrollingElement){top+=node.offsetTop;node=node.offsetParent as HTMLElement|null}const height=this.target.ownerDocument.documentElement.clientHeight,distance=this.target.clientHeight-height;const progress=distance===0?0:Math.max(0,Math.min(1,(this.window.scrollY-top)/distance));const wrappers=Array.from(this.target.children) as HTMLElement[],total=wrappers.length;wrappers.forEach((wrapper,index)=>{const article=wrapper.firstElementChild as HTMLElement,begin=index/total,target=total>1?1-(total-index-1)*.075:1,t=Math.max(0,Math.min(1,(progress-begin)/(1-begin))),scale=1+(target-1)*t;article.style.transform=scale===1?'none':'scale('+scale+')'})};
 destroy():void{this.destroyed=true;this.window.cancelAnimationFrame(this.frame);this.window.removeEventListener('scroll',this.schedule);this.window.removeEventListener('resize',this.schedule)}
}

/** Match the source clipboard utility: the caller does not await its result. */
export function copyDataDetails(text:string,view:Window):Promise<boolean>{
 const clipboard=view.navigator.clipboard;
 if(clipboard&&view.isSecureContext)return clipboard.writeText(text).then(()=>true).catch(()=>false);
 const document=view.document,area=document.createElement('textarea');
 area.value=text;area.style.position='fixed';area.style.left='-999999px';area.style.top='-999999px';document.body.appendChild(area);area.focus();area.select();
 return new Promise(resolve=>{const successful=document.execCommand('copy');area.remove();resolve(successful)});
}
/** Each click has its own reset, as in React; destruction cancels pending resets. */
export class DataDetailsCopyFeedback{
 private timers=new Set<number>();
 constructor(private view:Window,private set:(value:string|null)=>void){}
 copy(event:MouseEvent,text:string,id:string):void{event.stopPropagation();void copyDataDetails(text,this.view);this.set(id);const timer=this.view.setTimeout(()=>{this.timers.delete(timer);this.set(null)},2000);this.timers.add(timer)}
 destroy():void{for(const timer of this.timers)this.view.clearTimeout(timer);this.timers.clear()}
}

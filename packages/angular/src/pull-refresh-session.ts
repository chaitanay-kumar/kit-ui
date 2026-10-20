import {calculateDampedPull,DEFAULT_FINANCIAL_DATA,refreshDemoFinancialData,type FinancialDataPoint,type PullState,type PullStatus} from './pull-to-refresh-data';

export interface PullRefreshOptions{onRefresh?:()=>void|Promise<void>;threshold:number;maxPull:number;resistance:number;refreshingHoldOffset:number;disabled:boolean}
export interface PullRefreshMotion{set:(value:number)=>void;spring:(value:number,stiffness:number,damping:number,mass:number)=>void;destroy:()=>void}
export interface PullRefreshClock{now:()=>number;setTimeout:(callback:()=>void,duration:number)=>number;clearTimeout:(id:number)=>void}

/** Source lifecycle, including fast flicks, silent failures and overlapping complete holds. */
export class PullRefreshSession{
 status:PullStatus='idle';progress=0;distance=0;demoValues:Record<string,FinancialDataPoint>=DEFAULT_FINANCIAL_DATA;
 private dragging=false;private startX=0;private startY=0;private startTime=0;private disposed=false;
 private waits=new Map<number,(completed:boolean)=>void>();
 constructor(private options:()=>PullRefreshOptions,private motion:PullRefreshMotion,private clock:PullRefreshClock,private changed:()=>void,private random:()=>number=Math.random){}
 get state():PullState{return{status:this.status,pullDistance:this.distance,progress:this.progress,threshold:this.options().threshold}}
 down(x:number,y:number,eligible=true):void{
  if(this.disposed||!eligible||this.options().disabled||this.status==='refreshing'||this.status==='complete')return;
  this.dragging=true;this.startX=x;this.startY=y;this.startTime=this.clock.now();
 }
 move(x:number,y:number):void{
  const options=this.options();if(this.disposed||!this.dragging||options.disabled||this.status==='refreshing'||this.status==='complete')return;
  const dy=y-this.startY,dx=x-this.startX;
  if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>12)return;
  if(dy>0){this.distance=calculateDampedPull(dy,options.threshold,options.maxPull,options.resistance);this.motion.set(this.distance);this.progress=Math.min(1,this.distance/options.threshold);this.status=this.distance>=options.threshold?'ready':'pulling'}
  else{this.motion.set(0);this.progress=0;this.status='idle'}
  // The source upward branch deliberately retains currentPullYRef until release.
  this.changed();
 }
 up():void{
  if(this.disposed||!this.dragging)return;this.dragging=false;
  const velocity=this.distance/Math.max(1,this.clock.now()-this.startTime);
  if(this.status==='ready'||this.distance>=this.options().threshold||velocity>.35)void this.refresh();
  else{this.motion.spring(0,300,26,.7);this.status='idle';this.progress=0;this.distance=0;this.changed()}
 }
 key(event:Pick<KeyboardEvent,'key'|'metaKey'|'ctrlKey'|'preventDefault'>):void{if((event.key==='r'||event.key==='R')&&!event.metaKey&&!event.ctrlKey){event.preventDefault();void this.refresh()}}
 private wait(duration:number):Promise<boolean>{return new Promise(resolve=>{const id=this.clock.setTimeout(()=>{this.waits.delete(id);resolve(!this.disposed)},duration);this.waits.set(id,resolve)})}
 async refresh():Promise<void>{
  const options=this.options();if(this.disposed||options.disabled||this.status==='refreshing')return;
  this.status='refreshing';this.progress=1;this.motion.spring(options.refreshingHoldOffset,300,26,.75);this.changed();
  try{
   const callback=options.onRefresh;
   if(callback)await callback();
   else{if(!await this.wait(1100))return;this.demoValues=refreshDemoFinancialData(this.demoValues,this.random)}
   if(this.disposed)return;
   this.status='complete';this.changed();await this.wait(380);
  }catch{if(!this.disposed){this.status='idle';this.changed()}}
  finally{if(!this.disposed){this.motion.spring(0,260,28,.85);this.status='idle';this.progress=0;this.distance=0;this.changed()}}
 }
 destroy():void{if(this.disposed)return;this.disposed=true;this.dragging=false;for(const[id,resolve]of this.waits){this.clock.clearTimeout(id);resolve(false)}this.waits.clear();this.motion.destroy()}
}

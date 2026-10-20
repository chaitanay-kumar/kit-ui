import {Directive,ElementRef,ErrorHandler,computed,inject,input,signal,viewChild} from '@angular/core';
import {FormPart} from './form-parts';
import {invokeNativeEventCallback} from './native-event-callback';
import {DEFAULT_FINANCIAL_DATA,generateSmoothPath,type FinancialDataPoint} from './pull-to-refresh-data';
import {nativeClasses} from './native-classes';
import {FINANCIAL_CLASSES} from './financial-stats-classes';
let financialSerial=0;

/** State contract of the independently exported source FinancialStatsCard. */
@Directive()
export abstract class FinancialStatsController extends FormPart<HTMLDivElement>{
 readonly componentId='financial-native-'+ ++financialSerial;
 readonly panelClass=computed(()=>nativeClasses('kfs-card',FINANCIAL_CLASSES.card,this.className()));
 readonly mainValue=input<string|undefined>();readonly change=input<string|undefined>();readonly context=input<string|undefined>();
 readonly timeRanges=input<string[],string[]|undefined>(['1H','4H','1D'],{transform:value=>value===undefined?['1H','4H','1D']:value});
 readonly selectedTimeRange=input<string|undefined>();readonly onTimeRangeChange=input<((range:string)=>void)|undefined>();
 readonly dataMap=input<Record<string,FinancialDataPoint>,Record<string,FinancialDataPoint>|undefined>(DEFAULT_FINANCIAL_DATA,{transform:value=>value===undefined?DEFAULT_FINANCIAL_DATA:value});
 readonly isRefreshing=input<boolean,boolean|undefined>(false,{transform:value=>value===undefined?false:value});
 readonly showMetrics=input<boolean,boolean|undefined>(true,{transform:value=>value===undefined?true:value});
 readonly showActions=input<boolean,boolean|undefined>(false,{transform:value=>value===undefined?false:value});
 readonly onActionClick=input<((action:'deposit'|'withdraw')=>void)|undefined>();
 readonly chart=viewChild<ElementRef<SVGSVGElement>>('chart');
 readonly internalRange=signal('1D');readonly scrubIndex=signal<number|null>(null);
 readonly activeRange=computed(()=>this.selectedTimeRange()||this.internalRange());
 readonly currentData=computed(()=>this.dataMap()[this.activeRange()]||DEFAULT_FINANCIAL_DATA['1D']);
 readonly geometry=computed(()=>generateSmoothPath(this.currentData().points,320,110,12,14));
 readonly activePoint=computed(()=>{const index=this.scrubIndex();return index!==null&&this.geometry().points[index]?this.geometry().points[index]:this.geometry().endpoint});
 readonly activeTimestamp=computed(()=>{const index=this.scrubIndex();return index!==null&&this.currentData().timestamps?.[index]?this.currentData().timestamps![index]:null});
 readonly displayContext=computed(()=>this.activeTimestamp()||this.context()||this.currentData().context);
 readonly displayChange=computed(()=>this.change()||this.currentData().change);
 readonly isNegative=computed(()=>this.displayChange().startsWith('−')||this.displayChange().startsWith('-'));
 readonly trendStroke=computed(()=>this.isNegative()?'#ef4444':'#E5E5E5');readonly trendGradient=computed(()=>this.isNegative()?'#ef4444':'#A3A3A3');
 readonly displayMain=computed(()=>{const data=this.currentData(),index=this.scrubIndex();if(index!==null&&data.points[index]!==undefined){const min=Math.min(...data.points),max=Math.max(...data.points),pct=(data.points[index]-min)/(max-min||1);return '$'+(data.value*(.98+pct*.04)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}return this.mainValue()||data.displayValue});
 readonly valueParts=computed(()=>this.displayMain().includes('.')?this.displayMain().split('.').slice(0,2):[this.displayMain(),'00']);
 private readonly errors=inject(ErrorHandler);
 selectRange(range:string,event:MouseEvent):void{invokeNativeEventCallback(()=>{this.scrubIndex.set(null);if(this.selectedTimeRange()===undefined)this.internalRange.set(range);const callback=this.onTimeRangeChange();callback?.(range)},event,this.errors)}
 action(action:'deposit'|'withdraw',event:MouseEvent):void{invokeNativeEventCallback(()=>{const callback=this.onActionClick();callback?.(action)},event,this.errors)}
 scrub(event:PointerEvent):void{const chart=this.chart()?.nativeElement,points=this.geometry().points;if(!chart||points.length===0)return;const rect=chart.getBoundingClientRect(),relative=Math.max(0,Math.min(rect.width,event.clientX-rect.left)),closest=Math.round(relative/rect.width*(points.length-1));this.scrubIndex.set(Math.max(0,Math.min(points.length-1,closest)))}
 leaveChart():void{this.scrubIndex.set(null)}
}

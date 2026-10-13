export const liquidTogglePort = {
  description:
    "A controlled or uncontrolled accessible switch with directional keyboard control, labels, sizing and a morphing SVG blob.",
  template: `<button type="button" role="switch" [attr.aria-checked]="isOn()" [attr.aria-labelledby]="labelId" [disabled]="disabled()" [tabIndex]="disabled()?-1:0" [class]="'k-liquid-toggle '+(disabled()?'k-liquid-disabled ':'')+className()" [style.width.px]="width()" [style.height.px]="height()" (click)="toggle()" (keydown)="key($event)"><span [id]="labelId" class="sr-only">{{isOn()?onLabel():offLabel()}}</span>@if(showLabels()){<span class="k-liquid-off" [style.opacity]="isOn()?0:.6">OFF</span><span class="k-liquid-on" [style.opacity]="isOn()?.7:0">ON</span>}<svg [attr.width]="width()" [attr.height]="height()" [attr.viewBox]="'0 0 '+width()+' '+height()" aria-hidden="true"><defs><radialGradient [id]="gradientId" cx="0.35" cy="0.35" r="0.85"><stop offset="0%" [attr.stop-color]="blobColor()"/><stop offset="100%" [attr.stop-color]="blobColor()" stop-opacity=".75"/></radialGradient></defs><path [attr.d]="blobPath()" [attr.fill]="'url(#'+gradientId+')'"/></svg></button>`,
  body: `readonly value=input<boolean>();readonly defaultValue=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly onChange=input<(value:boolean)=>void>();readonly disabled=input<boolean,boolean|undefined>(false,{transform:value=>value??false});readonly offLabel=input<string,string|undefined>('Off',{transform:value=>value??'Off'});readonly onLabel=input<string,string|undefined>('On',{transform:value=>value??'On'});readonly accentColor=input<string>();readonly className=input<string,string|undefined>('',{transform:value=>value??''});readonly showLabels=input<boolean,boolean|undefined>(true,{transform:value=>value??true});readonly width=input<number,number|undefined>(56,{transform:value=>value??56});readonly height=input<number,number|undefined>(32,{transform:value=>value??32});readonly internal=signal(false);readonly uid=++liquidToggleId;readonly labelId='liquid-toggle-label-'+this.uid;readonly gradientId='liquid-blob-grad-'+this.uid;readonly isOn=computed(()=>this.value()??this.internal());readonly blobColor=computed(()=>this.accentColor()??'#0A0A0A');private initialized=false;constructor(){effect(()=>{this.defaultValue();untracked(()=>{if(this.value()===undefined&&!this.initialized){this.initialized=true;this.internal.set(this.defaultValue());}});});}set(next:boolean):void{if(this.disabled())return;if(this.value()===undefined)this.internal.set(next);this.onChange()?.(next);}toggle():void{this.set(!this.isOn());}key(event:KeyboardEvent):void{if(event.key===' '||event.key==='Enter'){event.preventDefault();event.stopPropagation();this.toggle();}else if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();if(!this.isOn())this.set(true);}else if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();if(this.isOn())this.set(false);}}readonly blobPath=computed(()=>buildLiquidBlob(this.width(),this.height(),this.isOn()?1:0));`,
  imports: `let liquidToggleId=0;\nfunction buildLiquidBlob(width:number,height:number,t:number):string{const padding=4,r=(height-padding*2)/2,cx=padding+r+(width-padding*2-r*2)*t,cy=height/2,points=12,pairs:Array<[number,number]>=[];for(let i=0;i<points;i++){const angle=Math.PI*2*i/points-Math.PI/2;pairs.push([cx+Math.cos(angle)*r,cy+Math.sin(angle)*r]);}const mid=(a:[number,number],b:[number,number]):[number,number]=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const start=mid(pairs[pairs.length-1],pairs[0]);let d='M '+start[0].toFixed(2)+' '+start[1].toFixed(2);for(let i=0;i<points;i++){const control=pairs[i],end=mid(control,pairs[(i+1)%points]);d+=' Q '+control[0].toFixed(2)+' '+control[1].toFixed(2)+' '+end[0].toFixed(2)+' '+end[1].toFixed(2);}return d+' Z';}`,
  stylesFile: "./liquid-toggle.css",
  hostMetadata: "{style:'display:contents'}",
  inputs: [
    "value: boolean",
    "defaultValue: boolean",
    "onChange: (value: boolean) => void",
    "disabled: boolean",
    "offLabel: string",
    "onLabel: string",
    "accentColor: string",
    "className: string",
    "showLabels: boolean",
    "width: number",
    "height: number",
  ],
  outputs: [],
};

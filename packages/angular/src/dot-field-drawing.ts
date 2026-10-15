export interface DotFieldOptions{dotRadius:number;dotSpacing:number;gradientFrom:string;gradientTo:string}
export class DotFieldDrawing{
  private observer:ResizeObserver|undefined;
  constructor(private root:HTMLElement,private canvas:HTMLCanvasElement,private options:DotFieldOptions){this.observe()}
  update(options:DotFieldOptions):void{this.options=options;this.observer?.disconnect();this.observe()}
  private observe():void{
    const rect=this.root.getBoundingClientRect();this.draw(rect.width,rect.height);
    this.observer=new ResizeObserver(entries=>{for(const entry of entries){const {width,height}=entry.contentRect;if(width>0&&height>0)this.draw(width,height)}});this.observer.observe(this.root);
  }
  draw(width:number,height:number):void{
    if(width<=0||height<=0)return;const ctx=this.canvas.getContext('2d',{alpha:true});if(!ctx)return;
    const dpr=Math.min(window.devicePixelRatio||1,2),o=this.options;
    this.canvas.width=Math.floor(width*dpr);this.canvas.height=Math.floor(height*dpr);this.canvas.style.width=width+'px';this.canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const gradient=ctx.createLinearGradient(0,0,width,height);gradient.addColorStop(0,o.gradientFrom);gradient.addColorStop(1,o.gradientTo);ctx.fillStyle=gradient;
    const step=o.dotRadius+o.dotSpacing;if(step<=0)return;
    const cols=Math.floor(width/step),rows=Math.floor(height/step),padX=width%step/2,padY=height%step/2,rad=o.dotRadius/2;
    ctx.beginPath();for(let row=0;row<rows;row++){const y=padY+row*step+step/2;for(let col=0;col<cols;col++){const x=padX+col*step+step/2;ctx.moveTo(x+rad,y);ctx.arc(x,y,rad,0,Math.PI*2)}}ctx.fill();
  }
  destroy():void{this.observer?.disconnect()}
}

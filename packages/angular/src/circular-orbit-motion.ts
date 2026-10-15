import {batch22FrameDelta} from './batch22-frame';
export interface OrbitItem{id:string;src:string;alt?:string;size?:number;className?:string}
export interface CircularOrbitOptions{items:OrbitItem[];speed:number;radius:number;pauseOnHover:boolean}
export function orbitGeometry(index:number,total:number,rotation:number,radius:number){
  const angle=rotation+Math.PI*2*index/total,depth=(Math.cos(angle)+1)/2;
  // React assigns a bare pixel value to filter. Browsers ignore it; retain that contract.
  return {x:Math.cos(angle)*radius,y:Math.sin(angle)*radius,scale:.42+depth*.58,opacity:.42+depth*.58,rotate:Math.sin(angle)*4,zIndex:Math.round(10+depth*100),filter:`${(1-depth)*1.2}px`};
}
export class CircularOrbitMotion{
  private options:CircularOrbitOptions;private rotation=0;private targetSpeed:number;private currentSpeed:number;private width:number|null=null;
  private readonly reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  private observer:ResizeObserver|undefined;private frame=0;private last:number|undefined;
  constructor(private root:HTMLElement,private container:HTMLElement,options:CircularOrbitOptions){
    this.options=options;this.targetSpeed=options.speed;this.currentSpeed=options.speed;
    this.root.addEventListener('mouseenter',this.enter);this.root.addEventListener('mouseleave',this.leave);
    if(typeof ResizeObserver!=='undefined'){this.observer=new ResizeObserver(entries=>{if(entries[0]){this.width=entries[0].contentRect.width;this.paint()}});this.observer.observe(container)}
    this.paint();if(!this.reduced)this.frame=requestAnimationFrame(this.tick);
  }
  update(options:CircularOrbitOptions):void{this.options=options;this.paint()}
  private enter=()=>{if(this.options.pauseOnHover)this.targetSpeed=0};
  private leave=()=>{if(this.options.pauseOnHover)this.targetSpeed=this.options.speed};
  private tick=(now:number)=>{const delta=batch22FrameDelta(now,this.last);this.last=now;this.currentSpeed+=(this.targetSpeed-this.currentSpeed)*.08;this.rotation+=delta*this.currentSpeed;this.paint();this.frame=requestAnimationFrame(this.tick)};
  paint():void{
    const radius=this.width===null?this.options.radius:Math.max(40,Math.min(this.options.radius,this.width/2-46-8));
    const tiles=this.container.querySelectorAll<HTMLElement>('.k-orbit-tile');
    tiles.forEach((tile,index)=>{const g=orbitGeometry(index,this.options.items.length,this.rotation,radius);tile.style.transform=`translateX(${g.x}px) translateY(${g.y}px) scale(${g.scale}) rotate(${g.rotate}deg)`;tile.style.opacity=String(g.opacity);tile.style.zIndex=String(g.zIndex);tile.style.filter=g.filter});
  }
  destroy():void{cancelAnimationFrame(this.frame);this.observer?.disconnect();this.root.removeEventListener('mouseenter',this.enter);this.root.removeEventListener('mouseleave',this.leave)}
}
export const DEFAULT_ORBIT_ITEMS: OrbitItem[] = [
  { id: '01', src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=90', alt: 'Portrait' },
  { id: '02', src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500&q=90', alt: 'Landscape' },
  { id: '03', src: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&q=90', alt: 'Abstract artwork' },
  { id: '04', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=90', alt: 'Artwork' },
  { id: '05', src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=90', alt: 'Abstract artwork' },
  { id: '06', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=90', alt: 'Abstract artwork' },
  { id: '07', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&q=90', alt: 'Abstract artwork' },
  { id: '08', src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=90', alt: 'Abstract artwork' },
  { id: '09', src: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=500&q=90', alt: 'Nature' },
  { id: '10', src: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500&q=90', alt: 'Artwork' },
  { id: '11', src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&q=90', alt: 'Artwork' },
  { id: '12', src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&q=90', alt: 'Creative artwork' },
  { id: '13', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&q=90', alt: 'Abstract artwork' },
  { id: '14', src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=90', alt: 'Artwork' },
];

import {motionValue,springValue} from 'motion-dom';
import {animate} from 'framer-motion';
import {PullTranslateMotion} from '../../packages/angular/src/pull-refresh-motion';
const api=window as any;api.ready=false;
if(new URLSearchParams(location.search).get('framework')==='native'){
 let values={raw:0,smooth:0};const driver=new PullTranslateMotion(window,(raw,smooth)=>values={raw,smooth});
 api.set=(value:number)=>driver.set(value);api.spring=(value:number,stiffness:number,damping:number,mass:number)=>driver.spring(value,stiffness,damping,mass);api.read=()=>values;api.destroy=()=>driver.destroy();
}else{
 const raw=motionValue(0),smooth=springValue(raw,{stiffness:380,damping:28,mass:.65});
 api.set=(value:number)=>raw.set(value);api.spring=(value:number,stiffness:number,damping:number,mass:number)=>animate(raw,value,{type:'spring',stiffness,damping,mass});api.read=()=>({raw:raw.get(),smooth:smooth.get()});api.destroy=()=>{raw.destroy();smooth.destroy()};
}
api.ready=true;

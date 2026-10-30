import {useLayoutEffect,type RefObject}from'react';
import {gsap}from'gsap';import{ScrollTrigger}from'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export {gsap,ScrollTrigger};
export type SceneConditions={desktop:boolean;motion:boolean};
/** Each section owns its timeline and cleanup; GSAP shares one scroll scheduler. */
export function useScrollScene(ref:RefObject<HTMLElement|null>,setup:(conditions:SceneConditions)=>void|(()=>void),deps:unknown[]=[]){
 useLayoutEffect(()=>{if(!ref.current)return;const context=gsap.context(()=>{const media=gsap.matchMedia();media.add({desktop:'(min-width: 768px)',motion:'(prefers-reduced-motion: no-preference)'},ctx=>setup(ctx.conditions as SceneConditions));return()=>media.revert();},ref);return()=>context.revert();},deps);
}
export function useMediaRefresh(){useLayoutEffect(()=>{let timer:ReturnType<typeof setTimeout>;let live=true;const refresh=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(live)ScrollTrigger.refresh();},120);};document.fonts.ready.then(refresh);document.addEventListener('load',refresh,true);addEventListener('pageshow',refresh);refresh();return()=>{live=false;clearTimeout(timer);document.removeEventListener('load',refresh,true);removeEventListener('pageshow',refresh);};},[]);}
export function pinConfig(section:HTMLElement,stage:HTMLElement,id:string,steps:number){return{id,trigger:section,pin:stage,start:'top top',end:()=>'+='+Math.round(innerHeight*steps),scrub:true,invalidateOnRefresh:true,anticipatePin:1,onUpdate:(self:ScrollTrigger)=>{section.dataset.progress=self.progress.toFixed(5);}};}

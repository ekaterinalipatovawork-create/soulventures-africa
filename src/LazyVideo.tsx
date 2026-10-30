import {useEffect,useRef,useState} from 'react';
export function LazyVideo({src,poster,eager=false,className='',label='Путешествие по Африке'}:{src:string;poster:string;eager?:boolean;className?:string;label?:string}){
 const ref=useRef<HTMLVideoElement>(null);const[ready,setReady]=useState(eager);
 useEffect(()=>{const video=ref.current;if(!video)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const io=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(visible){setReady(true);if(!reduced.matches)void video.play().catch(()=>{});}else video.pause();},{rootMargin:'150px'});io.observe(video);const change=()=>{if(reduced.matches)video.pause();};reduced.addEventListener('change',change);return()=>{io.disconnect();reduced.removeEventListener('change',change);video.pause();};},[]);
 useEffect(()=>{if(ready&&ref.current&&!matchMedia('(prefers-reduced-motion: reduce)').matches)void ref.current.play().catch(()=>{});},[ready]);
 return <video ref={ref} className={'media-video '+className} src={ready?src:undefined} poster={poster} autoPlay muted loop playsInline preload={eager?'metadata':'none'} aria-label={label}/>;
}

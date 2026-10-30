import type { ReactNode, CSSProperties } from 'react';
import {useViewport} from './Viewport';
import mobileContent from './mobile-content.json';
import * as assets from './design/assets';
export function MobileEditorial({name}:{name:string}){
 const data=mobileContent.find(n=>n.component===name);if(!data)return null;
 return <div className={'mobile-editorial mobile-'+name}><h2>{data.paragraphs.slice(0,2).join(' ')}</h2>{data.photos.map((p,i)=><img key={p} loading="lazy" decoding="async" src={(assets as Record<string,string>)[p]} alt={data.paragraphs[i+2]||'Soul Ventures Africa — путешествие'} />)}<div className="mobile-copy">{data.paragraphs.slice(2).map((p,i)=><p key={i}>{p}</p>)}</div></div>;
}
export function DesignFrame({children,height,name,id,className=''}:{children:ReactNode;height:number;name:string;id?:string;className?:string}){
 const {scale,mobile}=useViewport();
 return <section id={id} className={'design-frame '+className} aria-label={name} style={{'--scale':scale,'--scene-height':height,height:mobile?'auto':height*scale}as CSSProperties}>
 {mobile?<MobileEditorial name={name}/>:<div className="design-canvas" style={{height,transform:`scale(${scale})`}}>{children}</div>}
 </section>;
}

"""Convert the inspected Figma React context to native CSS modules and separate scenes.

No Tailwind dependency and no section screenshots. The generated image/SVG files
are discrete Figma assets. Node IDs are retained for asset/geometry verification.
"""
import re, json, base64
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'source/home-current-figma.tsx'
code = SOURCE.read_text()
out = ROOT / 'src/design'
out.mkdir(exist_ok=True)
assets = re.findall(r'const (\w+) = "(https://www.figma.com/api/mcp/asset/[^"]+)";', code)
exports = []
assetmeta = []
for name, url in assets:
    ext = url.rsplit('.', 1)[1]
    path = ROOT / 'public/assets/figma' / (name+'.'+ext)
    if ext != 'svg':
        im = Image.open(path)
        dest = path.with_suffix('.webp')
        im.save(dest, 'WEBP', quality=92, method=6, lossless=im.mode in ('RGBA','LA'))
        ext = 'webp'
        size = list(im.size)
    else:
        size = None
    exports.append(f'export const {name} = "/assets/figma/{name}.{ext}";')
    assetmeta.append(dict(name=name, source=url, file=f'/assets/figma/{name}.{ext}', size=size))
(out/'assets.ts').write_text('\n'.join(exports)+'\n')
(ROOT/'src/asset-manifest.json').write_text(json.dumps(assetmeta, indent=2))

# Extract the existing project fonts without printing embedded binary data.
fontdir = ROOT/'public/assets/fonts'
fontdir.mkdir(exist_ok=True)
fontcss=[]
fontsource=(ROOT.parent/'src/components/generated/AlbumFonts.css').read_text()
for block in re.findall(r'@font-face\s*\{(.*?)\}',fontsource,re.S):
    family=re.search(r"font-family:\s*'([^']+)'",block).group(1)
    data=re.search(r'base64,([^)]*)',block).group(1)
    (fontdir/(family+'.ttf')).write_bytes(base64.b64decode(data))
    fontcss.append(f'@font-face{{font-family:{family};font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/{family}.ttf) format("truetype")}}')
(fontdir/'Inter.woff2').write_bytes((ROOT.parent/'assets/fonts/inter-cyrillic.woff2').read_bytes())
fontcss.append('@font-face{font-family:Inter;font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/Inter.woff2) format("woff2")}')
(ROOT/'src/fonts.css').write_text('\n'.join(fontcss))

simple={
 'absolute':'position:absolute','relative':'position:relative','block':'display:block','flex':'display:flex','hidden':'display:none',
 'flex-col':'flex-direction:column','items-start':'align-items:flex-start','items-center':'align-items:center','items-end':'align-items:flex-end',
 'justify-center':'justify-content:center','justify-between':'justify-content:space-between','justify-end':'justify-content:flex-end',
 'content-stretch':'align-content:stretch','shrink-0':'flex-shrink:0','flex-none':'flex:none','w-full':'width:100%','h-full':'height:100%',
 'size-full':'width:100%;height:100%','inset-0':'inset:0','left-0':'left:0','top-0':'top:0','bottom-0':'bottom:0','right-0':'right:0',
 'max-w-none':'max-width:none','min-h-px':'min-height:1px','min-w-full':'min-width:100%','object-cover':'object-fit:cover','object-contain':'object-fit:contain',
 'pointer-events-none':'pointer-events:none','overflow-clip':'overflow:clip','overflow-hidden':'overflow:hidden',
 'font-bold':'font-weight:700','font-semibold':'font-weight:600','font-medium':'font-weight:500','font-normal':'font-weight:400',
 'not-italic':'font-style:normal','italic':'font-style:italic','text-left':'text-align:left','text-center':'text-align:center','text-right':'text-align:right',
 'whitespace-nowrap':'white-space:nowrap','whitespace-pre-wrap':'white-space:pre-wrap','cursor-pointer':'cursor:pointer','mb-0':'margin-bottom:0',
 'rounded-full':'border-radius:9999px','border-solid':'border-style:solid','border':'border:1px solid','opacity-0':'opacity:0',
 'grid':'display:grid','grow':'flex-grow:1','self-stretch':'align-self:stretch','-scale-y-100':'scale:1 -1','-scale-x-100':'scale:-1 1','h-px':'height:1px',
 '[word-break:break-word]':'overflow-wrap:break-word',
}
props={'w':'width','h':'height','size':'width|height','left':'left','right':'right','top':'top','bottom':'bottom','gap':'gap','leading':'line-height','tracking':'letter-spacing',
 'min-w':'min-width','min-h':'min-height','max-w':'max-width','max-h':'max-height','rounded':'border-radius','opacity':'opacity','z':'z-index',
 'p':'padding','px':'padding-left|padding-right','py':'padding-top|padding-bottom','pt':'padding-top','pb':'padding-bottom','pl':'padding-left','pr':'padding-right',
 'm':'margin','mx':'margin-left|margin-right','my':'margin-top|margin-bottom','mt':'margin-top','mb':'margin-bottom','ml':'margin-left','mr':'margin-right'}
def val(v):
    v=v.replace('_',' ')
    return re.sub(r'var\(--#[^,]+,([^)]*)\)',r'\1',v)
unknown=set()
def declaration(c):
    if c in simple:return simple[c]
    if re.fullmatch(r'opacity-\d+',c):return 'opacity:'+str(int(c.split('-')[1])/100)
    m=re.fullmatch(r"font-\['([^']+)'\]",c)
    if m:return 'font-family:'+m[1].split(':')[0]
    m=re.fullmatch(r'([\w-]+)-\[(.*)\]',c)
    if m:
        p,v=m[1],val(m[2])
        if p in props:return ';'.join(k+':'+v for k in props[p].split('|'))
        if p=='bg':return ('background-image:' if v.startswith('linear-gradient') else 'background-color:')+v
        if p=='text':return ('color:'+v[6:] if v.startswith('color:') else ('color:'+v if v.startswith(('#','var(')) or v in ['white','black'] else 'font-size:'+v))
        if p=='flex':return 'flex:'+v
        if p=='inset':
            v=v.replace(' ',' ');return 'inset:'+v
        if p=='drop-shadow':return 'filter:drop-shadow('+v+')'
        if p=='shadow':return 'box-shadow:'+v
        if p=='rotate':return 'rotate:'+v
        if p=='translate-x':return '--tx:'+v+';translate:var(--tx,0) var(--ty,0)'
        if p=='translate-y':return '--ty:'+v+';translate:var(--tx,0) var(--ty,0)'
        if p=='border':return ('border-color:'+v)
    m=re.fullmatch(r'(-?)rotate-(\d+)',c)
    if m:return 'rotate:'+m[1]+m[2]+'deg'
    m=re.fullmatch(r'(-?)translate-([xy])-1/2',c)
    if m:return '--t'+m[2]+':'+('-'if m[1]else'')+'50%;translate:var(--tx,0) var(--ty,0)'
    if c.startswith('[')and c.endswith(']')and':'in c:return val(c[1:-1])
    unknown.add(c);return ''

classes={};css=[]
def replaceclass(m):
    raw=m[1]
    if raw not in classes:
        name='d'+str(len(classes)).zfill(4);classes[raw]=name
        decl=';'.join(filter(None,(declaration(c)for c in raw.split())))
        css.append('.'+name+'{'+decl+'}')
    return 'className="'+classes[raw]+'"'

names=['HeroScene','AlbumIntroScene','CinematicScene','ElephantScene','HotelScene','LooseHotelScene','AudienceScene','MapScene','LodgeScene','TrustScene','FirstScene1','FirstScene2','FirstScene3','FirstScene4','ChronicleScene','FilmScene','PhotoStoriesScene','ReviewsScene','ClosingScene','FooterScene','LooseSingitaScene']
lines=code.splitlines();starts=[i for i,l in enumerate(lines)if l.startswith('      <div ')]
metadata=[]
for idx,start in enumerate(starts):
    end=next(i for i in range(start+1,len(lines))if lines[i]=='      </div>')
    markup='\n'.join(lines[start:end+1])
    # Generated context is exact geometry, translated to project-native CSS.
    markup=re.sub(r'className="([^"]*)"',replaceclass,markup)
    for name,_ in assets:pass
    # Add non-blocking media and preserve eager hero/poster load.
    markup=re.sub(r'<img alt=""', '<img alt="" decoding="async" loading="lazy"',markup)
    if names[idx]=='HeroScene':markup=markup.replace('loading="lazy"','loading="eager" fetchPriority="high"')
    used=[a for a,_ in assets if re.search(r'\{'+a+r'\}',markup)]
    body='import { '+', '.join(used)+' } from "./assets";\n'if used else ''
    (out/(names[idx]+'.tsx')).write_text(body+'export function '+names[idx]+'(){return (\n'+markup+'\n);}\n')
    node=re.search(r'data-node-id="([^"]+)"',markup).group(1)
    metadata.append(dict(component=names[idx],nodeId=node))
(ROOT/'src/design.css').write_text('\n'.join(css)+'\n')
(ROOT/'src/design-scenes.json').write_text(json.dumps(metadata,indent=2))
mobile=[]
for idx,start in enumerate(starts):
    end=next(i for i in range(start+1,len(lines))if lines[i]=='      </div>')
    markup='\n'.join(lines[start:end+1])
    paragraphs=[]
    for p in re.findall(r'<p\b[^>]*>(.*?)</p>',markup,re.S):
        p=re.sub(r'<[^>]*>','',p);p=p.replace('{` `}',' ');p=re.sub(r'\s+',' ',p).strip()
        if p:paragraphs.append(p)
    pics=list(dict.fromkeys(re.findall(r'src=\{(\w+)\}',markup)))
    pics=[p for p in pics if any(a['name']==p and a['size'] for a in assetmeta)]
    mobile.append(dict(component=names[idx],paragraphs=paragraphs,photos=pics))
(ROOT/'src/mobile-content.json').write_text(json.dumps(mobile,ensure_ascii=False,indent=2))
print(json.dumps({'scenes':len(metadata),'assets':len(assets),'cssRules':len(css),'unknownUtilities':sorted(unknown)}))

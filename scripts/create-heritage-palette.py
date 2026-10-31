"""Add a second, color-only entry without copying page markup or motion logic."""
from pathlib import Path
import re, json
root=Path(__file__).resolve().parents[1]
# Exact colors sampled from soulventuresafrica.ru, 2026-10-31.
palette={
 'paper-alt':('#fff7e6','#f5f4f3'), 'on-dark-alt':('#fff7e6','#ffffff'),
 'primary':('#0e3e38','#79593d'), 'ink':('#17334a','#605e5e'),
 'paper':('#fff6e8','#f5f4f3'), 'on-dark':('#fff6e8','#ffffff'),
 'surface-accent':('#59b5ee','#f5f4f3'), 'accent':('#59b5ee','#ae3117'),
 'surface-secondary':('#48c2c8','#ffffff'), 'secondary':('#48c2c8','#815f41'),
 'sand':('#e7d3af','#f7f5f3'), 'panel':('#071b3a','#79593d'),
 'forest':('#063d2b','#79593d'), 'deep-ink':('#142018','#605e5e'),
 'sea-ink':('#082e47','#605e5e'), 'yellow':('#ffc857','#ae3117'),
 'primary-a10':('#0e3e381a','#79593d1a'), 'primary-a90':('#0e3e38e6','#79593de6'),
 'ink-a70':('#17334ab3','#605e5eb3'), 'ink-a09':('#17334a16','#605e5e16'),
 'paper-a24':('#fff6e83d','#f5f4f33d'),
 'forest-rgb':('6, 61, 43','121, 89, 61'), 'shadow-rgb':('20, 32, 24','96, 94, 94'),
}
fixed={pair[0]:name for name,pair in palette.items() if pair[0].startswith('#')}
fixed.update({'#fff7e6':'paper','#0e3e38':'primary','#17334a':'ink','#142018':'deep-ink'})
def token(c,prop):
 c=c.lower()
 if c=='#fff7e6': return 'on-dark-alt' if prop=='color' else 'paper-alt'
 if c=='#fff6e8': return 'on-dark' if prop=='color' else 'paper'
 if c=='#59b5ee': return 'surface-accent' if prop.startswith('background') else 'accent'
 if c=='#48c2c8': return 'surface-secondary' if prop.startswith('background') else 'secondary'
 return fixed.get(c)
def declaration(m):
 prop,value=m[1],m[2]
 value=re.sub(r'#[a-fA-F0-9]{3,8}\b',lambda c:'var(--sva-'+token(c[0],prop)+')' if token(c[0],prop) else c[0],value)
 return m[0] if value==m[2] else prop+': '+value
for p in (root/'src').rglob('*.css'):
 if p.name=='palettes.css':continue
 s=p.read_text()
 s=re.sub(r'([\w-]+)\s*:\s*([^;{}]+)(?=[;}])',declaration,s)
 s=re.sub(r'rgba\(20,\s*32,\s*24,','rgba(var(--sva-shadow-rgb),',s)
 p.write_text(s)
# The hero has one inline gradient. Its opacity and stop positions stay identical.
p=root/'src/design/HeroScene.tsx';s=p.read_text();s=re.sub(r'rgba\(6,\s*61,\s*43,','rgba(var(--sva-forest-rgb),',s);p.write_text(s)
css=[]
for selector,i in [(':root',0),(':root[data-palette="heritage"]',1)]:
 css.append(selector+' {\n'+''.join('  --sva-'+k+': '+v[i]+';\n'for k,v in palette.items())+'}')
css.append('''/* The original blue surfaces become light paper in the copy. Only their
   light foreground token changes; photo frames retain their own paper color. */
:root[data-palette="heritage"] :is(.d0021, .d0143, .d0402, .hotel-gallery, .floating-africa, .mobile-AlbumIntroScene, .mobile-FilmScene) {
  --sva-on-dark: #79593d;
  --sva-on-dark-alt: #79593d;
}''')
css.append(':root[data-palette="heritage"] :is(.hotel-cta, .mobile-copy button) { --sva-on-dark: #ffffff; --sva-on-dark-alt: #ffffff; }')
(root/'src/palettes.css').write_text('\n\n'.join(css)+'\n')
p=root/'src/main.tsx';s=p.read_text()
if '"./palettes.css"'not in s:s=s.replace('import "./fonts.css";','import "./fonts.css";\nimport "./palettes.css";')
p.write_text(s)
# Keep original SVG files and geometry intact; only the second entry uses recolored copies.
svgmap={'#0e3e38':'#79593d','#17334a':'#605e5e','#142018':'#605e5e','#1f2e29':'#79593d','#fff6e8':'#f5f4f3','#fff7e6':'#f5f4f3','#59b5ee':'#ae3117','#48c2c8':'#815f41','#e7d3af':'#f7f5f3'}
count=0
for p in (root/'public/assets/figma').glob('*.svg'):
 s=p.read_text();warm=re.sub(r'(?<!&)#[0-9a-fA-F]{3,8}\b',lambda m:svgmap.get(m[0].lower(),m[0]),s)
 dest=root/'public/assets/heritage/figma'/p.name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(warm);count+=1
(root/'src/palette.ts').write_text('''/** Separate HTML entry chooses colors only; page content and timing are shared. */
export function paletteAsset(source: string): string {
  return document.documentElement.dataset.palette === "heritage"
    ? source.replace("/assets/", "/assets/heritage/")
    : source;
}
''')
p=root/'src/design/assets.ts';s=p.read_text()
if 'import { paletteAsset }'not in s:s='import { paletteAsset } from "../palette";\n'+s
s=re.sub(r'(export const \w+\s*=\s*)"([^"\n]+\.svg)";',r'\1paletteAsset("\2");',s)
p.write_text(s)
entry=root/'heritage/index.html';entry.parent.mkdir(exist_ok=True)
s=(root/'index.html').read_text().replace('<html lang="ru">','<html lang="ru" data-palette="heritage">').replace('content="#0E3E38"','content="#79593D"').replace('%230E3E38','%2379593D').replace('%23FFF6E8','%23F5F4F3')
entry.write_text(s)
(root/'reference/heritage-palette.json').write_text(json.dumps({'source':'https://soulventuresafrica.ru/','entry':'/heritage/','colors':{k:{'original':a,'heritage':b}for k,(a,b)in palette.items()},'svgFiles':count},indent=2)+'\n')
print('Prepared color-only entry and',count,'SVG variants')

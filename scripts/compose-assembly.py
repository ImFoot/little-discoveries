"""Assemble a scene from complete individual assets. No finished environmental image or hand-authored occlusion mask is read."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import cv2,numpy as np,json,random,zipfile,xml.etree.ElementTree as ET
r=Path('artwork/assembly-057');out=r/'build';out.mkdir(exist_ok=True);spec=json.loads((r/'scene.json').read_text());W,H=spec['width'],spec['height']
components={t['id']:t for t in json.loads((r/'assets/components.json').read_text())};targets={t['id']:t for t in json.loads(Path('artwork/lantern-056/assets/objects.json').read_text())}
records=[];physical=[];canvas=Image.new('RGBA',(W,H))
def add_layer(name,im,x=0,y=0,kind='prop',asset=None,target=None):
 global canvas
 file=f'{len(records):03d}-{name}.png';im.save(out/file);canvas.alpha_composite(im,(x,y));records.append(dict(id=name,file=file,x=x,y=y,kind=kind,asset=asset,target=target))
 if kind in ['prop','target']:
  full=Image.new('RGBA',(W,H));full.alpha_composite(im,(x,y));physical.append(dict(record=records[-1],alpha=np.array(full.getchannel('A')),image=im))
wall=Image.new('RGBA',(W,H));d=ImageDraw.Draw(wall)
for y in range(H):
 c=(244-round(y/H*21),231-round(y/H*22),205-round(y/H*21),255);d.line((0,y,W,y),fill=c)
# Independent flat wall surface, with hand-drawn masonry joints, rather than an illustrated setting.
for y in []:
 d.line((0,y,W,y),fill=(205,174,137,60),width=2)
 for x in range((y//90%2)*95,1024,190):d.line((x,y,x,y+85),fill=(205,174,137,50),width=2)
add_layer('wall-plane',wall,kind='primitive')
floor=Image.new('RGBA',(W,H));d=ImageDraw.Draw(floor);d.rectangle((0,690,W,H),fill='#c5b69b');rng=random.Random(57)
for row,y in enumerate(range(700,H,75)):
 for col,x in enumerate(range(-90,W+100,145)):
  xx=x+(row%2)*70;pts=[(xx+7,y+5),(xx+133,y+5),(xx+139,y+68),(xx,y+68)];base=rng.randint(176,208);d.polygon(pts,fill=(base+11,base+2,base-15),outline=(147,136,113));d.line([pts[0],pts[1],pts[2]],fill=(227,216,192),width=2)
  if rng.random()<.36:d.ellipse((xx+126,y+58,xx+140,y+68),fill='#88916b')
floor=floor.filter(ImageFilter.GaussianBlur(.65));arr=np.array(floor);noise=np.random.default_rng(57).normal(0,2.4,(H,W,1));arr[:,:,:3]=np.clip(arr[:,:,:3].astype(float)+noise,0,255).astype(np.uint8);floor=Image.fromarray(arr);add_layer('paving-plane',floor,kind='primitive')
cords=Image.new('RGBA',(W,H));d=ImageDraw.Draw(cords)
for x,y0,y1 in [(529,282,341),(669,258,300),(860,260,313)]:d.line((x,y0,x,y1),fill='#735d3e',width=3)
add_layer('hanging-cords',cords,kind='primitive')
for i,item in enumerate(spec['layers']):
 is_target=item['kind']=='target';a=targets[item['id']]if is_target else components[item['asset']];path=Path('artwork/lantern-056')/a['file'] if is_target else r/a['file']
 # Source bounds are each complete object/architectural component. No cropping or clipping mask occurs here.
 im=Image.open(path).convert('RGBA');w=item.get('width',round(im.width*item.get('height',im.height)/im.height));h=round(im.height*w/im.width);im=im.resize((w,h),Image.Resampling.LANCZOS).rotate(item.get('angle',0),Image.Resampling.BICUBIC,expand=True)
 x,y=item['x'],item['y'];assert 0<=x and 0<=y and x+im.width<=W and y+im.height<=H,(item['id'],x,y,im.size)
 if is_target:im.save(out/(item['id']+'-preview.png'))
 shadow=Image.new('RGBA',im.size,(65,43,27,0));shadow.putalpha(im.getchannel('A').point(lambda a:round(a*.15)).filter(ImageFilter.GaussianBlur(2)));add_layer(item['id']+'-shadow',shadow,x+2,y+4,kind='shadow',asset=str(path))
 add_layer(item['id'],im,x,y,item['kind'],str(path),a['name']if is_target else None)
 if i in [0,6,10,18,26,len(spec['layers'])-1]:canvas.convert('RGB').save(out/f'assembly-stage-{i:02d}.png')
canvas.convert('RGB').save(out/'057.png');annotations=[];stats=[]
for i,p in enumerate(physical):
 rec=p['record']
 if rec['kind']!='target':continue
 full=p['alpha'];visible=full.astype(np.float32)
 for later in physical[i+1:]:visible*=1-later['alpha']/255
 visible=visible.astype(np.uint8);Image.fromarray(visible).save(out/(rec['id']+'-visible.png'));contours,hierarchy=cv2.findContours(cv2.resize((visible>100).astype(np.uint8),(W*4,H*4),interpolation=cv2.INTER_NEAREST),cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE);regions=[]
 if hierarchy is not None:
  for k,c in enumerate(contours):
   if hierarchy[0][k][3]>=0 or cv2.contourArea(c)<48:continue
   poly=np.round(cv2.approxPolyDP(c,1.2,True).reshape(-1,2)/4,2).tolist()
   if len(poly)<3:continue
   holes=[];child=hierarchy[0][k][2]
   while child>=0:
    hc=contours[child]
    if cv2.contourArea(hc)>48:
     hp=np.round(cv2.approxPolyDP(hc,1.2,True).reshape(-1,2)/4,2).tolist()
     if len(hp)>=3:holes.append(hp)
    child=hierarchy[0][child][0]
   regions.append(dict(outline=poly,holes=holes))
 regions.sort(key=lambda q:cv2.contourArea(np.array(q['outline'],np.int32)),reverse=True)
 if not regions:raise ValueError('Entirely concealed: '+rec['id'])
 ys,xs=np.where(visible>100);x0,y0=max(0,int(xs.min())-4),max(0,int(ys.min())-4);fraction=round(float(visible.sum()/max(1,full.sum())),3)
 annotations.append(dict(id=rec['id'],name=rec['target'],previewMode='asset',previewSource=str(out/(rec['id']+'-preview.png')).replace('\\','/'),outline=regions[0]['outline'],holes=regions[0]['holes'],regions=regions,previewCrop=dict(x=x0,y=y0,width=min(W-x0,int(xs.max())-x0+5),height=min(H-y0,int(ys.max())-y0+5)),notes='Complete original sprite placed as a physical layer. Visibility derives only from alpha of later whole props.',visibleFraction=fraction))
 stats.append(dict(id=rec['id'],visibleFraction=fraction,regions=len(regions),occludingProps=[q['record']['id']for q in physical[i+1:]if np.logical_and(full>100,q['alpha']>100).any()]))
annotation=dict(id=57,title=spec['title'],width=W,height=H,previewMode='asset',targets=annotations,review=dict(artwork=False,geometry=False,contextOutlines=False,smallPhone=False,notes='Independent component assembly. Review pending.'))
(out/'057.json').write_text(json.dumps(annotation,indent=2)+'\n');(out/'layers.json').write_text(json.dumps(dict(width=W,height=H,layers=records),indent=2)+'\n');(out/'visibility.json').write_text(json.dumps(stats,indent=2)+'\n')
with zipfile.ZipFile(out/'assembled-stall.ora','w',zipfile.ZIP_DEFLATED)as z:
 z.writestr('mimetype','image/openraster');xml=ET.Element('image',w=str(W),h=str(H),name=spec['title']);stack=ET.SubElement(xml,'stack')
 for j,rec in enumerate(reversed(records)):
  src=f'data/{j}.png';z.write(out/rec['file'],src);ET.SubElement(stack,'layer',name=rec['id'],src=src,x=str(rec['x']),y=str(rec['y']),opacity='1.0',visibility='visible',**{'composite-op':'svg:src-over'})
 z.writestr('stack.xml',ET.tostring(xml));z.write(out/'057.png','mergedimage.png')
print(stats)

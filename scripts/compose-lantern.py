"""Reproducible layered authoring; python scripts/compose-lantern.py. Requires Pillow, numpy, opencv-python-headless."""
from pathlib import Path
import json,cv2,numpy as np,zipfile,xml.etree.ElementTree as ET
from PIL import Image,ImageFilter
root=Path('artwork/lantern-056');out=root/'build';out.mkdir(exist_ok=True)
layout=json.loads((root/'layout.json').read_text());assets={t['id']:t for t in json.loads((root/'assets/objects.json').read_text())};W,H=layout['width'],layout['height']
bg=Image.open(root/'assets/background.png').convert('RGBA').resize((W,H),Image.Resampling.LANCZOS)
foreground_mask=np.zeros((H,W),np.uint8);occluder_records=[]
for o in layout['occluders']:
 mask=np.zeros((H,W),np.uint8);cv2.fillPoly(mask,[np.array(o['points'],np.int32)],255);foreground_mask=cv2.bitwise_or(foreground_mask,mask)
 piece=Image.new('RGBA',(W,H));piece.paste(bg,(0,0),Image.fromarray(mask));file='foreground-'+o['id']+'.png';piece.save(out/file);occluder_records.append(dict(name='Foreground '+o['id'],file=file,x=0,y=0))
fg=Image.new('RGBA',(W,H));fg.paste(bg,(0,0),Image.fromarray(foreground_mask));fg.save(out/'foreground.png');bg.save(out/'background.png')
scene=bg.copy();layer_records=[];targets=[]
for t in layout['placements']:
 asset=assets[t['id']];sprite=Image.open(root/asset['file']).convert('RGBA');sprite=sprite.resize((round(sprite.width*t['height']/sprite.height),t['height']),Image.Resampling.LANCZOS).rotate(t['angle'],Image.Resampling.BICUBIC,expand=True)
 sprite.save(out/(t['id']+'-full.png'));x,y=t['x'],t['y'];layer=Image.new('RGBA',(W,H));layer.alpha_composite(sprite,(x,y))
 alpha=np.array(layer.getchannel('A'));visible=(alpha.astype(np.float32)*(1-foreground_mask/255)).astype(np.uint8)
 Image.fromarray(visible).save(out/(t['id']+'-visible-mask.png'))
 # A soft contact shadow gives each separately authored object a place on its supporting surface.
 shadow=Image.new('RGBA',(W,H),(62,39,24,0));shadow.putalpha(Image.fromarray((alpha*.18).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.4)));shadow.save(out/(t['id']+'-shadow.png'));scene.alpha_composite(shadow,(2,3));scene.alpha_composite(layer)
 layer_records.append(dict(id=t['id']+'-shadow',name=asset['name']+' contact shadow',file=t['id']+'-shadow.png',x=2,y=3))
 contours,hierarchy=cv2.findContours((visible>100).astype(np.uint8),cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE);regions=[]
 if hierarchy is not None:
  for i,c in enumerate(contours):
   if hierarchy[0][i][3]>=0 or cv2.contourArea(c)<3:continue
   poly=cv2.approxPolyDP(c,.65,True).reshape(-1,2).tolist()
   if len(poly)<3:continue
   holes=[];child=hierarchy[0][i][2]
   while child>=0:
    hc=contours[child]
    if cv2.contourArea(hc)>3:
     hp=cv2.approxPolyDP(hc,.65,True).reshape(-1,2).tolist()
     if len(hp)>=3:holes.append(hp)
    child=hierarchy[0][child][0]
   regions.append(dict(outline=poly,holes=holes))
 regions.sort(key=lambda r:cv2.contourArea(np.array(r['outline'],np.int32)),reverse=True)
 if not regions:raise ValueError('Object fully hidden: '+t['id'])
 ys,xs=np.where(visible>100);crop=dict(x=max(0,int(xs.min())-4),y=max(0,int(ys.min())-4),width=min(W-max(0,int(xs.min())-4),int(xs.max()-xs.min())+9),height=min(H-max(0,int(ys.min())-4),int(ys.max()-ys.min())+9))
 targets.append(dict(id=t['id'],name=asset['name'],previewMode='asset',previewSource=str(out/(t['id']+'-full.png')).replace('\\','/'),outline=regions[0]['outline'],holes=regions[0]['holes'],regions=regions,previewCrop=crop,visibleFraction=round(float(visible.sum()/alpha.sum()),3),notes='Original full sprite provides the preview. Visible mask is its transformed alpha minus the foreground layers. '+t['concealment']+'.'))
 layer_records.append(dict(id=t['id'],name=asset['name'],file=t['id']+'-full.png',x=x,y=y,visibleFraction=targets[-1]['visibleFraction']))
scene.save(out/'objects-uncovered.png');scene.alpha_composite(fg);scene.convert('RGB').save(out/'056.png')
annotation=dict(id=56,title=layout['title'],width=W,height=H,previewMode='asset',review=dict(artwork=False,geometry=False,contextOutlines=False,smallPhone=False,notes='Layered production; visual review pending.'),targets=targets,provenance=dict(method='objects-first layered composition',layout='artwork/lantern-056/layout.json',tool='built-in image_gen plus explicit reproducible compositing'))
(out/'056.json').write_text(json.dumps(annotation,indent=2)+'\n');(out/'layer-manifest.json').write_text(json.dumps(dict(width=W,height=H,layers=[dict(id='background',file='background.png',x=0,y=0),*layer_records,dict(id='foreground',file='foreground.png',x=0,y=0)]),indent=2)+'\n')
# OpenRaster preserves editable sources and stacking order in a common layered image format.
with zipfile.ZipFile(out/'lantern-stall.ora','w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('mimetype','image/openraster');image=ET.Element('image',w=str(W),h=str(H),name=layout['title']);stack=ET.SubElement(image,'stack')
 for i,r in enumerate(reversed([dict(name='Background',file='background.png',x=0,y=0),*layer_records,*occluder_records])):
  src=f'data/layer{i}.png';z.write(out/r['file'],src);ET.SubElement(stack,'layer',name=r.get('name',r.get('id')),src=src,x=str(r['x']),y=str(r['y']),opacity='1.0',visibility='visible',**{'composite-op':'svg:src-over'})
 z.writestr('stack.xml',ET.tostring(image));z.write(out/'056.png','mergedimage.png')
print([(t['id'],t['visibleFraction'],len(t['regions']))for t in targets])

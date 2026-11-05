from pathlib import Path
import json,cv2,numpy as np,zipfile,xml.etree.ElementTree as ET,io
from PIL import Image
r=Path('artwork/assembly-057');a=json.loads((r/'build/057.json').read_text());layers=json.loads((r/'build/layers.json').read_text());report=[];final=cv2.imread(str(r/'build/057.png'))
assert len([l for l in layers['layers']if l['kind']=='target'])==12
assert all(not any(s in (l.get('asset')or'').lower()for s in ['background','foreground','mask'])for l in layers['layers'])
for t in a['targets']:
 actual=cv2.imread(str(r/f"build/{t['id']}-visible.png"),0)>100;poly=np.zeros((actual.shape[0]*4,actual.shape[1]*4),np.uint8)
 for reg in t['regions']:
  piece=np.zeros(poly.shape,np.uint8);cv2.fillPoly(piece,[np.round(np.array(reg['outline'])*4).astype(np.int32)],255)
  for h in reg['holes']:cv2.fillPoly(piece,[np.round(np.array(h)*4).astype(np.int32)],0)
  poly=cv2.bitwise_or(poly,piece)
 represented=cv2.resize(poly,(actual.shape[1],actual.shape[0]),interpolation=cv2.INTER_AREA)>127;tp=np.logical_and(actual,represented).sum();recall=tp/actual.sum();precision=tp/max(1,represented.sum());assert recall>.94 and precision>.94,(t['id'],recall,precision)
 c=t['previewCrop'];roi=final[c['y']:c['y']+c['height'],c['x']:c['x']+c['width']].copy()
 for reg in t['regions']:
  for p in [reg['outline'],*reg['holes']]:cv2.polylines(roi,[(np.array(p)-[c['x'],c['y']]).astype(np.int32)],True,(225,0,220),1,cv2.LINE_AA)
 cv2.imwrite(str(r/f"review/{t['id']}-outline.png"),cv2.resize(roi,None,fx=4,fy=4))
 report.append(dict(id=t['id'],recall=round(recall,4),precision=round(precision,4),visibleFraction=t['visibleFraction'],regions=len(t['regions'])))
with zipfile.ZipFile(r/'build/assembled-stall.ora')as z:
 root=ET.fromstring(z.read('stack.xml'));ls=list(root.find('stack'));im=Image.new('RGBA',(1024,1536))
 for l in reversed(ls):im.alpha_composite(Image.open(io.BytesIO(z.read(l.attrib['src']))).convert('RGBA'),(int(l.attrib['x']),int(l.attrib['y'])))
 assert np.array_equal(np.array(im.convert('RGB')),np.array(Image.open(r/'build/057.png').convert('RGB')))
order=[l['kind']for l in layers['layers']if l['kind']in ['target','prop']]
runs=sum(k=='target' and(i==0 or order[i-1]!='target')for i,k in enumerate(order));assert runs>1
proof=dict(targetRuns=runs,layers=len(layers['layers']),targets=12,wholeProps=len([l for l in layers['layers']if l['kind']=='prop']),primitiveSurfaces=len([l for l in layers['layers']if l['kind']=='primitive']),shadows=len([l for l in layers['layers']if l['kind']=='shadow']),finishedEnvironmentInputs=0,manuallyCutOccluderInputs=0,targetLayersInterleaved=runs>1,oraFlattensIdentically=True,visibleMaskChecks=report)
(r/'review/verification.json').write_text(json.dumps(proof,indent=2)+'\n');print(proof)

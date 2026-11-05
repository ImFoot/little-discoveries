import cv2,json,numpy as np
from pathlib import Path
r=Path('artwork/lantern-056');a=json.loads((r/'056.json').read_text());scene=cv2.imread(str(r/'build/056.png'));report=[]
for t in a['targets']:
 mask=cv2.imread(str(r/f"build/{t['id']}-visible-mask.png"),0)>100;polys=np.zeros(mask.shape,np.uint8)
 for region in t['regions']:
  p=np.zeros(mask.shape,np.uint8);cv2.fillPoly(p,[np.array(region['outline'],np.int32)],255)
  for h in region['holes']:cv2.fillPoly(p,[np.array(h,np.int32)],0)
  polys=cv2.bitwise_or(polys,p)
 represented=polys>0;recall=np.logical_and(mask,represented).sum()/mask.sum();precision=np.logical_and(mask,represented).sum()/max(1,represented.sum())
 # Pixel contours are antialiased and simplified by <1 sourcepixel.
 assert recall>.94 and precision>.94,(t['id'],recall,precision)
 c=t['previewCrop'];roi=scene[c['y']:c['y']+c['height'],c['x']:c['x']+c['width']].copy()
 for region in t['regions']:
  for p in [region['outline'],*region['holes']]:cv2.polylines(roi,[np.array(p,np.int32)-[c['x'],c['y']]],True,(205,0,230),1,cv2.LINE_AA)
 cv2.imwrite(str(r/f"review/{t['id']}-outline.png"),cv2.resize(roi,None,fx=4,fy=4))
 report.append(dict(id=t['id'],visibleFraction=t['visibleFraction'],regionRecall=round(recall,4),regionPrecision=round(precision,4),regions=len(t['regions'])))
(r/'review/mask-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(report)

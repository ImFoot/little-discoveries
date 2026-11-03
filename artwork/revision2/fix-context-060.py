import json,math
from pathlib import Path
from shapely.geometry import Polygon
p=Path('artwork/revision2/annotations/060.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='red-pincushion':
  pts=t['outline'];at=pts.index([543,691]);pts[at:at+3]=[[545,692],[551,686],[568,680],[569,667],[565,655],[570,649],[577,656],[581,673],[581,686],[594,687],[603,693]]
 if t['id']=='wood-hoop':t['holes']=[[[round(837+116*math.cos(n*math.pi/12),1),round(1071+79*math.sin(n*math.pi/12),1)]for n in range(24)]]
 if t['id']=='blue-mug':t['holes']=[[[389,650],[398,645],[411,649],[419,660],[420,673],[413,686],[402,698],[388,708],[381,709],[384,695],[389,682],[390,663]]]
 assert Polygon(t['outline'],t.get('holes')).is_valid,t['id']
a['review']['geometry']=True;a['review']['contextOutlines']=True;a['review']['notes']='Ten actual targets reviewed in source-context overlays: three subtle motifs/leaf fastenings and seven exposed anchors. The hoop opening and mug handle are excluded from the hit mask. Physical-phone review pending.';p.write_text(json.dumps(a,indent=2)+'\n')

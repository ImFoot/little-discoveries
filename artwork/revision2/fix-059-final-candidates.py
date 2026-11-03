import json
from pathlib import Path
from shapely.geometry import Polygon
p=Path('artwork/revision2/annotations/059.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='quatrefoil-stamp':t['outline']=[[516,776],[568,764],[599,776],[599,799],[550,814],[516,802]]
 if t['id']=='framed-stag':t.update(id='brass-bird-inkwell',name='Brass bird inkwell',concealment='The little warm-brass vessel is nestled among similarly engraved containers and tangled twine, with its curving profile following the adjacent metal rims.',outline=[[29,800],[42,794],[64,791],[83,793],[93,785],[99,772],[107,767],[117,770],[119,776],[113,781],[110,798],[103,814],[91,823],[74,829],[51,825],[37,820],[25,811]])
 assert Polygon(t['outline']).is_valid,t['id']
p.write_text(json.dumps(a,indent=2)+'\n')

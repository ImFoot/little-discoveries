import json
from pathlib import Path
from shapely.geometry import Polygon
p=Path('artwork/revision2/annotations/056.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='reclining-hare':t['outline']=[[123,80],[128,72],[140,65],[153,62],[168,63],[181,68],[185,69],[184,58],[184,45],[189,48],[198,59],[202,68],[208,66],[211,57],[220,48],[220,61],[218,72],[219,82],[223,91],[225,96],[222,100],[213,99],[207,96],[203,100],[216,102],[230,104],[239,109],[244,113],[247,120],[245,122],[239,121],[234,117],[230,116],[228,119],[215,119],[205,117],[196,119],[186,118],[176,118],[164,117],[152,118],[140,116],[132,115],[128,109],[126,100],[123,92]]
 assert Polygon(t['outline']).is_valid,t['id']
p.write_text(json.dumps(a,indent=2)+'\n')
p=Path('artwork/revision2/annotations/059.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='daisy-stamp':t['outline']=[[x+10,y]for x,y in t['outline']]
p.write_text(json.dumps(a,indent=2)+'\n')

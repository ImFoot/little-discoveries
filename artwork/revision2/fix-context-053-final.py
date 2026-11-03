import json
from pathlib import Path
from shapely.geometry import Polygon
p=Path('artwork/revision2/annotations/053.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='pearl-leaf':t['outline']=[[596,779],[605,786],[614,791],[625,795],[634,802],[637,811],[634,819],[630,820],[620,815],[612,807],[606,798],[604,790]]
 if t['id']=='shelf-starfish':t['outline']=[[465,386],[474,389],[487,396],[493,389],[498,375],[503,367],[507,372],[508,389],[511,397],[525,395],[534,398],[535,404],[526,410],[515,411],[512,425],[507,437],[503,437],[498,426],[494,418],[486,425],[474,432],[469,432],[472,422],[479,412],[470,409],[464,402]]
 assert Polygon(t['outline']).is_valid,t['id']
p.write_text(json.dumps(a,indent=2)+'\n')

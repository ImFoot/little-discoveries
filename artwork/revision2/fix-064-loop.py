import json
from pathlib import Path
from shapely.geometry import Polygon
p=Path('artwork/revision2/annotations/064.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='glove-leaf-sprig':t.update(id='oval-brass-loop',name='Oval brass loop',concealment='The thin oval loop is nested behind spotted corks and green felt, sharing the bronze tone and circular rhythm of nearby fittings.',outline=[[528,964],[531,948],[539,933],[551,923],[564,919],[573,921],[578,928],[578,939],[571,952],[560,961],[549,966],[541,971],[535,971],[529,967]],holes=[[[537,955],[542,940],[554,928],[567,926],[571,929],[570,939],[563,950],[550,959],[541,963],[537,962]]])
 assert Polygon(t['outline'],t.get('holes')).is_valid,t['id']
p.write_text(json.dumps(a,indent=2)+'\n')

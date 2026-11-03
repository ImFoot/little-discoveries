import json
from pathlib import Path
for id in [52,53]:
 p=Path(f'artwork/revision2/annotations/{id:03}.json');a=json.loads(p.read_text());a['review']['contextOutlines']=True;a['review']['notes']+=' Source-context overlay audit completed; clipped heads, feet, shells and mistaken candidates were corrected before acceptance.';p.write_text(json.dumps(a,indent=2)+'\n')

import json
from pathlib import Path
p=Path('artwork/revision2/annotations/059.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='brass-bird-inkwell':t['outline']=[[17,800],[27,796],[39,789],[50,788],[60,793],[71,790],[84,781],[96,775],[101,764],[108,760],[116,760],[120,763],[127,762],[128,765],[120,769],[117,781],[114,798],[109,814],[100,824],[86,829],[69,831],[49,829],[34,824],[25,817],[24,811],[16,807]]
p.write_text(json.dumps(a,indent=2)+'\n')
for id in [51,54,55,56,57,58,59]:
 p=Path(f'artwork/revision2/annotations/{id:03}.json');a=json.loads(p.read_text());a['review']['geometry']=True;a['review']['contextOutlines']=True;a['review']['notes']+=' Each target was audited in a source-context overlay; uncertain identities were rejected or corrected, and clipped defining features were retraced using enlarged coordinate-grid source crops.';p.write_text(json.dumps(a,indent=2)+'\n')

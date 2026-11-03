import json
from pathlib import Path
p=Path('artwork/revision2/annotations/061.json');a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='chest-bird-print':t.update(id='long-brass-key',name='Long double-ended brass key',concealment='The narrow brass piece follows the wood grain among similarly colored rings and plates; its different-sized end openings distinguish it.',outline=[[794,1009],[803,1001],[815,1002],[826,1004],[844,996],[855,991],[864,994],[871,1002],[867,1007],[854,1009],[839,1009],[822,1016],[809,1021],[799,1019]])
p.write_text(json.dumps(a,indent=2)+'\n')

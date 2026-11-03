import json
from pathlib import Path
root=Path('artwork/revision2')
drop={85:['bronze-bell','lace-glove','terracotta-heart'],86:['specimen-skull','blue-egg-nest','armillary-sphere'],87:['wall-owl','shelf-hedgehog','glass-butterfly'],88:['oven-hare','jug-hare','flat-whisk'],89:['carved-heron','hanging-glass-bulb','moss-frog']}
keep90=['table-bird','tile-dragonfly','basket-shears','straw-hat','butterfly-teapot','lavender-teacup','scone-plate','strawberry-plate','green-book','galvanized-can']
backup=root/'annotations'/'superseded-20-target-drafts';backup.mkdir(exist_ok=True)
for i in range(85,91):
 p=root/'annotations'/f'{i:03}.json';a=json.loads(p.read_text(encoding='utf-8-sig'))
 if len(a['targets'])>15:(backup/p.name).write_text(json.dumps(a,indent=2)+'\n')
 if i==90:a['targets']=[t for t in a['targets'] if t['id'] in keep90]
 else:
  easy=[t['id'] for t in a['targets'] if t['difficulty']=='easy'][:4]
  a['targets']=[t for t in a['targets'] if t['difficulty']=='challenging' and t['id'] not in drop[i] or t['id'] in easy]
 a['review']['notes']+=' Revised to user maximum15: selected strongest concealed details; omitted props remain visual distractors. Regular11challenging4easy; every-tenth break3challenging7easy.'
 assert len(a['targets'])==(10 if i%10==0 else 15)
 assert sum(t['difficulty']=='challenging' for t in a['targets'])==(3 if i%10==0 else 11)
 p.write_text(json.dumps(a,indent=2)+'\n')
m=json.loads((root/'batch-85-100.json').read_text(encoding='utf-8-sig'))
for x in m:
 x['targetCount']=10 if x['breakLevel'] else 15
 x['sample']='Three concealed discoveries and seven easy objects.' if x['breakLevel'] else 'Eleven concealed discoveries integrated into foliage, architecture and textured clutter, plus four easy anchors.'
(root/'batch-85-100.json').write_text(json.dumps(m,indent=2)+'\n')
print('85–90 and full85–100manifestupdatedto15/10')

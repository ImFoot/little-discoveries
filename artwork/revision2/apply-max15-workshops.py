import json
from pathlib import Path
root=Path('artwork/revision2')
remove={51:{'brass-fox','brass-astrolabe','brass-thimble','cream-notebook','pale-glove'},52:{'bronze-mouse','fox-embossing','tapestry-stag','sealing-wax','magnifying-glass'},53:{'brass-ornament-stand','nested-brass-rings','seahorse-panel','green-watering-can','wood-spatula'}}
for id,excluded in remove.items():
 p=root/f'annotations/{id:03}.json';a=json.loads(p.read_text());a['targets']=[t for t in a['targets'] if t['id'] not in excluded];a['review']['notes']='Fifteen visible targets inspected and traced: the eleven strongest concealed details were selected from a denser environment, with four exposed anchors. Extra pictured props remain non-target distractors. Physical-phone difficulty testing pending.'
 assert len(a['targets'])==15 and sum(t['difficulty']=='challenging' for t in a['targets'])==11
 p.write_text(json.dumps(a,indent=2)+'\n')
 script=root/f'annotate-{id:03}.py';s=script.read_text(encoding='utf-8-sig');needle='a=dict(id=';pos=s.index(needle);s=s[:pos]+f"targets=[t for t in targets if t['id'] not in {repr(excluded)}]\n"+s[pos:];script.write_text(s,encoding='utf8')
p=root/'batch-51-67.json';batch=json.loads(p.read_text());
for x in batch:x['targetCount']=10 if x['id']==60 else 15;x['sample']='Three concealed details and seven clear anchors.' if x['id']==60 else 'Eleven concealed discoveries integrated into matching materials and dense working clutter.'
p.write_text(json.dumps(batch,indent=2,ensure_ascii=False)+'\n')
print('Updated51-53 to15/11hard andall17manifestcounts to15 or10.')

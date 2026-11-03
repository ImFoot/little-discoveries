import json
from pathlib import Path
names=['The horologist’s secret alcove','The bookbinder’s labyrinth','The shell inlayer’s cabinet','The automaton maker’s balcony','The cabinet of botanical dyes','The porcelain mender’s attic','The luthier’s pearwood loft','The puzzle-box conservator','The stamp carver’s side room','The ribbon merchant’s window','The tin toymaker’s stairwell','The glass engraver’s passage','The map cabinet of curiosities','The instrument restorer’s cupboard','The silversmith’s old courtyard','The lace conservator’s room','The carver’s cedar gallery']
items=[dict(id=id,title=name,targetCount=20,chapter=(id-1)//10+1,breakLevel=id==60,sample='Six concealed details and fourteen clear anchors.' if id==60 else 'Fourteen concealed discoveries integrated into matching materials and dense working clutter.') for id,name in zip(range(51,68),names)]
Path('artwork/revision2/batch-51-67.json').write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n',encoding='utf8')

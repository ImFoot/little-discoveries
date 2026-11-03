import json
from pathlib import Path
from shapely.geometry import Polygon
p=Path('artwork/revision2/annotations/053.json');a=json.loads(p.read_text())
fixes={
'shelf-starfish':[[119,115],[136,117],[145,100],[151,79],[158,70],[164,78],[165,107],[167,119],[187,119],[209,126],[212,134],[194,140],[177,145],[173,163],[166,182],[159,187],[153,179],[144,157],[130,167],[110,179],[100,181],[105,169],[119,149],[103,146],[90,137],[88,131],[97,130],[118,132]],
'striped-feather':[[167,58],[177,50],[184,57],[184,73],[178,96],[170,118],[157,141],[145,167],[131,187],[120,207],[111,223],[107,223],[113,204],[122,180],[134,153],[140,128],[146,106],[151,83],[159,67]],
'rose-half-shell':[[78,90],[100,91],[127,105],[148,79],[175,91],[198,60],[227,66],[248,54],[261,68],[251,104],[230,131],[200,149],[166,161],[129,163],[104,151],[85,132],[77,111]]}
for t in a['targets']:
 old=t['id']
 if old in fixes:
  xs=[v[0]for v in t['outline']];ys=[v[1]for v in t['outline']];l=max(0,min(xs)-45);top=max(0,min(ys)-45);w=min(1024-l,max(xs)-l+45);h=min(1536-top,max(ys)-top+45);s=min(300/w,270/h);px=(300-w*s)/2;py=(270-h*s)/2;t['outline']=[[round(l+(x-px)/s),round(top+(y-py)/s)]for x,y in fixes[old]]
 if old=='curled-pearl-shell':t.update(id='spotted-cone-shell',name='Spotted cone shell',concealment='The mottled cream and brown shell lies obliquely among similarly curled shell rims on a crowded upper shelf.',outline=[[490,184],[515,175],[541,162],[558,151],[568,139],[579,125],[588,123],[588,130],[583,139],[587,142],[593,140],[593,146],[590,154],[595,156],[592,165],[586,180],[574,192],[554,199],[529,200],[507,196],[489,190]])
 if old=='binding-knife':t.update(id='pearl-leaf',name='Pointed pearl leaf inlay',concealment='The small pearl leaf is embedded in dense floral marquetry at an oblique angle, sharing the surrounding pale fragments and leaf texture.',outline=[[604,789],[613,795],[623,802],[629,809],[627,815],[620,813],[612,806],[608,799]])
 if old=='small-hermit-shell':t['name']='Little spotted shell'
 assert Polygon(t['outline']).is_valid,t['id']
p.write_text(json.dumps(a,indent=2)+'\n');print('053 corrected shell identities and precise contours after enlarged context audit.')

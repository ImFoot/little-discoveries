import json
from pathlib import Path
def get(n,slug):
 p=Path(f'artwork/revision2/annotations/{n:03}.json');a=json.loads(p.read_text());t=next(t for t in a['targets']if t['id']==slug);m=json.loads(Path(f'.cache/gardens-roi/{n:03}-{slug}.json').read_text())
 def forward(ps):return[[round(m['left']+(x-m['offsetX'])/m['scale'],2),round(m['top']+(y-m['offsetY'])/m['scale'],2)]for x,y in ps]
 def back(ps):return[[round((x-m['left'])*m['scale']+m['offsetX']),round((y-m['top'])*m['scale']+m['offsetY'])]for x,y in ps]
 return p,a,t,forward,back
p,a,t,f,b=get(54,'green-oilcan');q=b(t['outline']);j=q.index([309,247]);t['outline']=f([[100,121],[122,119],[142,118],[162,120],[186,127],[209,140],[231,159],[253,186],[273,213],[300,239]]+q[10:j+1]+[[300,247],[287,235],[273,218],[256,196],[238,175],[221,154],[204,141],[184,132],[162,127],[140,127],[121,130],[104,130]]);p.write_text(json.dumps(a,indent=2)+'\n')
p,a,t,f,b=get(60,'gold-scissors');q=b(t['outline']);i=q.index([549,333]);j=q.index([535,338]);t['outline']=f(q[:i+1]+q[j:]);t['holes'].append(f([[394,286],[414,288],[433,300],[456,311],[475,317],[491,321],[499,324],[477,322],[452,318],[429,315],[409,316],[392,312],[381,305],[376,296],[381,291]]));p.write_text(json.dumps(a,indent=2)+'\n')

import json
from pathlib import Path
from shapely.geometry import Polygon
R=Path('artwork/revision2/annotations')
def patch(scene,fixes,margin=45,cw=300,ch=270):
 p=R/f'{scene:03}.json';a=json.loads(p.read_text())
 for t in a['targets']:
  if t['id'] not in fixes:continue
  xs=[q[0]for q in t['outline']];ys=[q[1]for q in t['outline']];l=max(0,min(xs)-margin);top=max(0,min(ys)-margin);w=min(1024-l,max(xs)-l+margin);h=min(1536-top,max(ys)-top+margin);s=min(cw/w,ch/h);px=(cw-w*s)/2;py=(ch-h*s)/2
  t['outline']=[[round(l+(x-px)/s,1),round(top+(y-py)/s,1)]for x,y in fixes[t['id']]]
  assert Polygon(t['outline']).is_valid,(scene,t['id'])
 p.write_text(json.dumps(a,indent=2)+'\n')
patch(54,{
'chair-hare':[[87,89],[95,77],[111,69],[129,65],[143,55],[164,47],[185,44],[189,49],[174,59],[156,66],[146,71],[163,69],[184,70],[202,75],[199,80],[179,80],[155,77],[139,80],[132,94],[137,105],[151,112],[169,121],[179,136],[187,151],[188,173],[180,194],[166,205],[149,207],[133,200],[119,207],[107,203],[98,195],[96,179],[100,164],[92,152],[85,139],[86,121],[83,109],[76,106],[71,99],[75,94]],
'tray-dragonfly':[[44,93],[69,94],[87,104],[101,114],[111,109],[136,95],[161,83],[183,79],[195,85],[193,95],[181,111],[166,123],[153,127],[166,128],[181,135],[185,146],[180,159],[166,165],[146,161],[129,149],[116,141],[114,161],[107,178],[98,184],[93,177],[94,160],[91,145],[77,149],[60,151],[48,147],[40,141],[44,134],[59,132],[83,127],[92,124],[83,115],[62,111],[44,103]]})
patch(55,{
'frieze-fox':[[29,97],[43,89],[54,87],[68,78],[79,74],[89,70],[94,73],[86,84],[99,79],[107,81],[99,89],[91,95],[93,101],[107,108],[132,113],[155,124],[176,138],[192,153],[208,165],[220,177],[226,193],[236,211],[244,221],[238,224],[223,216],[215,205],[211,191],[204,182],[193,181],[180,178],[166,168],[151,156],[140,158],[137,169],[145,175],[143,181],[130,178],[123,170],[121,158],[108,149],[91,140],[80,139],[72,150],[58,151],[52,147],[63,141],[64,133],[53,124],[38,118],[28,119],[22,115],[30,110],[38,110],[33,101]],
'screen-hare':[[89,146],[106,128],[132,118],[142,112],[150,106],[151,98],[139,85],[138,77],[146,75],[158,84],[166,94],[170,99],[179,99],[188,107],[188,114],[197,121],[195,128],[184,129],[174,135],[176,145],[185,148],[190,154],[187,161],[177,157],[165,148],[152,151],[142,160],[135,173],[126,188],[117,200],[109,200],[109,191],[118,176],[121,163],[111,163],[104,179],[96,194],[89,201],[82,201],[84,191],[89,174],[94,156],[84,153]]})
p=R/'055.json';a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='drawer-tassel':t['id']='wooden-drawer-pendant';t['name']='Turned wooden drawer pendant';t['concealment']='The small dark turned-wood pendant merges into a patterned cabinet upright and hanging textile fringe.'
 if t['id']=='screen-hedgehog':t['outline']=[[x,y-2 if y<min(v[1]for v in t['outline'])+12 else y]for x,y in t['outline']]
a['review']['geometry']=True;a['review']['contextOutlines']=True;a['review']['notes']='Fifteen targets checked in source-context overlays. Fox, hare legs, hedgehog outline and turned-wood pendant identity corrected. Eleven concealed details and four easy anchors; physical-phone review pending.';p.write_text(json.dumps(a,indent=2)+'\n')
patch(56,{
'reclining-hare':[[61,132],[73,119],[91,113],[112,110],[135,112],[148,109],[153,95],[157,76],[164,65],[171,70],[179,88],[185,100],[192,83],[203,68],[209,71],[209,86],[201,106],[205,119],[218,132],[226,143],[237,150],[238,158],[228,163],[206,167],[186,165],[168,168],[146,169],[122,169],[100,167],[81,167],[67,160],[60,149]],
'cabinet-butterfly':[[93,104],[103,99],[119,101],[133,107],[145,117],[152,123],[160,119],[173,111],[189,104],[201,102],[211,107],[214,115],[210,126],[203,137],[192,146],[181,148],[181,161],[173,170],[163,171],[154,160],[150,151],[144,165],[134,173],[124,171],[117,163],[116,152],[103,145],[95,138],[88,126],[87,114]],
'rocking-horse':[[77,153],[90,141],[103,137],[123,139],[137,142],[153,132],[168,109],[173,93],[183,79],[197,78],[207,86],[217,87],[223,98],[218,106],[211,105],[210,115],[201,123],[194,117],[187,134],[180,153],[182,167],[196,178],[203,196],[202,209],[194,216],[184,214],[180,207],[184,201],[177,187],[161,181],[153,169],[148,161],[137,164],[135,179],[127,194],[122,211],[114,216],[108,212],[111,203],[116,185],[118,168],[111,162],[99,162],[93,177],[81,193],[74,198],[71,194],[78,184],[85,167],[85,155],[74,159]],
'pink-rose':[[145,123],[153,112],[171,111],[185,102],[204,102],[217,109],[231,112],[246,123],[256,135],[263,147],[257,158],[245,169],[231,178],[217,184],[198,180],[183,173],[165,169],[153,158],[145,144]]})
p=R/'056.json';a=json.loads(p.read_text())
for t in a['targets']:
 if t['id']=='rocking-horse':t['name']='Porcelain horse'
 if t['id']=='yellow-cloth':t.update(id='wooden-brush',name='Wooden repair brush',concealment='The large pale wooden brush is clearly exposed across the foreground.',outline=[[401,938],[411,929],[429,922],[451,921],[468,922],[488,922],[511,919],[555,915],[604,907],[631,902],[639,906],[640,912],[629,918],[597,924],[560,930],[521,936],[495,941],[477,946],[451,955],[430,960],[412,957],[403,950]])
 if t['id']=='red-pincushion':
  xx=[v[0]for v in t['outline']];cx=(min(xx)+max(xx))/2;mx=max(xx);t['outline']=[[round(x+max(0,(x-cx)/(mx-cx))*10,1),y]for x,y in t['outline']]
 assert Polygon(t['outline']).is_valid,t['id']
a['review']['geometry']=True;a['review']['contextOutlines']=True;a['review']['notes']='Fifteen targets checked in context overlays; complete rose, horse legs, hare ears, butterfly wings and pincushion edge corrected. Yellow cloth was replaced with the clear wooden repair brush. Eleven concealed details and four easy anchors; physical-phone review pending.';p.write_text(json.dumps(a,indent=2)+'\n')
print('Corrected54–56 main contour clipping and identities.')

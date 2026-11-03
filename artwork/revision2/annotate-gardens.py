import json
from pathlib import Path
from shapely.geometry import Polygon
P=Path('artwork/revision2/annotations')
items=[]
def t(id,name,d,p,reason):
 assert Polygon(p).is_valid, id
 items.append(dict(id=id,name=name,difficulty=d,outline=p,concealment=reason))
h='challenging';e='easy'
t('carved-owl','Carved owl',h,[(30,160),(21,133),(29,103),(38,70),(55,55),(72,65),(91,63),(93,86),(81,117),(78,143),(60,168),(41,181)],'Its wooden plumage follows the surrounding carved leaves and vertical bookcase grain.')
t('wooden-hare','Newel-post hare',h,[(370,1067),(367,1037),(374,1010),(380,991),(380,978),(387,973),(395,998),(404,992),(416,1010),(418,1042),(411,1066),(398,1077),(374,1077)],'The hare is carved into the same golden-brown stair post and merges with foliage carving.')
t('desk-mouse','Carved desk mouse',h,[(699,1043),(700,1016),(706,998),(704,983),(713,975),(724,980),(730,990),(744,1006),(750,1035),(741,1051),(718,1055)],'The mouse shares the grain and warm tone of the desk pedestal between books and turned legs.')
t('running-fox','Running fox relief',h,[(642,469),(658,465),(674,458),(689,454),(700,448),(721,451),(738,445),(752,449),(768,459),(777,460),(769,468),(751,467),(740,474),(731,479),(719,473),(711,480),(700,479),(694,471),(678,470),(664,478),(650,479),(661,470)],'The animal is a low-contrast relief within a continuous frieze of carved leaves, with its tail following their curves.')
t('frieze-bird','Carved frieze bird',h,[(954,473),(956,465),(965,464),(973,458),(982,461),(995,468),(1008,469),(996,475),(989,482),(987,493),(980,490),(978,480),(965,480)],'It blends into the repeating gold foliage at the far right of the balcony apron.')
t('magnifying-glass','Round magnifying glass',h,[(175,593),(162,585),(160,571),(166,560),(171,556),(164,534),(167,527),(173,529),(179,552),(192,557),(198,571),(194,583),(185,592)],'The thin brass handle runs alongside the book spines and its transparent lens repeats their colors.')
t('feather-quill','Pale feather quill',h,[(149,774),(151,751),(155,734),(171,713),(184,712),(184,725),(170,741),(159,751),(156,774)],'A pale feather is tucked almost vertically among cream book spines beside the stairs.')
t('shelf-hourglass','Shelf hourglass',h,[(219,157),(240,159),(248,165),(242,170),(241,213),(250,219),(250,225),(222,225),(214,220),(221,213),(222,173),(214,167)],'Amber glass and the slim wooden frame match the narrow books and vertical shelf supports.')
t('brass-scales','Brass balance scales',h,[(680,309),(681,303),(686,285),(687,269),(695,263),(703,263),(704,255),(710,255),(712,262),(724,264),(732,268),(732,287),(738,304),(736,310),(715,309),(716,304),(725,287),(725,272),(712,270),(713,327),(720,333),(720,338),(700,340),(693,336),(694,331),(702,325),(701,269),(689,272),(690,286),(696,303),(695,310)],'Its fine gold lines are embedded among window mullions, hanging herbs, glass bottles and railing details.')
t('armillary-sphere','Brass armillary sphere',h,[(279,352),(283,334),(299,318),(321,313),(340,322),(352,340),(350,359),(337,375),(326,380),(330,389),(340,391),(339,397),(303,396),(299,390),(312,383),(311,380),(292,372)],'The brass circles repeat the nearby scrollwork and blend into dark leather books.')
t('balcony-quill-pot','Balcony quill pot',h,[(764,431),(761,406),(758,393),(764,392),(760,380),(765,376),(773,389),(770,375),(775,372),(782,389),(784,379),(791,380),(788,394),(797,393),(800,400),(795,404),(796,428),(785,434)],'The small pot and quills sit within dense railing arches and share the brass and brown palette.')
t('specimen-skull','Small specimen skull',h,[(585,646),(588,636),(601,629),(609,622),(625,621),(639,627),(645,639),(640,647),(625,652),(605,652),(590,653)],'The cream skull is recessed between similarly colored labels, dried plants and stacked book edges.')
t('tied-herb-packet','Tied herb packet',h,[(188,476),(188,457),(190,439),(183,421),(190,416),(194,403),(202,408),(210,401),(215,411),(224,410),(228,422),(216,437),(217,475),(210,484),(196,483)],'The paper-wrapped bundle matches the pale edges of adjoining books and its knot blends with dried stems.')
t('blue-egg-nest','Nest with blue eggs',h,[(300,464),(301,453),(313,442),(327,438),(345,439),(358,450),(362,461),(356,470),(341,476),(322,474),(306,471)],'The twig nest disappears into book edges and dried branches; the small blue eggs identify it only on inspection.')
t('sleeping-cat','Sleeping cat',e,[(144,1240),(142,1219),(157,1202),(183,1191),(221,1191),(249,1195),(264,1208),(273,1208),(278,1196),(286,1196),(297,1209),(308,1219),(310,1234),(301,1250),(276,1258),(244,1261),(229,1254),(208,1260),(170,1258),(150,1252)],'The curled cat has a complete outline on the stair tread.')
t('floor-lantern','Large floor lantern',e,[(38,1501),(25,1486),(29,1358),(11,1346),(24,1336),(45,1324),(48,1311),(61,1306),(66,1313),(67,1324),(88,1330),(107,1344),(99,1356),(96,1482),(80,1501),(58,1511)],'The lit foreground lantern is large and immediately recognizable.')
t('apple-basket','Basket of apples',e,[(501,1241),(497,1211),(505,1187),(528,1173),(558,1168),(591,1175),(625,1185),(642,1199),(639,1214),(629,1241),(612,1260),(575,1270),(537,1262)],'A broad wicker basket and red apples stand apart from the stone floor.')
t('gold-watering-can','Golden watering can',e,[(879,698),(884,695),(904,714),(904,687),(911,678),(915,671),(926,667),(942,668),(953,678),(957,689),(969,698),(968,713),(956,720),(946,735),(921,739),(909,735),(904,721),(888,708)],'The polished can is clearly displayed on the right-hand shelf.')
t('framed-fern','Framed fern specimen',e,[(709,719),(708,667),(711,647),(720,637),(735,632),(749,637),(756,648),(758,711),(751,720)],'The pale framed fern has a clear rectangular boundary amid darker shelves.')
t('birdcage','Hanging birdcage',e,[(905,642),(903,596),(907,580),(919,567),(934,558),(937,544),(944,543),(947,557),(962,565),(975,579),(979,599),(978,641),(966,649),(925,649)],'The golden cage hangs openly against a dark recess.')
assert len(items)==20 and sum(t['difficulty']==h for t in items)==14
out=dict(id=86,review=dict(artwork=True,geometry=True,smallPhone=False,notes='Natural dense environment generated first. Twenty actual architectural reliefs, specimens and props were chosen from finished pixels. Fourteen blend with shelving, wood grain, scrollwork and neighboring details; six deliberately easy. All contours visually traced and topology checked. Physical iPhone difficulty review pending.'),targets=items)
(P/'086.json').write_text(json.dumps(out,indent=2)+'\n')
print('86:20 targets,14challenging, all valid')

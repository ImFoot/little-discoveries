import json
from pathlib import Path
from shapely.geometry import Polygon
T=[]
def t(id,name,d,p,r):
 assert Polygon(p).is_valid,id
 T.append(dict(id=id,name=name,difficulty=d,outline=p,concealment=r))
h='challenging';e='easy'
t('iron-butterfly','Iron roof butterfly',h,[(236,74),(238,63),(249,65),(263,77),(277,91),(288,76),(306,67),(324,64),(328,70),(319,88),(303,104),(310,118),(305,127),(294,126),(282,111),(279,131),(273,137),(269,126),(270,110),(255,123),(245,122),(241,113),(250,102),(240,91)],'The small butterfly is cast into dark iron roof scrollwork among similar leaves and curves.')
t('shelf-snail','Golden shelf snail',h,[(85,367),(85,352),(94,339),(106,333),(121,332),(136,338),(145,350),(149,364),(163,364),(173,354),(178,353),(177,362),(171,373),(154,379),(125,378),(101,376)],'The small golden shell and body share the ink tins’ brass and copper highlights.')
t('rabbit-block','Rabbit printing block',h,[(249,529),(300,515),(335,602),(270,615)],'The brown relief block is one of many similarly colored printing forms, partly screened by its shelf lip.')
t('ginkgo-block','Ginkgo printing block',h,[(1,642),(67,629),(99,713),(18,730)],'The fan-shaped carving repeats nearby carved leaf forms and wood grain on a tilted block.')
t('dragonfly-block','Dragonfly printing block',h,[(165,630),(274,614),(303,691),(194,711)],'The insect is a warm wood relief among similarly patterned botanical printing blocks.')
t('fern-block','Fern printing block',h,[(184,514),(222,504),(252,605),(214,613)],'The thin fern block merges with neighboring narrow blocks and shelf grain.')
t('press-bee','Press bee fitting',h,[(715,662),(727,660),(741,667),(751,670),(760,664),(778,660),(791,663),(796,668),(786,676),(770,680),(764,691),(758,705),(751,707),(745,694),(740,680),(728,677),(718,670)],'The small brass bee is part of the worn metal press and matches the surrounding gold decorative foliage.')
t('painted-swallow','Painted pitcher swallow',h,[(924,922),(935,916),(949,917),(958,924),(969,919),(981,907),(986,908),(984,921),(975,934),(970,942),(982,951),(980,959),(969,954),(959,945),(951,961),(938,977),(931,977),(938,964),(946,944),(942,935),(934,929)],'The blue swallow is embedded among blue-green leaf patterns on the glazed pitcher.')
t('brass-bird','Press-top brass bird',h,[(883,256),(890,250),(899,246),(909,247),(917,256),(929,261),(947,268),(963,282),(982,292),(983,298),(967,296),(950,290),(936,293),(926,291),(924,303),(917,303),(917,291),(909,287),(900,274),(895,264)],'The small brass bird merges into the metal press top and warm sunflower motifs behind it.')
t('printed-bee','Bee in the botanical book',h,[(440,946),(451,935),(469,931),(478,928),(488,931),(498,926),(513,927),(535,935),(546,941),(541,948),(523,950),(507,947),(501,958),(489,968),(480,970),(475,960),(465,957),(451,956)],'The bee is a flat illustration among fine brown botanical lines and similarly colored leaf silhouettes.')
t('oak-leaf-block','Oak-leaf printing block',h,[(326,1275),(393,1240),(445,1325),(365,1374)],'The carving and its partly stacked block blend into a crowded crate of similarly toned relief forms.')
t('ink-roller','Hand ink roller',e,[(552,1019),(556,994),(576,981),(607,974),(595,959),(585,936),(585,921),(597,913),(609,919),(622,938),(633,964),(647,975),(711,967),(728,978),(740,998),(740,1018),(726,1035),(674,1047),(615,1056),(578,1051),(560,1042)],'The large roller is clearly placed on the open work slab.')
t('pump-bottle','Brass pump bottle',e,[(893,1408),(886,1381),(888,1355),(894,1333),(909,1316),(932,1303),(939,1285),(941,1242),(912,1221),(889,1215),(880,1207),(880,1201),(895,1203),(921,1212),(951,1228),(951,1181),(946,1176),(946,1171),(956,1165),(977,1165),(989,1169),(997,1173),(993,1179),(981,1180),(981,1242),(993,1249),(1007,1257),(1017,1273),(1018,1287),(1011,1297),(999,1293),(995,1280),(982,1275),(981,1302),(1003,1313),(1020,1331),(1024,1399),(1006,1425),(975,1439),(938,1439),(910,1426)],'The golden pump bottle is a clear foreground anchor.')
t('magnifying-glass','Desk magnifying glass',e,[(360,1204),(362,1188),(374,1175),(396,1168),(419,1168),(444,1175),(458,1187),(463,1198),(464,1205),(483,1211),(520,1221),(543,1230),(550,1239),(546,1248),(535,1253),(521,1247),(478,1235),(453,1225),(433,1231),(408,1233),(384,1228),(367,1218)],'A large magnifier lies openly on the near table.')
t('paper-stack','Tied botanical paper stack',e,[(699,1097),(705,1076),(727,1063),(756,1057),(790,1055),(816,1045),(850,1032),(890,1023),(931,1027),(966,1038),(997,1052),(1024,1061),(1024,1161),(1003,1182),(969,1204),(930,1218),(885,1211),(843,1198),(803,1185),(767,1170),(735,1155),(714,1136)],'The thick pale paper bundle is broad and clearly recognizable.')
assert len(T)==15
Path('artwork/revision2/annotations/096.json').write_text(json.dumps(dict(id=96,review=dict(artwork=True,geometry=True,smallPhone=False,notes='Eleven details disguised among printing reliefs, brass machinery and botanical drawings; four open workspace anchors. Shapes topology-valid, final overlay alignment pending.'),targets=T),indent=2)+'\n')
print('96 annotations')

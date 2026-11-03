import json
from pathlib import Path
from shapely.geometry import Polygon
items=[]
def t(id,name,d,p,reason):
 assert Polygon(p).is_valid,id
 items.append(dict(id=id,name=name,difficulty=d,outline=p,concealment=reason))
h='challenging';e='easy'
t('arch-bee','Bronze arbor bee',h,[(429,123),(427,111),(435,99),(437,87),(447,85),(449,76),(458,72),(465,78),(470,86),(487,80),(506,81),(512,88),(506,96),(486,103),(483,115),(476,124),(467,120),(465,130),(458,139),(452,134),(450,122),(440,128)],'The dark bronze bee was reduced and integrated into matching iron scrolls with ivy overlapping its wing.')
t('ivy-key','Ivy-covered arbor key',h,[(803,396),(806,386),(816,383),(814,372),(819,361),(829,358),(839,363),(841,374),(845,374),(875,371),(906,369),(917,368),(922,372),(924,378),(919,383),(915,383),(912,431),(905,433),(891,432),(888,424),(895,420),(902,420),(903,383),(844,384),(842,395),(835,402),(824,405),(812,402)],'The key shares the dark rail patina and sits amid ivy, with part of its teeth screened.')
t('chair-heart','Wooden chair heart',h,[(876,635),(876,624),(885,615),(897,617),(904,623),(912,615),(924,615),(929,625),(925,638),(916,649),(902,664),(887,650)],'The heart now has the same dark timber tone as the foliage carving, and a rose branch crosses a lobe.')
t('blue-floral-jug','Blue floral jug',e,[(235,757),(227,737),(229,707),(231,685),(223,674),(217,658),(216,645),(225,633),(241,630),(249,623),(278,620),(306,618),(325,615),(334,618),(336,625),(325,631),(315,634),(312,645),(316,663),(324,686),(330,708),(332,736),(327,757),(313,772),(290,779),(262,778),(246,771)],'The large jug is a clear supper-table anchor.')
t('wine-bottle','Green wine bottle',e,[(368,775),(367,669),(371,640),(382,622),(383,574),(389,570),(389,546),(401,543),(406,547),(407,571),(411,576),(411,620),(420,637),(426,658),(427,771),(420,784),(392,790),(376,785)],'The complete bottle stands openly beside the jug.')
t('candleholder','Lit candle in brass holder',e,[(441,781),(438,770),(444,758),(453,748),(455,721),(446,714),(450,708),(451,684),(447,682),(449,675),(451,624),(457,617),(458,604),(462,588),(466,605),(466,617),(473,622),(475,678),(480,682),(479,688),(469,692),(470,708),(477,714),(472,721),(471,746),(480,757),(481,767),(476,781)],'The tall candle and brass holder are deliberately visible.')
t('salad-bowl','Bowl of salad',e,[(217,811),(220,799),(238,788),(257,784),(269,774),(287,773),(300,780),(313,775),(324,780),(337,775),(349,785),(365,783),(381,792),(397,805),(397,817),(387,839),(368,860),(342,873),(305,879),(269,872),(241,855),(224,832)],'The colorful salad and blue bowl have a broad recognizable outline.')
t('bread-basket','Basket of sliced bread',e,[(425,779),(429,763),(442,751),(454,745),(470,732),(489,722),(514,718),(538,722),(556,731),(571,740),(594,745),(610,750),(620,761),(621,773),(610,787),(596,807),(574,820),(544,830),(507,829),(477,820),(450,810),(434,795)],'The bread basket sits clearly in the center of the table.')
t('cheese-plate','Cheese on a blue plate',e,[(520,840),(523,830),(536,823),(550,820),(561,801),(568,794),(610,794),(636,806),(641,821),(657,825),(670,834),(669,844),(652,858),(626,866),(593,868),(560,861),(535,853)],'The pale cheese wedge and plate are an easy find.')
t('striped-napkin','Folded striped napkin',e,[(363,872),(367,859),(394,846),(414,842),(436,841),(468,850),(495,866),(514,879),(535,885),(554,889),(554,902),(547,920),(536,935),(510,956),(483,971),(466,965),(449,956),(426,941),(408,924),(392,904),(375,887)],'The folded napkin is openly draped at the near table edge.')
assert len(items)==10 and sum(t['difficulty']==h for t in items)==3
Path('artwork/revision2/annotations/100.json').write_text(json.dumps(dict(id=100,review=dict(artwork=True,geometry=True,smallPhone=False,notes='Final break: three subtly integrated bronze/wood targets, seven open supper props. Source edited to improve concealment of bee/key/heart. All shapes topology-valid; final outline-overlay audit pending.'),targets=items),indent=2)+'\n')
print('100annotationsready')

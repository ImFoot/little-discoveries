import json
from pathlib import Path
from shapely.geometry import Polygon
p=Path('artwork/revision2/annotations/054.json');a=json.loads(p.read_text())
updates={
 'beetle-sketch':dict(id='wheel-sketch',name='Wheel mechanism sketch',concealment='A faint graphite wheel mechanism is embedded in the dense construction drawing on a slanted notebook page.',outline=[[472,881],[480,873],[492,870],[507,870],[524,876],[536,883],[541,893],[535,901],[523,906],[508,909],[495,906],[482,902],[472,894]]),
 'bird-sketch':dict(outline=[[475,942],[484,926],[493,920],[504,921],[515,903],[525,890],[531,886],[532,894],[540,890],[546,895],[542,902],[551,897],[556,903],[549,910],[554,910],[552,917],[545,924],[536,933],[539,940],[551,944],[570,945],[576,950],[571,955],[553,956],[541,951],[537,952],[542,958],[538,962],[532,958],[530,952],[524,953],[522,963],[514,964],[513,959],[518,951],[507,948],[496,941],[485,938]]),
 'clockwork-scorpion':dict(id='clockwork-chick',name='Clockwork chick',concealment='The little brass bird is partly surrounded by fine chains and gears of the same warm metal, breaking up its silhouette.',outline=[[521,816],[527,811],[530,801],[536,796],[543,798],[547,805],[562,808],[552,812],[547,816],[546,827],[540,836],[535,839],[535,847],[541,849],[540,853],[530,852],[527,845],[525,837],[520,838],[514,842],[510,840],[517,833],[520,826]]),
 'openwork-butterfly':dict(id='paired-swans',name='Paired swans on a box',concealment='Two gilded birds are embedded in the floral relief of a dark wooden music box; their feathers share neighboring leaf patterns.',outline=[[732,525],[738,516],[748,509],[756,509],[763,514],[766,523],[763,535],[754,546],[751,554],[760,556],[770,548],[781,537],[782,527],[778,520],[772,523],[767,521],[770,512],[781,507],[790,509],[794,518],[793,529],[785,542],[783,551],[799,546],[813,538],[821,534],[826,539],[825,550],[817,558],[809,563],[797,566],[781,562],[769,568],[755,569],[744,563],[737,552],[741,539],[752,527],[752,519],[745,519],[737,528]])}
for t in a['targets']:
 if t['id'] in updates:t.update(updates[t['id']])
 assert Polygon(t['outline']).is_valid,t['id']
p.write_text(json.dumps(a,indent=2)+'\n');print('054 crop-audited and corrected actual chick, sketches and swan relief.')

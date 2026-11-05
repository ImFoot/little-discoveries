import cv2,numpy as np,json
from pathlib import Path
root=Path('artwork/lantern-056'); im=cv2.imread(str(root/'assets/objects-atlas.png'),cv2.IMREAD_UNCHANGED);h,w=im.shape[:2]
names=[('coral-scissors','Coral scissors'),('indigo-ink','Indigo ink bottle'),('wooden-stamp','Wooden stamp'),('paper-crane','Paper crane'),('candle','Candle holder'),('thread-spool','Thread spool'),('paintbrush','Paintbrush'),('wooden-peg','Wooden peg'),('brass-key','Brass key'),('folding-ruler','Folding ruler'),('coral-twine','Coral twine'),('paper-moon','Paper moon')]
assets=[]
for i,(id,name) in enumerate(names):
 y0,y1=round(i//3*h/4),round((i//3+1)*h/4);x0,x1=round(i%3*w/3),round((i%3+1)*w/3)
 cell=im[y0:y1,x0:x1].copy(); mask=(cell[:,:,3]>180).astype(np.uint8)
 n,labels,stats,cents=cv2.connectedComponentsWithStats(mask,8); k=1+np.argmax(stats[1:,4]);mask=(labels==k).astype(np.uint8)*255
 # Isolated alpha noise is not part of any object. Retain antialiased edge pixels adjacent to its main component.
 support=cv2.dilate(mask,np.ones((3,3),np.uint8));cell[:,:,3]=np.where(support>0,cell[:,:,3],0)
 ys,xs=np.where(mask>0);a,b,c,d=max(0,xs.min()-3),max(0,ys.min()-3),min(cell.shape[1],xs.max()+4),min(cell.shape[0],ys.max()+4)
 cell=cell[b:d,a:c];cv2.imwrite(str(root/f'assets/{id}.png'),cell)
 assets.append(dict(id=id,name=name,file=f'assets/{id}.png',width=cell.shape[1],height=cell.shape[0]))
(root/'assets/objects.json').write_text(json.dumps(assets,indent=2)+'\n')
print([(x['id'],x['width'],x['height']) for x in assets])

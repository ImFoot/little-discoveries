from pathlib import Path
import cv2,numpy as np,json
r=Path('artwork/assembly-057');assets=[]
sheets=[('frame',[(1,'stall-frame')]),('structures',[(2,'workbench'),(1,'paper-rack'),(3,'box-back'),(4,'box-front')]),('containers',[(1,'hamper-back'),(2,'hamper-front'),(3,'paper-rolls'),(4,'coral-paper'),(6,'paper-strips'),(5,'indigo-cloth')]),('decor',[(2,'coral-lantern'),(1,'ivory-lantern'),(3,'teal-lantern'),(5,'lantern-skeleton'),(4,'box-stack'),(6,'bamboo-hoops'),(8,'ribbon-reels'),(7,'bamboo-plant'),(9,'woven-tray')])]
for src,items in sheets:
 im=cv2.imread(str(r/f'assets/{src}-source.png'),-1);binary=(im[:,:,3]>180).astype(np.uint8);n,labels,stats,_=cv2.connectedComponentsWithStats(binary,8)
 for k,name in items:
  keep=(labels==k).astype(np.uint8)*255;support=cv2.dilate(keep,np.ones((3,3),np.uint8));a=im.copy();a[:,:,3]=np.where(support>0,im[:,:,3],0);a[a[:,:,3]==0]=0
  x,y,w,h,_=stats[k];x0,y0=max(0,x-2),max(0,y-2);a=a[y0:min(a.shape[0],y+h+2),x0:min(a.shape[1],x+w+2)]
  cv2.imwrite(str(r/f'assets/{name}.png'),a);assets.append(dict(id=name,file=f'assets/{name}.png',width=a.shape[1],height=a.shape[0],kind='environment-component',source=src+'-source.png'))
(r/'assets/components.json').write_text(json.dumps(assets,indent=2)+'\n');print([(a['id'],a['width'],a['height'])for a in assets])

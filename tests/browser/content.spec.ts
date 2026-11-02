import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {inside,clampView,polygonArea,edgeDistance} from '../../src/geometry';
import type {Catalog,Level,Point,Target} from '../../src/types';
import {freshSave,newAttempt} from '../../src/save';
const catalog=JSON.parse(readFileSync('public/content/catalog.json','utf8')) as Catalog;
const authored=catalog.levels.filter(l=>l.status==='reviewed');
function pointWithin(target:Target,targets:Target[],scale:number):Point{
 const xs=target.outline.map(p=>p[0]),ys=target.outline.map(p=>p[1]);
 const left=Math.min(...xs),top=Math.min(...ys),w=Math.max(...xs)-left,h=Math.max(...ys)-top;
 const area=polygonArea(target.outline);
 const foreground=targets.filter(other=>other.id!==target.id&&polygonArea(other.outline)<area);
 const candidates:Point[]=[];
 for(let y=1;y<32;y++)for(let x=1;x<32;x++){const p:Point=[left+w*x/32,top+h*y/32];if(inside(p,target.outline)&&!target.holes?.some(h=>inside(p,h))&&!foreground.some(other=>edgeDistance(p,other.outline)*scale<=3))candidates.push(p);}
 const center:Point=[left+w/2,top+h/2];
 candidates.sort((a,b)=>Math.hypot(a[0]-center[0],a[1]-center[1])-Math.hypot(b[0]-center[0],b[1]-center[1]));
 if(!candidates.length)throw Error(`${target.id}: no interior point`);
 return candidates[0];
}
async function dismissIntro(page:Page){if(await page.getByRole('button',{name:'Let’s explore',exact:true}).isVisible())await page.getByRole('button',{name:'Let’s explore',exact:true}).click();}

test('a narrow foreground comb keeps its edge when pointer coordinates are rounded',async({page})=>{
 const level=JSON.parse(readFileSync('public/content/levels/019.json','utf8')) as Level;
 const save=freshSave();save.current=19;save.onboarded=true;save.attempts[19]={...newAttempt(),found:level.targets.slice(0,6).map(t=>t.id)};
 await page.addInitScript(value=>localStorage.setItem('little-discoveries.save.v1',JSON.stringify(value)),save);
 await page.goto('/#scene/19');await expect(page.locator('#object-tray .object-card')).toHaveCount(10);await expect(page.locator('#progress')).toHaveText('6 / 10');
 const target=level.targets[6];await page.getByRole('button',{name:'Show me',exact:true}).click();
 const r=(await page.locator('#picture').boundingBox())!,size=await page.locator('#picture').evaluate(el=>({width:el.clientWidth,height:el.clientHeight})),view=clampView(target.inspect,level.width,level.height,size.width,size.height),scale=Math.min(size.width/level.width,size.height/level.height)*view.zoom,p=pointWithin(target,level.targets,scale);
 await page.mouse.click(r.x+size.width/2+(p[0]-view.x*level.width)*scale,r.y+size.height/2+(p[1]-view.y*level.height)*scale);
 await expect(page.locator('#progress')).toHaveText('7 / 10');
});

test('an unfound scarf keeps its visible edge beside an unfound journal',async({page})=>{
 const level=JSON.parse(readFileSync('public/content/levels/060.json','utf8')) as Level;
 const save=freshSave();save.current=60;save.onboarded=true;save.attempts[60]={...newAttempt(),found:level.targets.slice(0,3).map(t=>t.id)};
 await page.addInitScript(value=>localStorage.setItem('little-discoveries.save.v1',JSON.stringify(value)),save);
 await page.goto('/#scene/60');await expect(page.locator('#object-tray .object-card')).toHaveCount(14);
 const target=level.targets[3];await page.getByRole('button',{name:'Show me',exact:true}).click();
 const r=(await page.locator('#picture').boundingBox())!,size=await page.locator('#picture').evaluate(el=>({width:el.clientWidth,height:el.clientHeight})),view=clampView(target.inspect,level.width,level.height,size.width,size.height),scale=Math.min(size.width/level.width,size.height/level.height)*view.zoom,p=pointWithin(target,level.targets,scale);
 await page.mouse.click(r.x+size.width/2+(p[0]-view.x*level.width)*scale,r.y+size.height/2+(p[1]-view.y*level.height)*scale);
 await expect(page.locator('#progress')).toHaveText('4 / 14');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('little-discoveries.save.v1')!).attempts[60].found)).toContain(target.id);
});

test('every authored placement can be revealed and collected through the real scene picker',async({page},info)=>{
 test.setTimeout(1_200_000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 let placements=0;
 for(const meta of authored){
  const level=JSON.parse(readFileSync(`public/content/levels/${String(meta.id).padStart(3,'0')}.json`,'utf8')) as Level;
  await page.goto(`/#scene/${meta.id}`);
  await expect(page.locator('.play-heading h1')).toHaveText(meta.title);
  await expect(page.locator('#object-tray .object-card')).toHaveCount(meta.targetCount);
  await dismissIntro(page);
  for(let index=0;index<level.targets.length;index++){
   const target=level.targets[index];
   await page.getByRole('button',{name:'Show me',exact:true}).click();
   const r=(await page.locator('#picture').boundingBox())!;
   const size=await page.locator('#picture').evaluate(el=>({width:el.clientWidth,height:el.clientHeight}));
   const view=clampView(target.inspect,level.width,level.height,size.width,size.height);
   const scale=Math.min(size.width/level.width,size.height/level.height)*view.zoom;
   const p=pointWithin(target,level.targets,scale);
   const x=r.x+size.width/2+(p[0]-view.x*level.width)*scale;
   const y=r.y+size.height/2+(p[1]-view.y*level.height)*scale;
   expect(x,`${target.id} reachable horizontally`).toBeGreaterThanOrEqual(r.x);
   expect(x,`${target.id} reachable horizontally`).toBeLessThanOrEqual(r.x+r.width);
   expect(y,`${target.id} reachable vertically`).toBeGreaterThanOrEqual(r.y);
   expect(y,`${target.id} reachable vertically`).toBeLessThanOrEqual(r.y+r.height);
   await page.mouse.click(x,y);
   await expect(page.locator('#progress'),`${meta.id}: ${target.name}`).toHaveText(`${index+1} / ${meta.targetCount}`);
   const found=await page.evaluate(id=>JSON.parse(localStorage.getItem('little-discoveries.save.v1')!).attempts[id].found,meta.id);
   expect(found,`${meta.id}: correct target collected`).toContain(target.id);
   placements++;
  }
  await expect(page.getByRole('dialog').getByRole('heading',{name:'All found. Nicely spotted.'})).toBeVisible();
  if(meta.id===100)await expect(page.getByRole('dialog').getByText('Made for you, with love.',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Stay and look',exact:true}).click();
 }
 expect(errors).toEqual([]);
 expect(placements).toBe(authored.reduce((n,l)=>n+l.targetCount,0));
 if(authored.length===100){await page.goto('/#album');await expect(page.locator('.postcard')).toHaveCount(10);await expect(page.getByRole('heading',{name:'A whole world of discoveries.'})).toBeVisible();}
 await info.attach('verified-placements.json',{body:JSON.stringify({engine:info.project.name,scenes:authored.length,placements,physicalIPhone:false},null,2),contentType:'application/json'});
});

test('a complete chapter downloads, survives offline navigation, detects missing files, and repairs',async({page,context})=>{
 test.setTimeout(120000);
 await page.goto('/#scene/1');await expect(page.locator('#object-tray .object-card')).toHaveCount(8);await dismissIntro(page);
 await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
 await page.getByRole('button',{name:'Open settings',exact:true}).click();await page.getByRole('button',{name:'1. A cozy start',exact:true}).click();
 await page.getByRole('button',{name:/^(Keep this chapter offline|Resume download)$/,exact:true}).click();
 await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});
 await page.getByRole('button',{name:'Close panel',exact:true}).click();
 await context.setOffline(true);
 for(let id=1;id<=10;id++){
  await page.goto(`/#scene/${id}`);await expect(page.locator('.play-heading h1')).toHaveText(catalog.levels[id-1].title);await expect(page.locator('#object-tray .object-card')).toHaveCount(catalog.levels[id-1].targetCount);
  await expect(page.locator('#picture canvas')).toBeVisible();
  await expect.poll(()=>page.locator('#object-tray img').evaluateAll(images=>images.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
  if(id===5){await page.locator('#object-tray .object-card').first().click();await page.getByRole('button',{name:'Mark found',exact:true}).click();await expect(page.locator('#progress')).toHaveText('1 / 8');}
 }
 const removed=await page.evaluate(async()=>{
  const manifest=await (await fetch('./offline-manifest.json')).json();
  const cache=await caches.open(`little-discoveries-content-${manifest.contentVersion}`);
  const victim=manifest.chapters[0].files.find((f:{url:string})=>f.url==='art/005.webp');
  return cache.delete(new URL(victim.url,location.href).href);
 });expect(removed).toBe(true);
 await page.goto('/#scene/5');await expect(page.getByRole('button',{name:'Try again',exact:true})).toBeVisible();await expect(page.getByText('This picture couldn’t open. Reconnect and tap Try again. Your discoveries are safe.',{exact:true})).toBeVisible();await expect(page.locator('#progress')).toHaveText('1 / 8');
 await page.getByRole('button',{name:'Open settings',exact:true}).click();await page.getByRole('button',{name:'1. A cozy start',exact:true}).click();
 await expect(page.getByText('Available offline',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Resume download',exact:true})).toBeVisible();
 await context.setOffline(false);await page.getByRole('button',{name:'Resume download',exact:true}).click();await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});
 await page.getByRole('button',{name:'Close panel',exact:true}).click();await page.getByRole('button',{name:'Try again',exact:true}).click();await expect(page.locator('#picture canvas')).toBeVisible();await expect(page.locator('#object-tray .object-card')).toHaveCount(8);await expect(page.locator('#progress')).toHaveText('1 / 8');
});

test('an interrupted chapter download resumes without discarding cached files or progress',async({page,context})=>{
 test.setTimeout(120000);
 await page.goto('/#scene/1');await expect(page.locator('#object-tray .object-card')).toHaveCount(8);await dismissIntro(page);
 await page.getByRole('button',{name:'All objects',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Striped mug',exact:true}).click();await page.getByRole('button',{name:'Mark found',exact:true}).click();
 await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
 await page.getByRole('button',{name:'Open settings',exact:true}).click();await page.getByRole('button',{name:'2. Gardens and green places',exact:true}).click();
 await page.getByRole('button',{name:'Keep this chapter offline',exact:true}).click();
 await expect.poll(()=>page.locator('progress').getAttribute('value')).not.toBe('0');
 await context.setOffline(true);
 await expect(page.getByRole('button',{name:'Resume download',exact:true})).toBeVisible();
 const before=+(await page.locator('progress').getAttribute('value'))!;expect(before).toBeGreaterThan(0);
 await context.setOffline(false);await page.getByRole('button',{name:'Resume download',exact:true}).click();await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});
 const after=+(await page.locator('progress').getAttribute('value'))!;expect(after).toBeGreaterThan(before);
 await page.getByRole('button',{name:'Close panel',exact:true}).click();await expect(page.locator('#progress')).toHaveText('1 / 8');
});

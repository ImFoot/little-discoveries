import {test,expect} from '@playwright/test';
import {readFile,unlink} from 'node:fs/promises';
import {writeArtifact} from '../../scripts/artifact-io.mjs';
import {catalog,firstLevel,start,ready,readLevel,dismissIntro,targetCoordinates,assist} from './helpers';
import {freshSave,newAttempt} from '../../src/save';
import legacy from '../../src/data/legacy-catalog-v1.json' with {type:'json'};
const authored=catalog.levels.filter(l=>l.status==='reviewed');

test('old Safari progress follows its picture from 72 to 22 without double migration',async({page})=>{
 const old={...freshSave(),version:1,current:72,onboarded:true,favorites:[72],attempts:{72:{...newAttempt(),found:legacy[71].targetIds.slice(0,13),view:{x:.62,y:.41,zoom:3}}}};
 await page.addInitScript(value=>{if(!localStorage.getItem('migration-test-seeded')){localStorage.setItem('little-discoveries.save.v1',JSON.stringify(value));localStorage.setItem('migration-test-seeded','yes');}},old);
 await page.goto('/#scene/72');await ready(page,22);await expect(page).toHaveURL(/#scene\/22$/);await expect(page.locator('#progress')).toHaveText('13 / 14');
 await page.reload();await ready(page,22);await expect(page.locator('#progress')).toHaveText('13 / 14');
 const state=await page.evaluate(()=>({save:JSON.parse(localStorage.getItem('little-discoveries.save.v3')!),original:JSON.parse(localStorage.getItem('little-discoveries.save.v1.before-revision2')!)}));expect(state.save.version).toBe(3);expect(state.save.current).toBe(22);expect(state.save.favorites).toEqual([22]);expect(state.original.current).toBe(72);expect(state.save.attempts[22].view.zoom).toBe(3);
});

test('an original cached tab upgrades on reload and preserves discoveries',async({page},info)=>{
 const old={...freshSave(),version:1,current:72,onboarded:true,attempts:{72:{...newAttempt(),found:legacy[71].targetIds.slice(0,13)}}};
 const filename='upgrade-'+info.project.name+'.html',path='dist/'+filename;
 try{
  // Serve an actual old document over HTTP; intercepted synthetic documents
  // are not consistently exposed through WebKit's worker Clients API.
  await writeArtifact(path,'<!doctype html><title>Original collection tab</title><body>Original collection</body>');
  await page.goto('/'+filename+'#scene/72');
  await writeArtifact(path,await readFile('dist/index.html'));
  await page.evaluate(async value=>{
   localStorage.setItem('little-discoveries.save.v1',JSON.stringify(value));
   const cache=await caches.open('little-discoveries-shell-original-fixture');
   await cache.put(new URL('content/catalog.json',location.href),new Response(JSON.stringify({revision:1}),{headers:{'Content-Type':'application/json'}}));
   void navigator.serviceWorker.register('./sw.js',{scope:'./'});
  },old);
  await expect.poll(()=>page.evaluate(()=>navigator.serviceWorker.controller?.state)).toBe('activated');
  await page.reload();
  await ready(page,22);await expect(page.locator('#progress')).toHaveText('13 / 14');await expect(page).toHaveURL(/#scene\/22$/);
  expect(await page.evaluate(()=>caches.keys())).not.toContain('little-discoveries-shell-original-fixture');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('little-discoveries.save.v3')!).version)).toBe(3);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('little-discoveries.save.v1')!).version)).toBe(1);
  await page.reload();await ready(page,22);await expect(page.locator('#progress')).toHaveText('13 / 14');
 }finally{await unlink(path);}
});

test('every authored placement can be revealed and collected through the real scene picker',async({page},info)=>{
 test.setTimeout(1_200_000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));let placements=0;
 for(const meta of authored){const level=readLevel(meta.id);await page.goto(`/#scene/${meta.id}`);await ready(page,meta.id);await dismissIntro(page);
  for(let index=0;index<level.targets.length;index++){
   const target=level.targets[index];await page.getByRole('button',{name:'Show me',exact:true}).click();const p=await targetCoordinates(page,level,target,target.inspect),r=(await page.locator('#picture').boundingBox())!;
   expect(p.x,`${target.id} horizontally reachable`).toBeGreaterThanOrEqual(r.x);expect(p.x).toBeLessThanOrEqual(r.x+r.width);expect(p.y,`${target.id} vertically reachable`).toBeGreaterThanOrEqual(r.y);expect(p.y).toBeLessThanOrEqual(r.y+r.height);
   await page.mouse.click(p.x,p.y);await expect(page.locator('#progress'),`${meta.id}: ${target.name}`).toHaveText(`${index+1} / ${meta.targetCount}`);
   expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('little-discoveries.save.v3')!).attempts[id].found,meta.id)).toContain(target.id);placements++;
  }
  await expect(page.getByRole('dialog').getByRole('heading',{name:'All found. Nicely spotted.'})).toBeVisible();if(meta.id===50)await expect(page.getByRole('dialog').getByText('Made for you, with love.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Stay and look',exact:true}).click();
 }
 expect(errors).toEqual([]);expect(placements).toBe(catalog.requiredPlacements);await page.goto('/#album');await expect(page.locator('.postcard')).toHaveCount(6);await expect(page.getByRole('heading',{name:'A whole world of discoveries.'})).toBeVisible();await info.attach('verified-placements.json',{body:JSON.stringify({engine:info.project.name,scenes:authored.length,placements,physicalIPhone:false}),contentType:'application/json'});
});

test('a complete chapter works offline, detects missing art and repairs without losing finds',async({page,context})=>{
 test.setTimeout(120000);await start(page);await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
 const openChapter=async()=>{await page.getByRole('button',{name:'Open settings',exact:true}).click();await page.getByRole('button',{name:`1. ${catalog.chapters[0].title}`,exact:true}).click();};
 await openChapter();await page.getByRole('button',{name:/^(Keep this chapter offline|Resume download)$/}).click();await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});await page.getByRole('button',{name:'Close panel',exact:true}).click();await context.setOffline(true);
 for(let id=1;id<=10;id++){await page.goto(`/#scene/${id}`);await ready(page,id);await expect(page.locator('#picture canvas')).toBeVisible();await expect.poll(()=>page.locator('#object-tray img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);if(id===5){await assist(page,readLevel(5).targets[0].name);await expect(page.locator('#progress')).toHaveText(`1 / ${catalog.levels[4].targetCount}`);}}
 expect(await page.evaluate(async art=>{const m=await(await fetch('./offline-manifest-v3.json')).json(),cache=await caches.open(`little-discoveries-content-${m.contentVersion}`);return cache.delete(new URL(art,location.href).href);},readLevel(5).art)).toBe(true);
 await page.goto('/#scene/5');await expect(page.getByRole('button',{name:'Try again',exact:true})).toBeVisible();await expect(page.getByText('This picture couldn’t open. Reconnect and tap Try again. Your discoveries are safe.',{exact:true})).toBeVisible();await expect(page.locator('#progress')).toHaveText(`1 / ${catalog.levels[4].targetCount}`);
 await openChapter();await expect(page.getByText('Available offline',{exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Resume download',exact:true})).toBeVisible();await context.setOffline(false);await page.getByRole('button',{name:'Resume download',exact:true}).click();await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});await page.getByRole('button',{name:'Close panel',exact:true}).click();await page.getByRole('button',{name:'Try again',exact:true}).click();await ready(page,5);await expect(page.locator('#progress')).toHaveText(`1 / ${catalog.levels[4].targetCount}`);
});

test('an interrupted chapter download resumes without discarding cached files or progress',async({page,context})=>{
 test.setTimeout(120000);await start(page);await assist(page,firstLevel.targets[0].name);await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));await page.getByRole('button',{name:'Open settings',exact:true}).click();await page.getByRole('button',{name:`2. ${catalog.chapters[1].title}`,exact:true}).click();await page.getByRole('button',{name:'Keep this chapter offline',exact:true}).click();await expect.poll(()=>page.locator('progress').getAttribute('value')).not.toBe('0');await context.setOffline(true);await expect(page.getByRole('button',{name:'Resume download',exact:true})).toBeVisible();const before=+(await page.locator('progress').getAttribute('value'))!;expect(before).toBeGreaterThan(0);await context.setOffline(false);await page.getByRole('button',{name:'Resume download',exact:true}).click();await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});expect(+(await page.locator('progress').getAttribute('value'))!).toBeGreaterThan(before);await page.getByRole('button',{name:'Close panel',exact:true}).click();await expect(page.locator('#progress')).toHaveText(`1 / ${firstLevel.targetCount}`);
});

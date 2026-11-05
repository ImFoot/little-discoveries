import {test,expect} from '@playwright/test';
import {catalog,start,ready,readLevel,assist,saved} from './helpers';
import {freshSave,newAttempt} from '../../src/save';
import previous from '../../src/data/legacy-catalog-v2.json' with {type:'json'};
import {readFile,unlink} from 'node:fs/promises';
import {writeArtifact} from '../../scripts/artifact-io.mjs';
import {catalogUrl,offlineManifestUrl} from '../../src/content';
import {targetCoordinates} from './helpers';

test('revision two updates preserve level 24 and do not transfer rejected finds to sample 51',async({page})=>{
 const old={...freshSave(),version:2,current:24,onboarded:true,completed:[51],favorites:[24,80],attempts:{24:{...newAttempt(),found:previous.levels[23].targetIds.slice(0,4)},51:{...newAttempt(),found:previous.levels[50].targetIds,completed:true}}};
 await page.addInitScript(value=>{if(!localStorage.getItem('seeded-r2')){localStorage.setItem('little-discoveries.save.v2',JSON.stringify(value));localStorage.setItem('seeded-r2','yes');}},old);
 await page.goto('/#scene/24');await ready(page,24);await expect(page.locator('#progress')).toHaveText('4 / 15');
 expect((await saved(page)).favorites).toEqual([24]);expect((await saved(page)).completed).not.toContain(51);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('little-discoveries.save.v2.before-samples3')!).version)).toBe(2);
 await page.goto('/#scene/51');await ready(page,51);await expect(page.locator('#progress')).toHaveText('0 / 12');
 await assist(page,readLevel(51).targets[0].name);await page.reload();await ready(page,51);await expect(page.locator('#progress')).toHaveText('1 / 12');
 await page.goto('/#scene/80');await expect(page.locator('.home')).toBeVisible();await expect(page.locator('#picture')).toHaveCount(0);
});

test('all six scenes and their unchanged source previews download as one complete offline set',async({page,context})=>{
 await start(page,51);await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));await page.getByRole('button',{name:'Open settings',exact:true}).click();
 await page.getByRole('button',{name:'6. '+catalog.chapters[5].title,exact:true}).click();await expect(page.getByText('Keep all 6 pictures and their little details with you.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/^(Keep this chapter offline|Resume download)$/}).click();await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});await page.getByRole('button',{name:'Close panel',exact:true}).click();
 await context.setOffline(true);
 for(const id of [51,52,53,54,55,56]){
  await page.goto(`/#scene/${id}`);await ready(page,id);await expect.poll(()=>page.locator('#object-tray img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
  await assist(page,readLevel(id).targets[0].name);await page.reload();await ready(page,id);await expect(page.locator('#progress')).toHaveText('1 / 12');
 }
});

test('all twelve new sample objects can be revealed, touched and saved without duplicate credit',async({page},info)=>{
 const level=readLevel(56),errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await start(page,56);
 for(let index=0;index<level.targets.length;index++){
  const target=level.targets[index];await page.getByRole('button',{name:'Hint',exact:true}).click();await page.getByRole('button',{name:'Hint',exact:true}).click();
  await expect(page.locator('#progress')).toHaveText(`${index} / 12`);
  await page.getByRole('button',{name:'Show me',exact:true}).click();await expect(page.locator('#reveal-notice')).toBeVisible();
  const point=await targetCoordinates(page,level,target,target.inspect),picture=(await page.locator('#picture').boundingBox())!;
  expect(point.x).toBeGreaterThanOrEqual(picture.x);expect(point.x).toBeLessThanOrEqual(picture.x+picture.width);expect(point.y).toBeGreaterThanOrEqual(picture.y);expect(point.y).toBeLessThanOrEqual(picture.y+picture.height);
  await page.touchscreen.tap(point.x,point.y);await expect(page.locator('#progress'),target.name).toHaveText(`${index+1} / 12`);
  expect((await saved(page)).attempts[56].found).toContain(target.id);
  if(index<level.targets.length-1){await page.touchscreen.tap(point.x,point.y);await expect(page.locator('#progress')).toHaveText(`${index+1} / 12`);}
 }
 await expect(page.getByRole('heading',{name:'All found. Nicely spotted.'})).toBeVisible();expect((await saved(page)).completed).toContain(56);
 await page.getByRole('button',{name:'Stay and look',exact:true}).click();await page.reload();await ready(page,56);await expect(page.locator('#progress')).toHaveText('12 / 12');
 expect((await saved(page)).attempts[56].found).toEqual(level.targets.map(target=>target.id));expect(errors).toEqual([]);
 await info.attach('sample-56-collection.json',{body:JSON.stringify({scene:56,placements:12,engine:info.project.name,physicalIPhone:false}),contentType:'application/json'});
});

test('normal reload bypasses an installed 55-scene cache-first catalog and preserves version-three finds',async({page,context},info)=>{
 const name='sample56-upgrade-'+info.project.name,documentPath='dist/'+name+'.html',workerPath='dist/'+name+'.js';
 const oldCatalog=JSON.parse(await readFile('public/content/v3/catalog-55.json','utf8')),old=freshSave();
 expect(oldCatalog.requiredScenes).toBe(55);expect(oldCatalog.requiredPlacements).toBe(726);
 old.current=55;old.onboarded=true;old.completed=[51];old.favorites=[24,51,55];old.preferences.largePreviews=true;
 old.attempts[24]={...newAttempt(),found:catalog.levels[23].targetIds.slice(0,4),view:{x:.6,y:.4,zoom:2}};
 old.attempts[51]={...newAttempt(),found:[...catalog.levels[50].targetIds],completed:true};
 old.attempts[55]={...newAttempt(),found:catalog.levels[54].targetIds.slice(0,3)};
 const cacheName='little-discoveries-shell-four-samples-fixture';
 const manifest=JSON.parse(await readFile('dist/'+offlineManifestUrl,'utf8')) as {compatibleContentVersion:string;contentVersion:string};
 // Content hash from the published 55-scene release, independently of the
 // current build's compatibility calculation.
 const previousContentVersion='982742b92f4967cf';expect(manifest.compatibleContentVersion).toBe(previousContentVersion);
 const retainedIds=[24,55],retainedFiles=retainedIds.flatMap(id=>{const level=readLevel(id);return['content/v3/levels/'+String(id).padStart(3,'0')+'.json',level.art,level.thumbnail,...level.targets.map(target=>target.preview)];});
 try{
  // Match the installed v3 worker's path-only shell lookup, including its
  // query stripping. A release query would still return this stale catalog.
  await writeArtifact(documentPath,'<!doctype html><title>Previous sample collection</title><body>Previous sample collection</body>');
  await writeArtifact(workerPath,`const C=${JSON.stringify(cacheName)};const resolve=p=>new URL(p,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(C);await c.put(resolve('content/v3/catalog-55.json'),new Response(${JSON.stringify(JSON.stringify(oldCatalog))},{headers:{'Content-Type':'application/json'}}));await c.put(resolve('app-v3-55.html'),new Response('<!doctype html><body>Previous sample collection</body>',{headers:{'Content-Type':'text/html'}}));await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{const relative=event.request.url.slice(self.registration.scope.length).split('?')[0];if(relative==='content/v3/catalog-55.json')event.respondWith(caches.open(C).then(c=>c.match(resolve(relative))));else if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.open(C).then(c=>c.match(resolve('app-v3-55.html')))));});`);
  await page.goto('/'+name+'.html#scene/55');
  await page.evaluate(async({save,worker})=>{localStorage.setItem('little-discoveries.save.v3',JSON.stringify(save));localStorage.setItem('little-discoveries.save.v3.recovery',JSON.stringify(save));await navigator.serviceWorker.register('./'+worker,{scope:'./'});},{save:old,worker:name+'.js'});
  await expect.poll(()=>page.evaluate(()=>navigator.serviceWorker.controller?.state)).toBe('activated');
  await page.evaluate(async({version,files})=>{const cache=await caches.open('little-discoveries-content-'+version);await cache.addAll(files);},{version:previousContentVersion,files:retainedFiles});
  expect(await page.evaluate(async()=> (await(await fetch('content/v3/catalog-55.json?release=56')).json()).levels.length)).toBe(55);
  await context.setOffline(true);await page.reload();await expect(page.getByText('Previous sample collection',{exact:true})).toBeVisible();expect(await saved(page)).toEqual(old);
  await context.setOffline(false);await writeArtifact(documentPath,await readFile('dist/index.html'));await page.reload();await ready(page,55);await expect(page.locator('#progress')).toHaveText('3 / 12');
  const updated=await saved(page);expect(updated.version).toBe(3);expect(updated.completed).toEqual(old.completed);expect(updated.favorites).toEqual(old.favorites);expect(updated.preferences).toEqual(old.preferences);expect(updated.attempts[24]).toEqual(old.attempts[24]);expect(updated.attempts[51]).toEqual(old.attempts[51]);
  expect(await page.evaluate(async path=>(await(await fetch(path)).json()).levels.length,catalogUrl)).toBe(56);
  await page.goto('/#scene/56');await ready(page,56);await expect(page.locator('#progress')).toHaveText('0 / 12');await assist(page,readLevel(56).targets[0].name);
  await expect.poll(()=>page.evaluate(()=>navigator.serviceWorker.controller?.scriptURL.endsWith('/sw.js'))).toBe(true);
  await expect.poll(()=>page.evaluate(()=>caches.keys())).not.toContain(cacheName);
  expect(await page.evaluate(async({version,files})=>{const cache=await caches.open('little-discoveries-content-'+version);return(await Promise.all(files.map(file=>cache.match(new URL(file,location.href))))).every(response=>response?.ok);},{version:manifest.contentVersion,files:retainedFiles})).toBe(true);
  expect(await page.evaluate(async path=>(await(await fetch(path)).json()).chapters[5].expectedLevels,offlineManifestUrl)).toBe(6);
  await page.reload();await ready(page,56);await expect(page.locator('#progress')).toHaveText('1 / 12');expect((await saved(page)).attempts[55].found).toEqual(old.attempts[55].found);
  // A stale document that starts after the new worker claims it requests the
  // retired catalog filename. The worker reopens its saved route safely.
  for(const retired of ['content/v3/catalog-55.json','content/v3/catalog.json']){
   const reopened=page.waitForEvent('framenavigated',frame=>frame===page.mainFrame());
   await page.evaluate(path=>{void fetch(path).catch(()=>{});},retired);await reopened;await ready(page,56);await expect(page.locator('#progress')).toHaveText('1 / 12');
  }
  await context.setOffline(true);
  for(const id of retainedIds){await page.goto('/#scene/'+id);await ready(page,id);await expect(page.locator('#progress')).toHaveText(id===24?'4 / 15':'3 / 12');await expect.poll(()=>page.locator('#object-tray img').evaluateAll(imgs=>imgs.every(image=>(image as HTMLImageElement).complete&&(image as HTMLImageElement).naturalWidth>0))).toBe(true);}
 }finally{
  await context.setOffline(false).catch(()=>{});
  await Promise.all([documentPath,workerPath].map(path=>unlink(path).catch(error=>{if(error.code!=='ENOENT')throw error;})));
 }
});

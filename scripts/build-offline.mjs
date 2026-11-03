import {readFile,readdir,stat} from 'node:fs/promises';
import {writeArtifact as writeFile} from './artifact-io.mjs';
import {createHash} from 'node:crypto';
const hash=buffer=>createHash('sha256').update(buffer).digest('hex').slice(0,16);
async function walk(dir){const out=[];for(const f of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${f.name}`;if(f.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const catalog=JSON.parse(await readFile('dist/content/catalog.json','utf8'));
const contentPrefix='content/v3';
const manifestPath='offline-manifest-v3-55.json',entry='app-v3-55.html';
await writeFile('dist/'+entry,await readFile('dist/index.html'));
const files=await walk('dist');
const shell=files.sort().filter(p=>!p.startsWith('dist/art/')&&!p.startsWith('dist/content/levels/')&&!p.startsWith('dist/content/v3/levels/')&&!p.endsWith('/sw.js')&&!/\/offline-manifest[^/]*\.json$/.test(p)&&!['dist/index.html','dist/app-v3.html','dist/app-v3-54.html','dist/content/catalog.json','dist/content/v3/catalog.json','dist/content/v3/catalog-54.json'].includes(p)).map(p=>p.slice(5));
const chapters=[];
const allData=[];
const compatibleData=[],compatiblePaths=new Set();
for(const chapter of catalog.chapters){
 const paths=new Set();let readyLevels=0;
 for(const meta of catalog.levels.filter(l=>l.chapter===chapter.id&&l.status==='reviewed')){
  const path=`${contentPrefix}/levels/${String(meta.id).padStart(3,'0')}.json`;
  const level=JSON.parse(await readFile(`dist/${path}`,'utf8'));
  paths.add(path);paths.add(level.art);paths.add(level.thumbnail);
  for(const t of level.targets)paths.add(t.preview);
  // Recompute the preceding 54-scene build's content hash from these bytes.
  // A matching existing cache is safe to reuse only when every old asset is
  // unchanged, including definitions and previews.
  if(meta.id<=54)for(const file of [path,level.art,level.thumbnail,...level.targets.map(t=>t.preview)])compatiblePaths.add(file);
  readyLevels++;
 }
 const assets=[];
 for(const path of paths){const data=await readFile(`dist/${path}`),digest=hash(data);assets.push({url:path,bytes:data.length});allData.push(digest);if(compatiblePaths.has(path))compatibleData.push(digest);}
 chapters.push({id:chapter.id,files:assets,bytes:assets.reduce((n,f)=>n+f.bytes,0),readyLevels,expectedLevels:catalog.levels.filter(l=>l.chapter===chapter.id).length});
}
const version=hash(Buffer.concat(await Promise.all(shell.map(p=>readFile(`dist/${p}`)))));
const contentVersion=hash(allData.sort().join(''));
const compatibleContentVersion=hash(compatibleData.sort().join(''));
shell.push(manifestPath);
const manifest={catalogRevision:catalog.revision??1,version,contentVersion,compatibleContentVersion,shell,chapters};
await writeFile('dist/offline-manifest.json',JSON.stringify(manifest));
await writeFile('dist/'+manifestPath,JSON.stringify(manifest));
const worker=`// Generated from the production build. Scope-relative, works in a subdirectory.
const SHELL=${JSON.stringify(shell)};
const ENTRY=${JSON.stringify(entry)};
const SHELL_CACHE='little-discoveries-shell-${version}';
const CONTENT_CACHE='little-discoveries-content-${contentVersion}';
const COMPATIBLE_CACHE='little-discoveries-content-${compatibleContentVersion}';
const COMPATIBLE_ASSETS=new Set(${JSON.stringify([...compatiblePaths])});
const resolve=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(SHELL_CACHE);
 await cache.addAll(SHELL.map(resolve));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const names=await caches.keys();let retainCompatible=false;
 if(COMPATIBLE_CACHE!==CONTENT_CACHE&&names.includes(COMPATIBLE_CACHE))try{
  const old=await caches.open(COMPATIBLE_CACHE),current=await caches.open(CONTENT_CACHE);
  for(const request of await old.keys()){
   if(!COMPATIBLE_ASSETS.has(request.url.slice(self.registration.scope.length)))continue;
   if((await current.match(request))?.ok)continue;
   const response=await old.match(request);if(response?.ok)await current.put(request,response);
  }
 }catch{retainCompatible=true;} // Cache pressure must never block the update.
 for(const name of names)if((name.startsWith('little-discoveries-shell-')&&name!==SHELL_CACHE)||(name.startsWith('little-discoveries-content-')&&name!==CONTENT_CACHE&&!(retainCompatible&&name===COMPATIBLE_CACHE)))await caches.delete(name);
 await self.clients.claim();

})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 const relative=url.href.slice(self.registration.scope.length).split('?')[0];
 const artTag=relative.slice(4,7);
 const legacyArt=relative.startsWith('art/')&&artTag.length===3&&[...artTag].every(c=>c>='0'&&c<='9');
 // A still-starting older app requests its obsolete catalog; an original game
 // also requests unversioned assets. Reopen the saved route before serving
 // incompatible definitions. Existing v3 scene/art paths remain compatible.
 // This runs in an active fetch event, avoiding navigation/activation
 // lifecycle differences in browsers.
 if(request.mode!=='navigate'&&event.clientId&&(relative==='content/v3/catalog.json'||relative==='content/v3/catalog-54.json'||relative.startsWith('content/levels/')||relative.startsWith('content/v2/')||relative.startsWith('art/v2/')||legacyArt)){
  event.waitUntil((async()=>{const client=await self.clients.get(event.clientId);if(client&&client.url.startsWith(self.registration.scope))await client.navigate(client.url);})().catch(()=>{}));
  event.respondWith(Promise.resolve(new Response('The revised collection is opening. Your discoveries are saved.',{status:409})));
  return;
 }
 if(request.mode==='navigate'){
  event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok)return response;}catch{}return (await caches.open(SHELL_CACHE)).match(resolve(ENTRY))||new Response('Connect once to open Little Discoveries.',{status:503});})());return;
 }
 if(SHELL.includes(relative)){
  event.respondWith((async()=>{const cache=await caches.open(SHELL_CACHE);return (await cache.match(resolve(relative)))||fetch(request);})());return;
 }
 if(relative.startsWith('art/')||relative.startsWith('content/levels/')||relative.startsWith('content/v3/levels/')){
  event.respondWith((async()=>{
   const cache=await caches.open(CONTENT_CACHE),cached=await cache.match(request);if(cached)return cached;
   try{const response=await fetch(request);if(response.ok&&!response.headers.get('content-type')?.includes('text/html'))try{await cache.put(request,response.clone());}catch{}return response;}
   catch{return new Response('This picture is not downloaded yet. Reconnect and retry. Progress is saved separately.',{status:503,headers:{'Content-Type':'text/plain'}});}
  })());
 }
});
`;
await writeFile('dist/sw.js',worker);
const shellBytes=(await Promise.all(shell.map(async p=>(await stat(`dist/${p}`)).size))).reduce((a,b)=>a+b,0);
console.log(`Offline: shell ${(shellBytes/1e6).toFixed(2)} MB; ${chapters.filter(c=>c.readyLevels===c.expectedLevels).length}/${chapters.length} complete chapter packages; ${(chapters.reduce((n,c)=>n+c.bytes,0)/1e6).toFixed(2)} MB scene content.`);

import {readFile,access,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {writeArtifact} from './artifact-io.mjs';
const catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
const requiredPlacements=catalog.requiredPlacements??1304;
const errors=[],warnings=[];
const check=(valid,message)=>{if(!valid)errors.push(message);};
check(catalog.levels.length===100,'Exactly 100 catalog entries are required.');
check(catalog.levels.reduce((n,l)=>n+l.targetCount,0)===requiredPlacements,`Target counts must total ${requiredPlacements}.`);
check(catalog.chapters.length===10,'Exactly 10 chapters are required.');
let ready=0,placements=0,phone=0;
const artHashes=new Set();
function simplePolygon(points){
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const on=(a,b,p)=>Math.abs(cross(a,b,p))<1e-7&&p[0]>=Math.min(a[0],b[0])-1e-7&&p[0]<=Math.max(a[0],b[0])+1e-7&&p[1]>=Math.min(a[1],b[1])-1e-7&&p[1]<=Math.max(a[1],b[1])+1e-7;
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
  if(j===i+1||i===0&&j===points.length-1)continue;
  const a=points[i],b=points[(i+1)%points.length],c=points[j],d=points[(j+1)%points.length];
  const abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b);
  if(abC*abD<0&&cdA*cdB<0||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b))return false;
 }
 return true;
}
for(let i=0;i<100;i++){
 const meta=catalog.levels[i];if(!meta)continue;
 check(meta.id===i+1,`Numbering mismatch at ${i+1}`);
 check(meta.chapter===Math.floor(i/10)+1,`Chapter mismatch at ${i+1}`);
 if(catalog.revision===2)check(meta.targetCount<=15,`Scene ${meta.id}: fifteen-target maximum exceeded`);
 if(meta.status!=='reviewed'){warnings.push(`Scene ${meta.id}: illustration and placement production pending.`);continue;}
 try{
  const level=JSON.parse(await readFile(`public/content/levels/${String(meta.id).padStart(3,'0')}.json`,'utf8'));
  const dimensions=await sharp(`public/${level.art}`).metadata();
  const artHash=createHash('sha256').update(await readFile(`public/${level.art}`)).digest('hex');
  check(!artHashes.has(artHash),`Scene ${meta.id}: repeated scene illustration`);artHashes.add(artHash);
  check(level.id===meta.id&&level.chapter===meta.chapter&&level.title===meta.title,`Scene ${meta.id}: identity mismatch`);
  check(dimensions.width===level.width&&dimensions.height===level.height,`Scene ${meta.id}: geometry/art dimensions differ`);
  check(level.targetCount===meta.targetCount&&level.targets.length===meta.targetCount,`Scene ${meta.id}: target count mismatch`);
  check(new Set(level.targets.map(t=>t.id)).size===meta.targetCount,`Scene ${meta.id}: duplicate target IDs`);
  check(JSON.stringify(level.targets.map(t=>t.id))===JSON.stringify(meta.targetIds),`Scene ${meta.id}: catalog target IDs differ`);
  if(catalog.revision===2){
   const alias=await readFile(`public/content/v2/levels/${String(meta.id).padStart(3,'0')}.json`,'utf8');
   check(alias===await readFile(`public/content/levels/${String(meta.id).padStart(3,'0')}.json`,'utf8'),`Scene ${meta.id}: versioned data differs`);
   check([level.art,level.thumbnail,...level.targets.map(t=>t.preview)].every(path=>path.startsWith('art/v2/')),`Scene ${meta.id}: old-cache asset URL collision`);
  }
  if(catalog.revision===2&&meta.id>=51){
   check(level.review.contextOutlines===true,`Scene ${meta.id}: source/outline overlay review required`);
   const count=meta.id%10===0?10:15,hard=meta.id%10===0?3:11;
   check(level.targetCount===count,`Scene ${meta.id}: replacement scene requires ${count} targets`);
   check(meta.breakLevel===(meta.id%10===0),`Scene ${meta.id}: incorrect break schedule`);
   check(level.targets.filter(t=>t.difficulty==='challenging').length===hard,`Scene ${meta.id}: requires ${hard} challenging targets`);
   check(level.targets.filter(t=>t.difficulty==='easy').length===count-hard,`Scene ${meta.id}: incorrect easy target quota`);
   check(level.targets.every(t=>typeof t.concealment==='string'&&t.concealment.length>=20),`Scene ${meta.id}: missing visual concealment review`);
  }
  await access(`public/${level.thumbnail}`);
  const names=new Set();
  for(const target of level.targets){
   const tag=`Scene ${meta.id}, ${target.name}`;
   check(typeof target.name==='string'&&target.name.length>2&&!names.has(target.name),`${tag}: unclear/duplicate name`);names.add(target.name);
   for(const field of ['hit','outline'])check(Array.isArray(target[field])&&target[field].length>=3&&target[field].every(p=>p.length===2&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&p[0]>=0&&p[0]<=level.width&&p[1]>=0&&p[1]<=level.height),`${tag}: invalid ${field}`);
   check(simplePolygon(target.outline),`${tag}: self-intersecting outline`);
   for(const hole of target.holes??[])check(hole.length>=3&&simplePolygon(hole),`${tag}: invalid interior outline`);
   const h=target.hint;
   check(h.x>=0&&h.y>=0&&h.width>0&&h.height>0&&h.x+h.width<=level.width&&h.y+h.height<=level.height,`${tag}: invalid broad hint region`);
   check(target.outline.every(([x,y])=>x>=h.x&&x<=h.x+h.width&&y>=h.y&&y<=h.y+h.height),`${tag}: broad hint excludes part of target`);
   check(target.inspect.zoom>=1&&target.inspect.zoom<=8&&target.inspect.x>=0&&target.inspect.x<=1&&target.inspect.y>=0&&target.inspect.y<=1,`${tag}: invalid inspection view`);
   await access(`public/${target.preview}`);
   const preview=await sharp(`public/${target.preview}`).stats();check(preview.channels.some(c=>c.max>c.min),`${tag}: empty preview`);
  }
  check(level.review.artwork&&level.review.geometry,`Scene ${meta.id}: missing artwork/geometry review`);
  if(level.review.smallPhone)phone++;
  ready++;placements+=level.targets.length;
 }catch(e){errors.push(`Scene ${meta.id}: ${e.message}`);}
}
const report={catalogRevision:catalog.revision??1,catalogScenes:100,requiredPlacements,illustratedScenes:ready,authoredPlacements:placements,actualIPhoneReviewed:phone,errors,warnings};
console.log(JSON.stringify(report,null,2));
if(catalog.revision===2&&process.argv.includes('--complete')){await mkdir('.cache',{recursive:true});await writeArtifact('.cache/r2-content.json',JSON.stringify(report,null,2)+'\n');}
if(errors.length||process.argv.includes('--complete')&&(ready!==100||placements!==requiredPlacements))process.exitCode=1;

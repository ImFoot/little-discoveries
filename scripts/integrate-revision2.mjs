// Run only after all fifty replacement scenes have passed artwork review.
// Revision 1 remains available in Git history and docs/DESIGN-v1.md.
import {readFile,mkdir,copyFile,unlink} from 'node:fs/promises';
import {writeArtifact as writeFile} from './artifact-io.mjs';
import {execFileSync} from 'node:child_process';
const originalRef='ec11629';
const originalFile=path=>execFileSync('git',['show',`${originalRef}:${path}`],{maxBuffer:20_000_000});
const original=JSON.parse(originalFile('public/content/catalog.json'));
const partial=process.argv.includes('--partial'),ready=new Set();
const batches=await Promise.all(['51-67','68-84','85-100'].map(async range=>JSON.parse(await readFile(`artwork/revision2/batch-${range}.json`,'utf8'))));
const replacements=batches.flatMap(batch=>Array.isArray(batch)?batch:batch.levels);
if(replacements.length!==50||new Set(replacements.map(l=>l.id)).size!==50)throw Error('Fifty distinct replacement definitions required.');
for(let id=51;id<=100;id++){
 const tag=String(id).padStart(3,'0');let a;
 try{a=JSON.parse(await readFile(`artwork/revision2/annotations/${tag}.json`,'utf8'));}catch(error){if(partial&&error.code==='ENOENT')continue;throw error;}
 const count=id%10===0?10:15,hard=id%10===0?3:11;
 if(a.id!==id||a.targets.length!==count||a.targets.filter(t=>t.difficulty==='challenging').length!==hard||a.targets.filter(t=>t.difficulty==='easy').length!==count-hard||a.targets.some(t=>!t.concealment||t.outline.length<3)||!a.review.artwork||!a.review.geometry||!a.review.contextOutlines){if(partial)continue;throw Error(`${id}: unfinished targets or source/outline review.`);}
 await readFile(`artwork/revision2/source/${tag}.png`);
 const prompt=await readFile(`artwork/revision2/prompts/${tag}.txt`,'utf8');
 if(prompt.trim().length<100||prompt.trim()==='undefined'){if(partial)continue;throw Error(`${id}: missing final prompt`);}
 ready.add(id);
}
const catalog={revision:2,requiredPlacements:1391,chapters:original.chapters.slice(5).map(c=>({...c,id:c.id-5})),levels:[]};
for(const [i,title]of ['Collected curiosities','The makers’ secrets','Storied spaces','Gardens within gardens','Hidden wonders'].entries())catalog.chapters.push({id:i+6,title,subtitle:'Look closer. There is more here than first meets the eye.',color:['#9a8065','#8c8e70','#9b857e','#708973','#8d839a'][i]});
for(let id=1;id<=50;id++){
 const old=original.levels[id+49],tag=String(id).padStart(3,'0'),oldTag=String(old.id).padStart(3,'0');
 const annotation=JSON.parse(originalFile(`artwork/annotations/${oldTag}.json`));annotation.id=id;
 annotation.review.notes+=` Artwork retained from revision-1 scene ${old.id}; renumbered to ${id}.`;
 if(annotation.targets.length>15){
  const area=t=>Math.abs(t.outline.reduce((sum,p,i)=>{const q=t.outline[(i+1)%t.outline.length];return sum+p[0]*q[1]-q[0]*p[1];},0))/2;
  const retired=[...annotation.targets].sort((a,b)=>area(b)-area(a))[0];
  annotation.targets=annotation.targets.filter(t=>t.id!==retired.id);
  annotation.review.notes+=` Fifteen-target cap: ${retired.name}, the largest visible target by area, is now background detail.`;
 }
 await writeFile(`artwork/source/${tag}.png`,originalFile(`artwork/source/${oldTag}.png`));
 await writeFile(`artwork/annotations/${tag}.json`,JSON.stringify(annotation,null,2)+'\n');
 await writeFile(`artwork/prompts/${tag}.txt`,originalFile(`artwork/prompts/${oldTag}.txt`));
 catalog.levels.push({...old,id,chapter:old.chapter-5,targetCount:annotation.targets.length,targetIds:annotation.targets.map(t=>`l${oldTag}-${t.id}`),thumbnail:`art/v2/${tag}-thumb.webp`,sceneKey:`r1-${oldTag}`,targetPrefix:`l${oldTag}`});
}
for(const entry of replacements.sort((a,b)=>a.id-b.id)){
 const id=entry.id,tag=String(id).padStart(3,'0');
 if(ready.has(id))for(const [folder,extension]of [['source','png'],['annotations','json'],['prompts','txt']])await copyFile(`artwork/revision2/${folder}/${tag}.${extension}`,`artwork/${folder}/${tag}.${extension}`);
 else if(partial)try{await unlink(`artwork/annotations/${tag}.json`);}catch(error){if(error.code!=='ENOENT')throw error;}
 catalog.levels.push({id,chapter:Math.floor((id-1)/10)+1,title:entry.title,targetCount:id%10===0?10:15,sample:entry.sample??'Camouflaged details among layered materials.',thumbnail:`art/v2/${tag}-thumb.webp`,status:'draft',targetIds:[],sceneKey:`r2-${tag}`,targetPrefix:`r2-${tag}`,breakLevel:id%10===0,challengingCount:id%10===0?3:11});
}
await writeFile('public/content/catalog.json',JSON.stringify(catalog,null,2)+'\n');
await mkdir('.cache/revision2',{recursive:true});
await writeFile('.cache/revision2/integrated.json',JSON.stringify({date:new Date().toISOString(),retained:50,new:ready.size,pending:50-ready.size,totalPlacements:1391,partial},null,2));
console.log(`Integrated fifty retained and ${ready.size} new scenes; ${50-ready.size} unfinished. Run content:prepare, prune-art, strict validation and tests before publishing.`);

// Review artifacts only; these sheets are never counted as game scenes.
import sharp from 'sharp';
import {readFile,mkdir} from 'node:fs/promises';
import {writeArtifact as writeFile} from './artifact-io.mjs';
const catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
await mkdir('artwork/review',{recursive:true});
const escape=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
for(const chapter of catalog.chapters){
 const levels=catalog.levels.filter(l=>l.chapter===chapter.id&&l.status==='reviewed');
 const composite=[];
 for(let i=0;i<levels.length;i++){
  const l=levels[i],left=(i%5)*220,top=Math.floor(i/5)*368;
  const thumb=await sharp(`public/${l.thumbnail}`).resize(220,330,{fit:'cover'}).toBuffer();
  composite.push({input:thumb,left,top});
  const label=Buffer.from(`<svg width="220" height="38"><rect width="220" height="38" fill="#f6f3ec"/><text x="10" y="16" font-family="Georgia" font-size="12" fill="#394536">${l.id}. ${escape(l.title)}</text><text x="10" y="30" font-family="sans-serif" font-size="10" fill="#79846d">${l.targetCount} targets · screen review</text></svg>`);
  composite.push({input:label,left,top:top+330});
 }
 await writeFile(`artwork/review/chapter-${String(chapter.id).padStart(2,'0')}.jpg`,await sharp({create:{width:1100,height:736,channels:3,background:'#f6f3ec'}}).composite(composite).jpeg({quality:91}).toBuffer());
}
await writeFile('artwork/review/README.md','# Scene contact sheets\n\nThese are visual production-review sheets, not additional levels. Every scene and target was individually inspected before annotation; this sheet makes composition differences easy to compare. Actual iPhone review remains separate and pending.\n');
console.log('Wrote ten chapter contact sheets to artwork/review.');

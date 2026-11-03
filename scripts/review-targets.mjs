// Diagnostic contact sheets: source-pixel context with the authored reveal
// contour overlaid, never used as game artwork or counted as extra scenes.
import sharp from 'sharp';
import {readFile,mkdir} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
const archive=process.argv.includes('--archive');
const ids=process.argv.slice(2).filter(arg=>arg!=='--archive').map(Number);if(!ids.length||ids.some(id=>!Number.isInteger(id)||id<51||id>100))throw Error('Pass revised scene numbers 51–100 to review.');
await mkdir('.cache/target-review',{recursive:true});
if(archive)await mkdir('artwork/revision2/review',{recursive:true});
for(const id of ids){
 const tag=String(id).padStart(3,'0'),annotation=JSON.parse(await readFile(`artwork/revision2/annotations/${tag}.json`,'utf8'));
 const source=`artwork/revision2/source/${tag}.png`,{width,height}=await sharp(source).metadata(),tiles=[];
 for(const [index,t]of annotation.targets.entries()){
  const xs=t.outline.map(p=>p[0]),ys=t.outline.map(p=>p[1]);
  const left=Math.max(0,Math.floor(Math.min(...xs))-18),top=Math.max(0,Math.floor(Math.min(...ys))-18);
  const w=Math.min(width-left,Math.ceil(Math.max(...xs))-left+18),h=Math.min(height-top,Math.ceil(Math.max(...ys))-top+18);
  const paths=[t.outline,...t.holes??[]].map(p=>`M${p.map(([x,y])=>`${x-left},${y-top}`).join('L')}Z`).join('');
  const overlay=Buffer.from(`<svg width="${w}" height="${h}"><path d="${paths}" fill="none" stroke="#ff287e" stroke-width="1.4" stroke-linejoin="round"/></svg>`);
  const tile=await sharp(source).extract({left,top,width:w,height:h}).composite([{input:overlay}]).png().toBuffer();
  const x=index%5*240,y=Math.floor(index/5)*240;
  tiles.push({input:await sharp(tile).resize(240,210,{fit:'contain',background:'#eee9dd'}).png().toBuffer(),left:x,top:y});
  const label=t.name.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  tiles.push({input:Buffer.from(`<svg width="240" height="30"><rect width="240" height="30" fill="white"/><text x="5" y="13" font-size="11" font-family="Arial">${index+1}. ${label}</text><text x="5" y="26" font-size="10" font-family="Arial">${t.difficulty}</text></svg>`),left:x,top:y+210});
 }
 const sheet=await sharp({create:{width:1200,height:Math.ceil(annotation.targets.length/5)*240,channels:3,background:'#eee9dd'}}).composite(tiles).png().toBuffer();
 await writeArtifact(`.cache/target-review/${tag}.png`,sheet);
 if(archive){
  if(!annotation.review.contextOutlines)throw Error(`${id}: finish source/outline review before archiving its evidence.`);
  await writeArtifact(`artwork/revision2/review/${tag}.jpg`,await sharp(sheet).jpeg({quality:92}).toBuffer());
 }
 console.log(`Reviewed context sheet: .cache/target-review/${tag}.png`);
}
if(archive)await writeArtifact('artwork/revision2/review/README.md','# Target context review\n\nThese diagnostic sheets show every new target with its final reveal contour over source pixels. Each annotation records the completed source/context visual review; the sheets preserve that geometry for future inspection. They are not additional scenes or game artwork. Canonical source annotations remain authoritative. Physical iPhone/player acceptance is separate and pending. Regenerate with `node scripts/review-targets.mjs --archive 51 52 … 100` after any geometry change.\n');

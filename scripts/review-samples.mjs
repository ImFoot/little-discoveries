// Diagnostic only: unchanged source crop beside the exact reveal contour.
// Neither this sheet nor its labels are used as game artwork.
import sharp from 'sharp';
import {readFile,mkdir} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
await mkdir('artwork/samples-v3/review',{recursive:true});
for(const tag of ['051','052','053']){
 const source=`artwork/source/${tag}.png`,level=JSON.parse(await readFile(`public/content/levels/${tag}.json`,'utf8')),tiles=[];
 for(const [index,t]of level.targets.entries()){
  const c=t.crop,base=await sharp(source).extract({left:c.x,top:c.y,width:c.width,height:c.height}).png().toBuffer();
  const path=[t.outline,...t.holes??[]].map(poly=>`M${poly.map(([x,y])=>`${x-c.x},${y-c.y}`).join('L')}Z`).join('');
  const outlined=await sharp(base).composite([{input:Buffer.from(`<svg width="${c.width}" height="${c.height}"><path d="${path}" fill="none" stroke="#f02377" stroke-width="1.1"/></svg>`)}]).png().toBuffer();
  const x=index%3*400,y=Math.floor(index/3)*252;
  for(const [n,image]of [await readFile(`public/${t.preview}`),outlined].entries())tiles.push({input:await sharp(image).resize(198,220,{fit:'contain',background:'#f4f0e5'}).png().toBuffer(),left:x+n*200,top:y});
  const title=t.name.replaceAll('&','&amp;').replaceAll('<','&lt;');
  tiles.push({input:Buffer.from(`<svg width="400" height="32"><rect width="400" height="32" fill="#fffdf7"/><text x="7" y="21" font-size="14" font-family="Arial">${index+1}. ${title} — preview / outline</text></svg>`),left:x,top:y+220});
 }
 const result=await sharp({create:{width:1200,height:Math.ceil(level.targets.length/3)*252,channels:3,background:'#f4f0e5'}}).composite(tiles).png().toBuffer();
 await writeArtifact(`artwork/samples-v3/review/${tag}.png`,result);console.log(`Review ${tag}: all ${level.targets.length} previews and contours.`);
}

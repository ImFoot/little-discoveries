import sharp from 'sharp';
import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const catalog = JSON.parse(await readFile('public/content/catalog.json','utf8'));
const files = (await readdir('artwork/annotations')).filter(f=>f.endsWith('.json')).sort();
const pipeline=await readFile(new URL(import.meta.url));
await mkdir('.cache',{recursive:true});
let stamps={};try{stamps=JSON.parse(await readFile('.cache/content-prepared.json','utf8'));}catch{}
let changed=0;
for (const file of files) {
  const annotation = JSON.parse(await readFile(`artwork/annotations/${file}`,'utf8'));
  const meta = catalog.levels.find(l=>l.id===annotation.id);
  const tag = String(meta.id).padStart(3,'0');
  const source = `artwork/source/${tag}.png`;
  const signature=createHash('sha256').update(pipeline).update(JSON.stringify(annotation)).update(await readFile(source)).digest('hex');
  if(stamps[tag]===signature){
    try{
      const level=JSON.parse(await readFile(`public/content/levels/${tag}.json`,'utf8'));
      await Promise.all([level.art,level.thumbnail,...level.targets.map(t=>t.preview)].map(path=>access(`public/${path}`)));
      meta.status=level.status;meta.targetIds=level.targets.map(t=>t.id);continue;
    }catch{/* Rebuild missing outputs. */}
  }
  const { width, height } = await sharp(source).metadata();
  const targets = [];
  await mkdir(`public/art/${tag}`, {recursive:true});
  await sharp(source).webp({quality:87,effort:5}).toFile(`public/art/${tag}.webp`);
  await sharp(source).resize(320,480,{fit:'inside'}).webp({quality:78}).toFile(`public/art/${tag}-thumb.webp`);
  for (const item of annotation.targets) {
    const outline = item.outline;
    const xs = outline.map(p=>p[0]), ys = outline.map(p=>p[1]);
    const minX = Math.floor(Math.min(...xs)), minY = Math.floor(Math.min(...ys)), maxX = Math.ceil(Math.max(...xs)), maxY = Math.ceil(Math.max(...ys));
    const pad=10;
    const crop={ x:Math.max(0,minX-pad), y:Math.max(0,minY-pad), width:0,height:0 };
    crop.width=Math.min(width-crop.x, maxX-minX+pad*2);
    crop.height=Math.min(height-crop.y, maxY-minY+pad*2);
    const id=`l${tag}-${item.id}`;
    const preview=`art/${tag}/${item.id}.webp`;
    const contour=poly=>`M${poly.map(([x,y])=>`${x-crop.x},${y-crop.y}`).join('L')}Z`;
    const path=[outline,...item.holes??[]].map(contour).join('');
    const mask=Buffer.from(`<svg width="${crop.width}" height="${crop.height}"><path d="${path}" fill="white" fill-rule="evenodd"/></svg>`);
    const masked=await sharp(source).extract({left:crop.x,top:crop.y,width:crop.width,height:crop.height}).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
    await sharp(masked).resize(280,280,{fit:'inside'}).webp({quality:92}).toFile(`public/${preview}`);
    const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
    const hintWidth=Math.min(width,Math.ceil(Math.max(370,(maxX-minX)*1.4+100)));
    const hintHeight=Math.min(height,Math.ceil(Math.max(350,(maxY-minY)*1.4+100)));
    const hint={x:Math.max(0,Math.min(width-hintWidth,Math.floor(cx-hintWidth/2))),y:Math.max(0,Math.min(height-hintHeight,Math.floor(cy-hintHeight/2))),width:hintWidth,height:hintHeight};
    const inspectionZoom=Math.min(6,Math.max(1.25,110/(Math.max(maxX-minX,maxY-minY)*Math.min(375/width,380/height))));
    targets.push({id,name:item.name,preview,outline,...item.holes?.length?{holes:item.holes}:{},hit:item.hit??outline,crop,hint:item.hint??hint,inspect:{x:cx/width,y:cy/height,zoom:item.zoom??inspectionZoom},notes:item.notes??''});
  }
  const review=annotation.review??{artwork:true,geometry:true,smallPhone:false,notes:'Screen review only; actual iPhone review pending.'};
  const level={id:meta.id,chapter:meta.chapter,title:meta.title,targetCount:meta.targetCount,art:`art/${tag}.webp`,thumbnail:meta.thumbnail,width,height,status:review.artwork&&review.geometry?'reviewed':'draft',targets,review};
  if(targets.length!==meta.targetCount) throw Error(`${tag}: ${targets.length} instead of ${meta.targetCount}`);
  await writeFile(`public/content/levels/${tag}.json`,JSON.stringify(level,null,2)+'\n');
  meta.status=level.status;meta.targetIds=targets.map(t=>t.id);
  stamps[tag]=signature;changed++;
}
await writeFile('public/content/catalog.json',JSON.stringify(catalog,null,2)+'\n');
await writeFile('.cache/content-prepared.json',JSON.stringify(stamps,null,2));
console.log(`Prepared ${files.length} scenes (${changed} changed). No real-iPhone review claimed.`);

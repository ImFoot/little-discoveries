// Enlarged source crops with the affine mapping needed for precise tracing.
// Diagnostic files only: never used as game artwork or counted as scenes.
import sharp from 'sharp';
import {readFile,mkdir} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
const id=Number(process.argv[2]),slugs=process.argv.slice(3);
if(!Number.isInteger(id)||id<51||id>100)throw Error('Pass a revised scene number and optional target slugs.');
const tag=String(id).padStart(3,'0'),source=`artwork/revision2/source/${tag}.png`;
const annotation=JSON.parse(await readFile(`artwork/revision2/annotations/${tag}.json`,'utf8'));
const dimensions=await sharp(source).metadata(),size=640,padding=35;
await mkdir('.cache/target-roi',{recursive:true});
for(const target of annotation.targets.filter(t=>!slugs.length||slugs.includes(t.id))){
 const xs=target.outline.map(p=>p[0]),ys=target.outline.map(p=>p[1]);
 const left=Math.max(0,Math.floor(Math.min(...xs))-padding),top=Math.max(0,Math.floor(Math.min(...ys))-padding);
 const width=Math.min(dimensions.width-left,Math.ceil(Math.max(...xs))-left+padding),height=Math.min(dimensions.height-top,Math.ceil(Math.max(...ys))-top+padding);
 const scale=Math.min(size/width,size/height),offsetX=(size-width*scale)/2,offsetY=(size-height*scale)/2;
 const base=`.cache/target-roi/${tag}-${target.id}`;
 await writeArtifact(base+'.png',await sharp(source).extract({left,top,width,height}).resize(size,size,{fit:'contain',background:'#eee9dd'}).png().toBuffer());
 await writeArtifact(base+'.json',JSON.stringify({left,top,width,height,scale,offsetX,offsetY},null,2)+'\n');
 console.log(base);
}

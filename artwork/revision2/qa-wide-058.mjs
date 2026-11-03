import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
const id=58,a=JSON.parse(await readFile('artwork/revision2/annotations/058.json','utf8'));
const tiles=[];
for(let i=0;i<a.targets.length;i++){
 const t=a.targets[i],xs=t.outline.map(p=>p[0]),ys=t.outline.map(p=>p[1]);
 const l=Math.max(0,Math.min(...xs)-45),top=Math.max(0,Math.min(...ys)-45),w=Math.min(1024-l,Math.max(...xs)-l+45),h=Math.min(1536-top,Math.max(...ys)-top+45);const left=Math.floor(l),y0=Math.floor(top),width=Math.ceil(w),height=Math.ceil(h);const paths=t.outline.map(([x,y])=>`${x-left},${y-y0}`).join('L');const svg=Buffer.from(`<svg width="${width}" height="${height}"><path d="M${paths}Z" fill="none" stroke="#ff287e" stroke-width="1.3"/></svg>`);
 const b=await sharp('artwork/revision2/source/058.png').extract({left,top:y0,width,height}).composite([{input:svg}]).png().toBuffer();
 const idx=i,x=idx%5*300,y=Math.floor(idx/5)*300;tiles.push({input:await sharp(b).resize(300,270,{fit:'contain',background:'#eee9dd'}).png().toBuffer(),left:x,top:y});tiles.push({input:Buffer.from(`<svg width="300" height="30"><rect width="300" height="30" fill="white"/><text x="4" y="15" font-size="12">${i+1} ${t.id} L${left} T${y0} W${width} H${height}</text></svg>`),left:x,top:y+270});
}
await sharp({create:{width:1500,height:900,channels:3,background:'#eee9dd'}}).composite(tiles).png().toFile('artwork/revision2/source/058-qa-wide.png');

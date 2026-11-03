import {readFile,readdir,unlink} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
const root=resolve('public/art'),keep=new Set();
const catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
if(catalog.levels.length!==catalog.requiredScenes||catalog.levels.some(l=>l.status!=='reviewed'))throw Error('Prune only a complete reviewed collection.');
for(const {id} of catalog.levels){
 const level=JSON.parse(await readFile(`public/content/levels/${String(id).padStart(3,'0')}.json`,'utf8'));
 for(const path of [level.art,level.thumbnail,...level.targets.map(t=>t.preview)])keep.add(resolve('public',path));
}
let removed=0;
async function prune(directory){
 for(const file of await readdir(directory,{withFileTypes:true})){
  const path=resolve(directory,file.name);
  if(!path.startsWith(root+sep))throw Error('Preview path escaped artwork directory.');
  if(file.isDirectory())await prune(path);
  else if(file.isFile()&&file.name.endsWith('.webp')&&!keep.has(path)){await unlink(path);removed++;}
 }
}
await prune(root);
console.log(`Removed ${removed} retired artwork files; all ${keep.size} active artwork files retained.`);

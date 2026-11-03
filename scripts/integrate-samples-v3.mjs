// User rejected the fifty revision-2 replacements. Only three trial scenes
// replace them; the original fifty retained pictures keep their stable IDs.
import {readFile,copyFile,readdir,unlink,mkdir} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {writeArtifact} from './artifact-io.mjs';
const previous=JSON.parse(await readFile('src/data/legacy-catalog-v2.json','utf8'));
const catalog={revision:3,requiredScenes:53,requiredPlacements:702,
 chapters:[...previous.chapters.slice(0,5),{id:6,title:'Three samples to try',subtitle:'Familiar little things, tucked a little further away.',color:'#819475'}],
 levels:previous.levels.slice(0,50).map(l=>({...l,thumbnail:l.thumbnail.replace('art/v2/','art/v3/')}))};
for(const id of [51,52,53]){
 const tag=String(id).padStart(3,'0'),a=JSON.parse(await readFile(`artwork/samples-v3/annotations/${tag}.json`,'utf8'));
 if(a.id!==id||a.targets.length!==12||a.previewMode!=='context'||!a.review?.artwork||!a.review?.geometry||!a.review?.contextOutlines)throw Error(`${id}: complete 12-target sample review first`);
 for(const [dir,ext]of [['source','png'],['annotations','json'],['prompts','txt']])await copyFile(`artwork/samples-v3/${dir}/${tag}.${ext}`,`artwork/${dir}/${tag}.${ext}`);
 catalog.levels.push({id,chapter:6,title:a.title,targetCount:12,sample:'A modest step beyond The floating garden; clear objects and gentle overlap.',thumbnail:`art/v3/${tag}-thumb.webp`,status:'draft',targetIds:[],sceneKey:`sample3-${tag}`,targetPrefix:`sample3-${tag}`,sampleLevel:true});
}
await mkdir('public/content/v3/levels',{recursive:true});
// Remove rejected runtime packages and inactive canonical artwork. Individual
// file removal is restricted to checked workspace subdirectories.
for(const [dir,ext]of [['artwork/source','png'],['artwork/annotations','json'],['artwork/prompts','txt'],['public/content/levels','json']]){
 const base=resolve(dir);
 for(const file of await readdir(base))if(new RegExp(`^0?(?:5[4-9]|[6-9][0-9]|100)\\.${ext}$`).test(file)){
  const path=resolve(base,file);if(!path.startsWith(base+sep))throw Error('Path escaped approved directory');await unlink(path);
 }
}
await writeArtifact('public/content/catalog.json',JSON.stringify(catalog,null,2)+'\n');
console.log('Integrated 50 retained scenes + 3 samples: 702 targets. Run prepare, prune and strict validation.');

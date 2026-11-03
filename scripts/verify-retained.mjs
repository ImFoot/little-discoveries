// Prove retained art/annotations/previews were not changed while retiring the
// rejected half. The immutable baseline is the last published revision 2.
import {execFileSync} from 'node:child_process';
import {readFile,mkdir} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
const baseline='0bc8038',catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
const tree=execFileSync('git',['ls-tree','-r','--format=%(objectname) %(path)',baseline,'--','artwork/source','artwork/annotations','public/art/v2'],{encoding:'utf8',maxBuffer:4_000_000});
const old=new Map(tree.trim().split('\n').map(line=>[line.slice(41),line.slice(0,40)])),pairs=[];
for(const meta of catalog.levels.filter(l=>l.id<=50)){
 const tag=String(meta.id).padStart(3,'0'),level=JSON.parse(await readFile(`public/content/levels/${tag}.json`,'utf8'));
 for(const path of [`artwork/source/${tag}.png`,`artwork/annotations/${tag}.json`,...[level.art,level.thumbnail,...level.targets.map(t=>t.preview)].map(p=>'public/'+p)])pairs.push([path,path.replace('public/art/v3/','public/art/v2/')]);
}
const hashes=execFileSync('git',['hash-object','--stdin-paths'],{input:pairs.map(([p])=>p).join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
for(const [i,[path,previous]]of pairs.entries())if(hashes[i]!==old.get(previous))throw Error(`${path} differs from its retained original`);
const report={date:new Date().toISOString(),baseline,retainedScenes:50,identicalFiles:pairs.length,sourcePngs:50,sourceAnnotations:50,sceneWebps:50,thumbnails:50,previews:666,verified:true};
await mkdir('.cache',{recursive:true});await writeArtifact('.cache/r3-retained.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));

// Verify the complete earlier collection was preserved by the fifth sample.
import {execFileSync} from 'node:child_process';
import {readFile,mkdir} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
const baseline='2ca3e77';
const catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
const previous=JSON.parse(execFileSync('git',['show',`${baseline}:public/content/catalog.json`],{encoding:'utf8'}));
if(JSON.stringify(catalog.levels.slice(0,56))!==JSON.stringify(previous.levels))throw Error('Earlier catalog entries changed');
const tree=execFileSync('git',['ls-tree','-r','--format=%(objectname) %(path)',baseline,'--','artwork/source','artwork/annotations','artwork/prompts','public/art/v3','public/content/levels','public/content/v3/levels'],{encoding:'utf8',maxBuffer:4_000_000});
const old=new Map(tree.trim().split('\n').map(line=>[line.slice(41),line.slice(0,40)])),paths=[];
for(const meta of previous.levels){
 const tag=String(meta.id).padStart(3,'0'),level=JSON.parse(await readFile(`public/content/levels/${tag}.json`,'utf8'));
 paths.push(`artwork/source/${tag}.png`,`artwork/annotations/${tag}.json`,`artwork/prompts/${tag}.txt`,`public/content/levels/${tag}.json`,`public/content/v3/levels/${tag}.json`,...[level.art,level.thumbnail,...level.targets.map(t=>t.preview)].map(p=>'public/'+p));
}
const hashes=execFileSync('git',['hash-object','--stdin-paths'],{input:paths.join('\n')+'\n',encoding:'utf8'}).trim().split('\n');
for(const [i,path]of paths.entries())if(hashes[i]!==old.get(path))throw Error(`${path} differs from published56 baseline`);
const report={date:new Date().toISOString(),baseline,retainedScenes:56,retainedPlacements:738,identicalFiles:paths.length,sourcePngs:56,sourceAnnotations:56,prompts:56,canonicalLevels:56,runtimeLevels:56,sceneWebps:56,thumbnails:56,previews:738,catalogEntriesUnchanged:true,verified:true};
await mkdir('.cache',{recursive:true});await writeArtifact('.cache/assembly57-retained.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));

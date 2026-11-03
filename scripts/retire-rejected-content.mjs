// Remove only version-controlled files in the two explicitly retired packages.
// No recursive directory removal; resolve and verify every individual path.
import {execFileSync} from 'node:child_process';
import {unlink} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
const workspace=resolve('.'),roots=['artwork/revision2/','public/content/v2/'];
const files=execFileSync('git',['ls-files','-z','--',...roots],{encoding:'utf8'}).split('\0').filter(Boolean);
for(const file of files){
 if(!roots.some(root=>file.startsWith(root)))throw Error('Unexpected retired file');
 const absolute=resolve(workspace,file);
 if(!absolute.startsWith(workspace+sep))throw Error('File escaped workspace');
 try{await unlink(absolute);}catch(error){if(error.code!=='ENOENT')throw error;}
}
console.log(`Removed ${files.length} tracked rejected authoring/old-runtime files individually. Git history is preserved.`);

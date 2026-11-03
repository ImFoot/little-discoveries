import {writeFile,rename,unlink} from 'node:fs/promises';
let sequence=0;
// Atomic replacement also keeps preview readers from seeing half-written JSON.
// Windows file watchers can briefly hold a replaced file, so retry that case.
export async function writeArtifact(path,data){
 const temporary=`${path}.tmp-${process.pid}-${sequence++}`;
 await writeFile(temporary,data);
 try{
  for(let attempt=0;;attempt++)try{await rename(temporary,path);return;}catch(error){
   if(attempt===7||!['UNKNOWN','EBUSY','EPERM','EACCES'].includes(error.code))throw error;
   await new Promise(resolve=>setTimeout(resolve,100*(attempt+1)));
  }
 }finally{try{await unlink(temporary);}catch(error){if(error.code!=='ENOENT')throw error;}}
}

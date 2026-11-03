import type { Attempt, CatalogEntry, Save } from './types';
import legacyCatalog from './data/legacy-catalog-v1.json' with {type:'json'};
import previousCatalog from './data/legacy-catalog-v2.json' with {type:'json'};
export const SAVE_KEY='little-discoveries.save.v3';
const KEY=SAVE_KEY,RECOVERY=KEY+'.recovery',PREVIOUS='little-discoveries.save.v2',LEGACY='little-discoveries.save.v1';
export const defaultView=()=>({x:.5,y:.5,zoom:1});
export const newAttempt=(replay=false):Attempt=>({found:[],view:defaultView(),started:true,updated:Date.now(),replay,completed:false});
export const freshSave=():Save=>({version:3,updated:Date.now(),current:1,completed:[],favorites:[],attempts:{},preferences:{sound:false,reduceMotion:false,largePreviews:false,largeText:false,markers:true},catalogScroll:0,onboarded:false});
const object=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const integer=(v:unknown,lo:number,hi:number):v is number=>Number.isInteger(v)&&Number(v)>=lo&&Number(v)<=hi;
const finite=(v:unknown,lo:number,hi:number):v is number=>typeof v==='number'&&Number.isFinite(v)&&v>=lo&&v<=hi;
const uniqueIds=(v:unknown):v is number[]=>Array.isArray(v)&&v.every(n=>integer(n,1,100))&&new Set(v).size===v.length;
type SaveCatalog=Pick<CatalogEntry,'id'|'targetCount'|'targetIds'>[];
function validateVersion(input:unknown, catalog:SaveCatalog,version:number):Save {
  if(!object(input)||input.version!==version||!integer(input.current,1,100)||!uniqueIds(input.completed)||!uniqueIds(input.favorites)||!object(input.attempts)||!object(input.preferences)||typeof input.onboarded!=='boolean'||!finite(input.updated,0,1e15)||!finite(input.catalogScroll,0,1e8)) throw Error('This file is not a valid Little Discoveries save. Your progress has not changed.');
  const prefs=input.preferences;
  const ids=new Set(catalog.map(l=>l.id));
  if(!ids.has(input.current)||[...input.completed,...input.favorites].some(id=>!ids.has(id)))throw Error('The backup contains unknown scenes. Your progress has not changed.');
  for(const key of ['sound','reduceMotion','largePreviews','largeText','markers']) if(typeof prefs[key]!=='boolean') throw Error('The backup has invalid settings. Your progress has not changed.');
  for(const [key,value] of Object.entries(input.attempts)){
    const level=catalog.find(l=>String(l.id)===key);
    if(!level||!object(value)||!Array.isArray(value.found)||!value.found.every(id=>typeof id==='string'&&level.targetIds.includes(id))||new Set(value.found).size!==value.found.length||typeof value.started!=='boolean'||typeof value.replay!=='boolean'||typeof value.completed!=='boolean'||!finite(value.updated,0,1e15)||!object(value.view)||!finite(value.view.x,0,1)||!finite(value.view.y,0,1)||!finite(value.view.zoom,1,8)) throw Error('The backup has invalid scene progress. Your progress has not changed.');
    if(value.completed!== (value.found.length===level.targetCount)) throw Error('The backup has inconsistent completion data. Your progress has not changed.');
    if(value.completed&&!input.completed.includes(level.id)) throw Error('The backup is missing a completion record. Your progress has not changed.');
  }
  return structuredClone(input) as Save;
}
export function validateSave(input:unknown,catalog:SaveCatalog):Save {
  if(object(input)&&input.version===1){
    const old=validateVersion(input,legacyCatalog,1);
    const save={...old,version:3,current:old.current>50?old.current-50:1,
      completed:old.completed.filter(id=>id>50).map(id=>id-50),
      favorites:old.favorites.filter(id=>id>50).map(id=>id-50),
      attempts:Object.fromEntries(Object.entries(old.attempts).filter(([id])=>+id>50).map(([id,attempt])=>{
        const meta=catalog.find(level=>level.id===+id-50);
        if(!meta)throw Error('The retained scene could not be matched. Your progress has not changed.');
        const found=attempt.found.filter(targetId=>meta.targetIds.includes(targetId));
        return[meta.id,{...attempt,found,completed:found.length===meta.targetCount}];
      })),catalogScroll:0} as Save;
    for(const [id,attempt]of Object.entries(save.attempts))if(attempt.completed&&!save.completed.includes(+id))save.completed.push(+id);
    if(old.current<=50)save.current=continueLevel(save,catalog);
    return validateVersion(save,catalog,3);
  }
  if(object(input)&&input.version===2){
    // Validate the complete rejected collection before filtering. Reused scene
    // numbers never transfer credit to the new, unrelated sample pictures.
    const old=validateVersion(input,previousCatalog.levels,2);
    const save={...old,version:3,current:old.current<=50?old.current:1,
      completed:old.completed.filter(id=>id<=50),favorites:old.favorites.filter(id=>id<=50),
      attempts:Object.fromEntries(Object.entries(old.attempts).filter(([id])=>+id<=50)),catalogScroll:0} as Save;
    if(old.current>50)save.current=continueLevel(save,catalog);
    return validateVersion(save,catalog,3);
  }
  return validateVersion(input,catalog,3);
}
export function loadSave(catalog:CatalogEntry[]):{save:Save;recovered:boolean;warning:string;migrated:boolean} {
  let recovered=false, warning='';
  try {
    for(const key of [KEY,RECOVERY,PREVIOUS,PREVIOUS+'.recovery',LEGACY,LEGACY+'.recovery']){
      const raw=localStorage.getItem(key);
      if(!raw) continue;
      try {
        const input:unknown=JSON.parse(raw),save=validateSave(input,catalog),migrated=object(input)&&input.version===1,updated=object(input)&&input.version!==3;
        if(updated){
          // Keep the original save before remapping its scene numbers. Retired
          // scenes never become progress on unrelated replacement pictures.
          const archive=(migrated?LEGACY:PREVIOUS)+(migrated?'.before-revision2':'.before-samples3');
          try{if(!localStorage.getItem(archive))localStorage.setItem(archive,raw);}catch{}
        }
        if(updated||key!==KEY)persist(save);
        return {save,recovered,warning:updated?'Your discoveries in the retained pictures are safe. Three new samples are ready to try.':warning,migrated};
      }
      catch {recovered=true;warning='Your last save could not be read. A recovery copy was used when available.';}
    }
  } catch {warning='This browser could not open device storage. You can still play and back up progress in Settings.';}
  return {save:freshSave(),recovered,warning,migrated:false};
}
export function persist(save:Save):boolean {
  save.updated=Date.now();
  const json=JSON.stringify(save);
  try {
    localStorage.setItem(KEY,json);
    localStorage.setItem(RECOVERY,json);
    return true;
  } catch { return false; }
}
export function collect(save:Save,level:CatalogEntry,targetId:string):boolean {
  if(!level.targetIds.includes(targetId)) return false;
  const attempt=save.attempts[level.id]??(save.attempts[level.id]=newAttempt(save.completed.includes(level.id)));
  if(attempt.found.includes(targetId)) return false;
  attempt.found.push(targetId);attempt.updated=Date.now();
  if(attempt.found.length===level.targetCount){attempt.completed=true;if(!save.completed.includes(level.id)) save.completed.push(level.id);}
  return true;
}
export function continueLevel(save:Save,catalog:SaveCatalog):number {
  const current=save.attempts[save.current];
  if(current?.started&&!current.completed) return save.current;
  const unfinished=Object.entries(save.attempts).filter(([,a])=>a.started&&!a.completed).sort((a,b)=>b[1].updated-a[1].updated);
  return unfinished.length?+unfinished[0][0]:(catalog.find(l=>!save.completed.includes(l.id))?.id??catalog.at(-1)?.id??1);
}
export function exportBackup(save:Save):string {return JSON.stringify({format:'little-discoveries',schemaVersion:3,savedAt:new Date().toISOString(),save},null,2);}
export function importBackup(text:string,catalog:CatalogEntry[]):Save {
  if(text.length>2_000_000) throw Error('That file is too large to be a progress backup. Your progress has not changed.');
  let parsed:unknown;
  try {parsed=JSON.parse(text);} catch {throw Error('That file could not be read. Choose a Little Discoveries backup. Your progress has not changed.');}
  if(!object(parsed)||parsed.format!=='little-discoveries'||![1,2,3].includes(Number(parsed.schemaVersion))||!object(parsed.save)||parsed.save.version!==parsed.schemaVersion) throw Error('Choose a Little Discoveries progress backup. Your progress has not changed.');
  return validateSave(parsed.save,catalog);
}

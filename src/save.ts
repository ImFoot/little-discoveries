import type { Attempt, CatalogEntry, Save } from './types';
const KEY='little-discoveries.save.v1', RECOVERY=KEY+'.recovery';
export const defaultView=()=>({x:.5,y:.5,zoom:1});
export const newAttempt=(replay=false):Attempt=>({found:[],view:defaultView(),started:true,updated:Date.now(),replay,completed:false});
export const freshSave=():Save=>({version:1,updated:Date.now(),current:1,completed:[],favorites:[],attempts:{},preferences:{sound:false,reduceMotion:false,largePreviews:false,largeText:false,markers:true},catalogScroll:0,onboarded:false});
const object=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const integer=(v:unknown,lo:number,hi:number):v is number=>Number.isInteger(v)&&Number(v)>=lo&&Number(v)<=hi;
const finite=(v:unknown,lo:number,hi:number):v is number=>typeof v==='number'&&Number.isFinite(v)&&v>=lo&&v<=hi;
const uniqueIds=(v:unknown):v is number[]=>Array.isArray(v)&&v.every(n=>integer(n,1,100))&&new Set(v).size===v.length;
export function validateSave(input:unknown, catalog:CatalogEntry[]):Save {
  if(!object(input)||input.version!==1||!integer(input.current,1,100)||!uniqueIds(input.completed)||!uniqueIds(input.favorites)||!object(input.attempts)||!object(input.preferences)||typeof input.onboarded!=='boolean'||!finite(input.updated,0,1e15)||!finite(input.catalogScroll,0,1e8)) throw Error('This file is not a valid Little Discoveries save. Your progress has not changed.');
  const prefs=input.preferences;
  for(const key of ['sound','reduceMotion','largePreviews','largeText','markers']) if(typeof prefs[key]!=='boolean') throw Error('The backup has invalid settings. Your progress has not changed.');
  for(const [key,value] of Object.entries(input.attempts)){
    const level=catalog.find(l=>String(l.id)===key);
    if(!level||!object(value)||!Array.isArray(value.found)||!value.found.every(id=>typeof id==='string'&&level.targetIds.includes(id))||new Set(value.found).size!==value.found.length||typeof value.started!=='boolean'||typeof value.replay!=='boolean'||typeof value.completed!=='boolean'||!finite(value.updated,0,1e15)||!object(value.view)||!finite(value.view.x,0,1)||!finite(value.view.y,0,1)||!finite(value.view.zoom,1,8)) throw Error('The backup has invalid scene progress. Your progress has not changed.');
    if(value.completed!== (value.found.length===level.targetCount)) throw Error('The backup has inconsistent completion data. Your progress has not changed.');
    if(value.completed&&!input.completed.includes(level.id)) throw Error('The backup is missing a completion record. Your progress has not changed.');
  }
  return structuredClone(input) as Save;
}
export function loadSave(catalog:CatalogEntry[]):{save:Save;recovered:boolean;warning:string} {
  let recovered=false, warning='';
  try {
    for(const key of [KEY,RECOVERY]){
      const raw=localStorage.getItem(key);
      if(!raw) continue;
      try { return {save:validateSave(JSON.parse(raw),catalog),recovered,warning}; }
      catch {recovered=true;warning='Your last save could not be read. A recovery copy was used when available.';}
    }
  } catch {warning='This browser could not open device storage. You can still play and back up progress in Settings.';}
  return {save:freshSave(),recovered,warning};
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
export function continueLevel(save:Save):number {
  const current=save.attempts[save.current];
  if(current?.started&&!current.completed) return save.current;
  const unfinished=Object.entries(save.attempts).filter(([,a])=>a.started&&!a.completed).sort((a,b)=>b[1].updated-a[1].updated);
  return unfinished.length?+unfinished[0][0]:(Array.from({length:100},(_,i)=>i+1).find(id=>!save.completed.includes(id))??100);
}
export function exportBackup(save:Save):string {return JSON.stringify({format:'little-discoveries',schemaVersion:1,savedAt:new Date().toISOString(),save},null,2);}
export function importBackup(text:string,catalog:CatalogEntry[]):Save {
  if(text.length>2_000_000) throw Error('That file is too large to be a progress backup. Your progress has not changed.');
  let parsed:unknown;
  try {parsed=JSON.parse(text);} catch {throw Error('That file could not be read. Choose a Little Discoveries backup. Your progress has not changed.');}
  if(!object(parsed)||parsed.format!=='little-discoveries'||parsed.schemaVersion!==1) throw Error('Choose a Little Discoveries progress backup. Your progress has not changed.');
  return validateSave(parsed.save,catalog);
}

import {describe,it,expect,vi,afterEach} from 'vitest';
import {readFileSync} from 'node:fs';
import {collect,continueLevel,exportBackup,freshSave,importBackup,loadSave,newAttempt,persist,validateSave} from '../src/save';
import legacy from '../src/data/legacy-catalog-v1.json' with {type:'json'};
import previous from '../src/data/legacy-catalog-v2.json' with {type:'json'};
import {inside,pickTarget,clampView} from '../src/geometry';
import type {Catalog,Level} from '../src/types';
const catalog=JSON.parse(readFileSync('public/content/catalog.json','utf8')) as Catalog;
const level=JSON.parse(readFileSync('public/content/levels/001.json','utf8')) as Level;
afterEach(()=>vi.unstubAllGlobals());
describe('authored content and input geometry',()=>{
 it('contains the retained fifty and exactly five twelve-object samples',()=>{
  expect(catalog.revision).toBe(3);expect(catalog.levels).toHaveLength(55);expect(catalog.chapters).toHaveLength(6);
  expect(catalog.levels.reduce((n,l)=>n+l.targetCount,0)).toBe(726);
  expect(catalog.levels.every(l=>l.targetCount<=15)).toBe(true);
  for(const meta of catalog.levels.slice(50)){expect(meta.targetCount).toBe(12);expect(meta.sampleLevel).toBe(true);expect(meta.sceneKey).toBe('sample3-'+String(meta.id).padStart(3,'0'));}
  expect(catalog.levels.slice(0,50).map(l=>l.targetIds)).toEqual(previous.levels.slice(0,50).map(l=>l.targetIds));
  const preceding=JSON.parse(readFileSync('public/content/v3/catalog-54.json','utf8')) as Catalog;
  expect(preceding.levels).toHaveLength(54);expect(catalog.levels.slice(0,54)).toEqual(preceding.levels);
 });
 it('selects one visible silhouette before a neighbor’s generous padding',()=>{
  const a={...level.targets[0],id:'a',outline:[[0,0],[10,0],[10,10],[0,10]],hit:[[0,0],[10,0],[10,10],[0,10]]} as typeof level.targets[0];
  const b={...a,id:'b',outline:[[13,0],[23,0],[23,10],[13,10]],hit:[[13,0],[23,0],[23,10],[13,10]]} as typeof a;
  expect(pickTarget([14,5],[a,b],1)?.id).toBe('b');
  expect(pickTarget([-8,5],[a,b],1)?.id).toBe('a');
  expect(pickTarget([-80,5],[a,b],1)).toBeUndefined();
  expect(inside([5,5],a.outline)).toBe(true);
 });
 it('keeps a view inside artwork after rotation and zoom limits',()=>{
  const view=clampView({x:2,y:-1,zoom:20},1024,1536,375,400);
  expect(view.zoom).toBe(8);expect(view.x).toBeLessThan(1);expect(view.y).toBeGreaterThan(0);
  expect(clampView({x:.1,y:.9,zoom:1},1024,1536,375,400)).toEqual({x:.5,y:.5,zoom:1});
 });
 it('finds a small foreground object resting on a larger already-found textile',()=>{
  const cloth={...level.targets[0],id:'cloth',outline:[[0,0],[200,0],[200,200],[0,200]],hit:[[0,0],[200,0],[200,200],[0,200]]} as typeof level.targets[0];
  const comb={...cloth,id:'comb',outline:[[60,60],[140,60],[140,100],[60,100]],hit:[[60,60],[140,60],[140,100],[60,100]]} as typeof cloth;
  expect(pickTarget([90,80],[cloth,comb],1)?.id).toBe('comb');
  expect(pickTarget([59.2,80],[cloth,comb],1,new Set(['cloth']))?.id).toBe('comb');
  expect(pickTarget([53,80],[cloth,comb],1,new Set(['cloth']))?.id).toBe('cloth');
  expect(pickTarget([59.2,80],[cloth,comb],1)?.id).toBe('cloth');
  expect(pickTarget([59.2,80],[cloth,comb],1,new Set(),'comb')?.id).toBe('comb');
  expect(pickTarget([20,20],[cloth,comb],1)?.id).toBe('cloth');
 });
});
describe('generous collection, replay, and resume',()=>{
 it('never counts repeat finds and gives assisted finds ordinary completion credit',()=>{
  const save=freshSave(),meta=catalog.levels[0];
  expect(collect(save,meta,'unknown')).toBe(false);
  expect(collect(save,meta,level.targets[0].id)).toBe(true);
  expect(collect(save,meta,level.targets[0].id)).toBe(false);
  for(const t of level.targets)collect(save,meta,t.id);
  expect(save.attempts[1].found).toHaveLength(level.targetCount);expect(save.attempts[1].completed).toBe(true);expect(save.completed).toEqual([1]);
  save.attempts[1]=newAttempt(true);
  expect(save.completed).toEqual([1]);expect(save.attempts[1].found).toEqual([]);
 });
 it('continues the current unfinished scene and preserves other unfinished scenes',()=>{
  const save=freshSave();save.attempts[1]=newAttempt();save.attempts[28]=newAttempt();save.current=28;
  expect(continueLevel(save,catalog.levels)).toBe(28);expect(save.attempts[1].started).toBe(true);
  save.current=2;save.attempts[1].updated=100;save.attempts[28].updated=200;
  expect(continueLevel(save,catalog.levels)).toBe(28);
 });
});

describe('revision-2 progress migration',()=>{
 const retained=legacy.slice(50).map(meta=>({...catalog.levels[0],...meta,id:meta.id-50}));
 function oldSave(){
  const save={...freshSave(),version:1,current:72,completed:[2,90],favorites:[2,72,100],onboarded:true,attempts:{
   2:{...newAttempt(),found:legacy[1].targetIds.slice(0,1)},
   72:{...newAttempt(),found:legacy[71].targetIds.slice(0,13),view:{x:.62,y:.41,zoom:3}},
   90:{...newAttempt(),found:[...legacy[89].targetIds],completed:true},
  }};return save;
 }
 it('moves old 72 to 22 with thirteen finds, view and favorites; retired progress never credits replacements',()=>{
  const migrated=validateSave(oldSave(),retained);
  expect(migrated.version).toBe(3);expect(migrated.current).toBe(22);
  expect(migrated.attempts[22].found).toEqual(legacy[71].targetIds.slice(0,13));
  expect(migrated.attempts[22].view).toEqual({x:.62,y:.41,zoom:3});
  expect(migrated.completed).toEqual([40]);expect(migrated.favorites).toEqual([22,50]);
  expect(Object.keys(migrated.attempts).sort()).toEqual(['22','40']);
 });
 it('imports original portable backups and rejects invalid old IDs before remapping',()=>{
  const backup={format:'little-discoveries',schemaVersion:1,save:oldSave()};
  expect(importBackup(JSON.stringify(backup),retained).attempts[22].found).toHaveLength(13);
  backup.save.attempts[72].found[0]='l072-nonexistent';
  expect(()=>importBackup(JSON.stringify(backup),retained)).toThrow('invalid scene progress');
 });
 it('filters retired cap targets and credits a retained scene when all fifteen remaining targets were already found',()=>{
  const current=retained.map(l=>l.id===4?{...l,targetCount:15,targetIds:l.targetIds.slice(0,15)}:l);
  const old={...oldSave(),current:54,attempts:{54:{...newAttempt(),found:legacy[53].targetIds.slice(0,15)}}};
  const migrated=validateSave(old,current);expect(migrated.attempts[4].completed).toBe(true);expect(migrated.completed).toContain(4);
  old.attempts[54].found=legacy[53].targetIds.slice(15);const trimmed=validateSave(old,current);expect(trimmed.attempts[4].found).toEqual([]);expect(trimmed.attempts[4].completed).toBe(false);
 });
 it('migrates storage exactly once and preserves the original recovery file',()=>{
  const map=new Map([['little-discoveries.save.v1',JSON.stringify(oldSave())]]);
  vi.stubGlobal('localStorage',{getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>map.set(key,value)});
  const first=loadSave(retained);expect(first.migrated).toBe(true);expect(first.save.current).toBe(22);
  expect(JSON.parse(map.get('little-discoveries.save.v1.before-revision2')!).current).toBe(72);
  const second=loadSave(retained);expect(second.migrated).toBe(false);expect(second.save).toEqual(first.save);
 });
 it('keeps revised saves independent of an older cached copy of the game',()=>{
  const original=JSON.stringify(oldSave()),map=new Map([['little-discoveries.save.v1',original]]);
  vi.stubGlobal('localStorage',{getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>map.set(key,value)});
  const migrated=loadSave(retained);expect(map.get('little-discoveries.save.v1')).toBe(original);
  expect(JSON.parse(map.get('little-discoveries.save.v3')!).version).toBe(3);
  const oldTab=oldSave();oldTab.current=90;map.set('little-discoveries.save.v1',JSON.stringify(oldTab));
  const resumed=loadSave(retained);expect(resumed.migrated).toBe(false);expect(resumed.save).toEqual(migrated.save);
 });
});
describe('portable, validated saves and recovery',()=>{
 it('round trips discoveries, view, favorites, and preferences',()=>{
  const save=freshSave();collect(save,catalog.levels[0],level.targets[0].id);save.attempts[1].view={x:.65,y:.3,zoom:3};save.favorites=[24];save.preferences.largeText=true;
  expect(importBackup(exportBackup(save),catalog.levels)).toEqual(save);
 });
 it.each(['{}','null','not json','{"format":"little-discoveries","schemaVersion":2}','[]'])('rejects an invalid backup without modifying the active save: %s',text=>{
  const save=freshSave(),before=structuredClone(save);expect(()=>importBackup(text,catalog.levels)).toThrow();expect(save).toEqual(before);
 });
 it('rejects impossible progress, duplicate finds, invalid views, and false completion',()=>{
  for(const mutation of [(s:ReturnType<typeof freshSave>)=>s.attempts[1].found.push('missing'),(s:ReturnType<typeof freshSave>)=>s.attempts[1].found.push(level.targets[0].id),(s:ReturnType<typeof freshSave>)=>s.attempts[1].view.zoom=Infinity,(s:ReturnType<typeof freshSave>)=>s.attempts[1].completed=true]){
   const save=freshSave();collect(save,catalog.levels[0],level.targets[0].id);mutation(save);expect(()=>importBackup(exportBackup(save),catalog.levels)).toThrow();
  }
 });
 it('recovers a corrupted primary save from an independently validated copy',()=>{
  const map=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>map.set(k,v)});
  const save=freshSave();collect(save,catalog.levels[0],level.targets[0].id);expect(persist(save)).toBe(true);
  map.set('little-discoveries.save.v3','{broken');const loaded=loadSave(catalog.levels);
  expect(loaded.recovered).toBe(true);expect(loaded.save.attempts[1].found).toEqual([level.targets[0].id]);
 });
 it('reports unavailable device storage while keeping in-memory progress exportable',()=>{
  vi.stubGlobal('localStorage',{setItem:()=>{throw new Error('quota');},getItem:()=>{throw new Error('denied');}});
  const save=freshSave();collect(save,catalog.levels[0],level.targets[0].id);expect(persist(save)).toBe(false);
  expect(importBackup(exportBackup(save),catalog.levels).attempts[1].found).toHaveLength(1);
  expect(loadSave(catalog.levels).warning).toContain('device storage');
 });
});

describe('removing the rejected fifty preserves only the retained picture progress',()=>{
 const old=()=>({...freshSave(),version:2,current:80,completed:[24,51],favorites:[24,52,80],onboarded:true,attempts:{24:{...newAttempt(),found:previous.levels[23].targetIds,completed:true,view:{x:.6,y:.4,zoom:2}},51:{...newAttempt(),found:previous.levels[50].targetIds,completed:true},80:{...newAttempt(),found:previous.levels[79].targetIds.slice(0,1)}}});
 it('keeps original discoveries and never credits a new sample with rejected finds',()=>{
  const result=validateSave(old(),catalog.levels);expect(result.version).toBe(3);expect(result.completed).toEqual([24]);expect(result.favorites).toEqual([24]);expect(result.attempts[24].view.zoom).toBe(2);expect(result.attempts[51]).toBeUndefined();expect(result.attempts[80]).toBeUndefined();expect(result.current).toBeLessThanOrEqual(53);
 });
 it('archives the old raw save, survives old-tab writes, and does not remigrate',()=>{
  const raw=JSON.stringify(old()),map=new Map([['little-discoveries.save.v2',raw]]);
  vi.stubGlobal('localStorage',{getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>map.set(key,value)});
  const first=loadSave(catalog.levels).save;expect(map.get('little-discoveries.save.v2.before-samples3')).toBe(raw);expect(map.get('little-discoveries.save.v2')).toBe(raw);
  collect(first,catalog.levels[50],catalog.levels[50].targetIds[0]);persist(first);map.set('little-discoveries.save.v2',raw);
  expect(loadSave(catalog.levels).save.attempts[51].found).toEqual([catalog.levels[50].targetIds[0]]);
 });
 it('imports old backups only after validating rejected data too',()=>{
  const value=old();expect(importBackup(JSON.stringify({format:'little-discoveries',schemaVersion:2,save:value}),catalog.levels).completed).toEqual([24]);
  value.attempts[80].found=['invented-id'];expect(()=>validateSave(value,catalog.levels)).toThrow('invalid scene progress');
 });
 it('continues through the five samples after completing the retained pictures',()=>{
  const value=freshSave();value.completed=Array.from({length:50},(_,i)=>i+1);expect(continueLevel(value,catalog.levels)).toBe(51);
  value.completed=catalog.levels.map(l=>l.id);expect(continueLevel(value,catalog.levels)).toBe(55);
 });
});

describe('appending sample 55 keeps version-three discoveries unchanged',()=>{
 it('loads and imports every prior scene, completion, favorite, preference and view without migration',()=>{
  const old=freshSave();old.current=54;old.onboarded=true;old.catalogScroll=1234;old.preferences.largePreviews=true;
  for(const meta of catalog.levels.slice(0,54)){
   old.attempts[meta.id]={...newAttempt(),found:[...meta.targetIds],completed:true,view:{x:.6,y:.4,zoom:2}};
   old.completed.push(meta.id);old.favorites.push(meta.id);
  }
  const raw=JSON.stringify(old),map=new Map([['little-discoveries.save.v3',raw],['little-discoveries.save.v3.recovery',raw]]);
  vi.stubGlobal('localStorage',{getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>map.set(key,value)});
  const loaded=loadSave(catalog.levels);expect(loaded.migrated).toBeFalsy();expect(loaded.save).toEqual(old);
  expect(importBackup(exportBackup(old),catalog.levels)).toEqual(old);expect(continueLevel(loaded.save,catalog.levels)).toBe(55);
  expect(map.get('little-discoveries.save.v3')).toBe(raw);expect(loaded.save.attempts[55]).toBeUndefined();
  const target=catalog.levels[54].targetIds[0];expect(collect(loaded.save,catalog.levels[54],target)).toBe(true);
  expect(collect(loaded.save,catalog.levels[54],target)).toBe(false);persist(loaded.save);
  const again=loadSave(catalog.levels).save;expect(again.attempts[55].found).toEqual([target]);
  for(const meta of catalog.levels.slice(0,54))expect(again.attempts[meta.id]).toEqual(old.attempts[meta.id]);
  expect(again.completed).toEqual(old.completed);expect(again.favorites).toEqual(old.favorites);expect(again.preferences).toEqual(old.preferences);
 });
});

import {describe,it,expect,vi,afterEach} from 'vitest';
import {readFileSync} from 'node:fs';
import {collect,continueLevel,exportBackup,freshSave,importBackup,loadSave,newAttempt,persist} from '../src/save';
import {inside,pickTarget,clampView} from '../src/geometry';
import type {Catalog,Level} from '../src/types';
const catalog=JSON.parse(readFileSync('public/content/catalog.json','utf8')) as Catalog;
const level=JSON.parse(readFileSync('public/content/levels/001.json','utf8')) as Level;
afterEach(()=>vi.unstubAllGlobals());
describe('authored content and input geometry',()=>{
 it('retains all 100 designed counts and the 1,304-placement total',()=>{
  expect(catalog.levels).toHaveLength(100);expect(catalog.chapters).toHaveLength(10);
  expect(catalog.levels.reduce((n,l)=>n+l.targetCount,0)).toBe(1304);
  expect([1,28,80].map(id=>catalog.levels[id-1].targetCount)).toEqual([8,16,14]);
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
  expect(save.attempts[1].found).toHaveLength(8);expect(save.attempts[1].completed).toBe(true);expect(save.completed).toEqual([1]);
  save.attempts[1]=newAttempt(true);
  expect(save.completed).toEqual([1]);expect(save.attempts[1].found).toEqual([]);
 });
 it('continues the current unfinished scene and preserves other unfinished scenes',()=>{
  const save=freshSave();save.attempts[1]=newAttempt();save.attempts[28]=newAttempt();save.current=28;
  expect(continueLevel(save)).toBe(28);expect(save.attempts[1].started).toBe(true);
  save.current=2;save.attempts[1].updated=100;save.attempts[28].updated=200;
  expect(continueLevel(save)).toBe(28);
 });
});
describe('portable, validated saves and recovery',()=>{
 it('round trips discoveries, view, favorites, and preferences',()=>{
  const save=freshSave();collect(save,catalog.levels[0],level.targets[0].id);save.attempts[1].view={x:.65,y:.3,zoom:3};save.favorites=[80];save.preferences.largeText=true;
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
  map.set('little-discoveries.save.v1','{broken');const loaded=loadSave(catalog.levels);
  expect(loaded.recovered).toBe(true);expect(loaded.save.attempts[1].found).toEqual([level.targets[0].id]);
 });
 it('reports unavailable device storage while keeping in-memory progress exportable',()=>{
  vi.stubGlobal('localStorage',{setItem:()=>{throw new Error('quota');},getItem:()=>{throw new Error('denied');}});
  const save=freshSave();collect(save,catalog.levels[0],level.targets[0].id);expect(persist(save)).toBe(false);
  expect(importBackup(exportBackup(save),catalog.levels).attempts[1].found).toHaveLength(1);
  expect(loadSave(catalog.levels).warning).toContain('device storage');
 });
});

import {expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {inside,edgeDistance,polygonArea,clampView} from '../../src/geometry';
import type {Catalog,Level,Point,Target,View} from '../../src/types';
export const catalog=JSON.parse(readFileSync('public/content/catalog.json','utf8')) as Catalog;
export const readLevel=(id:number)=>JSON.parse(readFileSync(`public/content/levels/${String(id).padStart(3,'0')}.json`,'utf8')) as Level;
export const firstLevel=readLevel(1);
export async function saved(page:Page){return page.evaluate(()=>JSON.parse(localStorage.getItem('little-discoveries.save.v2')!));}
export async function dismissIntro(page:Page){if(await page.getByRole('button',{name:'Let’s explore',exact:true}).isVisible())await page.getByRole('button',{name:'Let’s explore',exact:true}).click();}
export async function ready(page:Page,id:number){await expect(page.locator('.play-heading h1')).toHaveText(catalog.levels[id-1].title);await expect(page.locator('#object-tray .object-card')).toHaveCount(catalog.levels[id-1].targetCount);}
export async function start(page:Page,id=1){await page.goto(`/#scene/${id}`);await ready(page,id);await dismissIntro(page);}
export function pointWithin(target:Target,targets:Target[],scale:number):Point{
 const xs=target.outline.map(p=>p[0]),ys=target.outline.map(p=>p[1]);
 const left=Math.min(...xs),top=Math.min(...ys),w=Math.max(...xs)-left,h=Math.max(...ys)-top;
 const area=polygonArea(target.outline),foreground=targets.filter(other=>other.id!==target.id&&polygonArea(other.outline)<area);
 const candidates:Point[]=[];
 for(let y=1;y<32;y++)for(let x=1;x<32;x++){const p:Point=[left+w*x/32,top+h*y/32];if(inside(p,target.outline)&&!target.holes?.some(h=>inside(p,h))&&!foreground.some(other=>edgeDistance(p,other.outline)*scale<=3))candidates.push(p);}
 const center:Point=[left+w/2,top+h/2];candidates.sort((a,b)=>Math.hypot(a[0]-center[0],a[1]-center[1])-Math.hypot(b[0]-center[0],b[1]-center[1]));
 if(!candidates.length)throw Error(`${target.id}: no reachable interior point`);return candidates[0];
}
export async function targetCoordinates(page:Page,level:Level,target:Target,requested:View={x:.5,y:.5,zoom:1}){
 const r=(await page.locator('#picture').boundingBox())!,size=await page.locator('#picture').evaluate(el=>({w:el.clientWidth,h:el.clientHeight}));
 const view=clampView(requested,level.width,level.height,size.w,size.h),scale=Math.min(size.w/level.width,size.h/level.height)*view.zoom,p=pointWithin(target,level.targets,scale);
 return{x:r.x+size.w/2+(p[0]-view.x*level.width)*scale,y:r.y+size.h/2+(p[1]-view.y*level.height)*scale};
}
export async function tapTarget(page:Page,level:Level,target:Target){const p=await targetCoordinates(page,level,target);await page.touchscreen.tap(p.x,p.y);}
export async function assist(page:Page,name:string){await page.getByRole('button',{name:'All objects',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name,exact:true}).click();await page.getByRole('button',{name:'Mark found',exact:true}).click();}

import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {catalog,firstLevel as level,start,ready,saved,tapTarget,assist} from './helpers';
const total=level.targetCount;
test('real taps, offscreen tray targets, help, resume and replay preserve the gameplay loop',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await start(page);
 await page.screenshot({path:`test-results/${test.info().project.name}-scene-1.png`});
 await tapTarget(page,level,level.targets[0]);await expect(page.locator('#progress')).toHaveText(`1 / ${total}`);
 await tapTarget(page,level,level.targets[0]);await expect(page.locator('#progress')).toHaveText(`1 / ${total}`);
 await tapTarget(page,level,level.targets.at(-1)!);await expect(page.locator('#progress')).toHaveText(`2 / ${total}`);
 await page.getByRole('button',{name:'Show me',exact:true}).click();await expect(page.locator('#reveal-notice')).toBeVisible();
 await expect.poll(async()=>(await saved(page)).attempts[1].view.zoom).toBeGreaterThan(1);const view=(await saved(page)).attempts[1].view;
 await page.reload();await ready(page,1);await expect(page.locator('#progress')).toHaveText(`2 / ${total}`);expect((await saved(page)).attempts[1].view.zoom).toBeCloseTo(view.zoom);
 await page.getByRole('button',{name:'Hint',exact:true}).click();await page.getByRole('button',{name:'Hint',exact:true}).click();await expect(page.locator('#progress')).toHaveText(`2 / ${total}`);
 await page.getByRole('button',{name:'Show me',exact:true}).click();await expect(page.locator('#reveal-notice')).toBeVisible();await page.getByRole('button',{name:'Dismiss exact outline'}).click();await expect(page.locator('#reveal-notice')).toBeHidden();
 for(const target of level.targets.slice(1,-1))await assist(page,target.name);
 await expect(page.getByRole('dialog').getByRole('heading',{name:'All found. Nicely spotted.'})).toBeVisible();expect((await saved(page)).completed).toContain(1);
 await page.getByRole('button',{name:'Stay and look',exact:true}).click();await expect(page.locator('#progress')).toHaveText(`${total} / ${total}`);
 await page.getByRole('button',{name:'Open settings'}).click();await page.getByRole('button',{name:'Search this scene again'}).click();await expect(page.locator('#progress')).toHaveText(`0 / ${total}`);expect((await saved(page)).completed).toContain(1);expect((await saved(page)).attempts[1].replay).toBe(true);expect(errors).toEqual([]);
});
test('drag and pinch never collect; compact portrait and landscape controls stay reachable',async({page})=>{
 await page.setViewportSize({width:375,height:568});await start(page);const r=(await page.locator('#picture').boundingBox())!;
 await page.mouse.move(r.x+r.width*.4,r.y+r.height*.5);await page.mouse.down();await page.mouse.move(r.x+r.width*.6,r.y+r.height*.6,{steps:8});await page.mouse.up();await expect(page.locator('#progress')).toHaveText(`0 / ${total}`);
 await page.locator('#picture').evaluate(el=>{const box=el.getBoundingClientRect(),x=box.left+100,y=box.top+100;const send=(type:string,id:number,px:number,py:number)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:id,pointerType:'touch',clientX:px,clientY:py,button:0}));el.setPointerCapture=()=>{};el.releasePointerCapture=()=>{};el.hasPointerCapture=()=>false;send('pointerdown',91,x,y);send('pointerdown',92,x+50,y);send('pointermove',92,x+100,y+40);send('pointerup',92,x+100,y+40);send('pointerup',91,x,y);});
 await expect(page.locator('#progress')).toHaveText(`0 / ${total}`);
 for(const size of [{width:375,height:568},{width:667,height:375}]){await page.setViewportSize(size);await page.getByRole('button',{name:'Fit picture',exact:true}).click();for(const name of ['Hint','Show me','Zoom in','Zoom out','Fit picture','Open settings']){const box=(await page.getByRole('button',{name,exact:true}).boundingBox())!;expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);expect(box.x).toBeGreaterThanOrEqual(0);expect(box.y).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(size.width+.5);expect(box.y+box.height).toBeLessThanOrEqual(size.height+.5);}expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(size.width);const tray=(await page.locator('.object-pane').boundingBox())!;expect(tray.height).toBeLessThanOrEqual(78);expect(tray.y+tray.height).toBeCloseTo(size.height,0);expect(await page.locator('#object-tray').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);}
 await page.screenshot({path:`test-results/${test.info().project.name}-landscape.png`});
});
test('six clear scenes render; rejected scenes are absent from the catalog',async({page})=>{
 for(const id of [24,51,52,53,54,55,56]){await start(page,id);await page.screenshot({path:`test-results/${test.info().project.name}-scene-${id}.png`});await page.getByRole('button',{name:'All objects',exact:true}).click();const cards=page.locator('dialog .object-card');await expect(cards).toHaveCount(catalog.levels[id-1].targetCount);await expect.poll(()=>cards.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);await page.getByRole('button',{name:'Close panel'}).click();}
 await page.getByRole('button',{name:'Choose a scene',exact:true}).click();await expect(page.locator('.scene-open')).toHaveCount(catalog.levels.length);await expect(page.locator('.scene-open:disabled')).toHaveCount(0);await page.screenshot({path:`test-results/${test.info().project.name}-catalog.png`});
 await page.goto('/#home');await expect(page.getByRole('heading',{name:'Lovely things. Little discoveries.'})).toBeVisible();await expect(page.locator('.hero-picture')).toHaveAttribute('data-action','play:56');await expect(page.getByRole('heading',{name:'Six scenes to try'})).toBeVisible();await expect(page.locator('.featured-card')).toHaveCount(6);await expect(page.getByRole('navigation').getByRole('link',{name:'Scenes',exact:true})).toBeVisible();await expect(page.getByRole('navigation').getByRole('link',{name:'My album',exact:true})).toBeVisible();await page.screenshot({path:`test-results/${test.info().project.name}-home.png`,fullPage:true});
});
test('backup export, invalid import preservation, and confirmed restore',async({page})=>{
 await start(page);await tapTarget(page,level,level.targets[0]);await page.getByRole('button',{name:'Open settings'}).click();const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Back up progress',exact:true}).click();const download=await pending,backup=readFileSync((await download.path())!,'utf8');expect(JSON.parse(backup).save.attempts[1].found).toHaveLength(1);const before=await saved(page);
 await page.locator('#import-file').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{"not":"a save"}')});expect((await saved(page)).attempts).toEqual(before.attempts);
 await page.locator('#import-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(backup)});await expect(page.getByRole('heading',{name:'Bring your discoveries back?'})).toBeVisible();await page.getByRole('button',{name:'Restore this backup',exact:true}).click();await ready(page,1);await expect(page.locator('#progress')).toHaveText(`1 / ${total}`);
});
test('service worker restores a visited scene with networking disabled',async({page,context})=>{
 await start(page);await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));await page.reload();await ready(page,1);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await page.getByRole('button',{name:'All objects',exact:true}).click();await expect.poll(()=>page.locator('dialog .object-preview img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);await page.getByRole('button',{name:'Close panel'}).click();await tapTarget(page,level,level.targets[0]);
 await context.setOffline(true);await page.reload();await ready(page,1);await expect(page.locator('#progress')).toHaveText(`1 / ${total}`);await page.getByRole('button',{name:'Show me',exact:true}).click();await expect(page.locator('#reveal-notice')).toBeVisible();await context.setOffline(false);
});

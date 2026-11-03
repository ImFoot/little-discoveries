import {test,expect} from '@playwright/test';
import {catalog,start,ready,readLevel,assist,saved} from './helpers';
import {freshSave,newAttempt} from '../../src/save';
import previous from '../../src/data/legacy-catalog-v2.json' with {type:'json'};

test('revision two updates preserve level 24 and do not transfer rejected finds to sample 51',async({page})=>{
 const old={...freshSave(),version:2,current:24,onboarded:true,completed:[51],favorites:[24,80],attempts:{24:{...newAttempt(),found:previous.levels[23].targetIds.slice(0,4)},51:{...newAttempt(),found:previous.levels[50].targetIds,completed:true}}};
 await page.addInitScript(value=>{if(!localStorage.getItem('seeded-r2')){localStorage.setItem('little-discoveries.save.v2',JSON.stringify(value));localStorage.setItem('seeded-r2','yes');}},old);
 await page.goto('/#scene/24');await ready(page,24);await expect(page.locator('#progress')).toHaveText('4 / 15');
 expect((await saved(page)).favorites).toEqual([24]);expect((await saved(page)).completed).not.toContain(51);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('little-discoveries.save.v2.before-samples3')!).version)).toBe(2);
 await page.goto('/#scene/51');await ready(page,51);await expect(page.locator('#progress')).toHaveText('0 / 12');
 await assist(page,readLevel(51).targets[0].name);await page.reload();await ready(page,51);await expect(page.locator('#progress')).toHaveText('1 / 12');
 await page.goto('/#scene/80');await expect(page.locator('.home')).toBeVisible();await expect(page.locator('#picture')).toHaveCount(0);
});

test('all three samples and their unchanged source previews download as one complete offline set',async({page,context})=>{
 await start(page,51);await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));await page.getByRole('button',{name:'Open settings',exact:true}).click();
 await page.getByRole('button',{name:'6. '+catalog.chapters[5].title,exact:true}).click();await expect(page.getByText('Keep all 3 pictures and their little details with you.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/^(Keep this chapter offline|Resume download)$/}).click();await expect(page.getByText('Available offline',{exact:true})).toBeVisible({timeout:60000});await page.getByRole('button',{name:'Close panel',exact:true}).click();
 await context.setOffline(true);
 for(const id of [51,52,53]){
  await page.goto(`/#scene/${id}`);await ready(page,id);await expect.poll(()=>page.locator('#object-tray img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
  await assist(page,readLevel(id).targets[0].name);await page.reload();await ready(page,id);await expect(page.locator('#progress')).toHaveText('1 / 12');
 }
});

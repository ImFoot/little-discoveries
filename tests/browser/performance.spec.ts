import {test,expect} from '@playwright/test';
import {readLevel,start,ready,saved,targetCoordinates} from './helpers';
import {throttledServer} from './throttled-server';
const level=readLevel(55);
test('a cold scene fits the transfer and loading budgets at an emulated 10 Mbps',async({page,baseURL},info)=>{
 test.setTimeout(30000);const proxy=await throttledServer(baseURL!);
 try{
  const began=Date.now();await page.goto(proxy.url+'/#scene/55');await ready(page,55);
  await expect.poll(()=>page.locator('#object-tray img').evaluateAll(imgs=>imgs.length===12&&imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
  const playableMs=Date.now()-began,bytes=proxy.bytes;expect(playableMs).toBeLessThan(5000);expect(bytes).toBeLessThan(5_000_000);
  await info.attach('emulated-loading.json',{body:JSON.stringify({playableMs,bytes,downloadMbps:10,latencyMs:40,measurement:'Aggregate HTTP response payloads, including page, Pixi worker and service worker; picture and all target previews ready.',physicalIPhone:false}),contentType:'application/json'});
 }finally{await proxy.close();}
});
test('a valid touch gives feedback within 100 ms and picture recovery preserves finds',async({page},info)=>{
 await start(page,55);const p=await targetCoordinates(page,level,level.targets[0]);
 await page.evaluate(()=>{document.querySelector('#picture')!.addEventListener('pointerup',()=>{(window as unknown as {findStarted:number}).findStarted=performance.now();},{capture:true,once:true});new MutationObserver((_,o)=>{(window as unknown as {findFeedbackMs:number}).findFeedbackMs=performance.now()-(window as unknown as {findStarted:number}).findStarted;o.disconnect();}).observe(document.querySelector('#progress')!,{childList:true,characterData:true,subtree:true});});
 await page.touchscreen.tap(p.x,p.y);await expect(page.locator('#progress')).toHaveText(`1 / ${level.targetCount}`);const feedbackMs=await page.evaluate(()=>(window as unknown as {findFeedbackMs:number}).findFeedbackMs);expect(feedbackMs).toBeLessThan(100);
 await page.locator('#picture canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await page.getByRole('button',{name:'Open picture again',exact:true}).click();await ready(page,55);await expect(page.locator('#progress')).toHaveText(`1 / ${level.targetCount}`);expect((await saved(page)).attempts[55].found).toEqual([level.targets[0].id]);
 // Reopening is a control action; only a subsequent picture tap may add a find.
 await page.getByRole('button',{name:'Show me',exact:true}).click();const next=level.targets[1],nextPoint=await targetCoordinates(page,level,next,next.inspect);await page.touchscreen.tap(nextPoint.x,nextPoint.y);await expect(page.locator('#progress')).toHaveText(`2 / ${level.targetCount}`);expect((await saved(page)).attempts[55].found).toEqual(level.targets.slice(0,2).map(target=>target.id));
 await info.attach('emulated-touch-feedback.json',{body:JSON.stringify({scene:55,feedbackMs,physicalIPhone:false}),contentType:'application/json'});
});

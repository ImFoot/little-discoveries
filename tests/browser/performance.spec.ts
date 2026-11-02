import {test,expect} from '@playwright/test';

test('a cold scene fits the transfer and loading budgets at an emulated 10 Mbps',async({page,context},info)=>{
 test.skip(info.project.name!=='chromium-phone','Network throttling in this test uses Chromium CDP.');
 test.setTimeout(30000);
 const session=await context.newCDPSession(page);
 await session.send('Network.enable');
 await session.send('Network.emulateNetworkConditions',{offline:false,downloadThroughput:1_250_000,uploadThroughput:625_000,latency:40,connectionType:'cellular4g'});
 const started=Date.now();await page.goto('/#scene/1');await expect(page.locator('#object-tray .object-card')).toHaveCount(8);
 const playableMs=Date.now()-started;
 const bytes=await page.evaluate(()=>performance.getEntriesByType('resource').reduce((n,e)=>n+(e as PerformanceResourceTiming).transferSize,0));
 expect(playableMs).toBeLessThan(5000);expect(bytes).toBeLessThan(5_000_000);
 await info.attach('emulated-loading.json',{body:JSON.stringify({playableMs,bytes,downloadMbps:10,latencyMs:40,physicalIPhone:false},null,2),contentType:'application/json'});
});

test('a valid touch produces progress feedback within 100 ms and picture recovery preserves finds',async({page},info)=>{
 await page.goto('/#scene/1');await expect(page.locator('#object-tray .object-card')).toHaveCount(8);await page.getByRole('button',{name:'Let’s explore',exact:true}).click();
 const r=(await page.locator('#picture').boundingBox())!,scale=Math.min(r.width/1024,r.height/1536);
 await page.evaluate(()=>{
  const el=document.querySelector('#picture')!;
  el.addEventListener('pointerup',()=>{(window as unknown as {findStarted:number}).findStarted=performance.now();},{capture:true,once:true});
  new MutationObserver((_,observer)=>{(window as unknown as {findFeedbackMs:number}).findFeedbackMs=performance.now()-(window as unknown as {findStarted:number}).findStarted;observer.disconnect();}).observe(document.querySelector('#progress')!,{childList:true,characterData:true,subtree:true});
 });
 await page.touchscreen.tap(r.x+(r.width-1024*scale)/2+110*scale,r.y+(r.height-1536*scale)/2+530*scale);
 await expect(page.locator('#progress')).toHaveText('1 / 8');
 const feedbackMs=await page.evaluate(()=>(window as unknown as {findFeedbackMs:number}).findFeedbackMs);
 expect(feedbackMs).toBeLessThan(100);
 await page.locator('#picture canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
 await expect(page.getByRole('button',{name:'Open picture again',exact:true})).toBeVisible();await page.getByRole('button',{name:'Open picture again',exact:true}).click();await expect(page.locator('#object-tray .object-card')).toHaveCount(8);await expect(page.locator('#progress')).toHaveText('1 / 8');
 await info.attach('emulated-touch-feedback.json',{body:JSON.stringify({feedbackMs,physicalIPhone:false},null,2),contentType:'application/json'});
});

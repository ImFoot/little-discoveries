import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';

const readJSON=async path=>JSON.parse(await readFile(path,'utf8'));
const reports=[
  {name:'full-browser-run.json',path:'.cache/browser-report.json'},
  {name:'final-regression-run.json',path:'.cache/final-check-report.json'},
];
const latest=new Map();
function collect(suite,run){
  for(const spec of suite.specs||[])for(const test of spec.tests||[]){
    const key=`${test.projectName}: ${spec.title}`;
    latest.set(key,{project:test.projectName,title:spec.title,status:test.status,results:test.results,run});
  }
  for(const child of suite.suites||[])collect(child,run);
}
for(const run of reports){run.report=await readJSON(run.path);for(const suite of run.report.suites)collect(suite,run.name);}
const content=await readJSON('.cache/content-validation.json');
const unit=await readJSON('.cache/unit-report.json');
const manifest=await readJSON('dist/offline-manifest.json');
let missingArt;try{missingArt=await readJSON('.cache/missing-art-results.json');}catch{}
const cases=[...latest.values()];
const summary={total:cases.length,passed:cases.filter(c=>c.status==='expected').length,skipped:cases.filter(c=>c.status==='skipped').length,failed:cases.filter(c=>!['expected','skipped'].includes(c.status)).length};
if(summary.total!==24||summary.failed||unit.numFailedTests||content.errors.length||content.illustratedScenes!==100||content.authoredPlacements!==1304)throw Error('Latest verification is not complete and passing.');
if(missingArt?.stats.unexpected)throw Error('Additional missing-art recovery checks did not pass.');
const metrics=[];
for(const c of cases)for(const result of c.results)for(const attachment of result.attachments||[]){
  if(!attachment.name.endsWith('.json'))continue;
  const body=attachment.path?await readFile(attachment.path,'utf8'):Buffer.from(attachment.body,'base64').toString('utf8');
  metrics.push({name:attachment.name,project:c.project,run:c.run,...JSON.parse(body)});
}
const collection=metrics.filter(m=>m.name==='verified-placements.json');
if(collection.length!==2||collection.some(m=>m.scenes!==100||m.placements!==1304))throw Error('Both complete collection tours are required.');
await mkdir('docs/verification',{recursive:true});
for(const run of reports)await copyFile(run.path,`docs/verification/${run.name}`);
await copyFile('.cache/unit-report.json','docs/verification/unit-run.json');
if(missingArt)await copyFile('.cache/missing-art-results.json','docs/verification/additional-recovery-run.json');
for(const name of ['chromium-phone-scene-1.png','chromium-phone-scene-28.png','chromium-phone-scene-80.png','chromium-phone-landscape.png','chromium-phone-home.png'])await copyFile(`test-results/${name}`,`docs/verification/${name}`);
const versions=(await readJSON('package-lock.json')).packages;
const evidence={
  date:new Date().toISOString(),content,
  unitTests:{passed:unit.numPassedTests,failed:unit.numFailedTests},
  browserTests:{...summary,method:'Latest result per engine and scenario, full tour followed by final focused regression checks.',runs:reports.map(r=>({file:r.name,...r.report.stats})),cases:cases.map(({results,...c})=>c)},
  additionalRecovery:missingArt?.stats,metrics,
  packages:Object.fromEntries(['pixi.js','vite','typescript','sharp','@playwright/test'].map(name=>[name,versions[`node_modules/${name}`].version])),
  buildVersion:manifest.version,contentVersion:manifest.contentVersion,
  offlineChapters:manifest.chapters.map(c=>({chapter:c.id,scenes:c.readyLevels,files:c.files.length,bytes:c.bytes})),
  physicalIPhoneTested:false,
};
await writeFile('docs/verification/results.json',JSON.stringify(evidence,null,2)+'\n');
const loading=metrics.find(m=>m.name==='emulated-loading.json');
const feedback=metrics.filter(m=>m.name==='emulated-touch-feedback.json');
const doc=`# Implementation and verification

Generated ${evidence.date}.

The local game contains **100 original illustrated scenes and 1,304 authored object placements**, with the exact chapter/level counts in DESIGN.md. Source PNGs, final prompts, manually traced outlines, matching previews and runtime level JSON are retained in this workspace. No placeholder level counts as finished. All ten complete offline packages are in the production build.

The object tray is a compact horizontal strip at the bottom (about 74 CSS pixels in portrait), including landscape. Larger details and the remaining-only filter are in All objects. All scenes are immediately selectable. Help, exact reveals, and assisted finds are unlimited.

## Automated checks

- ${unit.numPassedTests} core tests passed.
- ${summary.passed} distinct browser cases passed; ${summary.failed} unresolved failures; ${summary.skipped} intentional skip (Chromium-specific network throttling is not repeated in WebKit).
- ${collection.map(c=>`${c.engine}: ${c.scenes} scenes / ${c.placements} real scene-picker collections`).join('; ')}.
- Exact counts, stable IDs, matching previews, source dimensions, polygon topology, broad hint coverage, inspection bounds, missing assets and duplicate scene bytes checked.
- Pointer/touch event collection, duplicate taps, offscreen tray targets, drag/pinch suppression, help, assisted completion, replay, album/postcards, backup export/import and rejection, reload recovery, and saved viewing position checked.
- Complete chapter download, offline navigation through ten scenes, missing-file detection/repair and interrupted download resumption checked in Chromium and WebKit. Service-worker reload recovery checked independently.
- 375-pixel portrait, a 375 × 568 small-height viewport, and 667 × 375 landscape keep controls reachable and the tray horizontal at the bottom.

Evidence combines the complete browser tour with a final focused run of gameplay, reload/offline recovery, layout and performance checks against the final build. The initial run exposed a test acting before artwork was ready and first-marker graphics initialization exceeding the feedback budget under concurrent load. The test now waits for scene readiness; the renderer prepares its feedback pipeline while loading. The final regression run passed all 13 applicable cases, with one intentional skip. Raw reports retain the earlier failures rather than replacing their history. Performance was measured with one test worker.

A cold scene became playable in **${loading.playableMs} ms** under Chromium's emulated 10 Mbps / 40 ms network conditions. Window resource entries reported **${loading.bytes.toLocaleString()} transfer bytes**; service-worker installation traffic is separate. The complete uncompressed app shell is below 1 MB. Touch-to-counter feedback measured **${feedback.map(m=>`${m.project}: ${m.feedbackMs.toFixed(1)} ms`).join('; ')}**. These measurements are from this Windows workstation, not a real iPhone.

## Remaining acceptance work

**No actual iPhone has been tested.** All 100 per-scene smallPhone flags remain false. The intended phone still needs normal-brightness artwork/target review, real two-finger pinch/drag, Safari toolbar and app-switch/lock interruptions, storage eviction behavior, and performance measurements. See [DEVICE_REVIEW.md](DEVICE_REVIEW.md). This is the remaining acceptance blocker; browser emulation cannot establish those results.

The build is ready for static HTTPS hosting in dist/. It has not been deployed to a public website by this task. Opening a normal HTTPS link is sufficient; Home Screen installation is optional.

Detailed evidence, raw reports, screenshots and package versions are in [verification/results.json](verification/results.json) and the neighboring files. Chapter composition contact sheets are in artwork/review/.
`;
await writeFile('docs/VERIFICATION.md',doc);
console.log('Wrote docs/VERIFICATION.md and durable evidence.');

import {readFile,mkdir,copyFile} from 'node:fs/promises';
import {basename} from 'node:path';
import {writeArtifact} from './artifact-io.mjs';
const json=async path=>JSON.parse((await readFile(path,'utf8')).replace(/^\uFEFF/,''));
const reportPaths=process.argv.slice(2);
if(!reportPaths.length)throw Error('Pass the revision-2 browser reports, in chronological order.');
const content=await json('.cache/r2-content.json'),unit=await json('.cache/r2-unit.json'),catalog=await json('public/content/catalog.json'),manifest=await json('dist/offline-manifest.json');
const archive=await json('.cache/archive-info.json');
if(archive.catalogRevision!==2||archive.counts.Scenes!==100||archive.counts.Previews!==1391||archive.counts.RuntimeLevels!==100)throw Error('A verified complete revision-2 static archive is required.');
if(catalog.revision!==2||content.errors.length||content.illustratedScenes!==100||content.authoredPlacements!==1391||unit.numFailedTests)throw Error('Complete passing revision-2 content and core checks are required.');
const latest=new Map(),runs=[];
function visit(suite,run){for(const s of suite.specs??[])for(const t of s.tests??[])latest.set(`${t.projectName}: ${s.title}`,{project:t.projectName,title:s.title,status:t.status,results:t.results,run});for(const child of suite.suites??[])visit(child,run);}
for(const path of reportPaths){const report=await json(path);runs.push({path,report});for(const suite of report.suites)visit(suite,basename(path));}
const cases=[...latest.values()],summary={total:cases.length,passed:cases.filter(c=>c.status==='expected').length,skipped:cases.filter(c=>c.status==='skipped').length,failed:cases.filter(c=>!['expected','skipped'].includes(c.status)).length};
if(summary.total!==24||summary.failed||summary.skipped)throw Error('All 24 distinct browser scenarios must pass.');
const metrics=[];
for(const c of cases)for(const result of c.results)for(const a of result.attachments??[]){if(!a.name.endsWith('.json'))continue;const body=a.path?await readFile(a.path,'utf8'):Buffer.from(a.body,'base64').toString('utf8');metrics.push({name:a.name,project:c.project,run:c.run,...JSON.parse(body)});}
const tours=metrics.filter(m=>m.name==='verified-placements.json');if(tours.length!==2||tours.some(t=>t.scenes!==100||t.placements!==1391))throw Error('Both complete 1,391-placement collection tours are required.');
const feedback=metrics.filter(m=>m.name==='emulated-touch-feedback.json'),loading=metrics.filter(m=>m.name==='emulated-loading.json');
if(feedback.length!==2||loading.length!==2)throw Error('Both feedback checks and both emulated cold-load checks are required.');
await mkdir('docs/verification',{recursive:true});
for(const run of runs)await copyFile(run.path,`docs/verification/${basename(run.path)}`);
await copyFile('.cache/r2-unit.json','docs/verification/unit-run.json');
await copyFile('.cache/archive-info.json','docs/verification/static-archive.json');
for(const name of ['scene-1','scene-51','scene-60','scene-86','scene-100','landscape','home'])await copyFile(`test-results/chromium-phone-${name}.png`,`docs/verification/chromium-phone-${name}.png`);
let deployment;try{const d=await json('docs/verification/deployment.json');if(d.catalogRevision===2&&d.verified)deployment=d;}catch{}
const evidence={date:new Date().toISOString(),catalogRevision:2,content,unitTests:{passed:unit.numPassedTests,failed:unit.numFailedTests},browserTests:{...summary,runs:runs.map(r=>({file:basename(r.path),...r.report.stats})),cases:cases.map(({results,...c})=>c)},difficulty:{maxTargets:15,retainedScenes:50,newScenes:50,ordinary:{scenes:45,targets:15,challenging:11,easy:4},breaks:{levels:[60,70,80,90,100],targets:10,challenging:3,easy:7},newPlacements:725,newChallenging:510,newEasy:215},metrics,buildVersion:manifest.version,contentVersion:manifest.contentVersion,offlineChapters:manifest.chapters.map(c=>({id:c.id,scenes:c.readyLevels,files:c.files.length,bytes:c.bytes})),staticArchive:archive,hostedDeployment:deployment,physicalIPhoneTested:false};
await writeArtifact('docs/verification/results.json',JSON.stringify(evidence,null,2)+'\n');
await writeArtifact('docs/VERIFICATION.md',`# Revised collection verification

Generated ${evidence.date}. This report describes collection revision 2. Original collection evidence is retained in [verification-v1](verification-v1/results.json).

## Completed content

The active game has **100 illustrated scenes and 1,391 placements**, with **at most 15 targets in every level**. Original 51–100 are now 1–50; original 1–50 are retired. Fifty new illustrations fill 51–100. Ten retained sixteen-target lists were reduced to fifteen by removing their largest visible target. Their artwork and remaining target IDs are retained.

New ordinary scenes contain 11 challenging and 4 easy targets. Breaks 60, 70, 80, 90, 100 contain 3 challenging and 7 easy targets. Across all 725 new placements, 510 (70.3%) are classified as challenging. Each has a concrete concealment rationale. The source/outline overlay review is recorded for each new scene. These are authored visual assessments, not measured player difficulty; the intended player's feedback remains necessary.

## Checks and evidence

- ${unit.numPassedTests} core tests passed, including original-backup validation, 72→22 migration with thirteen finds, retained favorites/view, one-time migration and fifteen-target trimming/completion.
- ${summary.passed} browser scenarios passed; ${summary.failed} unresolved failures; ${summary.skipped} skipped.
- ${tours.map(t=>`${t.project}: 100 scenes / 1,391 actual pointer collections`).join('; ')}.
- Count/quota/cap, unique IDs/art bytes, source dimensions, matching nonempty previews, polygon bounds/topology, hint coverage and inspection bounds checked.
- Collection, repeated taps, offscreen tray targets, hints/reveals/assists, replay, album/postcards/dedication, backups/rejection, reload and old-save recovery checked.
- Chapter downloads, offline navigation, missing-file detection/repair and interrupted resumption checked in Chromium and WebKit. Refreshing an original cached tab preserves its discoveries and reads the versioned catalog.
- Portrait 375×568 and landscape 667×375 keep 44px controls reachable and the bottom object scroller compact and horizontal.

At an aggregate emulated 10 Mbps with 40 ms latency, the picture and every target preview became ready in **${loading.map(l=>`${l.project}: ${l.playableMs}ms`).join('; ')}**. The throttled local HTTP proxy counted ${loading.map(l=>`${l.project}: ${l.bytes.toLocaleString()} response payload bytes`).join('; ')} across the page, Pixi image worker and service worker. This replaces a page-only CDP/resource-entry measurement that omitted worker traffic. Touch-to-counter feedback measured **${feedback.map(f=>`${f.project}: ${f.feedbackMs.toFixed(1)}ms`).join('; ')}**. Timing checks use a single worker. These are desktop browser measurements.

Raw reports and latest per-scenario outcomes are in [verification/results.json](verification/results.json). Source art, final prompts, annotations and diagnostic review sheets remain available. Rejected drafts do not count as levels.

The local static hosting ZIP contains 100 scene pictures, 1,391 matching previews and 100 versioned level definitions, plus its application shell. Its size is ${(archive.bytes/1e6).toFixed(1)} MB. The SHA-256 checksum and verified entry counts are retained in [verification/static-archive.json](verification/static-archive.json).

## Phone and deployment status

The player provided an actual iPhone Safari screenshot of the original collection and rejected its difficulty. This task's revised collection has not been acceptance-tested on that physical iPhone. New artwork readability, real multitouch, Safari toolbar/lock/app interruptions and performance still need review there; see [DEVICE_REVIEW.md](DEVICE_REVIEW.md).

${deployment?'The revised collection is published at [Play Little Discoveries]('+deployment.url+'). Hosted checks are recorded in [verification/deployment.json](verification/deployment.json).':'The complete revised build is ready for deployment. The hosted revision will be recorded after successful publication.'} Home Screen installation is optional. Existing hosted saves migrate automatically; a backup remains portable between devices/origins.
`);
console.log('Saved complete revision-2 verification records.');

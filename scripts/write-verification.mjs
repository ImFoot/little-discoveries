import {readFile,mkdir,copyFile} from 'node:fs/promises';
import {basename} from 'node:path';
import {writeArtifact} from './artifact-io.mjs';
const json=async path=>JSON.parse((await readFile(path,'utf8')).replace(/^\uFEFF/,''));
const reportPaths=process.argv.slice(2);
if(!reportPaths.length)throw Error('Pass the revision-3 browser reports, in chronological order.');
const content=await json('.cache/r3-content.json'),unit=await json('.cache/r3-unit.json'),catalog=await json('public/content/catalog.json'),manifest=await json('dist/offline-manifest.json');
if(catalog.requiredScenes!==53)throw Error('This historical writer records the original three-sample release only. Current append evidence is in docs/verification-54.');
const archive=await json('.cache/archive-info.json');
const retained=await json('.cache/r3-retained.json');
if(!retained.verified||retained.identicalFiles!==866)throw Error('Retained-picture comparison must pass.');
if(archive.catalogRevision!==3||archive.counts.Scenes!==53||archive.counts.Previews!==702||archive.counts.RuntimeLevels!==53)throw Error('A verified complete revision-3 static archive is required.');
if(catalog.revision!==3||content.errors.length||content.illustratedScenes!==53||content.authoredPlacements!==702||unit.numFailedTests)throw Error('Complete passing revision-3 content and core checks are required.');
const latest=new Map(),runs=[];
function visit(suite,run){for(const s of suite.specs??[])for(const t of s.tests??[])latest.set(`${t.projectName}: ${s.title}`,{project:t.projectName,title:s.title,status:t.status,results:t.results,run});for(const child of suite.suites??[])visit(child,run);}
for(const path of reportPaths){const report=await json(path);runs.push({path,report});for(const suite of report.suites)visit(suite,basename(path));}
const cases=[...latest.values()],summary={total:cases.length,passed:cases.filter(c=>c.status==='expected').length,skipped:cases.filter(c=>c.status==='skipped').length,failed:cases.filter(c=>!['expected','skipped'].includes(c.status)).length};
if(summary.total!==28||summary.failed||summary.skipped)throw Error('All 28 distinct browser scenarios must pass.');
const metrics=[];
for(const c of cases)for(const result of c.results)for(const a of result.attachments??[]){if(!a.name.endsWith('.json'))continue;const body=a.path?await readFile(a.path,'utf8'):Buffer.from(a.body,'base64').toString('utf8');metrics.push({name:a.name,project:c.project,run:c.run,...JSON.parse(body)});}
const tours=metrics.filter(m=>m.name==='verified-placements.json');if(tours.length!==2||tours.some(t=>t.scenes!==53||t.placements!==702))throw Error('Both complete 702-placement collection tours are required.');
const feedback=metrics.filter(m=>m.name==='emulated-touch-feedback.json'),loading=metrics.filter(m=>m.name==='emulated-loading.json');
if(feedback.length!==2||loading.length!==2)throw Error('Both feedback checks and both emulated cold-load checks are required.');
await mkdir('docs/verification-v3',{recursive:true});
for(const run of runs)await copyFile(run.path,`docs/verification-v3/${basename(run.path)}`);
await copyFile('.cache/r3-unit.json','docs/verification-v3/unit-run.json');
await copyFile('.cache/archive-info.json','docs/verification-v3/static-archive.json');
await copyFile('.cache/r3-retained.json','docs/verification-v3/retained-content.json');
for(const name of ['scene-1','scene-24','scene-51','scene-52','scene-53','landscape','home'])await copyFile(`test-results/chromium-phone-${name}.png`,`docs/verification-v3/chromium-phone-${name}.png`);
let deployment;try{const d=await json('docs/verification-v3/deployment.json');if(d.catalogRevision===3&&d.verified)deployment=d;}catch{}
const evidence={date:new Date().toISOString(),catalogRevision:3,content,unitTests:{passed:unit.numPassedTests,failed:unit.numFailedTests},browserTests:{...summary,runs:runs.map(r=>({file:basename(r.path),...r.report.stats})),cases:cases.map(({results,...c})=>c)},difficulty:{maxTargets:15,retainedScenes:50,samples:3,sampleTargets:12,referenceLevel:24,playerAccepted:false},metrics,buildVersion:manifest.version,contentVersion:manifest.contentVersion,offlineChapters:manifest.chapters.map(c=>({id:c.id,scenes:c.readyLevels,files:c.files.length,bytes:c.bytes})),staticArchive:archive,hostedDeployment:deployment,physicalIPhoneTested:false};
await writeArtifact('docs/verification-v3/results.json',JSON.stringify(evidence,null,2)+'\n');
await writeArtifact('docs/VERIFICATION.md',`# Three-sample release verification

Generated ${evidence.date}. Revision 3 has **53 scenes / 702 placements**, maximum 15 targets. Fifty original retained scenes are unchanged; three new twelve-object samples replace the entire rejected fifty-scene revision-2 batch. A [comparison against the previous release](verification-v3/retained-content.json) confirms all 866 retained source, annotation, scene, thumbnail and preview files are byte-identical. The earlier automatic checks did not establish player acceptance: the player subsequently rejected those pictures and their cutout previews.

All three new illustrations and all 36 target previews/contours were inspected. Samples use tight unmasked source crops, validated byte-for-byte against the finished PNGs; contours no longer determine the preview silhouette. They aim for only a modest increase over current level 24 through placement and small overlaps. Their actual clarity and difficulty still require intended-player feedback. No new fifty-scene batch has been produced.

- ${unit.numPassedTests} core tests passed.
- ${summary.passed} browser scenarios passed; ${summary.failed} failed; ${summary.skipped} skipped.
- Both desktop engines collected all 702 placements in all 53 scenes through the real picker.
- Checks cover duplicate taps, help/reveals/assists, replay, album/postcards, backups/rejection, one-time old-save migration, retained level-24 finds and no rejected credit on sample 51.
- Both engines downloaded the complete three-sample chapter, opened every sample/preview offline and retained finds after offline reload. Ten-scene downloads, interrupted resume and missing-file repair also passed.
- Compact portrait 375×568 and landscape 667×375 keep the horizontal bottom tray and reachable 44px controls.

The initial cached-tab test still expected save version 2. After correcting that obsolete assertion to version 3, both engine reruns passed. Raw reports retain the initial run and the corrected rerun; the case summary uses the latest result for each scenario.

Aggregate 10 Mbps / 40 ms emulated loading: ${loading.map(l=>l.project+': '+l.playableMs+'ms, '+l.bytes.toLocaleString()+' response payload bytes').join('; ')}. This counts page, Pixi worker and service-worker traffic. Touch-to-counter feedback: ${feedback.map(f=>f.project+': '+f.feedbackMs.toFixed(1)+'ms').join('; ')}. These are desktop measurements, **not physical iPhone tests**.

The local production ZIP contains 53 scene images, 702 matching previews and 53 versioned level packages. It is ${(archive.bytes/1e6).toFixed(1)} MB. [Evidence, metrics and cases](verification-v3/results.json) · [ZIP checksum/counts](verification-v3/static-archive.json). Original and rejected revision-2 evidence remain historical; they are not current acceptance results.

${deployment?'Published at [Little Discoveries]('+deployment.url+'). [Hosted deployment checks](verification-v3/deployment.json).':'Local checks/build are complete; publication evidence will be recorded after deployment.'}

Reload Safari after publication. Retained discoveries migrate automatically; old raw saves remain available as recovery, and rejected pictures never grant sample credit. Offline chapter downloads should be repeated for the updated collection. Actual iPhone testing and intended-player sample feedback remain pending; see [device review](DEVICE_REVIEW.md).
`);
console.log('Saved revision-3 verification records.');

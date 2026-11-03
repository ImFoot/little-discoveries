import {readFile} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
const catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
if(catalog.revision!==2)throw Error('This generator describes the revised collection.');
const chapters=catalog.chapters.map(c=>`### ${c.id}. ${c.title}\n\n| Level | Scene | Targets | Search mix |\n| --- | --- | --- | --- |\n${catalog.levels.filter(l=>l.chapter===c.id).map(l=>`| ${l.id} | ${l.title} | ${l.targetCount} | ${l.id<=50?`Retained from original ${l.id+50}`:l.breakLevel?'Break: 3 challenging, 7 easy':'11 challenging, 4 easy'} |`).join('\n')}`).join('\n\n');
await writeArtifact('DESIGN.md',`# Little Discoveries — revised collection

This is the active implementation design, revised after the intended player found the original scenes too easy. The user requested retiring the first fifty scenes, moving the second fifty into the first fifty slots, and adding fifty more challenging scenes. The later instruction caps every level at fifteen targets. The [complete original design](docs/DESIGN-v1.md) and [original design Page](https://chatgpt.com/space/page_f13e568e45148191ab41e86b66b6e5fe) remain available for reference; this revision supersedes their catalog, target counts and difficulty pacing.

## Collection and difficulty

Exactly 100 distinct illustrated scenes remain. Original scenes 51–100 become scenes 1–50. Their artwork is retained; ten sixteen-target scenes lose their largest visible target so every level meets the fifteen-target limit. Original scenes 1–50 are retired from play and remain in Git history.

New scenes 51–100 use fifteen targets in ordinary levels: eleven challenging (73.3%) and four easy. Every tenth new scene — 60, 70, 80, 90 and 100 — is a ten-target break: three challenging (30%) and seven easy (70%). Across the new half, 510 of 725 targets (70.3%) are challenging. The retained half has 666 targets, giving **1,391 placements** in the active collection.

The difficulty quota applies to the fifty new scenes. Concealment comes from matching surrounding texture, repeated shapes, partial overlap, a less obvious orientation, and placement within a coherent dense environment. Prefer two concealment factors for each challenging target. A plainly displayed prop sharing only a color is a weak candidate. Easy anchors offer a few quick discoveries; break levels intentionally have more of them. The [difficulty rubric and migration rules](docs/DIFFICULTY.md) describe how the artwork is reviewed.

## Permanent game rules

All scenes are available immediately. There are no ads, purchases, subscriptions, energy, lives, penalties, timers, waiting periods, accounts or network game service. Hints, exact reveals and assisted finds are unlimited and give ordinary completion credit.

Every target is present and stationary from the start. Its name and preview identify one actual object or meaningful decorative figure. Its preview is extracted from the final illustration with matching shape, color and orientation. Avoid indistinguishable non-target copies. Challenging does not mean a transparent object, a few invisible pixels or an unreliable hotspot. Keep enough visible silhouette and the defining feature to recognize the object after a reveal, normally at least 60%.

One tap finds one object. Found objects remain in the artwork and receive optional subtle check marks. Their tray cards keep their positions. Missed taps have no consequence. Dragging, pinching and swiping the tray never count as guesses.

Tap an object card to enlarge its picture, select it for help or use Mark found. Hint circles a broad region. Show me moves to a useful inspection view and outlines the exact visible target until found or dismissed. Fit picture restores the full composition. Zoom buttons supplement pinch zoom and dragging. Generous edge taps remain available; nearby visible silhouettes take priority over another target’s padding.

## iPhone layout

Use TypeScript, Vite and PixiJS for the scene, with HTML/CSS controls. An ordinary HTTPS link opens in iPhone Safari; Home Screen installation is optional. Portrait is primary, at 375 CSS pixels wide. Landscape and short viewports retain reachable controls. All buttons have at least 44-by-44 CSS-pixel hit areas.

The artwork fills the central area. A compact horizontal object scroller stays at the bottom, about 74 CSS pixels tall in default portrait layout. The picture/help controls sit directly above it. All objects opens an enlarged list and the remaining-only filter. Larger text and previews, reduced motion, optional sound (off initially) and optional found markers are available in Settings.

## Progress, replay and offline use

Each find saves immediately. Scene, normalized viewing position, unfinished attempts, preferences and favorites survive reloads and interruptions while device storage remains available. Replay clears the current attempt while retaining permanent completion. Completed pictures enter the album; a complete chapter adds its postcard; all 100 produce a celebration. Level 100 shows the dedication independently of earlier completion.

Save version 2 migrates validated original saves. Original scenes 51–100 move down fifty numbers and retain stable target IDs; removed cap targets are filtered. A migrated attempt is complete if all remaining targets were found. Retired scenes never credit unrelated replacement pictures. The original local save is kept as a pre-revision recovery file. Original portable backups still import and migrate. Subsequent version 2 loads do not renumber progress again.

Settings provides validated export/import backups. Invalid files leave the active save intact; a valid import shows a review before replacement. Saves are local to a device and website origin. Export and restore when changing devices or moving from localhost to the hosted link.

Keep this chapter offline downloads the shell, all ten scene pictures, thumbnails, target previews and level definitions. Available offline appears only after all required files exist in Cache Storage. Interrupted downloads resume; missing art offers retry without clearing discoveries. Browser storage/cache retention is controlled by the browser, so backups remain useful. Versioned URLs keep the two catalogs and their artwork separate. Reload Safari once after publication to open the new collection.

## Artwork and acceptance

Every numbered scene is a distinct original composition. Recolors, mirrors and alternate target lists do not create new scenes. Rich coherent detail, adult warmth, readable evening lighting and deliberate concealment matter. Every intended target is inspected against the finished source and in a close context crop. Names, masked previews, hit regions, broad hints, exact outlines and inspection views must agree. Source PNGs, final prompts, annotations and review evidence remain in the workspace.

Automated checks must enforce 100 scenes, the cap and exact target totals/quotas, unique IDs/art, valid polygon topology and bounds, nonempty matching previews and broad hint coverage. A real-picker browser tour collects every placement. Verify duplicate taps, help, assisted completion, replay, old-save migration, backups/rejection, reload recovery, compact layout and offline downloads/repair. Cold loading and touch feedback budgets remain five seconds at 10 Mbps, under 5 MB initial transfer, and under 100 ms visual feedback. Distinguish desktop browser emulation from actual iPhone testing.

The player's original iPhone screenshot is evidence that the original difficulty failed. The new artwork’s challenge classification is an authored visual assessment; its enjoyment and difficulty still need real player/device feedback. Do not claim those outcomes from labels or automated tests. Finished content, build/test evidence and deployment state are reported separately in [verification](docs/VERIFICATION.md).

## Active 100-level catalog

${chapters}
`);
console.log('Updated DESIGN.md from the active revision-2 catalog.');

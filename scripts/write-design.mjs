import {readFile} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
const catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
if(catalog.revision!==3)throw Error('Expected the six-scene collection.');
const tables=catalog.chapters.map(c=>`### ${c.id}. ${c.title}\n\n| Level | Scene | Targets |\n| --- | --- | --- |\n`+catalog.levels.filter(l=>l.chapter===c.id).map(l=>`| ${l.id} | ${l.title} | ${l.targetCount} |`).join('\n')).join('\n\n');
await writeArtifact('DESIGN.md',`# Little Discoveries — component-built lantern demo

The intended player rejected all fifty revision-2 replacement levels as unplayable: unclear objects and damaged-looking cutout previews. The current scope supersedes the earlier 100-scene target and challenge quotas. The rejected fifty pictures were removed and three clearer samples were made. The latest request changes the production method: make twelve complete objects first, assemble the scene in layers with foreground concealment, and flatten the result for gameplay. The first workroom direction was rejected for mismatched colors/style. Scene 56 still used a completed environmental painting with extracted patches and did not meet the brief. The corrected scene 57 assembles separate structures, container backs/fronts and whole props on empty material planes, interleaving twelve intact objects. It imports no finished environment or manually cut concealment patches. Make only this one corrected trial.

## Active collection

**57 scenes / 750 placements**: retained original scenes 1–50 (666 targets), plus seven trial scenes 51–57 (12 targets each). Maximum **15 per level**. Retained pictures, names, numbers, geometry and stable IDs stay unchanged. Rejected scenes and source packages leave the working collection; their history remains in Git. [Original design](docs/DESIGN-v1.md) and [rejected revision-2 design](docs/DESIGN-v2-rejected.md) are historical records.

## Artwork and difficulty

Match level 24's bright, warm illustration and clear ordinary-object identities. Add modest concealment through varied heights, side nooks, depth, and small overlaps from a pot, leaf or cloth. Avoid foreground groups in the center. Most of each object and its identifying features remain visible. No muddy detail, microscopic fragments, distorted objects or misleading names. These scenes are trials for player feedback; authored intent does not establish achieved difficulty or enjoyment.

For scenes 54–55, create the natural working environment first, choose twelve well-formed real objects after inspecting it, and trace their visible outlines manually. Do not specify a row of target props or force a malformed detail to match a predetermined name. Use depth, similar materials and believable pocket/basket overlaps for the extra search difficulty. The reusable actual-size proof page shows every target at the real tray dimensions as well as enlarged.

Scenes 51–55 use unchanged crops of their finished pictures. Scene56 used complete target sprites over a finished environmental painting with cut foreground patches; the player correctly rejected that construction method. It remains a historical prototype.

Scene57 is an ordered assembly on empty wall/paving planes. It contains25 independent whole environment props,12 full target sprites,37 shadows and3 primitive surface/cord layers. Target layers are interleaved in six groups among structures and props. The full object assets were created separately before this assembly. Container backs come before their contents; their separate fronts come later. Whole hanging materials, paper and open lantern ribs cover other objects through their own alpha. No finished environmental painting or manually cut concealment patch is imported.

Previews use the intact object assets. The completed scene is flattened to a static picture; hotspots and exact outlines derive afterward from the actual visible alpha, including disconnected visible components and holes.

## Game and iPhone controls

All scenes are immediately available through an ordinary HTTPS iPhone Safari link. Installation is optional. Use TypeScript, Vite, PixiJS and HTML/CSS. No ads, purchases, subscriptions, energy, lives, penalties, timers, waiting or accounts. Unlimited broad hints, exact reveals and assisted finds give normal completion credit.

One tap finds one stationary object; duplicates do not count twice. Misses have no penalty. Dragging, pinching and tray swipes never collect. Generous hit padding remains, with visible silhouettes taking priority over neighboring padding. Keep pinch zoom, dragging, zoom buttons and Fit picture.

Portrait-first at 375 CSS pixels, usable landscape, controls at least 44 pixels. The bottom tray stays a compact horizontal scroller, about 74 CSS pixels tall. All objects opens larger cards and a remaining-only filter. Settings retain larger previews/text, reduced motion, optional sound and found markers.

## Saving, replay and offline use

Save version 3 uses a separate local key so an older open game cannot overwrite it. Fully validate revision-2 saves against their immutable catalog, keep retained scenes 1–50 and archive the complete raw old save. Rejected discoveries never credit scenes 51–57. Preserve retained views, preferences, favorites and completion. Original version-1 saves still migrate old 51–100 down fifty numbers. Imports accept validated versions 1–3; exports use version 3. Migration is idempotent.

Each find saves immediately with a recovery copy; views save on interruption. Replay resets the attempt while retaining permanent completion. Export/import backups in Settings; invalid imports change nothing and valid imports show a review before replacement. Saves belong to the browser/device and website origin. The album and celebration follow the actual catalog size; scene 50 retains the dedication.

Offline downloads use the actual chapter size: five ten-scene chapters and one complete seven-scene chapter. Available offline requires every picture, preview, definition and shell file. Downloads resume and repair missing assets. Versioned content/v3 and art/v3 URLs bypass old cached pictures. The seventh scene appends to the existing save version 3 without changing earlier scene IDs. Release-specific catalog/manifest/offline-entry names bypass a cached 56-scene catalog on normal reload. Activation carries forward a prior content cache only when its content hash exactly matches unchanged scenes 1–56; incompatible caches are removed. Progress is stored separately. Reload Safari after publication and add the new sample to the offline chapter. Browser cache retention remains browser-controlled.

## Acceptance and verification

Inspect all seven scenes, all 84 previews and all 84 source-coordinate contours, including openings and partial overlaps. Confirm names, hit regions, broad hints and useful inspection zoom against finished artwork. Validate exact 57/750 counts, max 15, unique pictures/IDs, valid polygon bounds/topology, complete crop coverage and byte-for-byte preview derivation from unmasked source crops. Retained source hashes and target IDs must match the preceding release.

Test collection, duplicate taps, unlimited help, assisted finds, saves/reload/recovery, old-save migration, backup rejection, replay, catalog/album counts, compact layouts and the complete seven-scene offline package. Cold-loading budget: 5 seconds at 10 Mbps and under 5 MB initial transfer; feedback under 100 ms. Desktop Chromium/WebKit emulation is not physical iPhone testing. Only the intended player can approve clarity and the requested difficulty. Keep final prompts, sources, annotations and review sheets for correction.

## Active catalog

${tables}
`);
console.log('Updated design for 50 retained scenes and seven trials.');

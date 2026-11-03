import {readFile} from 'node:fs/promises';
import {writeArtifact} from './artifact-io.mjs';
const catalog=JSON.parse(await readFile('public/content/catalog.json','utf8'));
if(catalog.revision!==3)throw Error('Expected the four-sample collection.');
const tables=catalog.chapters.map(c=>`### ${c.id}. ${c.title}\n\n| Level | Scene | Targets |\n| --- | --- | --- |\n`+catalog.levels.filter(l=>l.chapter===c.id).map(l=>`| ${l.id} | ${l.title} | ${l.targetCount} |`).join('\n')).join('\n\n');
await writeArtifact('DESIGN.md',`# Little Discoveries — four clearer samples

The intended player rejected all fifty revision-2 replacement levels as unplayable: unclear objects and damaged-looking cutout previews. The current scope supersedes the earlier 100-scene target and challenge quotas. The rejected fifty pictures were removed and three clearer samples were made. The latest request authorizes one additional sample, a little more difficult without losing preview clarity. Make only this fourth sample; no new fifty-level batch.

## Active collection

**54 scenes / 714 placements**: retained original scenes 1–50 (666 targets), plus four new samples 51–54 (12 targets each). Maximum **15 per level**. Retained pictures, names, numbers, geometry and stable IDs stay unchanged. Rejected scenes and source packages leave the working collection; their history remains in Git. [Original design](docs/DESIGN-v1.md) and [rejected revision-2 design](docs/DESIGN-v2-rejected.md) are historical records.

## Artwork and difficulty

Match level 24's bright, warm illustration and clear ordinary-object identities. Add modest concealment through varied heights, side nooks, depth, and small overlaps from a pot, leaf or cloth. Avoid foreground groups in the center. Most of each object and its identifying features remain visible. No muddy detail, microscopic fragments, distorted objects or misleading names. These four samples are trials for player feedback; authored intent does not establish achieved difficulty or enjoyment.

For scene 54, create the natural working environment first, choose twelve well-formed real objects after inspecting it, and trace their visible outlines manually. Do not specify a row of target props or force a malformed detail to match a predetermined name. Use depth, similar materials and believable pocket/basket overlaps for the extra search difficulty. The reusable actual-size proof page shows every target at the real tray dimensions as well as enlarged.

Every sample preview is a tight **unmasked crop from the finished scene**, preserving color, visible shape, orientation, overlap and nearby context. No generated replacement icons or masks cutting away identifying details. The crop contains the complete visible target. Tap a card to enlarge that same picture. Original previews remain unchanged. Separate hit/reveal contours follow the actual visible object, not the rectangular preview crop.

## Game and iPhone controls

All scenes are immediately available through an ordinary HTTPS iPhone Safari link. Installation is optional. Use TypeScript, Vite, PixiJS and HTML/CSS. No ads, purchases, subscriptions, energy, lives, penalties, timers, waiting or accounts. Unlimited broad hints, exact reveals and assisted finds give normal completion credit.

One tap finds one stationary object; duplicates do not count twice. Misses have no penalty. Dragging, pinching and tray swipes never collect. Generous hit padding remains, with visible silhouettes taking priority over neighboring padding. Keep pinch zoom, dragging, zoom buttons and Fit picture.

Portrait-first at 375 CSS pixels, usable landscape, controls at least 44 pixels. The bottom tray stays a compact horizontal scroller, about 74 CSS pixels tall. All objects opens larger cards and a remaining-only filter. Settings retain larger previews/text, reduced motion, optional sound and found markers.

## Saving, replay and offline use

Save version 3 uses a separate local key so an older open game cannot overwrite it. Fully validate revision-2 saves against their immutable catalog, keep retained scenes 1–50 and archive the complete raw old save. Rejected discoveries never credit samples 51–54. Preserve retained views, preferences, favorites and completion. Original version-1 saves still migrate old 51–100 down fifty numbers. Imports accept validated versions 1–3; exports use version 3. Migration is idempotent.

Each find saves immediately with a recovery copy; views save on interruption. Replay resets the attempt while retaining permanent completion. Export/import backups in Settings; invalid imports change nothing and valid imports show a review before replacement. Saves belong to the browser/device and website origin. The album and celebration follow the actual catalog size; scene 50 retains the dedication.

Offline downloads use the actual chapter size: five ten-scene chapters and one complete four-sample chapter. Available offline requires every picture, preview, definition and shell file. Downloads resume and repair missing assets. Versioned content/v3 and art/v3 URLs bypass old cached pictures. The fourth sample appends to the existing save version 3 without changing earlier scene IDs. Release-specific catalog/manifest/offline-entry names bypass a cached 53-scene catalog on normal reload. Activation carries forward a prior content cache only when its content hash exactly matches unchanged scenes 1–53; incompatible caches are removed. Progress is stored separately. Reload Safari after publication and add the new sample to the offline chapter. Browser cache retention remains browser-controlled.

## Acceptance and verification

Inspect all four scenes, all 48 real previews and all 48 source-coordinate contours, including openings and partial overlaps. Confirm names, hit regions, broad hints and useful inspection zoom against finished artwork. Validate exact 54/714 counts, max 15, unique pictures/IDs, valid polygon bounds/topology, complete crop coverage and byte-for-byte preview derivation from unmasked source crops. Retained source hashes and target IDs must match the preceding release.

Test collection, duplicate taps, unlimited help, assisted finds, saves/reload/recovery, old-save migration, backup rejection, replay, catalog/album counts, compact layouts and the complete four-sample offline package. Cold-loading budget: 5 seconds at 10 Mbps and under 5 MB initial transfer; feedback under 100 ms. Desktop Chromium/WebKit emulation is not physical iPhone testing. Only the intended player can approve clarity and the requested difficulty. Keep final prompts, sources, annotations and review sheets for correction.

## Active catalog

${tables}
`);
console.log('Updated design for 50 retained scenes and four samples.');

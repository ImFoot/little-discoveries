# Little Discoveries — layered festival demo

The intended player rejected all fifty revision-2 replacement levels as unplayable: unclear objects and damaged-looking cutout previews. The current scope supersedes the earlier 100-scene target and challenge quotas. The rejected fifty pictures were removed and three clearer samples were made. The latest request changes the production method: make twelve complete objects first, assemble the scene in layers with foreground concealment, and flatten the result for gameplay. The first workroom direction was rejected for mismatched colors/style. Scene 56 uses an entirely new lantern festival stall and a new coordinated matte object set. Make only this one layered demo.

## Active collection

**56 scenes / 738 placements**: retained original scenes 1–50 (666 targets), plus six new scenes 51–56 (12 targets each). Maximum **15 per level**. Retained pictures, names, numbers, geometry and stable IDs stay unchanged. Rejected scenes and source packages leave the working collection; their history remains in Git. [Original design](docs/DESIGN-v1.md) and [rejected revision-2 design](docs/DESIGN-v2-rejected.md) are historical records.

## Artwork and difficulty

Match level 24's bright, warm illustration and clear ordinary-object identities. Add modest concealment through varied heights, side nooks, depth, and small overlaps from a pot, leaf or cloth. Avoid foreground groups in the center. Most of each object and its identifying features remain visible. No muddy detail, microscopic fragments, distorted objects or misleading names. These scenes are trials for player feedback; authored intent does not establish achieved difficulty or enjoyment.

For scenes 54–55, create the natural working environment first, choose twelve well-formed real objects after inspecting it, and trace their visible outlines manually. Do not specify a row of target props or force a malformed detail to match a predetermined name. Use depth, similar materials and believable pocket/basket overlaps for the extra search difficulty. The reusable actual-size proof page shows every target at the real tray dimensions as well as enlarged.

Scenes 51–55 use a tight **unmasked crop from the finished scene**, preserving color, visible shape, orientation, overlap and nearby context. No generated replacement icons or masks cutting away identifying details. The crop contains the complete visible target. Tap a card to enlarge that same picture. Scene 56 instead uses the complete original object sprite for its preview. Its composition retains a background, twelve object layers, twelve contact-shadow layers and eleven separate foreground masks (36 editable OpenRaster layers). Visible masks subtract foreground coverage from placed object alpha. Multiple disconnected visible regions and their holes drive exact outlines and picking. The final playable image is static. Original previews remain unchanged. Separate hit/reveal contours follow the actual visible object, not the rectangular preview crop.

## Game and iPhone controls

All scenes are immediately available through an ordinary HTTPS iPhone Safari link. Installation is optional. Use TypeScript, Vite, PixiJS and HTML/CSS. No ads, purchases, subscriptions, energy, lives, penalties, timers, waiting or accounts. Unlimited broad hints, exact reveals and assisted finds give normal completion credit.

One tap finds one stationary object; duplicates do not count twice. Misses have no penalty. Dragging, pinching and tray swipes never collect. Generous hit padding remains, with visible silhouettes taking priority over neighboring padding. Keep pinch zoom, dragging, zoom buttons and Fit picture.

Portrait-first at 375 CSS pixels, usable landscape, controls at least 44 pixels. The bottom tray stays a compact horizontal scroller, about 74 CSS pixels tall. All objects opens larger cards and a remaining-only filter. Settings retain larger previews/text, reduced motion, optional sound and found markers.

## Saving, replay and offline use

Save version 3 uses a separate local key so an older open game cannot overwrite it. Fully validate revision-2 saves against their immutable catalog, keep retained scenes 1–50 and archive the complete raw old save. Rejected discoveries never credit scenes 51–56. Preserve retained views, preferences, favorites and completion. Original version-1 saves still migrate old 51–100 down fifty numbers. Imports accept validated versions 1–3; exports use version 3. Migration is idempotent.

Each find saves immediately with a recovery copy; views save on interruption. Replay resets the attempt while retaining permanent completion. Export/import backups in Settings; invalid imports change nothing and valid imports show a review before replacement. Saves belong to the browser/device and website origin. The album and celebration follow the actual catalog size; scene 50 retains the dedication.

Offline downloads use the actual chapter size: five ten-scene chapters and one complete five-sample chapter. Available offline requires every picture, preview, definition and shell file. Downloads resume and repair missing assets. Versioned content/v3 and art/v3 URLs bypass old cached pictures. The sixth scene appends to the existing save version 3 without changing earlier scene IDs. Release-specific catalog/manifest/offline-entry names bypass a cached 55-scene catalog on normal reload. Activation carries forward a prior content cache only when its content hash exactly matches unchanged scenes 1–55; incompatible caches are removed. Progress is stored separately. Reload Safari after publication and add the new sample to the offline chapter. Browser cache retention remains browser-controlled.

## Acceptance and verification

Inspect all six scenes, all 72 previews and all 72 source-coordinate contours, including openings and partial overlaps. Confirm names, hit regions, broad hints and useful inspection zoom against finished artwork. Validate exact 56/738 counts, max 15, unique pictures/IDs, valid polygon bounds/topology, complete crop coverage and byte-for-byte preview derivation from unmasked source crops. Retained source hashes and target IDs must match the preceding release.

Test collection, duplicate taps, unlimited help, assisted finds, saves/reload/recovery, old-save migration, backup rejection, replay, catalog/album counts, compact layouts and the complete five-sample offline package. Cold-loading budget: 5 seconds at 10 Mbps and under 5 MB initial transfer; feedback under 100 ms. Desktop Chromium/WebKit emulation is not physical iPhone testing. Only the intended player can approve clarity and the requested difficulty. Keep final prompts, sources, annotations and review sheets for correction.

## Active catalog

### 1. A leisurely journey

| Level | Scene | Targets |
| --- | --- | --- |
| 1 | The station waiting room | 12 |
| 2 | The vintage train | 14 |
| 3 | The canal boat | 14 |
| 4 | The hotel lobby | 15 |
| 5 | The mountain balcony | 10 |
| 6 | The tram depot | 14 |
| 7 | The traveling trunk | 14 |
| 8 | The mapmaker’s studio | 15 |
| 9 | The lakeside pier | 12 |
| 10 | The hilltop inn | 14 |

### 2. Rooms full of stories

| Level | Scene | Targets |
| --- | --- | --- |
| 11 | The old library | 12 |
| 12 | The natural history room | 14 |
| 13 | The clockmaker’s workshop | 14 |
| 14 | The theater dressing room | 15 |
| 15 | The ceramic studio | 10 |
| 16 | The conservatory classroom | 14 |
| 17 | The photographer’s room | 14 |
| 18 | The dollhouse workshop | 15 |
| 19 | The museum courtyard | 12 |
| 20 | The observatory | 14 |

### 3. A little everyday magic

| Level | Scene | Targets |
| --- | --- | --- |
| 21 | The woodland cottage | 12 |
| 22 | The mushroom village | 14 |
| 23 | The storybook bakery | 14 |
| 24 | The floating garden | 15 |
| 25 | The wishing well | 10 |
| 26 | The fairy tailor | 14 |
| 27 | The enchanted book room | 14 |
| 28 | The cloud collector’s attic | 15 |
| 29 | The moonlit tea table | 12 |
| 30 | The lantern grove | 14 |

### 4. The turning seasons

| Level | Scene | Targets |
| --- | --- | --- |
| 31 | The autumn doorstep | 12 |
| 32 | The pumpkin kitchen | 14 |
| 33 | The costume cupboard | 14 |
| 34 | The candle workshop | 15 |
| 35 | A rainy window | 10 |
| 36 | The winter cabin | 14 |
| 37 | The gift-wrapping table | 14 |
| 38 | The holiday village | 15 |
| 39 | The snowy garden bench | 12 |
| 40 | The fireside armchair | 14 |

### 5. Lovely things to come home to

| Level | Scene | Targets |
| --- | --- | --- |
| 41 | Sunday breakfast | 12 |
| 42 | The balcony garden | 14 |
| 43 | The craft afternoon | 14 |
| 44 | The flea-market treasures | 15 |
| 45 | The picnic basket | 10 |
| 46 | The celebration table | 14 |
| 47 | The memory shelf | 14 |
| 48 | The rooftop supper | 15 |
| 49 | Welcome home | 12 |
| 50 | A table for two | 10 |

### 6. Six scenes to try

| Level | Scene | Targets |
| --- | --- | --- |
| 51 | The orchard glasshouse | 12 |
| 52 | The cottage reading room | 12 |
| 53 | The seaside potting shed | 12 |
| 54 | The village flower shop | 12 |
| 55 | The baker’s pantry | 12 |
| 56 | The lantern-maker’s festival stall | 12 |

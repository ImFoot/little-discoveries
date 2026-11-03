# Little Discoveries — revised collection

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

### 1. A leisurely journey

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 1 | The station waiting room | 12 | Retained from original 51 |
| 2 | The vintage train | 14 | Retained from original 52 |
| 3 | The canal boat | 14 | Retained from original 53 |
| 4 | The hotel lobby | 15 | Retained from original 54 |
| 5 | The mountain balcony | 10 | Retained from original 55 |
| 6 | The tram depot | 14 | Retained from original 56 |
| 7 | The traveling trunk | 14 | Retained from original 57 |
| 8 | The mapmaker’s studio | 15 | Retained from original 58 |
| 9 | The lakeside pier | 12 | Retained from original 59 |
| 10 | The hilltop inn | 14 | Retained from original 60 |

### 2. Rooms full of stories

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 11 | The old library | 12 | Retained from original 61 |
| 12 | The natural history room | 14 | Retained from original 62 |
| 13 | The clockmaker’s workshop | 14 | Retained from original 63 |
| 14 | The theater dressing room | 15 | Retained from original 64 |
| 15 | The ceramic studio | 10 | Retained from original 65 |
| 16 | The conservatory classroom | 14 | Retained from original 66 |
| 17 | The photographer’s room | 14 | Retained from original 67 |
| 18 | The dollhouse workshop | 15 | Retained from original 68 |
| 19 | The museum courtyard | 12 | Retained from original 69 |
| 20 | The observatory | 14 | Retained from original 70 |

### 3. A little everyday magic

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 21 | The woodland cottage | 12 | Retained from original 71 |
| 22 | The mushroom village | 14 | Retained from original 72 |
| 23 | The storybook bakery | 14 | Retained from original 73 |
| 24 | The floating garden | 15 | Retained from original 74 |
| 25 | The wishing well | 10 | Retained from original 75 |
| 26 | The fairy tailor | 14 | Retained from original 76 |
| 27 | The enchanted book room | 14 | Retained from original 77 |
| 28 | The cloud collector’s attic | 15 | Retained from original 78 |
| 29 | The moonlit tea table | 12 | Retained from original 79 |
| 30 | The lantern grove | 14 | Retained from original 80 |

### 4. The turning seasons

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 31 | The autumn doorstep | 12 | Retained from original 81 |
| 32 | The pumpkin kitchen | 14 | Retained from original 82 |
| 33 | The costume cupboard | 14 | Retained from original 83 |
| 34 | The candle workshop | 15 | Retained from original 84 |
| 35 | A rainy window | 10 | Retained from original 85 |
| 36 | The winter cabin | 14 | Retained from original 86 |
| 37 | The gift-wrapping table | 14 | Retained from original 87 |
| 38 | The holiday village | 15 | Retained from original 88 |
| 39 | The snowy garden bench | 12 | Retained from original 89 |
| 40 | The fireside armchair | 14 | Retained from original 90 |

### 5. Lovely things to come home to

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 41 | Sunday breakfast | 12 | Retained from original 91 |
| 42 | The balcony garden | 14 | Retained from original 92 |
| 43 | The craft afternoon | 14 | Retained from original 93 |
| 44 | The flea-market treasures | 15 | Retained from original 94 |
| 45 | The picnic basket | 10 | Retained from original 95 |
| 46 | The celebration table | 14 | Retained from original 96 |
| 47 | The memory shelf | 14 | Retained from original 97 |
| 48 | The rooftop supper | 15 | Retained from original 98 |
| 49 | Welcome home | 12 | Retained from original 99 |
| 50 | A table for two | 10 | Retained from original 100 |

### 6. Collected curiosities

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 51 | The horologist’s secret alcove | 15 | 11 challenging, 4 easy |
| 52 | The bookbinder’s labyrinth | 15 | 11 challenging, 4 easy |
| 53 | The shell inlayer’s cabinet | 15 | 11 challenging, 4 easy |
| 54 | The automaton maker’s balcony | 15 | 11 challenging, 4 easy |
| 55 | The cabinet of botanical dyes | 15 | 11 challenging, 4 easy |
| 56 | The porcelain mender’s attic | 15 | 11 challenging, 4 easy |
| 57 | The luthier’s pearwood loft | 15 | 11 challenging, 4 easy |
| 58 | The puzzle-box conservator | 15 | 11 challenging, 4 easy |
| 59 | The stamp carver’s side room | 15 | 11 challenging, 4 easy |
| 60 | The ribbon merchant’s window | 10 | Break: 3 challenging, 7 easy |

### 7. The makers’ secrets

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 61 | The tin toymaker’s stairwell | 15 | 11 challenging, 4 easy |
| 62 | The glass engraver’s passage | 15 | 11 challenging, 4 easy |
| 63 | The map cabinet of curiosities | 15 | 11 challenging, 4 easy |
| 64 | The instrument restorer’s cupboard | 15 | 11 challenging, 4 easy |
| 65 | The silversmith’s old courtyard | 15 | 11 challenging, 4 easy |
| 66 | The lace conservator’s room | 15 | 11 challenging, 4 easy |
| 67 | The carver’s cedar gallery | 15 | 11 challenging, 4 easy |
| 68 | The opera archive | 15 | 11 challenging, 4 easy |
| 69 | The tapestry bazaar | 15 | 11 challenging, 4 easy |
| 70 | The courtyard post office | 10 | Break: 3 challenging, 7 easy |

### 8. Storied spaces

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 71 | The grand map room | 15 | 11 challenging, 4 easy |
| 72 | Behind the puppet theatre | 15 | 11 challenging, 4 easy |
| 73 | The lost-property gallery | 15 | 11 challenging, 4 easy |
| 74 | The chandelier hall | 15 | 11 challenging, 4 easy |
| 75 | The apothecary arcade | 15 | 11 challenging, 4 easy |
| 76 | The cinema projection room | 15 | 11 challenging, 4 easy |
| 77 | The harbor customs office | 15 | 11 challenging, 4 easy |
| 78 | The costume vault | 15 | 11 challenging, 4 easy |
| 79 | The railway parcel room | 15 | 11 challenging, 4 easy |
| 80 | The riverside bookstall | 10 | Break: 3 challenging, 7 easy |

### 9. Gardens within gardens

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 81 | The museum stair landing | 15 | 11 challenging, 4 easy |
| 82 | The ceramics market | 15 | 11 challenging, 4 easy |
| 83 | The clock-tower lobby | 15 | 11 challenging, 4 easy |
| 84 | The antiquarian passage | 15 | 11 challenging, 4 easy |
| 85 | The orchid keeper’s conservatory | 15 | 11 challenging, 4 easy |
| 86 | The moonlit herbal archive | 15 | 11 challenging, 4 easy |
| 87 | The moss-grown orrery garden | 15 | 11 challenging, 4 easy |
| 88 | The kitchen beneath the roots | 15 | 11 challenging, 4 easy |
| 89 | The rainmaker’s glasshouse | 15 | 11 challenging, 4 easy |
| 90 | Tea on the butterfly terrace | 10 | Break: 3 challenging, 7 easy |

### 10. Hidden wonders

| Level | Scene | Targets | Search mix |
| --- | --- | --- | --- |
| 91 | The starlight seamstress’s bower | 15 | 11 challenging, 4 easy |
| 92 | The river-pearl boathouse | 15 | 11 challenging, 4 easy |
| 93 | The snowdrop clock garden | 15 | 11 challenging, 4 easy |
| 94 | The heron potter’s courtyard | 15 | 11 challenging, 4 easy |
| 95 | The fern-stair library | 15 | 11 challenging, 4 easy |
| 96 | The sunflower printing room | 15 | 11 challenging, 4 easy |
| 97 | The moth keeper’s reading room | 15 | 11 challenging, 4 easy |
| 98 | The wisteria lantern bridge | 15 | 11 challenging, 4 easy |
| 99 | The honeycomb observatory | 15 | 11 challenging, 4 easy |
| 100 | The secret courtyard supper | 10 | Break: 3 challenging, 7 easy |

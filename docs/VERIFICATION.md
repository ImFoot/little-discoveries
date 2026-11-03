# Fifth-sample verification

Verified 2026-11-03T09:50:48.527Z. The active game contains **55 scenes / 726 placements**, maximum 15 targets per scene. Scene 55, The baker’s pantry, adds twelve objects. No additional batch was created.

## Content and artwork

All 1–54 catalog entries and **1092 source, annotation, prompt, level, picture, thumbnail and preview files** match the published 54-scene baseline 53f8423. See [retained-content evidence](verification-55/retained.json). The earlier exhaustive 702-placement tours remain in [the initial sample evidence](verification-v3/README.md); the twelve-object level 54 tour is in [the fourth-sample evidence](verification-54/README.md). They were not repeated for unchanged content.

Strict validation passes 55/726 counts, distinct illustrations, maximum 15, all 60 sample preview/source comparisons, complete crop bounds and valid contours. Every new target was inspected against its enlarged source and outline, and at the real 32-pixel tray-preview size. Names and outlines follow the visible object: the floor vessel is a milk jug, and the copper pot contour omits an arch whose connection is obscured. [Production workflow](ARTWORK_WORKFLOW.md) and [visual review](../artwork/sample-055/review/review.json) describe the method and remaining player judgment.

## Current tests

- 25/25 core tests passed, including all 54 earlier v3 attempts, completions, favorites, views, preferences and backup import/export surviving the append.
- 26/26 targeted browser cases passed across desktop Chromium and WebKit phone emulation, with no flaky results. Both engines collected all 12 new objects through the real touch picker, checked duplicate taps, repeated hints/reveals, completion and reload. Other cases cover gestures, compact 375-pixel portrait/landscape layouts, backups, recovery, earlier-save migrations and offline repair.
- A genuinely installed cache-first 54-scene worker fixture verifies ordinary reload opens 55, retains previous progress, carries compatible levels 24 and 54 offline files forward and upgrades an obsolete-catalog request.
- Chapter 6 downloads all five sample scenes, definitions and previews; all five reopen, collect and reload offline.
- 4/4 separate performance cases passed. At emulated 10 Mbps / 40 ms latency, chromium-phone: 1759ms and 1,057,685 bytes; webkit-phone: 2300ms and 1,226,699 bytes. Touch feedback: chromium-phone: 3.5ms; webkit-phone: 3.0ms. Limits are 5000 ms, 5 MB and 100 ms respectively.

The initial graphics-recovery check exposed a button tap also collecting an object behind the recovery overlay. The scene now pauses input on graphics loss, clears pending gestures and excludes overlay controls. Both engines verify the recovery click leaves exact saved target IDs unchanged and a subsequent real picture tap still works. The initial failure report is retained in verification-55/performance-initial.json.

Full reports and metrics are in [verification-55/results.json](verification-55/results.json). Emulation is not physical iPhone testing. Intended-player approval of preview clarity and increased difficulty is pending.

## Build and offline update

Production build passed. Shell version: d9c9cc4b4e85c65a; content version: 982742b92f4967cf. The release-specific catalog-55, manifest and offline entry bypass old cache-first catalog data without changing save schema 3 or earlier scene/art URLs. Compatible prior content hash: 2ded88050d338ed4. Cache writes can fail under browser storage pressure; affected offline files may need a retry, while progress is separate.

Six complete offline packages contain 55 scenes, with five in the sample chapter. The local static ZIP contains 55 scene WebPs, 726 previews, 55 runtime level definitions and all required shell files. Size: 41,593,268 bytes. SHA-256: 78a19d7ee17399da472d70a2249ac985b1df1e7087abcad8bdae985584833b1d. It is generated at output/LittleDiscoveries-static.zip and excluded from Git.

Publishing status will be recorded below after live HTTPS verification.

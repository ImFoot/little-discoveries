# Fourth-sample verification

Verified 2026-11-03T08:22:35.325Z. The active game contains **54 scenes / 714 placements**, maximum 15 targets per scene. Scene 54, The village flower shop, adds twelve objects. No additional batch was created.

## Content and artwork

All 1–53 catalog entries and **1073 source, annotation, prompt, level, picture, thumbnail and preview files** match the published53-scene baseline 54a3988. See [retained-content evidence](verification-54/retained.json). The earlier exhaustive702-placement browser tours remain in [the previous release evidence](verification-v3/README.md); they were not repeated for unchanged content.

Strict validation passes54/714 counts, distinct illustrations, maximum 15, all 48 sample preview/source comparisons, complete crop bounds and valid contours. Every new target was inspected against its enlarged source and outline, and at the real 32-pixel tray-preview size. A watering-can contour crossing was corrected before the final passing build. [Production workflow](ARTWORK_WORKFLOW.md) and [visual review](../artwork/sample-054/review/review.json) describe the method and remaining player judgment.

## Current tests

- 25/25 core tests passed, including all 53 earlier v3 attempts, completions, favorites, views, preferences and backup import/export surviving the append.
- 26/26 targeted browser cases passed across desktop Chromium and WebKit phone emulation, with no flaky results. Both engines collected all 12 new objects through the real touch picker, checked duplicate taps, repeated hints/reveals, completion and reload. Other cases cover gestures, compact 375-pixel portrait/landscape layouts, backups, recovery, earlier-save migrations and offline repair.
- A genuinely installed cache-first53-scene worker fixture verifies ordinary reload opens54, retains previous progress, carries compatible level 24 offline files forward and upgrades an obsolete-catalog request.
- Chapter 6 downloads all four sample scenes, definitions and previews; all four reopen, collect and reload offline.
- 4/4 separate performance cases passed. At emulated 10Mbps / 40 ms latency, chromium-phone: 1742ms and 1,020,163 bytes; webkit-phone: 2005ms and 1,170,203 bytes. Touch feedback: chromium-phone: 3.3ms; webkit-phone: 3.0ms. Limits are 5000 ms, 5 MB and 100 ms respectively.

Full reports and metrics are in [verification-54/results.json](verification-54/results.json). Emulation is not physical iPhone testing. Intended-player approval of preview clarity and increased difficulty is pending.

## Build and offline update

Production build passed. Shell version: 52796f2733b34f58; content version: 2ded88050d338ed4. The release-specific catalog-54, manifest and offline entry bypass old cache-first catalog data without changing save schema 3 or earlier scene/art URLs. Compatible prior content hash: a1da8e6447a16460. Cache writes can fail under browser storage pressure; affected offline files may need a retry, while progress is separate.

Six complete offline packages contain 54 scenes, with four in the sample chapter. The local static ZIP contains 54 scene WebPs, 714 previews, 54 runtime level definitions and all required shell files. Size: 40,762,699 bytes. SHA-256: c6a940687eb7531b15492bb6c45e055eb26ff9c6eaadc9e7fb0ad4b256dc794a. It is generated at output/LittleDiscoveries-static.zip and excluded from Git.

Publishing status will be recorded below after live HTTPS verification.

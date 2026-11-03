# Revised collection verification

Generated 2026-11-03T05:48:31.473Z. This report describes collection revision 2. Original collection evidence is retained in [verification-v1](verification-v1/results.json).

## Completed content

The active game has **100 illustrated scenes and 1,391 placements**, with **at most 15 targets in every level**. Original 51–100 are now 1–50; original 1–50 are retired. Fifty new illustrations fill 51–100. Ten retained sixteen-target lists were reduced to fifteen by removing their largest visible target. Their artwork and remaining target IDs are retained.

New ordinary scenes contain 11 challenging and 4 easy targets. Breaks 60, 70, 80, 90, 100 contain 3 challenging and 7 easy targets. Across all 725 new placements, 510 (70.3%) are classified as challenging. Each has a concrete concealment rationale. The source/outline overlay review is recorded for each new scene. These are authored visual assessments, not measured player difficulty; the intended player's feedback remains necessary.

## Checks and evidence

- 20 core tests passed, including original-backup validation, 72→22 migration with thirteen finds, retained favorites/view, one-time migration and fifteen-target trimming/completion.
- 24 browser scenarios passed; 0 unresolved failures; 0 skipped.
- chromium-phone: 100 scenes / 1,391 actual pointer collections; webkit-phone: 100 scenes / 1,391 actual pointer collections.
- Count/quota/cap, unique IDs/art bytes, source dimensions, matching nonempty previews, polygon bounds/topology, hint coverage and inspection bounds checked.
- Collection, repeated taps, offscreen tray targets, hints/reveals/assists, replay, album/postcards/dedication, backups/rejection, reload and old-save recovery checked.
- Chapter downloads, offline navigation, missing-file detection/repair and interrupted resumption checked in Chromium and WebKit. Refreshing an original cached tab preserves its discoveries and reads the versioned catalog.
- Portrait 375×568 and landscape 667×375 keep 44px controls reachable and the bottom object scroller compact and horizontal.

At an aggregate emulated 10 Mbps with 40 ms latency, the picture and every target preview became ready in **chromium-phone: 1809ms; webkit-phone: 1848ms**. The throttled local HTTP proxy counted chromium-phone: 860,229 response payload bytes; webkit-phone: 1,011,079 response payload bytes across the page, Pixi image worker and service worker. This replaces a page-only CDP/resource-entry measurement that omitted worker traffic. Touch-to-counter feedback measured **chromium-phone: 3.3ms; webkit-phone: 4.0ms**. Timing checks use a single worker. These are desktop browser measurements.

Raw reports and latest per-scenario outcomes are in [verification/results.json](verification/results.json). Source art, final prompts, annotations and diagnostic review sheets remain available. Rejected drafts do not count as levels.

The local static hosting ZIP contains 100 scene pictures, 1,391 matching previews and 100 versioned level definitions, plus its application shell. Its size is 84.3 MB. The SHA-256 checksum and verified entry counts are retained in [verification/static-archive.json](verification/static-archive.json).

## Phone and deployment status

The player provided an actual iPhone Safari screenshot of the original collection and rejected its difficulty. This task's revised collection has not been acceptance-tested on that physical iPhone. New artwork readability, real multitouch, Safari toolbar/lock/app interruptions and performance still need review there; see [DEVICE_REVIEW.md](DEVICE_REVIEW.md).

The revised collection is published at [Play Little Discoveries](https://imfoot.github.io/little-discoveries/). Hosted checks are recorded in [verification/deployment.json](verification/deployment.json). Home Screen installation is optional. Existing hosted saves migrate automatically; a backup remains portable between devices/origins.

A separate desktop Chromium check on the live HTTPS site verified a reveal and assisted find in scene 51, saved progress after reload, a complete chapter 6 download, offline reload with the find retained, and opening break scene 60 offline. The hosted screenshot is [hosted-chromium-phone-51.png](verification/hosted-chromium-phone-51.png). This was phone emulation, not a physical iPhone.

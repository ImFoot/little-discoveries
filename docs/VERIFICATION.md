# Layered festival demo verification

Verified 2026-11-05T04:29:08.041Z. Active collection: **56 scenes / 738 placements**, maximum 15 per level. The new level has twelve objects, all created as complete separate assets before its environmental scene.

## Authored layers and geometry

The new festival stall uses a coordinated matte palette and an original composition. Its 36 editable OpenRaster layers comprise a background, twelve objects, twelve contact shadows and eleven foreground masks. Recombining the archive layers reproduces every pixel of the finished static scene. The game previews come from the original full objects; hotspots and exact outlines follow their visible alpha after foreground coverage. Disconnected visible pieces are supported. See [the authoring method](LAYERED_ARTWORK.md), [layer verification](../artwork/lantern-056/review/layer-verification.json), [mask verification](../artwork/lantern-056/review/mask-verification.json) and [phone-size proof](../artwork/lantern-056/review/phone-proof.png). Every target exceeds 98% visible-mask coverage and precision. All twelve references and finished outlines were visually inspected.

A [retained-content comparison](verification-56/retained.json) verifies all 55 earlier catalog entries and 1111 source, annotation, prompt, level, scene, thumbnail and preview files are unchanged from 361c10e. Earlier exhaustive tours remain in their historical verification folders.

## Current tests

- 26/26 core tests passed, including earlier progress and backup preservation and disconnected-region picking priority.
- 26/26 Chromium/WebKit phone-emulation browser cases passed, including all twelve new targets, repeated hints/reveals, duplicate taps, completion, saving/reload, migrations, compact portrait/landscape, recovery and offline repair.
- The complete six-scene sample chapter downloads and all six scenes reopen, collect and reload offline. A cached 55-scene app upgrades through normal reload while retaining progress and compatible offline content.
- 4/4 separate loading/feedback/recovery cases passed at emulated 10Mbps/40ms latency. Metrics: chromium-phone: 1863 ms, 1103443 bytes; chromium-phone: 3.4000000059604645 ms touch feedback; webkit-phone: 2230 ms, 1255826 bytes; webkit-phone: 3 ms touch feedback.

These are desktop browser tests, not physical iPhone tests or intended-player approval of style, clarity or difficulty. See [full evidence](verification-56/results.json).

## Production build

Strict content validation passed 56/738 counts, distinct scene hashes, max 15 targets, all prior context crops, original full-sprite previews, polygon topology/bounds and complete packages for all six chapters. Build version 291120a1391273d8; content version 98f5c5fcde53e329; compatible prior content 982742b92f4967cf. New release URLs bypass cached catalogs; save version 3 and earlier level IDs remain stable. Browser storage pressure can require an offline download retry.

The static hosting ZIP at output/LittleDiscoveries-static.zip contains 56 scene images, 738 previews and 56 runtime definitions. Size 42469959 bytes; SHA256 d8c1b4c3513eb19e486e79a3a88912a260c26a6998004a0ca340065338ea913e. Local run/build instructions remain in README.md. Static hosting requires no authoring tools or Python.

Live deployment verification pending.

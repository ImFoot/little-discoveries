# Implementation and verification

Generated 2026-11-02T08:40:32.160Z.

The local game contains **100 original illustrated scenes and 1,304 authored object placements**, with the exact chapter/level counts in DESIGN.md. Source PNGs, final prompts, manually traced outlines, matching previews and runtime level JSON are retained in this workspace. No placeholder level counts as finished. All ten complete offline packages are in the production build.

The object tray is a compact horizontal strip at the bottom (about 74 CSS pixels in portrait), including landscape. Larger details and the remaining-only filter are in All objects. All scenes are immediately selectable. Help, exact reveals, and assisted finds are unlimited.

## Automated checks

- 15 core tests passed.
- 23 distinct browser cases passed; 0 unresolved failures; 1 intentional skip (Chromium-specific network throttling is not repeated in WebKit).
- chromium-phone: 100 scenes / 1304 real scene-picker collections; webkit-phone: 100 scenes / 1304 real scene-picker collections.
- Exact counts, stable IDs, matching previews, source dimensions, polygon topology, broad hint coverage, inspection bounds, missing assets and duplicate scene bytes checked.
- Pointer/touch event collection, duplicate taps, offscreen tray targets, drag/pinch suppression, help, assisted completion, replay, album/postcards, backup export/import and rejection, reload recovery, and saved viewing position checked.
- Complete chapter download, offline navigation through ten scenes, missing-file detection/repair and interrupted download resumption checked in Chromium and WebKit. Service-worker reload recovery checked independently.
- 375-pixel portrait, a 375 × 568 small-height viewport, and 667 × 375 landscape keep controls reachable and the tray horizontal at the bottom.

Evidence combines the complete browser tour with a final focused run of gameplay, reload/offline recovery, layout and performance checks against the final build. The initial run exposed a test acting before artwork was ready and first-marker graphics initialization exceeding the feedback budget under concurrent load. The test now waits for scene readiness; the renderer prepares its feedback pipeline while loading. The final regression run passed all 13 applicable cases, with one intentional skip. Raw reports retain the earlier failures rather than replacing their history. Performance was measured with one test worker.

A cold scene became playable in **1388 ms** under Chromium's emulated 10 Mbps / 40 ms network conditions. Window resource entries reported **128,351 transfer bytes**; service-worker installation traffic is separate. The complete uncompressed app shell is below 1 MB. Touch-to-counter feedback measured **chromium-phone: 3.2 ms; webkit-phone: 3.0 ms**. These measurements are from this Windows workstation, not a real iPhone.

## Remaining acceptance work

**No actual iPhone has been tested.** All 100 per-scene smallPhone flags remain false. The intended phone still needs normal-brightness artwork/target review, real two-finger pinch/drag, Safari toolbar and app-switch/lock interruptions, storage eviction behavior, and performance measurements. See [DEVICE_REVIEW.md](DEVICE_REVIEW.md). This is the remaining acceptance blocker; browser emulation cannot establish those results.

The game is published on GitHub Pages at [https://imfoot.github.io/little-discoveries/](https://imfoot.github.io/little-discoveries/). Deployment details and hosted checks are recorded in [verification/deployment.json](verification/deployment.json). Opening a normal HTTPS link is sufficient; Home Screen installation is optional.

Detailed evidence, raw reports, screenshots and package versions are in [verification/results.json](verification/results.json) and the neighboring files. Chapter composition contact sheets are in artwork/review/.

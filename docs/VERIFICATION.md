# Component assembly verification — scene 57

Verified 2026-11-05T05:13:10.950Z. The previous method 56 was correctly rejected: it used a finished environmental picture with foreground patches. The new 57 trial starts empty and assembles separate whole components. See [COMPONENT_ASSEMBLY.md](COMPONENT_ASSEMBLY.md).

## Construction proof

The renderer reads 25 independent whole props and 12 full object assets, interleaved in six target groups, over three primitive surface/cord layers. There are 37 separate contact shadows. Source audit finds zero finished-environment inputs and zero manually cut concealment patches. The 77-layer OpenRaster archive recomposes pixel-for-pixel to the finished static render. The complete reference objects are never clipped for the list. Visibility is derived afterward from actual later prop alpha, including container fronts and open lantern ribs.

The [source audit](../artwork/assembly-057/review/verification.json), [visual contact sheet](../artwork/assembly-057/review/objects-and-outlines.png) and [phone-size proof](../artwork/assembly-057/review/phone-proof.png) retain the checks. All visible-region coverage/precision checks exceed 99.9% at the mask sampling resolution. All twelve previews and contours were inspected. These measurements do not establish player approval.

## Game verification

- Strict validation passes 57 distinct scenes / 750 targets, max 15, matching full-asset previews and complete runtime packages.
- All 56 previous catalog entries and 1130 source/content/art files remain identical to 2ca3e77. [Retained-content evidence](verification-57/retained.json).
- 26/26 core tests and 26/26 Chromium/WebKit phone-emulation cases passed, including all 12 new targets, duplicate taps, repeated hints/reveals, completion, saves/reload, import/export, gestures, layout and cached 56→57 update.
- All seven trial scenes download and reopen, collect and reload offline.
- 4/4 separate loading, touch-feedback and recovery cases passed. chromium-phone: 1766 ms / 948090 bytes; chromium-phone: 4.200000002980232 ms feedback; webkit-phone: 1917 ms / 1138311 bytes; webkit-phone: 4 ms feedback.

Full records: [verification-57/results.json](verification-57/results.json). Desktop emulation is separate from physical iPhone testing and intended-player art/difficulty review, which remain pending.

## Build

Static build passed. Shell a2a8e48debea7a75; content c71b4ddac9f46a8d; compatible prior content 98f5c5fcde53e329. Save version 3 and earlier IDs remain stable; matching prior downloads can be reused when browser cache writes succeed.

The HTTPS-hosting ZIP contains 57 scene images, 750 previews and 57 runtime definitions. Size 43213384 bytes; SHA256 94e889929898e8c9d65be64446d82dabfd5f859dd2320197517abb064ccd707d. Local run/build instructions remain in README.md. Python is required only for authoring, not hosting/play.

Live deployment verification pending.

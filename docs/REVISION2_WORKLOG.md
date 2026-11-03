# Revision 2 completion record

The complete revised collection is implemented, prepared and tested. Publication to the existing public GitHub Pages repository follows this verified snapshot; final hosted checks are recorded in verification/deployment.json.

## Delivered content

Original scenes 51–100 are now 1–50. Original 1–50 are retired from play and remain in Git history at ec11629; their complete design and verification are preserved in docs/DESIGN-v1.md, docs/VERIFICATION-v1.md and docs/verification-v1/.

Fifty new distinct original illustrations fill 51–100. Every level has at most fifteen targets. Ten retained sixteen-target scenes drop their largest visible target; the retained half contains 666 placements. New ordinary scenes have 15 targets (11 challenging, 4 easy), while 60, 70, 80, 90 and 100 have 10 (3 challenging, 7 easy). The new half has 725 placements, including 510 challenging targets. Active total: 100 scenes / 1,391 placements.

Every new scene and target received source/context-outline review. Enlarged source crops and affine coordinate mappings repaired clipped wings, feet, tails, handles and instrument parts. Names now describe the actual visible figures. All final polygons/holes are valid and bounded, and all new contextOutlines flags are true. Fifty archived review sheets cover the 725 new targets in artwork/revision2/review/. Final annotation JSON is authoritative; do not rerun the stale annotate/trim scaffolds over reviewed files.

## Implementation and evidence

- Save version 2 validates original saves before mapping retained scene numbers down fifty; stable original target IDs retain discoveries. Removed cap targets are filtered, and retired pictures never credit unrelated replacements. Version-2 storage is separate from the unchanged original key and its pre-revision recovery copy.
- Versioned catalog, level, art and manifest URLs plus app-v2.html keep an old cached collection separate. Reload Safari once to open the revision; automatic reopening of an old tab is best effort.
- Source artwork and level data remain separate from gameplay logic. The production build prepares matching masked previews and strictly validates the complete catalog before bundling.
- Twenty core tests and all twenty-four Chromium/WebKit browser scenarios pass, with no skips. Both engines collected all 1,391 placements through the real picker. Migration, backup validation/recovery, compact portrait/landscape controls, help, replay, complete offline chapters, repair and interrupted downloads passed.
- The final loading test uses an aggregate throttled local HTTP proxy. It includes Pixi image-worker and service-worker traffic omitted by the earlier page-only CDP/resource-entry counter. Both engines meet the 5-second / 5-MB loading budget at 10 Mbps and 40 ms; touch feedback meets 100 ms. See VERIFICATION.md for exact desktop measurements.
- All ten offline chapter packages are complete. The 84.3 MB local static ZIP contains 100 scene images, 1,391 previews and 100 runtime level definitions; its checksum and entry counts are in verification/static-archive.json.

## Reproduction

Ordinary builds use the already integrated canonical source; they do not rerun catalog integration.

    npm ci
    npm test
    npm run build
    npx playwright test content.spec.ts game.spec.ts --workers=2 --trace=off
    npx playwright test performance.spec.ts --workers=1 --trace=off

For a future collection integration, scripts/integrate-revision2.mjs reads the original Git revision and requires all fifty replacement annotations to be complete. Its --partial option is development-only and must never be published. After intentional source or geometry corrections, rebuild previews, regenerate the corresponding archived context sheet, validate, and run the relevant picker checks. scripts/review-target-roi.mjs provides enlarged crops with precise coordinate mappings.

Windows intermittently rejected direct overwrites of watched files with UNKNOWN errors. scripts/artifact-io.mjs uses atomic replacement with bounded retries for generated text and evidence.

## Artwork provenance and remaining acceptance

Artwork used the built-in image-generation tool. The previous 085 worker lost its original base-generation prompt; the prompt record documents that loss and retains the exact final edit prompt. No invented reconstruction is presented as an original.

The intended player supplied real iPhone Safari feedback on the original collection. The new collection has been tested in desktop Chromium/WebKit emulation, not on her physical iPhone. New difficulty/readability, real multitouch, toolbar and app interruptions, device performance and Safari cache eviction still need device/player acceptance. All new smallPhone flags remain false. There are no implementation or deployment prerequisites waiting for user approval.

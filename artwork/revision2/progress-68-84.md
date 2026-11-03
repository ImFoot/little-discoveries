# Interiors production: levels 68–84

All 17 original finished scene PNGs, prompt records, annotations and the batch manifest are present. Built-in image generation produced the artwork; 68, 79 and 84 received additional concealment edits. Rejected drafts remain explicitly named `*-draft.png` and are not finished scenes.

The latest user cap is applied throughout: regular levels have 15 targets (11 challenging, 4 easy), and breaks 70 and 80 have 10 (3 challenging, 7 easy). This batch contains 245 placements: 171 challenging and 74 easy. Extra illustrated props are non-target distractors.

Every target was inspected in the finished artwork and in a source-plus-contour context sheet generated with `scripts/review-targets.mjs`. Substantial corrections include complete bird heads/feet/tails, scissors loops and blades, fish fins, the painted lizard, full ceramic handles, key bows, spectacle frames, cloth instead of an incorrectly named glove, and the correctly located dragonfly in 84. Negative-space holes were traced where needed. All 17 annotation files have `review.contextOutlines: true`.

The final validation passed for all 17 files: 1024×1536 dimensions, unique source hashes, exact counts and difficulty quotas, unique target IDs/names, image bounds, valid Shapely polygons/holes, nonempty saved prompts, and manifest counts. Temporary diagnostic sheets are in `.cache/target-review/068.png` through `084.png`. `.cache/coordinate-review/` holds enlarged source-coordinate crops used for contour repair.

The challenge labels are authored estimates based on pattern/material camouflage, partial overlap, orientation and context. Some are moderate challenges. No claim of physical iPhone or objective player difficulty calibration is made; `review.smallPhone` remains false. Root owns runtime preview generation, integration, touch/performance checks and deployment. This artwork worker did not modify live app content, run content preparation, commit or push.

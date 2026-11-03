# Workshop artwork batch: levels 51–67

Completed 2026-11-02. The canonical files are `source/051.png`–`source/067.png`, `annotations/051.json`–`annotations/067.json`, and `batch-51-67.json`. Original generation briefs are retained under `prompts/`; 67 also retains its edit brief and the rejected sparse draft.

All 17 scenes are distinct original 1024 × 1536 illustrations. There are 250 authored targets: 179 challenging and 71 easy. Regular levels have 15 targets (11 challenging, four easy); level 60 is the ten-target breather (three challenging, seven easy). Extra pictured props remain non-target distractors.

Each target was inspected in the source image and in a context crop with its reveal outline drawn over the artwork. Enlarged source-coordinate grids were used to correct clipped features and misplaced outlines. All 17 annotation reviews have `artwork`, `geometry`, and `contextOutlines` true. The final validation confirmed target counts, difficulty quotas, unique names/IDs per scene, unique source-image digests, source dimensions, prompt presence, manifest chapter/count/breather values, and valid positive-area Shapely polygons with image bounds respected.

The JSON annotations are authoritative. The `annotate-*.py` scripts were early drafts; many were followed by corrections directly to the JSON. Do not rerun draft authoring scripts over final annotations. QA PNGs, coordinate crops and rejected drafts are diagnostics, not additional finished scenes. Runtime conversion should select the exact three-digit source and annotation names.

`smallPhone` remains false throughout: no physical iPhone testing was performed by this artwork worker. Difficulty is an authored visual assessment based on pattern integration, material/color matching, overlap and placement, pending actual phone playtesting. Root integration still creates the pixel-matched previews, forgiving hit areas, broad hint regions and production assets.

Target identities that did not resolve clearly under close inspection were replaced with actual discrete details, including the uncertain binding-tool pattern in 53, guessed foreground artifact in 59, glove motif in 64 and box animal in 67. The final 67 uses the denser edited cedar gallery; its sparse original is retained as `source/067-draft.png`.

## Additional garden QA

This worker also completed final context-outline audits for 95–98. Each remains 15 targets, 11 challenging and four easy, with valid positive-area Shapely polygons and all source bounds respected. All four now have `contextOutlines: true`; regenerated review sheets are `.cache/target-review/095.png`–`098.png`. Affine crop metadata is retained under `.cache/gardens-roi`.

Important identity repairs: 95's terrace lizard was a frog, its supposed cat was a bronze fox and its medallion was a pocket watch; 96's fern block depicts a flower stem; 98's supposed key was replaced by the actual engraved bell (`hanging-bell`). Its floral target is the discrete pearl flower ornament, with unrelated stems excluded. Moth wing extents, both luna tails, bird feet/tails, the otter tail, tortoise feet, crab claws, insect wings, lantern finials, complete printing blocks and the paper stack were corrected. Level 99 was returned to the gardens worker untouched.

As above, final annotation JSON is authoritative. Some final corrections followed the `fix-095-context.py`–`fix-098-context.py` helper drafts, so do not rerun those helpers over the JSON.

## Final opening sweep

After root's independent review of 51, its watch stem/bow, cup handle and oilcan body/handle were retraced from enlarged affine ROIs. The same sweep corrected visible handle/open-bow masks in 53, 54, 57, 58, 60, 61, 62 and 63, including scissors grips and the pierced flower key. Existing 55, 56, 60, 65, 66 and 67 handle/hoop holes were retained. Actual glass lenses remain part of magnifier masks. All updated overlays were inspected; the combined diagnostic is `.cache/target-review/workshop-openings.png`. Final validation passed for 21 stable scene annotations and 310 target contours, with counts and difficulty quotas unchanged.

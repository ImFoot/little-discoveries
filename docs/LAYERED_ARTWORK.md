> Historical prototype. The player correctly rejected this approach: it still used a finished environmental painting and cut-out foreground patches. It did not fulfill the requested construction method. The corrected implementation is documented in [COMPONENT_ASSEMBLY.md](COMPONENT_ASSEMBLY.md).

# Layered festival scene — level 56

The requested method is implemented in The lantern-maker’s festival stall. Its setting, twelve-object atlas and matte palette are new. The earlier workroom direction was rejected for its mismatched colors/style and contributes no assets to the finished scene.

## Sources and construction

`artwork/lantern-056/assets/objects-atlas.png` contains the twelve complete objects generated first. The separate object PNGs preserve the full silhouettes and handle openings. Alpha cleanup removes isolated background noise from each atlas cell; it does not extract targets from an environmental picture. `prompts/objects.txt` and `prompts/background.txt` retain the exact built-in image-generation briefs.

The environmental painting uses the same restrained ivory, coral, indigo, turquoise and bamboo palette. `layout.json` records each object’s position, scale and rotation and eleven independently editable foreground masks. The compositor builds a background, twelve contact shadows, twelve object layers and eleven foreground layers. Paper folds, a hanging strip, a lantern frame and hamper paper cover parts of the placed objects.

The finished static picture is `build/056.png`; the editable 36-layer OpenRaster file is `build/lantern-stall.ora`. The runtime scene uses a compressed copy of that flattened image. Original full sprites supply the list previews. Changing a foreground mask therefore changes concealment without damaging the reference object.

## Hotspots and exact reveals

For each target, the compositor transforms its alpha into scene coordinates and subtracts foreground coverage. It traces all meaningful visible components and openings from that visibility mask. Objects split by foreground paper retain multiple visible regions; picking and exact reveals support every region. Generous touch padding remains part of normal gameplay.

`review/mask-verification.json` measures the polygon regions against the visible raster masks. Every target exceeds 98% coverage and 98% precision at source-pixel resolution; the remaining differences are antialiasing and subpixel contour simplification. This measures geometry, not player enjoyment or clarity. All twelve complete previews and visible contours were also inspected enlarged and at the actual 32-pixel tray-preview size.

## Rebuild and review

Authoring requires Python with Pillow, numpy and opencv-python-headless. Browser play and static hosting have no Python dependency.

```powershell
python -X utf8 scripts/prepare-lantern-assets.py
python -X utf8 scripts/compose-lantern.py
python -X utf8 scripts/verify-lantern-masks.py
```

The generated build annotation starts with review flags false. After reviewing a changed composition, synchronize its targets and source picture with the authoritative `artwork/annotations/056.json`, `artwork/source/056.png` and `artwork/lantern-056/056.json`; record review flags and notes honestly. Then run content preparation, strict validation, core tests and the relevant browser tests.

`node scripts/review-level.mjs 56` creates `output/level-review-056.html`, showing the real tray, full previews, finished-scene crops and reveal geometry. The standalone `output/lantern-layer-review.html` offers progressive object layers and a foreground toggle. The `.ora` file is the persistent editable deliverable; diagnostic screenshots remain in `artwork/lantern-056/review`.

## Verification limits

The level contains twelve targets. Earlier levels and their stable IDs remain byte-identical. Tests exercise every new object through the real picker, help, duplicate collection, saving/reload, cache upgrades, offline chapter downloads, compact layouts, recovery and performance. Chromium/WebKit phone emulation does not establish physical iPhone behavior or intended-player approval of the new art direction.

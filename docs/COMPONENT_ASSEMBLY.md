# Corrected component assembly — scene 57

Scene 56 failed the requested method. It began with a completed environmental painting and placed target sprites over it, then restored cut patches of that painting. Calling that a constructed scene was inaccurate. Its sources remain historical; this trial uses a different renderer and input set.

## Actual inputs

Scene 57 starts with an empty transparent canvas. Three code-drawn layers provide a plain wall plane, a paving plane and hanging cords. They contain no finished setting. Twenty-five independently placed whole environmental props then build the stall: frame, bench, rack, container components, lanterns, rolls, paper, cloth and other supplies. The twelve independently created full target assets are retained from the original object set, rather than extracted from any finished scene.

The component sheets and exact prompts are in `artwork/assembly-057/assets` and `prompts`. `components.json` names the complete transparent assets split from those sheets. These are individual props or structural parts. No finished environmental image or hand-cut foreground patch is imported by the compositor.

## Construction order

`scene.json` is the ordered scene graph. Targets occur in six groups interleaved with physical props:

1. The rack is placed, then scissors and peg, then hanging materials.
2. The moon is placed before the larger hanging lantern.
3. The box back is placed, then the ink bottle; the front wall is placed afterward. The candle goes before the open lantern ribs.
4. The stamp, key, ruler and brush are placed before covering paper, coils and nearby props.
5. A hamper back is placed, then its contents, rolls and separate front wall.
6. The other hamper is built the same way around the spool and twine.

Every prop is drawn at its full alpha footprint with scale/rotation only. There is no target-cutting operation or manually specified concealment polygon. Visibility is calculated **after** drawing the scene, from the alpha of real later props. Moving or removing a front prop exposes the intact target behind it.

## Sources and inspection

```powershell
python -X utf8 scripts/prepare-assembly-assets.py
python -X utf8 scripts/compose-assembly.py
python -X utf8 scripts/verify-assembly.py
node scripts/review-assembly-layers.mjs
```

Python requires Pillow, numpy and OpenCV. Browser play and static hosting do not. The generated build annotation starts unreviewed; after visual review, synchronize it with the authoritative `artwork/annotations/057.json`, `artwork/assembly-057/057.json` and `artwork/source/057.png`, then prepare and validate game content.

The standalone `output/assembly-057-review.html` starts at zero layers and allows stepping through the complete construction. It also removes the three container fronts independently. It embeds original source assets and shows each input path. The persistent editable archive is `artwork/assembly-057/build/assembled-stall.ora`; its 77 layers include 37 contact shadows. The archive is pixel-identical to the final static render.

`review/verification.json` checks interleaving, the absence of finished-environment/cut-patch inputs, full layer reconstruction and the visible-region geometry. Subpixel contours closely match the actual visible alpha, including disconnected pieces and holes. All twelve full previews and source-coordinate outlines were inspected; `review/objects-and-outlines.png` and `review/phone-proof.png` retain the visual proof.

The game uses `public/art/v3/057.webp` and visible-region hotspots. Previews show complete source objects. Intended-player judgment of art, clarity and difficulty remains separate from software and geometry checks. Physical iPhone testing remains pending.

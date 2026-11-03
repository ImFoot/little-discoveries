# Artwork-first level production

Scene 54, The village flower shop, is a controlled change in the production method. The earlier prompts asked for twelve target props in assigned locations, which encouraged conspicuous displays. This scene was generated as a working flower shop first. Twelve recognizable objects were selected from its finished contents afterward.

## Repeatable process

1. Brief a believable activity and composition with intersecting surfaces and depth. Avoid an empty central aisle and a ring of isolated props. Ask for clear ordinary objects, coherent materials and moderate natural overlap, without assigning twelve target locations.
2. Inspect the whole finished illustration. Select actual well-formed objects across the scene. Reject a malformed detail rather than invent a name for it. Include a few straightforward finds; increase searching through shelves, pockets, baskets and neighboring materials.
3. Preserve an unchanged crop of each actual object for the list. Keep all visible parts, color, orientation and occlusion. Use a short name that fits two tray lines. Do not remove background with a rough color mask or generate a different reference icon.
4. Trace visible hit/reveal contours independently, including meaningful openings. Review each source crop with its contour enlarged. Geometric validity is necessary but does not prove a contour follows the object.
5. Run `node scripts/review-level.mjs 54` (replace the number for another level). Open `output/level-review-054.html`. This standalone page embeds the scene, actual previews, source crops and current game stylesheet. The 375 CSS-pixel iframe uses the real tray: currently 72.75 × 61 pixel cards with 32 pixel images. Check every target both there and enlarged; use the outline, broad-hint and position toggles. Notes are browser-local and can be exported as JSON.
6. Prepare and validate content, then test the real picker, help, saving and offline package. Preserve source PNG, exact prompt, final annotation and visual proof. Let the intended player assess clarity and difficulty on the real phone before scaling production.

## Fourth sample review

The built-in image-generation tool produced one new scene; no API fallback, recolor or mirrored picture was used. The exact prompt and source are in `artwork/sample-054`. Twelve hand-traced objects include small shelf tins, a teacup among tea things, wrapping paper behind wicker, and shears partly inside an apron pocket. Larger clear targets provide some easier finds. Source/outline overlays and the actual-size proof are retained in `artwork/sample-054/review`.

All twelve names, full visible crops and contours were inspected. The watering-can spout contour initially crossed itself; its perimeter and interior opening were corrected and rechecked. The automated validator also compares every context preview with its exact source crop. No masked cutouts are used in the four sample levels.

The smallest object, the blue lidded tin, is deliberately recessed and partly covered by ribbon. Its lid and patterned cylinder remain visible in the unchanged preview, which can be enlarged in the game. Its comfort on a real iPhone still needs player feedback. The proof does not certify physical-device touch behavior or subjective difficulty.

## Further control

Layered authoring could eventually combine a background, consistent object sprites and foreground occluders, then flatten them into the existing scene format. This would allow deliberate repositioning without a renderer rewrite, but perspective, lighting, contact shadows and occlusion must match. That workflow has not been implemented or validated here. The scene-first process and actual-size proof are the concrete improvements used for this level.

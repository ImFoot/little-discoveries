# Revised search difficulty

The player's iPhone feedback rejected the original collection as too easy. The original art briefs explicitly asked for large, mostly unobstructed targets on clear surfaces. The replacement collection changes the artwork and authored placements.

## Collection revision 2

- Original scenes 1–50 are retired from the playable catalog. Their source and game data remain in Git history at `ec11629`.
- Original scenes 51–100 become scenes 1–50, with their artwork retained. Ten former sixteen-target scenes drop their largest visible target to meet the fifteen-target cap.
- Fifty original new compositions fill scenes 51–100.
- New ordinary scenes contain fifteen targets: eleven deliberately concealed (73.3%) and four easy anchors. Scenes 60, 70, 80, 90 and 100 are ten-target breaks with three concealed targets (30%) and seven easy anchors (70%). Every retained scene is capped at fifteen targets too.
- The retained half has 666 placements after the cap; the new half has 725. The revised catalog has **1,391 placements**. This replaces the original 1,304-placement plan in response to the requested content change.

The requested ratio applies to the fifty new scenes. The retained fifty are preserved as the opening half. Across the new half, including the breaks, there are 510 challenging and 215 easy targets (70.3% challenging).

## What qualifies as challenging

A challenging target must remain identifiable after a reveal, with a defining feature and enough visible shape. It should use at least two visual concealment factors where practicable:

- Similar surrounding materials and texture, such as a small animal relief among carved leaves.
- An outline that follows nearby forms, such as a key among wrought-iron curls.
- Partial overlap by a credible foreground element, while keeping about 60–75% of the defining silhouette visible.
- An unusual orientation or a placement within a dense, plausible arrangement.

A clear foreground prop with only a shared color is a weak candidate. Tiny size, transparency, an inaccurate preview, invisible hit areas, and unreliable taps do not provide acceptable difficulty. Ordinary easy targets have clear outlines or contrast and offer a few quick discoveries. Break scenes intentionally use more of these.

Generate and inspect the environment first, then choose actual details in the finished picture. Prompts naming twenty separate props repeatedly produced a display of conspicuous objects, so that approach was rejected. Every new target has `difficulty` and a concrete `concealment` rationale in its annotation and runtime JSON. The asset pipeline extracts its preview from the actual source pixels and its exact outline covers its visible shape.

## Review and validation

The quota validator establishes the authored counts and presence of review notes. It does not prove how hard a player will find a picture. Visual review must inspect the actual target in context and reject weak candidates; player search time and satisfaction require playtesting. New source images, prompts, annotations, rejected drafts and worker progress are under `artwork/revision2/` during production. Accepted artwork is integrated into the normal `artwork/` and `public/` paths before publishing.

Unlimited help, assisted finds, generous touch handling, zoom, saving and offline chapters still apply. New production does not count as finished until every scene and target is inspected, prepared, validated and playable through the real picker.

## Saved progress

Save version 2 reads original saves automatically but writes to a separate version-2 key. An original cached copy of the game therefore cannot overwrite revised progress. It validates a version-1 save against the original catalog before remapping it. Discoveries, completion, favorites, viewing positions and unfinished attempts follow retained pictures by subtracting fifty from their old scene numbers. Retained target identifiers remain stable; any removed cap target is filtered out. If all remaining targets were already found, the migrated attempt is complete. Old level 72 with thirteen finds becomes new level 22 with the same thirteen finds.

Retired progress is never applied to an unrelated new picture. The original local save is retained as `little-discoveries.save.v1.before-revision2`, and original portable backups can still be imported and migrated. Migration is idempotent: a version-2 save is never renumbered again. Versioned content URLs prevent old caches from returning a differently numbered picture. Reload Safari once after publication to open the revised collection; automatic reopening of an old tab is best effort where supported.

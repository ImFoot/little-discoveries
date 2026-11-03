# Little Discoveries

A personal untimed hidden-object game in TypeScript, Vite, PixiJS and HTML/CSS. No accounts, ads, purchases, lives, timers or paid help.

**[Play in iPhone Safari](https://imfoot.github.io/little-discoveries/)** · [Public source](https://github.com/ImFoot/little-discoveries)

The active collection is **50 retained original pictures plus four samples**: 54 scenes, 714 targets, maximum 15 per scene. The player rejected all fifty revision-2 replacements; they are removed from play and production assets. Sample scenes 51–54 have 12 targets each. The latest sample, The village flower shop (54), adds a fuller working environment and targets naturally tucked among related belongings. Player acceptance is pending; no further replacement batch is planned before feedback.

## Run locally

Install Node.js 24. In PowerShell, from C:\Users\tensi\hidden_objects:

~~~powershell
npm ci
npm run dev
~~~

Open the printed local URL. The server binds only to 127.0.0.1; no Windows firewall change is needed. For the production build and service-worker/offline testing:

~~~powershell
npm run build
npm run preview
~~~

Open http://127.0.0.1:4173. Upload the contents of dist/ to a static HTTPS host, preserving paths. Relative assets/hash navigation support a domain root or subdirectory. There are no server functions, runtime generation, secrets or API keys. iPhone Safari works through the ordinary HTTPS link; Home Screen installation is optional. file:// is unsupported.

GitHub Actions on main runs core tests and strict build/content validation before publishing. The generated local ZIP at output/LittleDiscoveries-static.zip is excluded from Git and must be recreated after a build. Its root contains index.html. Serve index.html and sw.js with revalidation and use correct MIME types; do not replace missing image/JSON files with HTML.

## Content and previews

[DESIGN.md](DESIGN.md) defines the current collection and game rules. Historical designs remain at docs/DESIGN-v1.md and docs/DESIGN-v2-rejected.md. The rejected pictures remain recoverable in Git history, not in current production assets.

- public/content/catalog.json: current scene names/counts/stable IDs, mirrored into content/v3 for runtime.
- public/content/levels/NNN.json: canonical targets, exact outlines, hit regions, broad hints, preview crops and inspection views; mirrored to content/v3/levels.
- public/art/v3: compressed scenes, thumbnails and target previews.
- artwork/source, artwork/annotations, artwork/prompts: authoritative active source assets.
- artwork/sample-054: scene-first source, prompt, manually traced targets and individual outline proofs for the fourth sample.
- artwork/samples-v3: first three sample originals, exact built-in image-generation prompts/edits, final annotations and diagnostic review sheets.

Samples use tight **unmasked source crops** as previews. Their full visible object, color, orientation and partial overlap stay intact. Reveal/hit contours are authored separately and do not cut the preview. The original fifty previews remain unchanged. The four sample sources were made with the built-in image-generation tool, not the CLI/API fallback. Sources and every target are visually inspected; subjective difficulty still needs player feedback. The new reusable proof tool creates output/level-review-054.html, a standalone 375 CSS-pixel scene with actual tray cards, enlarged source crops, outline/hint toggles and per-target review notes. See docs/ARTWORK_WORKFLOW.md.

~~~powershell
npm run content:prepare
node scripts/review-level.mjs 54
npm run content:validate
npm run build
~~~

Do not rerun original scaffold or revision-2 generators over the active catalog. Edit authoritative annotations in artwork/annotations, keep the corresponding source package in sync, then prepare, strict validation and tests. scripts/integrate-samples-v3.mjs is a guarded historical migration and must not overwrite the appended collection. Canonical final annotations are authoritative; earlier draft tracing scripts must not overwrite them.

## Gameplay, saves and downloads

All scenes are immediately selectable. The compact horizontal bottom tray remains about 74 CSS pixels tall. Tap a card for a larger preview; All objects opens the full list. Unlimited hints, exact reveals, assisted finds, pinch/drag, zoom buttons and Fit picture remain. Larger previews/text, reduced motion, sound and found markers are optional.

Save version 3 preserves retained picture progress from version 2 and keeps the full original raw save under little-discoveries.save.v2.before-samples3. Rejected finds never credit the new sample pictures. Original version-1 saves still migrate old 51–100 to 1–50. A separate new storage key protects against older open tabs. Export/import accept old and new validated backups. Invalid backups leave progress unchanged. Each find writes immediately with a recovery copy; replay preserves permanent completion.

Settings → Back up progress exports portable JSON; Restore progress reviews a valid file before replacement. Browser/device/origin storage is local, with no cloud sync. Export before moving from localhost to the public site or to another device.

Offline downloads include each chapter's actual scene count: five chapters of ten pictures and one complete set of four samples. All images, previews, definitions and shell files are checked before Available offline appears. Interrupted downloads resume; missing assets can be repaired without clearing discoveries. Visited scenes cache opportunistically. Reload Safari after publication. Release-specific catalog-54.json, offline-manifest-v3-54.json and app-v3-54.html bypass the prior cached catalog while keeping save version 3. Exactly matching prior 1–53 offline content is reused when cache writes succeed; download chapter 6 again to add 54. Browser cache retention is not guaranteed.

## Checks and limits

~~~powershell
npm test
npm run build
npx playwright test --workers=2 --trace=off
~~~

For uncontended loading measurements, run performance.spec.ts separately with --workers=1. Browser dependencies can be installed with npx playwright install chromium webkit. The previous release toured all 702 placements in desktop Chromium and WebKit emulation. This append adds a targeted tour of all twelve new placements, preserves the prior content byte-for-byte, and tests installed-worker upgrades, existing saves and the four-sample offline chapter. Other checks cover migration, retained level 24, sample identity, compact layouts, hints, backups, replay, reload and offline repair. The validator checks 54 scenes / 714 targets, max 15, all 48 sample crops against exact source pixels and contour/crop bounds.

**Physical iPhone and intended-player review remain pending.** Emulation cannot approve actual touch comfort or whether objects are now sufficiently clear and enjoyably concealed. See docs/VERIFICATION.md and docs/DEVICE_REVIEW.md.

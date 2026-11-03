# Little Discoveries

A personal untimed hidden-object game in TypeScript, Vite, PixiJS and HTML/CSS. No accounts, ads, purchases, lives, timers or paid help.

**[Play in iPhone Safari](https://imfoot.github.io/little-discoveries/)** · [Public source](https://github.com/ImFoot/little-discoveries)

The active collection is **50 retained original pictures plus three samples**: 53 scenes, 702 targets, maximum 15 per scene. The player rejected all fifty revision-2 replacements; they are removed from play and production assets. Sample scenes 51–53 have 12 targets each and aim for a modest step beyond current level 24, The floating garden. Player acceptance is pending; no further replacement batch is planned before feedback.

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
- artwork/samples-v3: three sample originals, exact built-in image-generation prompts/edits, final annotations and diagnostic review sheets.

Samples use tight **unmasked source crops** as previews. Their full visible object, color, orientation and partial overlap stay intact. Reveal/hit contours are authored separately and do not cut the preview. The original fifty previews remain unchanged. The three sources were made with the built-in image-generation tool, not the CLI/API fallback. Sources and every target are visually inspected; subjective difficulty still needs player feedback.

~~~powershell
npm run content:prepare
node scripts/review-samples.mjs
npm run content:validate
npm run build
~~~

Do not rerun original scaffold or revision-2 generators over the active catalog. To re-integrate approved sample edits, use scripts/integrate-samples-v3.mjs, then prepare, prune-art, strict validation and tests. Canonical final annotations are authoritative; earlier draft tracing scripts must not overwrite them.

## Gameplay, saves and downloads

All scenes are immediately selectable. The compact horizontal bottom tray remains about 74 CSS pixels tall. Tap a card for a larger preview; All objects opens the full list. Unlimited hints, exact reveals, assisted finds, pinch/drag, zoom buttons and Fit picture remain. Larger previews/text, reduced motion, sound and found markers are optional.

Save version 3 preserves retained picture progress from version 2 and keeps the full original raw save under little-discoveries.save.v2.before-samples3. Rejected finds never credit the new sample pictures. Original version-1 saves still migrate old 51–100 to 1–50. A separate new storage key protects against older open tabs. Export/import accept old and new validated backups. Invalid backups leave progress unchanged. Each find writes immediately with a recovery copy; replay preserves permanent completion.

Settings → Back up progress exports portable JSON; Restore progress reviews a valid file before replacement. Browser/device/origin storage is local, with no cloud sync. Export before moving from localhost to the public site or to another device.

Offline downloads include each chapter's actual scene count: five chapters of ten pictures and one complete set of three samples. All images, previews, definitions and shell files are checked before Available offline appears. Interrupted downloads resume; missing assets can be repaired without clearing discoveries. Visited scenes cache opportunistically. Reload Safari after publication; download desired chapters again because earlier game caches are retired. Browser cache retention is not guaranteed.

## Checks and limits

~~~powershell
npm test
npm run build
npx playwright test --workers=2 --trace=off
~~~

For uncontended loading measurements, run performance.spec.ts separately with --workers=1. Browser dependencies can be installed with npx playwright install chromium webkit. The exhaustive tour exercises every active placement through the real picker in desktop Chromium and WebKit phone emulation. Other checks cover migration, retained level 24, sample identity, compact layouts, hints, backups, replay, reload and offline repair. The validator checks 53 scenes / 702 targets, max 15, all 36 sample crops against exact source pixels and contour/crop bounds.

**Physical iPhone and intended-player review remain pending.** Emulation cannot approve actual touch comfort or whether objects are now sufficiently clear and enjoyably concealed. See docs/VERIFICATION.md and docs/DEVICE_REVIEW.md.

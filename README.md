# Little Discoveries

A personal, untimed hidden-object game built with TypeScript, Vite, PixiJS 8, and HTML/CSS. No accounts, ads, purchases, lives, timers, or paid help. The complete design and all 100 required target counts remain in [DESIGN.md](DESIGN.md).

Source repository: [ImFoot/little-discoveries](https://github.com/ImFoot/little-discoveries). GitHub Pages publishing is configured in `.github/workflows/pages.yml`; pushes to `main` publish after tests, content validation and the build pass. See [hosting and save migration](docs/HOSTING.md).

## Run locally

Install Node.js 22.12 or newer, then in PowerShell:

```powershell
cd C:\Users\tensi\hidden_objects
npm ci
npm run dev
```

Open the printed local URL. First launch opens scene 1 with a dismissible explanation. All scenes can be selected from the catalog. The game uses hash navigation, so static hosting needs no route rewrites.

## Production build and offline testing

```powershell
npm run build
npm run preview
```

Open `http://localhost:4173`. Service workers and chapter downloads run in the production build. Development mode intentionally leaves the service worker disabled so edits are not hidden behind a cached build.

Upload the **contents of `dist/`** to any ordinary static HTTPS host, preserving all directories and filenames. The build supports a domain root or a subdirectory. No server functions, database, API keys, runtime image generation, or account service are required. `file://` is not supported. Use HTTPS for an actual phone; an ordinary HTTP LAN URL can show gameplay but cannot provide service-worker offline downloads on iPhone Safari. Home Screen installation is optional.

The current production snapshot is also packaged in [output/LittleDiscoveries-static.zip](output/LittleDiscoveries-static.zip), with a neighboring SHA-256 checksum. Its root contains `index.html`, so extract it directly into the host's public directory. Recreate this archive after changing and rebuilding the game; rebuilding `dist/` does not update the ZIP automatically.

For hosting, serve `sw.js` and `index.html` with revalidation (`Cache-Control: no-cache`) and JavaScript with the correct MIME type. The service worker and its assets use the current directory as their scope. Do not let the host replace missing image/JSON requests with an HTML fallback.

## Checks

```powershell
npm test
npm run content:validate
npx playwright install chromium webkit
npm run test:browser
```

The exhaustive tour clicks all 1,304 targets in both engines and can take several minutes. To avoid recording every step, use `npm run test:browser -- --trace=off`. The default single worker keeps timing measurements free of competing browser workloads. The collection tour alone can run with `npx playwright test content.spec.ts --workers=2 --trace=off`. Individual collection assertions retain short deadlines.

`npm run build` performs strict TypeScript checking and creates `dist/offline-manifest.json` and `dist/sw.js`. `node scripts/validate-content.mjs --complete` additionally fails if fewer than 100 illustrated levels / 1,304 authored placements have been produced. Regular validation reports unfinished content explicitly.

Playwright tests use desktop Chromium and desktop WebKit with phone emulation, including a 375-pixel viewport and landscape. This is **not testing on a real iPhone**. Physical iPhone review, Safari storage eviction, device brightness/readability, browser-toolbar changes, thermal behavior, and real multitouch still require the intended phone. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for results and [docs/DEVICE_REVIEW.md](docs/DEVICE_REVIEW.md) for remaining checks.

## Content and artwork

Scene illustrations were produced with the built-in imagegen tool, then visually inspected and annotated. The CLI/API fallback was not used. Original sources, final prompt briefs, corrections, and review records are kept under `artwork/`.

- `public/content/catalog.json`: all ten chapters, 100 names, required counts, stable target IDs, and production status.
- `public/content/levels/NNN.json`: runtime data, exact polygons, hit regions, broad hints, crops, useful inspection views, and review records.
- `public/art/NNN.webp`: compressed scene, `NNN-thumb.webp`: catalog image, `NNN/*.webp`: matching target previews.
- `artwork/source/NNN.png`: original generated illustration retained at source resolution.
- `artwork/annotations/NNN.json`: human/model visually reviewed, manually traced source-pixel silhouettes; never random placements.
- `artwork/prompts/NNN.txt`: final art prompts and corrections where relevant.

The game never generates or changes placements at runtime. Target previews are masked directly from the final illustration, retaining shape, color, and orientation. Found targets remain in the original art. To prepare changed source art or annotations:

```powershell
npm run content:prepare
npm run content:validate
npm run build
```

Do not rerun `scripts/init-catalog.mjs` over an integrated catalog; it is the original scaffold generator. Do not overwrite revised annotations with the representative authoring script.

On iPhone the object tray is one compact horizontal strip at the bottom, about 74 CSS pixels tall by default, with the picture controls directly above it. The grid button opens **All objects**, enlarged details, and the remaining-only filter. Optional larger previews increase the tray height. The landscape layout keeps the same horizontal strip.

## Saving and backups

Each find writes immediately to local storage and a validated recovery copy. Viewing changes are debounced briefly and flushed on page hide. Unfinished attempts remain independent. Replay resets only the current attempt and preserves permanent completion, favorites, and album postcards.

Settings → **Back up progress** downloads portable JSON. **Restore progress** validates the complete file first and shows a review panel before replacing progress. Invalid files leave the current save untouched. Backups contain progress/settings, not artwork. There is no cloud synchronization. Browser storage can be cleared or evicted, so keep a backup in Files or another safe location.

When moving from the local preview to a hosted website, export first and restore on the new link. Different website origins keep separate browser storage.

Settings or a chapter heading → **Keep this chapter offline** saves the shell, level data, scene illustrations, thumbnails, and every target preview. Interrupted downloads reuse verified cached files. A chapter is marked available only after all ten level packages and the shell exist in Cache Storage. Missing scenes provide a retry path without clearing progress. A visited scene is also cached opportunistically; chapter downloads provide the explicit completeness check.

The content cache is versioned by its asset bytes, so software-only updates can retain artwork downloads. Changed artwork/data create a new content version; download chapters again after a content update. Browser cache retention is ultimately controlled by the browser.

## Project structure

`src/scene.ts` owns Pixi rendering, view transforms, gesture recognition and reveal graphics. `src/geometry.ts` implements fair single-object picking. `src/save.ts` owns versioned progress and backup validation. `src/offline.ts` checks and downloads complete chapter packages. `src/main.ts` contains the HTML menus, tray, album, settings, and gameplay coordination. `scripts/` contains the asset pipeline, content validation, and build-time offline manifest generator.

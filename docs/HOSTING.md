# Public hosting

[Repository](https://github.com/ImFoot/little-discoveries) and [game](https://imfoot.github.io/little-discoveries/) are public. An ordinary iPhone Safari HTTPS link works; installation is optional.

The GitHub Actions workflow in .github/workflows/pages.yml uses Node 24, locked dependencies, core tests, content preparation, strict validation and a Vite build before publishing dist/. Main publishes; pull requests build only. No personal token or API key is stored in the game. Source PNGs are kept in the repository but only compressed runtime assets deploy.

The current release replaces the rejected fifty new levels with five samples: 55 scenes, 726 targets, maximum 15. Revision 3 uses content/v3, art/v3, catalog-55.json, offline-manifest-v3-55.json and app-v3-55.html to avoid older cached pictures. A normal Safari reload is the supported update path. The release-specific catalog avoids the old worker serving a stale 54-scene catalog. Exactly matching cached scenes 1–54 are carried forward when cache writes succeed; incompatible game caches are removed. Download chapter 6 again to add 55. Five packages have ten scenes; the sample package has five.

Save version 3 preserves only retained 1–50 discoveries from version 2, keeping the complete raw old save separately. Reused sample numbers receive no rejected progress. Version-1 backups remain importable. The separate v3 storage key prevents older tabs from replacing current discoveries. Saves remain device/browser/origin local; export before changing origins or devices.

Run npm ci and npm run dev locally. For production, npm run build and npm run preview serve at 127.0.0.1:4173 without Windows firewall changes. Upload dist/ contents to any static HTTPS host. The locally generated output/LittleDiscoveries-static.zip has index.html at its root and is excluded from Git; recreate it after changes. Use correct MIME types and revalidate index.html/sw.js.

Publication and test evidence for this release is recorded in VERIFICATION.md. Historical revision-2 evidence in verification/ documents that rejected release, not current player acceptance. Physical iPhone/sample acceptance remains pending.

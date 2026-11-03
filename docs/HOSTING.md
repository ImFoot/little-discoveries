# Public repository and GitHub Pages

Repository: [ImFoot/little-discoveries](https://github.com/ImFoot/little-discoveries). The repository and playable site are public.

Live game: **[Play Little Discoveries](https://imfoot.github.io/little-discoveries/)**. An ordinary iPhone Safari link is sufficient; Home Screen installation is optional.

## Deployment

This is a static TypeScript/Vite/PixiJS browser game. GitHub Pages serves its production HTML, JavaScript, WebP pictures, JSON definitions and service worker. Source PNG artwork and authoring records stay in the repository and are not deployed.

The Pages source is GitHub Actions. The workflow in .github/workflows/pages.yml installs the locked dependencies on Node.js 24, runs core tests, prepares source artwork and matching previews, validates 100 reviewed scenes / 1,391 placements with a fifteen-target cap, builds, and uploads dist/. Only successful builds from main or manual dispatch publish; pull requests build without publishing. The workflow uses GitHub's built-in token and deployment identity. No personal token or runtime API key belongs in the game.

Vite uses relative asset URLs, and scene navigation uses URL hashes. Both a domain root and this project's subdirectory work without route rewrites. Offline caching remains inside the game's directory. A complete chapter download contains its ten scenes, target previews and definitions plus the application shell.

Revision 2 deployed successfully from a001937ecc8fe947b9c36ba31de1dc49e9bda0b9 in [workflow 41585023371](https://github.com/ImFoot/little-discoveries/actions/runs/41585023371). The live catalog confirms 100 scenes, 1,391 placements and a maximum of fifteen targets. Forty-four HTTP checks and a hosted desktop Chromium check passed, including saved progress, a complete chapter 6 download and offline play. Current revision-2 publication checks are in [verification/deployment.json](verification/deployment.json). The original collection's [deployment evidence](verification-v1/deployment.json) and [verification report](VERIFICATION-v1.md) are retained separately. Later updates publish by committing and pushing to main; the repository's Actions tab records deployment status.

## Opening the revised collection

Reload Safari once after publication. Original scenes 51–100 now occupy 1–50, and fifty new scenes occupy 51–100. The game validates and migrates the original local save before loading the renumbered pictures. Original scene 72 with thirteen finds becomes scene 22 with the same discoveries. Removed cap targets are filtered. Retired scenes never become progress on an unrelated replacement.

The original version-1 save remains intact; the revised game writes to a separate version-2 key and keeps a pre-revision copy. Versioned catalog, level, artwork and manifest URLs prevent a cached original response from being used for a different picture. The offline application entry is app-v2.html. Automatic reopening of an older tab is best effort; a normal reload is the supported upgrade path. Download chapters again after an artwork/content update.

## Local runs and portable hosting

From C:\Users\tensi\hidden_objects, run npm ci and npm run dev. For a production preview run npm run build followed by npm run preview, then open http://127.0.0.1:4173. The server binds only to the local machine. No Windows firewall change is needed for local development.

Upload the contents of dist/ to a static HTTPS host, preserving every filename and directory. The portable output/LittleDiscoveries-static.zip has index.html at its root. Source changes require rebuilding and recreating that archive. Service workers require HTTPS on a phone; file URLs and ordinary HTTP LAN links do not provide offline downloads in iPhone Safari.

Before switching from localhost to the hosted origin or moving devices, use Settings → Back up progress. Open the destination link and restore that file in Settings. Progress is stored locally by device/browser and website origin; GitHub does not synchronize it. The game uploads no progress and requires no account. GitHub applies its ordinary hosting limits and website logging.

Physical iPhone acceptance of the revised collection remains separate from desktop Chromium/WebKit emulation; see [DEVICE_REVIEW.md](DEVICE_REVIEW.md).

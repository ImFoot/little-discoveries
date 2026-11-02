# GitHub repository and Pages

Repository: https://github.com/ImFoot/little-discoveries

The game is a static TypeScript/Vite/PixiJS site. GitHub Pages can serve the production HTML, JavaScript, WebP artwork, JSON level definitions and service worker without a backend. The production directory is about 78 MB; source artwork is retained separately in the repository and is not deployed.

## Deployment

The repository uses GitHub Actions as its Pages publishing source. `.github/workflows/pages.yml` runs on pushes to `main`, pull requests, and manual dispatch. It installs the lockfile, runs core tests, validates all 100 scenes and 1,304 placements, builds the game, and uploads `dist/`. Only successful builds from `main` or manual dispatch publish to the `github-pages` environment. Pull requests build without publishing.

The workflow uses GitHub's built-in token and deployment identity. No personal access token or API key belongs in the repository or in the deployed game.

Vite uses relative asset URLs and the game uses hash navigation, so the project subdirectory works without server route rewrites. The service worker, manifest, artwork and chapter downloads stay within the game's directory. HTTPS supports ordinary iPhone Safari and service-worker offline downloads; Home Screen installation is optional.

Live game: **https://imfoot.github.io/little-discoveries/**

The [first deployment](https://github.com/ImFoot/little-discoveries/actions/runs/41414125158) succeeded on 2026-11-02 from commit `6c2abaa02ff9a3572b9efcc54f01a841058893a3`. Hosted checks confirmed the catalog's 100 scenes / 1,304 targets, all ten complete chapter manifests, required entry assets, and scene/preview assets for levels 1, 28, 80 and 100. Desktop browser checks confirmed collection, saved progress after reload, and a complete first-chapter download (136/136 files). These checks do not establish physical iPhone acceptance. Details are in [verification/deployment.json](verification/deployment.json).

Later updates publish by committing and pushing to `main`; deployment status appears in the repository's Actions tab.

## Moving progress

Before leaving a local preview, use Settings → Back up progress. Open the hosted game and use Settings → Restore progress to import that file. Each browser/device and website origin has its own local save. GitHub does not synchronize game progress.

## Scope and limits

The repository and playable site are public. The browser game does not upload progress or require an account. GitHub provides the hosting and applies its normal website logging and usage limits.

GitHub Pages currently permits a published site up to 1 GB and has a soft bandwidth limit of 100 GB per month. This personal, untimed game has no commercial transactions or SaaS backend. See [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Physical iPhone Safari acceptance testing remains separate from desktop Chromium/WebKit emulation. See [DEVICE_REVIEW.md](DEVICE_REVIEW.md).

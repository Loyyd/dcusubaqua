# dcusubaqua

Modern dark-theme rebuild for the DCU Sub-Aqua Club website.

## GitHub Pages

This repo is configured to deploy automatically to GitHub Pages with GitHub Actions.

- Push to `main` to trigger a deployment.
- The published site URL will be `https://loyyd.github.io/dcusubaqua/` unless the repository Pages settings use a custom domain.

## Local preview

Open `index.html` in a browser, or serve the folder with a simple static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Committee headshots

Place committee images in `assets/headshots/` using these filenames:

- `captain.jpg`
- `secretary.jpg`
- `treasurer.jpg`
- `equipment.jpg`
- `training.jpg`
- `diving-officer.jpg`
- `hockey-captain.jpg`
- `events.jpg`
- `first-year.jpg`

PNG, JPG, or WEBP also work if you update the matching path in `script.js`.

Update the matching committee names and notes in `script.js` once you have the final roster.

## Trailer

The homepage hero uses `trailer.mp4` from the repo root.

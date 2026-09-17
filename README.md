# MIDI Pad Controller

A drum pad that runs in the browser: 16 pads, 99 drum samples, keyboard shortcuts, and a sound and color of your choice for every pad. Your layout is saved in the browser and is back the next time you open the page.

Built with Next.js (App Router, TypeScript), Redux Toolkit and the Web Audio API. The app is entirely client-side and builds to plain static files, so it can be hosted on Cloudflare, GitHub Pages or any other static host.

![Editing a pad](https://user-images.githubusercontent.com/1064036/58427440-7af51100-8054-11e9-85c3-8fab9719eb2c.png)

## Features

- 16 pads in a 4x4 grid, playable with a mouse, a finger or the keyboard. The letter on each pad is its shortcut key.
- 99 samples from [99Sounds Drum Samples](https://99sounds.org/drum-samples/), bundled with the app.
- Right-click a pad, or press its edit button, to change its sample or one of eight colors. Revert either change with one click.
- Master volume slider.
- Layout and volume persist in `localStorage`. Layouts saved by the original 2019 version of this app still load.
- Low-latency, polyphonic playback through the Web Audio API. Samples are decoded once and every hit starts instantly.
- Keyboard accessible: pads, the editor and the help panel all work without a pointer.
- Realistic pad buttons. Feel free to use them in any commercial or personal project; see [this CodePen](https://codepen.io/subwaymatch/pen/EJLJVZ) for the original markup.

## Development

Requires Node.js 20 or newer (see `.nvmrc`).

```sh
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + tests
npm run build      # static export in ./out
npm run preview    # build, then serve ./out locally the way Cloudflare would
```

## Deploying

`npm run build` writes the whole site to `out/`. Every file the app needs, samples and fonts included, is in that folder; nothing is fetched from third parties at runtime.

### Cloudflare

The site is served by a Cloudflare Worker with [static assets](https://developers.cloudflare.com/workers/static-assets/); `wrangler.jsonc` holds the configuration.

- From your machine: `npx wrangler login` once, then `npm run deploy`.
- From Git: in the Cloudflare dashboard go to *Workers & Pages* → *Create* → *Import a repository*, then set the build command to `npm run build` and the deploy command to `npx wrangler deploy`.
- Cloudflare Pages also works: build command `npm run build`, build output directory `out`.

The samples are served as static assets alongside the app, so no R2 bucket is needed. The whole site is under 10 MB.

### GitHub Pages

1. In the repository settings, under *Pages*, set *Build and deployment* → *Source* to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy-github-pages.yml` builds the site and publishes it.

The workflow reads the base path from your Pages configuration, so it works both for a project site (`https://<user>.github.io/<repo>/`) and for a custom domain.

### Any other static host

Upload the contents of `out/`. If the site is served from a sub-path rather than a domain root, set `NEXT_PUBLIC_BASE_PATH` to that path before building, for example `NEXT_PUBLIC_BASE_PATH=/pads npm run build`.

## Project layout

```
public/sounds/       the 99 samples (WAV)
src/app/             Next.js root layout, page, web app manifest
src/components/      React components with CSS Modules
src/hooks/           keyboard shortcuts, sample player lifecycle
src/lib/             sample catalog, colors, localStorage, Web Audio player
src/store/           Redux Toolkit slices, store and provider
src/data/            sample catalog and default pad layout
```

## Attributions

- Drum samples: [99Sounds Drum Samples](https://99sounds.org/drum-samples/), free for commercial and non-commercial use.
- Icons adapted from [Feather Icons](https://feathericons.com/) (MIT).

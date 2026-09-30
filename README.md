# Shivang Uniyal — Policy Engineer Portfolio

A data-native editorial portfolio built with **Astro + React islands**. Instead of describing
policy work in prose, the site renders the evidence itself: live charts from real reconstructed
government data, an inference-battery explorer, policy toggles, and animated projections.

## Stack

- [Astro](https://astro.build) — static site generation, zero-JS by default
- [React](https://react.dev) islands (`client:visible`) — only the interactive charts hydrate
- [Recharts](https://recharts.org) — charting
- [Framer Motion](https://www.framer.com/motion/) — animated grid re-layout
- Vanilla CSS design system (`src/styles/global.css`) — dark instrument-panel aesthetic

## Structure

```
src/
  data/projects.ts        ← single source of truth: all projects, stats, chart assignments
  data/*.csv              ← real research data (PM-JAY series, EVM diagnostics)
  components/
    Terminal.tsx          ← typewriter hero terminal
    LiveCounters.tsx      ← animated count-up stats
    ProjectGrid.tsx       ← filterable grid with layout animation
    charts/
      PMJAYChart.tsx      ← admissions series + state bars (real CSV data)
      EVMChart.tsx        ← LOO fragility + treatment-vs-placebo forest
      MineralsPolicyToggle.tsx  ← alert-threshold policy lever
      WEFEProjection.tsx  ← animated groundwater fan to 2050
  pages/
    index.astro           ← home
    projects/[slug].astro ← case-study template (driven by projects.ts)
    about.astro, learning.astro, 404.astro
```

## Commands

| command           | action                                    |
| :---------------- | :---------------------------------------- |
| `npm install`     | install dependencies                       |
| `npm run dev`     | local dev server at `localhost:4321`       |
| `npm run build`   | production build to `./dist/`              |
| `npm run preview` | preview the production build locally       |

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on every push to `main` and deploys
to **GitHub Pages** at https://shivanguniyal-polcon.github.io/

First deploy checklist (in repo Settings → Pages): set **Source = GitHub Actions**.

### Switching to Vercel later

The site is 100% static. To move: import the repo at vercel.com, framework preset "Astro",
done. No code changes needed. Note: a `*.github.io` URL cannot be served from Vercel —
a custom domain (e.g. `shivanguniyal.com`) would be required; then update `site` in
`astro.config.mjs`.

## Editing content

Add or edit projects in `src/data/projects.ts`. Each project can attach:

- `chart`: `'pmjay' | 'evm' | 'minerals' | 'wefe'` — mounts the matching interactive island
- `figures`: static evidence images with captions (evidence locker)
- `heroStat`: the headline number shown on cards and case-study pages

# NusaStat — Portal Statistik Indonesia

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/ichwann12/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/ichwann12/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An independent, fully offline national statistics portal for Indonesia. Pure static HTML/CSS/JS — no network requests, no libraries, no build step. Open `app/index.html` in any browser, on desktop or phone.

## What it covers

- **Overview** — key indicators (population 283.5 m, GDP Rp 22,139 tn, growth 5.03%, inflation 1.57%, unemployment 4.91%, poverty 8.57%, life expectancy 74.2 yrs, HDI 75.02), GDP-growth and population charts, latest releases.
- **Population & demographics** — switchable chart (total population 2015–2024 / age structure / urban vs rural), demographic facts, population-by-year table.
- **Economy** — switchable chart (GDP growth / inflation / unemployment), GDP sector mix, economy facts, annual indicators table.
- **Provinces** — top-10 population chart plus a table of all 38 provinces (population, area, density) with live search and sortable columns.
- **Education & health** — tabbed panels: literacy, schooling, universities; life expectancy, infant mortality, stunting, hospitals.

## Data

Every figure is a rounded approximation compiled from Badan Pusat Statistik (BPS) publications, 2019–2024, with the source and year shown next to each number. NusaStat is unofficial and not affiliated with BPS or any government body.

## Structure

- `app/index.html` — page shell, header nav, footer
- `app/data.js` — all statistics (KPIs, series, provinces, education & health)
- `app/charts.js` — dependency-free canvas bar/line charts
- `app/views.js` — one renderer per section, with its controls
- `app/main.js` — hash router (`#/`, `#/population`, `#/economy`, `#/provinces`, `#/education-health`)
- `app/style.css` — the site's own design (deep teal + amber), responsive down to phones
- `main.ts` — hand-in program: copies `app/` and `screenshots/` to the output dir and writes `dossier.json` with the vendored make.fun library

## Screenshots

In `screenshots/`: the overview dashboard (desktop), the economy page (desktop), the provinces page (desktop), and the overview on a phone (390 × 844).

# Changelog

All notable changes to Banal are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2026-06-17

Follow-up patch after v1.0.3: faster homepage first paint, mobile layout fixes
for sidebar rails and scrollable model/stack lists, Contributor Covenant, and
reproducible CI npm pin. No catalog, API, or breaking changes.

### Added

- **Code of Conduct.** Contributor Covenant 2.1 at `CODE_OF_CONDUCT.md`, linked
  from `README.md` and required in `docs/CONTRIBUTING.md` ground rules.

### Changed

- **Homepage boot path.** Dev Tools directory mounts when its section nears the
  viewport (not on idle), and the hero canvas mesh initializes after first paint
  via `requestIdleCallback` — less main-thread work competing with AI Tools first
  paint.
- **CI npm pin.** GitHub Actions workflows use npm 10.9.2 so `npm ci` matches
  the committed lockfile.

### Fixed

- **Mobile category and refine rails (≤900px).** Sidebar column no longer
  inherits the desktop tile min-height, so category chips and collapsed refine
  stay compact single-row pills instead of stretching to full viewport height.
- **AI Models (and Stacks) list scroll on mobile.** Models directory no longer
  grows unbounded on small screens; the card grid scrolls inside a capped pane
  matching prompt templates (`85vh` / `--panel-tiles-effective-scroll-height`).

## [1.0.3] - 2026-06-17

Bug fix for desktop refine panel appearing empty after the mobile collapsible
sidebar shipped in v1.0.2. No catalog, API, or breaking changes.

### Fixed

- **Desktop refine panel empty on load.** The collapsible `<details>` wrapper
  stayed closed while its summary was hidden at ≥901px, so filter toolbars and
  quick filters did not render until a category or filter was selected. Desktop
  now opens refine by default; mobile collapse behavior is unchanged.

### Tests

- Desktop vs mobile default open state for refine `<details>` in
  `tests/mobile-layout.test.ts`.

## [1.0.2] - 2026-06-17

Mobile browsing UX for viewports ≤900px: collapsible refine sidebar, horizontal
chip rails, and expanded header nav. Desktop layout (≥901px) is unchanged. No
catalog, API, or breaking changes.

### Added

- **Active filter summary (mobile).** Collapsible refine block shows an active-count
  badge and up to three filter pills (with overflow hint) via i18n keys
  `filters.activeCount` and `filters.activeCountMore` (EN/JA).

### Changed

- **Mobile sidebar (≤900px):** Categories appear before filters; life filters and
  toolbar live in a collapsible refine block. Quick filters, suggestions, and
  toolbar actions scroll horizontally; models/stacks filter rows use the same
  chip-rail pattern.
- **Mobile header nav** adds AI Models, Stacks, and Guides links; homepage prompt
  template chips use a horizontal scroll rail.
- **Prompt form inputs (≤768px):** `scroll-margin-bottom` keeps focused fields
  visible above the on-screen keyboard.

### Tests

- `tests/mobile-layout.test.ts` for refine-details structure, summary sync, and
  auto-open behavior; sidebar-column tests updated for the refine wrapper.

## [1.0.1] - 2026-06-17

First patch after v1.0.0: production fixes for GitHub Pages and duplicate HTML
ids, GitHub Actions labeler, hero mesh alignment with the synthwave sun, article
publish dates in EN/JA, homepage performance improvements, and expanded regression
tests. No catalog, API, or breaking changes.

### Added

- **Article published dates.** Long-form articles and homepage cards show
  16 June 2026 in English and 2026年6月16日 in Japanese via a subtle
  `<time class="article-published" datetime="2026-06-16">` element and i18n key
  `article.published.20260616`.
- **`npm run measure:bundle`.** Prints raw and gzip sizes for production chunks and
  homepage boot JS (main + shared i18n chunk). Baseline before/after numbers live in
  `scripts/measure-bundle.mjs`.
- **`src/data/catalog-counts.ts`.** Lightweight constants for models, stacks, and
  prompt counts used by site copy — avoids parsing heavy data modules on first paint.
- **Split filter modules.** `apply-zero-key-filters`, `apply-models-filters`,
  `apply-stacks-filters`, and `apply-prompts-filters` replace the monolithic
  `apply-section-filters.ts` so lazy panels no longer pull into the homepage bundle.

### Changed

- **Homepage boot JS ~54% smaller (raw).** Shared i18n chunk drops from ~437 KB to
  ~175 KB; main + i18n boot total from ~496 KB to ~227 KB (~68 KB gzip). Prompt
  templates, AI models, and tool stacks data stay lazy-loaded in their own chunks.
- **Prompt template cards** render via `appendChildrenBatched` (same frame-budget
  pattern as the tools panel).
- **Off-screen cards** use `content-visibility: auto` on `.zk2-card` and
  `.prompt-card-horizontal` (`.tool-card-horizontal` already had it).
- **Mobile glass cards (≤768px):** `backdrop-filter` blur reduced from 12px to 6px
  with slightly stronger background opacity — same look, less GPU work.
- **Article pages** use the system font stack; Google Fonts (Inter, JetBrains Mono)
  removed from both article HTML shells — zero third-party font requests.

### Fixed

- **GitHub Actions labeler.** Migrated `.github/labeler.yml` to the
  `actions/labeler@v6` schema (label keys with `changed-files` match objects).
  Upgraded the workflow to `actions/checkout@v5` and `actions/labeler@v6`, added
  `issues: write` so labels can be created, and check out the PR head so config
  updates apply before merge. Removed unsupported `fail-on-error` input that caused
  the labeler job to fail on every PR.
- **GitHub Pages module load.** Removed the hand-rolled `modulepreload` for
  `/src/main.ts`. Vite rewrote it to `dist/assets/main-*.ts` while the script tag
  became `.js`. GitHub Pages serves `.ts` as MIME type `video/mp2t`, so the browser
  blocked the preload and logged a console error. Production builds now preload
  only compiled `.js` chunks. Regression test guards against re-adding a `.ts`
  modulepreload in `index.html`.
- **Duplicate search input IDs.** AI Tools and Dev Tools panels each assign a
  unique search input id (`zk-search-input-ai`, `zk-search-input-dev`,
  `zk-search-input-all` when no prefix). Resolves duplicate-id HTML validation
  warnings and autofill confusion. Search behavior is unchanged; runtime code
  already used the `.zk2-search-input` class.
- **Hero mesh horizon alignment.** The vanishing mesh row is 4px wider per side at
  the horizon so its edges meet the digital sun chord instead of sitting slightly
  inside it.

### Tests

- `tests/github-link.test.ts` guards against `.ts` modulepreload regressions in
  `index.html`.
- Dual-panel search id uniqueness and hero-sync coverage in directory tests.
- `tests/article-dates.test.ts` for EN/JA date formatting and article markup.
- `meshRowHalfWidth` coverage for horizon sun alignment in hero-mesh tests.
- `scripts/check-articles.mjs` verifies published-date markup on article pages.
- `catalog-counts constants match live data` drift guard in
  `tests/content-integrity.test.ts`.
- `requestAnimationFrame` stub in `tests/prompt-templates-ui.test.ts` for batched
  card rendering.

## [1.0.0]

See [DIAMOND.md](DIAMOND.md) for the v1.0.0 release marker, quality bar, and
what shipped in the first public cut.

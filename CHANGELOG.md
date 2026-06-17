# Changelog

All notable changes to Banal are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-06-17

First patch after v1.0.0: production fixes for GitHub Pages and duplicate HTML
ids, GitHub Actions labeler, hero mesh alignment with the synthwave sun, article
publish dates in EN/JA, and expanded regression tests. No catalog, API, or breaking
changes.

### Added

- **Article published dates.** Long-form articles and homepage cards show
  16 June 2026 in English and 2026年6月16日 in Japanese via a subtle
  `<time class="article-published" datetime="2026-06-16">` element and i18n key
  `article.published.20260616`.

### Fixed

- **GitHub Actions labeler.** Migrated `.github/labeler.yml` to the
  `actions/labeler@v6` schema (label keys with `changed-files` match objects).
  Upgraded the workflow to `actions/checkout@v5` and `actions/labeler@v6`, added
  `issues: write` so labels can be created, and read config from the default
  branch. Removed unsupported `fail-on-error` input that caused the labeler job
  to fail on every PR. After workflow changes on `main`, push or synchronize the
  PR to trigger a fresh run — re-run keeps the old workflow snapshot.
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

## [1.0.0]

See [DIAMOND.md](DIAMOND.md) for the v1.0.0 release marker, quality bar, and
what shipped in the first public cut.

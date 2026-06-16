# Banal v1.0.0 — Diamond Release

This file is a release marker. It records the version of Banal that was
declared the v1.0.0 release after a full quality pass, and points to the
documents you should read to understand the project.

The full project description is in the
[`README.md`](../README.md). The architecture is in
[`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md). The voice and editorial
rules are in [`MINDSET.md`](../MINDSET.md). The non-negotiable
principles behind the project are in [`SPIRIT.md`](../SPIRIT.md).

---

## What ships in v1.0.0

- **273 curated tools** organized into two top-level groups (AI tools
  and Developer tools), with categories, access labels, search, and filters.
- **52 prompt templates** in English and Japanese, with parity validation
  and empathy smoke tests in the test suite.
- **A static, zero-backend architecture** that anyone can fork, build,
  and host for free on GitHub Pages, Cloudflare Pages, or a USB stick.
- **Bilingual UI** (English, Japanese) with first-class translation
  quality and a parity test gate.
- **A weekly catalog audit** that HEAD/GETs every tool URL and writes a
  date-stamped summary to [`docs/verification/`](../docs/verification/).
  Failures are listed transparently; some are bot blocks, not dead tools.
- **A complete CI gate**: lint, typecheck, 662 tests across 36 files,
  and `npm audit --audit-level=moderate` on every push.
- **MIT license.** Fork, rename, host, give away.

---

## Quality bar for this release

The v1.0.0 cut was the point at which every claim in the documentation
matched the source code, every documented command ran cleanly, and the
voice in the user-facing copy met the editorial test in
[`MINDSET.md`](../MINDSET.md). Specifically:

- The number of tools in the README matches
  `src/data/zero-key-tools.ts` (273).
- The number of prompt templates in the README matches the `TEMPLATES`
  object in `src/lib/prompt-templates.ts` (52).
- The test counts in the documentation match the output of
  `npm run test:run` (662 tests across 36 files at this marker).
- The README audit line matches the latest file in
  `docs/verification/` (synced by `npm run verify:tools`).
- The tool URLs in [`docs/TOOLS-DIRECTORY.md`](docs/TOOLS-DIRECTORY.md) are
  generated from the catalog data file. No marketing-only entries.
- Every user-facing string has parallel English and Japanese
  translations.
- `npm run ci` is green.
- `npm run build` produces a clean `dist/` with no source maps.

The release marker does not change the work that comes after it. The
catalog grows, the prompt templates grow, the translations grow, and
the next release will record the next point at which the same bar is
met. Between releases, live counts are in [`README.md`](../README.md)
and `src/data/site-stats.ts`.

---

## How to read the rest of the project

If you only read three files, read these:

1. [`README.md`](../README.md) — what the project is, how to run it.
2. [`MINDSET.md`](../MINDSET.md) — the editorial test for
   any change to user-facing copy.
3. [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — how the code is
   shaped and why.

If you want to contribute, read
[`docs/CONTRIBUTING.md`](../docs/CONTRIBUTING.md) next. If you want to
deploy your own copy, read
[`docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md). For security context,
read [`docs/SECURITY.md`](../docs/SECURITY.md) and
[`PENTEST_REPORT.md`](../PENTEST_REPORT.md).

---

## Versioning

Banal follows [Semantic Versioning](https://semver.org/):

- **Major** bumps when the public shape of the site changes in a way
  that requires a fork maintainer to act (a moved file, a renamed
  entry in the catalog, a new required translation key).
- **Minor** bumps when a new tool, new prompt template, or new
  language is added.
- **Patch** bumps for documentation fixes, dependency updates, and
  catalog corrections that do not require a fork to update.

The current version is `1.0.0` (see the `version` field in
`package.json`).

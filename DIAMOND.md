# DIAMOND.md

This file is the project's compass: what it is, how versions are cut, and where
to find the rest of the documentation. The full project description is in
[`README.md`](README.md).

## Current version

`1.1.0` (see the `version` field in `package.json`). Release notes for every
version live in [`CHANGELOG.md`](CHANGELOG.md).

## Versioning

Banal follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **Major** bumps when the public shape of the site changes in a way that
  requires a fork maintainer to act — a moved file, a renamed entry in the
  catalog, a new required translation key.
- **Minor** bumps when a new tool, new prompt template, or new language is
  added.
- **Patch** bumps for backwards-compatible bug fixes, documentation fixes,
  dependency updates, and catalog corrections that do not require a fork to
  update.

## Quality bar

Every release must pass `npm run ci` — lint, format check, typecheck, the full
test suite, and `npm audit --audit-level=moderate`. `npm run build` must
produce a clean `dist/` with no source maps. Every number in the documentation
must match the source code; drift is caught by
`tests/content-integrity.test.ts`.

## How to read the rest of the project

If you only read three files, read these:

1. [`README.md`](README.md) — what the project is, how to run it.
2. [`MINDSET.md`](MINDSET.md) — the editorial test for any change to
   user-facing copy.
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the code is shaped
   and why.

If you want to contribute, read [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).
If you want to deploy your own copy, read
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). For security context, read
[`docs/SECURITY.md`](docs/SECURITY.md) and
[`PENTEST_REPORT.md`](PENTEST_REPORT.md).

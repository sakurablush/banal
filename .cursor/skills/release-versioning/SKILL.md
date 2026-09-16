---
name: release-versioning
description: Cut a Banal release or update CHANGELOG and version files per SemVer. Use when shipping user-visible changes, bumping version, or preparing release notes.
paths:
  - CHANGELOG.md
  - package.json
  - DIAMOND.md
---

# Release Versioning

Shippable work in Banal requires a release decision and CHANGELOG entry.

## Authority

- SemVer policy: `DIAMOND.md`
- Changelog format: `CHANGELOG.md` (Keep a Changelog)

## Decision

| Outcome     | When                                                         |
| ----------- | ------------------------------------------------------------ |
| **No bump** | Agent rules, internal docs, user deferred release            |
| **Patch**   | Bug fixes, perf, UX polish, deps, catalog corrections        |
| **Minor**   | New tool, prompt template, or language                       |
| **Major**   | Breaking public site shape / required fork maintainer action |

## Workflow

1. Decide bump level; state rationale in final output.
2. Add bullets under `[Unreleased]` (or new `## [X.Y.Z] - YYYY-MM-DD` when cutting).
3. Sections: **Added**, **Changed**, **Fixed**, **Removed**, **Tests** — omit empty.
4. One theme per version; do not mix unrelated changes.
5. On bump: `npm version X.Y.Z --no-git-tag-version`, sync `package-lock.json`, update `DIAMOND.md` current-version line.
6. Run `npm run ci` before commit.

## Rule reference

`.cursor/rules/release-versioning.mdc`

## End-to-end ship

For a full patch workflow, see `.cursor/skills/ship-patch/SKILL.md`.

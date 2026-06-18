---
name: pre-commit-ci
description: Run Banal's full CI gate (lint, format, typecheck, tests, audit) before commit or merge. Use when committing, fixing CI failures, editing Cursor skills, or finishing implementation work.
paths:
  - src/**/*.ts
  - tests/**/*.ts
  - .cursor/skills/**/*.md
---

# Pre-Commit CI

Run the repository quality gate before any commit or merge-ready sign-off.

## Command

```bash
npm run ci
```

Expands to: `lint:check` → `format:check` → `typecheck` → `test:run` → `npm audit --audit-level=moderate`

## Workflow

1. After edits to `src/` or `tests/`, optionally run `npm run lint` on touched files (`--fix` is built in).
2. After edits to **`.cursor/skills/**/\*.md`**, run `npm run format`(or full`npm run ci`). Markdown tables must pass Prettier — CI will fail on unpadded tables.
3. Run `npm run ci` in full — do not substitute tests-only.
4. Fix every error and warning; re-run until exit code 0.
5. Include auto-fixed formatting in the same commit as the feature/fix.

## If `ci` cannot run

Run individually and report each outcome:

```bash
npm run lint:check && npm run format:check && npm run typecheck && npm run test:run
```

Format only (skills / markdown):

```bash
npx prettier --write ".cursor/skills/**/*.md"
```

## Windows note

If local `ci` fails on unchanged files with `Delete ␍` (CRLF), index blobs may still be LF and GitHub CI will pass. Focus on fixing touched files; run `npm run lint` to normalize.

## Rule reference

`.cursor/rules/pre-commit-quality-gate.mdc`

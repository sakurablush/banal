# AGENT.md

This file tells the AI agent how to work in this repository.

## Project Overview

Banal is a static AI tools directory and prompt-template library. It is a
TypeScript + Vite + Tailwind single-page app with no server, no database,
and no runtime secrets. The value proposition is: host your own copy from a
source you trust.

- **Runtime:** TypeScript compiled to plain JS/CSS/HTML via Vite.
- **Styling:** Tailwind CSS with a custom `system-ui` font stack (no
  third-party fonts, no remote assets).
- **Tests:** Vitest 5.0.1 with jsdom. 704 tests across 42 files.
- **CI:** `npm run ci` — lint, format check, typecheck, test run, audit.
- **Current version:** 1.0.5 (see `package.json`).

## Agent Operating Rules

- **English only.** All variable names, function names, class names,
  comments, docstrings, and documentation must be in English. Never write
  Polish (or any other natural language) into code or docs.
- **No magic numbers.** Every constant gets a named home — constants,
  enums, or config. No bare literals in logic.
- **No hardcoded strings.** Every user-facing string lives in constants,
  enums, or config files.
- **One function, one thing.** Keep functions under ~25 lines. If it is
  long, split it.
- **Files stay small.** One responsibility per file, max ~200-250 lines.
- **Tests are mandatory.** Every function gets tests: happy path, all edge
  cases, and all error paths. Tests must be fully isolated — no shared
  state, no dependencies between them.
- **Security is a first-class citizen.** Think like a pentester. Assume the
  attacker has the source. Validate every external input. Use
  cryptographically secure randomness (`secrets`/`crypto`). Use
  constant-time comparison for secrets. Never log or leak sensitive data.
  See `PENTEST_REPORT.md` for the full threat model.

## Coding Standards

Follow the rules in `.cursor/rules/`:

- `.cursor/rules/release-versioning.mdc` — SemVer policy from `DIAMOND.md`,
  Keep a Changelog format, version bump procedure.
- Other rules in `.cursor/rules/` cover lint, format, typecheck, and test
  conventions.

Reference docs:

- `DIAMOND.md` — project philosophy and SemVer policy.
- `MINDSET.md` — how to think about the project.
- `SPIRIT.md` — the spirit of the codebase.
- `CODE_OF_CONDUCT.md` — community standards.
- `PENTEST_REPORT.md` — threat model and mitigations.
- `docs/ARCHITECTURE.md` — architecture overview.

## Build, Test, and Commit Workflow

### Setup

```bash
npm ci          # clean install from package-lock.json
npm run ci      # the full gate: lint, format, typecheck, test, audit
```

### Individual checks

```bash
npm run lint:check     # ESLint
npm run format:check   # Prettier
npm run typecheck      # tsc --noEmit
npm run test:run       # Vitest
npm run build          # tsc && vite build -> dist/
npm run test:coverage  # coverage report
```

### Before committing

1. `npm run ci` must pass cleanly.
2. `npm run build` must produce `dist/` with **zero** `.map` files.
3. If you change user-facing behavior, update `CHANGELOG.md` under
   `[Unreleased]` and bump the version per `DIAMOND.md`.
4. Never commit secrets, credentials, tokens, or keys. Use environment
   variables or a secrets manager. The `.gitignore` already excludes
   `.env`, `*.pem`, `*.key`, etc.
5. Run pre-commit secret scanning (detect-secrets, trufflehog, or
   gitleaks). Block any commit that triggers a finding.

### Commit style

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`,
  `style:`, `refactor:`.
- One theme per commit. Do not mix unrelated changes.
- Reference the issue or task in the commit message.

## Agent Manager

This repo uses Kilo Agent Manager for parallel worktrees. When fanning out
work into multiple sessions, use the `agent_manager` tool with `mode:
"worktree"`. Never edit `.kilo/agent-manager.json` directly — it is persisted
UI state, not the Agent Manager API.

## Scope Boundaries

- This is a static site. There is no server to secure, no database to
  inject into, and no session to hijack. The threat model is fork
  distribution, catalog drift, and client-side storage. See
  `PENTEST_REPORT.md`.
- Do not add server-side features, databases, or authentication without
  explicit approval — they would break the security model.
- The catalog data lives in `src/data/`. Adding a tool means adding an
  entry to the right file and running `npm run verify:tools` to confirm it
  is reachable.

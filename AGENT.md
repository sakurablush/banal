## Coding Standards

These rules are the single source of truth for this repo. They used to live in
`.cursor/rules/` — that directory is now local-only — so they are reproduced
here. If the two ever drift, this file wins.

### Release versioning (SemVer)

Policy is defined in `DIAMOND.md`. Summary:

- **No bump** — agent rules, internal docs, user-deferred release.
- **Patch** — bug fixes, perf, UX polish, deps, catalog corrections.
- **Minor** — new tool, prompt template, or language.
- **Major** — breaking public site shape or required fork-maintainer action.

On bump: `npm version X.Y.Z --no-git-tag-version`, sync `package-lock.json`,
update the `version` line in `DIAMOND.md`, add bullets under `[Unreleased]`
(or a new `## [X.Y.Z] - YYYY-MM-DD` header when cutting). Sections: **Added**,
**Changed**, **Fixed**, **Removed**, **Tests** — omit empty. One theme per
version. Run `npm run ci` before commit.

### Lint, format, typecheck, test

- `npm run lint:check` — ESLint. Clean output, no warnings.
- `npm run format:check` — Prettier. Clean output.
- `npm run typecheck` — `tsc --noEmit`. Zero errors.
- `npm run test:run` — Vitest 5.0.1 with jsdom. 704 tests across 42 files.
  Coverage thresholds are enforced in `vitest.config.ts`.
- Tests must be fully isolated — no shared state, no dependencies between
  them. Happy path, all edge cases, all error paths.

### Security

Think like a pentester. Assume the attacker has the source. See
`PENTEST_REPORT.md` for the full threat model. In short:

- Validate every external input. Fail closed and early.
- Use `crypto`/`secrets` for anything security-sensitive. Never `random` or
  predictable sources.
- Constant-time comparison for secrets. Never `==`.
- Never commit secrets, credentials, tokens, or keys. Use env vars or a
  secrets manager. `.gitignore` already excludes `.env`, `*.pem`, `*.key`.
- Error messages must not leak internals, stack traces, or user data.
- Run pre-commit secret scanning (detect-secrets, trufflehog, gitleaks).
  Block any commit that triggers a finding.

### Commit style

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `style:`,
`refactor:`. One theme per commit. Reference the issue or task.

## Reference Docs

- `DIAMOND.md` — project philosophy and SemVer policy.
- `MINDSET.md` — how to think about the project.
- `SPIRIT.md` — the spirit of the codebase.
- `CODE_OF_CONDUCT.md` — community standards.
- `PENTEST_REPORT.md` — threat model and mitigations.
- `docs/ARCHITECTURE.md` — architecture overview.

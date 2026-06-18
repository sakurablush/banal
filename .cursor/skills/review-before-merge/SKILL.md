---
name: review-before-merge
description: Pre-merge review for Banal — Bugbot code review and optional security review before PR or release. Use when the user asks for review before commit, merge, or PR.
disable-model-invocation: true
---

# Review Before Merge

Run structured review before merge or release. Fix blockers before commit.

## Order

1. **CI** — `.cursor/skills/pre-commit-ci/SKILL.md` must pass first.
2. **Bugbot** — launch one `bugbot` subagent (`readonly: true`):

```text
Full Repository Path: <workspace root>
Diff: branch changes
```

Use `uncommitted changes` for dirty tree only. Use `Base Branch: main` when the feature branch was not cut from `main`.

3. **Security** (when auth, input, secrets, or external URLs changed) — use the `review-security` skill.

## Bugbot summary format

| Severity | Location (file:line) | Finding |

Sort by severity (highest first). Do not fix findings unless the user asks.

## After review

- Blockers → fix and re-run CI + review.
- Clean → proceed to commit/PR per user request.

## Rule reference

`.cursor/rules/aether-reviewer.mdc`

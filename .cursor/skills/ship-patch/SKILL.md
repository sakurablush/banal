---
name: ship-patch
description: End-to-end workflow to implement, validate, document, and commit a Banal patch. Use when the user asks to prepare a version, patch, or release branch.
---

# Ship Patch

Complete workflow for a backwards-compatible Banal patch.

## Steps

1. **Branch** — create a focused branch from `main` (or rebase onto `origin/main`).
2. **Implement** — follow `.cursor/rules/aether-engineer.mdc`; minimal diff.
3. **Test** — run `.cursor/skills/pre-commit-ci/SKILL.md` (`npm run ci` until green). If you edited `.cursor/skills/` or rules, `format:check` must pass too.
4. **Review** — optional but recommended: `.cursor/skills/review-before-merge/SKILL.md`.
5. **Document** — `.cursor/skills/release-versioning/SKILL.md` (CHANGELOG + release decision).
6. **Commit** — only after green CI; user must request commit explicitly.
7. **Report** — release decision, gate result, and suggested English release title if asked.

## Do not

- Commit with a red gate.
- Mix unrelated themes in one version.
- Bump minor for fixes without a new tool/template/language.

# Contributing to Banal

Thank you for considering a contribution. Banal is an open-source project
and the quality of the catalog, the prompt templates, the documentation,
and the translations comes directly from the people who file issues and
send PRs.

This document covers the practical mechanics. The voice and editorial
standards for any user-facing copy are in
[`MINDSET.md`](MINDSET.md). The review process is described at the
bottom of this file.

---

## Ground rules

1. **Run `npm run ci` locally before opening a PR.** This is the same
   gate CI runs: lint:check + typecheck + the full test suite +
   `npm audit --audit-level=moderate`. If it is not green, the PR is
   not ready.
2. **Smallest effective diff wins.** If a change can be 12 lines instead
   of 47, make it 12. We can add more later.
3. **Bilingual from day one.** Every user-facing string must exist in
   both English and Japanese (or come with a clear reason in the PR
   description). Japanese is first-class, not a follow-up. See
   [`docs/JAPANESE.md`](JAPANESE.md) for the Japanese review checklist.
4. **The empathy bar is real.** Copy that shames, assumes privilege
   ("just buy a better phone"), or talks down to the user will be
   sent back for rework. Read
   [`MINDSET.md`](MINDSET.md) for the editorial test.
5. **Test or it does not ship.** New features, especially anything
   touching prompt templates or the catalog, need tests. See the
   existing test files for the expected depth.
6. **Forkability and simplicity are sacred.** If a change makes it
   meaningfully harder to fork, build, or host the project, it will be
   pushed back.

---

## Local setup

You need Node.js 18 or newer. Clone your fork, install, run:

```bash
git clone https://github.com/<your-username>/banal
cd banal
npm install
npm run dev          # local dev server at http://localhost:5173
npm run test         # vitest in watch mode
npm run ci           # the full gate (do this before pushing)
```

`npm run test:coverage` produces a coverage report. The thresholds in
`vitest.config.ts` are enforced; coverage regressions fail the build.

---

## What we especially welcome

### New or improved prompt templates

The 52 templates in `src/lib/prompt-templates.ts` are the highest-impact
work. A good new template targets a real situation: job applications
with gaps, fighting a welfare denial, decoding a scary medical bill,
staying afloat with $0 and a kid, surviving a 5-minute grounding, or
navigating bureaucracy in a second language. It assumes zero budget, a
shared or public device, low energy, and existing shame. It ends with
a dignity-preserving line. It exists in full English and natural
Japanese (keigo for official letters, permission and short lines for
mental health ones). Its `{{variables}}` are minimal and obvious.

The `PromptTemplatesLibrary.validateParity()` method and the empathy
smoke tests in `tests/prompt-templates.test.ts` enforce the parity and
tone requirements. The review process is described below.

### Translations and new languages

Japanese was built in at the same quality level as English. We want
more. The bar is "professional human translation, never machine
output." Adding a third language is a non-trivial change (Locale type,
i18n string table, parity validator, prompt-template parity tests, UI
wiring). Open a discussion issue first so we can scope it together. See
[`docs/JAPANESE.md`](JAPANESE.md) for the principles that apply to any
new language.

### New tools in the catalog

The catalog is data, not code. To add a tool, append a typed entry to
the `zeroKeyTools` array in `src/data/zero-key-tools.ts`. Run
`npm run ci` to validate the schema, then `npm run verify:tools` to
confirm the URL is reachable and refresh `docs/verification/` plus the
README audit line. Regenerate the public directory with
`npm run generate:tools-readme` (updates `docs/TOOLS-DIRECTORY.md`).
The weekly CI workflow re-audits the catalog and updates `lastVerified`
automatically. See
[`docs/EXTENDING.md`](EXTENDING.md#adding-a-tool-to-the-directory) for
the exact shape and the rules of thumb.

### Bug reports from real devices

The most useful bug reports come from real use. "On my old Android in
Chrome, the textarea did not grow past 4 lines." "On the library
printer station, the keyboard covered the prompt-template form."
"Filtering by category X also hides category Y, which I did not
expect."

Include the device and browser, the exact steps, what you expected,
what happened, and a screenshot or screen recording if possible. Fixes
that improve the experience on slow connections, small screens, or
shared devices are prioritized.

### Accessibility, clarity, and kindness

- Better empty states.
- More `aria` labels, better focus order, full keyboard flows.
- More forgiving mobile tap targets in the prompt-template form.
- Clearer error messages that still tell the truth.

These changes often look small in diff size but have a large impact on
the humans actually using the site.

### Documentation

This folder, the README, and
[`docs/PROMPT-TEMPLATES-GUIDE.md`](PROMPT-TEMPLATES-GUIDE.md) are part
of the deliverable. Improvements are welcome: clearer language, real
examples, additional translations, fixes for broken links.

---

## The review process

Every PR is checked against at least:

- `npm run ci` is green on the branch.
- The diff is as small as the change allows.
- For any new or changed user-facing text: both English and Japanese
  are present, the tone is direct and adult, the language does not
  shame. The voice rules in
  [`MINDSET.md`](MINDSET.md) are the reference.
- For prompt templates: parity passes, the empathy smoke test does
  not flag anything, and the filled result is actually usable by the
  audience the project serves.
- It does not make forkability or the "public device with 20 minutes
  of Wi-Fi" experience worse.
- The commit message and PR description are clear about *why* this
  helps the people who will use it.

We will leave thoughtful comments. We may ask for changes. We will
celebrate good work.

First-time contributors, people submitting from a phone, people whose
English is not perfect: we will meet you where you are. The bar is on
the *quality of the result for the end user*, not on how polished the
PR looks.

---

## Practical tips

- Work in a feature branch: `git checkout -b prompt-template-debt-scripts-v2`
  or `git checkout -b kinder-rate-limit-copy`.
- Commit often with messages that say what changed and *why* for the
  user ("Make the debt script gentler on the 'you are not a bad
  person' line").
- If you are touching prompt templates, run the specific test file:
  `npx vitest run tests/prompt-templates.test.ts`.
- Before you push: `npm run ci`.
- If tests are flaky locally but pass on CI (or vice versa), mention
  it in the PR. We have seen free-tier network hiccups affect
  integration tests.

---

## If you are the actual user

You do not need to be a developer to contribute meaningfully.

- Open an issue describing the exact moment you needed help and Banal
  did not quite deliver ("I was trying to write an appeal to the
  housing office at 11 pm on my phone and the prompt-template form
  asked for too many things").
- Test on your actual device and report what broke or felt off.
- Translate a prompt template or a screen into your language, even if
  it is not "official" yet; we can incorporate it.
- Host your own fork for your community and tell us what you had to
  change locally to make it work for your people.

Those contributions are as valuable as code.

---

## Reporting security issues

Do not open a public issue for unpatched vulnerabilities. See
[`docs/SECURITY.md`](SECURITY.md#reporting-a-security-issue) for the
private reporting channels.


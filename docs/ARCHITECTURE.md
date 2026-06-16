# Architecture

This document describes how Banal is built, why it is built this way, and the
trade-offs that follow. It is written for contributors and reviewers, not for
end users. The end-user experience is described in the
[README](../README.md).

---

## Core principle: static, forkable, zero-backend

Banal has **no backend by design**. This is not a limitation we are waiting
to fix. It is the feature that makes the project work for the people it is
for.

The reasons:

- **Zero ongoing cost.** Hosting is a static folder on a free tier. There is
  no server bill, no database to maintain, and no surprise charges that could
  kill the project.
- **True forkability.** A non-technical person can clone, `npm run build`, and
  publish their own copy on GitHub Pages, Cloudflare Pages, or a USB stick in
  minutes. No "set up a server", no env vars to manage, no database to
  provision.
- **No central point of failure.** If the main repo goes away, forks keep
  working. If one provider changes their free tier, the source updates and
  every fork can pull.
- **Auditability.** The whole project is small enough for a motivated person
  to read in one sitting. No magic frameworks, no build-time codegen, no
  generated files in the source tree.

The trade-off is real and named in
[`docs/SECURITY.md`](SECURITY.md#honest-limitations): any fork can be modified
to behave maliciously. We mitigate that with a strict threat model in
[`PENTEST_REPORT.md`](../PENTEST_REPORT.md) and a documented review process in
[`docs/CONTRIBUTING.md`](CONTRIBUTING.md), not with technical restrictions.

---

## Stack

- **Language:** TypeScript (strict mode).
- **Build:** [Vite](https://vitejs.dev) 8.x. Production output is plain
  HTML, CSS, and JS in `dist/`.
- **Styling:** Tailwind CSS 3.x + a small custom CSS layer
  (`src/style.css`) for the few things Tailwind cannot do ergonomically.
- **Tests:** [Vitest](https://vitest.dev) 4.x with jsdom. 661 tests across 36
  files. Coverage thresholds are enforced in `vitest.config.ts`.
- **Lint / format:** ESLint + Prettier.
- **Runtime dependencies for end users:** **none.** The `dist/` folder is
  pure static files.

The dev dependencies (Vite, Vitest, Tailwind, ESLint, Prettier, TypeScript)
are pinned to secure versions via the `overrides` block in `package.json`,
and `npm audit --audit-level=moderate` is part of the CI gate.

---

## Repository layout

```
banal/
├── index.html                # The static shell. Two roots: <ai-tools-root> and <dev-tools-root>.
├── src/
│   ├── main.ts               # Entry point. Boots theme, storage migration, privacy guard, i18n, directory, prompts.
│   ├── directory.ts          # Renders the AI Tools and Developer Tools panels.
│   ├── zero-key-panel.ts     # The single panel renderer used for both top-level groups.
│   ├── i18n.ts               # Bilingual string table + lang switcher (en, ja).
│   ├── theme.ts              # Light/dark with prefers-color-scheme and sessionStorage.
│   ├── fuse-search.ts        # Fuzzy search across the tool catalog.
│   ├── utils.ts              # Pure helpers (escapeHtml, formatters, etc.).
│   ├── prompt-templates-standalone.ts  # Renders the "Prompt Templates" section.
│   ├── components/           # Discrete UI panels: models, stacks, filter-toolbar, privacy-panel, etc.
│   ├── data/                 # Catalog data: tools, models, categories, tags, inference providers, stacks.
│   ├── lib/                  # Pure modules: saved-section-filters, filter-analytics, storage-cleanup, etc.
│   └── types/                # Shared TypeScript types.
├── scripts/
│   ├── verify-tools.ts       # Audits every tool URL, writes full report + dated summary.
│   └── generate-tools-readme.ts  # Regenerates docs/TOOLS-DIRECTORY.md.
├── tests/                    # Vitest + jsdom. One file per source module.
├── docs/                     # You are here.
├── .github/workflows/        # CI, deploy, and the weekly verify-tools job.
└── dist/                     # Build output. Gitignored.
```

---

## The boot sequence

`src/main.ts` is intentionally tiny. The entire entry is roughly:

1. `initTheme()` — sets light or dark, with `prefers-color-scheme` as the
   default and `sessionStorage` for the manual override.
2. Wire the theme toggle button.
3. `initI18n()` — loads the bilingual string table, applies
   `data-i18n` attributes, and persists the language choice in
   `localStorage` under the key `banal-lang`.
4. `initHeroMesh()` — perspective grid with gravitational-wave ripples in the
   hero only (canvas, 30 FPS cap, pauses off-screen / hidden tab /
   `prefers-reduced-motion`; page-wide aurora stays CSS-only on `.void-bg`).
5. `initDirectory()` — renders the AI Tools panel, the Developer Tools
   panel, the Models panel, the Stacks panel, the Onboarding flow, and the
   Getting Started guides into their respective roots in `index.html`.
6. Render the "Prompt Templates" section into `#prompt-templates-root`.

Everything else (filter UI, search, saving filters, comparing tools) is wired
up by the components themselves. Filter modules share a compact
`filter-toolbar` component (`Share link`, `Save`, `Saved` menu, optional
suggestion chips). Saved presets live in `saved-section-filters.ts`; the
Privacy panel and `storage-cleanup.ts` expose what is stored and how to
clear it.

---

## Data flow

The site is read-only with respect to any external system. The user's
interactions produce only:

- **Click on a tool → open its `url` in a new tab.** The site never
  intercepts this.
- **Filter / search / sort the catalog.** All filtering happens in-memory
  on the static `zeroKeyTools` array. No requests are made.
- **Save a filter combination or a custom stack** → written to
  `localStorage` (or `sessionStorage` for ephemeral things).
- **Fill a prompt template** → values stay in `sessionStorage` under a
  per-template key. They are not sent anywhere unless the user explicitly
  copies and pastes them into a chatbot.

That is the entire data flow. There is no other path.

---

## The tool catalog

The 273 entries live in `src/data/zero-key-tools.ts` as a typed
`ZeroKeyTool[]`. Each entry has a stable `id`, `name`, `url`, `bestFor`,
`category`, `surface` (`web`, `api`, or `cli`), `access`, `requiresSignup`,
optional `badges`, `qualityNote`, optional `caveat`, and optional `docsUrl` /
`lastVerified` dates.

`src/data/categories.ts` defines the grouping rules that turn the flat list
into the "AI Tools" and "Developer Tools" top-level sections, and the
sub-categories inside each. Adding a new tool is one typed entry; everything
else (filter UI, search, badge rendering, verification) updates
automatically.

The catalog is audited weekly by the
[`verify-tools` workflow](../.github/workflows/verify-tools.yml), which
calls `npm run verify:tools`. The script:

1. Iterates over the entire catalog.
2. Issues a HEAD or GET with a 10 s timeout and a 5-request concurrency
   cap.
3. Writes the full per-tool report to `verification-results.json` (gitignored,
   regenerates every run).
4. Writes a compact, date-stamped summary to
   `docs/verification/YYYY-MM-DD.json` (tracked, see
   [`docs/verification/`](verification/) for history).
5. Syncs the audit parenthetical in `README.md` from that snapshot.

If you add a tool and the next verify run flags it as broken, fix the URL
or remove the entry. After catalog edits, run `npm run generate:tools-readme`
to refresh `docs/TOOLS-DIRECTORY.md`. If the run goes red on the CI, the broken tool is
flagged in the next dated summary.

---

## Internationalization

- English is the source of truth.
- Japanese is a first-class translation maintained at the same quality
  bar. Keigo, softening, and cultural notes are real, not machine output.
- Strings live in `src/i18n.ts` as a flat-ish nested object.
- The `t(lang, 'dotted.key')` helper and the `data-i18n`,
  `data-i18n-placeholder`, and `data-i18n-aria-label` attributes drive
  static text. Dynamic parts (panels, tooltips, modals) re-render on a
  `banal:language-changed` custom event.
- The `banal-lang` localStorage key persists the choice.

Adding a third language is a non-trivial change: it requires extending the
`Locale` type, the string table, the parity validator, the prompt-template
parity tests, and the UI wiring. The bar is "professional human
translation, never machine output" — see
[`docs/JAPANESE.md`](JAPANESE.md) for the review checklist.

---

## Prompt templates

The 52 templates in `src/lib/prompt-templates.ts` are data, not code. The
shape:

```ts
{
  id: 'job-gaps-as-strengths',
  title:        { en: '...', ja: '...' },
  description:  { en: '...', ja: '...' },
  template:     { en: '...', ja: '...' },
}
```

`{{camelCase}}` placeholders are extracted by
`extractTemplateVariables()` and substituted by `fill(id, values)`. Missing
variables are left as `{{var}}` so the user can see and fix them.

`PromptTemplatesLibrary.validateParity()` runs in tests and enforces that
every template:

- has matching `en` / `ja` keys for title, description, and template,
- uses an identical set of `{{variables}}` in both languages.

`tests/prompt-templates.test.ts` adds empathy smoke tests that assert the
output text never contains shaming phrases.

---

## Testing & quality gates

- **Coverage:** the full test suite is 661 tests across 36 files. Thresholds
  for lines, branches, functions, and statements are enforced in
  `vitest.config.ts`.
- **Local gate:** `npm run ci` runs lint:check + typecheck + test:run +
  `npm audit --audit-level=moderate`. This is what every PR must pass.
- **CI:** `.github/workflows/ci.yml` runs the same gate on every push and PR.
- **Weekly:** `.github/workflows/verify-tools.yml` runs the catalog audit
  and commits the dated summary.
- **Deploys:** `.github/workflows/deploy.yml` builds and publishes to
  GitHub Pages on push to `main` / `master`.

There are no end-to-end browser tests in CI today. The test suite covers
unit, integration, and jsdom-based DOM tests. Manual smoke testing happens
in the deployed environment.

---

## Honest trade-offs

These are the deliberate costs of the shape we chose:

- **No central analytics, no usage telemetry.** We cannot tell you how many
  people use Banal. We consider that a feature.
- **No multi-device sync.** Theme, language, custom stacks, saved filters,
  and prompt-template form values are device-local. Adding sync would mean
  adding a backend, an account system, and a privacy surface.
- **Free tiers change.** The catalog depends on third parties that can rate
  limit, rebrand, or shut down. The weekly audit catches breakage; fixing
  it is a one-line edit in `src/data/zero-key-tools.ts`.
- **Source maps are disabled** in production (`vite.config.ts`,
  `sourcemap: false`). We pay a small debugging cost in exchange for not
  publishing the full annotated source on every hosted instance.
- **Forks can be modified to be malicious.** This is a feature of being
  forkable. We mitigate with documentation, a strict review process for
  changes that land in the main repo, and a documented threat model. We
  cannot prevent a hostile actor from hosting a bad fork under a
  confusingly similar name. Users are encouraged to host their own copy.

---

## Extending the system

See [`docs/EXTENDING.md`](EXTENDING.md) for step-by-step guides on adding
new tools, prompt templates, languages, and visual themes.

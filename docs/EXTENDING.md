# Extending Banal

This document is for people who want to take Banal and shape it for their
own community. The goal is that you can do useful work here without
needing to understand the whole codebase first.

The contribution process (review, tests, PR conventions) is in
[`docs/CONTRIBUTING.md`](CONTRIBUTING.md). The voice and editorial rules
for any user-facing copy are in
[`MINDSET.md`](MINDSET.md). Read both before opening a PR.

---

## Easy changes (no code required)

- **Rename the project.** Search-and-replace `Banal` and `banal` in
  `index.html` and `src/i18n.ts`. Be careful with the GitHub repo name
  itself, which appears in the deployment URL.
- **Change colors and fonts.** Edit `src/style.css` and the Tailwind
  theme tokens in `tailwind.config.*`. No build step required beyond
  the normal `npm run dev`.
- **Edit the homepage hero copy.** The hero text is in `index.html` and
  `src/i18n.ts`. Keep the changes in both English and Japanese.
- **Add a new tool to the catalog.** See the next section.
- **Add a new category.** See "Adding a category" below.
- **Edit prompt templates.** See "Adding a prompt template" below — it
  is not quite a one-line edit because the parity validator and the
  empathy smoke tests will reject sloppy changes, but it is still
  contained to one file plus one test file.

---

## Adding a tool to the directory

The catalog is data, not code. To add a tool, edit
`src/data/zero-key-tools.ts` and append a new entry to the
`zeroKeyTools` array. Use the existing entries as a template.

Each tool has the shape:

```ts
{
  id: 'kebab-case-unique-id',
  name: 'Tool Name',
  url: 'https://example.com/',
  bestFor: 'One short sentence in plain English.',
  category: 'ai-chat',     // see src/data/categories.ts
  surface: 'web',          // 'web' | 'api' | 'cli'
  access: 'no-login',      // 'no-login' | 'public-api' | 'open-source' | 'free-tier' | 'free-key' | 'self-host'
  requiresSignup: false,
  badges: [],              // optional display tags
  qualityNote: 'Why this entry is here.',
  docsUrl: 'https://example.com/docs',  // optional
  lastVerified: 'YYYY-MM-DD',           // optional, set when verify confirms the URL
}
```

Rules of thumb:

- The `id` must be unique across the whole file.
- The `category` must already exist in `src/data/categories.ts`. If you
  need a new category, see the "Adding a category" section below.
- Pick the most honest `access` value you can. Labels are defined in
  `src/data/zero-key-tools.ts` and explained in the README.
- Keep `bestFor` to one short sentence in plain English. Long
  marketing copy does not belong in a directory entry.
- If the tool exposes both a web UI and a public API, add a second
  entry with a different `id` and `surface: 'api'`. The directory
  deduplicates by URL but allows the same URL on different surfaces.

After editing:

1. Run `npm run ci`. The catalog schema tests will catch missing fields
   and duplicate IDs.
2. Run `npm run verify:tools` to confirm the tool's URL is reachable.
   This writes `docs/verification/YYYY-MM-DD.json` and syncs the audit
   stats line in `README.md`.
3. Run `npm run generate:tools-readme` to regenerate
   `docs/TOOLS-DIRECTORY.md` from the catalog.
4. Open a PR. The weekly CI run will re-audit and update
   `lastVerified` automatically.

---

## Adding a category

Categories are defined in `src/data/categories.ts`. Each category is a
typed object with a stable `id`, a display `name` (en + ja), a
`prefix` (`ai` or `dev`), and an `icon`.

To add a new sub-category:

1. Append a new entry to the array in `src/data/categories.ts`.
2. Make sure no other category shares the new `id`.
3. Add at least one tool to the new category in
   `src/data/zero-key-tools.ts`. A category with zero tools is invisible
   anyway, but the schema tests check the structure.
4. Run `npm run ci`.

---

## Adding a prompt template

Read [`docs/PROMPT-TEMPLATES-STYLE.md`](PROMPT-TEMPLATES-STYLE.md) first — 7-block
structure, voice contract, and parity rules.

The templates in `src/lib/prompt-templates.ts` are data. To add a new
one:

1. Open `src/lib/prompt-templates.ts`.
2. Add a new key to the `TEMPLATES` object, using one of the existing
   entries as a model.
3. Provide `title`, `description`, and `template` for **both** `en` and
   `ja`. The `validateParity()` function will fail tests otherwise.
4. Use `{{camelCase}}` placeholders. The exact same set of placeholders
   must appear in both languages. The validator enforces this.
5. The `template` field is the actual prompt text. Write it as if the
   user is going to paste it into a free chatbot on a public device.
   Read [`MINDSET.md`](MINDSET.md) first; the empathy bar there
   applies.
6. Add or extend a test in `tests/prompt-templates.test.ts`. At
   minimum: the template appears in `getAll()`, `fill()` works with
   partial values, parity still passes, and the empathy smoke test
   does not flag any shaming language.
7. Run `npm run ci`.

To remove a template: delete the entry from `TEMPLATES` and update the
tests. The weekly verify run does not touch prompt templates.

---

## Translations and new languages

Japanese is a first-class translation. Adding a third language is a
non-trivial change because it touches the `Locale` type, the i18n
string table, the parity validator, the prompt-template parity tests,
and the language switcher UI. The quality bar is "professional human
translation, never machine output."

If you want to add a language, the steps are:

1. Read [`docs/JAPANESE.md`](JAPANESE.md). The principles there apply
   to any new language.
2. Open a discussion issue first, before doing the work. We will help
   you scope it and decide whether to proceed.
3. Extend the `Locale` type in `src/i18n.ts`.
4. Translate every key in the `translations` object.
5. Translate all prompt templates in `src/lib/prompt-templates.ts`,
   keeping the placeholder set identical.
6. Add the language button in `index.html` and wire it in
   `src/i18n.ts`.
7. Extend the parity tests in `tests/i18n.test.ts` and
   `tests/prompt-templates.test.ts`.
8. Run `npm run ci`. All tests must pass.

---

## Changing the visual theme

The default theme is dark, with a light theme available via a manual
toggle. The theme is driven by CSS custom properties in `src/style.css`
and a small TS module in `src/theme.ts`.

To change the look:

- **Color tokens** are at the top of `src/style.css` under `:root` and
  `:root[data-theme="light"]`. Edit them and reload.
- **Font** is set in `src/style.css` via the `--font-*` custom
  properties. If you want to bundle a custom font, add it under
  `public/` and reference it from `src/style.css`.
- **Component styling** is a mix of Tailwind utility classes (in
  `index.html` and the `src/components/*` files) and a few hand-written
  rules in `src/style.css` for the things Tailwind cannot express
  ergonomically.

---

## Adding a section to the home page

The home page is `index.html`. Each major section is a root `<div>`
with an `id` that the matching `src/components/*` module mounts into
during `initDirectory()`. The current roots are:

- `#ai-tools-root` — AI tools directory
- `#dev-tools-root` — Developer tools directory
- `#ai-models-root` — Models panel
- `#tool-stacks-root` — Tool stacks panel
- `#onboarding-root` — Onboarding flow
- `#guides-root` — Getting-started guides
- `#prompt-templates-root` — Prompt templates section

To add a new section:

1. Add a `<section>` with a new root id to `index.html`.
2. Implement a renderer in `src/components/your-section.ts` that takes
   the root element and returns an API (or nothing, if stateful state
   is not needed).
3. Wire it into `src/directory.ts` inside `initDirectory()`.
4. Add tests in `tests/`.
5. Run `npm run ci`.

---

## What to do with a working fork

Once you have a fork that does something useful for your community:

1. Host it. See [`docs/DEPLOYMENT.md`](DEPLOYMENT.md).
2. Document the changes in your fork's README. What did you add, what
   did you remove, who is it for.
3. If any of the changes are general enough to benefit the main
   project, open a PR. We review external contributions with the
   process in [`docs/CONTRIBUTING.md`](CONTRIBUTING.md).



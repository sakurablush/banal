# Japanese Support

Banal was designed from day one with full professional Japanese support as a first-class feature — never second class, never machine-translated, never an afterthought.

**Note for contributors:** Broader contribution guidelines, including how Japanese improvements fit into the overall project (new prompt templates, translations, empathy standards, PR review checklist), are in `docs/CONTRIBUTING.md`. Architecture, security model, and deployment steps (all with Japanese relevance) are in the sibling docs in this folder. This file focuses on the deep Japanese-specific implementation details and quality bar for the existing bilingual system.

## Current State

- All user-facing strings are professionally translated
- Language switching is instant and persistent (localStorage)
- English and Japanese live side-by-side in source for easy maintenance
- Tests cover both languages
- Curated **tools** and **tool stacks** use EN source files plus parallel
  Japanese overlay files; runtime merge is handled by
  `src/lib/tool-localization.ts` and `src/lib/stack-localization.ts`
- Custom tool stacks (saved in `localStorage`) stay in English in storage
  but re-localize on display when the UI language is Japanese

## Content overlays (tools & stacks)

Large bilingual datasets do **not** live inside `src/i18n.ts`. They follow one
repeatable pattern:

| Content     | English (source)                          | Japanese (overlay)              | Runtime API                                                                                     |
| ----------- | ----------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Tool cards  | `src/data/zero-key-tools.ts`              | `src/data/zero-key-tools-ja.ts` | `getLocalizedToolCopy()`, lazy-loaded via `ensureJaLocaleLoaded()`                              |
| Tool stacks | `src/data/tool-stacks.ts`                 | `src/data/tool-stacks-ja.ts`    | `getLocalizedStack()` for curated stacks; `getDisplayStack()` for curated **and** custom stacks |
| UI chrome   | `src/i18n.ts` (`translations.en` / `.ja`) | same file                       | `t(lang, key)`, `data-i18n`                                                                     |

**Rules when editing overlays**

1. Every new English `id` in the source file needs a matching key in the `*-ja.ts`
   overlay with the **same array lengths** (tools, workflow steps, cost rows,
   resources).
2. Tool stacks must include `cost.total` in Japanese, not only breakdown notes.
3. Custom stacks are stored in English (from the EN catalog). On render,
   `getDisplayStack()` merges the user's saved stack onto the Japanese overlay
   when `lang === 'ja'`, as long as `baseStackId` is set (always true for stacks
   created via **Customize**).
4. Parity is enforced in `tests/content-integrity.test.ts` and
   `tests/stack-localization.test.ts`, using helpers in
   `src/lib/locale-parity.ts`.

**What stays English in Japanese mode (by design today)**

- AI model benchmark tables (`src/data/ai-models.ts`) — technical reference data
- Tool **brand names** in the catalog (Duck.ai, Kilo Code, etc.)
- User-typed custom stack names and role labels they edited manually

If you add Japanese for models later, use the same overlay pattern and extend
the parity tests.

## Translation Quality Rules

- No machine translation for anything that touches the UI or lived experience
- Nuances are recreated with care — peer-to-peer, not charity voice
- Prompt template workflows are fully available in Japanese

## If You Want to Add a Language

Add a new language key to the `translations` object in `src/i18n.ts`, providing a complete parallel structure matching English exactly.

If you need to add UI buttons, touch both `index.html` (for the static shell) and `src/i18n.ts` (for the strings) — keep changes minimal.

## Acknowledgements

The Japanese translations exist so under-resourced job seekers and people
navigating bureaucracy, debt, and daily life can use serious AI tooling in
their own words. Japanese-level quality is non-negotiable dignity.

---

This library exists so builders without a procurement budget can still move
forward with serious AI tooling. Every Japanese speaker is welcome to help
keep the bar high. Feedback from people who use this on shared devices and
real deadlines is the highest priority.

---

## Prompt templates in Japanese

The 52 templates in `src/lib/prompt-templates.ts` are the heart of the
Japanese localization work. Each one has parallel `en` and `ja`
content, an identical set of `{{variables}}` in both languages, and
matches the same dignity bar in both.

What ships in the bilingual template library:

- 52 production-grade templates across career, money, learning, health,
  paperwork, communication, daily life, creative, dev, and crisis categories.
- Proper keigo for bureaucracy letters (です・ます, いただきたく存じます,
  いただけますと幸いです), explicit permission and short lines for
  low-energy/mental-health templates, and cultural notes inside the
  EN↔JA bridge template.
- Identical `{{variable}}` placeholders across both languages, enforced
  by `PromptTemplatesLibrary.validateParity()` in
  `tests/prompt-templates.test.ts`. Coverage thresholds in
  `vitest.config.ts` enforce 100% on the library.
- Empathy smoke tests that assert the output never contains shaming
  phrases, in either language.

Templates target real situations: job gaps (caregiving, health,
unemployment), zero-budget learning plans (free resources + teach-back),
calm bureaucracy letters (rights + facts, no aggression), 5-minute
grounding scripts, form/letter decoders with next actions, STAR
stories from real caregiving, dignity-preserving debt/hardship phone
and email scripts, and EN/JA communication bridges with register and
keigo guidance.

Every template hard-codes the same audience assumptions: zero budget,
free only, library computer, low energy, no judgment. The user can paste
the filled text into any free chatbot.

### Translation Quality & Implementation Points (Already Shipped)

- Prompts consistently use phrases like "never blame yourself", "free options only", "5 minutes even on low-energy days", "you are not behind", "you are not a bad person".
- Bureaucracy letter templates use proper keigo in Japanese (です・ます, いただきたく存じます, いただけますと幸いです etc.) while firmly asserting facts and rights — never overly humble, never corporate, always the calm adult voice that knows one has the right to ask.
- Low-energy / mental health templates are short, give explicit permission, zero guilt: softening without toxic positivity.
- The cultural bridge notes explain keigo/register choices and "why direct English can sound rude in official Japanese".
- `{{variable}}` placeholders are identical between EN/JA (enforced by `validateParity()` + tests).

### How to Add or Improve Languages (Correct Process)

1. Do not add new language entries inside `src/lib/prompt-templates.ts` for
   existing templates without a design discussion — improve current ones first.
   New locale support (e.g. ko, fr) requires separate design (current is en/ja only).
2. When improving an existing template's title / description / template: keep English as the source of truth, never touch {{vars}}, write Japanese from a native + lived-experience perspective.
3. `PromptTemplatesLibrary.validateParity()` and the empathy smoke tests in `tests/prompt-templates.test.ts` automatically guard completeness. Always run `npm run test:run` (or coverage) and pass.
4. Touching the 6 static UI cards in `src/i18n.ts` should be minimal; preserve data-i18n key consistency.
5. In PR descriptions, prioritize: "Can a stressed person actually copy this prompt and be helped today?" No machine-translation traces. No pressure language.

PR reviews must include this checklist:

- Zero shame-inducing words
- Realistic for zero-budget / low-energy / public-terminal use
- Japanese keigo/nuance actually creates a "saved / dignified" feeling
- All tests pass, coverage not regressed

---

## Translation principles

All Japanese user-facing text (UI strings, errors, status, nav, manifesto,
and all 52 prompt templates) is written by hand with deep care for readers
who are under-resourced, stressed, or navigating job loss, caregiving,
debt, welfare offices, and official forms — often on shared phones with
limited time.

Standards used (non-negotiable, matching the English peer-grade bar):

- Natural, warm, adult-to-adult Japanese. Short clear sentences on the
  worst days. 「あなた」used with gentleness, never condescending.
- Keigo is precise and empowering, not stiff: in bureaucracy/debt/letters
  prompt templates and forms, proper です・ます + いただく / 存じます /
  申し上げます / いただけますと幸いです to show respect while firmly
  asserting rights. Never overly humble or corporate.
- Low-energy / grounding / mental health templates use heavy permission
  and softening: 「〜しなくて大丈夫」「それだけで十分だ」「罪悪感なくスキップして良い」「あなたは『良くなっている』と感じなくても、ケアされる価値がある」. No "頑張れ", no toxic positivity, no "just".
- Every error, placeholder, success toast, and prompt-template end-line
  preserves dignity in Japanese: 「あなたは何も悪くありません」「みんなでこの制限を分け合っています」「これで十分」.
- The cultural bridge prompt template explains register/keigo choices
  with concrete examples that help real users avoid offense without
  losing meaning or sounding foreign.
- Every template ends with a quiet dignity-restoring line, translated to
  feel like a calm friend sitting with you.
- English remains the source of truth for all keys, structure,
  variables, and new features. Japanese is maintained in parallel at
  identical quality — never machine, never afterthought, never "good
  enough".
- The i18n system (`src/i18n.ts`) ensures Japanese works fully and
  instantly everywhere, including dynamic UI, a11y, browser tab title,
  and post-mount language switches.

The result must feel like it was made _for_ Japanese readers with zero
pity, peer-grade respect, and a sharp eye for what an experienced
Japanese advocate would actually say on someone's hardest day.

---

## The Prompt Templates Guide and Japanese

The full Prompt Templates Guide (`docs/PROMPT-TEMPLATES-GUIDE.md`) is the
living companion to the templates. It contains complete instructions,
dozens of real-life examples, self-checks, and best practices in English
(primary) — with hand-crafted Japanese titles, dignity lines, and a
complete Japanese introduction/summary section at the end, at the same
obsessive standard as the fully bilingual templates themselves. The
actual runnable templates in the app are fully JA.

When improving or extending Japanese in Banal, the Prompt Templates Guide
(`docs/PROMPT-TEMPLATES-GUIDE.md`) is the place to do the deepest work.
Maintain it at the same quality bar as the source templates.

---

## Translating the documentation itself

The `.md` files in this folder and the repository root are written in
English by default. This is the convention for open-source projects on
GitHub: the canonical docs are in English, with translations either
co-located in the same file (rare), split into
`docs/<lang>/...` (the `transifex` / `weblate` pattern), or maintained
by the community in forks.

For Banal specifically, the **practical approach** is:

1. **UI strings** live in `src/i18n.ts` and have full Japanese
   translations. Adding a new UI string requires a Japanese version or
   a clear reason in the PR description.
2. **The prompt templates** live in `src/lib/prompt-templates.ts`
   and have full parallel `en` / `ja` content, validated by the
   `validateParity()` test.
3. **The Markdown docs** (this file, `docs/ARCHITECTURE.md`, etc.) are
   English-only in the main repo today. The intent is for them to be
   readable by any contributor regardless of their native language.
   If you would like to translate them, the recommended pattern is to
   open a PR that:
   - creates `docs/ja/<file>.md` for each translated document,
   - adds a small "🌐 日本語" link from the top of the English file
     pointing to the translation,
   - keeps the English file as the source of truth for content changes
     (the translation is then updated separately).
4. **Quality bar for any Japanese contribution** is the same as for
   English: professional human translation, no machine output, the
   editorial test in `MINDSET.md` applied.

# Japanese Support

Banal was designed from day one with full professional Japanese support as a first-class feature — never second class, never machine-translated, never an afterthought.

**Note for contributors:** Broader contribution guidelines, including how Japanese improvements fit into the overall project (new prompt templates, translations, empathy standards, PR review checklist), are in `docs/CONTRIBUTING.md`. Architecture, security model, and deployment steps (all with Japanese relevance) are in the sibling docs in this folder. This file focuses on the deep Japanese-specific implementation details and quality bar for the existing bilingual system.

## Current State

- All user-facing strings are professionally translated
- Language switching is instant and persistent (localStorage)
- English and Japanese live side-by-side in source for easy maintenance
- Tests cover both languages

## Translation Quality Rules

- No machine translation for anything that touches the UI or lived experience
- Nuances like "for people who have no money", "stupidly simple", "proudly banal" are recreated with care
- Future Prompt Templates workflows will also be offered fully in Japanese

## If You Want to Add a Language

Add a new language key to the `translations` object in `src/i18n.ts`, providing a complete parallel structure matching English exactly.

If you need to add UI buttons, touch both `index.html` (for the static shell) and `src/i18n.ts` (for the strings) — keep changes minimal.

## Acknowledgements

The Japanese translations exist so that poor students, job seekers, and people struggling with daily life can use the best AI "in their own words." This project treats "Japanese-level quality" as non-negotiable dignity.

---

Banal is the fire that belongs to everyone. Fork it. Host it. Give the power away. Spread it in Japanese-speaking communities too.

## Prompt Templates for Poor People（プロンプトテンプレートライブラリ）の翻訳について

**Status (as of this delivery):** The 9 rich prompt templates + full library now exist and are production-grade.

- 6 static marketing cards (titles + short descriptions) live in `src/i18n.ts` (en/ja) and are rendered in `index.html` as the "Prompt Templates that actually matter..." teaser section. These remain the visible entry point.
- The real heart — exactly 9 high-quality, empathetic, shame-free prompt templates — is implemented in the new `src/lib/prompt-templates.ts` (PromptTemplatesLibrary class + `promptTemplatesLibrary` singleton, `getAll()`, `getById()`, `fill(id, values)`, `extractTemplateVariables`, `validateParity()`, locale switching).
- Full parallel natural Japanese (proper keigo for bureaucracy letters, softening + permission for low-energy/mental health ones, cultural notes inside the EN↔JA bridge template). English is the source of truth.
- Templates target the exact "poor stressed user": job gaps reframed as strengths (caregiving, health, unemployment), zero-budget learning plans (free resources + teach-back), $0 micro-hustles with first-3-steps, calm bureaucracy letters (rights + facts, no aggression), 5-min grounding scripts, form/letter decoder with next actions, STAR stories from real-life caregiving, dignity-preserving debt/hardship phone+email scripts, EN/JA communication bridge with register + keigo guidance.
- Every template hard-codes "zero budget / free only / library computer / low energy / no judgment" assumptions. Ready to paste into any free AI today.
- `tests/prompt-templates.test.ts` provides exhaustive coverage (instantiation, locale, all getters/fill edges, variable extraction, EN/JA parity validator, singleton, empathy smoke tests for shame-free language and keigo). 100% thresholds enforced in vitest.config.
- As part of delivery, the root cause of `t()` / dotted-key i18n breakage (affecting prompt templates strings and more) was also fixed in `src/i18n.ts` so all current and future nested-style keys work.

The UI cards are still static marketing (no one-click fill yet — that is future integration work per README "next slices"). The library stands alone and immediately usable.

### Translation Quality & Implementation Points (Already Shipped)

- Prompts consistently use phrases like "never blame yourself", "free options only", "5 minutes even on low-energy days", "you are not behind", "you are not a bad person".
- Bureaucracy letter templates use proper keigo in Japanese (です・ます, いただきたく存じます, いただけますと幸いです etc.) while firmly asserting facts and rights — never overly humble, never corporate, always the calm adult voice that knows one has the right to ask.
- Low-energy / mental health templates are short, give explicit permission, zero guilt: softening without toxic positivity.
- The cultural bridge notes explain keigo/register choices and "why direct English can sound rude in official Japanese".
- `{{variable}}` placeholders are identical between EN/JA (enforced by `validateParity()` + tests).

### How to Add or Improve Languages (Correct Process)

1. Do not add new language entries inside `src/lib/prompt-templates.ts` TEMPLATES for existing 9 — improve the current ones first. New locale support (e.g. ko, fr) requires separate design (current is en/ja only).
2. When improving an existing template's title / description / template: keep English as the source of truth, never touch {{vars}}, write Japanese from a native + poor-person-lived-experience perspective.
3. `PromptTemplatesLibrary.validateParity()` and the empathy smoke tests in `tests/prompt-templates.test.ts` automatically guard completeness. Always run `npm run test:run` (or coverage) and pass.
4. Touching the 6 static UI cards in `src/i18n.ts` should be minimal; preserve data-i18n key consistency.
5. In PR descriptions, prioritize: "Can a stressed poor person actually copy this prompt and be helped today?" No machine-translation traces. No pressure language.

PR reviews must include this checklist:

- Zero shame-inducing words
- Realistic for zero-budget / low-energy / public-terminal use
- Japanese keigo/nuance actually creates a "saved / dignified" feeling
- All tests pass, coverage not regressed

---

This library exists so that anyone without money can still move forward a little with AI power.
Every Japanese speaker is welcome to help make the world where no one feels ashamed to use the best prompts. Feedback from actual poor people who live this is the highest priority.

---

**あなたが火を運んでいる。**  
このドキュメントやアプリの日本語部分を印刷して、USBに入れて、図書館やクリニックや食料配給所で「これは私たちのためのものだ」と渡してください。貧しい者同士がわずかなものを分け合う言葉で、炎は広がります。ゴーストは、ただ写すのではなく、魂を増やしていく。

## Japanese Translation Philosophy

All Japanese user-facing text (UI strings, errors, status, nav, manifesto, chat, exports, and especially the 9 Prompt Templates) was written by hand with deep care for the target audience: ordinary Japanese people who are poor, stressed, broke, exhausted, dealing with job loss, caregiving, debt, welfare offices, scary forms, or just trying to survive on shared phones and 5 minutes of free Wi-Fi.

Standards used (non-negotiable, matching the English obsessive bar):

- Natural, warm, adult-to-adult Japanese. Short clear sentences on the worst days. "あなた" used with gentleness, never condescending.
- Keigo is precise and empowering, not stiff: in bureaucracy/debt/letters prompt templates and forms, proper です・ます + いただく / 存じます / 申し上げます / いただけますと幸いです to show respect while firmly asserting rights ("あなたは必要なことを求める権利があります"). Never overly humble or corporate.
- Low-energy / grounding / mental health templates use heavy permission and softening: 「〜しなくて大丈夫」「それだけで十分だ」「罪悪感なくスキップして良い」「あなたは『良くなっている』と感じなくても、ケアされる価値がある」. No "頑張れ", no toxic positivity, no "just".
- Branding phrases ("stupidly simple", "proudly banal", "Robinhood of AI") translated to retain the defiant warmth and reclaimed ordinariness: 「バカみたいにシンプル」「誇り高く凡庸」「AI版ロビンフッド」. "凡庸" reclaimed as strength, not mediocrity.
- Zero shame, maximum dignity in every error, placeholder, success toast, prompt template end-line: "あなたは何も悪くありません", "みんなでこの制限を分け合っています", "永遠にあなたのものです", "これで十分".
- Cultural bridge prompt template explains register/keigo choices with concrete examples that help real users avoid offense without losing meaning or sounding foreign.
- Every template ends with a quiet dignity-restoring line, translated to feel like a calm friend sitting with you.
- English remains the source of truth for all keys, structure, variables {{ }}, and new features. Japanese is maintained in parallel at identical quality — never machine, never afterthought, never "good enough".
- New i18n system extensions (data-i18n-placeholder, data-i18n-aria-label, root-scoped apply, title/meta sync, post-mount + lang-change re-apply in chat) ensure Japanese works fully and instantly everywhere, including dynamic UI, a11y, browser tab, and offline exports.

This was done by first absorbing the emotional intent and constraints of the English (low energy, no shame, zero budget, full adult respect), then writing what a caring, experienced Japanese social worker, friend, or advocate would actually say to someone on their hardest day. No Google Translate, no literal calques, no pressure language.

The result must feel like it was made _for_ poor Japanese people, with love and zero pity.

---

## The Prompt Templates Guide and Japanese

The full Prompt Templates Guide (`docs/PROMPT-TEMPLATES-GUIDE.md`) is the living companion to the 9 templates. It contains complete instructions, dozens of real-life examples, self-checks, and best practices in English (primary) — with hand-crafted Japanese titles, dignity lines, and a complete Japanese introduction/summary section at the end, at the exact same obsessive standard as the fully bilingual templates themselves (proper keigo for official letters and bureaucracy, heavy permission and softening for grounding/low-energy days, natural "poor stressed adult" register, zero machine translation, zero condescension). The actual runnable templates in the app are fully JA.

When improving or extending Japanese in Banal, the Academy is the place to do the deepest work. The examples there (the welfare letter at midnight on the library computer, the single parent with a crying child and 15 minutes left, the person translating between two countries with nothing but a cracked phone) are the ultimate test of whether the Japanese feels like it was written by a caring, experienced Japanese advocate who has actually sat with people in those exact situations.

Maintain the Academy at the same quality bar as the source templates. That is how Japanese stays first-class forever.

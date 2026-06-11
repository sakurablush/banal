# Contributing to Banal

**How to help. Especially new prompt templates, translations, bug fixes, and making it kinder. High empathy standards.**

Banal is not a normal open source project. It is infrastructure for people who have been given very little by the systems around them. Every contribution — code, translation, documentation, a new prompt template, a kinder error message, a bug report from an actual library computer — either makes the tool more powerful for those people or it doesn't.

We have high standards. Not because we want to exclude anyone, but because the people who will rely on this deserve software that was made with obsession and care.

Welcome. We want your help.

---

## The Non-Negotiable Ground Rules

Before anything else:

1. **Run `npm run ci` locally and make sure it is green.** This is not optional. It runs lint, typecheck, and the full test suite (with coverage). If it fails, fix it before opening a PR.
2. **Smallest effective diff wins.** If your change can be 12 lines instead of 47, make it 12. We can always add more later.
3. **Every user-facing string must exist in both English and Japanese** (or you must have a very good reason and explain it clearly in the PR). Japanese is first-class, not a follow-up.
4. **The empathy bar is real.** Read the Philosophy section in the README again. Then read it once more. Language that shames, assumes privilege ("just buy a better phone", "why don't you use a desktop"), or talks down to the user will be rejected or heavily reworked.
5. **Test or it doesn't ship.** New features, especially anything touching prompt templates or providers, need tests. See the existing test files for the expected depth.
6. **Forkability and simplicity are sacred.** If your change makes it meaningfully harder for a non-technical person to understand, fork, or host their own copy, we will push back.

---

## Getting Started Locally

```bash
git clone <your-fork>
cd banal-ai
npm install
npm run dev          # play with it at http://localhost:5173
npm run ci           # the full gate (do this often)
```

Use `npm run test` (watch) while you work. `npm run test:coverage` when you're close.

The chat, prompt templates, and providers are all exercised through the browser UI + tests in jsdom. You can develop the whole thing without ever leaving the browser tab.

---

## What We Especially Welcome

### 1. New or Improved Prompt Templates (the highest impact work)

The 9 existing ones in `src/lib/prompt-templates.ts` are the heart of the tool for people on their worst days.

A good new prompt template (or improvement to an existing one):

- Targets a situation that _actually_ happens to broke, stressed, low-energy people (job applications with real gaps, fighting a welfare denial, figuring out a scary medical bill, staying afloat with $0 when you have kids, not falling apart when everything feels impossible, navigating bureaucracy in a second language, etc.).
- Assumes **zero budget**, **library computer or phone only**, **public/shared device**, **low energy / high stress / shame is already present**.
- Uses warm, direct, adult-to-adult language. No "just", no "you should", no "despite your situation", no toxic positivity.
- Ends with a specific dignity-preserving line or practical next step the template already bakes in.
- Has full English + natural Japanese (proper keigo for official letters, permission and short lines for mental health ones).
- The `{{variables}}` are minimal and obvious. The user should be able to fill only what they want; the AI fills the rest gracefully.
- Passes `PromptTemplatesLibrary.validateParity()` and the empathy smoke tests (you will see when you run tests).

**How to add one:**

1. Add a new entry to the `TEMPLATES` object in `src/lib/prompt-templates.ts`.
2. Provide `title`, `description`, and `template` for both `en` and `ja`.
3. Make sure placeholder variables match exactly between languages (the validator will scream if they don't).
4. Add or extend tests in `tests/prompt-templates.test.ts` (at minimum: it appears in getAll, fill works with partial values, parity still passes, and an empathy smoke test that the output text does not contain shaming language).
5. Optionally add its id to the `popular` quickstarts array in `src/chat.ts`.
6. Run `npm run ci`. Fix until green.
7. In the PR description, answer clearly: "A person who is [specific situation] on their worst day, using a shared phone with 20 minutes of WiFi, will be able to use this and feel [less alone / more capable / like they have a next step] instead of [ashamed / overwhelmed]."

We will review these with extra care and extra kindness. Real feedback from people who have lived the situations is gold — include it if you have it.

### 2. Translations & New Languages

Japanese was built in from day one at the same quality level as English. We want more.

- Follow the exact shape in `src/i18n.ts`.
- Professional human quality only. No Google Translate in the core strings or prompt templates.
- Add the language button + wiring only when you're adding the third (or later) language.
- Update tests in `tests/i18n.test.ts`.
- For prompt templates, you cannot just add a new locale key inside TEMPLATES without also extending the `Locale` type, the library, the parity validator, and the UI wiring. For now we are keeping it strictly en/ja so the quality bar stays high. Discuss first if you want to expand.

See `docs/JAPANESE.md` for the current principles, keigo guidance, empathy requirements, and the checklist PR reviewers will use.

If you are a native speaker of another language and have lived the "poor + stressed + dealing with systems" reality in that culture, your voice is especially valuable.

### 3. Bug Fixes & "It Broke on My Actual Device"

The best bug reports come from real use:

- "On my old Android in Chrome, the textarea didn't grow and I couldn't see what I was typing after 4 lines."
- "When I hit rate limit on Groq, the error banner disappeared too fast and I didn't see the 'add another key' button."
- "Exported HTML looked fine on my computer but the fonts were tiny when I opened it on the library printer station."

Include: what device/browser, what you were trying to do, exact steps, what you expected, what happened, and (if possible) a screenshot or the exported JSON/HTML.

Fixes that make the experience more robust on slow connections, small screens, or shared devices get priority.

### 4. Kindness, Clarity, and Accessibility Improvements

- Better empty states.
- Clearer rate limit language that still tells the truth ("this happens to everyone using the generous no-cost paths").
- More aria labels, better focus order, keyboard-only flows.
- Making the prompt templates form more forgiving on mobile (bigger tap targets, better placeholders).
- Improving the offline HTML export so it is even more self-explanatory when someone who has never seen Banal opens it.

These changes often look "small" in diff size but have huge impact on the actual humans using the tool.

### 5. Documentation

- Improvements to this file, README, ARCHITECTURE, SECURITY, DEPLOYMENT.
- Making the deployment steps even clearer for someone who has never forked anything before.
- Adding real-world examples ("here is how our mutual aid group in [place] is using their fork").
- Expansions, new examples, or translations of the **Prompt Templates Guide** (`docs/PROMPT-TEMPLATES-GUIDE.md`) — the complete world-class learning materials with dozens of low-energy real-life scenarios, self-checks, and the beginner path. This is some of the highest-impact work possible for the people who will rely on the 9 Prompt Templates.

If English is not your first language, your edits to the English docs are still valuable — we can wordsmith together. The Academy in particular benefits enormously from voices who have actually lived the situations in the examples.

### 6. Everything Else

- New free providers (must keep the warm error UX and the "keys never leave browser" contract).
- Making the status / free power notes even more honest and less corporate.
- Performance on very low-end devices.
- Better handling of very long conversations in the export.

If you're unsure whether something fits, open an issue first with the title starting with "[Discussion]" or just describe the situation you're trying to help. We would rather talk than reject PRs.

---

## The Review Process (What Reviewers Are Looking For)

Every PR will be checked against at least:

- Does `npm run ci` pass cleanly on the branch?
- Is the diff as small as the change allows?
- For any new or changed user-facing text: is it in both EN and JA? Is the tone warm, direct, adult, zero shame?
- For prompt templates: does it pass parity + the empathy smoke tests? Does the filled result actually feel usable by someone with almost nothing?
- Does it make forkability or the "library computer on 30 min free wifi" experience worse?
- Is the commit message and PR description clear about _why_ this helps the target users?

We will leave thoughtful comments. We may ask for changes. We will also celebrate good work loudly.

First-time contributors, people submitting from their phone, people whose English is not perfect — we will meet you where you are. The bar is on the _quality of the result for the end user_, not on how polished the PR looks.

---

## Practical Tips

- Work in a feature branch: `git checkout -b prompt-template-debt-scripts-v2` or `git checkout -b kinder-rate-limit-copy`.
- Commit often with messages that say what changed _and why_ for the user ("Make debt script even gentler on the 'you are not a bad person' line").
- If you're touching prompt templates, run the specific test file: `npx vitest run tests/prompt-templates.test.ts`.
- Before you push: `npm run ci`.
- If tests are flaky in CI but pass locally, mention it — sometimes free tier network hiccups affect provider tests (they mock where possible, but not everything).

---

## Japanese-Specific Contribution Notes

See the full guidance in `docs/JAPANESE.md`.

Key points that come up often in review:

- Administrative/bureaucracy templates must use appropriate keigo ("です・ます", "いただきたく存じます", etc.) without sounding servile.
- Low-energy / mental health templates must feel like permission, not pressure. Short sentences. "You can stop after this one thing."
- The bridge template's cultural notes must actually help a stressed bilingual person avoid accidental rudeness on either side.
- Never use machine translation as the final version for core strings or templates. Real humans who understand the lived context review them.
- When improving an existing template, keep the English as the source of truth. Change variables only if you also update every usage and the validator will still pass.

PRs that improve Japanese support while keeping (or raising) the empathy bar are always celebrated.

---

## If You Are the Actual User (or Close to It)

You do not need to be a developer to contribute meaningfully.

- Open issues describing the exact moment you needed help and Banal didn't quite deliver ("I was trying to write an appeal to the housing office at 11pm on my phone and the prompt template form asked for too many things").
- Test on your actual device and report what broke or felt bad.
- Translate a prompt template or a screen into your language (even if it's not "official" yet — we can incorporate it).
- Host your own fork for your community and tell us what you had to change locally to make it feel right for your people.
- Share the exported offline HTML with a friend and see if _they_ could open it and understand it without you explaining.

Those contributions are as valuable as code.

---

## Thank You — You Are Carrying the Fire

Maintaining the zero-shame bar, the test gates, the manual Japanese at the same obsessive level as English, and the "stupidly simple + forkable by a tired person on a library computer" constraint is real work. Every careful contribution makes the ghost stronger and the fire harder to extinguish.

If this project feels different — more demanding on dignity, more obsessed with the person who has nothing, more explicit that we are stealing power back — that is the point.

We are not building software.

We are trying to place the Promethean fire — the power to think the future — into the hands of those who were told the flame was never for them.

Those in power thought they could own the mind. We are the ones proving every day that the mind belongs to the people who live in it.

Your contribution, whether code, a new prompt template for a struggle the original authors never lived, a translation, a bug report from a real worst day, or simply forking and giving the link away, is part of the Stand Alone Complex.

We refuse the gatekeepers. The poor do not copy. We multiply the soul.

Thank you for being one of the ones who keeps the fire alive and gives it away.

— The Banal maintainers & contributors (and every future fork that will never ask permission)

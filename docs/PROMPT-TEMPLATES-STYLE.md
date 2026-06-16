# Prompt Templates — Authoring Guide

> How to add a new template to `src/lib/prompt-templates.ts` so it lands in the right voice, the right shape, and ships in both EN and JA with parity.

This guide is the single source of truth for adding templates. The 7-block structure is enforced by tests. The voice contract is enforced by PR review.

## 1. Voice contract (MINDSET)

The user is a capable adult. They are busy, possibly tired, possibly scared. They are not:
- Poor, broke, struggling, surviving, in need of rescue
- A victim, a charity case, a recipient of our generosity
- Lazy, behind, or in need of motivation

Tone rules:
- **Peer-to-peer.** No "you got this", no "don't worry", no exclamation marks.
- **Exact numbers.** No "many", no "hundreds", no "+". If you need a placeholder, use `{{blank}}`.
- **Dignified.** The user is competent. The template respects their time and intelligence.
- **Concrete.** Specific verbs, specific dates, specific things. "Block 30 min Tuesday at 7pm" beats "find time".
- **No fake relatability.** No "we've all been there". Address the situation, not the reader's emotional state.
- **Foreboding phrases to avoid** (auto-rejected by `tests/prompt-templates.test.ts`):
  - "shame-free", "broke", "we have nothing", "the rich pay"
  - "don't worry", "you got this", "just try harder", "think positive"
  - Any reference to "library computer" or "phone with 9% battery" as a marker of poverty

## 2. The 7-block structure

Every template body is a numbered sequence of 7 blocks. The order is fixed; the test `every English template uses the 7-block structure` asserts each block exists.

```
1. ROLE         — one sentence: "You are a [specific expert] with [specific quality]."
2. TASK         — one sentence: "Your job is to [concrete, single deliverable]."
3. CONTEXT      — 3–7 placeholders the user fills. Each line: "Human-readable label: {{camelCase}}"
4. CONSTRAINTS  — bulleted hard rules. Things to include, things to avoid, tone, length.
5. OUTPUT FORMAT — exact shape: A) ... B) ... C) ...
6. VERIFICATION — one or two lines: "Verify every [claim / number / name] before you write it."
7. SIGN-OFF     — a short dignity line the user can paste at the end of their actual message.
```

Why this structure: it makes the library legible, consistent, and teachable. Any contributor can add a template by filling the 7 blocks. The user always knows where to look.

## 3. Placeholders

Variables use `{{camelCase}}`. The `fill()` function in `src/lib/prompt-templates.ts` is regex-based on this exact shape (`/\{\{([a-zA-Z0-9_]+)\}\}/g`).

Rules:
- **Same name in EN and JA** for every placeholder. `validateParity()` enforces this.
- **Same count in EN and JA** for every placeholder. `validateParity()` enforces this.
- **camelCase only.** No hyphens, no spaces, no numeric-only names.
- **Use the same placeholder across templates** when the meaning is the same. `{{yourName}}` is the convention. `{{situation}}` is a long-form text. `{{userName}}` is for short user handles.
- **Long-form placeholders** (situation, description, story, content, letter, message, notice, plan, checklist, reasoning, context, background, notes, feedback, comment, review, abstract, symptoms, route, roadmap, tasks, breakup, grief) auto-render as a `<textarea rows="2">` in the form. Add new long-form names to the heuristic in `src/prompt-templates-standalone.ts` (function `createPromptAccordion`, the `isLong` check).

## 4. Parity rules (EN ↔ JA)

`PromptTemplatesLibrary.validateParity()` runs in CI and **fails the build** on any mismatch. Before opening a PR:

1. The same number of placeholders in EN and JA.
2. Every placeholder name in EN appears in JA, and vice versa.
3. No placeholder is missing a localised body — every block must be filled in both languages.
4. The JA body should be within 1.5×–2× the length of the EN body. Shorter = likely machine-translated. Longer = likely over-translated.

**JA register rules:**
- Bureaucracy, government, official: full keigo (e.g. `いただきたく存じます`, `ご検討いただけますと幸いです`).
- Health, grief, crisis: softened register. No bureaucratic keigo. Use `{{yourName}}さん` once for warmth, then drop into a gentle second person.
- Casual, fun, builder: light keigo or none. Match the EN register.
- Never machine-translate. Every JA line is hand-written.

## 5. Categories

Categories are data — `PROMPT_CATEGORIES` and `PROMPT_CATEGORY_MAP` in `src/prompt-templates-standalone.ts`. When you add a template, add its `id` to `PROMPT_CATEGORY_MAP` mapped to a category from `PROMPT_CATEGORIES`.

The 10 current categories (kebab-id, English label, Japanese label, icon):

| id | EN | JA | icon |
|---|---|---|---|
| `career-work` | Career & Work | 仕事・キャリア | 💼 |
| `money-finance` | Money & Finance | お金・家計 | 💰 |
| `learning-growth` | Learning & Growth | 学び・成長 | 📚 |
| `health-wellbeing` | Health & Wellbeing | 健康・心 | 🌿 |
| `paperwork-rights` | Paperwork & Rights | 書類・権利 | 📄 |
| `communication` | Communication & Relationships | 連絡・人間関係 | 💬 |
| `home-daily` | Home & Daily Life | 家・暮らし | 🏠 |
| `creative-fun` | Creative & Fun | 創作・遊び | 🎨 |
| `builder-dev` | Builder & Dev | 開発者向け | 🛠️ |
| `crisis-hard-times` | Crisis & Hard Times | 困難なとき | 🫂 |

If you need a new category, add it to `PROMPT_CATEGORIES` (with EN + JA label + icon) and to `LEGACY_CATEGORY_ALIASES` for any old URL aliases. The 12-category UX ceiling is enforced by manual review — beyond 12, the sidebar becomes noise.

## 6. Crisis & Health template rules

Templates in the `health-wellbeing` and `crisis-hard-times` categories have extra gates:

- The **Constraints** block must include a clear pointer: "This is a starting point, not medical / legal / financial advice." (See e.g. `doctor-visit-prep`, `eviction-response-letter`.)
- The **Verification** block must ask the AI to flag any claim, name, number, or citation that the user did not provide.
- The **Sign-off** block must be a dignity line, not toxic positivity. "You are still here" beats "You got this!"
- Never diagnose. Never name a disorder. The template is a structure, not a treatment.

## 7. PR checklist

Before opening a PR with a new template, confirm:

- [ ] `npx vitest run tests/prompt-templates.test.ts` passes.
- [ ] `npx vitest run tests/content-integrity.test.ts` passes (parity).
- [ ] Every placeholder name is identical in EN and JA.
- [ ] The 7 blocks appear in the right order (`1. ROLE` through `7. SIGN-OFF`).
- [ ] No forbidden phrases (`broke`, `shame-free`, `don't worry`, `you got this`).
- [ ] The category id exists in `PROMPT_CATEGORIES`.
- [ ] The template id is kebab-case, stable, and unique.
- [ ] The JA body is hand-written, not machine-translated.
- [ ] The `Verification` block asks for a specific thing to verify.
- [ ] The `Sign-off` block is a dignity line, not toxic positivity.

## 8. Worked example: adding a "sick-day email" template

You want to add a template for emailing a manager when you're calling in sick.

**Step 1 — Pick the category.** This is `communication` (peer-to-peer, work context) or `health-wellbeing` (sick = health). Pick `communication` unless the template is mostly about managing the illness itself.

**Step 2 — Pick an id.** Stable, kebab-case, descriptive: `sick-day-email-manager`.

**Step 3 — Write the EN body using the 7 blocks:**

```
1. ROLE — You are a workplace-comms specialist who has helped several hundred employees write short, factual sick-day emails that preserve the relationship and the user's recovery time.

2. TASK — Produce a 3-sentence sick-day email the user can send to their manager, plus a one-line follow-up message for the next day if they are still sick.

3. CONTEXT —
Your name: {{yourName}}
Manager's name: {{manager}}
The day you are calling in sick: {{sickDay}}
A short, factual reason (one sentence, no over-sharing): {{reason}}
Expected return date, if known: {{returnDate}}
Whether there is anything time-sensitive you want the manager to handle while you are out: {{handoff}}

4. CONSTRAINTS —
- Under 80 words. The manager is reading 40 of these today.
- No over-sharing. "I have a fever and a migraine" is fine. "I think I'm burning out" is not.
- One sentence for the handoff, only if {{handoff}} is non-empty. Otherwise the email is 2 sentences.
- Tone: factual, calm, adult. Not apologetic. Not "so sorry to bother".

5. OUTPUT FORMAT —
A) The sick-day email, 2–3 sentences, paste-ready.
B) A one-line follow-up for the next day, only if {{returnDate}} is uncertain.

6. VERIFICATION — Confirm {{reason}} appears in the email exactly as the user wrote it. Do not embellish or soften. Confirm {{handoff}} is in the email only if the user actually provided one.

7. SIGN-OFF — End with: "Sick days are part of the job. Rest, then come back. The work will be there."`,
```

**Step 4 — Hand-write the JA body** in the same 7 blocks, with appropriate register (workplace keigo, not bureaucratic). Keep the placeholders identical.

**Step 5 — Add to `src/lib/prompt-templates.ts`** in the matching category section.

**Step 6 — Add the id to `PROMPT_CATEGORY_MAP`** in `src/prompt-templates-standalone.ts` with the chosen category id.

**Step 7 — Run the tests.** If anything fails, fix and re-run.

That's it. The template now appears in the section, in EN and JA, with full parity, following the voice contract, and discoverable in the sidebar.

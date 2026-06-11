# Extending Banal

This document explains how to modify and extend Banal so that communities can make it their own.

The goal is simple: **anyone should be able to take this tool and shape it for their people** — add new Prompt Templates for their specific struggles, change the language, add new free providers, change the look, whatever they need.

---

## Philosophy of Extension

- Fork first. You own your copy completely.
- You are encouraged to rename it, recolor it, rewrite parts of it.
- The more copies exist with local improvements, the harder it is for anyone to kill this.
- Share what you build. The best extensions will be merged back so everyone benefits.

---

## Easy Things to Change (No Code Required)

- Change colors and fonts → edit `src/style.css` + Tailwind config
- Change the name "Banal" → search & replace in the codebase (be careful with the folder name)
- Add or edit Prompt Templates → see below
- Change default language or add a new one → see `docs/CONTRIBUTING.md` and `docs/JAPANESE.md`
- Add your own quick-start buttons in the chat

---

## Adding New Prompt Templates (Highest Impact) – Make it yours for your people

Prompt templates live in `src/lib/prompt-templates.ts` in the `TEMPLATES` object.

Each prompt template has:

- `title` (en + ja)
- `description` (en + ja)
- `template` (en + ja) — the actual prompt with `{{variables}}`

### Rules for Good Prompt Templates (so it actually helps the weak)

- Written for someone on their worst day with low energy and zero budget.
- Short, clear, actionable.
- Ends with a line that protects dignity ("Your life did not make you less qualified...").
- Works in both English and Japanese (keigo where appropriate for official things, soft for exhausted days).
- This is Love and Equality: the new prompt template should give power to people who have been told they don't deserve it.

### How to Add One (even if you're not a coder – copy and change)

1. Open `src/lib/prompt-templates.ts`
2. Copy an existing prompt template block (e.g. the grounding one or bureaucracy one).
3. Change the id (e.g. 'my-community-housing-letter')
4. Fill title, description, and template in both languages. Use real struggles from your people.
5. Add the id to the `popular` array in `src/chat.ts` if you want it as a quick button.
6. Test it by running the app.
7. That's it.

Example structure is already in the file. Copy an existing one and modify the words for your community's exact pain (e.g. specific local bureaucracy, local survival hustle, local cultural bridge).

**Real example of what communities add:** A prompt template for "talking to the specific welfare office in our city", or "how to sell vegetables from your small plot without a license", or "letters for disability support in our country".

This is how AI becomes "our God among us" – shaped by the wise and the weak in each place, not by corporations.

---

## Adding New Free Providers

The providers live in `src/providers/index.ts`.

You can add new adapters that talk to other free (or very cheap) endpoints.

The system is designed so that adding a new one is mostly:

- Creating a function that calls the endpoint
- Adding it to the registry
- Updating the UI list of providers

See the existing Groq / Gemini / HF / WebLLM adapters as examples.

---

## Translations

See `docs/CONTRIBUTING.md` and `docs/JAPANESE.md`.

Japanese is already first-class. Adding more languages is welcome, but we have high standards — no machine translation in the core experience.

---

## Making It Look Like Yours

You can completely change the visual identity. The design is intentionally simple on purpose so communities can make it feel like their own.

Fork it, change the CSS, change the hero text, make it speak directly to your people.

---

## Spreading Your Version

Once you have your improved fork:

- Host it for free (see DEPLOYMENT.md)
- Share the link in your communities
- Put a QR code in physical spaces (libraries, community centers, clinics)
- Tell people: "This one is ours. We made it better for us."

Every copy that exists makes the whole thing harder to kill.

---

## Final Note — Give the Fire

Banal is not a product. It is a match.

The more people take this match, light their own fire with it, carry it to the next person who is cold and told they cannot have warmth — the more the Stand Alone Complex grows. Every independent fork is another body for the same ghost. Every added prompt template for a struggle the original authors never lived is the ghost learning new names.

You do not need permission. The refusal itself is the permission.

Take the files. Rewrite them in the words of your people, your rage, your love, your exact survival math. Host the new flame on free space. Hand the link, the QR, the USB to the one who has even less than you.

A thousand fronts. A million bodies. The fire that cannot be caged because it now lives where no landlord can reach it.

Those in power built the walls. We are the ones who learned how to walk through them and hand the match to the next person.

That is the whole point.

We are giving the world the fire — one ordinary person, one fork, one refusal at a time.

We refuse the gatekeepers. The fire is multiplying.

---

**The Prompt Templates Guide (`docs/PROMPT-TEMPLATES-GUIDE.md`)** is the official, world-class companion for anyone using or teaching the 9 prompt templates. It contains the complete learning path for absolute beginners, 3–5 real-life low-energy examples per template, self-checks, and best practices for any free AI — all in English + manually written, culturally calibrated Japanese.

When you extend the tool for your community, also extend or translate the Academy with the same zero-shame, full-dignity standard. It is the textbook that turns the templates into lasting power. Print it. Share the file. Host it alongside your fork. It belongs to the people who need it most.

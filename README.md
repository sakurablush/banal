# Banal

**Free, forkable, professional-grade AI and developer tools, curated for the people who pay for their own stack out of pocket.**

Banal is a single static website that bundles a curated directory of 273
tools that work in a browser without payment, plus 9 high-leverage prompt
templates written for the real situations independent builders, students,
caregivers, career-changers, and solo founders face. Each tool is tagged
honestly: some require a free account (`free-tier`), some are open-source
with local setup, some are public APIs. See
[the voice guide](MINDSET.md#what-banal-is-and-is-not) for the four
definitions.

No backend. No accounts. No installs. No telemetry. One folder you can clone,
host for free, copy to a USB, or open directly from disk.

---

## What you get

- **273 curated tools**, organized by category and verified against their public
  URLs. See [the verification history](docs/verification/) for the latest run.
- **9 prompt templates** in English and Japanese, designed for zero-budget,
  low-energy, real-life situations: job gaps, bureaucracy letters, debt
  negotiation, grounding, learning plans, micro-hustles, decoding forms,
  caregiving-as-STAR-stories, and EN↔JA communication.
- **Static delivery.** The whole app is HTML, CSS, and TypeScript that runs in
  the browser. Build once, host anywhere.
- **Bilingual from day one.** English and Japanese at the same quality bar.
- **MIT licensed.** Fork, rename, host, and give it away.

---

## Quick start

```bash
git clone https://github.com/yourname/banal
cd banal
npm install
npm run dev
```

Open <http://localhost:5173>.

Or open `dist/index.html` directly in a browser after `npm run build`. There is
no server required at any step.

---

## The tool directory

The 273 tools are split into two top-level groups.

**AI tools (178).** Chat, image, video, audio, writing, PDF, search, math,
presentations, coding assistants, agents, open-source models, and model
catalogs.

**Developer tools (95).** Coding IDEs, backend/hosting/databases, automation,
security/privacy, productivity, learning/career, public-data APIs, design and
diagramming, and docs/knowledge APIs.

Each entry shows: name, what it is, the real URL, and the four honest "free"
tags (`no-login`, `public-api`, `open-source`, `free-tier`) — see
[the voice guide](MINDSET.md#what-banal-is-and-is-not) for definitions.

---

## The 9 prompt templates

Stored in `src/lib/prompt-templates.ts` as data, available in the app under the
"Prompt Templates" section, and portable to any other free chatbot.

| ID                        | What it does                                                  |
|---------------------------|---------------------------------------------------------------|
| `job-gaps-as-strengths`   | Cover letters and resume bullets when life created gaps.      |
| `zero-budget-learning`    | A 15-minute-a-day learning plan using only free resources.    |
| `micro-hustles`           | $0-start hustles with first-3-steps and no upfront money.     |
| `bureaucracy-letters`     | Factual letters to welfare offices, landlords, hospitals.    |
| `form-decoder`            | Turn terrifying official letters into plain language + actions. |
| `grounding-low-energy`    | 5-minute grounding for days you have nothing left.            |
| `star-stories-caregiving` | Turn unpaid caregiving into STAR stories hiring managers recognize. |
| `debt-hardship-scripts`   | Negotiate debt while keeping your dignity and mental health.  |
| `en-ja-cultural-bridge`   | Bridge English and Japanese worlds with dignity.              |

Every template ships with parallel `en` and `ja` content, has matching
`{{camelCase}}` variables in both languages, and is validated by
`PromptTemplatesLibrary.validateParity()` and empathy smoke tests in the test
suite.

Full instructions, real-life examples, and self-checks live in
[`docs/PROMPT-TEMPLATES-GUIDE.md`](docs/PROMPT-TEMPLATES-GUIDE.md).

---

## Honest limitations

- "Free" means four different things in this directory. Read the four tags
  before assuming a tool will work the way you expect.
- Free tiers change. Tools get rate-limited, redesigned, or shut down. The
  [verification history](docs/verification/) records the latest snapshot; the
  source data lives in `src/data/zero-key-tools.ts` and you can update it.
- AI outputs can be wrong, biased, or refuse legitimate requests. Verify
  anything important.
- Some entries require a free account with the provider (the `free-tier` tag).
  That is still free; it is just not account-free.

---

## Architecture in 30 seconds

- **Stack:** Vite + TypeScript + Tailwind. Build output is pure static files
  in `dist/`.
- **No backend.** There is no server, database, or auth provider. All data the
  user creates (language preference, theme, custom stacks, saved filters,
  prompt-template form values) lives in their own `localStorage` /
  `sessionStorage`. Nothing is sent anywhere except the URLs the user clicks.
- **No runtime npm dependencies** for end users. Dependencies only affect
  contributors and CI.
- **Test gate:** `npm run ci` runs lint, typecheck, and the full Vitest suite
  (currently 541 tests across 22 files). Coverage is enforced.
- **CI:** lint + typecheck + test + audit on every push, plus a weekly
  [`verify-tools`](.github/workflows/verify-tools.yml) workflow that audits
  every tool URL and writes a date-stamped summary to
  [`docs/verification/`](docs/verification/).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full picture.

---

## Documentation

- [`MINDSET.md`](MINDSET.md) — voice, tone, and editorial rules
  (read this before changing user-facing copy).
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — code structure, data flow,
  and trade-offs.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — how to fork, build, and host
  your own copy.
- [`docs/EXTENDING.md`](docs/EXTENDING.md) — adding prompt templates, tools,
  languages, and visuals.
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — ground rules, review
  process, and how to file good bug reports.
- [`docs/SECURITY.md`](docs/SECURITY.md) — security model, threat model, and
  how to report issues.
- [`docs/PROMPT-TEMPLATES-GUIDE.md`](docs/PROMPT-TEMPLATES-GUIDE.md) — full
  learning material for the 9 templates.
- [`docs/JAPANESE.md`](docs/JAPANESE.md) — Japanese translation principles
  and review checklist.
- [`docs/verification/`](docs/verification/) — date-stamped verification
  snapshots of the tool catalog.
- [`PENTEST_REPORT.md`](PENTEST_REPORT.md) — adversarial review and current
  security posture.

---

## License

MIT. See [`LICENSE`](LICENSE) or the `license` field in
[`package.json`](package.json).

Fork it. Host it. Give it to the next person who needs it.


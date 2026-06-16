# Banal

**Free, forkable reference for AI and developer tools — curated for builders who fund their own stack.**

Banal is a single static site: **273 tools** with honest access labels, **52 prompt
templates** in English and Japanese, **38 open models**, and **10 workflow stacks.
No backend. No accounts. No installs. No telemetry. Clone it, host it for free,
copy it to a USB, or open `dist/index.html` from disk.

Counts come from live data in `src/data/site-stats.ts` — not marketing round
numbers. See [MINDSET.md](MINDSET.md) for voice and editorial rules.

---

## What you get

- **273 curated tools** (178 AI, 95 developer), organized by category. URLs are
  audited weekly; the [latest snapshot](docs/verification/) shows which links
  still respond (249/273 as of 2026-06-16 — bots and rate limits cause false negatives). [Full directory →](docs/TOOLS-DIRECTORY.md)
- **52 prompt templates** in EN/JA — career, money, health, paperwork, dev
  workflows, crisis scripts. Copy, fill blanks, paste into any free chat listed
  in the app.
- **38 open models** and **10 tool stacks** for common zero-budget workflows.
- **Static delivery.** HTML, CSS, TypeScript in the browser. Build once, host
  anywhere.
- **Bilingual from day one.** English and Japanese at the same quality bar.
- **MIT licensed.** Fork, rename, host, give it away.

---

## Quick start

```bash
git clone https://github.com/yourname/banal
cd banal
npm install
npm run dev
```

Open <http://localhost:5173>.

Or open `dist/index.html` directly after `npm run build`. No server required.

---

## The tool directory

**273 tools** in two top-level groups. Every card shows access type and caveats
before you click.

| Group | Count | Covers |
|-------|------:|--------|
| AI tools | 178 | Chat, image, video, audio, writing, PDF, search, math, presentations, coding, agents, OSS models |
| Developer tools | 95 | IDEs, hosting, automation, security, productivity, learning, public APIs, design, docs |

**Access labels** (stated on every card):

| Label | Meaning |
|-------|---------|
| `no-login` | Works in the browser without an account |
| `public-api` | Documented API, no paid tier required to start |
| `open-source` | Source available; may need local setup |
| `free-tier` | Free account or freemium; signup required |
| `free-key` | Free API key (usually no credit card) |
| `self-host` | Run on your own machine or server |

Free tiers change. The [verification history](docs/verification/) records each
weekly audit; source data lives in `src/data/zero-key-tools.ts`.

### Full list

Browse every entry with links, surfaces, and access labels:
**[docs/TOOLS-DIRECTORY.md](docs/TOOLS-DIRECTORY.md)** (auto-generated — run
`npm run generate:tools-readme` after catalog edits).

---

## Prompt templates

**52 templates** in `src/lib/prompt-templates.ts`, rendered in the app under
**Prompt Templates**. Fill the form → **Copy Filled** → paste into Duck.ai,
Copilot, ChatGPT free, Gemini, or any tool in the directory.

| Category | Count | Examples |
|----------|------:|---------|
| Career & Work | 6 | Job gaps, STAR caregiving stories, salary negotiation |
| Money & Finance | 6 | Debt hardship, rent letters, invoice collection |
| Learning & Growth | 5 | Zero-budget learning plan, career skill roadmap |
| Health & Wellbeing | 5 | Grounding, doctor visit prep, panic anchor |
| Paperwork & Rights | 5 | Bureaucracy letters, form decoder, small claims |
| Communication | 6 | EN↔JA bridge, difficult conversations, school emails |
| Home & Daily Life | 5 | Meal planning, moving checklist, vet visit prep |
| Creative & Fun | 5 | Short stories, song lyrics, birthday cards |
| Builder & Dev | 5 | Code review, bug reports, ADRs, commit messages |
| Crisis & Hard Times | 4 | Grief, job loss 72h, eviction response |

Every template has parallel `en` / `ja` content, matching `{{camelCase}}`
placeholders, parity validation (`PromptTemplatesLibrary.validateParity()`), and
empathy smoke tests.

Full learning material:
[`docs/PROMPT-TEMPLATES-GUIDE.md`](docs/PROMPT-TEMPLATES-GUIDE.md).

---

## Honest limitations

- "Free" means several different things here. Read the access label on the card.
- Free tiers change. Tools get rate-limited, redesigned, or shut down. Weekly
  audits catch breakage; always test the tool yourself before relying on it.
- AI outputs can be wrong, biased, or refuse legitimate requests. Verify
  anything important.
- Banal has no built-in chat. Templates are copy-paste into external tools you
  choose.

---

## Architecture in 30 seconds

- **Stack:** Vite + TypeScript + Tailwind. Output is static files in `dist/`.
- **No backend.** Language, theme, stacks, filters, and prompt drafts live in
  `localStorage` / `sessionStorage` on your device only.
- **No runtime npm dependencies** for end users.
- **Test gate:** `npm run ci` — lint, typecheck, Vitest (662 tests across 36
  files), coverage enforced, `npm audit --audit-level=moderate`.
- **CI:** every push + weekly
  [`verify-tools`](.github/workflows/verify-tools.yml) catalog audit →
  [`docs/verification/`](docs/verification/).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Documentation

| Doc | What it covers |
|-----|----------------|
| [MINDSET.md](MINDSET.md) | Voice, tone, editorial rules |
| [SPIRIT.md](SPIRIT.md) | Why the project exists |
| [docs/TOOLS-DIRECTORY.md](docs/TOOLS-DIRECTORY.md) | Full 273-tool directory (generated) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Code structure and trade-offs |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Fork, build, host |
| [docs/EXTENDING.md](docs/EXTENDING.md) | Add tools, templates, languages |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | PR process and ground rules |
| [docs/SECURITY.md](docs/SECURITY.md) | Threat model and local storage |
| [docs/PROMPT-TEMPLATES-GUIDE.md](docs/PROMPT-TEMPLATES-GUIDE.md) | Deep guide to the templates |
| [docs/PROMPT-TEMPLATES-STYLE.md](docs/PROMPT-TEMPLATES-STYLE.md) | Authoring rules for new templates |
| [docs/JAPANESE.md](docs/JAPANESE.md) | Japanese translation principles |
| [docs/verification/](docs/verification/) | Date-stamped URL audit snapshots |
| [PENTEST_REPORT.md](PENTEST_REPORT.md) | Adversarial security review |

---

## License

MIT. See [`LICENSE`](LICENSE) or `package.json`.

Fork it. Host it. Give it to the next builder who needs it.

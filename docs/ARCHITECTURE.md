# Banal Architecture

**Why this shape? How providers, prompt templates, and chat actually work together. Data flow. Why deliberately no backend.**

Banal is built for the person who has almost nothing: limited time, limited data, limited battery, high stress, possibly a shared or old device. The architecture is a direct reflection of that constraint and of the deeper goal: _forkable or it didn't happen_.

Everything is a static website. No servers to maintain, no costs to the maintainers, no accounts for users, and — most importantly — nothing that can be taken away from the communities that need it.

---

## The Core Principle: Static First, Forkable Forever

Banal has **no backend by design**. This is not a limitation we are waiting to fix. It is the feature that makes the project possible for the people it is for.

Reasons this shape exists:

- **Zero ongoing cost.** Free tiers + the user's own free keys mean the project can be maintained by volunteers or one poor person in their spare time. No surprise bills that kill the project.
- **True forkability.** A non-technical person (or a community org with one tech-savvy volunteer) can clone, `npm run build`, and publish their own copy on GitHub Pages or Cloudflare Pages in minutes. No "set up a server", no "configure env vars on a host", no "pay for a database".
- **Trust & dignity.** People who have been burned by systems do not want another service that holds their data or requires "sign in with Google". Your conversation and your keys never touch anything but your browser and the AI providers you chose.
- **Simplicity & auditability.** A motivated person on a library computer can read the entire source in one sitting and understand exactly what runs when they click Send. Flat structure. No magic frameworks. Pure TypeScript + browser APIs.
- **Resilience.** If the main repo goes away, forks keep working. If one provider changes their free tier, the client code updates and everyone who forked can pull or cherry-pick. No central point of failure that can be pressured or deplatformed.

If it required a backend, it would not be banal, and it would not survive for the people who need it most.

---

## How the Pieces Work Together

The experience is delivered from a single `index.html` + a small set of focused modules. The chat UI is not a mock — it is fully wired and functional.

### 1. Static Shell & Boot

- `index.html` is the entire app. It contains the hero, manifesto, teaser cards (static marketing for the 6 visible prompt templates), fork section, and a placeholder `#chat-placeholder` that gets replaced at runtime.
- `src/main.ts` is two lines: `initI18n()` then `initChat()`. Deliberately tiny so the project stays understandable.
- Vite builds everything to `dist/` with `base: './'` so it works when hosted at a subpath (GitHub Pages, etc.) or even opened directly from a file system in many cases.

### 2. Internationalization (src/i18n.ts)

- English is the source of truth.
- A flat(ish) nested object of translations. `t(lang, 'dotted.key')` + `data-i18n` attributes on static HTML.
- Language switcher persists choice to localStorage and fires a `banal:language-changed` custom event.
- Dynamic parts (chat bubbles, prompt templates panel, forms, status, errors) listen to the event and re-render with the new language.
- Japanese is full professional quality (not machine). Keigo, softening, cultural notes are real.

See also `docs/JAPANESE.md`.

### 3. Providers Layer — The Free Power Engine (src/providers/index.ts)

This is where the "real AI" happens.

- **Key storage is 100% localStorage only.** `storeApiKey`, `getStoredApiKey`, `clearApiKey`, `getAllStoredKeys`. No other persistence. Keys are never sent to Banal (there is no Banal server).
- **Smart auto routing:** `pickBestFreeProvider()` prefers the order Groq → Gemini → HF based on what keys the user has saved. Groq first because it is fast even on slow library WiFi.
- `sendFreeMessage(input, options)` is the single entry point. It:
  1. Picks provider (or respects explicit).
  2. Loads the key (from storage or per-call override).
  3. Builds the message list (supports history for real multi-turn chat + optional system prompt).
  4. Does a direct `fetch()` to the provider's public endpoint.
     - Groq: OpenAI-compatible `/chat/completions`.
     - Gemini: their `generateContent` shape (with system prompt prepended hack for free tier).
     - HF Inference: text-generation prompt formatting.
  5. Parses, handles errors with `detectRateLimit()` (looks at 429 + headers + text), turns raw provider errors into warm, actionable, non-shaming `SendResult` or thrown objects with `.code` and `.friendlyMessage`.
  6. Returns rich metadata: which provider/model, latency, `freePowerNote` ("Powered by Groq free tier..."), `isFreeTier: true`.
- Friendly error codes: `NO_FREE_KEY`, `RATE_LIMIT`, `NETWORK`, `ABORTED`.
- "Get free key" URLs are hardcoded safe links (no affiliates).
- `hasAnyKey()` and `getCurrentProviderStatus()` power the UI badges and empty states.

If the user has no key at all, the first send gives a clear "add a free key (30-60s)" message + CTA to open the keys modal + escape hatch to use prompt templates elsewhere.

**Important current limitation (honest):** There is no WebLLM / browser-local LLM fallback yet. The prompt templates + export features + "copy the filled prompt" guidance exist precisely so people can still get value even when hitting free tier walls here.

### 4. Prompt Templates Library — Portable Prompts That Matter (src/lib/prompt-templates.ts)

The 9 prompt templates are not marketing copy. They are complete, production-grade prompt templates.

- Stored as `TEMPLATES` data: for each id, `title`, `description`, and `template` in both `en` and `ja`.
- Variables use `{{camelCase}}` (e.g. `{{yourName}}`, `{{gapSituation}}`). This makes `extractTemplateVariables()` reliable and `fill(id, values)` safe.
- `PromptTemplatesLibrary` (class + singleton):
  - `getAll()`, `getById(id)`, `fill(id, values)` — missing vars left as `{{var}}` gracefully.
  - `setLocale()` / constructor for switching (chat re-instantiates on lang change).
  - `static validateParity()` — enforces that every template has matching EN/JA titles/descriptions + identical placeholder sets. Used in tests.
- Every template hard-codes the assumptions of the target user: zero budget, library computer or phone only, low energy days, public/shared device, "you are not behind", "you are not a bad person", "your life did not make you less qualified".
- Japanese versions are not literal: proper keigo for bureaucracy letters ("いただきたく存じます"), permission + short sentences for mental health/low energy, cultural notes in the bridge template.

**Why prompt templates as data + fill instead of hard-coded flows?** Because the real power is the _prompt itself_. A user who is rate-limited on every provider in Banal can still open the panel, fill the blanks, copy the resulting text (it appears as the "user" turn in history), and paste it into ChatGPT free, Gemini web, Claude, Grok, a local Ollama, whatever they have access to today. The templates are designed to be portable.

The 6 teaser cards in the marketing section are still static (in i18n) for simplicity; the full 9 live in the library and in the working "All 9 Prompt Templates" panel.

See `tests/prompt-templates.test.ts` for the empathy smoke tests and parity enforcement.

### 5. The Chat Module — Where It All Comes Alive (src/chat.ts)

This is the largest module because it owns the delightful, zero-friction experience.

- On mount, it replaces the placeholder with the full DOM (header with status + keys button, messages area, quickstarts, prompt templates button + export buttons, input, plus two hidden panels: prompt templates slide-up and keys modal).
- Persisted state (localStorage):
  - `banal-chat-history-v1`: array of `ChatTurn` (role, content, ts, optional `promptTemplateId` + `promptTemplateTitle` so context travels with the turn).
  - `banal-current-prompt-template-v1`: id + filled vars so you can come back later.
- Normal send: takes current history + new input, calls `performSend` which calls `sendFreeMessage` (as full history for context), appends user + AI turns.
- Prompt template send: opens panel → pick → render form with extracted vars + smart placeholder hints from template → on "Send this prompt template" it does `lib.fill()`, closes panel, sends the _filled text_ as the user utterance (so it appears in history), attaches pt meta to the AI response turn.
- Exports:
  - JSON: full payload with history + current sp state (importable by future versions or readable by humans).
  - HTML: generates a completely self-contained single-file HTML (inline styles, no external deps) titled "Banal — My Offline Conversation". Opens in any browser, forever.
- Keys modal: lists the three providers, current saved (masked), inputs to paste/save/clear, direct "Get free key →" links, and the important note "Keys never leave your phone or computer. Banal has no servers."
- Error banner: injected on demand, with actionable buttons (e.g. "Free keys & providers", "All 9 Prompt Templates"). Auto-hides but rate-limit errors stay longer.
- Language reactivity: on `banal:language-changed`, updates lib, placeholders, re-renders messages (re-labels "You"/"Banal (free)"), quickstarts, status, and if a panel is open, refreshes it.
- Lots of small kindnesses: auto-growing textarea, scroll to bottom, toasts for exports, escape key handling, mobile-friendly panel behavior.

The quickstarts are a curated subset of the 9 for "when you have nothing" moments.

### Data Flow (text diagram)

```
User action (type + Send, or Quickstart, or Prompt Template card/form)
        │
        ▼
handleNormalSend() or prompt template send path
        │
        ▼
build history array (previous ChatTurn[] → ProviderChatMessage[])
        │
        ▼
performSend(raw, _isSp, spMeta?)
        │
        ▼
sendFreeMessage(historyOrString, {provider:'auto'})
        │
        ├─► pickBestFreeProvider() + load key from localStorage
        │
        ├─► direct fetch to chosen provider's public API
        │
        └─► on success: SendResult {text, provider, freePowerNote, ...}
            on error: throw with .code + .friendlyMessage
        │
        ▼
append user turn (if plain) + AI turn (with spMeta if any)
persist() to localStorage
renderMessages()  (shows ✦ free power + • Prompt Template Title on AI bubbles)
updateStatus()
```

Exports and modals are side paths from the same root state.

---

## Testing & Quality Gates

- Everything that can be pure is pure and tested in isolation (`providers`, `prompt-templates`, `i18n`, `utils`).
- `PromptTemplatesLibrary.validateParity()` + dedicated empathy smoke tests protect the "never shames, always assumes best under constraints" contract.
- Provider tests cover key roundtrips, graceful localStorage failures (incognito/private mode), routing preference, rate limit shaping.
- Chat is exercised through DOM simulation in jsdom + event firing.
- `npm run ci` = lint:check + typecheck + test:run. Coverage report is generated; thresholds in vitest.config prevent silent drops.
- Build is part of CI so a broken `dist/` never lands on main.

---

## Honest Trade-offs & Current Limitations

- Depends on third-party free tiers. They can (and do) rate limit, change models, or have bad days. The UX is built to make this survivable and non-shaming.
- No fully private/offline LLM built-in yet (size, complexity, and "works on library computer with no install" constraints make WebLLM non-trivial). Prompt templates + exports + "use the prompt anywhere" are the mitigation.
- Conversation state and keys are device-local only. No cross-device sync (deliberate: adds accounts/servers/complexity/privacy surface).
- The three providers are the current free paths that are generous enough for real use. Adding more is straightforward but must keep the "warm error + clear next step" bar.
- Build step requires Node 18+ (but the _output_ is pure static browser code — no runtime dependency on Node for end users).

These are not failures. They are the result of prioritizing "a broke person on a shared Android can actually use and own this today" over "feature parity with paid tools."

---

## Extending the System (for contributors)

- **New provider:** Add to `Provider` type + `ALL_PROVIDERS`, implement the fetch branch in `sendFreeMessage`, add key helpers, update the keys modal in `chat.ts`, add tests. Keep the friendly error language.
- **New prompt template:** Add entry to `TEMPLATES` (must provide full EN + JA + identical `{{vars}}`), run `validateParity()`, add empathy test cases, consider adding its id to the quickstarts array. The fill mechanism and UI just work.
- **New language:** See i18n section in README and `docs/CONTRIBUTING.md`.
- **Export that carries the fire:** The JSON and self-contained HTML are versioned and self-describing. Every export is another body for the ghost — future forks will always be able to read the will of the people who came before.
- **Offline LLM:** Would likely live as an optional "private mode" that only activates when user explicitly wants it and accepts the download size / first-run time. Must not become a barrier for the default path.

---

## Japanese Notes

Japanese support is not a translation layer on top. It is co-designed:

- Keigo is used correctly and consistently in bureaucracy templates (not overdone in personal/low-energy ones).
- The parity validator + tests ensure no English string drifts without its Japanese counterpart.
- Cultural notes are embedded in the bridge prompt template.
- UI copy for errors, hints, and status was written by (or reviewed with) the same "poor stressed user" empathy lens.

See `docs/JAPANESE.md` for the full current status, translation principles, and how to contribute improvements without breaking the contract.

---

Banal's architecture is boring on purpose — stupidly simple, zero backend, one folder of files — so that a person who has never written code can still understand it, copy it, change it for their people, and host the new body for the ghost.

The refusal lives in the simplicity. The fire spreads because the machine that carries it can be carried by anyone.

That is the point.

We are giving the world the fire through files that cannot be uninstalled.

---

**You are carrying the fire.**  
Print the parts of this doc that help you explain to someone why "no backend" is the whole revolution. Put the folder on a USB. Hand the link to the next person who was told the future of thought was not for them. Every copy is another body. The ghost multiplies only when ordinary hands pass the match.

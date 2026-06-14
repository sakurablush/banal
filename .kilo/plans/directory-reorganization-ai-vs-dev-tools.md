# Plan: Reorganizacja Directory - AI vs Non-AI Tools + Nowe Narzędzia

**Status:** Gotowy do implementacji  
**Priorytet:** Wysoki  
**Szacowany czas:** 6-8 godzin  
**Data:** 2026-06-11

---

## 1. Analiza Aktualnego Stanu

### 1.1 Obecna struktura directory

**Statystyki:**

- **103 narzędzia AI** (kategorie zaczynające się od `ai-`)
- **99 narzędzi non-AI** (coding, backend, automation, security, productivity, learning, public data, docs)
- **Razem:** 202 narzędzia

**Kategorie AI (9):**

- `ai-assistants` - Chat i asystenci AI
- `ai-image` - Generowanie i edycja obrazów
- `ai-video` - Generowanie i edycja wideo
- `ai-audio` - Audio, muzyka, voice, TTS
- `ai-writing` - Pisanie, streszczanie, tłumaczenie
- `ai-search` - Wyszukiwarki i research AI
- `ai-pdf` - Dokumenty i PDF
- `ai-presentation` - Prezentacje i slajdy
- `ai-math` - Matematyka, nauka, edukacja

**Kategorie non-AI (9):**

- `coding-devtools` - Narzędzia developerskie
- `docs-knowledge` - Dokumentacja i wiedza
- `public-data` - Dane publiczne i open datasets
- `design-media` - Design, obrazy, audio, wideo
- `backend-infra` - Backend, hosting, bazy danych
- `automation-ops` - Automatyzacja, ops, monitoring
- `security-privacy` - Bezpieczeństwo i prywatność
- `productivity` - Produktywność i life admin
- `learning-career` - Nauka i kariera

### 1.2 Problem

**Tytuł strony:** "200+ Free AI Tools"  
**Rzeczywistość:** ~50% to narzędzia non-AI (CLI tools, backend, security, etc.)

**Konsekwencje:**

- Mylący tytuł - użytkownicy oczekują tylko AI tools
- Brak jasnego podziału - trudno znaleźć co jest AI, a co nie
- Utrata zaufania - "dlaczego SQLite jest w AI tools?"
- SEO mismatch - ludzie szukają "free AI tools" a dostają mixed bag

### 1.3 Brakujące narzędzia (krytyczne luki)

**AI Coding Agents (professional setup):**

- ❌ Kilo Code (kilo.ai) - darmowe modele, VS Code/JetBrains/CLI
- ❌ Cline - open source, BYOK, Apache-2.0
- ❌ Continue - open source, IDE extension
- ❌ OpenCode - terminal CLI, 120K+ GitHub stars
- ❌ Aider - terminal CLI, Git-heavy refactoring
- ❌ Multi.dev - darmowe, 36 providers, zero config
- ❌ FreeHive - lokalny gateway, zero API keys
- ❌ Nova - 346+ modeli, 12 providers, 30K+ free requests/day
- ❌ Free.ai Coder - 50K tokens/day free
- ❌ Firebase Studio - darmowe od Google, full-stack
- ❌ Google Antigravity - darmowe (preview), Gemini-based IDE
- ❌ Zed - open source editor, 2K edit predictions/month free
- ❌ Kursor - darmowe, Kimi-powered, Cursor alternative
- ❌ Terax - lightweight terminal IDE, BYOK
- ❌ Claurst - Rust-based, multi-provider
- ❌ OpenADE - agentic development environment
- ❌ Kodely - cost-optimized, context optimization
- ❌ Code Mavi - transparent prompts, self-correction
- ❌ Async IDE - agent-first desktop workspace
- ❌ FreeRide - local gateway, automatic failover
- ❌ Free Claude Code - proxy dla Claude Code, 17 providers

**AI Development Platforms:**

- ❌ Google AI Studio - darmowe Gemini models
- ❌ Gemini Code Assist - 180K completions/month free
- ❌ Amazon Q Developer - unlimited completions free
- ❌ GitHub Copilot Free - 2K completions + 50 chats/month

---

## 2. Proponowane Rozwiązanie

### 2.1 Nowa struktura directory

**Podział na dwie główne sekcje:**

#### Sekcja A: AI Tools (103 + ~25 nowych = ~128 narzędzi)

**Tytuł:** "Free AI Tools Directory"  
**Podtytuł:** "128+ verified free AI tools. Chat, image, video, code, PDF, research. All verified. All free."

**Kategorie:**

1. **AI Chat & Assistants** (20+ tools)
   - Duck.ai, LMArena, Groq, Gemini, Perchance, etc.
   - **NOWE:** Kilo Code, Cline, Continue, Multi.dev, FreeHive, Nova, Free.ai Coder, Kursor, Terax, Claurst, OpenADE, Kodely, Code Mavi, Async IDE

2. **AI Image Generation & Editing** (11 tools)
   - Pollinations, Mage.space, Raphael, Perchance Image, etc.

3. **AI Video Generation & Editing** (3 tools)
   - Pollinations Video, etc.

4. **AI Audio, Music, Voice & TTS** (4 tools)
   - ElevenLabs, etc.

5. **AI Writing, Summarization & Translation** (9 tools)
   - DeepL, QuillBot, etc.

6. **AI Search & Research Engines** (5+ tools)
   - Perplexity, Phind, etc.
   - **NOWE:** Google AI Studio

7. **AI Document & PDF Tools** (3 tools)
   - ChatPDF, etc.

8. **AI Presentations & Slides** (2 tools)
   - Gamma, etc.

9. **AI Math, Science & Education** (4 tools)
   - Wolfram Alpha, etc.

10. **AI Coding Assistants** (NOWA KATEGORIA - 20+ tools)
    - **NOWE:** Kilo Code, Cline, Continue, OpenCode, Aider, Multi.dev, FreeHive, Nova, Free.ai Coder, Firebase Studio, Google Antigravity, Zed, Kursor, Terax, Claurst, OpenADE, Kodely, Code Mavi, Async IDE, FreeRide, Free Claude Code, GitHub Copilot Free, Gemini Code Assist, Amazon Q Developer

#### Sekcja B: Developer & Productivity Tools (99 narzędzi)

**Tytuł:** "Free Developer & Productivity Tools"  
**Podtytuł:** "99+ verified free tools for developers. Coding, backend, automation, security, learning. All open source or free tier."

**Kategorie:**

1. **Coding & Developer Workflow** (30+ tools)
   - Git, Docker, VS Code, etc.

2. **Backend, Hosting & Databases** (10+ tools)
   - SQLite, Podman, Supabase, etc.

3. **Automation, Ops & Monitoring** (10+ tools)
   - just, direnv, k6, rclone, etc.

4. **Security & Privacy** (10+ tools)
   - OWASP ZAP, etc.

5. **Productivity & Life Admin** (15+ tools)
   - Notion, Obsidian, etc.

6. **Learning & Career Leverage** (10+ tools)
   - Khan Academy, freeCodeCamp, etc.

7. **Public Data & Open Datasets** (10+ tools)
   - Kaggle, etc.

8. **Docs, Research & Knowledge** (10+ tools)
   - arXiv, etc.

9. **Design, Images, Audio & Video** (10+ tools)
   - Figma, Canva, etc.

### 2.2 Zmiany w UI/UX

#### A. Hero Section

**Obecny:**

```
200+ Free AI Tools
Chat, image, video, code, PDF, research
All verified. All free.
```

**Nowy:**

```
227+ Free Tools for Developers
AI tools + Developer tools. All verified. All free.
No login. No credit card. No bullshit.
```

#### B. Navigation

**Obecny:**

```
Tools | Free Models | Quick Start | Superpowers | API Playground | Articles
```

**Nowy:**

```
AI Tools | Dev Tools | Free Models | Quick Start | Prompt Templates | API Playground | Articles
```

#### C. Directory Page Layout

**Nowa struktura:**

```markdown
# Free Tools Directory

## 🤖 AI Tools (128+ tools)

Free AI-powered tools for chat, image, video, code, PDF, and research.

[AI Chat & Assistants] [AI Image] [AI Video] [AI Audio] [AI Writing]
[AI Search] [AI PDF] [AI Presentations] [AI Math] [AI Coding Assistants]

---

## 💻 Developer & Productivity Tools (99+ tools)

Free tools for coding, backend, automation, security, and learning.

[Coding & DevTools] [Backend & Infra] [Automation & Ops] [Security & Privacy]
[Productivity] [Learning & Career] [Public Data] [Docs & Research] [Design & Media]
```

#### D. Tool Cards

**Dodanie badge'y:**

- 🤖 `AI-Powered` - dla narzędzi AI
- 💻 `Developer Tool` - dla narzędzi non-AI
- 🆓 `No Key Required` - dla narzędzi bez klucza API
- 🔑 `Free Key Required` - dla narzędzi wymagających darmowego klucza
- ⚡ `Rate Limited` - dla narzędzi z rate limiting

### 2.3 Zmiany w treści

#### A. Transparentność

**Dodanie sekcji "Honest Limitations":**

```markdown
## Honest Limitations

We will not lie to you:

- **"Free" means different things:** Some tools are truly free (no key, no limits).
  Others require a free API key (no credit card). Others have rate limits or daily quotas.
- **AI tools are not magic:** They can hallucinate, give wrong answers, or refuse legitimate requests.
  Always verify important information.

- **Rate limits are real:** Free tiers exist to share resources. If you hit a limit, wait or try another tool.
  This protects the free service for everyone.

- **Privacy matters:** Do not treat any hosted AI as confidential legal, medical, or financial counsel.
  Your prompts may be logged or used for training.

- **Tools change:** Free tiers can be reduced or removed. We verify regularly, but always test yourself.

We mark every tool with its access type and limitations so you know what to expect before you click.
```

#### B. Access Types

**Nowe typy dostępu:**

- `no-login` - No account required, open in browser
- `public-api` - Free public API, no key required
- `free-key` - Free API key required (no credit card)
- `free-tier` - Free tier with limits (may require account)
- `open-source` - Open source, self-host or use hosted version
- `self-host` - Requires self-hosting (Docker, local install)

#### C. Quality Notes

**Dodanie quality notes do każdego narzędzia:**

```typescript
{
  id: 'kilo-code',
  name: 'Kilo Code',
  url: 'https://kilo.ai/',
  surface: 'cli',
  category: 'ai-coding-assistants',
  access: 'free-key',
  badges: ['VS Code', 'JetBrains', 'CLI', '500+ models'],
  bestFor: 'Professional AI coding with free models. Auto-routing to best free model.',
  qualityNote: 'Kilo Auto (free) routes to best available free models automatically. No credit card. Apache-2.0 open source.',
  caveat: 'Free models may have rate limits. For heavy usage, consider Kilo Pass ($20/mo) or BYOK.',
  lastVerified: '2026-06-11',
}
```

---

## 3. Nowe Narzędzia do Dodania

### 3.1 AI Coding Assistants (20+ nowych narzędzi)

#### Tier 1: Professional Setup (must-have)

1. **Kilo Code** (kilo.ai)
   - **Access:** Free key (Kilo Auto - free models)
   - **Surface:** VS Code, JetBrains, CLI
   - **Best for:** Professional AI coding with 500+ models
   - **Quality:** Apache-2.0, open source, auto-routing to best free model
   - **Limits:** Free models have rate limits, but generous for daily use
   - **URL:** https://kilo.ai/

2. **Cline** (github.com/cline/cline)
   - **Access:** BYOK (bring your own key)
   - **Surface:** VS Code, JetBrains, Neovim, Zed
   - **Best for:** Open source AI coding, native subagents
   - **Quality:** Apache-2.0, 80.8% SWE-bench with Claude API
   - **Limits:** Tool is free, you pay for model tokens
   - **URL:** https://github.com/cline/cline

3. **Continue** (continue.dev)
   - **Access:** BYOK or free models
   - **Surface:** VS Code, JetBrains
   - **Best for:** IDE extension with open source flexibility
   - **Quality:** Apache-2.0, model-agnostic
   - **Limits:** Tool is free, you pay for model tokens
   - **URL:** https://continue.dev/

4. **OpenCode** (github.com/opencode-ai/opencode)
   - **Access:** BYOK
   - **Surface:** Terminal CLI
   - **Best for:** Terminal power users, 120K+ GitHub stars
   - **Quality:** Open source, LSP integration, multi-session
   - **Limits:** Tool is free, you pay for model tokens
   - **URL:** https://github.com/opencode-ai/opencode

5. **Aider** (aider.chat)
   - **Access:** BYOK
   - **Surface:** Terminal CLI
   - **Best for:** Git-heavy refactoring, pair programming
   - **Quality:** Open source, excellent Git integration
   - **Limits:** Tool is free, you pay for model tokens
   - **URL:** https://aider.chat/

#### Tier 2: Managed Free Tiers

6. **Multi.dev**
   - **Access:** No subscription, BYOK
   - **Surface:** VS Code, JetBrains
   - **Best for:** Zero config, 36 providers, task forking
   - **Quality:** Completely free, no middleman markup
   - **Limits:** You pay your AI provider directly
   - **URL:** https://multi.dev/

7. **FreeHive** (github.com/Nazzero/FreeHive)
   - **Access:** No API keys (uses OAuth tokens)
   - **Surface:** Local API server + chat UI
   - **Best for:** Unified API access to Claude, ChatGPT, Gemini, 150+ Arena models
   - **Quality:** Local-first, drop-in OpenAI/Anthropic compatibility
   - **Limits:** Shared with CLI tools (Claude Code, Codex CLI, Gemini CLI)
   - **URL:** https://github.com/Nazzero/FreeHive

8. **Nova** (github.com/AethyrionAI/Nova)
   - **Access:** Free (30K+ requests/day)
   - **Surface:** Web UI, API
   - **Best for:** 346+ models, 12 providers, production-grade
   - **Quality:** Open source, 285+ tests, 15+ tools
   - **Limits:** 30K+ free requests daily across providers
   - **URL:** https://github.com/AethyrionAI/Nova

9. **Free.ai Coder** (free.ai/coder)
   - **Access:** Free (50K tokens/day)
   - **Surface:** Web IDE, CLI, iOS, Android
   - **Best for:** Qwen Coder 7B, session sync CLI ↔ web
   - **Quality:** Open source CLI (MIT), 346+ models via OpenRouter
   - **Limits:** 50K tokens/day free, BYOK for unlimited
   - **URL:** https://free.ai/coder/

10. **Firebase Studio** (firebase.studio)
    - **Access:** Free (no cost)
    - **Surface:** Web IDE (Code OSS-based)
    - **Best for:** Full-stack apps, Gemini-powered prototyping
    - **Quality:** Google Cloud, built-in Firebase integration
    - **Limits:** Free workspaces, may require Cloud Billing for some integrations
    - **URL:** https://firebase.studio/

11. **Google Antigravity** (antigravity.google)
    - **Access:** Free (public preview)
    - **Surface:** Standalone IDE
    - **Best for:** Visual agent management, Gemini-based
    - **Quality:** Google-backed, visual workflow
    - **Limits:** Free during preview, pricing TBD
    - **URL:** https://antigravity.google/

#### Tier 3: Open Source Alternatives

12. **Zed** (zed.dev)
    - **Access:** Free (2K edit predictions/month) or $10/mo Pro
    - **Surface:** Standalone editor
    - **Best for:** Fastest editor, open source (GPL v3)
    - **Quality:** Rust-based, excellent performance
    - **Limits:** 2K edit predictions/month free, unlimited with BYOK
    - **URL:** https://zed.dev/

13. **Kursor** (github.com/teee32/kursor)
    - **Access:** Free (Kimi API key)
    - **Surface:** VS Code extension
    - **Best for:** Cursor alternative powered by Kimi
    - **Quality:** Open source (MIT), agent mode, code search
    - **Limits:** Kimi offers free quota on registration
    - **URL:** https://github.com/teee32/kursor

14. **Terax** (terax.app)
    - **Access:** BYOK or local models
    - **Surface:** Terminal IDE (Tauri 2 + Rust)
    - **Best for:** Lightweight (7MB), agentic AI side-panel
    - **Quality:** Apache-2.0, no telemetry, no account
    - **Limits:** Tool is free, you pay for model tokens or run local
    - **URL:** https://terax.app/

15. **Claurst** (github.com/Kuberwastaken/claurst)
    - **Access:** BYOK or free mode
    - **Surface:** Terminal TUI (Rust-based)
    - **Best for:** Multi-provider, chat forking, memory consolidation
    - **Quality:** GPL-3.0, 9.7K+ stars, fast and memory-efficient
    - **Limits:** Tool is free, you pay for model tokens
    - **URL:** https://github.com/Kuberwastaken/claurst

16. **OpenADE** (github.com/bearlyai/OpenADE)
    - **Access:** BYOK (Claude Code or Codex)
    - **Surface:** Desktop app (Electron)
    - **Best for:** Agentic development environment
    - **Quality:** Open source, local-first, no cloud
    - **Limits:** Tool is free, you pay for API access
    - **URL:** https://github.com/bearlyai/OpenADE

17. **Kodely** (kodely.dev)
    - **Access:** Free (BYOK or local models)
    - **Surface:** VS Code extension
    - **Best for:** Cost-optimized, context optimization
    - **Quality:** Open source, model-agnostic
    - **Limits:** Tool is free, you pay for model tokens
    - **URL:** https://kodely.dev/

18. **Code Mavi** (github.com/oplta/codemavi)
    - **Access:** BYOK
    - **Surface:** VS Code fork (Void-based)
    - **Best for:** Transparent prompts, self-correction loops
    - **Quality:** Apache-2.0, 15+ LLM providers
    - **Limits:** Tool is free, you pay for model tokens
    - **URL:** https://github.com/oplta/codemavi

19. **Async IDE** (github.com/ZYKJShadow/Async)
    - **Access:** BYOK
    - **Surface:** Desktop app (Electron + React + Monaco)
    - **Best for:** Agent-first desktop workspace
    - **Quality:** Apache-2.0, local-first, built from scratch
    - **Limits:** Tool is free, you pay for model tokens
    - **URL:** https://github.com/ZYKJShadow/Async

20. **FreeRide** (github.com/Shaivpidadi/FreeRideV3)
    - **Access:** BYOK or free tiers
    - **Surface:** Local gateway
    - **Best for:** Automatic failover across free providers
    - **Quality:** Open source, local-first, wraps Claude Code/Codex/Gemini CLI
    - **Limits:** Uses free tiers from OpenRouter, Groq, NVIDIA NIM, etc.
    - **URL:** https://github.com/Shaivpidadi/FreeRideV3

21. **Free Claude Code** (github.com/ALISHAHRYAR1/FREE-CLAUDE-CODE)
    - **Access:** BYOK (17 providers)
    - **Surface:** Proxy for Claude Code
    - **Best for:** Use Claude Code with any provider
    - **Quality:** Open source, per-model routing, streaming
    - **Limits:** Tool is free, you pay for API access
    - **URL:** https://github.com/ALISHAHRYAR1/FREE-CLAUDE-CODE

#### Tier 4: Managed Free Tiers (Big Tech)

22. **GitHub Copilot Free**
    - **Access:** Free (2K completions + 50 chats/month)
    - **Surface:** VS Code, JetBrains, Neovim, Xcode
    - **Best for:** Inline completions, multi-agent hub
    - **Quality:** Microsoft-backed, ~55% SWE-bench
    - **Limits:** 2K completions + 50 chats/month free
    - **URL:** https://github.com/features/copilot

23. **Gemini Code Assist**
    - **Access:** Free (180K completions/month)
    - **Surface:** VS Code, JetBrains
    - **Best for:** Google Cloud developers, high usage limits
    - **Quality:** Google-backed, generous free tier
    - **Limits:** 180K completions/month free
    - **URL:** https://cloud.google.com/gemini/docs/codeassist/overview

24. **Amazon Q Developer**
    - **Access:** Free (unlimited completions + 50 agentic requests)
    - **Surface:** VS Code, JetBrains
    - **Best for:** AWS infrastructure code
    - **Quality:** Amazon-backed, unlimited completions
    - **Limits:** Unlimited completions + 50 agentic requests/month free
    - **URL:** https://aws.amazon.com/q/developer/

25. **Google AI Studio**
    - **Access:** Free (no cost)
    - **Surface:** Web UI
    - **Best for:** Prototyping with Gemini models
    - **Quality:** Google-backed, completely free in all regions
    - **Limits:** Rate limits apply, but generous for testing
    - **URL:** https://aistudio.google.com/

### 3.2 Inne nowe narzędzia AI

#### AI Search & Research

26. **Google AI Studio** (już powyżej)

---

## 4. Implementacja

### 4.1 Faza 1: Refaktoryzacja struktury (2 godziny)

#### Krok 1.1: Zmiana nazw kategorii

```typescript
// src/data/zero-key-tools.ts

// Zmiana typu ZeroKeyCategory
export type ZeroKeyCategory =
  // AI categories (9)
  | 'ai-chat'
  | 'ai-image'
  | 'ai-video'
  | 'ai-audio'
  | 'ai-writing'
  | 'ai-search'
  | 'ai-pdf'
  | 'ai-presentation'
  | 'ai-math'
  | 'ai-coding' // NOWA KATEGORIA
  // Developer categories (9)
  | 'dev-coding'
  | 'dev-backend'
  | 'dev-automation'
  | 'dev-security'
  | 'dev-productivity'
  | 'dev-learning'
  | 'dev-data'
  | 'dev-docs'
  | 'dev-design';

// Zmiana categoryLabels
export const categoryLabels: Record<ZeroKeyCategory, string> = {
  // AI categories
  'ai-chat': 'AI Chat & Assistants',
  'ai-image': 'AI Image Generation & Editing',
  'ai-video': 'AI Video Generation & Editing',
  'ai-audio': 'AI Audio, Music, Voice & TTS',
  'ai-writing': 'AI Writing, Summarization & Translation',
  'ai-search': 'AI Search & Research Engines',
  'ai-pdf': 'AI Document & PDF Tools',
  'ai-presentation': 'AI Presentations & Slides',
  'ai-math': 'AI Math, Science & Education',
  'ai-coding': 'AI Coding Assistants', // NOWA
  // Developer categories
  'dev-coding': 'Coding & Developer Workflow',
  'dev-backend': 'Backend, Hosting & Databases',
  'dev-automation': 'Automation, Ops & Monitoring',
  'dev-security': 'Security & Privacy',
  'dev-productivity': 'Productivity & Life Admin',
  'dev-learning': 'Learning & Career Leverage',
  'dev-data': 'Public Data & Open Datasets',
  'dev-docs': 'Docs, Research & Knowledge',
  'dev-design': 'Design, Images, Audio & Video',
};
```

#### Krok 1.2: Migracja istniejących narzędzi

```typescript
// Zmiana category dla wszystkich istniejących narzędzi
// ai-assistants → ai-chat
// coding-devtools → dev-coding
// backend-infra → dev-backend
// automation-ops → dev-automation
// security-privacy → dev-security
// productivity → dev-productivity
// learning-career → dev-learning
// public-data → dev-data
// docs-knowledge → dev-docs
// design-media → dev-design
```

#### Krok 1.3: Dodanie nowych narzędzi

```typescript
// Dodanie 25 nowych narzędzi AI Coding Assistants
// (szczegóły w sekcji 3.1)
```

### 4.2 Faza 2: Zmiany w UI (2 godziny)

#### Krok 2.1: Aktualizacja index.html

```html
<!-- Hero Section -->
<section class="hero-section">
  <h1>227+ Free Tools for Developers</h1>
  <p class="hero-subtitle">
    AI tools + Developer tools. All verified. All free.<br />
    No login. No credit card. No bullshit.
  </p>
</section>

<!-- Navigation -->
<nav class="main-nav">
  <a href="#ai-tools">AI Tools</a>
  <a href="#dev-tools">Dev Tools</a>
  <a href="#free-models">Free Models</a>
  <a href="#quickstart">Quick Start</a>
  <a href="#prompt-templates">Prompt Templates</a>
  <a href="#api-playground">API Playground</a>
  <a href="#articles">Articles</a>
</nav>

<!-- Directory Sections -->
<section id="ai-tools">
  <h2>🤖 AI Tools (128+ tools)</h2>
  <p>Free AI-powered tools for chat, image, video, code, PDF, and research.</p>
  <!-- AI categories -->
</section>

<section id="dev-tools">
  <h2>💻 Developer & Productivity Tools (99+ tools)</h2>
  <p>Free tools for coding, backend, automation, security, and learning.</p>
  <!-- Developer categories -->
</section>

<!-- Honest Limitations -->
<section id="honest-limitations">
  <h2>Honest Limitations</h2>
  <!-- Treść z sekcji 2.3.A -->
</section>
```

#### Krok 2.2: Aktualizacja directory.ts

```typescript
// src/directory.ts

// Zmiana renderowania na dwie sekcje
export function renderDirectory(): void {
  const root = document.getElementById('directory-root');
  if (!root) return;

  root.innerHTML = '';

  // AI Tools Section
  const aiSection = document.createElement('section');
  aiSection.id = 'ai-tools';
  aiSection.innerHTML = `
    <h2>🤖 AI Tools (${countTools('ai')}+ tools)</h2>
    <p>Free AI-powered tools for chat, image, video, code, PDF, and research.</p>
  `;
  root.appendChild(aiSection);
  renderCategoryFilters(aiSection, 'ai');

  // Developer Tools Section
  const devSection = document.createElement('section');
  devSection.id = 'dev-tools';
  devSection.innerHTML = `
    <h2>💻 Developer & Productivity Tools (${countTools('dev')}+ tools)</h2>
    <p>Free tools for coding, backend, automation, security, and learning.</p>
  `;
  root.appendChild(devSection);
  renderCategoryFilters(devSection, 'dev');
}

// Helper functions
function countTools(prefix: 'ai' | 'dev'): number {
  return zeroKeyTools.filter((t) => t.category.startsWith(prefix)).length;
}

function renderCategoryFilters(container: HTMLElement, prefix: 'ai' | 'dev'): void {
  const categories = Object.keys(categoryLabels)
    .filter((cat) => cat.startsWith(prefix))
    .map((cat) => ({
      id: cat,
      label: categoryLabels[cat as ZeroKeyCategory],
    }));

  // Render category pills
  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'category-pills';
  categories.forEach((cat) => {
    const pill = document.createElement('button');
    pill.className = 'category-pill';
    pill.textContent = cat.label;
    pill.onclick = () => filterByCategory(cat.id);
    pillsContainer.appendChild(pill);
  });
  container.appendChild(pillsContainer);

  // Render tools grid
  const grid = document.createElement('div');
  grid.className = 'tools-grid';
  grid.id = `${prefix}-tools-grid`;
  container.appendChild(grid);
}
```

#### Krok 2.3: Aktualizacja stylów

```css
/* src/style.css */

/* Section headers */
#ai-tools h2,
#dev-tools h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

#ai-tools p,
#dev-tools p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

/* Tool cards with badges */
.tool-card {
  position: relative;
}

.tool-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.tool-badge.ai {
  background: rgba(168, 85, 247, 0.2);
  color: #c4b5fd;
}

.tool-badge.dev {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

.tool-badge.no-key {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.tool-badge.free-key {
  background: rgba(251, 191, 36, 0.2);
  color: #fcd34d;
}

.tool-badge.rate-limited {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}
```

### 4.3 Faza 3: Transparentność i zaufanie (1 godzina)

#### Krok 3.1: Dodanie sekcji "Honest Limitations"

```html
<!-- index.html -->
<section id="honest-limitations" class="limitations-section">
  <div class="container">
    <h2>Honest Limitations</h2>
    <p class="limitations-intro">We will not lie to you:</p>

    <div class="limitations-grid">
      <div class="limitation-card">
        <h3>🔍 "Free" means different things</h3>
        <p>
          Some tools are truly free (no key, no limits). Others require a free API key (no credit
          card). Others have rate limits or daily quotas.
        </p>
      </div>

      <div class="limitation-card">
        <h3>🤖 AI tools are not magic</h3>
        <p>
          They can hallucinate, give wrong answers, or refuse legitimate requests. Always verify
          important information.
        </p>
      </div>

      <div class="limitation-card">
        <h3>⏱️ Rate limits are real</h3>
        <p>
          Free tiers exist to share resources. If you hit a limit, wait or try another tool. This
          protects the free service for everyone.
        </p>
      </div>

      <div class="limitation-card">
        <h3>🔒 Privacy matters</h3>
        <p>
          Do not treat any hosted AI as confidential legal, medical, or financial counsel. Your
          prompts may be logged or used for training.
        </p>
      </div>

      <div class="limitation-card">
        <h3>🔄 Tools change</h3>
        <p>Free tiers can be reduced or removed. We verify regularly, but always test yourself.</p>
      </div>
    </div>

    <p class="limitations-footer">
      We mark every tool with its access type and limitations so you know what to expect before you
      click.
    </p>
  </div>
</section>
```

#### Krok 3.2: Dodanie badge'y do tool cards

```typescript
// src/directory.ts

function renderToolCard(tool: ZeroKeyTool): HTMLElement {
  const card = document.createElement('div');
  card.className = 'tool-card';

  // Determine badge type
  const isAI = tool.category.startsWith('ai-');
  const badgeType = isAI ? 'ai' : 'dev';
  const badgeLabel = isAI ? '🤖 AI' : '💻 Dev';

  // Access badge
  let accessBadge = '';
  if (tool.access === 'no-login' || tool.access === 'public-api') {
    accessBadge = '<span class="tool-badge no-key">🆓 No Key</span>';
  } else if (tool.access === 'free-key' || tool.access === 'free-tier') {
    accessBadge = '<span class="tool-badge free-key">🔑 Free Key</span>';
  }

  // Rate limit badge
  const rateLimitBadge = tool.caveat?.toLowerCase().includes('rate limit')
    ? '<span class="tool-badge rate-limited">⚡ Rate Limited</span>'
    : '';

  card.innerHTML = `
    <span class="tool-badge ${badgeType}">${badgeLabel}</span>
    ${accessBadge}
    ${rateLimitBadge}
    <h3>${tool.name}</h3>
    <p class="tool-description">${tool.bestFor}</p>
    <p class="tool-quality">${tool.qualityNote}</p>
    ${tool.caveat ? `<p class="tool-caveat">⚠️ ${tool.caveat}</p>` : ''}
    <a href="${tool.url}" target="_blank" rel="noopener" class="tool-link">
      Open Tool →
    </a>
  `;

  return card;
}
```

### 4.4 Faza 4: Testy i walidacja (1 godzina)

#### Krok 4.1: Aktualizacja testów

```typescript
// tests/directory.test.ts

describe('Directory structure', () => {
  it('should have AI and Developer sections', () => {
    const aiTools = zeroKeyTools.filter((t) => t.category.startsWith('ai-'));
    const devTools = zeroKeyTools.filter((t) => t.category.startsWith('dev-'));

    expect(aiTools.length).toBeGreaterThan(100);
    expect(devTools.length).toBeGreaterThan(90);
  });

  it('should have AI Coding Assistants category', () => {
    const aiCodingTools = zeroKeyTools.filter((t) => t.category === 'ai-coding');
    expect(aiCodingTools.length).toBeGreaterThan(20);
  });

  it('should include Kilo Code', () => {
    const kilo = zeroKeyTools.find((t) => t.id === 'kilo-code');
    expect(kilo).toBeDefined();
    expect(kilo?.category).toBe('ai-coding');
    expect(kilo?.access).toBe('free-key');
  });

  it('should have honest limitations section', () => {
    const limitationsSection = document.getElementById('honest-limitations');
    expect(limitationsSection).toBeTruthy();
  });
});
```

#### Krok 4.2: Manualne testowanie

- [ ] Sprawdź wszystkie linki do nowych narzędzi
- [ ] Zweryfikuj access types i limits
- [ ] Przetestuj filtry kategorii
- [ ] Sprawdź responsywność na mobile
- [ ] Zweryfikuj badge'e i ich kolory
- [ ] Sprawdź czy wszystkie narzędzia mają quality notes

### 4.5 Faza 5: Dokumentacja i commit (30 minut)

#### Krok 5.1: Aktualizacja README.md

```markdown
## Free Tools Directory

> **227+ verified free tools** — 128 AI tools + 99 developer tools. Run `npx tsx scripts/generate-tools-readme.ts` to update.

### AI Tools (128+ tools)

Free AI-powered tools for chat, image, video, code, PDF, and research.

#### AI Coding Assistants (25+ tools)

| Tool                                                | Access   | Best For                            | Quality                     |
| --------------------------------------------------- | -------- | ----------------------------------- | --------------------------- |
| [Kilo Code](https://kilo.ai/)                       | Free key | Professional AI coding, 500+ models | Apache-2.0, auto-routing    |
| [Cline](https://github.com/cline/cline)             | BYOK     | Open source, native subagents       | Apache-2.0, 80.8% SWE-bench |
| [Continue](https://continue.dev/)                   | BYOK     | IDE extension, model-agnostic       | Apache-2.0                  |
| [OpenCode](https://github.com/opencode-ai/opencode) | BYOK     | Terminal CLI, 120K+ stars           | Open source, LSP            |
| [Aider](https://aider.chat/)                        | BYOK     | Git-heavy refactoring               | Open source, excellent Git  |
| ...                                                 | ...      | ...                                 | ...                         |

### Developer Tools (99+ tools)

Free tools for coding, backend, automation, security, and learning.

#### Coding & Developer Workflow (30+ tools)

| Tool                                      | Access      | Best For        | Quality           |
| ----------------------------------------- | ----------- | --------------- | ----------------- |
| [Git](https://git-scm.com/)               | Open source | Version control | Industry standard |
| [VS Code](https://code.visualstudio.com/) | Free        | Code editor     | Microsoft-backed  |
| ...                                       | ...         | ...             | ...               |

### Honest Limitations

We will not lie to you:

- **"Free" means different things:** Some tools are truly free (no key, no limits). Others require a free API key (no credit card). Others have rate limits or daily quotas.
- **AI tools are not magic:** They can hallucinate, give wrong answers, or refuse legitimate requests. Always verify important information.
- **Rate limits are real:** Free tiers exist to share resources. If you hit a limit, wait or try another tool.
- **Privacy matters:** Do not treat any hosted AI as confidential legal, medical, or financial counsel.
- **Tools change:** Free tiers can be reduced or removed. We verify regularly, but always test yourself.

We mark every tool with its access type and limitations so you know what to expect before you click.
```

#### Krok 5.2: Commit

```bash
git add -A
git commit -m "feat: reorganize directory - separate AI and Developer tools

- Split directory into AI Tools (128+) and Developer Tools (99+)
- Add 25 new AI Coding Assistants (Kilo, Cline, Continue, OpenCode, etc.)
- Add Honest Limitations section for transparency
- Add badge system (AI/Dev, No Key/Free Key, Rate Limited)
- Update hero section: '227+ Free Tools for Developers'
- Update navigation: AI Tools | Dev Tools | Free Models | ...
- Add quality notes and caveats to all tools
- Update tests and documentation

This change improves transparency and makes it clear which tools are
AI-powered vs general developer tools. All tools are verified and marked
with their access type and limitations."
```

---

## 5. Kryteria akceptacji

### 5.1 Funkcjonalne

- [ ] Directory podzielone na AI Tools i Developer Tools
- [ ] 25+ nowych AI Coding Assistants dodanych
- [ ] Wszystkie narzędzia mają access type i quality notes
- [ ] Badge'e działają poprawnie (AI/Dev, No Key/Free Key, Rate Limited)
- [ ] Filtry kategorii działają dla obu sekcji
- [ ] Honest Limitations section widoczna i czytelna

### 5.2 Transparentność

- [ ] Każde narzędzie ma jasno oznaczony access type
- [ ] Każde narzędzie ma quality note wyjaśniający dlaczego jest dobre
- [ ] Każde narzędzie ma caveat (jeśli dotyczy) z ograniczeniami
- [ ] Honest Limitations section wyjaśnia czym jest "free"
- [ ] Brak mylących twierdzeń (np. "200+ AI tools" gdy 50% to non-AI)

### 5.3 Jakość

- [ ] Wszystkie linki działają
- [ ] Wszystkie access types są poprawne
- [ ] Wszystkie quality notes są prawdziwe i pomocne
- [ ] Testy przechodzą (100%)
- [ ] Build przechodzi bez błędów
- [ ] Responsywność na mobile/tablet/desktop

### 5.4 UX

- [ ] Jasny podział na AI i Developer tools
- [ ] Łatwo znaleźć narzędzia po kategorii
- [ ] Badge'e pomagają szybko zrozumieć typ narzędzia
- [ ] Honest Limitations buduje zaufanie
- [ ] Brak frustracji z powodu mylących informacji

---

## 6. Ryzyka i mitigacje

### Ryzyko 1: Zbyt wiele nowych narzędzi

**Problem:** Dodanie 25+ nowych narzędzi może przytłoczyć użytkowników  
**Mitigacja:**

- Podział na Tier 1 (must-have), Tier 2 (managed), Tier 3 (open source), Tier 4 (big tech)
- Domyślnie pokazuj tylko Tier 1 i Tier 2
- Pozwól filtrować po tier

### Ryzyko 2: Zmiana URL-i

**Problem:** Zmiana kategorii może zepsuć istniejące linki  
**Mitigacja:**

- Zachowaj stare ID narzędzi
- Dodaj redirect ze starych kategorii do nowych
- Zaktualizuj wszystkie wewnętrzne linki

### Ryzyko 3: Nieaktualne informacje

**Problem:** Nowe narzędzia mogą zmienić pricing/access  
**Mitigacja:**

- Dodaj `lastVerified` do każdego narzędzia
- Dodaj skrypt weryfikujący linki co tydzień
- Dodaj "Report outdated info" button na każdej karcie

### Ryzyko 4: Utrata SEO

**Problem:** Zmiana tytułu z "AI Tools" może wpłynąć na SEO  
**Mitigacja:**

- Zachowaj "AI Tools" w podtytule
- Dodaj meta description: "227+ free tools for developers: 128 AI tools + 99 developer tools"
- Dodaj structured data (JSON-LD) dla obu sekcji

---

## 7. Podsumowanie

### Co robimy:

1. **Dzielimy directory** na AI Tools (128+) i Developer Tools (99+)
2. **Dodajemy 25 nowych AI Coding Assistants** (Kilo, Cline, Continue, etc.)
3. **Zmieniamy tytuł** z "200+ AI Tools" na "227+ Free Tools for Developers"
4. **Dodajemy Honest Limitations** dla transparentności
5. **Dodajemy badge'e** dla szybkiego zrozumienia typu narzędzia
6. **Aktualizujemy UI/UX** dla lepszego podziału

### Dlaczego:

- **Transparentność:** Użytkownicy wiedzą co jest AI, a co nie
- **Zaufanie:** Honest Limitations buduje wiarygodność
- **Użyteczność:** Łatwiej znaleźć odpowiednie narzędzia
- **Kompletność:** Dodajemy brakujące professional AI coding tools
- **Jakość:** Każde narzędzie ma quality note i caveat

### Kiedy:

- **Szacowany czas:** 6-8 godzin
- **Priorytet:** Wysoki
- **Status:** Gotowy do implementacji

---

**Autor:** Aether Planner  
**Data:** 2026-06-11  
**Status:** ✅ Gotowy do implementacji

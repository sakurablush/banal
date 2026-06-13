# Tools Database Audit Plan — Free Model Access & Deduplication

**Data:** 2026-06-14
**Status:** 🔍 ANALYSIS COMPLETE - READY FOR IMPLEMENTATION
**Cel:** Czysta, aktualna baza danych narzędzi z wyraźnym oznaczeniem prawdziwie darmowych modeli AI

---

## 1. Problem Statement & Goals

### Problemety wykryte:
1. **Duplikaty:** Narzędzia te same, ale pod różnymi ID i nazwami (duplikaty w bazie)
2. **Nieaktualne nazwy:** Riffusion → Flow Music (rebrand)
3. **Brak jasnego wyróżnienia:** Narzędzia z darmowym dostępem do modeli (CLI/VS Code plugin) vs te z darmowym dostępem do interfejsu
4. **Błędne kategoryzowanie:** Niektóre narzędzia w złych kategoriach (np. Claude Code w ai-agents zamiast ai-coding)

### Cele:
1. Usunąć duplikaty
2. Zaktualizować nazwy i URL do aktualnych
3. Dodać badge `true-free-models` dla narzędzi dających darmowy dostęp do modeli
4. Przeanalizować każde narzędzie pod kątem prawdziwego darmowego dostępu do modeli

---

## 2. Duplikaty wykryte

| Original Tool | Duplicate Tool | Status | Action |
|---------------|----------------|--------|--------|
| `riffusion` (line 568) | Riffusion → Flow Music rebrand | ✅ Fix name | Update to "Flow Music" with new URL |
| `continue-dev` (line 1173) | `continue` (line 2946) | ⚠️ Same tool | Consolidate to one entry |
| `suno` (line 611) | `suno-ai` (line 2768) | ⚠️ Same tool | Keep `suno`, remove duplicate |
| `pika-free` (line 2517) | `pika-labs` (line 2809) | ⚠️ Same tool | Keep `pika-free`, remove duplicate |
| `midjourney-free` (line 2469) | `midjourney-web` (line 2837) | ⚠️ Same tool | Keep `midjourney-free`, remove duplicate |
| `gamma` (line 986) | `gamma-app` (line 2647) | ⚠️ Same tool | Keep `gamma`, remove duplicate |
| `pollinations`, `pollinations-image`, `pollinations-api` | Same platform, different surfaces | ⚠️ Three variants | Keep all 3 - they have different use cases (web/API) |

**Total duplicates to remove: 4 entries**

---

## 3. Kategorie wymagające poprawy

### nieprawidłowo skategoryzowane:

| Tool | Current Category | Correct Category | Reason |
|------|------------------|------------------|--------|
| `claude-code` | ai-agents | ai-coding | IDE extension for coding, not general agents |
| `gemini-cli` | ai-agents | ai-coding | CLI coding assistant, not general agents |
| `github-copilot-free` | ai-coding | ai-coding | ✓ OK - already correct |
| `amazon-q-developer` | ai-coding | ai-coding | ✓ OK - already correct |
| `google-ai-studio` | ai-coding | ai-coding | ✓ OK - already correct |

---

## 4. Badge `true-free-models` - Kryteria

### Narzędzia spełniające kryteria (true free model access):

**CLI Tools with Free/Open Source Models:**
- `ollama` - runs open models locally, zero cost for model access
- `open-webui` - open source UI, can use free models via Ollama
- `koboldcpp` - runs open models locally, zero cost
- `jan-ai` - open source, runs local models
- `gpt4all` - open source local models
- `text-generation-webui` - open source, local models
- `lm-studio` - can use free tier with local models

**API Providers with Free Tiers giving actual model access:**
- `huggingface-inference-api` - free inference on open models
- `groq-api` - generous free tier (6K TPM, 14.4K req/day) on open models
- `kilo-gateway` - Auto Free routes (kilo-auto/free) with no markup
- `openrouter-free` - free model variants with OpenAI-compatible API
- `cerebras-inference` - 1M tokens/day free
- `together-ai` - free credits
- `google-gemini-api` - free tier with actual model access
- `free-the-ai` - free API gateway
- `fal-ai` - free credits
- `replicate` - free credits

**IDE Extensions/Plugins with Free Model Access:**
- `continue-dev` / `continue` - works with any provider including free routes
- `codeium` - free for individuals with model access
- `kilo-code` - Auto Free routes built-in
- `multi-dev` - no config, uses free providers
- `freehive` - OAuth token access to multiple providers

**Chinese Platforms with Free Model Access:**
- Doubao, Kimi, Quark, Yuanbao - 1M tokens/day free (China regional)

---

## 5. Narzędzia NIE spełniające kryteriów true-free-models

| Tool | Why NOT true-free-models | Correct Badges |
|------|--------------------------|---------------|
| ChatGPT Free, Copilot, Gemini, Meta AI | Only UI access, no API/model control | `free-ui`, `no-api` |
| WebLLM | Runs locally in browser, limited models | `browser-models` |
| Perplexity, Duck.ai | UI only or limited model choice | `search-chat` |
| Remove.bg, Cleanup.pictures | Single-purpose API, not LLM models | `api-limited` |

---

## 6. Propozycja badge systemu

### Nowe badge (do dodania):
```typescript
// true-free-models: Narzędzie daje dostęp do PRAWDziwych darmowych modeli AI
// - via API klucza z darmowym limitem (OpenRouter free, Groq, Kilo Gateway)
// - via CLI z możliwością uruchomienia modeli lokalnie
// - via IDE plugin z obsługą darmowych endpointów
// NIE: tylko darmowy interfejs webowy bez kontroli nad modelami
```

### Kryteria true-free-models:
1. **API path:** Dostęp do modeli przez API z darmowym limitem tokens/requests (>1000 tokens/day)
2. **CLI path:** Możliwość uruchomienia modeli lokalnie bez opłat
3. **IDE path:** Plugin rozszerzający IDE z darmowymi endpointami modeli
4. **Self-host path:** Open source który można uruchomić z własnymi modelami

### Narzędzia do dodania badge `true-free-models`:

**Główne (z największym darmowym dostępem):**
- `kilo-gateway` - Auto Free routes
- `openrouter-free` - free model catalog  
- `groq-api` - ultra-fast open models
- `huggingface-inference-api` - open model catalog
- `cerebras-inference` - 1M tokens/day
- `google-gemini-api` - 250K TPM free tier

**CLI/IDE (z możliwością darmowych modeli):**
- `continue-dev` / `continue` - BYOK + free routes
- `kilo-code` - Auto Free built-in
- `multi-dev` - zero config free providers
- `freehive` - OAuth token access
- `codeium` - free individual tier
- `ollama` - local open models
- `open-webui` - self-hosted free models
- `jan-ai` - local-first
- `gpt4all` - downloadable models
- `koboldcpp` - local inference

---

## 7. Szczegółowy plan implementacji

### KROK 1: Naprawa duplikatów (high priority)
```typescript
// Remove:
// - continue (line 2946) - keep continue-dev
// - suno-ai (line 2768) - keep suno
// - pika-labs (line 2809) - keep pika-free
// - midjourney-web (line 2837) - keep midjourney-free
// - gamma-app (line 2647) - keep gamma
```

### KROK 2: Aktualizacja Riffusion → Flow Music
```typescript
// Change:
// id: 'riffusion'
// name: 'Riffusion'
// url: 'https://www.riffusion.com/'
// TO:
// id: 'flow-music' (or keep 'riffusion' for backward compat)
// name: 'Flow Music (Google)'
// url: 'https://flowmusic.app/' or 'https://riffusion.com/' (still redirects)
```

### KROK 3: Dodanie badge `true-free-models`
Dodaj badge `true-free-models` do narzędzi spełniających kryteria:
- Tools with API keys that give free model access (Groq, OpenRouter, Kilo Gateway, etc.)
- Tools that can run open models locally (Ollama, Open WebUI, etc.)
- IDE extensions that route to free models (Continue, Kilo Code, etc.)

### KROK 4: Poprawa kategoryzacji
```typescript
// Move claude-code from ai-agents to ai-coding
// Move gemini-cli from ai-agents to ai-coding
```

---

## 8. Lista zmian do wdrożenia

### Usuń duplikaty (4 wpisy):
1. **Line ~2946:** `continue` → merge into `continue-dev` (or keep `continue-dev`, remove `continue`)
2. **Line ~2768:** `suno-ai` → remove (duplicate of `suno` at line 611)
3. **Line ~2809:** `pika-labs` → remove (duplicate of `pika-free` at line 2517)
4. **Line ~2837:** `midjourney-web` → remove (duplicate of `midjourney-free` at line 2469)
5. **Line ~2647:** `gamma-app` → remove (duplicate of `gamma` at line 986)

### Zaktualizuj nazwy:
1. **Line 568:** `riffusion` → `flow-music` (Google Flow Music rebrand)

### Dodaj true-free-models badge:
| Tool ID | Add Badge | Notes |
|---------|-----------|-------|
| `kilo-gateway` | ✅ true-free-models | Auto Free routes |
| `openrouter-free` | ✅ true-free-models | free model catalog |
| `groq-api` | ✅ true-free-models | ultra-fast open models |
| `huggingface-inference-api` | ✅ true-free-models | open model hosting |
| `cerebras-inference` | ✅ true-free-models | 1M tokens/day |
| `google-gemini-api` | ✅ true-free-models | 250K TPM |
| `continue-dev` | ✅ true-free-models | BYOK + free routes |
| `kilo-code` | ✅ true-free-models | Auto Free built-in |
| `multi-dev` | ✅ true-free-models | zero config free providers |
| `freehive` | ✅ true-free-models | OAuth token access |
| `codeium` | ✅ true-free-models | free individual tier |
| `ollama` | ✅ true-free-models | local open models |

---

## 9. Ryzyka i uwagi

### Uwagi bezpieczeństwa:
- Chinese tools (Doubao, Kimi, etc.) - regional availability, real-name auth
- Some free tiers may log prompts - warn users about sensitive data
- Rate limits are real - document actual limits (tokens/requests per day)

### Uwagi transparentności:
- `free-tier` ≠ `true-free-models` - free tier may just give UI access
- `open-source` ≠ `true-free-models` - may still need paid API access
- Clear distinction between: UI access vs Model access vs Full local control

---

## 10. Weryfikacja dokumentacji

Przed publikacją trzeba zweryfikować:
- [ ] Groq free limits (6K TPM, 14.4K req/day - still current?)
- [ ] OpenRouter free model count (28+ models - still current?)
- [ ] Kilo Gateway Auto Free documentation
- [ ] Cerebras free tier (1M tokens/day)
- [ ] Google Gemini API free limits
- [ ] Flow Music URL (official domain)
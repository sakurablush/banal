# Plan: Banal AI — Kompletne Dopieszczenie Aplikacji

**Data:** 2026-06-09  
**Cel:** Przekształcenie Banal w profesjonalną, użyteczną i dobrze udokumentowaną aplikację z listą darmowych narzędzi AI  
**Status:** ZATWIERDZONY DO IMPLEMENTACJI

---

## Decyzje Użytkownika

- ✅ **Nawigacja:** Zamienić Cipher Menu na prosty navbar
- ✅ **Podejście:** Pełna sekwencyjna implementacja
- ✅ **Hosting:** GitHub Pages (konfiguracja później, nie w tym planie)

---

## 1. Podsumowanie Wykonawcze

### Stan Obecny

Banal to aplikacja listująca darmowe narzędzia AI z:

- **183 narzędzi** w bazie (nie "200+" jak deklaruje UI)
- Testy przechodzą (122/122 ✓)
- Build działa (257KB JS, 41KB CSS)
- UI/UX w stylu sci-fi "cockpit" z Cipher Menu
- Brak README z listą narzędzi (jak typowe projekty GitHub)
- Niejasna nawigacja — Cipher Menu jest eksperymentalne, nie intuicyjne
- Brak weryfikacji czy narzędzia nadal działają
- Niektóre narzędzia mogą być nieaktualne lub nieprawidłowe

### Główne Problemy do Rozwiązania

1. **UI/UX jest niejasne** — Cipher Menu wygląda ładnie ale jest nieintuicyjne
2. **Lista narzędzi nieprzykładna** — brakuje weryfikacji, niektóre duplikaty, brak kategoryzacji w README
3. **Brak indeksowanej listy w README** — użytkownicy muszą odpalać stronę
4. **Deklaracje vs rzeczywistość** — "200+ tools" a jest 183
5. **Brak darmowego hostingu** — trzeba zdecydować gdzie publikować

### Cele Planu

1. Przeprojektować UI/UX na jasne i intuicyjne
2. Zweryfikować i rozszerzyć listę narzędzi do prawdziwych 200+
3. Dodać indeksowaną listę do README (jak awesome-lists na GitHub)
4. Naprawić wszelkie błędy i niespójności
5. Opublikować za darmo (GitHub Pages / Cloudflare Pages / Netlify)

---

## 2. Analiza Szczegółowa

### 2.1 Problemy UI/UX

#### Cipher Rotary Menu

- **Problem:** Niestandardowa nawigacja, użytkownicy nie wiedzą jak jej używać
- **Rozwiązanie:** Zamienić na prosty, czytelny navbar lub sidebar, Cipher Menu opcjonalnie jako "fancy mode"

#### Giant Search

- **Status:** Dobrze działa, jest głównym elementem interakcji ✓
- **Propozycja:** Zachować jako centralny element

#### Life Filters

- **Status:** Działają ale nazwy filtrów ("Low energy / 2am") są zbyt abstrakcyjne
- **Propozycja:** Jaśniejsze etykiety + tooltips

#### Lista Narzędzi

- **Status:** Działa ale brak paginacji/infinite scroll przy 183 elementach
- **Propozycja:** Dodać grupowanie po kategoriach + lazy loading

### 2.2 Problemy z Danymi

#### Liczba Narzędzi

- **Deklaracja:** "200+ tools"
- **Rzeczywistość:** 183 narzędzi
- **Rozwiązanie:** Albo dodać ~20 narzędzi, albo zmienić komunikat na "180+"

#### Narzędzia do Zweryfikowania

Potencjalnie problematyczne wpisy (wymagające manualnej weryfikacji):

- `cogr` (cogr.ai) — sprawdzić czy istnieje
- `fahai` (fahai.org) — sprawdzić czy istnieje
- `banana-dev` (app.banana.dev) — sprawdzić status
- `midjourney-free` — sprawdzić czy free trial nadal istnieje
- `kaiber-free` — sprawdzić free tier

#### Duplikaty/Podobne Wpisy

- `deepseek-chat` i `deepseek` — ten sam tool, różne ID
- `perplexity-ai` i `perplexity-search` — redundancja

### 2.3 Brakująca Dokumentacja

#### README.md

- Jest bardzo poetycka/manifestowa ale brak:
  - Szybkiej listy narzędzi po kategorii
  - Instrukcji jak dodać nowe narzędzie
  - Automatycznie generowanego spisu

#### Brak TOOLS.md

- Nie ma pliku z indeksowaną listą jak w "awesome" repos

---

## 3. Plan Implementacji

### Faza 1: Przygotowanie i Audit (1-2h)

- [ ] Zweryfikować wszystkie 183 narzędzi (automatyczny skrypt + manualna inspekcja)
- [ ] Usunąć duplikaty i niedziałające linki
- [ ] Naprawić licznik "200+ tools" na rzeczywistą wartość
- [ ] Sprawdzić każdą kategorię pod kątem kompletności

### Faza 2: Rozszerzenie Bazy Narzędzi (2-3h)

- [ ] Dodać brakujące darmowe narzędzia AI do osiągnięcia 200+:
  - Darmowe alternatywy Claude (Claude.ai free tier)
  - Darmowe IDE z AI (Zed, Windsurf free)
  - Darmowe OCR/Vision tools
  - Darmowe embeddings APIs
  - Więcej local LLM tools
- [ ] Dodać nowe kategorie jeśli potrzebne (ai-agents, ai-spreadsheet, etc.)

### Faza 3: Generowanie README z Listą (1h)

- [ ] Stworzyć skrypt `scripts/generate-tools-readme.ts`
- [ ] Generować automatycznie sekcję w README z listą narzędzi pogrupowanych po kategoriach
- [ ] Format: `| Nazwa | Opis | Typ | Link |`
- [ ] Dodać ToC (Table of Contents)
- [ ] Uruchamiać przy build lub jako pre-commit hook

### Faza 4: UI/UX Redesign (3-4h)

#### 4.1 Nawigacja

- [ ] Dodać prosty header z linkami: Tools | Playground | Chat | About
- [ ] Cipher Menu jako opcjonalny "fancy mode" (przełącznik w settings)
- [ ] Mobile: hamburger menu

#### 4.2 Tools Directory

- [ ] Grupowanie po kategoriach (collapsible sections)
- [ ] Pokazywać najpierw "Featured" (najlepsze w kategorii)
- [ ] Lazy loading dla długich list
- [ ] Jasne ikony dla typów: 🌐 Web, 📡 API, 💻 CLI

#### 4.3 Search & Filters

- [ ] Zachować Giant Search jako hero
- [ ] Przeprojektować Life Filters na jaśniejsze:
  - "No signup needed" zamiast "Truly unlimited"
  - "Works offline" zamiast "Low energy"
  - "For developers" (jasne)
  - "Privacy-focused" (jasne)
- [ ] Dodać filter po kategorii (dropdown lub chips)

#### 4.4 Tool Cards

- [ ] Jaśniejszy design:
  - Nazwa + ikona typu
  - 1-liniowy opis
  - Badges: "No login", "Open source", "Free tier"
  - Przycisk "Open" z linkiem
- [ ] Hover: rozwinięcie z pełnym opisem + caveats

### Faza 5: Weryfikacja i Monitoring (2h)

- [ ] Stworzyć `scripts/verify-tools.ts`:
  - HEAD request do każdego URL
  - Sprawdzenie czy strona nie jest paywall
  - Zapis wyników do `verification-results.json`
- [ ] GitHub Actions workflow: cotygodniowa weryfikacja
- [ ] Badge "Verified" na stronie pokazujący datę ostatniej weryfikacji

### Faza 6: Przygotowanie do Deployment (30min)

- [ ] Upewnić się że build działa (`npm run build`)
- [ ] Przetestować lokalnie (`npm run preview`)
- [ ] Sprawdzić czy `.github/workflows/deploy.yml` jest gotowy
- [ ] **UWAGA:** Faktyczny deploy na GitHub Pages wykonany później przez usera

### Faza 7: Polish & QA (1-2h)

- [ ] Lighthouse audit: Performance 90+, Accessibility 90+
- [ ] Przetestować na różnych przeglądarkach
- [ ] Sprawdzić wszystkie linki
- [ ] Finalny przegląd copy (EN + JA)
- [ ] Update screenshots w README

---

## 4. Szczegółowe Specyfikacje

### 4.1 Format README z Listą Narzędzi

```markdown
## 📋 Tools Directory (200+ verified free AI tools)

Quick jump: [AI Assistants](#ai-assistants) | [Image](#ai-image) | [Video](#ai-video) | ...

### AI Assistants (25 tools)

| Tool                                | Description        | Type   | Access    |
| ----------------------------------- | ------------------ | ------ | --------- |
| [ChatGPT Free](https://chatgpt.com) | GPT-4o-mini chat   | 🌐 Web | Free tier |
| [Claude Free](https://claude.ai)    | Claude Sonnet chat | 🌐 Web | Free tier |

| ...
```

### 4.2 Nowy Prosty Header

```html
<header class="sticky top-0 z-50 glass-header">
  <nav class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <a href="/" class="font-black text-xl">BANAL</a>
    <div class="flex gap-6">
      <a href="#tools">Tools</a>
      <a href="#playground">API Playground</a>
      <a href="#chat">Chat</a>
      <a href="#about">About</a>
    </div>
    <div class="flex gap-3">
      <button id="lang-switch">EN/JA</button>
      <button id="theme-toggle">🌙</button>
    </div>
  </nav>
</header>
```

### 4.3 Nowe Filtry (jaśniejsze nazwy)

```typescript
const FILTERS = [
  { id: 'no-signup', label: '✓ No signup', icon: '🔓' },
  { id: 'open-source', label: 'Open source', icon: '📖' },
  { id: 'offline', label: 'Works offline', icon: '📴' },
  { id: 'privacy', label: 'Privacy-first', icon: '🛡️' },
  { id: 'developer', label: 'For developers', icon: '💻' },
  { id: 'no-limits', label: 'No daily limits', icon: '♾️' },
];
```

### 4.4 Skrypt Weryfikacji Narzędzi

```typescript
// scripts/verify-tools.ts
import { zeroKeyTools } from '../src/data/zero-key-tools';

async function verifyTool(tool) {
  try {
    const response = await fetch(tool.url, {
      method: 'HEAD',
      timeout: 10000,
    });
    return {
      id: tool.id,
      url: tool.url,
      status: response.status,
      ok: response.ok,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return { id: tool.id, url: tool.url, status: 0, ok: false, error: error.message };
  }
}
```

---

## 5. Hosting (decyzja użytkownika)

**Wybrano:** GitHub Pages  
**Status:** Konfiguracja później — w tym planie tylko przygotowanie, nie faktyczny deploy

Workflow `.github/workflows/deploy.yml` do stworzenia/sprawdzenia:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: './dist' }
      - uses: actions/deploy-pages@v4
```

---

## 6. Harmonogram Implementacji

| Faza                    | Czas  | Priorytet | Opis                                                 |
| ----------------------- | ----- | --------- | ---------------------------------------------------- |
| 1. Audit narzędzi       | 1-2h  | P0        | Weryfikacja linków, usunięcie duplikatów             |
| 2. Rozszerzenie bazy    | 2-3h  | P1        | Dodanie brakujących narzędzi do 200+                 |
| 3. README z listą       | 1h    | P0        | Indeksowana lista w README + skrypt generujący       |
| 4. UI/UX redesign       | 3-4h  | P1        | Prosty navbar, jaśniejsze filtry, lepsze karty       |
| 5. Weryfikacja auto     | 2h    | P2        | Skrypt + GitHub Actions do cotygodniowej weryfikacji |
| 6. Przygotowanie deploy | 30min | P0        | Build, test, sprawdzenie workflow                    |
| 7. Polish & QA          | 1-2h  | P1        | Lighthouse, linki, responsywność                     |

**Szacowany łączny czas:** 10-14 godzin

### Kolejność wykonania:

```
1. Audit → 2. Rozszerzenie → 3. README → 4. UI/UX → 5. Weryfikacja → 6. Prep deploy → 7. QA
```

---

## 7. Kryteria Sukcesu

### Must Have (Definition of Done)

- [ ] README zawiera indeksowaną listę narzędzi po kategoriach
- [ ] UI ma jasną, intuicyjną nawigację
- [ ] Wszystkie narzędzia zweryfikowane (linki działają)
- [ ] Strona opublikowana i dostępna publicznie
- [ ] Testy przechodzą (122/122)
- [ ] Build < 300KB JS

### Nice to Have

- [ ] Automatyczna weryfikacja co tydzień (GitHub Actions)
- [ ] 200+ prawdziwych, działających narzędzi
- [ ] Cipher Menu jako opcjonalny tryb
- [ ] Lighthouse 90+ we wszystkich kategoriach

### Metryki

- Liczba narzędzi: ≥ 200
- Broken links: 0
- Test coverage: 100%
- Page load: < 3s na 3G

---

## 8. Decyzje Zatwierdzone

| Pytanie        | Odpowiedź                               |
| -------------- | --------------------------------------- |
| Styl nawigacji | ✅ Prosty navbar (zastąpić Cipher Menu) |
| Priorytet      | ✅ Pełna sekwencyjna implementacja      |
| Hosting        | ✅ GitHub Pages (deploy później)        |

---

## 9. Następne Kroki (Plan Implementacji)

**Plan zatwierdzony — gotowy do implementacji:**

### Krok 1: Audit Narzędzi

- Uruchomić weryfikację linków dla wszystkich 183 narzędzi
- Zidentyfikować i usunąć duplikaty (`deepseek-chat` vs `deepseek`)
- Sprawdzić problematyczne wpisy (`cogr`, `fahai`, `banana-dev`)
- Zaktualizować licznik "200+ tools" na faktyczną wartość

### Krok 2: Rozszerzenie Bazy

- Dodać brakujące darmowe narzędzia:
  - Claude.ai free tier
  - Gemini free tier (już jest? sprawdzić)
  - Zed Editor, Windsurf free
  - Darmowe OCR/Vision
  - Więcej local LLM tools
- Cel: minimum 200 zweryfikowanych narzędzi

### Krok 3: README z Indeksowaną Listą

- Stworzyć `scripts/generate-tools-readme.ts`
- Automatycznie generować sekcję z tabelami po kategoriach
- Dodać Table of Contents
- Uruchamiać przy każdym buildzie

### Krok 4: UI/UX Redesign

- Usunąć/ukryć Cipher Menu
- Dodać prosty header z nawigacją
- Przeprojektować Life Filters na jaśniejsze nazwy
- Ulepszyć Tool Cards z lepszym UX
- Grupowanie po kategoriach

### Krok 5: System Weryfikacji

- Skrypt `scripts/verify-tools.ts`
- GitHub Actions workflow dla cotygodniowej weryfikacji
- Badge "Last verified" na stronie

### Krok 6: Przygotowanie Deploy

- `npm run build` działa
- `npm run preview` testowane
- Workflow gotowy (nie pushować jeszcze)

### Krok 7: Final QA

- Lighthouse audit
- Wszystkie linki działają
- Responsywność OK
- EN/JA działa

---

**Koniec planu. Gotowy do implementacji po zatwierdzeniu.**

_Plan przygotowany na podstawie analizy kodu źródłowego, istniejących planów (.kilo/plans/), struktury projektu i wymagań użytkownika._

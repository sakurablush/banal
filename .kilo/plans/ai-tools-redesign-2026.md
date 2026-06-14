# Plan: Redesign i Uzupełnienie Katalogu AI Tools

## 1. Problem Statement & Goals

Poprawa katalogu narzędzi AI pod kątem:
- **Wyrównanie elementów UI** - tagi "No Signup"/"Open Source" mają nieprawidłowe wyświetlanie
- **Układ kafelków** - pierwszy wiersz ma pusty pierwszy kafelek, a kolejny ma 3 (nieregularne rozmieszczenie)
- **Rozbudowa tagów filtrujących** - potrzebne nowe tagi dla "biednych developerów" (CLI, free tokens, no hardware)
- **Unikalne ikony kategorii** - niektóre ikony są duplikowane
- **Jednolity design Prompt Templates** - dopasowanie do katalogu narzędzi
- **Usunięcie duplikatu Quick Start** - scalenie z Prompt Templates
- **Aktualizacja modeli open-source** - GLM 5 zamiast GLM 4, dodanie najnowszych modeli
- **Poprawa API Playground** - wyraźne okno wprowadzania kluczy

## 2. Key Assumptions & Constraints

- Projekt używa TypeScript + vanilla JS (bez frameworków)
- System kafelków oparty na grid CSS (`minmax(260px, 1fr)`)
- Tagi bazują na polach `badges`, `requiresSignup`, `surface`, `access`
- Model GLM-5 dostępny na HuggingFace, MIT license, 744B parametrów (1M context)
- Model GLM-5.1 dostępny, ~754B parametrów, 8-godzinna autonomiczna praca
- DeepSeek V3.2 jest najnowszą wersją (GPT-5 level, MIT license)
- Qwen3 i Qwen3-Coder dostępne, Apache 2.0 license

## 3. Trade-off Analysis

### 3.1 Alignment Elementów (Point 1)
**Obecny problem:** `zk2-card-access-badges` używa `flex-wrap` co powoduje przenoszenie elementów na kolejną linię

**Rozwiązania:**
| Opcja | Zalety | Wady | Rekomendacja |
|-------|--------|------|-------------|
| `align-items: baseline` | Proste, zachowuje elastyczność | Może nie działać przy dynamicznej zawartości | ✅ TAK |
| `min-height` na kartach | Wyrównuje wszystkie karty | Dodaje dodatkowy kod CSS | ✅ TAK (dodatkowo) |
| `inline-grid` dla badge | Precyzyjne wyrównanie | Mniej elastyczne | ❌ NIE |

### 3.2 Układ Kafelków (Point 2)
**Obecny problem:** Grid nie radzi sobie z różną liczbą narzędzi w wierszach

**Rozwiązania:**
| Opcja | Zalety | Wady | Rekomendacja |
|-------|--------|------|-------------|
| `grid-auto-flow: dense` | Automatyczne wypełnianie przerw | Może zmienić kolejność | ✅ TAK |
| `grid-column: 1 / -1` na pierwszym | Wyrównuje pierwszy kafelek | Sztuczne rozwiązanie | ❌ NIE |

### 3.3 Tagi Filtrujące (Point 3)
**Nowe tagi dla "developerów bez budżetu":**

| Tag | Kryterium | Uzasadnienie |
|-----|-----------|-------------|
| `cli` | `surface === 'cli'` | Narzędzia CLI działają lokalnie, nie wymagają modeli online |
| `no-key` | `access === 'open-source' \|\| requiresSignup === false` | Zero kluczy API wymaganych |
| `offline` | `access === 'open-source'` | Działa bez internetu, pełna prywatność |
| `self-host` | `access === 'self-host' \|\| access === 'open-source'` | Możliwość własnego hostowania |
| `browser` | `surface === 'web'` | Działa w przeglądarce, zero instalacji |
| `high-context` | `badges.includes('1M context')` | Duże okna kontekstu dla dużych plików |

### 3.4 Ikony Kategorii (Point 4)
**Duplikaty ikonek:**
- `ai-coding` i `ai-agents` oba mają `\u{1F916}` (robot)
- `dev-backend` ma `\u{2601}\uFE0F` (chmurka) - myląca dla hostingu/backend

**Nowe unikalne ikony:**
| Kategoria | Obecna ikona | Nowa ikona | Powód |
|-----------|-------------|------------|-------|
| `ai-coding` | 🤖 (robot) | 🧠 (mózg) | Lepsza metafora dla kodowania |
| `ai-agents` | 🤖 (robot) | 👥 (wielu) | Wieloagentowe systemy |
| `dev-backend` | ☁️ (chmurka) | 🚀 (rakiet) | Lepsze odzwierciedlenie backendu/hostingu |

### 3.5 Prompt Templates vs Quick Start (Points 5-6)
**Obecny stan:**
- Quick Start to osobny komponent z 5 kartami w grid
- Prompt Templates to osobny komponent z 9 szablonami

**Rozwiązanie:**
- Usunąć sekcję Quick Start z index.html linie ~313-360
- Przenieść 5 popularnych szablonów do głównej sekcji Prompt Templates
- Unifikowany design: grid-kafelki + accordion formularz pod kartą
- Zachować `pt-horizontal-shell` jako bazowy layout

### 3.6 Modele Open-Source (Point 7)
**Najnowsze modele 2026 z weryfikacją online:**

| Model | Wersja | Parametry | Kontekst | Licencja | Source |
|-------|--------|-----------|----------|----------|--------|
| GLM-5 | 2026-06-13 | 744B (40B aktywne) | 1M | MIT | HuggingFace zai-org/GLM-5 |
| GLM-5.1 | 2026-04-08 | ~754B (~42B aktywne) | 128K | MIT | HuggingFace |
| Qwen3 | 2025-04-29 | 235B MoE (22B aktywne) | 128K | Apache 2.0 | HuggingFace |
| Qwen3-Coder | 2025-07-23 | 480B (35B aktywne) | 256K → 1M | Apache 2.0 | HuggingFace |
| DeepSeek-V3.2 | 2026-XX-XX | 685B (37B aktywne) | 128K | MIT | HuggingFace |

### 3.7 API Playground UI (Point 8)
**Obecny problem:** Okno kluczy (`#pg-keys-panel`) nie ma wyraźnego konturu

**Poprawki UI:**
- `.pg-keys-panel` dodać `glass-card` styling
- Wyraźny border: `2px solid rgba(168, 85, 247, 0.3)`
- Shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5)`
- `.pg-key-input` z focus state

## 4. Recommended High-Level Architecture

```
src/
├── zero-key-panel.ts          # Główny panel - poprawki alignment + tagi
├── data/
│   └── zero-key-tools.ts      # Dodanie kategorii ai-models
├── free-models.ts             # Rozszerzenie o nowe modele
├── prompt-templates-standalone.ts  # Unifikowany design z accordion
└── quickstart.ts              # DO USUNIECIA
```

## 5. Detailed Implementation Strategy

### Etap 1: Poprawa Alignment Elementów (Point 1)
1. W `zero-key-panel.ts` znaleźć renderowanie `accessBadges` (ok. linia 260-280)
2. Dodać klasę CSS:
   ```css
   .zk2-card-access-badges {
     align-items: baseline;
     flex-wrap: wrap;
   }
   .tool-card-horizontal { min-height: 180px; }
   ```

### Etap 2: Układ Kafelków (Point 2)
1. W `style.css` zmodyfikować `.tools-horizontal-scroll`:
   ```css
   grid-auto-flow: dense;
   ```

### Etap 3: Rozbudowa Tagów (Point 3)
1. W `zero-key-panel.ts` dodać nowe filtry w `getLifeFilters()`:
   ```typescript
   { id: 'cli', label: 'CLI', predicate: (tool) => tool.surface === 'cli' },
   { id: 'no-key', label: 'No API Key', predicate: (tool) => tool.access === 'open-source' || tool.requiresSignup === false },
   { id: 'offline', label: 'Offline', predicate: (tool) => tool.access === 'open-source' },
   { id: 'self-host', label: 'Self-hostable', predicate: (tool) => ['open-source', 'self-host'].includes(tool.access) },
   { id: 'high-context', label: '1M+ Context', predicate: (tool, h) => /1M|\/256K|400K/.test(h) }
   ```

### Etap 4: Unikalne Ikony Kategorii (Point 4)
1. Zaktualizować `categoryIcons` w `zero-key-panel.ts`:
   ```typescript
   'ai-coding': '\u{1F9E0}',  // 🧠 mózg
   'ai-agents': '\u{1F465}',  // 👥 wielu
   'dev-backend': '\u{1F680}', // 🚀 rakiet
   ```

### Etap 5: Unifikacja Prompt Templates (Points 5-6)
1. Usunąć sekcję Quick Start z `index.html` (linie ~313-360)
2. Przenieść 5 popularnych szablonów do `PROMPT_CATEGORIES`
3. Zaimplementować accordion formularz pod kartą

### Etap 6: Modele Open-Source (Point 7)
1. Dodać `ai-models` do `ZeroKeyCategory`
2. Dodać 4 narzędzia: GLM-5, GLM-5.1, Qwen3, Qwen3-Coder
3. Zmienić nagłówek z "AI Tools" na "AI Tools & Models"

### Etap 7: API Playground UI (Point 8)
1. Dodać `.pg-keys-panel` styling z wyraźnym konturem

## 6. Risks, Edge Cases & Mitigation

| Ryzyko | Mitigation |
|--------|------------|
| Ikony Unicode mogą nie wyświetlać się na niektórych systemach | Emoji są szeroko wspierane, fallback w CSS |
| Dodanie GLM-5 może zepsuć istniejące filtry | Testy regresyjne po zmianie |
| Zmiana grid może złamać mobile layout | Test na różnych rozdzielczościachach |

## 7. Testing Strategy

1. Desktop: 1920px, 1440px, 1024px
2. Mobile: 375px, 425px  
3. Dark/Light mode
4. Filtry tagów - każdy zwraca poprawne wyniki
5. Accordion prompt - otwiera i zamyka się poprawnie

## 8. File Changes Summary

| Plik | Działanie |
|------|-----------|
| `src/zero-key-panel.ts` | Dodanie 5 tagów, zmiana 3 ikon |
| `src/data/zero-key-tools.ts` | Dodanie kategorii ai-models + 4 modeli |
| `src/style.css` | Poprawki alignment, grid, API panel |
| `src/prompt-templates-standalone.ts` | Unifikacja designu z accordion |
| `src/quickstart.ts` | Usunięcie całego pliku |
| `index.html` | Usunięcie sekcji Quick Start, zmiana nazwy na "AI Tools & Models" |
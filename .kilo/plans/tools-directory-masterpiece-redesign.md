# Plan: Tools Directory — Masterpiece Redesign

**Data:** 2026-06-09  
**Cel:** Totalny redesign panelu narzędzi — z chaosu do arcydzieła UX  
**Status:** DO ZATWIERDZENIA

---

## Problem

Obecny stan jest **fatalny**:

1. **Search nie działa** — hero search input (`#hero-search`) nie jest podpięty do filtrowania
2. **Lista to ściana tekstu** — 200+ narzędzi w jednej długiej liście bez hierarchii
3. **Karty są puste** — tylko: nazwa + badges + "Open" — zero informacji CO to robi
4. **Zero wizualnej hierarchii** — wszystko wygląda identycznie
5. **Marnowanie miejsca** — ogromne puste przestrzenie, nic użytecznego
6. **Brak kontekstu** — nie wiadomo czy to chat, czy image gen, czy API

---

## Wizja: Nowoczesny Directory

### Inspiracje

- **Raycast Store** — czyste karty z ikonami, kategorie w sidebarze
- **Product Hunt** — jasny opis, social proof, kategorie
- **Notion Template Gallery** — preview, filtry, grid layout
- **Linear** — minimalistyczny ale informacyjny

---

## Architektura Nowego UI

### Layout: 2-Column (Desktop) / Stack (Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│  [Search Bar ━━━━━━━━━━━━━━━━━━━━━━━━]  [Filters ▾]         │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│  CATEGORIES │   ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│             │   │  Card   │ │  Card   │ │  Card   │        │
│  ○ All      │   │ ─────── │ │ ─────── │ │ ─────── │        │
│  ○ Chat     │   │ ChatGPT │ │ Claude  │ │ Gemini  │        │
│  ○ Image    │   │ GPT-4o  │ │ Sonnet  │ │ Multi   │        │
│  ○ Video    │   │ ⬡ WEB   │ │ ⬡ WEB   │ │ ⬡ WEB   │        │
│  ○ Audio    │   └─────────┘ └─────────┘ └─────────┘        │
│  ○ Code     │                                               │
│  ○ PDF      │   ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  ...        │   │  Card   │ │  Card   │ │  Card   │        │
│             │   └─────────┘ └─────────┘ └─────────┘        │
├─────────────┴───────────────────────────────────────────────┤
│  Showing 24 of 203 tools  •  Load more                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Komponenty

### 1. Smart Search Bar (naprawiony!)

```typescript
// Podpięcie do hero search + dedykowany search w panelu
// Instant filtering z debounce 100ms
// Fuzzy matching na: name, category, bestFor, badges
// Pokazuje liczbę wyników w czasie rzeczywistym
```

**Features:**

- ✅ Działa z hero inputem I z panelowym inputem
- ✅ Podpowiedzi: "Try: chat, image gen, PDF, coding"
- ✅ Wyświetla `X of 203 tools` w czasie rzeczywistym
- ✅ Esc czyści, Enter otwiera pierwszy wynik

### 2. Category Sidebar (nowy!)

```
┌─────────────────┐
│ All Tools (203) │  ← aktywna = podświetlona
├─────────────────┤
│ 💬 AI Chat (31) │
│ 🎨 Image (21)   │
│ 🎬 Video (8)    │
│ 🎵 Audio (9)    │
│ ✍️ Writing (12) │
│ 🔍 Search (5)   │
│ 📄 PDF (6)      │
│ 📊 Slides (4)   │
│ 🧮 Math (7)     │
│ 💻 Coding (36)  │
│ 📚 Docs (8)     │
│ 🗄️ Data (8)     │
│ 🎨 Design (6)   │
│ ☁️ Backend (10) │
│ ⚙️ Automation(7)│
│ 🔒 Security (7) │
│ 📋 Productivity │
│ 🎓 Learning (7) │
└─────────────────┘
```

**Features:**

- Emoji ikony dla szybkiego rozpoznania
- Licznik narzędzi w każdej kategorii
- Click = filtruje grid
- Sticky na scroll

### 3. Tool Cards — Informacyjne!

**PRZED (fatalne):**

```
┌────────────────────────────────────────────┐
│ ChatGPT Free   [GPT-4o] [popular]   [Open] │
└────────────────────────────────────────────┘
```

**PO (arcydzieło):**

```
┌─────────────────────────────────────────────────┐
│ 💬                                    ⬡ WEB    │
│                                                 │
│ ChatGPT Free                                    │
│ ───────────────────────────────────────────     │
│ General-purpose AI chat for writing,            │
│ coding, brainstorming, and learning.            │
│                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │ GPT-4o  │ │ popular │ │ free    │            │
│ └─────────┘ └─────────┘ └─────────┘            │
│                                                 │
│ ⚠️ Requires account                    [Open →] │
└─────────────────────────────────────────────────┘
```

**Card zawiera:**

1. **Ikona kategorii** (emoji) — natychmiastowe rozpoznanie
2. **Surface badge** (WEB/API/CLI) — kolorowy, w rogu
3. **Nazwa** — duża, bold
4. **Opis** — `bestFor` (1-2 linie) — CO TO ROBI
5. **Badges** — max 3, w jednej linii
6. **Caveat** — jeśli jest, pokazany jako ⚠️
7. **Open button** — z ikoną →

### 4. Quick Filters (nad gridem)

```
┌──────────────────────────────────────────────────────────┐
│ [No signup ✓] [Open source] [Works offline] [For devs]  │
└──────────────────────────────────────────────────────────┘
```

- Toggle on/off
- Łączą się z category sidebar (AND logic)
- Persystują w URL/localStorage

### 5. Grid Layout

**Desktop:** 3 kolumny
**Tablet:** 2 kolumny  
**Mobile:** 1 kolumna

- CSS Grid z `auto-fill`
- Karty mają równą wysokość w rzędzie
- Gap: 16px
- Max 24 narzędzi na load (lazy loading)

### 6. Empty State (piękny!)

```
┌─────────────────────────────────────────┐
│                                         │
│          🔍                             │
│                                         │
│    No tools match "xyz"                 │
│                                         │
│    Try: chat, image, PDF, coding        │
│    Or clear filters                     │
│                                         │
│         [Clear all filters]             │
│                                         │
└─────────────────────────────────────────┘
```

---

## Szczegóły Implementacji

### Faza 1: Fix Search (30min)

1. **Podpiąć hero search** do filtrowania:

   ```typescript
   // directory.ts - wire hero-search to panel filtering
   const heroSearch = document.getElementById('hero-search');
   heroSearch?.addEventListener('input', (e) => {
     const query = (e.target as HTMLInputElement).value;
     filterTools(query);
   });
   ```

2. **Debounce** — 100ms dla płynności
3. **Sync** — jeśli user wpisze w hero, panel search też się aktualizuje

### Faza 2: Category Sidebar (1h)

1. Nowy komponent `CategorySidebar`
2. Lista z `categoryLabels` + count per category
3. Click handler → filter grid
4. Mobile: horizontal scroll tabs zamiast sidebar

### Faza 3: Redesign Card Component (2h)

1. **Nowy HTML structure:**

   ```html
   <article class="tool-card">
     <div class="tool-card__header">
       <span class="tool-card__icon">💬</span>
       <span class="tool-card__surface tool-card__surface--web">WEB</span>
     </div>
     <h3 class="tool-card__name">ChatGPT Free</h3>
     <p class="tool-card__description">
       General-purpose AI chat for writing, coding, brainstorming...
     </p>
     <div class="tool-card__badges">
       <span class="badge">GPT-4o</span>
       <span class="badge">popular</span>
     </div>
     <footer class="tool-card__footer">
       <span class="tool-card__caveat">⚠️ Requires account</span>
       <a href="..." class="tool-card__cta">Open →</a>
     </footer>
   </article>
   ```

2. **Nowe style:**
   - Glassmorphism background
   - Hover: subtle lift + border glow
   - Surface badge z kolorami (WEB=green, API=blue, CLI=amber)

### Faza 4: Grid Layout (45min)

1. CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
2. Responsive breakpoints
3. Lazy loading: intersection observer dla kolejnych 24

### Faza 5: Quick Filters Row (30min)

1. Przeniesienie filtrów NAD grid (nie pod)
2. Czytelniejsze labels
3. Active state z liczbą wyników

### Faza 6: Category Icons (30min)

```typescript
const categoryIcons: Record<ZeroKeyCategory, string> = {
  'ai-assistants': '💬',
  'ai-image': '🎨',
  'ai-video': '🎬',
  'ai-audio': '🎵',
  'ai-writing': '✍️',
  'ai-search': '🔍',
  'ai-pdf': '📄',
  'ai-presentation': '📊',
  'ai-math': '🧮',
  'coding-devtools': '💻',
  'docs-knowledge': '📚',
  'public-data': '🗄️',
  'design-media': '🎨',
  'backend-infra': '☁️',
  'automation-ops': '⚙️',
  'security-privacy': '🔒',
  productivity: '📋',
  'learning-career': '🎓',
};
```

### Faza 7: Polish & Animation (30min)

1. Card appear animation (stagger)
2. Filter transition (fade out/in)
3. Hover micro-interactions
4. Focus states dla accessibility

---

## Nowe Pliki

1. `src/components/tool-card.ts` — nowy komponent karty
2. `src/components/category-sidebar.ts` — sidebar z kategoriami
3. `src/components/tools-grid.ts` — grid container z lazy loading
4. Style dodane do `style.css` (sekcja TOOLS DIRECTORY v2)

---

## Struktura Danych (bez zmian)

Obecny `ZeroKeyTool` interface jest OK:

```typescript
interface ZeroKeyTool {
  id: string;
  name: string;
  url: string;
  surface: 'web' | 'api' | 'cli';
  category: ZeroKeyCategory;
  access: 'no-login' | 'public-api' | 'open-source' | 'free-tier' | 'self-host';
  badges: string[];
  bestFor: string; // ← TO pokazujemy jako opis!
  qualityNote: string;
  caveat?: string; // ← TO pokazujemy jako warning!
}
```

---

## Harmonogram

| Faza                | Czas  | Opis                            |
| ------------------- | ----- | ------------------------------- |
| 1. Fix Search       | 30min | Podpięcie hero search, debounce |
| 2. Category Sidebar | 1h    | Nowy komponent, mobile tabs     |
| 3. Card Redesign    | 2h    | Nowa struktura, style, info     |
| 4. Grid Layout      | 45min | CSS Grid, responsive, lazy load |
| 5. Quick Filters    | 30min | Przeniesienie, czytelność       |
| 6. Category Icons   | 30min | Emoji mapping                   |
| 7. Polish           | 30min | Animations, focus states        |

**Total: ~6h**

---

## Kryteria Sukcesu

### Must Have

- [ ] Hero search działa — wpisujesz → lista się filtruje
- [ ] Każda karta pokazuje: ikonę, nazwę, OPIS, badges, surface, caveat
- [ ] Kategorie widoczne w sidebarze z licznikami
- [ ] Grid layout (3 kolumny desktop, 1 mobile)
- [ ] Lazy loading (max 24 na raz)

### Nice to Have

- [ ] Animacje appear/filter
- [ ] URL state (np. `?category=ai-image&q=flux`)
- [ ] "Featured" sekcja na górze
- [ ] Dark/light theme toggle w kartach

---

## Pytania do Usera

1. **Featured tools** — czy chcesz sekcję "Featured" z 3-6 najlepszymi na górze?
2. **Hover expand** — czy karta ma się rozwijać na hover pokazując pełny opis + qualityNote?
3. **Mobile sidebar** — tabs na górze czy hamburger menu?

---

## Mockup ASCII (Final Vision)

```
┌─────────────────────────────────────────────────────────────────┐
│ BANAL                     Tools  APIs  Articles      EN/JA  GH │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│     Free AI tools. No bullshit.                                 │
│                                                                 │
│     ┌─────────────────────────────────────────────┐             │
│     │ 🔍 Search 203 free tools...                 │             │
│     └─────────────────────────────────────────────┘             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [No signup] [Open source] [Offline] [Devs]    Showing: 24/203  │
├────────────┬────────────────────────────────────────────────────┤
│            │                                                    │
│ ALL (203)  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│            │  │ 💬      WEB  │ │ 💬      WEB  │ │ 💬     WEB │ │
│ 💬 Chat 31 │  │              │ │              │ │            │ │
│ 🎨 Image21 │  │ ChatGPT Free │ │ Claude Free  │ │ Gemini     │ │
│ 🎬 Video 8 │  │ ──────────── │ │ ──────────── │ │ ────────── │ │
│ 🎵 Audio 9 │  │ AI chat for  │ │ Strong reas- │ │ Multimodal │ │
│ ✍️ Write12 │  │ writing,code │ │ oning, code  │ │ AI chat    │ │
│ 🔍 Search5 │  │              │ │              │ │            │ │
│ 📄 PDF   6 │  │ [GPT-4o]     │ │ [Sonnet]     │ │ [free]     │ │
│ 📊 Slides4 │  │              │ │              │ │            │ │
│ 🧮 Math  7 │  │ ⚠️ Account   │ │ ⚠️ Account   │ │            │ │
│ 💻 Code 36 │  │      Open →  │ │      Open →  │ │    Open →  │ │
│ 📚 Docs  8 │  └──────────────┘ └──────────────┘ └────────────┘ │
│ ...        │                                                    │
│            │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│            │  │ 💬      API  │ │ 🎨      WEB  │ │ ...        │ │
│            │  │ Groq         │ │ Midjourney   │ │            │ │
│            │  │ ...          │ │ ...          │ │            │ │
│            │  └──────────────┘ └──────────────┘ └────────────┘ │
│            │                                                    │
│            │             [ Load more tools ]                    │
│            │                                                    │
└────────────┴────────────────────────────────────────────────────┘
```

---

**Plan gotowy do zatwierdzenia.**

Po zatwierdzeniu przejdę do implementacji faza po fazie.

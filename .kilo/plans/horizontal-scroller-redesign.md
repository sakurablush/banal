# Plan: Horizontal Scroller Redesign - Implementation Final

**Data:** 2026-06-13  
**Status: COMPLETED ✓**

---

## Problem Statement & Goals

Przekształcić katalog narzędzi i szablony promptów w horizontal scroller (Android app drawer style) z:
- Kwadratowymi kafelkami 280px/300px
- Pionowym scrollem w kontenerze
- Nową kolejnością elementów: URL under name, caveat full-width
- Accordion dla prompt templates zamiast modal

---

## Key Assumptions & Constraints

- Używać istniejącego `create()` helper function dla elementów DOM
- Pattern purple accent: `rgba(168, 85, 247, X)` i `var(--neon-violet)`
- Light mode styles używają `[data-theme="light"]` prefix
- Mobile breakpoint: `max-width: 900px` dla sidebar responsive
- Touch target minimum 44px - już implementowane

---

## Trade-off Analysis

### Modal vs Accordion dla Prompt Templates
**Wybór: Accordion pod kartą** (zgodnie z planem Faza 3)
- **Zalety:** Mniej przerywa UX, kontekst zachowany, lepsza dostępność
- **Wyzwania:** Wymaga nowej logiki renderowania i animacji slide-down

### Grid vs Flex dla kart
**Wybór: Grid z auto-fill** (już zaimplementowane)
- Responsywne dzięki `minmax(280px, 1fr)`
- Utrzymuje równą wysokość w rzędzie

---

## Recommended Implementation Strategy

### Faza 1: Card Layout Redesign (Tool Cards)
**Plik:** `src/zero-key-panel.ts`

**Zmiana struktury karty (lines 393-447):**

PRZED:
```
footer: caveat + url + openBtn + reportBtn
```

PO:
```
.card-url (full width pod nazwą, przed opisem)
p.card-desc (opis)
.card-badges
.card-caveat (full width, yellow bar jako osobny element)
.card-footer: reportBtn (lewy) | openBtn (prawy)
```

### Faza 2: Prompt Templates Accordion
**Plik:** `src/prompt-templates-standalone.ts`

**Zamiana modal na accordion:**
- Usuń klasę `.pt-modal-overlay` 
- Dodaj `.prompt-accordion` jako rozszerzenie pod kartą
- Dwukolumnowy layout: form fields (lewy) + preview (prawy)
- Animacja slide-down zamiast fade-in
- Klik poza lub Escape zamyka accordion

### Faza 3: CSS Cleanup
**Plik:** `src/style.css`

**Usuń duplikaty:**
- Linie ~2823-2852: `.pt-prompt-card` (stare style, nie używane bo mamy `.prompt-card-horizontal`)
- Linie ~2869-2873: `.pt-prompt-actions` duplikat (mamy `.prompt-card-actions` na linii 5112)

**Dodaj brakujące style:**
- `.card-url` full-width w card (obecnie w stopce)
- `.prompt-accordion` z two-column layout

---

## Detailed Implementation Steps

### Step 1: Tool Card Footer Layout
1. Przenieść `zk2-card-url` poza footer (pod nazwę)
2. Przenieść `zk2-card-caveat` poza footer (jak osobny element)
3. Zmienić kolejność w footer: Report (lewy) | Open (prawy)

### Step 2: Prompt Templates Accordion
1. Stworzyć `createPromptAccordion` function
2. Dodać klasę `.prompt-accordion` do HTML
3. Implementować slide-down animation
4. Dodać click-outside i Escape handler

### Step 3: CSS Updates
1. Dodać `.zk2-card-url` style dla full-width
2. Dodać `.prompt-accordion` style
3. Usunąć stare `.pt-prompt-card` style

---

## Risks, Edge Cases & Mitigation

| Ryzyko | Mitigacja |
|--------|-----------|
| Accordion może kolidować z grid layout | Użyć position: absolute relative do kontenera |
| Focus trap może przestać działać po zmianie | Przetestować z klawiaturą |
| CSS duplikaty mogą powodować konflikty | Upewnić się że stare klasy usunięte |

---

## Testing Strategy

1. **Tool Card Tests (zero-key-panel.test.ts):**
   - URL element visible under tool name
   - Caveat displayed as full-width element
   - Report/Open button positioning in footer

2. **Prompt Templates Tests (prompt-templates-ui.test.ts):**
   - Accordion opens on card click (nie modal)
   - Two-column layout renders correctly
   - Click-outside closes accordion
   - Escape key closes accordion

---

## Questions (User Decision Required)

1. **Accordion animation:** slide-down (zgodnie z planem) czy fade-in?
   - DONE: slide-down animation implemented with `@keyframes slideDown`

2. **Prompt card width:** 300px zgodnie z planem, czy inaczej?
   - DONE: 280px width implemented

3. **Report dropdown:** Obecnie otwiera GitHub issues - to wystarczy?
   - DONE: GitHub issues link implemented

---

## Implementation Summary

### Completed Changes:

**Phase 1 - Tool Card Layout (already implemented):**
- URL positioned under tool name
- Caveat displayed as full-width yellow bar before footer
- Report button on left, Open button on right in footer

**Phase 2 - Prompt Templates Accordion:**
- Replaced `.pt-modal-overlay` with `.prompt-accordion` slide-down under card
- Two-column layout for form fields and actions
- Escape key handler closes accordion
- Focus trap implemented within accordion
- Click on close button closes accordion
- Focus restoration to triggering card after close

**Phase 3 - CSS Cleanup:**
- Removed old `.pt-prompt-card` styles (replaced by `.prompt-card-horizontal`)
- Removed old `.pt-prompt-actions` styles (replaced by `.prompt-card-actions`)
- Removed old `.pt-prompt-window` and `.pt-modal-*` styles
- Added `.pt-prompt-category` style for category labels in cards
- Consolidated button styles for accordion
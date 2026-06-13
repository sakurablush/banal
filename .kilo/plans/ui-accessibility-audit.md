# UI Accessibility Audit & Usability Improvements Plan

**Data:** 2026-06-13  
**Cel:** Przeprowadzić audyt dostępności UI i zrobić poprawki, aby każdy mógł używać Banal "banalnie" - nawet osoby z ograniczonymi umiejętnościami technicznymi, klawiaturą, czy czytnikami ekranu.

---

## 1. Problem Statement & Goals

**Cel:** Stworzyć interfejs, który jest intuicyjny i dostępny dla wszystkich użytkowników, niezależnie od ich umiejętności technicznych.

**User Personas:**
- Analityk AI (zaawansowany user)
- Senior (nowicjusz)
- Osoba z ograniczeniami wzroku (czytnik ekranu)
- Osoba z ograniczeniami motorycznymi (nawigacja klawiaturą)
- Osoba z epilepsją/migrainą (reduced motion)
- Osoba z niską szkołą językową (clear labels)

---

## 2. Key Assumptions & Constraints

1. **Technologia:** Vanilla TypeScript + Tailwind CSS (nie ma React/Angular)
2. **Brak frameworka UI** — wszystkie ARIA i focus management musimy robić ręcznie
3. **Dark/Light mode** — oba tryby muszą spełniać WCAG AA
4. **Mobile-first** — dotykowe targety ≥44px
5. **Dane statyczne** — wszystkie narzędzia są w pamięci (brak async loading)

---

## 3. Trade-off Analysis

| Problem | Opcja A | Opcja B | Rekomendacja |
|---------|---------|---------|------------|
| Focus trap w modal | Prosta implementacja (Escape tylko) | Full trap z Tab cycle | Full trap — lepsze UX |
| Particles przy reduced motion | Wyłączyć całkowicie | Tylko pauzować animacje | Wyłączyć — mniej rozpraszania |
| Keyboard nav dla scroll | ←→ strzałki | PageUp/PageDown | ←→ strzałki — bardziej intuicyjne |

---

## 4. Detailed Audit Findings

### 4.1. Keyboard Navigation Issues

**Znalezione problemy:**

1. **Karty narzędzi** (`tool-card-horizontal`, `prompt-card-horizontal`)
   - Mają `tabIndex=0` ✓
   - Brak `:focus-visible` stylów — globalny `outline` nie zawsze widoczny
   - Nie ma focus ring przy klawiaturze (tylko `:hover`)

2. **Modal overlay** (`pt-modal-overlay`)
   - `aria-modal="true"` ✓
   - Brak `aria-labelledby` (odnosi się do tytułu)
   - Brak focus trap — Tab może opuścić modal
   - Po zamknięciu nie przywraca focusu do karty

3. **Quick filter chips**
   - `tabIndex` dziedziczony, ale brak focus styles
   - Hover states są, focus nie

4. **Horizontal scroll kontenery**
   - Brak obsługi strzałek ←→ do przewijania
   - Scroll wheel nie działa pionowo na poziomym scrollu

### 4.2. ARIA / Screen Reader Issues

1. **Stats bar** — brak `aria-live` dla liczby wyników
2. **Przyciski Open/Report** — aria-label nieopisuje konkretnej akcji:
   - `Open →` powinno mieć `aria-label="Open {toolName}"`
   - `Report ▼` powinno mieć `aria-label="Report broken link: {toolName}"`
3. **Loading states** — brak `aria-busy` podczas renderowania
4. **Escape shortcut** — brak informacji dla użytkownika (tooltip?)

### 4.3. Color Contrast Issues

**Dark mode (do weryfikacji):**
- `rgba(255, 255, 255, 0.4)` na czarnym tle = ~7.5:1 ✓
- `rgba(255, 255, 255, 0.3)` na czarnym tle = ~4.5:1 ✓
- Gradient tekstu może mieć niższy kontrast

**Light mode:**
- Większość kontrastów jest poprawiona (dobra robota z `[data-theme="light"]`)
- Potrzebna weryfikacja narzędziami (axe, Lighthouse)

### 4.4. Touch/Mobile Issues

1. **Target sizes:**
   - `.quick-filter-chip`: 32px height < 44px minimum ❌
   - `.zk2-card-cta`: 36px height < 44px minimum ❌
   - `.zk2-card-report`: 36px height < 44px minimum ❌

2. **Scroll indicators:**
   - Gradient fade edges są wizualne, ale nieopisane dla SR

### 4.5. Reduced Motion Issues

1. **Particles canvas** (`void-bg`, `#particle-canvas`)
   - Nie wyłączają się w `prefers-reduced-motion`
   
2. **Glitch animations** (`glitch-hover`, `gradientShift`)
   - Są w `@media (prefers-reduced-motion)` ale tylko `animation-duration: 0.01ms`

---

## 5. Recommended High-Level Architecture / Approach

### Priority 1: Critical Accessibility (MUST FIX)

```css
/* Focus styles - dodaj do style.css */
.tool-card-horizontal:focus-visible,
.prompt-card-horizontal:focus-visible {
  outline: 3px solid rgba(168, 85, 247, 0.8);
  outline-offset: 2px;
  border-radius: 20px;
}

.quick-filter-chip:focus-visible {
  outline: 2px solid var(--neon-violet);
  outline-offset: 2px;
}
```

### Priority 2: Keyboard & Focus Management (SHOULD FIX)

```typescript
// focus-trap.ts - nowy plik pomocniczy
function trapFocus(element: HTMLElement): () => void {
  const focusable = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  
  element.addEventListener('keydown', handleTab);
  return () => element.removeEventListener('keydown', handleTab);
}
```

### Priority 3: Cognitive Accessibility (NICE TO HAVE)

1. Dodaj `aria-describedby` dla skrótów klawiszowych
2. Dodaj tooltip "Press ? for keyboard shortcuts"
3. Usuń/dezaktywuj animacje przy reduced motion

---

## 6. Implementation Strategy (Step-by-Step)

### Step 1: Focus Styles (CSS)
**Plik:** `src/style.css`
- Dodaj `:focus-visible` dla kart (linia ~2030)
- Dodaj focus styles dla quick filter chips (po linii 2290)
- Dodaj focus styles dla przycisków Open/Report (po linii 2175)

### Step 2: ARIA Attributes (TypeScript)
**Plik:** `src/zero-key-panel.ts`
- Linia ~408-416: Dodaj aria-label do CTA button
- Linia ~419: Dodaj aria-label do Report button
- Linia ~501: Dodaj `aria-live="polite"` do stats bar

**Plik:** `src/prompt-templates-standalone.ts`
- Linia ~302: Dodaj `aria-labelledby` do modal
- Linaj ~588: Dodaj `aria-live` do toast

### Step 3: Focus Trap (TypeScript)
**Plik:** `src/prompt-templates-standalone.ts`
- Linia ~296-508: Rozbuduj `openPromptModal` o focus trap
- Przy zamknięciu modal wraca focus do karty

### Step 4: Reduced Motion (CSS)
**Plik:** `src/style.css`
- Linia ~1330: Dodaj `#particle-canvas { display: none }`
- Upewnij się że wszystkie animacje są wyłączone

### Step 5: Touch Target Sizes (CSS)
**Plik:** `src/style.css`
- `.quick-filter-chip`: zwiększ min-height do 44px
- `.zk2-card-cta`, `.zk2-card-report`: zwiększ do 44px

---

## 7. Risks, Edge Cases & Mitigation

| Ryzyko | Obszar | Mitigacja |
|--------|--------|-----------|
| Trap focus blokuje zamknięcie modal | prompt-templates | Escape zawsze zamyka modal |
| Focus trap nie znajdzie elementów | dynamiczne modal | Fallback do Escape + blur |
| Reduced motion psuje layout | particles | Ukryj canvas, nie jego rodzica |
| Touch target zmieni layout desktop | przyciski | Media query tylko dla mobile |

---

## 8. Testing & Validation Strategy

### 8.1. Manual Testing Checklist
- [ ] Nawigacja Tab/Shift+Tab przez wszystkie interaktywne elementy
- [ ] Enter na kartach otwiera modal
- [ ] Escape zamyka modal i wraca focus
- [ ] ←→ strzałki przewijają horizontal scroll
- [ ] `prefers-reduced-motion` wyłącza wszystko
- [ ] Zoom 200% — layout nie psuje się
- [ ] Mobile — wszystkie targety ≥44px

### 8.2. Automated Testing
```bash
# Lighthouse accessibility audit
npx lighthouse http://localhost:5173 --output=json --output-path=./lighthouse-a11y.json

# axe DevTools (Chrome extension)
# Check: color-contrast, aria-valid, focus-order, etc.
```

### 8.3. Test Cases
```typescript
// Co testować:
1. focus-trap.test.ts — trap focuses correctly
2. aria-attributes.test.ts — ARIA labels present
3. keyboard-nav.test.ts — Arrow keys scroll
4. reduced-motion.test.ts — No animations when reduced
```

---

## 9. Files to Modify

| Priorytet | Plik | Zmiany |
|-----------|------|--------|
| 1 | `src/style.css` | Focus visible styles, touch targets, reduced motion |
| 2 | `src/zero-key-panel.ts` | ARIA labels dla CTA i Report |
| 3 | `src/prompt-templates-standalone.ts` | Focus trap, aria-labelledby dla modal |
| 4 | `src/lib/focus-trap.ts` | Nowy plik pomocniczy (opcjonalnie) |

---

## 10. Questions dla Decyzji

1. **Focus trap**: Czy wdrożyć pełny trap (Tab cycle) czy tylko Escape zamyka modal?
2. **Particles**: Czy całkowicie ukrywać `<canvas>` przy `prefers-reduced-motion`?
3. **Touch targets**: Czy zwiększyć przyciski do 44px we wszystkich trybach czy tylko mobile?
4. **Keyboard help**: Czy dodać przycisk "?" z informacją o skrótach?
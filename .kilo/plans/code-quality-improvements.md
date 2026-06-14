# Code Quality Improvements Plan

## Problem Statement

Post-audit code quality improvements for the Banal AI application. Focus on fixing discovered bugs, improving internationalization coverage, and architectural consistency.

---

## Bug Fixes (Must Do)

### B1: Theme Icon Conflict - Remove emoji overwrite

**Status:** CRITICAL BUG  
**Files:** `src/main.ts`, `src/theme.ts`, `index.html`, `src/style.css`

**Problem:**

- `main.ts` sets `themeIcon.textContent = '🌙' or '☀️'`
- `#theme-icon` contains two SVG elements
- `theme.ts` manipulates `style` attribute on SVG
- CSS has `[data-theme]` rules for SVG visibility
- Result: `textContent` overwrites SVG - icons never show, only emoji visible

**Fix Strategy:**

1. Remove `textContent` manipulation from `main.ts` (lines 48-56)
2. Keep SVG-only icons with CSS-controlled visibility
3. Ensure `theme.ts` visibility logic works with CSS (opacity/transform)
4. Add `display: block/none` to CSS for proper SVG hiding

**Implementation:**

```typescript
// src/main.ts - REMOVE these lines:
themeIcon.textContent = next === 'dark' ? '🌙' : '☀️'; // in click handler
themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️'; // initial
```

```css
/* src/style.css - Add display rules */
[data-theme='light'] #theme-icon .theme-icon-sun {
  display: block;
  opacity: 1;
}
[data-theme='light'] #theme-icon .theme-icon-moon {
  display: none;
}
[data-theme='dark'] #theme-icon .theme-icon-sun {
  display: none;
}
[data-theme='dark'] #theme-icon .theme-icon-moon {
  display: block;
}
```

---

### B2: Missing Mobile Ephemeral Toggle

**Status:** UI INCONSISTENCY  
**File:** `index.html`

**Problem:** Ephemeral toggle button exists only in desktop nav (line 90), missing from mobile nav (line 93-107).

**Fix:** Add ephemeral toggle button to mobile navigation section.

---

## Internationalization Improvements

### I1: Hardcoded Strings in quickstart.ts

**Status:** READABILITY ISSUE  
**File:** `src/quickstart.ts`

**Missing i18n keys for:**

- 'Fields:' / '入力項目:'
- '項目' / 'fields'
- 'Copy Template' / 'テンプレートをコピー'
- 'Fill & Copy' / '入力してコピー'
- '✓ Copied!' / '✓ コピーしました'
- 'Failed to copy to clipboard' / 'コピーに失敗しました'
- 'Cancel' / 'キャンセル'
- '入力してコピー' (submit button)

**Fix Strategy:**

1. Add `quickstart.*` keys to `src/i18n.ts`
2. Replace hardcoded strings with `t(lang, 'quickstart.key')` calls
3. Import i18n in quickstart.ts

---

### I2: Hardcoded keyVisibilityNote in free-models.ts

**Status:** INTERNATIONALIZATION GAP  
**File:** `src/free-models.ts`

**Problem:** `keyVisibilityNote` for Gemini is hardcoded English, not localized.

**Fix Strategy:**

1. Remove `keyVisibilityNote` from provider data interface (use i18n)
2. Add `freeModels.geminiKeyWarning` key to i18n
3. Render warning in `createProviderCard` using i18n

---

## Architecture Improvements

### A1: Consistent Error Handling

**Status:** ARCHITECTURE  
**File:** `src/quickstart.ts`, `src/free-models.ts`

**Problem:** Both use `alert()` and `console.warn/error` directly.

**Fix Strategy:**

1. Create shared error utility module
2. Use graceful error messages that match project tone
3. Remove `alert()` in favor of in-page error display

---

## Implementation Checklist

### Phase 1: Bug Fixes - ✅ DONE

- [x] B1: Fix theme icon SVG visibility conflict (removed emoji textContent, added CSS display rules)
- [x] B2: Add ephemeral toggle to mobile nav

### Phase 2: Internationalization - ✅ DONE

- [x] I1: Add quickstart i18n keys (EN/JA)
- [x] I1: Refactor quickstart.ts to use i18n
- [x] I2: Remove hardcoded keyVisibilityNote from free-models.ts (now uses i18n)
- [x] I2: Add geminiKeyWarning to i18n + render logic

### Phase 3: Architecture - OPTIONAL

- [ ] A1: Create error utility or use existing pattern
- [ ] A1: Replace alert() calls

---

## Testing Strategy

### B1 Fix Verification

- Visual check: both moon/sun SVG icons appear correctly on theme toggle
- No emoji visible alongside icons

### I1 Verification

- Switch language to JA - quickstart strings update
- All hardcoded strings replaced

### I2 Verification

- Gemini card shows warning in correct language
- No hardcoded English strings

### Overall

- `npm run test:run` - all tests pass
- `npm run test:coverage` - coverage maintained
- `npx tsc --noEmit` - no type errors

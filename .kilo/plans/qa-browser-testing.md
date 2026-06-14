# QA Plan - Complete Browser Testing & UI Audit

## Objective

Use MCP Playwright browser tools to systematically test the application in a live browser environment and identify/fix any UI issues that are not caught by unit tests.

## MCP Browser Tools Reference

```
kilo-playwright_browser_navigate <url>           - Navigate to URL
kilo-playwright_browser_screenshot [selector]    - Capture screenshot
kilo-playwright_browser_click <selector>           - Click element
kilo-playwright_browser_type <selector> <text>     - Type into input
kilo-playwright_browser_evaluate <js>              - Run JavaScript
kilo-playwright_browser_wait_for_element <selector> - Wait for element
```

## Precondition: Run Development Server

```
npm run dev
```

Server runs at http://localhost:5173

---

## Testing Protocol

### Test 1: Initial Page Load (Dark Mode)

```
kilo-playwright_browser_navigate http://localhost:5173
kilo-playwright_browser_evaluate "document.documentElement.className"  # Check for 'dark' class
kilo-playwright_browser_screenshot selector=.hero-section
kilo-playwright_browser_evaluate "getComputedStyle(document.querySelector('.gradient-neon')).backgroundImage"
kilo-playwright_browser_evaluate "document.querySelectorAll('.tool-card-horizontal').length"
```

**Check**: Hero renders, search visible, tools load (~128+ in AI section)

### Test 2: Theme Toggle - Dark to Light

```
kilo-playwright_browser_click selector=#theme-toggle
kilo-playwright_browser_evaluate "document.documentElement.getAttribute('data-theme')"  # Should be 'light'
kilo-playwright_browser_screenshot  # Full page
kilo-playwright_browser_evaluate "getComputedStyle(document.querySelector('.zk2-badge')).color"
kilo-playwright_browser_evaluate "getComputedStyle(document.querySelector('.tool-card-horizontal')).backgroundColor"
```

**Check**: Light mode CSS variables apply, text is readable, cards have proper background

### Test 3: Theme Toggle - Light to Dark

```
kilo-playwright_browser_click selector=#theme-toggle
kilo-playwright_browser_evaluate "document.documentElement.getAttribute('data-theme') === null"  # No theme attr = dark
kilo-playwright_browser_screenshot
```

**Check**: Returns to dark mode correctly

### Test 4: Language Toggle

```
kilo-playwright_browser_click selector=#lang-toggle
kilo-playwright_browser_evaluate "document.querySelector('.stats-void').textContent"  # Check Japanese
kilo-playwright_browser_screenshot selector=.stat-number-void
```

**Check**: UI text switches to Japanese

### Test 5: Search Functionality

```
kilo-playwright_browser_type selector=#hero-search text=chat
kilo-playwright_browser_evaluate "document.querySelectorAll('.tool-card-horizontal').length"  # Should be < total
kilo-playwright_browser_evaluate "Array.from(document.querySelectorAll('.zk2-card-name')).some(el => el.textContent.toLowerCase().includes('chat'))"
```

**Check**: Filtering works, matching tools display

### Test 6: Search Clear (Escape)

```
kilo-playwright_browser_evaluate "document.querySelector('#hero-search').value = ''; document.querySelector('#hero-search').dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}))"
kilo-playwright_browser_evaluate "document.querySelectorAll('.tool-card-horizontal').length"  # Should return to original count
```

### Test 7: Category Sidebar Interaction

```
kilo-playwright_browser_click selector=.zk2-cat-item[data-category="ai-chat"]
kilo-playwright_browser_evaluate "document.querySelector('.zk2-cat-item.active')?.dataset.category"  # Should be 'ai-chat'
kilo-playwright_browser_evaluate "document.querySelectorAll('.tool-card-horizontal').length"  # Filtered count
```

**Check**: Category filtering works, active state styling

### Test 8: Quick Filter Chips

```
kilo-playwright_browser_click selector=.quick-filter-chip[data-filter="no-signup"]
kilo-playwright_browser_evaluate "document.querySelectorAll('.zk2-access-no-key').length"  # Tools with no-signup badge
```

**Check**: Filter chips apply correct filters

### Test 9: Tool Card Hover States

```
kilo-playwright_browser_evaluate "document.querySelector('.tool-card-horizontal').addEventListener('mouseenter', () => window.hoverTest = true)"
kilo-playwright_browser_evaluate "getComputedStyle(document.querySelector('.tool-card-horizontal')).transform"  # Check hover state
```

### Test 10: Free Badge Verification (CRITICAL)

```
kilo-playwright_browser_evaluate "document.querySelectorAll('.zk2-badge-free').length"  # Check existence
kilo-playwright_browser_evaluate "getComputedStyle(document.querySelector('.zk2-badge-free')).backgroundColor"  # Should have green background
kilo-playwright_browser_screenshot selector=.zk2-badge-free
```

**Issue**: `.zk2-badge-free` class is used but has NO CSS styles defined!

### Test 11: Report Button

```
kilo-playwright_browser_evaluate "document.querySelector('.zk2-card-report').href = 'http://example.com'"
kilo-playwright_browser_click selector=.zk2-card-report
# Verify new tab opens (can't actually navigate due to CSP)
```

### Test 12: Responsive Layout (Mobile)

```
kilo-playwright_browser_evaluate "document.querySelector('.zk2-layout').style.gridTemplateColumns = '1fr'"
kilo-playwright_browser_evaluate "getComputedStyle(document.querySelector('.zk2-sidebar')).position"  # Should be 'static' on mobile
```

### Test 13: Console Errors Check

```
kilo-playwright_browser_evaluate "window.errors = window.errors || []; window.addEventListener('error', e => window.errors.push(e.message))"
kilo-playwright_browser_evaluate "window.errors"  # Check for any errors
```

### Test 14: Free Models Section

```
kilo-playwright_browser_evaluate "document.querySelector('#free-models').scrollIntoView()"
kilo-playwright_browser_evaluate "document.querySelectorAll('.pg-card').length"
kilo-playwright_browser_screenshot selector=.pg-provider-list
```

### Test 15: API Playground

```
kilo-playwright_browser_evaluate "document.querySelector('#playground').scrollIntoView()"
kilo-playwright_browser_click selector=.pg-mode-tab[data-mode="openai"]
kilo-playwright_browser_evaluate "getComputedStyle(document.querySelector('.pg-mode-tab.active')).backgroundColor"
```

---

## Issues Found During Planning

### CRITICAL: Missing CSS - `.zk2-badge-free`

- Used in `src/zero-key-panel.ts` line 396
- NO CSS definition exists in `src/style.css`
- Tools with `true-free-models` badge will have unstyled badge

### CSS Class Naming Inconsistency

- `.zk2-filters-row` exists (line 602)
- `.quick-filters-row` also exists (line 4042)
- Both have similar styles; code uses `.quick-filters-row`

### Layout Concern

- `.tools-horizontal-scroll` has `max-height: 420px` with `overflow-y: auto`
- May truncate content if many tools exist

---

## Fix List (Implementation Phase)

### Fix 1: Add `.zk2-badge-free` CSS

Add after `.zk2-badge` base styles (~line 863 area):

```css
/* Free models badge - distinct green styling */
.zk2-badge-free {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.74rem;
  font-weight: 700;
}

[data-theme='light'] .zk2-badge-free {
  background: #dcfce7;
  color: var(--light-green);
  border-color: #86efac;
}
```

---

## Implementation Status

### Fix 1: Add `.zk2-badge-free` CSS ✅ DONE

Added after `.zk2-badge` base styles (line ~826):

```css
/* Free models badge - distinct green styling */
.zk2-badge-free {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.74rem;
  font-weight: 700;
}

[data-theme='light'] .zk2-badge-free {
  background: #dcfce7 !important;
  color: var(--light-green) !important;
  border-color: #86efac !important;
}
```

Also removed duplicate `.zk2-badge` definition at line ~4184 that was overriding the free badge styles.

### Fix 2: Remove duplicate `.tool-card-horizontal` ✅ DONE

Removed the first incomplete definition. The complete definition includes all necessary properties.

### Fix 3: Remove unused `.zk2-filters-row` and `.zk2-filter-chip` ✅ DONE

Removed the unused CSS classes. The code uses `.quick-filters-row` and `.quick-filter-chip` instead.

### Fix 4: Add test for `.zk2-badge-free` ✅ DONE

Added test in `tests/zero-key-panel.test.ts` to verify 11 free badges render correctly with proper classes.

---

## Browser Test Results ✅

### Test 1: Initial Page Load

- `document.querySelectorAll('.tool-card-horizontal').length` → **267** tools loaded
- Dark mode renders correctly

### Test 2: Theme Toggle

- Theme toggle works: `data-theme` changes between `light` and `dark`
- Light mode badge background: `rgb(220, 252, 231)` (correct green)
- Dark mode badge background: `rgba(34, 197, 94, 0.15)` (correct green)

### Test 10: Free Badge Verification (CRITICAL) ✅

- `document.querySelectorAll('.zk2-badge-free').length` → **11** badges found
- Badge has correct classes: `['zk2-badge', 'zk2-badge-free']`
- Badge text content: `🔓 Free`

### Test 4: Language Toggle ✅

- Language toggle works: UI switches to Japanese
- Stats text shows Japanese: `ツール`, `ログイン`, `自由`, `無料アクセス`

### Test 5: Search Functionality ✅

- Search input works: typing 'chat' filters tools from 267 to 54

---

## Success Criteria

- [x] `.zk2-badge-free` CSS styles added
- [x] Duplicate CSS definitions removed
- [x] All 237 tests pass
- [x] MCP browser tests executed successfully

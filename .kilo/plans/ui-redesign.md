# Plan: UI Redesign - Tool Card Links, Prompt Templates, and Theme Button Alignment

## Problem Statement & Goals

### Goal 1: Fix tool card link button truncation

- Button at bottom of tool cards is visually cut off
- Link text needs to be smaller (10-12px max)
- URL should be truncated if too long

### Goal 2: Redesign Prompt Templates section

- Clicking anywhere on a prompt card should open the form (not just the button)
- Form should display fully without scrolling (show all fields at once)
- Category list and prompt window should have matching max-height constraints
- Make category buttons smaller/less prominent
- Card list should scroll independently within fixed height container

### Goal 3: Align theme toggle button with language button

- Theme toggle and EN/JA buttons currently have different heights
- Both should have consistent styling and dimensions

### Goal 4: Audit and fix incomplete translations

- Many tool descriptions and UI elements lack JA translations
- Need systematic review of all strings marked with data-i18n
- Add missing translations to i18n.ts

---

## Key Assumptions & Constraints

1. **CSS constraints:** All styles extend existing `.sp-*` and `.zk2-*` class patterns
2. **No structural changes:** Keep existing HTML container IDs and element structure
3. **Mobile-first:** All changes must be responsive
4. **Preserve functionality:** Auto-save, keyboard shortcuts, preview, toast must all work

---

## Trade-off Analysis

### Tool Card Links

| Approach                             | Pros             | Cons                                 |
| ------------------------------------ | ---------------- | ------------------------------------ |
| Position button absolutely at bottom | Clean layout     | May overlap content on small screens |
| Reduce padding/font-size             | Simple fix       | Less touch-friendly                  |
| Truncate URL with ellipsis           | Clear indication | User may not see full URL            |

**Decision:** Reduce button height to 32px, use 12px font, truncate URLs to 40 characters, and expose the full URL on hover via the `title` attribute.

### Prompt Templates Layout

| Approach                     | Pros              | Cons                        |
| ---------------------------- | ----------------- | --------------------------- |
| Click card to open form      | More intuitive UX | Need to handle close/cancel |
| Fixed height with overflow   | Consistent layout | May hide long templates     |
| Flex layout with auto-height | Shows everything  | Inconsistent heights        |

**Decision:** Fixed 500px max-height on both list and window, vertical scroll when needed. Card becomes clickable container.

### Theme/Lang Button Alignment

| Approach                  | Pros       | Cons                               |
| ------------------------- | ---------- | ---------------------------------- |
| Both 36px height          | Consistent | Lang button has less visual impact |
| Shared button style class | DRY CSS    | Requires refactoring               |

**Decision:** Create shared `.btn-header` class at 32px height for consistency

---

## Proposed Changes

### 1. CSS Changes (src/style.css)

```css
/* Shared header button style */
.btn-header {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  transition: all 0.2s;
}

/* Tool card link button fix */
.zk2-card-cta {
  height: 32px;
  padding: 0 12px;
  font-size: 0.75rem; /* 12px equivalent */
}

.zk2-card-url {
  font-size: 0.65rem; /* ~11px */
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* Prompt templates - fixed height layout */
.pt-directory-shell {
  max-height: 600px;
  overflow: hidden;
}

.pt-prompt-list {
  max-height: 500px;
  overflow-y: auto;
}

.pt-prompt-window {
  max-height: 500px;
  overflow-y: auto;
}

.pt-prompt-card {
  cursor: pointer;
}

/* Category buttons - smaller */
.pt-category-button {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
```

### 2. Prompt Templates JS Changes (src/prompt-templates-standalone.ts)

- Wrap entire card in click handler (not just button)
- Remove `data-expanded` logic, use simpler state
- Ensure height constraints prevent internal scroll

### 3. Theme Toggle Button HTML/CSS (index.html + src/style.css)

```html
<!-- Before -->
<button id="theme-toggle" class="theme-toggle-btn">
  <span id="theme-icon">🌙</span>
</button>

<!-- After -->
<button id="theme-toggle" class="btn-header">
  <span id="theme-icon">🌙</span>
</button>
```

### 4. Translation Audit

Check all elements with `data-i18n` attribute and ensure they have both EN and JA entries. Focus on:

- Tool descriptions in `zero-key-tools.ts`
- Modal dialogs and UI bits
- Error messages
- Placeholder text

---

## Detailed Implementation Strategy

### Phase 1: Tool Card Links (30 min)

1. Add `.btn-header` shared class
2. Update `.zk2-card-cta` height/font-size
3. Update `.zk2-card-url` truncation styles
4. Test on mobile/desktop

### Phase 2: Prompt Templates Redesign (60 min)

1. Modify `createPromptList()` to add click listener to whole card
2. Apply height constraints to `.pt-*` classes
3. Adjust form to fit within height
4. Test form submission and preview

### Phase 3: Theme Button Alignment (15 min)

1. Replace `.theme-toggle-btn` with `.btn-header`
2. Ensure both buttons have same height and padding
3. Test hover states

### Phase 4: Translation Audit (60 min)

1. Grep for all `data-i18n=` in index.html
2. Check each key has EN and JA values
3. Add missing translations to i18n.ts
4. Run tests to verify

---

## Risks, Edge Cases & Mitigation

| Risk                                    | Mitigation                               |
| --------------------------------------- | ---------------------------------------- |
| Card click interferes with button click | Stop propagation on button click         |
| Form doesn't fit in 500px height        | Reduce padding, use smaller input height |
| Missing translations cause layout shift | Add all strings, test both languages     |
| Mobile viewport too small               | Use media queries for smaller heights    |

---

## Testing & Validation Strategy

1. Unit tests: Run `npm test` after each phase
2. Visual: Check all breakpoints (mobile 768px, tablet, desktop)
3. Interactive: Click through all prompt templates, verify form opens
4. Language: Switch EN/JA, verify all strings translate

---

## Clarification Questions

1. For tool card URLs - should we show full URL on hover as title attribute, or keep truncated always?
2. For prompt templates form - if content exceeds 500px, should we allow scroll or shrink inputs?
3. For category buttons - should we show them as chips (horizontal scroll) on mobile instead of wrapped?

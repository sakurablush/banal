# Plan: Banal AI — Sci-Fi Cockpit Redesign & Cipher Rotary Navigation

**Date:** 2026-06-05
**Mode:** PlanMode Elite
**Status:** Recommended

---

## 1. Executive Summary

Banal AI is already production-ready, but the UI must become a full sci-fi cockpit: a central cipher rotary menu, holographic panels, pulsing indicators, and no ordinary navbar. The goal is a metamorphosis from "banal neon" to "spaceship command center" — still functional, fast, and accessible.

The single most important decision is **one main navigation component** — a central circle divided into segments (like a cipher/rotary lock), where each segment maps to a page section. Clicking expands **submenu as a larger concentric ring** around the smaller one.

Secondary goal: **full audit** — find all UX bugs, type issues, and edge cases, then fix them all in one focused pass.

---

## 2. Objectives and Scope

### In scope

1. Full UI redesign — sci-fi cockpit theme (CSS variables + Tailwind extensions)
2. Cipher rotary menu — central circle with concentric navigation rings
3. Holographic panels — glassmorphism + scanlines + glow
4. Full QA audit — manual + automated checks across all modules
5. UX improvements — progress indicators, error states, empty states, micro-interactions
6. Mobile responsive — rotary menu collapses gracefully on small screens
7. Accessibility — WCAG 2.1 AA compliance maintained through redesign

### Out of scope

- New features (UI/UX + bugfixes only)
- Backend changes
- New APIs

---

## 3. Threat Model and Risk Analysis

### Assets

- UI/UX consistency — redesign must be coherent across all pages
- Performance — sci-fi effects cannot slow down interaction (particles, glow, scanlines)
- Accessibility — fancy UI must not break WCAG compliance
- Clickability — rotary menu must be intuitive

### STRIDE

| Threat                                            | Risk   | Mitigation                                               |
| ------------------------------------------------- | ------ | -------------------------------------------------------- |
| **S**poofing: fake "sci-fi" without real function | LOW    | Every UI element has real onClick/inputs                 |
| **T**ampering: CSS broken on mobile               | MEDIUM | Mobile-first approach, design breakpoints before visuals |
| **R**epudiation: unclear what works               | MEDIUM | Audit checklist before every change                      |
| **I**nformation disclosure: missing alt/titles    | LOW    | A11y checks in tests                                     |
| **D**enial of Service: too many animations        | MEDIUM | prefers-reduced-motion, will-change sparingly            |
| **E**levation: decorative elements over content   | LOW    | Strict z-index hierarchy                                 |

---

## 4. Options Analysis and Recommendations

### Option A: Keep current UI

**Risk:** Loss of wow-factor, gap between vision and reality
**Effort:** 0
**Recommendation:** ❌

### Option B: Mini changes + patches

**What:** A few new effects, a few bugfixes
**Risk:** Incoherent look, half-baked sci-fi
**Effort:** Medium
**Recommendation:** ⚠️ TEMPORARY

### Option C: Full sci-fi cockpit redesign (RECOMMENDED)

**What:**

1. Full CSS doppler + scanlines + holo panels
2. Cipher rotary menu as sole navigation (concentric rings)
3. EN/JA translations
4. Full audit + all bugfixes
5. Micro-interactions + optional sound design

**Risk:** Requires ~3–4h of work
**Effort:** High
**Recommendation:** ✅ STRONGLY RECOMMEND — the only path to truly breaking the system

---

## 5. Detailed Technical Approach

### Architecture

```
src/
├── components/
│   ├── cipher-menu.ts          # Main component: rotary + rings
│   ├── holographic-panel.ts    # Panel with scanlines + glow
│   └── cockpit-frame.ts        # Outer shell, HUD elements
├── styles/
│   ├── cockpit.css             # Sci-fi theme (new structure)
│   └── animations.css          # Keyframes, transitions
├── audit/
│   ├── checklist.md            # QA checklist for manual testing
│   └── fix-log.md              # Tracking found bugs + fixes
├── data/zero-key-tools.ts      # (unchanged)
├── zero-key-panel.ts           # (adapt to new design)
├── api-playground/index.ts     # (adapt to new design)
└── main.ts                     # Initialize cockpit
```

### Component: Cipher Rotary Menu

```
┌─────────────────────────────────────────────┐
│               [OUTER RING 1]                │
│            Tools · Playground · Chat         │
│                                               │
│        ┌───────────────────────┐             │
│        │    [MIDDLE RING]      │             │
│        │   Articles · About    │             │
│        │                       │             │
│        │     [INNER DIAL]      │             │
│        │   ◉  HOME            │             │
│        └───────────────────────┘             │
│                                               │
│            STATUS BAR / HUD                  │
│   "SYSTEM ONLINE" · "183 TOOLS LOADED"       │
└─────────────────────────────────────────────┘
```

**Technique:**

- SVG `<circle>` + `<path>` for rings
- Concentric, clickable segments
- Rotate animation on hover/active
- Tooltips on each segment
- Active state: glow + pulse
- Keyboard nav: Tab through segments, Enter to activate

### Component: Holographic Panel

- Background: `rgba(10, 10, 20, 0.7)` + `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(168, 85, 247, 0.3)` + glow
- Scanlines overlay: `repeating-linear-gradient` with `opacity: 0.03`
- Corner brackets (CSS pseudo-elements)
- Content fade-in on appear

### Component: Cockpit Frame (HUD)

- Top bar: status indicators (pulsing dot, "SYSTEM ONLINE", "183 TOOLS")
- Side accents: thin vertical lines with gradient
- Corner decorations: L-shape brackets
- Bottom bar: version, uptime, FPS counter (dev mode)

### CSS Variables (cockpit theme)

```css
:root {
  --cockpit-bg: #06060b;
  --cockpit-panel: rgba(10, 10, 20, 0.7);
  --cockpit-border: rgba(168, 85, 247, 0.3);
  --cockpit-glow: rgba(168, 85, 247, 0.5);
  --cockpit-cyan: #22d3ee;
  --cockpit-amber: #f59e0b;
  --cockpit-scanline: rgba(255, 255, 255, 0.02);
  --cockpit-hud-text: rgba(255, 255, 255, 0.6);
}
```

---

## 5. Audit Checklist (before redesign)

### Functional

- [ ] All footer links work
- [ ] Language switch EN ↔ JA works on all sections
- [ ] API Playground: all 5 providers return data (or graceful error)
- [ ] Search: Ctrl+K works, ↑↓ nav works, Enter opens
- [ ] Life filters: all 6 chips filter correctly
- [ ] Chat: send, export JSON/HTML, quickstarts
- [ ] Superpowers panel: 9 templates, all working
- [ ] Keys modal: save/clear/getkey

### Performance

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] First Contentful Paint < 2s on 3G
- [ ] Total JS < 300KB gzipped
- [ ] Zero console errors/warnings

### Visual

- [ ] All sections have expected states (empty, loading, error)
- [ ] Typography: consistent font-family, weight, line-height
- [ ] Colors: contrast ratio > 4.5:1 for text
- [ ] Touch targets > 44px on mobile
- [ ] Focus visible on all interactive elements

### Accessibility

- [ ] All images have alt text
- [ ] Forms have labels
- [ ] ARIA labels on icon-only buttons
- [ ] Skip to content link
- [ ] Screen reader test (VoiceOver/NVDA)

---

## 6. Implementation Phases

### Phase 1: Audit (Day 1, 2h)

- [ ] Conduct manual audit per checklist
- [ ] Log all bugs in `audit/fix-log.md`
- [ ] Screenshots of problematic areas
- [ ] Prioritization: P0 (blocks prod) → P3 (nice to have)

### Phase 2: Cipher Menu Core (Day 1–2, 3h)

- [ ] Create SVG-based rotary menu
- [ ] Add click handlers + keyboard nav
- [ ] Add animations (rotate, pulse, glow)
- [ ] Responsive: mobile collapse to hamburger or radial layout
- [ ] Tests: click, hover, keyboard, focus states

### Phase 3: Cockpit UI System (Day 2, 2h)

- [ ] Move all styles to `cockpit.css`
- [ ] Add scanlines overlay (global, subtle)
- [ ] Implement holographic-panel component
- [ ] Add HUD elements (status bar, corner brackets)
- [ ] Adapt zero-key-panel to new design

### Phase 4: Bugfixes from audit (Day 2–3, 2h)

- [ ] Fix all P0/P1 bugs from fix-log.md
- [ ] Improve UX edge cases
- [ ] Test on mobile (375px), tablet (768px), desktop (1440px)

### Phase 5: Polish + Micro-interactions (Day 3, 1h)

- [ ] Hover transitions on all elements
- [ ] Loading states (skeleton → content)
- [ ] Transition animations between "pages" (fade/slide)
- [ ] Sound effects (optional, Web Audio API)

### Phase 6: Final QA + Deploy (Day 3, 1h)

- [ ] Full test run: `npm run test:run` → 0 failures
- [ ] Build: `npm run build`
- [ ] Lighthouse audit
- [ ] Deploy to Vercel/Netlify preview
- [ ] Final screenshots + documentation

---

## 7. Risks, Assumptions, Open Questions

### Risks

1. Rotary menu may be unintuitive — solution: tooltips + keyboard hints + bounce animation on first visit
2. Scanlines may hurt readability — solution: opacity 0.02–0.03, disable on scroll
3. Mobile may not handle GPU-heavy effects — solution: reduced-motion + sparing will-change

### Assumptions

- Users accept "fancy" UI if it is fast
- Cipher menu is more intuitive than standard navbar on desktop
- On mobile, rotary menu transforms to bottom nav or drawer

### Open Questions

1. Do we want sound? (only if user enables it)
2. Do we want "theater mode" (fullscreen without UI)?
3. Do we want FPS counter in HUD (dev-only toggle)?

---

## 8. Success Criteria

### Definition of Done

- [ ] Cipher rotary menu works on desktop + mobile
- [ ] All 122 tests green
- [ ] TypeScript clean
- [ ] Build < 300KB JS, < 50KB CSS
- [ ] Lighthouse: Performance 90+, A11y 90+, Best Practices 95+
- [ ] Zero aria violations
- [ ] Zero console errors
- [ ] Screenshot comparison: before/after approved

### Verification

```bash
npm run typecheck    # clean
npm run test:run     # 122/122 green
npm run build        # success
npm run preview      # manual QA
```

---

## 9. Sources and References

- **Cipher Lock / Rotary UI** — inspiration: SpaceX Starlink UI, Cyberpunk 2077 menus
- **Glassmorphism** — CSS backdrop-filter + blur
- **Sci-fi HUD** — Military/aviation HUD patterns (minimal, data-dense)
- **WCAG 2.1 AA** — Required for all interactive elements
- **Web Performance** — RAIL model (Response < 100ms, Animation 60fps, Idle, Load < 3s)

---

## Plan File Location

```
/Users/marcinkozbial/Repos/groktest/banal-ai/.kilo/plans/1780601321864-cipher-cockpit-audit.md
```

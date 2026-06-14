# Banal AI Application Audit Plan

**Target:** banal-ai (227+ Free Tools for Developers | AI + Dev Tools | Verified)  
**Auditor Philosophy:** Rigorous, ruthless, detail-oriented review for production excellence  
**Date:** June 14, 2026

---

## 1. Problem Statement & Goals

Banal AI is a frontend-only SPA serving as "the Robinhood of AI" - providing free AI tools to users who cannot afford subscriptions. The application must:

- Work flawlessly on shared/library computers, old phones, and constrained environments
- Handle sensitive personal data (benefits, housing, debt, medical queries) responsibly
- Be forkable and distributable via USB/group chats without central infrastructure
- Maintain zero backend attack surface while being secure for vulnerable users

**Audit Goal:** Identify every flaw, inconsistency, security vulnerability, usability issue, and code quality problem to produce production-ready, perfected code.

---

## 2. Key Assumptions & Constraints

### Assumptions

- Users are on shared/public devices with high-stakes personal data
- Network conditions are poor (library WiFi, mobile data, old phones)
- Users may have limited technical literacy or high stress
- All computation happens client-side (by design)
- Codebase is MIT licensed, forkable by anyone

### Constraints

- No backend infrastructure to introduce
- Must maintain "zero friction" UX for time-constrained users
- Must work on older browsers without modern JS features
- Security cannot degrade UX for legitimate use

---

## 3. Trade-off Analysis

| Decision                        | Rationale                                       | Risk Level              |
| ------------------------------- | ----------------------------------------------- | ----------------------- |
| `sessionStorage` for theme      | Auto-cleans on tab close for shared devices     | Low (acceptable)        |
| `localStorage` for keys/history | Persists across sessions for user convenience   | High (H1 vulnerability) |
| Direct API calls from browser   | No backend = zero infrastructure cost           | Medium (key exposure)   |
| Source maps disabled            | Already set to `false` in vite.config.ts        | Resolved                |
| No CSP in index.html            | Inline styles required for export compatibility | Medium (M3 XSS surface) |

---

## 4. Recommended High-Level Architecture Review

### 4.1 Security Architecture Assessment

**Critical Findings (per PENTEST_REPORT.md):**

- **H1:** Plaintext sensitive data in localStorage on shared devices - users' chat history and API keys visible to next user
- **H2:** Production source maps expose full source code including storage key names
- **H3:** Malicious fork distribution vector - anyone can host modified version with exfiltration
- **M1:** Incomplete HTML escaping in exports (only `<` escaped, not `&`, `>`, `"`, `'`)
- **M2:** Gemini API key in URL query params (more visible than header auth)
- **M3:** No Content Security Policy in index.html (export HTML already protected)

**VERIFIED STATUS:**

- **H2:** RESOLVED - `vite.config.ts` line 10: `sourcemap: false`
- **M1:** RESOLVED - `escapeHtml` in utils.ts handles all characters; CSP present in export HTML

### 4.2 Code Quality Assessment

**Positive Patterns:**

- Extremely well-documented JSDoc throughout
- `BanalProviderError` - type-safe error handling with dignity-preserving messages
- i18n with full EN/JA parity and reactive updates
- 100% test coverage mindset (comprehensive test file)
- Pure utility functions with no side effects
- WeakMap state management in zero-key-panel.ts (good pattern)

**Areas for Improvement:**

- CSS file line 482 contains invalid HTML comment syntax (`<!-- Theme toggle...-->`) inside CSS
- Module-level state in chat.ts creates test isolation challenges
- Some `innerHTML` usage for dynamic content (potential XSS vectors in forks)
- Large data file (zero-key-tools.ts) - all 200+ tools loaded in single file
- Chat modal exists (`chat-modal.ts`) but needs to be wired in main.ts

---

## 5. Detailed Implementation Strategy

### Phase 1: Security Hardening (Critical Priority)

#### 5.1 Storage Security (H1 Resolution)

**PROBLEM:** `localStorage` persists API keys and chat history across sessions, dangerous on shared devices.

- `localStorage` used for: `banal-api-key`, `banal-chat-history` (per PENTEST_REPORT.md lines 36-37)
- `sessionStorage` used for: `data-theme` (safe - clears on tab close)
- **ACTION:** Verify clear-all button functionality, add ephemeral mode toggle

#### 5.2 CSP Implementation (M3 Resolution)

**EXPORT HTML:** Already protected (chat.ts line 1030 has CSP)
**INDEX.HTML:** Missing CSP header - needs addition:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.groq.com https://generativelanguage.googleapis.com https://router.huggingface.co https://oai.endpoints.kepler.ai.cloud.ovh.net;"
/>
```

#### 5.3 HTML Escaping Completeness (M1 Resolution)

**VERIFIED RESOLVED:** `escapeHtml` in utils.ts (lines 44-50) correctly escapes: `& < > " '`
**VERIFIED RESOLVED:** Chat export uses escapeHtml (line 1013) and CSP (line 1030)

#### 5.4 Gemini Key Security (M2 Resolution)

**VERIFIED:** providers/index.ts has documentation about query param visibility (lines 344-370)
**ACTION:** Add UI warning in providers modal about key visibility in browser history

### Phase 2: Architecture Verification

#### 5.5 Chat Modal Integration (BLOCKER)

**FILE EXISTS:** `src/chat-modal.ts` (124 lines) - creates `#experience` container dynamically
**HTML MISSING:** No `open-chat-modal`, `close-chat-modal`, `chat-modal`, `chat-modal-content` elements in index.html
**MAIN.TS MISSING:** No import or call to `initChatModal()`
**ACTION REQUIRED:**

1. Add HTML modal markup to index.html (after line 502)
2. Add navigation buttons to desktop and mobile nav
3. Import and call `initChatModal()` in main.ts

#### 5.6 CSS Syntax Fix

**LINE 482 in style.css:** Invalid HTML comment `<!-- Theme toggle...-->` inside CSS block
**ACTION:** Remove invalid comment or convert to CSS comment `/* ... */`

#### 5.7 Test Coverage

- Run `npm run test:run` - all tests currently pass
- Run `npm run test:coverage` - verify 100% coverage target
- Chat tests use proper isolation with `vi.resetModules()` and `mountFreshChat()`

### Phase 3: Threat Model Documentation (H3 Resolution)

#### 5.8 SECURITY.md Creation

Create SECURITY.md with:

- Fork distribution warning (only use trusted sources)
- Integrity verification guidance (hash comparison)
- Shared device usage best practices
- Data handling disclosure

### Phase 4: Code Quality Issues

#### 5.9 Large Data File

`zero-key-tools.ts` contains all 227+ tools in single array (~150KB). Consider lazy-loading by category.

#### 5.10 Accessibility Verification

- ✅ Skip to main content link exists (index.html lines 24-29)
- ✅ Focus-visible styles present (style.css)
- ✅ Reduced motion handling present (style.css)

#### 5.11 Provider Enhancements

Current providers: `groq`, `gemini`, `hf`, `ovh-anon` (per providers/index.ts line 25)
Consider adding: `mistral`, `deepseek`, `together` (documented in remove-equalizer-section.md)

---

## 6. Risks, Edge Cases & Mitigation

### 6.1 Critical Issues (Must Fix Before Production)

| Issue                        | Status           | Mitigation                                   |
| ---------------------------- | ---------------- | -------------------------------------------- |
| Chat modal not wired in UI   | **BLOCKER**      | Add HTML elements + main.ts import/call      |
| CSP missing in index.html    | **MISSING**      | Add CSP meta tag to development + production |
| CSS invalid comment syntax   | **SYNTAX ERROR** | Fix line 482 in style.css                    |
| No SECURITY.md documentation | **MISSING**      | Create with fork warnings and best practices |

### 6.2 Security Risks

| Risk                        | Mitigation                                               |
| --------------------------- | -------------------------------------------------------- |
| Shared device data leakage  | Clear-all button, ephemeral mode, explicit warnings      |
| Malicious fork distribution | Documentation, optional integrity check                  |
| XSS via innerHTML in forks  | CSP, escapeHtml everywhere, input sanitization           |
| API key in browser history  | Prefer header-auth providers, document Gemini limitation |

### 6.3 User Experience Risks

| Risk                               | Mitigation                                |
| ---------------------------------- | ----------------------------------------- |
| Too many warnings reduce usability | Progressive disclosure, contextual help   |
| Ephemeral mode confusing           | Clear visual indicator, persistent toggle |
| Clear-all accidentally triggered   | Confirmation dialog, undo capability      |

---

## 7. Testing & Validation Strategy

### 7.1 Automated Testing (Pre-Implementation)

- `npm run ci` - lint, typecheck, tests
- `npm run test:coverage` - verify 100% coverage for utils.ts, providers.ts
- Build test: `npm run build` - verify CSP inclusion

### 7.2 Security Testing

- Verify localStorage cleared after clear-all
- Check source maps not accessible in production build (`npm run build`)
- Verify CSP blocks inline script injection in browser devtools
- Test escapeHtml with all special characters (`& < > " '`)

### 7.3 Manual Testing

- Test on shared device scenario (incognito mode)
- Verify chat modal opens/closes correctly after integration
- Test export HTML in various browsers
- Check CSS renders correctly after comment fix

### 7.4 Fork Verification Testing

- Document expected file hashes in SECURITY.md
- Test that modified fork detection is feasible via hash comparison

---

## 8. Implementation Checklist

### 8.1 Critical (Blocker - Must Do First)

- [ ] Add chat modal HTML elements to index.html (open-chat-modal button, chat-modal container)
- [ ] Wire `initChatModal()` in main.ts (missing import and call)
- [ ] Add quick-start HTML section to index.html (quickstart-root container missing)
- [ ] Wire `initQuickStart()` in main.ts (missing import and call)
- [ ] Add free-models HTML section to index.html (free-models-root container missing)
- [ ] Wire `initFreeModels()` in main.ts (missing import and call)
- [ ] Update navigation to include links for quick-start and free-models

### 8.2 High Priority Security

- [ ] Add CSP meta tag to index.html
- [ ] Create SECURITY.md with fork verification guidance
- [ ] Add ephemeral mode toggle for shared devices
- [ ] Add `lastVerified` fields to free-models.ts providers

### 8.3 Medium Priority

- [ ] Add shared device warning in chat UI
- [ ] Document Gemini key visibility in providers modal
- [ ] Add last verified dates and transparency notes to free-models.ts

### 8.4 Future Enhancements

- [ ] Consider code-splitting for zero-key-tools.ts
- [ ] Add tests for free-models.ts and quickstart.ts (currently no test files exist)

---

## 9. Clarifying Questions

1. **Chat modal placement:** Should the "Chat" button be added to the header navigation (desktop and mobile), or only in specific sections?

2. **CSP strictness:** Should we attempt to remove `'unsafe-inline'` from CSP, or keep it for compatibility with existing inline styles? This would require hash-based allowlisting.

3. **Ephemeral mode default:** Should the ephemeral mode be opt-in (preserves current UX) or opt-out (protects all users by default, may surprise existing workflows)?

4. **Provider expansion:** Should we add the documented providers (mistral, deepseek, together) from the remove-equalizer-section.md plan, or keep current minimal set (groq, gemini, hf, ovh-anon)?

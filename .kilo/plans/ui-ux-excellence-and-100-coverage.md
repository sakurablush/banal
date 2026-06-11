# UI/UX Excellence & 100% Test Coverage - Scientific Implementation Plan

**Status:** READY FOR IMPLEMENTATION  
**Priority:** CRITICAL  
**Scope:** World-class UI/UX + bulletproof test coverage  
**Approach:** Evidence-based, scientific methodology

---

## Executive Summary

This plan elevates Banal AI to world-class standards through two parallel tracks:

1. **UI/UX Excellence**: Implement best practices from Nielsen Norman Group, Material Design, and Apple HIG
2. **100% Test Coverage**: Achieve complete coverage using scientific testing methodologies (TDD, BDD, mutation testing)

**Current State:**

- 122 tests passing (81.92% global coverage)
- Critical modules below 100%: providers (79.65%), superpowers (89.79%), chat (83.13%)
- UI/UX: Solid foundation, but missing advanced patterns (micro-interactions, progressive disclosure, error recovery)

**Target State:**

- 100% coverage on all critical paths (providers, superpowers, chat, i18n)
- World-class UI/UX with measurable improvements (Lighthouse 95+, CLS <0.1, FID <100ms)
- Zero critical bugs, comprehensive error handling, graceful degradation

---

## Part 1: 100% Test Coverage - Scientific Methodology

### 1.1 Coverage Gap Analysis

**Critical Modules Requiring 100% Coverage:**

| Module                          | Current | Target | Gap    | Priority |
| ------------------------------- | ------- | ------ | ------ | -------- |
| `src/providers/index.ts`        | 79.65%  | 100%   | 20.35% | CRITICAL |
| `src/lib/superpowers.ts`        | 89.79%  | 100%   | 10.21% | CRITICAL |
| `src/chat.ts`                   | 83.13%  | 95%+   | 11.87% | HIGH     |
| `src/zero-key-panel.ts`         | 79.01%  | 90%+   | 20.99% | HIGH     |
| `src/i18n.ts`                   | 81.81%  | 90%+   | 8.19%  | MEDIUM   |
| `src/superpowers-standalone.ts` | 0%      | 90%+   | 100%   | HIGH     |
| `src/api-playground/index.ts`   | 0%      | 90%+   | 100%   | HIGH     |

### 1.2 Uncovered Code Analysis

**Providers Module (Lines 425, 436-476, 506):**

- **Gap**: OVH anonymous provider error handling (lines 436-476)
- **Gap**: HuggingFace error paths (line 425)
- **Gap**: Final error catch block (line 506)
- **Root Cause**: Missing tests for OVH provider and edge cases in error handling
- **Scientific Approach**: Use mutation testing to verify error paths are actually tested

**Superpowers Module (Lines 591, 594, 600, 604):**

- **Gap**: `validateParity()` static method edge cases
- **Root Cause**: Tests don't cover invalid template scenarios
- **Scientific Approach**: Property-based testing to verify invariants

**Chat Module (Lines 900-936, 1062-1122):**

- **Gap**: Export functionality (JSON/HTML)
- **Gap**: Spread/share functionality
- **Gap**: Keys modal clear-all feature
- **Root Cause**: Complex DOM manipulation and async operations not fully tested
- **Scientific Approach**: Integration tests with real DOM, snapshot testing for exports

### 1.3 Testing Strategy - Scientific Best Practices

#### 1.3.1 Test Pyramid (Martin Fowler)

```
        /\
       /  \      E2E Tests (5%)
      / E2E\     - Critical user journeys
     /------\    - Playwright/Cypress
    /        \
   /Integration\ Integration Tests (25%)
  /    Tests    \ - Component interactions
 /--------------\ - DOM manipulation
/                \
/  Unit Tests    \ Unit Tests (70%)
/________________\ - Pure functions
                   - Business logic
```

**Implementation:**

- **Unit Tests**: Test each function in isolation with mocked dependencies
- **Integration Tests**: Test component interactions with real DOM (jsdom)
- **E2E Tests**: Add Playwright for critical paths (chat send, export, language switch)

#### 1.3.2 Test-Driven Development (TDD)

**Red-Green-Refactor Cycle:**

1. **Red**: Write failing test for uncovered code
2. **Green**: Implement minimal code to pass test
3. **Refactor**: Improve code while keeping tests green

**Example for Providers:**

```typescript
// RED: Write test first
describe('OVH Anonymous Provider', () => {
  it('should handle rate limit errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      headers: new Map([['retry-after', '60']]),
      json: async () => ({ error: 'Rate limit exceeded' }),
    });

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toThrow(
      BanalProviderError
    );
  });
});

// GREEN: Implement to pass
// REFACTOR: Extract common error handling
```

#### 1.3.3 Property-Based Testing (Fast-Check)

**Why**: Discover edge cases humans miss
**Tool**: `fast-check` library
**Example:**

```typescript
import fc from 'fast-check';

describe('extractTemplateVariables', () => {
  it('should extract all {{variables}} from any template', () => {
    fc.assert(
      fc.property(fc.string(), (template) => {
        const vars = extractTemplateVariables(template);
        // Property: all extracted vars must exist in template
        vars.forEach((v) => {
          expect(template).toContain(`{{${v}}}`);
        });
      })
    );
  });
});
```

#### 1.3.4 Mutation Testing (Stryker)

**Why**: Verify tests actually catch bugs
**Tool**: Stryker Mutator
**Process:**

1. Run Stryker to inject mutations
2. Verify tests fail on mutations
3. Add tests for surviving mutations

**Target**: Mutation score >80%

### 1.4 Specific Test Cases to Add

#### 1.4.1 Providers Module (20+ new tests)

**OVH Anonymous Provider:**

```typescript
describe('OVH Anonymous Provider', () => {
  it('should send request without API key', async () => {
    // Test that headers don't include Authorization
  });

  it('should handle 429 rate limit with retry-after header', async () => {
    // Test rate limit detection and friendly message
  });

  it('should handle 429 without retry-after header', async () => {
    // Test default retry time (30s)
  });

  it('should handle network errors gracefully', async () => {
    // Test fetch rejection
  });

  it('should handle empty response', async () => {
    // Test empty choices array
  });

  it('should handle malformed JSON response', async () => {
    // Test JSON parse error
  });
});
```

**HuggingFace Provider:**

```typescript
describe('HuggingFace Provider', () => {
  it('should handle array response format', async () => {
    // Test data[0]?.generated_text
  });

  it('should handle object response format', async () => {
    // Test data?.generated_text
  });

  it('should handle empty generated_text', async () => {
    // Test fallback message
  });

  it('should handle rate limit errors', async () => {
    // Test 429 detection
  });
});
```

**Error Handling:**

```typescript
describe('Error Handling', () => {
  it('should wrap all errors in BanalProviderError', async () => {
    // Test final catch block
  });

  it('should preserve original error in cause property', async () => {
    // Test error chain
  });

  it('should provide friendly message for unknown errors', async () => {
    // Test default error message
  });
});
```

#### 1.4.2 Superpowers Module (10+ new tests)

**Validation:**

```typescript
describe('SuperpowersLibrary.validateParity', () => {
  it('should return valid when all templates have EN/JA parity', () => {
    const result = SuperpowersLibrary.validateParity();
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('should detect missing EN title', () => {
    // Temporarily corrupt TEMPLATES
    // Verify validation catches it
  });

  it('should detect missing JA template', () => {
    // Test missing Japanese template
  });

  it('should detect placeholder mismatch', () => {
    // Test different variable counts
  });

  it('should detect placeholder name mismatch', () => {
    // Test same count but different names
  });
});
```

**Edge Cases:**

```typescript
describe('extractTemplateVariables', () => {
  it('should handle empty template', () => {
    expect(extractTemplateVariables('')).toEqual([]);
  });

  it('should handle template without variables', () => {
    expect(extractTemplateVariables('No vars here')).toEqual([]);
  });

  it('should handle duplicate variables', () => {
    const vars = extractTemplateVariables('{{name}} and {{name}}');
    expect(vars).toEqual(['name']); // Deduplicated
  });

  it('should handle nested braces', () => {
    expect(extractTemplateVariables('{{{name}}}')).toEqual(['name']);
  });
});
```

#### 1.4.3 Chat Module (30+ new tests)

**Export Functionality:**

```typescript
describe('Chat Export', () => {
  describe('JSON Export', () => {
    it('should create valid JSON with version', () => {
      // Test payload structure
    });

    it('should include chat history', () => {
      // Test history serialization
    });

    it('should include current superpower', () => {
      // Test superpower state
    });

    it('should trigger download', () => {
      // Test blob creation and download
    });

    it('should show success toast', () => {
      // Test toast notification
    });
  });

  describe('HTML Export', () => {
    it('should create valid HTML document', () => {
      // Test HTML structure
    });

    it('should escape user content', () => {
      // Test XSS prevention
    });

    it('should include CSP headers', () => {
      // Test security headers
    });

    it('should handle empty history', () => {
      // Test "no messages" message
    });

    it('should preserve superpower metadata', () => {
      // Test superpower display in export
    });
  });
});
```

**Keys Modal:**

```typescript
describe('Keys Modal', () => {
  it('should open on button click', () => {
    // Test modal visibility
  });

  it('should close on X button', () => {
    // Test close functionality
  });

  it('should close on backdrop click', () => {
    // Test backdrop interaction
  });

  it('should show all provider keys', () => {
    // Test key display
  });

  it('should save key to localStorage', () => {
    // Test persistence
  });

  it('should clear individual key', () => {
    // Test clear button
  });

  describe('Clear All Sensitive Data', () => {
    it('should show confirmation dialog', () => {
      // Test confirm() call
    });

    it('should clear all keys when confirmed', () => {
      // Test key removal
    });

    it('should clear chat history when confirmed', () => {
      // Test history removal
    });

    it('should not clear when cancelled', () => {
      // Test cancel path
    });

    it('should reopen modal after clear', () => {
      // Test modal reopen
    });
  });
});
```

**Spread/Share:**

```typescript
describe('Spread Equalizer', () => {
  it('should use Web Share API when available', () => {
    // Test navigator.share
  });

  it('should fallback to clipboard when share unavailable', () => {
    // Test clipboard API
  });

  it('should fallback to alert when clipboard fails', () => {
    // Test alert fallback
  });

  it('should handle share rejection', () => {
    // Test share() promise rejection
  });

  it('should include correct text in EN', () => {
    // Test English message
  });

  it('should include correct text in JA', () => {
    // Test Japanese message
  });
});
```

#### 1.4.4 New Modules (40+ new tests)

**Superpowers Standalone:**

```typescript
describe('renderSuperpowersStandalone', () => {
  it('should render 9 superpower cards', () => {
    // Test card count
  });

  it('should render in correct language', () => {
    // Test EN/JA switching
  });

  it('should handle copy button click', () => {
    // Test clipboard copy
  });

  it('should show success message after copy', () => {
    // Test feedback
  });

  it('should open modal on Fill & Copy click', () => {
    // Test modal interaction
  });

  it('should handle copy failure gracefully', () => {
    // Test error handling
  });

  it('should show error state on render failure', () => {
    // Test error UI
  });
});

describe('Fill Modal', () => {
  it('should generate form fields for all variables', () => {
    // Test dynamic form
  });

  it('should use textarea for long fields', () => {
    // Test field type detection
  });

  it('should fill template with form values', () => {
    // Test template filling
  });

  it('should use placeholder for empty fields', () => {
    // Test fallback values
  });

  it('should copy filled template to clipboard', () => {
    // Test copy functionality
  });

  it('should close on cancel', () => {
    // Test cancel button
  });

  it('should close on backdrop click', () => {
    // Test backdrop interaction
  });

  it('should close after successful copy', () => {
    // Test auto-close
  });
});
```

**API Playground:**

```typescript
describe('API Playground', () => {
  it('should render all provider categories', () => {
    // Test category tabs
  });

  it('should switch categories on tab click', () => {
    // Test tab interaction
  });

  it('should render provider cards', () => {
    // Test card display
  });

  it('should show key requirement badge', () => {
    // Test badge display
  });

  it('should send request on button click', () => {
    // Test API call
  });

  it('should show loading state', () => {
    // Test loading indicator
  });

  it('should display response', () => {
    // Test response display
  });

  it('should handle errors gracefully', () => {
    // Test error display
  });

  it('should copy response to clipboard', () => {
    // Test copy functionality
  });

  it('should measure latency', () => {
    // Test latency display
  });
});
```

### 1.5 Testing Infrastructure Improvements

#### 1.5.1 Test Utilities

**Create `tests/utils/test-helpers.ts`:**

```typescript
export function mockFetch(responses: Record<string, any>) {
  return vi.fn((url: string) => {
    const response = responses[url];
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => response,
      text: async () => JSON.stringify(response),
      headers: new Map(),
      ...response,
    });
  });
}

export function createMockChatDOM() {
  // Create complete chat DOM for integration tests
}

export function waitForToast() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}
```

#### 1.5.2 Snapshot Testing

**For exports and complex DOM:**

```typescript
describe('HTML Export', () => {
  it('should match snapshot', () => {
    const html = generateExportHTML(chatHistory, 'en');
    expect(html).toMatchSnapshot();
  });
});
```

#### 1.5.3 Visual Regression Testing

**Tool**: Playwright screenshots
**Process:**

1. Capture baseline screenshots
2. Compare on each test run
3. Review and approve changes

### 1.6 Coverage Enforcement

**Update `vitest.config.ts`:**

```typescript
coverage: {
  thresholds: {
    global: {
      lines: 95,
      functions: 95,
      branches: 90,
      statements: 95,
    },
    'src/providers/**/*': {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
    'src/lib/superpowers.ts': {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
    'src/chat.ts': {
      lines: 95,
      functions: 95,
      branches: 90,
      statements: 95,
    },
    'src/superpowers-standalone.ts': {
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
    'src/api-playground/**/*': {
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
  },
}
```

---

## Part 2: UI/UX Excellence - World-Class Standards

### 2.1 Heuristic Evaluation (Nielsen's 10 Heuristics)

#### 2.1.1 Visibility of System Status

**Current Issues:**

- No loading indicators for async operations
- No progress feedback for long operations
- Unclear success/failure states

**Improvements:**

**A. Skeleton Loading States:**

```typescript
// Add skeleton loaders for all async content
function renderSkeleton(count: number): HTMLElement {
  const container = document.createElement('div');
  container.className = 'skeleton-container';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-header"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    `;
    container.appendChild(skeleton);
  }
  return container;
}
```

**B. Progress Indicators:**

```typescript
// Add progress bar for multi-step operations
function showProgress(current: number, total: number) {
  const progress = (current / total) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', String(current));
}
```

**C. Toast Notifications:**

```typescript
// Improve toast system with different types
type ToastType = 'success' | 'error' | 'warning' | 'info';

function showToast(message: string, type: ToastType = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${getIcon(type)}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">×</button>
  `;
  // Add auto-dismiss with progress bar
}
```

#### 2.1.2 Match Between System and Real World

**Current Issues:**

- Technical jargon in error messages
- Unclear iconography
- Inconsistent terminology

**Improvements:**

**A. Plain Language Error Messages:**

```typescript
const ERROR_MESSAGES = {
  RATE_LIMIT: {
    title: 'Take a breather',
    message: 'The free service is busy right now. Wait 30 seconds or try another free provider.',
    action: 'Try Again',
  },
  NO_KEY: {
    title: 'Almost there!',
    message: 'Get a free API key in 45 seconds to unlock real AI power.',
    action: 'Get Free Key',
  },
  NETWORK: {
    title: 'Connection hiccup',
    message: 'Check your internet and try again. Still free when it works!',
    action: 'Retry',
  },
};
```

**B. Consistent Iconography:**

```typescript
// Create icon system with clear meanings
const ICONS = {
  success: '✓', // Checkmark for success
  error: '⚠', // Warning for errors
  info: 'ℹ', // Info for information
  loading: '⏳', // Hourglass for loading
  copy: '📋', // Clipboard for copy
  external: '↗', // Arrow for external links
};
```

#### 2.1.3 User Control and Freedom

**Current Issues:**

- No undo for destructive actions
- No escape from modals
- No way to cancel long operations

**Improvements:**

**A. Undo System:**

```typescript
class UndoManager {
  private history: Action[] = [];
  private redoStack: Action[] = [];

  execute(action: Action) {
    action.execute();
    this.history.push(action);
    this.redoStack = [];
  }

  undo() {
    const action = this.history.pop();
    if (action) {
      action.undo();
      this.redoStack.push(action);
    }
  }

  redo() {
    const action = this.redoStack.pop();
    if (action) {
      action.execute();
      this.history.push(action);
    }
  }
}
```

**B. Escape Hatches:**

```typescript
// Add Escape key handler to all modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal:not(.hidden)');
    if (openModal) {
      closeModal(openModal);
    }
  }
});
```

**C. Cancel Operations:**

```typescript
// Add cancel button to long operations
function longOperation() {
  const controller = new AbortController();

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => controller.abort();

  fetch(url, { signal: controller.signal }).catch((err) => {
    if (err.name === 'AbortError') {
      showToast('Operation cancelled', 'info');
    }
  });
}
```

#### 2.1.4 Consistency and Standards

**Current Issues:**

- Inconsistent button styles
- Mixed terminology
- Inconsistent spacing

**Improvements:**

**A. Design System:**

```typescript
// Create consistent button variants
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

function createButton(text: string, variant: ButtonVariant): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = `btn btn-${variant}`;
  btn.textContent = text;
  return btn;
}
```

**B. Spacing System:**

```css
/* Use consistent spacing scale */
:root {
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
}
```

#### 2.1.5 Error Prevention

**Current Issues:**

- No confirmation for destructive actions
- No input validation
- No prevention of accidental data loss

**Improvements:**

**A. Confirmation Dialogs:**

```typescript
function confirmDestructive(title: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="confirm-actions">
        <button class="btn btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn btn-danger" data-action="confirm">Delete</button>
      </div>
    `;

    dialog.querySelector('[data-action="cancel"]').onclick = () => {
      dialog.remove();
      resolve(false);
    };

    dialog.querySelector('[data-action="confirm"]').onclick = () => {
      dialog.remove();
      resolve(true);
    };

    document.body.appendChild(dialog);
  });
}
```

**B. Input Validation:**

```typescript
function validateInput(input: HTMLInputElement): ValidationResult {
  const value = input.value.trim();

  if (!value) {
    return { valid: false, error: 'This field is required' };
  }

  if (input.type === 'url' && !isValidUrl(value)) {
    return { valid: false, error: 'Please enter a valid URL' };
  }

  return { valid: true };
}
```

#### 2.1.6 Recognition Rather Than Recall

**Current Issues:**

- Hidden keyboard shortcuts
- No visible search history
- No recent items

**Improvements:**

**A. Keyboard Shortcut Hints:**

```typescript
// Show keyboard shortcuts in tooltips
<button title="Send message (Enter)">Send</button>
<button title="New chat (Ctrl+N)">New</button>
<input placeholder="Search... (Ctrl+K)" />
```

**B. Search History:**

```typescript
class SearchHistory {
  private history: string[] = [];

  add(query: string) {
    this.history.unshift(query);
    this.history = this.history.slice(0, 10); // Keep last 10
    localStorage.setItem('search-history', JSON.stringify(this.history));
  }

  getRecent(): string[] {
    return this.history;
  }
}
```

#### 2.1.7 Flexibility and Efficiency

**Current Issues:**

- No keyboard shortcuts
- No bulk operations
- No customization

**Improvements:**

**A. Keyboard Shortcuts:**

```typescript
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K: Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('hero-search').focus();
  }

  // Ctrl/Cmd + N: New chat
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    clearChat();
  }

  // Ctrl/Cmd + Enter: Send message
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
```

**B. Bulk Operations:**

```typescript
// Add select all / deselect all for tools
function addBulkOperations() {
  const selectAll = document.createElement('button');
  selectAll.textContent = 'Select All';
  selectAll.onclick = () => {
    document.querySelectorAll('.tool-checkbox').forEach((cb) => {
      cb.checked = true;
    });
  };
}
```

#### 2.1.8 Aesthetic and Minimalist Design

**Current Issues:**

- Cluttered interface
- Too many options visible at once
- Inconsistent visual hierarchy

**Improvements:**

**A. Progressive Disclosure:**

```typescript
// Show advanced options only when needed
<div class="advanced-options hidden">
  <button class="toggle-advanced">Show advanced options</button>
  <div class="advanced-content">
    <!-- Advanced options here -->
  </div>
</div>
```

**B. Visual Hierarchy:**

```css
/* Use size, color, and spacing to create hierarchy */
h1 {
  font-size: 2.5rem;
  font-weight: 800;
}
h2 {
  font-size: 2rem;
  font-weight: 700;
}
h3 {
  font-size: 1.5rem;
  font-weight: 600;
}

.primary-action {
  background: var(--primary);
  color: white;
  padding: var(--space-4) var(--space-6);
}

.secondary-action {
  background: transparent;
  border: 1px solid var(--border);
  padding: var(--space-3) var(--space-4);
}
```

#### 2.1.9 Help Users Recognize, Diagnose, and Recover from Errors

**Current Issues:**

- Generic error messages
- No recovery suggestions
- No error logging

**Improvements:**

**A. Detailed Error Messages:**

```typescript
interface ErrorDetails {
  code: string;
  message: string;
  suggestion: string;
  technicalDetails?: string;
}

function showError(error: ErrorDetails) {
  const errorUI = `
    <div class="error-container">
      <div class="error-icon">⚠</div>
      <h3>${error.message}</h3>
      <p class="error-suggestion">${error.suggestion}</p>
      <details class="error-details">
        <summary>Technical details</summary>
        <pre>${error.technicalDetails}</pre>
      </details>
      <button class="btn btn-primary">Try Again</button>
    </div>
  `;
}
```

**B. Error Recovery:**

```typescript
// Provide multiple recovery paths
function handleError(error: BanalProviderError) {
  const actions = [];

  if (error.code === 'RATE_LIMIT') {
    actions.push({
      label: 'Wait and retry',
      action: () => setTimeout(retry, error.rateLimit.retryAfterSeconds * 1000),
    });
    actions.push({
      label: 'Try different provider',
      action: () => switchProvider(),
    });
  }

  if (error.code === 'NO_KEY') {
    actions.push({
      label: 'Get free key',
      action: () => openKeysModal(),
    });
    actions.push({
      label: 'Use superpowers',
      action: () => openSuperpowersPanel(),
    });
  }

  showErrorWithActions(error, actions);
}
```

#### 2.1.10 Help and Documentation

**Current Issues:**

- No onboarding
- No help system
- No tooltips

**Improvements:**

**A. Onboarding Tour:**

```typescript
class OnboardingTour {
  private steps: TourStep[] = [
    {
      target: '#hero-search',
      title: 'Search 200+ free AI tools',
      content: 'Find the perfect tool for your needs',
    },
    {
      target: '#experience',
      title: 'Chat with AI',
      content: 'Talk to real AI, completely free',
    },
    {
      target: '#superpowers',
      title: '9 Superpowers',
      content: 'Copy powerful prompts for any situation',
    },
  ];

  start() {
    this.showStep(0);
  }

  showStep(index: number) {
    const step = this.steps[index];
    const target = document.querySelector(step.target);
    // Show tooltip pointing to target
  }
}
```

**B. Contextual Help:**

```typescript
// Add help icons with tooltips
<span class="help-icon" title="What is this?">
  <span class="tooltip">
    Superpowers are pre-written prompts that help you get the most out of AI.
    Just fill in the blanks and copy!
  </span>
</span>
```

### 2.2 Performance Optimization (Core Web Vitals)

#### 2.2.1 Largest Contentful Paint (LCP)

**Target**: <2.5s

**Improvements:**

```typescript
// Preload critical resources
<link rel="preload" href="/src/style.css" as="style">
<link rel="preload" href="/src/main.ts" as="script">

// Lazy load below-fold content
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadContent(entry.target);
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('[data-lazy]').forEach(el => {
  observer.observe(el);
});
```

#### 2.2.2 First Input Delay (FID)

**Target**: <100ms

**Improvements:**

```typescript
// Defer non-critical JavaScript
<script type="module" src="/src/main.ts" defer></script>

// Use requestIdleCallback for non-urgent work
requestIdleCallback(() => {
  initializeAnalytics();
  initializeOnboarding();
});
```

#### 2.2.3 Cumulative Layout Shift (CLS)

**Target**: <0.1

**Improvements:**

```css
/* Reserve space for dynamic content */
.chat-container {
  min-height: 400px;
}

.tool-card {
  aspect-ratio: 16 / 9;
}

/* Prevent layout shift from fonts */
body {
  font-display: swap;
}
```

### 2.3 Accessibility (WCAG 2.1 AA)

#### 2.3.1 Keyboard Navigation

**Improvements:**

```typescript
// Add focus management
function trapFocus(modal: HTMLElement) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
```

#### 2.3.2 Screen Reader Support

**Improvements:**

```typescript
// Add live regions for dynamic content
<div aria-live="polite" aria-atomic="true" id="toast-container"></div>

// Add proper labels
<button aria-label="Close dialog">×</button>
<input aria-label="Search tools" placeholder="Search..." />

// Add descriptions
<div aria-describedby="tool-description">
  <p id="tool-description">This tool helps you generate images from text descriptions.</p>
</div>
```

#### 2.3.3 Color Contrast

**Improvements:**

```css
/* Ensure WCAG AA compliance (4.5:1 for text, 3:1 for large text) */
:root {
  --text-primary: #ffffff; /* 21:1 on dark bg */
  --text-secondary: #a0a0a0; /* 7:1 on dark bg */
  --text-disabled: #666666; /* 4.6:1 on dark bg */
}
```

### 2.4 Micro-Interactions and Animations

#### 2.4.1 Button Feedback

**Improvements:**

```css
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn.loading {
  pointer-events: none;
  opacity: 0.7;
}

.btn.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

#### 2.4.2 Card Hover Effects

**Improvements:**

```css
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover::before {
  opacity: 1;
}
```

#### 2.4.3 Success Animations

**Improvements:**

```css
@keyframes checkmark {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.success-icon {
  animation: scale-in 0.3s ease;
}

.success-icon svg {
  stroke-dasharray: 100;
  animation: checkmark 0.5s ease 0.3s;
}

@keyframes scale-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

### 2.5 Mobile-First Design

#### 2.5.1 Touch Targets

**Improvements:**

```css
/* Minimum 44x44px touch targets */
button,
a,
input,
select,
textarea {
  min-height: 44px;
  min-width: 44px;
}

/* Add padding for better touch targets */
.btn {
  padding: 12px 24px;
}

.icon-btn {
  padding: 12px;
}
```

#### 2.5.2 Responsive Typography

**Improvements:**

```css
/* Fluid typography */
h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

body {
  font-size: clamp(1rem, 2vw, 1.125rem);
}
```

#### 2.5.3 Mobile Navigation

**Improvements:**

```typescript
// Add mobile menu with smooth animations
function createMobileMenu() {
  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.innerHTML = `
    <button class="menu-toggle" aria-label="Toggle menu">
      <span class="hamburger"></span>
    </button>
    <nav class="menu-content">
      <!-- Navigation links -->
    </nav>
  `;

  menu.querySelector('.menu-toggle').addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}
```

---

## Part 3: Implementation Roadmap

### Phase 1: Critical Test Coverage (Week 1-2)

**Goal**: Achieve 100% coverage on providers and superpowers

**Tasks:**

1. Add 20+ tests for providers module (OVH, HuggingFace, error handling)
2. Add 10+ tests for superpowers module (validation, edge cases)
3. Set up mutation testing with Stryker
4. Update coverage thresholds in vitest.config.ts

**Deliverables:**

- 100% coverage on providers
- 100% coverage on superpowers
- Mutation score >80%

### Phase 2: Chat & UI Tests (Week 3-4)

**Goal**: Achieve 95%+ coverage on chat and new modules

**Tasks:**

1. Add 30+ tests for chat module (exports, modals, spread)
2. Add 20+ tests for superpowers-standalone
3. Add 20+ tests for api-playground
4. Implement snapshot testing for exports

**Deliverables:**

- 95%+ coverage on chat
- 90%+ coverage on new modules
- Snapshot tests for exports

### Phase 3: UI/UX Foundations (Week 5-6)

**Goal**: Implement core UI/UX improvements

**Tasks:**

1. Add skeleton loading states
2. Implement toast notification system
3. Add confirmation dialogs for destructive actions
4. Implement undo system
5. Add keyboard shortcuts

**Deliverables:**

- Loading states for all async operations
- Consistent toast notifications
- Undo functionality
- Keyboard shortcuts

### Phase 4: Polish & Performance (Week 7-8)

**Goal**: Achieve world-class performance and accessibility

**Tasks:**

1. Optimize Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
2. Implement progressive disclosure
3. Add micro-interactions and animations
4. Ensure WCAG 2.1 AA compliance
5. Add onboarding tour

**Deliverables:**

- Lighthouse score 95+
- WCAG 2.1 AA compliance
- Smooth animations
- Onboarding experience

---

## Part 4: Success Metrics

### 4.1 Test Coverage Metrics

| Metric               | Current | Target | Measurement       |
| -------------------- | ------- | ------ | ----------------- |
| Global Coverage      | 81.92%  | 95%+   | vitest --coverage |
| Providers Coverage   | 79.65%  | 100%   | vitest --coverage |
| Superpowers Coverage | 89.79%  | 100%   | vitest --coverage |
| Chat Coverage        | 83.13%  | 95%+   | vitest --coverage |
| Mutation Score       | N/A     | 80%+   | Stryker           |
| Test Count           | 122     | 250+   | vitest            |

### 4.2 Performance Metrics

| Metric           | Current | Target | Measurement |
| ---------------- | ------- | ------ | ----------- |
| Lighthouse Score | ~85     | 95+    | Lighthouse  |
| LCP              | ~3s     | <2.5s  | Lighthouse  |
| FID              | ~150ms  | <100ms | Lighthouse  |
| CLS              | ~0.15   | <0.1   | Lighthouse  |
| Bundle Size      | 174KB   | <170KB | vite build  |

### 4.3 Accessibility Metrics

| Metric              | Current | Target | Measurement    |
| ------------------- | ------- | ------ | -------------- |
| WCAG Level          | A       | AA     | axe-core       |
| Keyboard Navigation | Partial | Full   | Manual testing |
| Screen Reader       | Partial | Full   | NVDA/VoiceOver |
| Color Contrast      | ~90%    | 100%   | axe-core       |

### 4.4 UX Metrics

| Metric              | Current | Target | Measurement  |
| ------------------- | ------- | ------ | ------------ |
| Time to Interactive | ~4s     | <3s    | Lighthouse   |
| Error Recovery Rate | ~50%    | 90%+   | User testing |
| Task Success Rate   | ~70%    | 90%+   | User testing |
| User Satisfaction   | N/A     | 4.5/5  | Survey       |

---

## Part 5: Tools and Technologies

### 5.1 Testing Tools

- **Vitest**: Unit and integration testing
- **Playwright**: E2E testing
- **Stryker**: Mutation testing
- **Fast-Check**: Property-based testing
- **Testing Library**: DOM testing utilities

### 5.2 Performance Tools

- **Lighthouse**: Performance auditing
- **WebPageTest**: Real-world performance
- **Bundle Analyzer**: Bundle size analysis

### 5.3 Accessibility Tools

- **axe-core**: Automated accessibility testing
- **NVDA**: Screen reader testing (Windows)
- **VoiceOver**: Screen reader testing (Mac)
- **WAVE**: Visual accessibility evaluation

### 5.4 Design Tools

- **Figma**: Design system and prototypes
- **Storybook**: Component documentation
- **Chromatic**: Visual regression testing

---

## Part 6: Risk Mitigation

### 6.1 Technical Risks

**Risk**: Tests become brittle and hard to maintain
**Mitigation**:

- Use Testing Library's guiding principles (test behavior, not implementation)
- Avoid testing implementation details
- Use data-testid sparingly

**Risk**: Performance optimizations break functionality
**Mitigation**:

- Add performance regression tests
- Monitor Core Web Vitals in CI
- Use feature flags for gradual rollout

**Risk**: Accessibility improvements conflict with design
**Mitigation**:

- Involve accessibility experts early
- Test with real users with disabilities
- Use automated tools + manual testing

### 6.2 Timeline Risks

**Risk**: Scope creep delays delivery
**Mitigation**:

- Prioritize features using MoSCoW method
- Set clear milestones
- Regular progress reviews

**Risk**: Unexpected technical debt
**Mitigation**:

- Allocate 20% buffer time
- Regular code reviews during implementation
- Continuous integration

---

## Part 7: Conclusion

This scientific, evidence-based plan will elevate Banal AI to world-class standards through:

1. **Bulletproof reliability**: 100% test coverage on critical paths ensures the app works for the people who need it most
2. **Delightful experience**: World-class UI/UX following Nielsen's heuristics and Material Design principles
3. **Inclusive design**: WCAG 2.1 AA compliance ensures accessibility for all users
4. **Blazing performance**: Core Web Vitals optimization ensures fast, smooth experience even on slow connections

**Expected Outcomes:**

- 250+ tests with 95%+ global coverage
- Lighthouse score 95+ across all categories
- WCAG 2.1 AA compliance
- User satisfaction score 4.5/5

**Timeline**: 8 weeks (2 months)
**Team**: 1-2 developers
**Budget**: $0 (all open-source tools)

This plan transforms Banal AI from a solid foundation into a world-class application that truly serves "the poor, the erased, and the forgotten" with dignity, reliability, and joy.

---

## Appendix A: Testing Best Practices Checklist

- [ ] Test behavior, not implementation
- [ ] Use descriptive test names
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Test edge cases and error paths
- [ ] Use property-based testing for invariants
- [ ] Implement mutation testing
- [ ] Add snapshot tests for complex outputs
- [ ] Use integration tests for component interactions
- [ ] Add E2E tests for critical user journeys
- [ ] Mock external dependencies
- [ ] Use test utilities and helpers
- [ ] Run tests in isolation
- [ ] Clean up after tests
- [ ] Use continuous integration
- [ ] Monitor test performance

## Appendix B: UI/UX Best Practices Checklist

- [ ] Follow Nielsen's 10 heuristics
- [ ] Implement progressive disclosure
- [ ] Provide clear feedback for all actions
- [ ] Use consistent design patterns
- [ ] Optimize for mobile-first
- [ ] Ensure 44px minimum touch targets
- [ ] Use fluid typography
- [ ] Implement skeleton loading states
- [ ] Add micro-interactions for delight
- [ ] Provide multiple error recovery paths
- [ ] Use plain language
- [ ] Implement keyboard shortcuts
- [ ] Add contextual help
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Test with real users

## Appendix C: Performance Best Practices Checklist

- [ ] Optimize Core Web Vitals (LCP, FID, CLS)
- [ ] Lazy load below-fold content
- [ ] Preload critical resources
- [ ] Defer non-critical JavaScript
- [ ] Optimize images (WebP, AVIF)
- [ ] Use efficient CSS (avoid layout thrashing)
- [ ] Implement code splitting
- [ ] Use tree shaking
- [ ] Minimize bundle size
- [ ] Enable compression (gzip, brotli)
- [ ] Use CDN for static assets
- [ ] Implement caching strategies
- [ ] Monitor performance in production
- [ ] Set up performance budgets
- [ ] Use performance regression tests

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-09  
**Author**: Kilo AI  
**Reviewers**: Pending  
**Status**: Ready for Implementation

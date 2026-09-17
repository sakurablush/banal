/**
 * Vitest global setup for Banal tests (jsdom + common mocks).
 * jsdom + any common mocks live here.
 *
 * Everything DOM-related is guarded so the 15 pure-logic test files that
 * run in the bare `node` environment (via `// @vitest-environment node`)
 * do not crash on top-level `window` / `Element` access. The guards are
 * cheap and correct: in jsdom the globals exist, in node they do not.
 */
import { beforeEach, vi } from 'vitest';

function hasDom(): boolean {
  return typeof window !== 'undefined' && typeof Element !== 'undefined';
}

// Ensure clean localStorage between tests (i18n relies on it)
beforeEach(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  vi.clearAllMocks();
});

// Mock matchMedia for reduced-motion tests if needed later
beforeEach(() => {
  if (!hasDom()) return;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock scrollIntoView (not implemented in jsdom) and window.open (not
// implemented in jsdom; zk2-card-cta and report menus call it).
beforeEach(() => {
  if (!hasDom()) return;
  Element.prototype.scrollIntoView = vi.fn();
  window.open = vi.fn();
});

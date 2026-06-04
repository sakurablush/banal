/**
 * Vitest global setup for Banal tests (jsdom + common mocks).
 * jsdom + any common mocks live here.
 */
import { beforeEach, vi } from 'vitest';

// Ensure clean localStorage between tests (i18n relies on it)
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// Mock matchMedia for reduced-motion tests if needed later
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

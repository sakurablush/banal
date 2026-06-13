/**
 * Theme management — light/dark mode with system detection + manual override.
 *
 * Why this exists:
 * - Users have a right to read Banal without burning retinas at 2 AM.
 * - System preference is the default (respects OS-level choice).
 * - Manual override is persisted in localStorage so returning users keep their pick.
 */

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'banal-theme';

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return null;
}

export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getPreferredTheme(): ThemeMode {
  return getStoredTheme() ?? getSystemTheme();
}

export function setTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);

  // Toggle icon visibility (moon = dark mode, sun = light mode)
  const moonIcon = document.querySelector('.theme-icon-moon');
  const sunIcon = document.querySelector('.theme-icon-sun');
  if (moonIcon) {
    moonIcon.setAttribute('style', theme === 'dark' ? '' : 'display:none;opacity:0');
  }
  if (sunIcon) {
    sunIcon.setAttribute('style', theme === 'dark' ? 'display:none;opacity:0' : '');
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable (private mode, SSR)
  }
}

export function initTheme(): void {
  if (typeof window === 'undefined') return;

  const preferred = getPreferredTheme();
  setTheme(preferred);

  // Listen for system changes only when user has NOT manually overridden
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  };

  if (mq.addEventListener) {
    mq.addEventListener('change', handler);
  }
}

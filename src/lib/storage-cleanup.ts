/**
 * List and clear Banal-related browser storage keys.
 */

export type StorageClearScope =
  | 'prompts'
  | 'saved-filters'
  | 'custom-stacks'
  | 'analytics'
  | 'theme'
  | 'all';

export const STORAGE_KEYS = {
  lang: 'banal-lang',
  theme: 'banal-theme',
  savedFilters: 'banal_saved_filters',
  savedFiltersLegacy: 'banal-saved-filters',
  customStacks: 'banal_custom_stacks',
  filterAnalytics: 'banal_filter_analytics',
  promptPrefix: 'banal-pt-',
  privacyBannerDismissed: 'banal-privacy-banner-dismissed',
} as const;

function keysMatching(storage: Storage, prefix: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && key.startsWith(prefix)) out.push(key);
  }
  return out;
}

export function listBanalStorageKeys(): { localStorage: string[]; sessionStorage: string[] } {
  const local: string[] = [];
  const session: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (
        key === STORAGE_KEYS.lang ||
        key === STORAGE_KEYS.savedFilters ||
        key === STORAGE_KEYS.savedFiltersLegacy ||
        key === STORAGE_KEYS.customStacks ||
        key === STORAGE_KEYS.filterAnalytics ||
        key.startsWith('banal_') ||
        key.startsWith('banal-')
      ) {
        local.push(key);
      }
    }
  } catch {
    /* private mode */
  }

  try {
    session.push(...keysMatching(sessionStorage, STORAGE_KEYS.promptPrefix));
    if (sessionStorage.getItem(STORAGE_KEYS.theme)) session.push(STORAGE_KEYS.theme);
    if (sessionStorage.getItem(STORAGE_KEYS.privacyBannerDismissed)) {
      session.push(STORAGE_KEYS.privacyBannerDismissed);
    }
  } catch {
    /* private mode */
  }

  return { localStorage: local, sessionStorage: session };
}

export function hasSensitiveSessionData(): boolean {
  try {
    for (const key of keysMatching(sessionStorage, STORAGE_KEYS.promptPrefix)) {
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (Object.values(parsed).some((v) => typeof v === 'string' && v.trim().length > 0)) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

export function clearBanalStorage(scope: StorageClearScope): void {
  try {
    switch (scope) {
      case 'prompts':
        for (const key of keysMatching(sessionStorage, STORAGE_KEYS.promptPrefix)) {
          sessionStorage.removeItem(key);
        }
        break;
      case 'saved-filters':
        localStorage.removeItem(STORAGE_KEYS.savedFilters);
        localStorage.removeItem(STORAGE_KEYS.savedFiltersLegacy);
        break;
      case 'custom-stacks':
        localStorage.removeItem(STORAGE_KEYS.customStacks);
        break;
      case 'analytics':
        localStorage.removeItem(STORAGE_KEYS.filterAnalytics);
        break;
      case 'theme':
        sessionStorage.removeItem(STORAGE_KEYS.theme);
        break;
      case 'all':
        clearBanalStorage('prompts');
        clearBanalStorage('theme');
        sessionStorage.removeItem(STORAGE_KEYS.privacyBannerDismissed);
        clearBanalStorage('saved-filters');
        clearBanalStorage('custom-stacks');
        clearBanalStorage('analytics');
        localStorage.removeItem(STORAGE_KEYS.lang);
        break;
    }
  } catch (err) {
    console.warn('Failed to clear storage:', err);
  }
}

/** Remove legacy saved-filters key once on boot. */
export function migrateLegacyStorage(): void {
  try {
    if (localStorage.getItem(STORAGE_KEYS.savedFiltersLegacy)) {
      localStorage.removeItem(STORAGE_KEYS.savedFiltersLegacy);
    }
  } catch {
    /* ignore */
  }
}

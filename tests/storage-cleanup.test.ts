import { describe, it, expect, beforeEach } from 'vitest';
import {
  clearBanalStorage,
  hasSensitiveSessionData,
  listBanalStorageKeys,
  STORAGE_KEYS,
} from '../src/lib/storage-cleanup';

describe('storage-cleanup', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('detects non-empty prompt form session data', () => {
    sessionStorage.setItem(
      'banal-pt-job-gaps-as-strengths-en',
      JSON.stringify({ name: 'Alex' })
    );
    expect(hasSensitiveSessionData()).toBe(true);
  });

  it('ignores empty prompt form session data', () => {
    sessionStorage.setItem('banal-pt-test-en', JSON.stringify({ name: '' }));
    expect(hasSensitiveSessionData()).toBe(false);
  });

  it('clears prompt drafts only', () => {
    sessionStorage.setItem('banal-pt-test-en', JSON.stringify({ x: 'y' }));
    sessionStorage.setItem(STORAGE_KEYS.theme, 'dark');
    localStorage.setItem(STORAGE_KEYS.savedFilters, '[]');

    clearBanalStorage('prompts');

    expect(sessionStorage.getItem('banal-pt-test-en')).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEYS.theme)).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEYS.savedFilters)).toBe('[]');
  });

  it('lists banal keys in both storages', () => {
    localStorage.setItem(STORAGE_KEYS.lang, 'en');
    sessionStorage.setItem('banal-pt-x-en', '{}');

    const keys = listBanalStorageKeys();
    expect(keys.localStorage).toContain(STORAGE_KEYS.lang);
    expect(keys.sessionStorage.some((k) => k.startsWith('banal-pt-'))).toBe(true);
  });

  it('clears saved filters scope', () => {
    localStorage.setItem(STORAGE_KEYS.savedFilters, '[]');
    localStorage.setItem(STORAGE_KEYS.customStacks, '[]');
    clearBanalStorage('saved-filters');
    expect(localStorage.getItem(STORAGE_KEYS.savedFilters)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.customStacks)).toBe('[]');
  });

  it('clears custom stacks scope', () => {
    localStorage.setItem(STORAGE_KEYS.customStacks, '[]');
    localStorage.setItem(STORAGE_KEYS.lang, 'en');
    clearBanalStorage('custom-stacks');
    expect(localStorage.getItem(STORAGE_KEYS.customStacks)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.lang)).toBe('en');
  });

  it('clears all banal storage', () => {
    localStorage.setItem(STORAGE_KEYS.lang, 'en');
    localStorage.setItem(STORAGE_KEYS.savedFilters, '[]');
    sessionStorage.setItem('banal-pt-test-en', JSON.stringify({ x: 'y' }));
    sessionStorage.setItem(STORAGE_KEYS.theme, 'dark');

    clearBanalStorage('all');

    expect(localStorage.getItem(STORAGE_KEYS.lang)).toBeNull();
    expect(sessionStorage.getItem('banal-pt-test-en')).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEYS.theme)).toBeNull();
  });
});

/**
 * Tests for filter sharing and saved filters.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  filtersToUrl,
  urlToFilters,
  getSavedFilters,
  saveFilter,
  deleteSavedFilter,
  renameSavedFilter,
  clearSavedFilters,
  presetToState,
  generateShareLink,
} from '../src/lib/filter-sharing';
import type { FilterState, FilterPreset } from '../src/types/tool';

// ─── URL Serialization Tests ────────────────────────────────────────────────

describe('URL Serialization', () => {
  it('should serialize empty filter state to empty string', () => {
    const state: FilterState = {
      category: null,
      subcategory: null,
      tags: [],
      searchQuery: '',
      platforms: [],
      sortBy: 'relevance',
    };
    expect(filtersToUrl(state)).toBe('');
  });

  it('should serialize category', () => {
    const state: FilterState = {
      category: 'ai-coding',
      subcategory: null,
      tags: [],
      searchQuery: '',
      platforms: [],
      sortBy: 'relevance',
    };
    expect(filtersToUrl(state)).toBe('?cat=ai-coding');
  });

  it('should serialize tags', () => {
    const state: FilterState = {
      category: null,
      subcategory: null,
      tags: ['no-signup', 'free-forever'],
      searchQuery: '',
      platforms: [],
      sortBy: 'relevance',
    };
    expect(filtersToUrl(state)).toBe('?tags=no-signup%2Cfree-forever');
  });

  it('should serialize search query', () => {
    const state: FilterState = {
      category: null,
      subcategory: null,
      tags: [],
      searchQuery: 'cursor',
      platforms: [],
      sortBy: 'relevance',
    };
    expect(filtersToUrl(state)).toBe('?q=cursor');
  });

  it('should serialize sortBy when not default', () => {
    const state: FilterState = {
      category: null,
      subcategory: null,
      tags: [],
      searchQuery: '',
      platforms: [],
      sortBy: 'newest',
    };
    expect(filtersToUrl(state)).toBe('?sort=newest');
  });

  it('should serialize complex state', () => {
    const state: FilterState = {
      category: 'ai-coding',
      subcategory: 'vscode-extension',
      tags: ['no-signup', 'free-forever'],
      searchQuery: 'cursor',
      platforms: ['web', 'cli'],
      sortBy: 'newest',
    };
    const url = filtersToUrl(state);
    expect(url).toContain('cat=ai-coding');
    expect(url).toContain('sub=vscode-extension');
    expect(url).toContain('tags=no-signup');
    expect(url).toContain('q=cursor');
    expect(url).toContain('platforms=web');
    expect(url).toContain('sort=newest');
  });

  it('should deserialize empty URL', () => {
    const state = urlToFilters('');
    expect(state.category).toBeUndefined();
    expect(state.tags).toBeUndefined();
  });

  it('should deserialize category', () => {
    const state = urlToFilters('?cat=ai-coding');
    expect(state.category).toBe('ai-coding');
  });

  it('should deserialize tags', () => {
    const state = urlToFilters('?tags=no-signup,free-forever');
    expect(state.tags).toEqual(['no-signup', 'free-forever']);
  });

  it('should deserialize search query', () => {
    const state = urlToFilters('?q=cursor');
    expect(state.searchQuery).toBe('cursor');
  });

  it('should round-trip serialize/deserialize', () => {
    const original: FilterState = {
      category: 'ai-coding',
      subcategory: null,
      tags: ['no-signup', 'free-forever'],
      searchQuery: 'cursor',
      platforms: [],
      sortBy: 'newest',
    };
    const url = filtersToUrl(original);
    const restored = urlToFilters(url);
    expect(restored.category).toBe(original.category);
    expect(restored.tags).toEqual(original.tags);
    expect(restored.searchQuery).toBe(original.searchQuery);
    expect(restored.sortBy).toBe(original.sortBy);
  });
});

// ─── Saved Filters Tests ────────────────────────────────────────────────────

describe('Saved Filters', () => {
  const testState: FilterState = {
    category: 'ai-coding',
    subcategory: null,
    tags: ['no-signup'],
    searchQuery: '',
    platforms: [],
    sortBy: 'relevance',
  };

  it('should return empty array when no saved filters', () => {
    expect(getSavedFilters()).toEqual([]);
  });

  it('should save a filter', () => {
    const saved = saveFilter('My Filter', testState);
    expect(saved.id).toBeTruthy();
    expect(saved.name).toBe('My Filter');
    expect(saved.state).toEqual(testState);
    expect(saved.createdAt).toBeTruthy();

    const all = getSavedFilters();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('My Filter');
  });

  it('should save multiple filters', () => {
    saveFilter('Filter 1', testState);
    saveFilter('Filter 2', { ...testState, tags: ['free-forever'] });

    const all = getSavedFilters();
    expect(all.length).toBe(2);
  });

  it('should delete a saved filter', () => {
    const saved = saveFilter('To Delete', testState);
    expect(getSavedFilters().length).toBe(1);

    deleteSavedFilter(saved.id);
    expect(getSavedFilters().length).toBe(0);
  });

  it('should rename a saved filter', () => {
    const saved = saveFilter('Old Name', testState);
    renameSavedFilter(saved.id, 'New Name');

    const all = getSavedFilters();
    expect(all[0].name).toBe('New Name');
  });

  it('should clear all saved filters', () => {
    saveFilter('Filter 1', testState);
    saveFilter('Filter 2', testState);
    expect(getSavedFilters().length).toBe(2);

    clearSavedFilters();
    expect(getSavedFilters().length).toBe(0);
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('banal-saved-filters', 'not-valid-json');
    expect(getSavedFilters()).toEqual([]);
  });
});

// ─── Preset Conversion Tests ────────────────────────────────────────────────

describe('Preset Conversion', () => {
  it('should convert preset to state', () => {
    const preset: FilterPreset = {
      id: 'test',
      name: 'Test Preset',
      description: 'A test preset',
      filters: {
        category: 'ai-coding',
        tags: ['no-signup', 'free-forever'],
      },
    };

    const state = presetToState(preset);
    expect(state.category).toBe('ai-coding');
    expect(state.tags).toEqual(['no-signup', 'free-forever']);
    expect(state.searchQuery).toBe('');
    expect(state.sortBy).toBe('relevance');
  });

  it('should handle empty preset filters', () => {
    const preset: FilterPreset = {
      id: 'test',
      name: 'Empty',
      description: 'Empty preset',
      filters: {},
    };

    const state = presetToState(preset);
    expect(state.category).toBeNull();
    expect(state.tags).toEqual([]);
  });
});

// ─── Share Link Tests ───────────────────────────────────────────────────────

describe('Share Link', () => {
  it('should generate share link', () => {
    // Mock window.location
    vi.stubGlobal('window', {
      location: {
        origin: 'https://sakurablush.github.io',
        pathname: '/banal/tools',
      },
    });

    const state: FilterState = {
      category: 'ai-coding',
      subcategory: null,
      tags: ['no-signup'],
      searchQuery: '',
      platforms: [],
      sortBy: 'relevance',
    };

    const link = generateShareLink(state);
    expect(link).toContain('https://sakurablush.github.io/banal/tools');
    expect(link).toContain('cat=ai-coding');
    expect(link).toContain('tags=no-signup');
  });
});

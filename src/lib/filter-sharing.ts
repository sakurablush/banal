/**
 * Filter Sharing & Saved Filters — URL-based filter sharing and localStorage persistence.
 * Allows users to share filtered views via URL and save favorite filter combinations.
 */

import type { FilterState, FilterPreset } from '../types/tool';

// ─── URL Serialization ──────────────────────────────────────────────────────

/**
 * Serialize filter state to URL search params for sharing.
 */
export function filtersToUrl(state: FilterState): string {
  const params = new URLSearchParams();

  if (state.category) params.set('cat', state.category);
  if (state.subcategory) params.set('sub', state.subcategory);
  if (state.tags.length > 0) params.set('tags', state.tags.join(','));
  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.platforms.length > 0) params.set('platforms', state.platforms.join(','));
  if (state.sortBy && state.sortBy !== 'relevance') params.set('sort', state.sortBy);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Deserialize filter state from URL search params.
 */
export function urlToFilters(search: string): Partial<FilterState> {
  const params = new URLSearchParams(search);
  const state: Partial<FilterState> = {};

  const cat = params.get('cat');
  if (cat) state.category = cat as FilterState['category'];

  const sub = params.get('sub');
  if (sub) state.subcategory = sub as FilterState['subcategory'];

  const tags = params.get('tags');
  if (tags) state.tags = tags.split(',').filter(Boolean);

  const q = params.get('q');
  if (q) state.searchQuery = q;

  const platforms = params.get('platforms');
  if (platforms) state.platforms = platforms.split(',').filter(Boolean);

  const sort = params.get('sort');
  if (sort) state.sortBy = sort as FilterState['sortBy'];

  return state;
}

/**
 * Update browser URL without page reload (pushState).
 */
export function updateUrlWithFilters(state: FilterState): void {
  const newUrl = window.location.pathname + filtersToUrl(state);
  window.history.pushState({}, '', newUrl);
}

/**
 * Read current filters from browser URL.
 */
export function readFiltersFromUrl(): Partial<FilterState> {
  return urlToFilters(window.location.search);
}

// ─── Saved Filters (localStorage) ───────────────────────────────────────────

const STORAGE_KEY = 'banal-saved-filters';

export interface SavedFilter {
  id: string;
  name: string;
  state: FilterState;
  createdAt: string;
}

/**
 * Get all saved filters from localStorage.
 */
export function getSavedFilters(): SavedFilter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedFilter[];
  } catch {
    return [];
  }
}

/**
 * Save a filter combination to localStorage.
 */
export function saveFilter(name: string, state: FilterState): SavedFilter {
  const saved = getSavedFilters();
  const newFilter: SavedFilter = {
    id: generateId(),
    name,
    state,
    createdAt: new Date().toISOString(),
  };
  saved.push(newFilter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return newFilter;
}

/**
 * Delete a saved filter by ID.
 */
export function deleteSavedFilter(id: string): void {
  const saved = getSavedFilters().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

/**
 * Update a saved filter's name.
 */
export function renameSavedFilter(id: string, newName: string): void {
  const saved = getSavedFilters();
  const filter = saved.find((f) => f.id === id);
  if (filter) {
    filter.name = newName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }
}

/**
 * Clear all saved filters.
 */
export function clearSavedFilters(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Convert a FilterPreset to a FilterState.
 */
export function presetToState(preset: FilterPreset): Partial<FilterState> {
  return {
    category: preset.filters.category || null,
    subcategory: preset.filters.subcategory || null,
    tags: preset.filters.tags || [],
    searchQuery: preset.filters.searchQuery || '',
    platforms: preset.filters.platforms || [],
    sortBy: preset.filters.sortBy || 'relevance',
  };
}

// ─── Share Link Generation ──────────────────────────────────────────────────

/**
 * Generate a shareable link for the current filter state.
 */
export function generateShareLink(state: FilterState): string {
  const baseUrl = window.location.origin + window.location.pathname;
  return baseUrl + filtersToUrl(state);
}

/**
 * Copy share link to clipboard.
 */
export async function copyShareLink(state: FilterState): Promise<boolean> {
  try {
    const link = generateShareLink(state);
    await navigator.clipboard.writeText(link);
    return true;
  } catch {
    return false;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

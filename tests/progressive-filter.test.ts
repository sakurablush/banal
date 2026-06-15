import { describe, it, expect } from 'vitest';
import {
  createInitialFilterState,
  getVisibleTags,
  getAvailableSubcategories,
  getCategoriesByDomain,
  applyProgressiveFilters,
  serializeFilterState,
  deserializeFilterState,
  applyFilterPreset,
} from '../src/lib/progressive-filter';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import type { ToolCategory } from '../src/types/tool';

describe('Progressive Filter', () => {
  describe('createInitialFilterState', () => {
    it('should create empty filter state', () => {
      const state = createInitialFilterState();
      
      expect(state.category).toBeNull();
      expect(state.subcategory).toBeNull();
      expect(state.tags).toEqual([]);
      expect(state.searchQuery).toBe('');
      expect(state.platforms).toEqual([]);
      expect(state.sortBy).toBe('relevance');
    });
  });

  describe('getVisibleTags', () => {
    it('should return all tags when no filters active', () => {
      const state = createInitialFilterState();
      const tags = getVisibleTags(state);
      
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should filter out contradicting tags', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['no-signup'],
      };
      const tags = getVisibleTags(state);
      
      expect(tags.find(t => t.id === 'free-signup')).toBeUndefined();
    });

    it('should filter tags by category', () => {
      const state = {
        ...createInitialFilterState(),
        category: 'ai-coding' as ToolCategory,
      };
      const tags = getVisibleTags(state);
      
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should sort active tags first', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['browser'],
      };
      const tags = getVisibleTags(state);
      
      const browserIndex = tags.findIndex(t => t.id === 'browser');
      expect(browserIndex).toBe(0);
    });
  });

  describe('getAvailableSubcategories', () => {
    it('should return empty array for null category', () => {
      const subs = getAvailableSubcategories(null);
      expect(subs).toEqual([]);
    });

    it('should return subcategories for category with subcategories', () => {
      const subs = getAvailableSubcategories('ai-coding');
      expect(subs.length).toBeGreaterThan(0);
    });

    it('should return empty array for category without subcategories', () => {
      const subs = getAvailableSubcategories('ai-image');
      expect(subs).toEqual([]);
    });
  });

  describe('getCategoriesByDomain', () => {
    it('should return grouped categories', () => {
      const grouped = getCategoriesByDomain();
      
      expect(grouped.length).toBeGreaterThan(0);
      expect(grouped[0].domain).toBeTruthy();
      expect(grouped[0].domainLabel).toBeTruthy();
      expect(grouped[0].domainIcon).toBeTruthy();
      expect(grouped[0].categories.length).toBeGreaterThan(0);
    });

    it('should include all domains', () => {
      const grouped = getCategoriesByDomain();
      const domains = grouped.map(g => g.domain);
      
      expect(domains).toContain('ai');
      expect(domains).toContain('dev');
    });
  });

  describe('applyProgressiveFilters', () => {
    it('should return all tools when no filters active', () => {
      const state = createInitialFilterState();
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      expect(filtered.length).toBe(zeroKeyTools.length);
    });

    it('should filter by category', () => {
      const state = {
        ...createInitialFilterState(),
        category: 'ai-chat' as ToolCategory,
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      expect(filtered.every(t => t.category === 'ai-chat')).toBe(true);
    });

    it('should filter by tags', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['no-signup'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      expect(filtered.every(t => t.requiresSignup === false)).toBe(true);
    });

    it('should filter by multiple tags', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['no-signup', 'browser'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      expect(filtered.every(t => 
        t.requiresSignup === false && t.surface === 'web'
      )).toBe(true);
    });

    it('should filter by platform', () => {
      const state = {
        ...createInitialFilterState(),
        platforms: ['web'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      expect(filtered.every(t => t.surface === 'web')).toBe(true);
    });

    it('should sort by name', () => {
      const state = {
        ...createInitialFilterState(),
        sortBy: 'name' as const,
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i].name.localeCompare(filtered[i-1].name)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should sort by newest', () => {
      const state = {
        ...createInitialFilterState(),
        sortBy: 'newest' as const,
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should combine category and tag filters', () => {
      const state = {
        ...createInitialFilterState(),
        category: 'ai-chat' as ToolCategory,
        tags: ['no-signup'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      
      expect(filtered.every(t => 
        t.category === 'ai-chat' && t.requiresSignup === false
      )).toBe(true);
    });

    it('should filter by platform tags', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['browser'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.surface === 'web')).toBe(true);
    });

    it('should filter by CLI tag', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['cli'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.surface === 'cli')).toBe(true);
    });

    it('should filter by API tag', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['api'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.surface === 'api')).toBe(true);
    });

    it('should filter by open-source tag', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['open-source'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.access === 'open-source')).toBe(true);
    });

    it('should filter by self-hosted tag', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['self-hosted'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.access === 'self-host' || t.access === 'open-source')).toBe(true);
    });

    it('should filter by free-forever tag', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['free-forever'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.access === 'no-login' || t.access === 'open-source')).toBe(true);
    });

    it('should filter by free-tier tag', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['free-tier'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.access === 'free-tier' || t.access === 'free-key')).toBe(true);
    });

    it('should filter by verified tag', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['verified'],
      };
      const filtered = applyProgressiveFilters(zeroKeyTools, state);
      expect(filtered.every(t => t.lastVerified !== undefined)).toBe(true);
    });
  });

  describe('serializeFilterState', () => {
    it('should serialize empty state to empty string', () => {
      const state = createInitialFilterState();
      const serialized = serializeFilterState(state);
      
      expect(serialized).toBe('');
    });

    it('should serialize category', () => {
      const state = {
        ...createInitialFilterState(),
        category: 'ai-chat' as ToolCategory,
      };
      const serialized = serializeFilterState(state);
      
      expect(serialized).toContain('cat=ai-chat');
    });

    it('should serialize tags', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['no-signup', 'browser'],
      };
      const serialized = serializeFilterState(state);
      
      expect(serialized).toContain('tags=no-signup');
      expect(serialized).toContain('browser');
    });

    it('should serialize search query', () => {
      const state = {
        ...createInitialFilterState(),
        searchQuery: 'test',
      };
      const serialized = serializeFilterState(state);
      
      expect(serialized).toContain('q=test');
    });

    it('should serialize sortBy when not default', () => {
      const state = {
        ...createInitialFilterState(),
        sortBy: 'name' as const,
      };
      const serialized = serializeFilterState(state);
      
      expect(serialized).toContain('sort=name');
    });

    it('should not serialize sortBy when default', () => {
      const state = {
        ...createInitialFilterState(),
        sortBy: 'relevance' as const,
      };
      const serialized = serializeFilterState(state);
      
      expect(serialized).not.toContain('sort=');
    });
  });

  describe('deserializeFilterState', () => {
    it('should deserialize empty params', () => {
      const params = new URLSearchParams('');
      const state = deserializeFilterState(params);
      
      expect(state.category).toBeUndefined();
      expect(state.tags).toBeUndefined();
    });

    it('should deserialize category', () => {
      const params = new URLSearchParams('cat=ai-chat');
      const state = deserializeFilterState(params);
      
      expect(state.category).toBe('ai-chat');
    });

    it('should deserialize tags', () => {
      const params = new URLSearchParams('tags=no-signup,browser');
      const state = deserializeFilterState(params);
      
      expect(state.tags).toEqual(['no-signup', 'browser']);
    });

    it('should deserialize search query', () => {
      const params = new URLSearchParams('q=test');
      const state = deserializeFilterState(params);
      
      expect(state.searchQuery).toBe('test');
    });

    it('should deserialize sortBy', () => {
      const params = new URLSearchParams('sort=name');
      const state = deserializeFilterState(params);
      
      expect(state.sortBy).toBe('name');
    });

    it('should round-trip serialize/deserialize', () => {
      const original = {
        ...createInitialFilterState(),
        category: 'ai-chat' as ToolCategory,
        tags: ['no-signup', 'browser'],
        searchQuery: 'test',
        sortBy: 'name' as const,
      };
      
      const serialized = serializeFilterState(original);
      const params = new URLSearchParams(serialized);
      const restored = deserializeFilterState(params);
      
      expect(restored.category).toBe(original.category);
      expect(restored.tags).toEqual(original.tags);
      expect(restored.searchQuery).toBe(original.searchQuery);
      expect(restored.sortBy).toBe(original.sortBy);
    });
  });

  describe('applyFilterPreset', () => {
    it('should apply preset to state', () => {
      const state = createInitialFilterState();
      const preset = {
        id: 'test',
        name: 'Test',
        description: 'Test preset',
        filters: {
          category: 'ai-chat' as ToolCategory,
          tags: ['no-signup'],
        },
      };
      
      const newState = applyFilterPreset(state, preset);
      
      expect(newState.category).toBe('ai-chat');
      expect(newState.tags).toContain('no-signup');
    });

    it('should merge tags with existing', () => {
      const state = {
        ...createInitialFilterState(),
        tags: ['browser'],
      };
      const preset = {
        id: 'test',
        name: 'Test',
        description: 'Test preset',
        filters: {
          tags: ['no-signup'],
        },
      };
      
      const newState = applyFilterPreset(state, preset);
      
      expect(newState.tags).toContain('browser');
      expect(newState.tags).toContain('no-signup');
    });
  });
});

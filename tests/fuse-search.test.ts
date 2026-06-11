import { describe, expect, it } from 'vitest';
import { searchTools } from '../src/fuse-search';
import { zeroKeyTools } from '../src/data/zero-key-tools';

describe('fuse-search', () => {
  describe('searchTools', () => {
    it('returns all tools with limit when query is empty', () => {
      const results = searchTools(zeroKeyTools, '', 10);
      expect(results).toHaveLength(10);
      expect(results[0].score).toBe(0);
      expect(results[0].matches).toEqual({});
    });

    it('returns all tools with limit when query is whitespace only', () => {
      const results = searchTools(zeroKeyTools, '   ', 5);
      expect(results).toHaveLength(5);
      expect(results[0].score).toBe(0);
    });

    it('returns all tools when limit exceeds tool count', () => {
      const smallToolSet = zeroKeyTools.slice(0, 3);
      const results = searchTools(smallToolSet, '', 10);
      expect(results).toHaveLength(3);
    });

    it('finds tools by name', () => {
      const results = searchTools(zeroKeyTools, 'supabase');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tool.name.toLowerCase()).toContain('supabase');
      expect(results[0].matches.name).toBe(true);
    });

    it('finds tools by category', () => {
      const results = searchTools(zeroKeyTools, 'database');
      expect(results.length).toBeGreaterThan(0);
      const hasDbCategory = results.some((r) => r.tool.category === 'dev-backend');
      expect(hasDbCategory).toBe(true);
    });

    it('finds tools by badges', () => {
      const results = searchTools(zeroKeyTools, 'open-source');
      expect(results.length).toBeGreaterThan(0);
      const hasBadgeMatch = results.some((r) => r.matches.badges);
      expect(hasBadgeMatch).toBe(true);
    });

    it('finds tools by bestFor description', () => {
      const results = searchTools(zeroKeyTools, 'hosting');
      expect(results.length).toBeGreaterThan(0);
      const hasBestForMatch = results.some((r) => r.matches.bestFor);
      expect(hasBestForMatch).toBe(true);
    });

    it('finds tools by URL', () => {
      const results = searchTools(zeroKeyTools, 'github.com');
      expect(results.length).toBeGreaterThan(0);
      const hasUrlMatch = results.some((r) => r.matches.url);
      expect(hasUrlMatch).toBe(true);
    });

    it('returns empty array when no tools match', () => {
      const results = searchTools(zeroKeyTools, 'xyznonexistent123');
      expect(results).toHaveLength(0);
    });

    it('sorts results by score (highest first)', () => {
      const results = searchTools(zeroKeyTools, 'ai');
      expect(results.length).toBeGreaterThan(1);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('boosts score for exact word match', () => {
      // Create a tool with exact word match
      const tools = [
        {
          id: 'test-1',
          name: 'test tool',
          url: 'https://example.com',
          surface: 'web' as const,
          category: 'ai-chat' as const,
          access: 'free-tier' as const,
          badges: ['test'],
          bestFor: 'testing purposes',
          qualityNote: 'test note',
          caveat: undefined,
        },
        {
          id: 'test-2',
          name: 'another tool',
          url: 'https://example.com',
          surface: 'web' as const,
          category: 'ai-chat' as const,
          access: 'free-tier' as const,
          badges: ['other'],
          bestFor: 'test in description',
          qualityNote: 'test note',
          caveat: undefined,
        },
      ];

      const results = searchTools(tools, 'test');
      expect(results.length).toBe(2);
      // First tool should have higher score due to exact word match in name
      expect(results[0].score).toBeGreaterThan(results[1].score);
    });

    it('respects custom limit parameter', () => {
      const results = searchTools(zeroKeyTools, 'ai', 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('is case insensitive', () => {
      const lowerResults = searchTools(zeroKeyTools, 'supabase');
      const upperResults = searchTools(zeroKeyTools, 'SUPABASE');
      const mixedResults = searchTools(zeroKeyTools, 'SuPaBaSe');

      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.length).toBe(mixedResults.length);
    });

    it('trims whitespace from query', () => {
      const trimmedResults = searchTools(zeroKeyTools, '  supabase  ');
      const normalResults = searchTools(zeroKeyTools, 'supabase');

      expect(trimmedResults.length).toBe(normalResults.length);
    });
  });
});

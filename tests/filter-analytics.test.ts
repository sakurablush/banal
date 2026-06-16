import { describe, it, expect, beforeEach } from 'vitest';
import {
  trackFilterEvent,
  getFilterAnalytics,
  getMostUsedFilters,
  getFilterUsageStats,
  clearFilterAnalytics,
  exportFilterAnalytics,
} from '../src/lib/filter-analytics';

describe('Filter Analytics', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('trackFilterEvent', () => {
    it('should track a filter event', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
        resultCount: 10,
      });

      const analytics = getFilterAnalytics();
      expect(analytics).toHaveLength(1);
      expect(analytics[0].action).toBe('apply');
      expect(analytics[0].filterType).toBe('category');
      expect(analytics[0].filterValue).toBe('ai-coding');
      expect(analytics[0].resultCount).toBe(10);
      expect(analytics[0].timestamp).toBeGreaterThan(0);
    });

    it('should track multiple events', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });
      trackFilterEvent({
        action: 'apply',
        filterType: 'tag',
        filterValue: 'free',
      });

      const analytics = getFilterAnalytics();
      expect(analytics).toHaveLength(2);
    });

    it('should limit to MAX_EVENTS', () => {
      // Track 1001 events (MAX_EVENTS is 1000)
      for (let i = 0; i < 1001; i++) {
        trackFilterEvent({
          action: 'apply',
          filterType: 'category',
          filterValue: `category-${i}`,
        });
      }

      const analytics = getFilterAnalytics();
      expect(analytics).toHaveLength(1000);
      // First event should be removed
      expect(analytics[0].filterValue).toBe('category-1');
    });
  });

  describe('getFilterAnalytics', () => {
    it('should return empty array when no analytics', () => {
      const analytics = getFilterAnalytics();
      expect(analytics).toEqual([]);
    });

    it('should return all tracked events', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });
      trackFilterEvent({
        action: 'remove',
        filterType: 'tag',
        filterValue: 'free',
      });

      const analytics = getFilterAnalytics();
      expect(analytics).toHaveLength(2);
    });
  });

  describe('getMostUsedFilters', () => {
    it('should return empty array when no analytics', () => {
      const mostUsed = getMostUsedFilters();
      expect(mostUsed).toEqual([]);
    });

    it('should return most used filters sorted by count', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });
      trackFilterEvent({
        action: 'apply',
        filterType: 'tag',
        filterValue: 'free',
      });

      const mostUsed = getMostUsedFilters();
      expect(mostUsed).toHaveLength(2);
      expect(mostUsed[0].filter).toBe('category:ai-coding');
      expect(mostUsed[0].count).toBe(2);
      expect(mostUsed[1].filter).toBe('tag:free');
      expect(mostUsed[1].count).toBe(1);
    });

    it('should respect limit parameter', () => {
      for (let i = 0; i < 20; i++) {
        trackFilterEvent({
          action: 'apply',
          filterType: 'category',
          filterValue: `category-${i}`,
        });
      }

      const mostUsed = getMostUsedFilters(5);
      expect(mostUsed).toHaveLength(5);
    });

    it('should only count apply actions', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });
      trackFilterEvent({
        action: 'remove',
        filterType: 'category',
        filterValue: 'ai-coding',
      });

      const mostUsed = getMostUsedFilters();
      expect(mostUsed).toHaveLength(1);
      expect(mostUsed[0].count).toBe(1);
    });
  });

  describe('getFilterUsageStats', () => {
    it('should return empty stats when no analytics', () => {
      const stats = getFilterUsageStats();
      expect(stats.totalEvents).toBe(0);
      expect(stats.uniqueFilters).toBe(0);
      expect(stats.avgFiltersPerSession).toBe(0);
      expect(stats.topCategories).toEqual([]);
      expect(stats.topTags).toEqual([]);
    });

    it('should calculate correct stats', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-image',
      });
      trackFilterEvent({
        action: 'apply',
        filterType: 'tag',
        filterValue: 'free',
      });
      trackFilterEvent({
        action: 'apply',
        filterType: 'tag',
        filterValue: 'open-source',
      });

      const stats = getFilterUsageStats();
      expect(stats.totalEvents).toBe(4);
      expect(stats.uniqueFilters).toBe(4); // 2 categories + 2 tags
      expect(stats.topCategories).toHaveLength(2);
      expect(stats.topTags).toHaveLength(2);
    });
  });

  describe('clearFilterAnalytics', () => {
    it('should clear all analytics', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });

      clearFilterAnalytics();

      const analytics = getFilterAnalytics();
      expect(analytics).toEqual([]);
    });
  });

  describe('exportFilterAnalytics', () => {
    it('should export analytics as JSON', () => {
      trackFilterEvent({
        action: 'apply',
        filterType: 'category',
        filterValue: 'ai-coding',
      });

      const json = exportFilterAnalytics();
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].filterValue).toBe('ai-coding');
    });

    it('should export empty array when no analytics', () => {
      const json = exportFilterAnalytics();
      const parsed = JSON.parse(json);
      expect(parsed).toEqual([]);
    });
  });
});

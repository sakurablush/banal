/**
 * Filter Analytics - Track filter usage to understand user behavior
 * Stores analytics in localStorage and provides insights
 */

import { validateFilterEvents } from './storage-schema';

export interface FilterEvent {
  timestamp: number;
  action: 'apply' | 'remove' | 'clear';
  filterType: 'category' | 'tag' | 'search' | 'preset';
  filterValue: string;
  resultCount?: number;
}

const ANALYTICS_KEY = 'banal_filter_analytics';
const MAX_EVENTS = 1000;

/**
 * Track a filter event
 */
export function trackFilterEvent(event: Omit<FilterEvent, 'timestamp'>): void {
  try {
    const analytics = getFilterAnalytics();
    const newEvent: FilterEvent = {
      ...event,
      timestamp: Date.now(),
    };

    analytics.push(newEvent);

    // Keep only last MAX_EVENTS
    if (analytics.length > MAX_EVENTS) {
      analytics.splice(0, analytics.length - MAX_EVENTS);
    }

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.warn('Failed to track filter event:', error);
  }
}

/**
 * Get all filter analytics
 */
export function getFilterAnalytics(): FilterEvent[] {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    if (!data) return [];
    return validateFilterEvents(JSON.parse(data)) as FilterEvent[];
  } catch (error) {
    console.warn('Failed to get filter analytics:', error);
    return [];
  }
}

/**
 * Get most used filters
 */
export function getMostUsedFilters(limit: number = 10): Array<{ filter: string; count: number }> {
  const analytics = getFilterAnalytics();
  const filterCounts = new Map<string, number>();

  analytics
    .filter(event => event.action === 'apply')
    .forEach(event => {
      const key = `${event.filterType}:${event.filterValue}`;
      filterCounts.set(key, (filterCounts.get(key) || 0) + 1);
    });

  return Array.from(filterCounts.entries())
    .map(([filter, count]) => ({ filter, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get filter usage statistics
 */
export function getFilterUsageStats(): {
  totalEvents: number;
  uniqueFilters: number;
  avgFiltersPerSession: number;
  topCategories: string[];
  topTags: string[];
} {
  const analytics = getFilterAnalytics();
  const applyEvents = analytics.filter(e => e.action === 'apply');

  const categories = new Set<string>();
  const tags = new Set<string>();

  applyEvents.forEach(event => {
    if (event.filterType === 'category') {
      categories.add(event.filterValue);
    } else if (event.filterType === 'tag') {
      tags.add(event.filterValue);
    }
  });

  // Calculate average filters per session (simplified - assume session = 1 hour)
  const sessions = new Map<number, number>();
  applyEvents.forEach(event => {
    const sessionKey = Math.floor(event.timestamp / (60 * 60 * 1000)); // 1 hour
    sessions.set(sessionKey, (sessions.get(sessionKey) || 0) + 1);
  });

  const avgFiltersPerSession = sessions.size > 0
    ? Array.from(sessions.values()).reduce((a, b) => a + b, 0) / sessions.size
    : 0;

  return {
    totalEvents: analytics.length,
    uniqueFilters: categories.size + tags.size,
    avgFiltersPerSession: Math.round(avgFiltersPerSession * 100) / 100,
    topCategories: Array.from(categories).slice(0, 5),
    topTags: Array.from(tags).slice(0, 5),
  };
}

/**
 * Clear all filter analytics
 */
export function clearFilterAnalytics(): void {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch (error) {
    console.warn('Failed to clear filter analytics:', error);
  }
}

/**
 * Export filter analytics as JSON
 */
export function exportFilterAnalytics(): string {
  const analytics = getFilterAnalytics();
  return JSON.stringify(analytics, null, 2);
}

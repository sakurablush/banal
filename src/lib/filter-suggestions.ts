/**
 * Local filter suggestions from anonymous usage analytics.
 */

import { getMostUsedFilters } from './filter-analytics';
import type { SectionFilterId } from './section-filter-url';

export interface FilterSuggestion {
  label: string;
  values: Record<string, string>;
  analyticsKey: string;
}

/** Parse analytics key "type:value" into section filter values. */
export function analyticsKeyToValues(
  section: SectionFilterId,
  analyticsKey: string
): Record<string, string> | null {
  const [type, ...rest] = analyticsKey.split(':');
  const value = rest.join(':');
  if (!value) return null;

  switch (section) {
    case 'models':
      if (type === 'tag' && value.startsWith('useCase:')) {
        return { useCase: value.slice('useCase:'.length) };
      }
      if (type === 'tag' && value.startsWith('license:')) {
        return { license: value.slice('license:'.length) };
      }
      if (type === 'category' && value.startsWith('family:')) {
        return { family: value.slice('family:'.length) };
      }
      if (type === 'search') return { q: value };
      return null;
    case 'stacks':
      if (type === 'category' && value.startsWith('audience:')) {
        return { audience: value.slice('audience:'.length) };
      }
      return null;
    case 'prompts':
      if (type === 'category' && value.startsWith('cat:')) {
        return { cat: value.slice('cat:'.length) };
      }
      return null;
    case 'ai-tools':
    case 'dev-tools':
      if (type === 'category') {
        const cat = value.startsWith('audience:') ? value.slice('audience:'.length) : value;
        return { cat };
      }
      if (type === 'tag' && value.startsWith('life:')) {
        return { life: value.slice('life:'.length) };
      }
      if (type === 'search') return { q: value };
      return null;
    default:
      return null;
  }
}

export function getRawSuggestionsForSection(
  section: SectionFilterId,
  limit = 8
): Array<{ analyticsKey: string; count: number; values: Record<string, string> }> {
  const mostUsed = getMostUsedFilters(limit * 2);
  const out: Array<{ analyticsKey: string; count: number; values: Record<string, string> }> = [];

  for (const { filter, count } of mostUsed) {
    const values = analyticsKeyToValues(section, filter);
    if (!values) continue;
    const dup = out.some(
      (o) => JSON.stringify(o.values) === JSON.stringify(values)
    );
    if (dup) continue;
    out.push({ analyticsKey: filter, count, values });
    if (out.length >= limit) break;
  }
  return out;
}

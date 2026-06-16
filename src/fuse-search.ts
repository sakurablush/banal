/**
 * Lightweight fuzzy search for zero-key tools.
 * No deps, no magic numbers, fast enough to fire on every keystroke.
 */

import type { ZeroKeyTool } from './data/zero-key-tools';

export interface SearchResult {
  tool: ZeroKeyTool;
  score: number;
  matches: {
    name?: boolean;
    category?: boolean;
    badges?: boolean;
    bestFor?: boolean;
    url?: boolean;
  };
}

const FIELD_ORDER = ['name', 'category', 'badges', 'bestFor', 'url'] as const;

export function searchTools(
  tools: readonly ZeroKeyTool[],
  query: string,
  limit = 120
): SearchResult[] {
  if (!query.trim()) {
    return tools.slice(0, limit).map((tool) => ({ tool, score: 0, matches: {} }));
  }

  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const tool of tools) {
    const { score, matches } = scoreTool(tool, q);
    if (score > 0) results.push({ tool, score, matches });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

function scoreTool(
  tool: ZeroKeyTool,
  q: string
): { score: number; matches: SearchResult['matches'] } {
  const haystack = buildHaystack(tool);
  const lower = haystack.toLowerCase();
  const matches: SearchResult['matches'] = {};

  if (!lower.includes(q)) return { score: 0, matches: {} };

  let score = 100;

  FIELD_ORDER.forEach((field: string) => {
    const text = fieldValue(tool, field).toLowerCase();
    if (text.includes(q)) {
      matches[field as keyof SearchResult['matches']] = true;
      if (field === 'name') score += 500;
      if (field === 'category') score += 300;
      if (field === 'badges') score += 200;
      if (field === 'bestFor') score += 100;
      if (field === 'url') score += 50;

      const words = text.split(/[\s\-_/]+/);
      if (words.some((w) => w === q)) score += 200;
    }
  });

  return { score, matches };
}

function fieldValue(tool: ZeroKeyTool, field: string): string {
  switch (field) {
    case 'name':
      return tool.name;
    case 'category':
      return tool.category;
    case 'badges':
      return tool.badges.join(' ');
    case 'bestFor':
      return tool.bestFor;
    case 'url':
      return tool.url;
    default:
      return '';
  }
}

function buildHaystack(tool: ZeroKeyTool): string {
  return [
    tool.name,
    tool.url,
    tool.surface,
    tool.category,
    tool.access,
    ...tool.badges,
    tool.bestFor,
    tool.qualityNote,
    tool.caveat ?? '',
  ].join(' ');
}

/**
 * Read-side validation for persisted JSON blobs in localStorage / sessionStorage.
 */

import type { SectionFilterId } from './section-filter-url';

const SECTION_IDS: SectionFilterId[] = [
  'models',
  'stacks',
  'prompts',
  'ai-tools',
  'dev-tools',
];

export interface SavedSectionFilter {
  id: string;
  name: string;
  section: SectionFilterId;
  values: Record<string, string>;
  createdAt: string;
}

export interface FilterEventRecord {
  timestamp: number;
  action: 'apply' | 'remove' | 'clear';
  filterType: 'category' | 'tag' | 'search' | 'preset';
  filterValue: string;
  resultCount?: number;
}

function isNonEmptyString(v: unknown, maxLen: number): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= maxLen;
}

function isPlainStringRecord(v: unknown): v is Record<string, string> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  return Object.entries(v).every(
    ([k, val]) => typeof k === 'string' && k.length <= 32 && typeof val === 'string' && val.length <= 200
  );
}

export function validateSavedSectionFilter(raw: unknown): SavedSectionFilter | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o.id, 64)) return null;
  if (!isNonEmptyString(o.name, 40)) return null;
  if (!isNonEmptyString(o.createdAt, 40)) return null;
  if (!SECTION_IDS.includes(o.section as SectionFilterId)) return null;
  if (!isPlainStringRecord(o.values)) return null;
  if (Object.keys(o.values).length === 0) return null;
  return {
    id: o.id.trim(),
    name: o.name.trim(),
    section: o.section as SectionFilterId,
    values: o.values,
    createdAt: o.createdAt,
  };
}

export function validateSavedSectionFilters(raw: unknown): SavedSectionFilter[] {
  if (!Array.isArray(raw)) return [];
  const out: SavedSectionFilter[] = [];
  for (const item of raw) {
    const valid = validateSavedSectionFilter(item);
    if (valid) out.push(valid);
  }
  return out;
}

export function validateFilterEvent(raw: unknown): FilterEventRecord | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.timestamp !== 'number' || !Number.isFinite(o.timestamp)) return null;
  if (!['apply', 'remove', 'clear'].includes(o.action as string)) return null;
  if (!['category', 'tag', 'search', 'preset'].includes(o.filterType as string)) return null;
  if (!isNonEmptyString(o.filterValue, 120)) return null;
  if (o.resultCount !== undefined && typeof o.resultCount !== 'number') return null;
  return {
    timestamp: o.timestamp,
    action: o.action as FilterEventRecord['action'],
    filterType: o.filterType as FilterEventRecord['filterType'],
    filterValue: o.filterValue,
    resultCount: o.resultCount as number | undefined,
  };
}

export function validateFilterEvents(raw: unknown): FilterEventRecord[] {
  if (!Array.isArray(raw)) return [];
  const out: FilterEventRecord[] = [];
  for (const item of raw) {
    const valid = validateFilterEvent(item);
    if (valid) out.push(valid);
  }
  return out;
}

/** Minimal CustomStack shape check (full tool stack fields validated loosely). */
export function validateCustomStack(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o.id, 80)) return false;
  if (!isNonEmptyString(o.name, 120)) return false;
  if (!Array.isArray(o.tools)) return false;
  if (!o.audience || typeof o.audience !== 'object') return false;
  if (!o.cost || typeof o.cost !== 'object') return false;
  return true;
}

export function validateCustomStacks(raw: unknown): unknown[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(validateCustomStack);
}

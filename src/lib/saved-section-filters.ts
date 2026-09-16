/**
 * Section-scoped saved filters in localStorage.
 */

import type { SectionFilterId } from './section-filter-url';
import {
  validateSavedSectionFilter,
  validateSavedSectionFilters,
  type SavedSectionFilter,
} from './storage-schema';
import { STORAGE_KEYS } from './storage-cleanup';

export type { SavedSectionFilter };

const MAX_PER_SECTION = 15;
const MAX_NAME_LEN = 40;

function readAll(): SavedSectionFilter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedFilters);
    if (!raw) return [];
    return validateSavedSectionFilters(JSON.parse(raw));
  } catch {
    return [];
  }
}

function writeAll(filters: SavedSectionFilter[]): void {
  localStorage.setItem(STORAGE_KEYS.savedFilters, JSON.stringify(filters));
}

function valuesKey(values: Record<string, string>): string {
  return JSON.stringify(
    Object.keys(values)
      .sort()
      .map((k) => [k, values[k]])
  );
}

function generateId(): string {
  return `sf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getSavedSectionFilters(section: SectionFilterId): SavedSectionFilter[] {
  return readAll()
    .filter((f) => f.section === section)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveSectionFilter(
  section: SectionFilterId,
  name: string,
  values: Record<string, string | null | undefined>
): SavedSectionFilter | null {
  const trimmedName = name.trim().slice(0, MAX_NAME_LEN);
  const cleanValues: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    if (v) cleanValues[k] = v;
  }
  if (!trimmedName || Object.keys(cleanValues).length === 0) return null;

  const candidate: SavedSectionFilter = {
    id: generateId(),
    name: trimmedName,
    section,
    values: cleanValues,
    createdAt: new Date().toISOString(),
  };
  if (!validateSavedSectionFilter(candidate)) return null;

  let all = readAll();
  const sectionFilters = all.filter((f) => f.section === section);
  const dupKey = valuesKey(cleanValues);
  if (sectionFilters.some((f) => valuesKey(f.values) === dupKey)) {
    return sectionFilters.find((f) => valuesKey(f.values) === dupKey) ?? null;
  }

  if (sectionFilters.length >= MAX_PER_SECTION) {
    const oldest = sectionFilters.sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
    all = all.filter((f) => f.id !== oldest.id);
  }

  all.push(candidate);
  writeAll(all);
  return candidate;
}

export function deleteSavedSectionFilter(id: string): void {
  writeAll(readAll().filter((f) => f.id !== id));
}

export function renameSavedSectionFilter(id: string, name: string): boolean {
  const trimmed = name.trim().slice(0, MAX_NAME_LEN);
  if (!trimmed) return false;
  const all = readAll();
  const item = all.find((f) => f.id === id);
  if (!item) return false;
  item.name = trimmed;
  writeAll(all);
  return true;
}

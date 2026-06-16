/**
 * Apply section-scoped filter values to panel state.
 */

import type { StackAudience } from '../types/tool';
import type { ZeroKeyCategory } from '../data/zero-key-tools';
import { aiModels, getModelFamilies } from '../data/ai-models';
import { getStackAudiences } from '../data/tool-stacks';

const MODEL_USE_CASES = new Set([
  'coding',
  'reasoning',
  'multilingual',
  'long-context',
  'general',
  'all-round',
  'consumer-hardware',
  'edge-deployment',
  'vision',
]);

export interface ModelsFilterState {
  query: string;
  familyFilter: string | null;
  useCaseFilter: string | null;
  licenseFilter: string | null;
}

export function applyModelsFilterValues(
  state: ModelsFilterState,
  values: Record<string, string>
): void {
  const families = new Set(getModelFamilies());
  const licenses = new Set(aiModels.map((m) => m.license.type));

  state.familyFilter = values.family && families.has(values.family) ? values.family : null;
  state.useCaseFilter =
    values.useCase && MODEL_USE_CASES.has(values.useCase) ? values.useCase : null;
  state.licenseFilter = values.license && licenses.has(values.license) ? values.license : null;
  state.query = values.q ? values.q.slice(0, 200) : '';
}

export function countModelsForValues(values: Record<string, string>): number {
  const s: ModelsFilterState = {
    query: '',
    familyFilter: null,
    useCaseFilter: null,
    licenseFilter: null,
  };
  applyModelsFilterValues(s, values);
  let models = [...aiModels];
  if (s.query.trim()) {
    const q = s.query.toLowerCase();
    models = models.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.family.toLowerCase().includes(q)
    );
  }
  if (s.familyFilter) models = models.filter((m) => m.family === s.familyFilter);
  if (s.useCaseFilter) models = models.filter((m) => m.bestFor.includes(s.useCaseFilter!));
  if (s.licenseFilter) models = models.filter((m) => m.license.type === s.licenseFilter);
  return models.length;
}

export interface StacksFilterState {
  audienceFilter: StackAudience | null;
}

export function applyStacksFilterValues(
  state: StacksFilterState,
  values: Record<string, string>
): void {
  const valid = new Set(getStackAudiences());
  state.audienceFilter =
    values.audience && valid.has(values.audience) ? (values.audience as StackAudience) : null;
}

export interface ZeroKeyFilterState {
  query: string;
  activeCategory: ZeroKeyCategory | null;
  lifeFilters: Set<string>;
}

export function applyZeroKeyFilterValues(
  state: ZeroKeyFilterState,
  values: Record<string, string>,
  validCategories: Set<string>,
  validLifeIds: Set<string>
): void {
  state.activeCategory =
    values.cat && validCategories.has(values.cat) ? (values.cat as ZeroKeyCategory) : null;
  state.query = values.q ? values.q.slice(0, 200) : '';
  state.lifeFilters.clear();
  if (values.life) {
    for (const id of values.life.split(',').filter(Boolean)) {
      if (validLifeIds.has(id)) state.lifeFilters.add(id);
    }
  }
}

export function applyPromptsFilterValues(
  state: { selectedCategory: string },
  values: Record<string, string>,
  validCategories: Set<string>
): void {
  state.selectedCategory = values.cat && validCategories.has(values.cat) ? values.cat : 'all';
}

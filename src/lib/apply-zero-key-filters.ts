/**
 * Apply URL / saved filter values to Zero-Key panel state.
 */

import type { ZeroKeyCategory } from '../data/zero-key-tools';

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

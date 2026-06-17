/**
 * Apply URL / saved filter values to tool stacks panel state.
 */

import type { StackAudience } from '../types/tool';
import { getStackAudiences } from '../data/tool-stacks';

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

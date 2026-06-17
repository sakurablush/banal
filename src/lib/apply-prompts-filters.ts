/**
 * Apply URL / saved filter values to prompt templates panel state.
 */

export function applyPromptsFilterValues(
  state: { selectedCategory: string },
  values: Record<string, string>,
  validCategories: Set<string>
): void {
  state.selectedCategory = values.cat && validCategories.has(values.cat) ? values.cat : 'all';
}

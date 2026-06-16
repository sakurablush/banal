import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSavedSectionFilters,
  saveSectionFilter,
  deleteSavedSectionFilter,
} from '../src/lib/saved-section-filters';
import { STORAGE_KEYS } from '../src/lib/storage-cleanup';

describe('saved-section-filters', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves section filters', () => {
    const saved = saveSectionFilter('models', 'My Llama', {
      family: 'Llama',
      useCase: 'coding',
    });
    expect(saved).toBeTruthy();

    const list = getSavedSectionFilters('models');
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('My Llama');
    expect(list[0].values.family).toBe('Llama');
  });

  it('does not duplicate identical value sets', () => {
    saveSectionFilter('stacks', 'A', { audience: 'developer' });
    const again = saveSectionFilter('stacks', 'B', { audience: 'developer' });
    expect(getSavedSectionFilters('stacks')).toHaveLength(1);
    expect(again?.name).toBe('A');
  });

  it('deletes a saved filter', () => {
    const saved = saveSectionFilter('prompts', 'Career', { cat: 'career-money' });
    deleteSavedSectionFilter(saved!.id);
    expect(getSavedSectionFilters('prompts')).toHaveLength(0);
  });

  it('rejects invalid saves', () => {
    expect(saveSectionFilter('models', '', { family: 'X' })).toBeNull();
    expect(saveSectionFilter('models', 'Ok', {})).toBeNull();
  });

  it('validates on read and drops corrupt entries', () => {
    localStorage.setItem(
      STORAGE_KEYS.savedFilters,
      JSON.stringify([{ id: 'x', name: 'bad', section: 'nope', values: {} }])
    );
    expect(getSavedSectionFilters('models')).toHaveLength(0);
  });

  it('caps at 15 saves per section', () => {
    for (let i = 0; i < 16; i++) {
      saveSectionFilter('models', `Filter ${i}`, { family: `F${i}` });
    }
    expect(getSavedSectionFilters('models')).toHaveLength(15);
  });
});

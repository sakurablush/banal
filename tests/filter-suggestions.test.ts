import { describe, it, expect } from 'vitest';
import { analyticsKeyToValues, getRawSuggestionsForSection } from '../src/lib/filter-suggestions';

describe('filter-suggestions', () => {
  it('maps models analytics keys to filter values', () => {
    expect(analyticsKeyToValues('models', 'tag:useCase:coding')).toEqual({
      useCase: 'coding',
    });
    expect(analyticsKeyToValues('models', 'search:llama')).toEqual({ q: 'llama' });
  });

  it('maps stacks audience keys', () => {
    expect(analyticsKeyToValues('stacks', 'category:audience:developer')).toEqual({
      audience: 'developer',
    });
  });

  it('maps zero-key category and life keys', () => {
    expect(analyticsKeyToValues('ai-tools', 'category:ai-chat')).toEqual({
      cat: 'ai-chat',
    });
    expect(analyticsKeyToValues('dev-tools', 'tag:life:privacy-first')).toEqual({
      life: 'privacy-first',
    });
  });

  it('maps prompts category keys', () => {
    expect(analyticsKeyToValues('prompts', 'category:cat:career-money')).toEqual({
      cat: 'career-money',
    });
  });

  it('returns empty suggestions when analytics storage is empty', () => {
    localStorage.removeItem('banal_filter_analytics');
    expect(getRawSuggestionsForSection('models', 3)).toEqual([]);
  });
});

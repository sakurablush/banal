import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildSectionShareUrl,
  getSectionParams,
  setSectionParams,
  SECTION_HASH,
} from '../src/lib/section-filter-url';

describe('section-filter-url', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.stubGlobal('location', new URL('http://localhost:5175/?ai_q=old&models_useCase=coding'));
  });

  afterEach(() => {
    vi.stubGlobal('location', originalLocation);
  });

  it('reads only params for the requested section', () => {
    expect(getSectionParams('models')).toEqual({ useCase: 'coding' });
    expect(getSectionParams('ai-tools')).toEqual({ q: 'old' });
    expect(getSectionParams('stacks')).toEqual({});
  });

  it('builds a section-scoped share URL with hash', () => {
    const url = buildSectionShareUrl('models', {
      family: 'Llama',
      useCase: 'multilingual',
      q: 'deepseek',
    });

    expect(url).toContain('models_family=Llama');
    expect(url).toContain('models_useCase=multilingual');
    expect(url).toContain('models_q=deepseek');
    expect(url).toContain(`#${SECTION_HASH.models}`);
    expect(url).toContain('ai_q=old');
  });

  it('replaces existing params for the same section only', () => {
    const url = new URL(window.location.href);
    setSectionParams(url, 'models', { useCase: 'reasoning' });

    expect(url.searchParams.get('models_useCase')).toBe('reasoning');
    expect(url.searchParams.get('ai_q')).toBe('old');
  });

  it('ignores legacy unprefixed params when hash targets another section', () => {
    vi.stubGlobal(
      'location',
      new URL('http://localhost:5175/?useCase=multilingual#prompt-templates')
    );

    expect(getSectionParams('models')).toEqual({});
    expect(getSectionParams('prompts')).toEqual({});
  });

  it('reads legacy unprefixed params when hash matches the section', () => {
    vi.stubGlobal('location', new URL('http://localhost:5175/?useCase=multilingual#ai-models'));

    expect(getSectionParams('models')).toEqual({ useCase: 'multilingual' });
    expect(getSectionParams('prompts')).toEqual({});
  });

  it('prefers prefixed params over legacy unprefixed params', () => {
    vi.stubGlobal(
      'location',
      new URL('http://localhost:5175/?useCase=multilingual&models_useCase=coding#ai-models')
    );

    expect(getSectionParams('models')).toEqual({ useCase: 'coding' });
  });

  it('ignores prototype pollution keys in prefixed params', () => {
    vi.stubGlobal(
      'location',
      new URL('http://localhost:5175/?models___proto__=evil&models_useCase=coding')
    );

    expect(getSectionParams('models')).toEqual({ useCase: 'coding' });
    expect(Object.prototype).not.toHaveProperty('evil');
  });
});

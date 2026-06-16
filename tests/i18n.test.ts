/**
 * Comprehensive tests for Banal i18n (EN source of truth + full manual JA).
 * 100% coverage target. Pure functions + DOM side-effects.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { translations, t, getCurrentLang, setLang, applyTranslations, initI18n } from '../src/i18n';
import { getSiteStats } from '../src/data/site-stats';

describe('i18n translations object', () => {
  it('has both supported languages', () => {
    expect(Object.keys(translations)).toEqual(['en', 'ja']);
  });

  it('english is complete source of truth (same keys as ja at top level)', () => {
    const enKeys = Object.keys(translations.en).sort();
    const jaKeys = Object.keys(translations.ja).sort();
    expect(jaKeys).toEqual(enKeys);
  });
});

describe('t() helper', () => {
  const stats = getSiteStats();

  it('returns english for valid key', () => {
    expect(t('en', 'hero.subtitle')).toContain(`${stats.total} tools`);
    expect(t('en', 'hero.subtitle')).toContain(`${stats.ai} AI`);
    expect(t('en', 'hero.subtitle')).not.toContain('$20');
  });

  it('returns japanese for valid key', () => {
    expect(t('ja', 'hero.subtitle')).toContain(`${stats.total}件`);
    expect(t('ja', 'hero.subtitle')).toContain(`AI ${stats.ai}`);
  });

  it('falls back to english when japanese key missing (future-proof)', () => {
    // temporarily delete to simulate
    const original = translations.ja['hero.subtitle'];
    // @ts-ignore - intentional mutation for fallback test
    delete (translations.ja as any)['hero.subtitle'];
    expect(t('ja', 'hero.subtitle')).toContain(`${stats.total} tools`);
    // restore
    (translations.ja as any)['hero.subtitle'] = original;
  });

  it('returns the key itself as last resort fallback', () => {
    expect(t('en', 'nonexistent.deep.key')).toBe('nonexistent.deep.key');
  });

  it('supports deeply nested keys', () => {
    expect(t('en', 'manifesto.values.0.title')).toBe('Stupidly simple');
    expect(t('ja', 'manifesto.values.2.desc')).toContain('GitHub Pages');
  });

  it('handles nested object structure (legacy traversal)', () => {
    // Temporarily add a nested structure to test legacy traversal
    const originalTest = (translations.en as any)['test'];
    (translations.en as any)['test'] = {
      nested: {
        deep: {
          key: 'Nested value',
        },
      },
    };

    expect(t('en', 'test.nested.deep.key')).toBe('Nested value');

    // Restore
    if (originalTest !== undefined) {
      (translations.en as any)['test'] = originalTest;
    } else {
      delete (translations.en as any)['test'];
    }
  });

  it('returns undefined for incomplete nested path', () => {
    // Test path that doesn't exist in nested structure
    expect(t('en', 'nonexistent.deep.path')).toBe('nonexistent.deep.path');
  });
});

describe('getCurrentLang / setLang (localStorage + navigator)', () => {
  beforeEach(() => {
    localStorage.clear();
    // reset navigator mock if needed
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    });
  });

  it('defaults to "en" with no storage and english browser', () => {
    expect(getCurrentLang()).toBe('en');
  });

  it('detects Japanese from navigator.language', () => {
    Object.defineProperty(navigator, 'language', { value: 'ja-JP', configurable: true });
    expect(getCurrentLang()).toBe('ja');
  });

  it('persists preference to localStorage', () => {
    setLang('ja');
    expect(localStorage.getItem('banal-lang')).toBe('ja');
    expect(getCurrentLang()).toBe('ja');
  });

  it('ignores invalid stored values and falls back gracefully', () => {
    localStorage.setItem('banal-lang', 'fr');
    expect(getCurrentLang()).toBe('en'); // because navigator is en in this beforeEach
  });

  it('respects explicit stored value over navigator', () => {
    localStorage.setItem('banal-lang', 'ja');
    expect(getCurrentLang()).toBe('ja');
  });
});

describe('applyTranslations (DOM)', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en';
    // Seed a minimal DOM with data-i18n elements
    document.body.innerHTML = `
      <div data-i18n="hero.subtitle"></div>
      <button id="lang-en" aria-pressed="false">EN</button>
      <button id="lang-ja" aria-pressed="false">JA</button>
      <span data-i18n="manifesto.values.0.title"></span>
    `;
  });

  it('updates textContent / innerHTML for all data-i18n elements', () => {
    applyTranslations('ja');

    const subtitle = document.querySelector('[data-i18n="hero.subtitle"]')!;
    const stats = getSiteStats();
    expect(subtitle.innerHTML).toContain(`${stats.total}件`);
    expect(subtitle.innerHTML).toContain(`AI ${stats.ai}`);

    const title = document.querySelector('[data-i18n="manifesto.values.0.title"]')!;
    expect(title.textContent).toBe('バカみたいにシンプル');
  });

  it('sets html lang attribute correctly', () => {
    applyTranslations('ja');
    expect(document.documentElement.lang).toBe('ja');

    applyTranslations('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('toggles active + aria-pressed states on lang buttons', () => {
    applyTranslations('ja');

    const enBtn = document.getElementById('lang-en')!;
    const jaBtn = document.getElementById('lang-ja')!;

    expect(enBtn.classList.contains('active')).toBe(false);
    expect(enBtn.getAttribute('aria-pressed')).toBe('false');
    expect(jaBtn.classList.contains('active')).toBe(true);
    expect(jaBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('updates placeholder for data-i18n-placeholder elements', () => {
    document.body.innerHTML += `
      <input data-i18n-placeholder="search.placeholder" />
    `;

    applyTranslations('ja');

    const input = document.querySelector('[data-i18n-placeholder]') as HTMLInputElement;
    expect(input.placeholder).toContain('件のツールを検索');
  });

  it('updates aria-label for data-i18n-aria-label elements', () => {
    document.body.innerHTML += `
      <button data-i18n-aria-label="nav.language">Language</button>
    `;

    applyTranslations('ja');

    const btn = document.querySelector('[data-i18n-aria-label]') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('言語');
  });

  it('updates meta description tag content', () => {
    document.head.innerHTML = `
      <meta name="description" content="Old description" />
    `;

    applyTranslations('ja');

    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    expect(metaDesc.content).toContain('273件');
  });
});

describe('initI18n (wires buttons + initial apply)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div data-i18n="hero.title"></div>
      <button id="lang-en"></button>
      <button id="lang-ja"></button>
    `;
  });

  it('applies the detected language on init', () => {
    initI18n();
    const el = document.querySelector('[data-i18n="hero.title"]')!;
    // default en in test env
    expect(el.innerHTML).toContain('The ghost in the machine');
  });

  it('clicking language button switches language and persists', () => {
    initI18n();

    const jaBtn = document.getElementById('lang-ja') as HTMLButtonElement;
    jaBtn.click();

    expect(localStorage.getItem('banal-lang')).toBe('ja');
    const el = document.querySelector('[data-i18n="hero.title"]')!;
    expect(el.innerHTML).toContain('機械の中の幽霊');
  });

  it('animates button on language switch (celebration)', () => {
    initI18n();

    const jaBtn = document.getElementById('lang-ja') as HTMLButtonElement;

    // Mock animate function
    const animateMock = vi.fn().mockReturnValue({ cancel: vi.fn() });
    jaBtn.animate = animateMock;

    jaBtn.click();

    // Verify animate was called with celebration keyframes
    expect(animateMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ transform: expect.stringContaining('scale') }),
      ]),
      expect.objectContaining({ duration: 220, easing: 'ease-out' })
    );
  });

  it('does not re-apply if already on that language (no-op click)', () => {
    localStorage.setItem('banal-lang', 'en');
    initI18n();

    const enBtn = document.getElementById('lang-en') as HTMLButtonElement;
    const before = document.querySelector('[data-i18n="hero.title"]')!.innerHTML;

    enBtn.click();

    const after = document.querySelector('[data-i18n="hero.title"]')!.innerHTML;
    expect(after).toBe(before);
  });

  // ─── Toggle button (lang-toggle) ───────────────────────────────────────────

  it('toggles language via single lang-toggle button (EN → JA)', () => {
    document.body.innerHTML = `
      <div data-i18n="hero.title"></div>
      <button id="lang-toggle">🌐</button>
    `;

    initI18n();

    const toggleBtn = document.getElementById('lang-toggle') as HTMLButtonElement;
    toggleBtn.click();

    expect(localStorage.getItem('banal-lang')).toBe('ja');
    const el = document.querySelector('[data-i18n="hero.title"]')!;
    expect(el.innerHTML).toContain('機械の中の幽霊');
  });

  it('toggles language back (JA → EN) on second click', () => {
    document.body.innerHTML = `
      <div data-i18n="hero.title"></div>
      <button id="lang-toggle">🌐</button>
    `;

    initI18n();

    const toggleBtn = document.getElementById('lang-toggle') as HTMLButtonElement;

    // First toggle: EN → JA
    toggleBtn.click();
    expect(localStorage.getItem('banal-lang')).toBe('ja');

    // Second toggle: JA → EN
    toggleBtn.click();
    expect(localStorage.getItem('banal-lang')).toBe('en');
  });

  it('animates toggle button on language switch', () => {
    document.body.innerHTML = `
      <div data-i18n="hero.title"></div>
      <button id="lang-toggle">🌐</button>
    `;

    initI18n();

    const toggleBtn = document.getElementById('lang-toggle') as HTMLButtonElement;
    const animateMock = vi.fn().mockReturnValue({ cancel: vi.fn() });
    toggleBtn.animate = animateMock;

    toggleBtn.click();

    expect(animateMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ transform: expect.stringContaining('scale') }),
      ]),
      expect.objectContaining({ duration: 220, easing: 'ease-out' })
    );
  });

  it('handles toggle button without animate function gracefully', () => {
    document.body.innerHTML = `
      <div data-i18n="hero.title"></div>
      <button id="lang-toggle">🌐</button>
    `;

    initI18n();

    const toggleBtn = document.getElementById('lang-toggle') as HTMLButtonElement;
    // Remove animate function
    (toggleBtn as any).animate = undefined;

    // Should not throw
    expect(() => toggleBtn.click()).not.toThrow();
    expect(localStorage.getItem('banal-lang')).toBe('ja');
  });
});

describe('filters and privacy i18n keys', () => {
  const filterKeys = [
    'filters.shareLink',
    'filters.save',
    'filters.savedMenu',
    'filters.oftenUsed',
    'footer.storedData',
    'privacy.title',
    'privacy.clearAll',
    'privacy.banner',
    'stacks.editor.titleNew',
    'stacks.customizeTitle',
    'privacy.close',
  ];

  for (const key of filterKeys) {
    it(`has EN and JA for ${key}`, () => {
      expect(t('en', key)).not.toBe(key);
      expect(t('ja', key)).not.toBe(key);
    });
  }
});

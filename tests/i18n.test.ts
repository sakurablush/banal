/**
 * Comprehensive tests for Banal i18n (EN source of truth + full manual JA).
 * 100% coverage target. Pure functions + DOM side-effects.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { translations, t, getCurrentLang, setLang, applyTranslations, initI18n } from '../src/i18n';

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
  it('returns english for valid key', () => {
    expect(t('en', 'hero.subtitle')).toBe('The Robinhood of AI.');
  });

  it('returns japanese for valid key', () => {
    expect(t('ja', 'hero.subtitle')).toBe('AI版ロビンフッド。');
  });

  it('falls back to english when japanese key missing (future-proof)', () => {
    // temporarily delete to simulate
    const original = translations.ja['hero.subtitle'];
    // @ts-ignore - intentional mutation for fallback test
    delete (translations.ja as any)['hero.subtitle'];
    expect(t('ja', 'hero.subtitle')).toBe('The Robinhood of AI.');
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
    expect(subtitle.innerHTML).toBe('AI版ロビンフッド。');

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

  it('does not re-apply if already on that language (no-op click)', () => {
    localStorage.setItem('banal-lang', 'en');
    initI18n();

    const enBtn = document.getElementById('lang-en') as HTMLButtonElement;
    const before = document.querySelector('[data-i18n="hero.title"]')!.innerHTML;

    enBtn.click();

    const after = document.querySelector('[data-i18n="hero.title"]')!.innerHTML;
    expect(after).toBe(before);
  });
});

import { describe, it, expect } from 'vitest';
import { applyTranslationContent, parseSafeTranslationHtml } from '../src/lib/safe-html';

describe('safe-html', () => {
  it('strips script tags from translation HTML', () => {
    const frag = parseSafeTranslationHtml(
      'Hello <script>alert(1)</script><a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>'
    );
    const container = document.createElement('div');
    container.append(...frag.childNodes);
    expect(container.textContent).toContain('Hello');
    expect(container.textContent).toContain('link');
    expect(container.innerHTML).not.toContain('<script');
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('https://example.com/');
  });

  it('blocks javascript: hrefs', () => {
    const frag = parseSafeTranslationHtml(
      '<a href="javascript:alert(1)" rel="noopener noreferrer">bad</a>'
    );
    const container = document.createElement('div');
    container.append(...frag.childNodes);
    const anchor = container.querySelector('a');
    expect(anchor?.hasAttribute('href')).toBe(false);
    expect(anchor?.textContent).toBe('bad');
  });

  it('preserves br tags', () => {
    const el = document.createElement('p');
    applyTranslationContent(el, 'Line one<br />Line two');
    expect(el.querySelectorAll('br').length).toBe(1);
    expect(el.textContent).toContain('Line one');
    expect(el.textContent).toContain('Line two');
  });

  it('uses textContent for plain strings', () => {
    const el = document.createElement('span');
    applyTranslationContent(el, 'Plain text only');
    expect(el.textContent).toBe('Plain text only');
    expect(el.children.length).toBe(0);
  });
});

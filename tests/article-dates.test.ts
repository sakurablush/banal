import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { applyTranslations, t } from '../src/i18n';

const ARTICLE_SLUGS = ['free-ai-coding-setup-2026', 'honest-truth-ai-coding-agents-2026'] as const;
const PUBLISHED_KEY = 'article.published.20260616';
const PUBLISHED_ISO = '2026-06-16';

describe('article published dates', () => {
  it('formats EN and JA published dates via i18n', () => {
    expect(t('en', PUBLISHED_KEY)).toBe('16 June 2026');
    expect(t('ja', PUBLISHED_KEY)).toBe('2026年6月16日');
  });

  it('updates published time text when language changes', () => {
    document.body.innerHTML = `
      <time class="article-published" datetime="${PUBLISHED_ISO}" data-i18n="${PUBLISHED_KEY}">
        16 June 2026
      </time>
    `;

    applyTranslations('ja');

    const time = document.querySelector('time.article-published') as HTMLTimeElement;
    expect(time.textContent).toBe('2026年6月16日');
    expect(time.getAttribute('datetime')).toBe(PUBLISHED_ISO);
  });

  it.each(ARTICLE_SLUGS)('%s includes semantic published time markup', (slug) => {
    const html = fs.readFileSync(
      path.resolve(__dirname, `../articles/${slug}/index.html`),
      'utf-8'
    );

    expect(html).toContain('class="article-published"');
    expect(html).toContain(`datetime="${PUBLISHED_ISO}"`);
    expect(html).toContain(`data-i18n="${PUBLISHED_KEY}"`);
  });

  it('index.html article cards show published date before read time', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    const matches =
      html.match(/class="article-meta-void"[\s\S]*?article\.published\.20260616/g) ?? [];

    expect(matches.length).toBe(2);
    expect(html).toMatch(
      /article-meta-void">\s*<time[\s\S]*?article\.published\.20260616[\s\S]*?<span aria-hidden="true">·<\/span>/
    );
  });
});

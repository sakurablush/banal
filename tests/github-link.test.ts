import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('GitHub report link regression tests', () => {
  it('index.html report link points to sakurablush/banal issues', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    // Find the "Report it on GitHub" link
    const reportLinkMatch =
      html.match(/Found outdated information\?\s*<a[^>]*href="([^"]+)"[^>]*>/) ||
      html.match(/href="([^"]*github\.com\/sakurablush\/banal\/issues\/new[^"]*)"/);

    expect(reportLinkMatch).toBeTruthy();

    const href = reportLinkMatch?.[1] || reportLinkMatch?.[0];
    const finalHref = href?.includes('href=') ? href.match(/href="([^"]+)"/)?.[1] || href : href;

    expect(finalHref).toContain('github.com/sakurablush/banal/issues/new');
    expect(finalHref).not.toContain('github.com"'); // Just the bare domain
  });

  it('GitHub report link has proper attributes for security and UX', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    // Verify target="_blank" and rel="noopener"
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener');
  });

  it('index.html footer and limitations link to GitHub Discussions', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    expect(html).toContain('https://github.com/sakurablush/banal/discussions');
    expect(html).toContain('data-i18n="footer.discuss"');
    expect(html).toContain('data-i18n="limitations.discussLink"');
  });

  it('header nav links About to the post-articles section anchor', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    expect(html).toContain('id="about"');
    expect(html).toContain('href="#about"');
    expect(html).toContain('data-i18n="nav.about"');
    expect(html).toMatch(/<!-- HONEST LIMITATIONS -->\s*<section id="about" class="page-section">/);

    const aboutNavLinks = html.match(/href="#about"[^>]*data-i18n="nav\.about"/g) ?? [];
    expect(aboutNavLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('logo links to the site root, not the GitHub Pages user root', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    expect(html).not.toMatch(/>\s*BANAL\s*<\/a>\s*\n[^]*href="\/"/);
    expect(html).toMatch(
      /<a\s+href="\.\/"\s+class="font-black text-lg[^"]*"[^>]*>\s*BANAL\s*<\/a>/
    );
  });

  describe('index.html script loading', () => {
    it('does not hand-roll modulepreload for TypeScript sources', () => {
      const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

      // Vite rewrites manual modulepreload to dist/*.ts; GitHub Pages serves .ts as video/mp2t.
      expect(html).not.toMatch(/rel=["']modulepreload["'][^>]*\.ts["']/);
    });
  });
});

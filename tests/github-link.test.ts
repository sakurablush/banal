import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('GitHub report link regression tests', () => {
  it('index.html report link points to sakurablush/banal issues', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    // Find the "Report it on GitHub" link
    const reportLinkMatch = html.match(
      /Found outdated information\?\s*<a[^>]*href="([^"]+)"[^>]*>/
    ) || html.match(/href="([^"]*github\.com\/sakurablush\/banal\/issues\/new[^"]*)"/);

    expect(reportLinkMatch).toBeTruthy();

    const href = reportLinkMatch?.[1] || reportLinkMatch?.[0];
    const finalHref = href?.includes('href=') 
      ? href.match(/href="([^"]+)"/)?.[1] || href
      : href;

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
});
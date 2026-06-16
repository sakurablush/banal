import { describe, it, expect } from 'vitest';
import {
  isSupportedLang,
  getDisplayName,
  truncateForPreview,
  escapeHtml,
  safeExternalHref,
  setSafeExternalHref,
} from '../src/utils';

describe('utils — isSupportedLang', () => {
  it('accepts en and ja', () => {
    expect(isSupportedLang('en')).toBe(true);
    expect(isSupportedLang('ja')).toBe(true);
  });
  it('rejects everything else', () => {
    expect(isSupportedLang('fr')).toBe(false);
    expect(isSupportedLang('')).toBe(false);
    expect(isSupportedLang('jp')).toBe(false);
    expect(isSupportedLang('EN')).toBe(false);
  });
});

describe('utils — getDisplayName', () => {
  it('returns native names', () => {
    expect(getDisplayName('en')).toBe('English');
    expect(getDisplayName('ja')).toBe('日本語');
  });
});

describe('utils — truncateForPreview', () => {
  it('returns input unchanged when short', () => {
    const s = 'short message';
    expect(truncateForPreview(s)).toBe(s);
    // with limit 5 on 13-char, it truncates (the old comment was wrong)
    const truncated = truncateForPreview(s, 5);
    expect(truncated).not.toBe(s);
    expect(truncated.endsWith('…')).toBe(true);
  });

  it('truncates long strings and adds ellipsis', () => {
    const long = 'a'.repeat(200);
    const result = truncateForPreview(long, 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result.endsWith('…')).toBe(true);
  });

  it('prefers cutting at word boundary when reasonable', () => {
    const text =
      'This is a reasonably long sentence that should cut nicely at the last space before the limit.';
    const result = truncateForPreview(text, 40);
    expect(result).toContain(' ');
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThan(45);
  });

  it('handles unicode and emoji without breaking', () => {
    const emojiText =
      'Hello 世界 🌍 this is a test with some unicode characters that go on and on and on';
    const result = truncateForPreview(emojiText, 30);
    expect(result).toMatch(/…$/);
  });
});

describe('utils — escapeHtml (security hardening for exports and HTML strings)', () => {
  it('escapes basic dangerous characters', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(escapeHtml('a & b "c" \'d\'')).toBe('a &amp; b &quot;c&quot; &#39;d&#39;');
    expect(escapeHtml('> < & " \'')).toBe('&gt; &lt; &amp; &quot; &#39;');
  });

  it('is safe for user/AI content in exported static HTML', () => {
    const malicious = 'User said: <img src=x onerror=alert(1)> & "quotes"';
    const safe = escapeHtml(malicious);
    expect(safe).not.toContain('<img');
    // "onerror" as plain text is harmless; what matters is that the attribute injection is neutralized
    expect(safe).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(safe).toContain('&amp;');
    expect(safe).toContain('&quot;');
  });

  it('handles empty and normal text', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml('normal text with no special chars')).toBe(
      'normal text with no special chars'
    );
  });
});

describe('utils — safeExternalHref', () => {
  it('allows http and https URLs', () => {
    expect(safeExternalHref('https://example.com/path')).toBe('https://example.com/path');
    expect(safeExternalHref('http://example.com')).toBe('http://example.com/');
  });

  it('rejects javascript and other schemes', () => {
    expect(safeExternalHref('javascript:alert(1)')).toBeNull();
    expect(safeExternalHref('data:text/html,hi')).toBeNull();
    expect(safeExternalHref('not a url')).toBeNull();
  });

  it('sets href only for safe URLs on anchors', () => {
    const anchor = document.createElement('a');
    setSafeExternalHref(anchor, 'https://github.com/sakurablush/banal');
    expect(anchor.href).toContain('github.com');

    setSafeExternalHref(anchor, 'javascript:alert(1)');
    expect(anchor.hasAttribute('href')).toBe(false);
  });
});
